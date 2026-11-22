/**
 * Finds which GeoNames cities have their own English Wikipedia article. The
 * city lists only show a city that has one, so a part of a town, a district
 * office ("Markaz-e Woluswali-ye Achin") or a misnamed place never shows up.
 *
 *   node scripts/fetchCityWiki.js <cities1000.txt> <admin1CodesASCII.txt>
 *
 * Uses Wikidata (https://query.wikidata.org, data CC0):
 *   - cities: every place with a population and an English Wikipedia article is
 *     fetched country by country. A GeoNames city gets the article of a place
 *     with the same name (its own name, ASCII name or another spelling GeoNames
 *     has) less than MAX_KM away. Wikidata's GeoNames ids (P1566) are not used
 *     for cities: many point at the wrong item, and São Paulo or Naples have none.
 *   - states / provinces: by their GeoNames id (P1566), so a group can be shown
 *     as "Eastern Province" instead of "Ash Sharqiyah".
 * Writes scripts/data/cityWiki.json:
 *   { "<geonameId>": ["<English Wikipedia title>", <number of Wikipedia languages>] }
 * Run it again only to refresh the file; scripts/buildCitySearch.js reads it.
 */
const fs = require("fs");
const path = require("path");
const { norm } = require("../component/utils/cityNormalize");

const [c1000, admin1File] = process.argv.slice(2);
if (!c1000 || !admin1File) {
  console.error("usage: node scripts/fetchCityWiki.js <cities1000.txt> <admin1CodesASCII.txt>");
  process.exit(1);
}

// Same rules as buildCitySearch.js: only places that are a city of their own.
const NOT_A_CITY = new Set(["PPLX", "PPLQ", "PPLH", "PPLW", "PPLCH", "PPLR", "PPLF", "STLMT"]);
const MIN_POP = 5000; // a bit lower than the build uses, so THIN_MIN_POP can be lowered
const MAX_KM = 20;
const OUT = path.join(__dirname, "data", "cityWiki.json");
const UA = "city-list-builder/1.0 (classifieds site city lists)";

// Each country's answer is kept here, so a run that stops half way can go on.
const CACHE = path.join(require("os").tmpdir(), "city-wiki-cache");

async function sparql(query, attempt = 1) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 90000);
  let wait = 5000 * attempt;
  try {
    const res = await fetch("https://query.wikidata.org/sparql", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/sparql-results+json", "User-Agent": UA },
      body: new URLSearchParams({ query }),
      signal: ctrl.signal,
    });
    if (res.status === 429) wait = (Number(res.headers.get("retry-after")) || 60) * 1000; // too many requests
    if (!res.ok) throw new Error(`Wikidata answered ${res.status}`);
    return (await res.json()).results.bindings;
  } catch (err) {
    if (attempt >= 8) throw err;
    await new Promise((r) => setTimeout(r, wait));
    return sparql(query, attempt + 1);
  } finally {
    clearTimeout(timer);
  }
}

// Runs fn over items, `n` at a time.
async function pool(items, n, fn) {
  let next = 0;
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (next < items.length) await fn(items[next++]);
    })
  );
}

// "Hyderabad, Sindh" -> "Hyderabad", "Riffa (city)" -> "Riffa".
const bare = (title) => title.replace(/\s*\([^)]*\)$/, "").replace(/,.*$/, "").trim();
const km = (aLat, aLon, bLat, bLon) => {
  const r = Math.PI / 180;
  const x = (bLon - aLon) * r * Math.cos(((aLat + bLat) / 2) * r);
  const y = (bLat - aLat) * r;
  return Math.sqrt(x * x + y * y) * 6371;
};

(async () => {
  // ---- GeoNames cities to look up --------------------------------------------
  const rows = [];
  const perCountry = new Map();
  for (const line of fs.readFileSync(c1000, "utf8").split("\n")) {
    if (!line) continue;
    const f = line.split("\t");
    perCountry.set(f[8], (perCountry.get(f[8]) || 0) + 1);
    const pop = Number(f[14]) || 0;
    if (NOT_A_CITY.has(f[7]) || (pop < MIN_POP && f[7] !== "PPLC")) continue;
    const main = new Set([norm(f[1]), norm(f[2])].filter(Boolean));
    const alt = new Set(f[3].split(",").map(norm).filter((k) => k && !main.has(k)));
    rows.push({ id: f[0], lat: Number(f[4]), lon: Number(f[5]), main, alt });
  }

  // ---- Wikidata places, country by country -------------------------------------
  // Places in a territory (Puerto Rico, Réunion) often only name the mother
  // country, so every country is fetched and matching is by distance alone.
  const countries = await sparql(
    "SELECT ?c ?iso WHERE { ?c wdt:P297 ?iso . FILTER NOT EXISTS { ?c wdt:P576 [] } }"
  );
  const size = (iso) => perCountry.get(iso) || 0;
  // Big countries first, so they do not all run at the end.
  const qids = [...new Map(countries.map((b) => [b.c.value.split("/").pop(), b.iso.value])).entries()].sort(
    (a, b) => size(b[1]) - size(a[1])
  );
  const grid = new Map(); // "lat|lon" (whole degrees) -> [{ key, title, sl, lat, lon }]
  let places = 0;
  let done = 0;
  fs.mkdirSync(CACHE, { recursive: true });
  // Wikidata allows about one minute of query time per minute: two at a time.
  await pool(qids, 2, async ([qid, iso]) => {
    // A big country has many village articles: only places of 3,000+ people
    // (the cities looked up have 5,000+), or the query times out.
    const minPop = size(iso) > 1000 ? 3000 : 0;
    const cached = path.join(CACHE, `${qid}-${minPop}.json`);
    let res;
    if (fs.existsSync(cached)) res = JSON.parse(fs.readFileSync(cached, "utf8"));
    else {
      res = await sparql(`
SELECT ?title ?sl ?c WHERE {
  ?item wdt:P17 wd:${qid} ; wdt:P1082 ?pop ; wdt:P625 ?c ; wikibase:sitelinks ?sl .
  FILTER(?pop >= ${minPop})
  ?a schema:about ?item ; schema:isPartOf <https://en.wikipedia.org/> ; schema:name ?title .
}`);
      fs.writeFileSync(cached, JSON.stringify(res));
    }
    for (const b of res) {
      const m = /Point\(([-\d.eE]+) ([-\d.eE]+)\)/.exec(b.c.value); // "Point(lon lat)"
      if (!m) continue;
      const p = { key: norm(bare(b.title.value)), title: b.title.value, sl: Number(b.sl.value), lat: Number(m[2]), lon: Number(m[1]) };
      if (!p.key) continue;
      const cell = `${Math.floor(p.lat)}|${Math.floor(p.lon)}`;
      if (!grid.has(cell)) grid.set(cell, []);
      grid.get(cell).push(p);
      places += 1;
    }
    done += 1;
    process.stdout.write(`\rcountries ${done} / ${qids.length}, places ${places}   `);
  });

  // ---- match ---------------------------------------------------------------------
  const out = {};
  for (const r of rows) {
    let best = null;
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        for (const p of grid.get(`${Math.floor(r.lat) + dy}|${Math.floor(r.lon) + dx}`) || []) {
          const rank = r.main.has(p.key) ? 0 : r.alt.has(p.key) ? 1 : -1;
          if (rank < 0) continue;
          const d = km(r.lat, r.lon, p.lat, p.lon);
          if (d > MAX_KM) continue;
          // Its own name beats another spelling; then the closer place, then the better known one.
          if (!best || rank < best.rank || (rank === best.rank && (d < best.d - 1 || (Math.abs(d - best.d) <= 1 && p.sl > best.p.sl)))) {
            best = { rank, d, p };
          }
        }
      }
    }
    if (best) out[r.id] = [best.p.title, best.p.sl];
  }
  const cities = Object.keys(out).length;

  // ---- states / provinces, by GeoNames id ----------------------------------------
  const adminIds = fs
    .readFileSync(admin1File, "utf8")
    .split("\n")
    .map((l) => (l.split("\t")[3] || "").trim())
    .filter(Boolean);
  for (let i = 0; i < adminIds.length; i += 400) {
    const res = await sparql(`
SELECT ?gn ?sl ?title WHERE {
  VALUES ?gn { ${adminIds.slice(i, i + 400).map((id) => `"${id}"`).join(" ")} }
  ?item wdt:P1566 ?gn ; wikibase:sitelinks ?sl .
  ?a schema:about ?item ; schema:isPartOf <https://en.wikipedia.org/> ; schema:name ?title .
}`);
    for (const b of res) {
      const id = b.gn.value;
      const sl = Number(b.sl.value);
      if (!out[id] || sl > out[id][1]) out[id] = [b.title.value, sl];
    }
  }

  const sorted = Object.fromEntries(Object.keys(out).sort((a, b) => a - b).map((k) => [k, out[k]]));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(sorted)}\n`);
  console.log(`\n${cities} of ${rows.length} cities and ${Object.keys(out).length - cities} states have an English Wikipedia article -> ${OUT}`);
})();
