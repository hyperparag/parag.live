/**
 * Builds the city lists and the data behind the city search box. Run it again
 * only when the lists should change.
 *
 *   node scripts/buildCitySearch.js <cities1000.txt> <admin1CodesASCII.txt>
 *
 * The two input files are free downloads from https://download.geonames.org/export/dump/
 * (cities1000.zip and admin1CodesASCII.txt). GeoNames data is CC BY 4.0.
 *
 * WHICH CITIES THE SITE LISTS
 *   1. The site's own curated list: public/country.json (United States, Canada,
 *      Europe, Australia and New Zealand, Latin America) and the Asia and Africa
 *      branches of public/countries.json. About 900 areas, e.g. 10 for Illinois.
 *      Names are kept exactly as the site has them ("Western Illinois", "Chambana").
 *      A few countries have a fuller list in scripts/extraAreas.js (Bangladesh:
 *      8 divisions, 64 districts; Australia and the UK: the big cities the
 *      original list misses).
 *   2. A country that list covers thinly (the original Asia and Africa lists are
 *      one entry per country, "Bahrain") is topped up with its biggest cities:
 *      at least MIN_LISTED, more if it has many 300k+ cities, at most MAX_LISTED.
 *      The capital replaces a "whole country" entry. A country whose own list
 *      already has MIN_LISTED or more (US, Canada, India, Bangladesh, ...) is not touched.
 *   Nothing else is listed. Any other city can still be opened with "Open any
 *   city", and the search box suggests the closest listed city for it.
 *
 * GeoNames is only used to find the coordinates of a listed area (so "closest
 * listed city" works) and to pick the capital / big cities of step 2.
 *
 * WHAT IT WRITES (public/world/)
 *   <CC>.json        listed cities of one country, [[group, [city, ...]], ...]
 *                    (group = state / province for the US and Canada, else the
 *                    country name). Read by component/countries/index.js.
 *   index.json       [{c, n, k}] country code, name, number of listed cities.
 *                    The names are read from the existing file and kept.
 *   geo/<CC>.json    listed cities that have coordinates, [[name, group, lat, lon], ...]
 *   s/<x>.json       listed cities of the whole world whose name starts with letter x,
 *                    most populated first, [[name, countryCode, group], ...]
 *   p/<x>.json       every GeoNames place of 1,000+ people, [[name, cc, lat, lon], ...].
 *                    Only used to answer "which listed city is closest to the place
 *                    you typed?".
 *
 * Running it twice gives the same files: nothing is read from its own output
 * except the country names in index.json.
 */
const fs = require("fs");
const path = require("path");
const { norm, shardKey } = require("../component/utils/cityNormalize");

const [c1000, admin1File] = process.argv.slice(2);
if (!c1000 || !admin1File) {
  console.error("usage: node scripts/buildCitySearch.js <cities1000.txt> <admin1CodesASCII.txt>");
  process.exit(1);
}

const PUBLIC = path.join(__dirname, "..", "public");
const WORLD = path.join(PUBLIC, "world");
const round2 = (n) => Math.round(Number(n) * 100) / 100;

// A country the site's own list covers thinly gets its biggest cities added until it
// lists max(MIN_LISTED, its 300k+ cities), at most MAX_LISTED. Needs 10k+ people
// (the capital always counts).
const MIN_LISTED = 10;
const MAX_LISTED = 20;
const TOPUP_BIG_POP = 300000;
const TOPUP_MIN_POP = 10000;
// Matching an area to GeoNames by another spelling or a typo needs this many people.
const LOOSE_MATCH_MIN_POP = 20000;
// GeoNames feature codes that are not a city of their own: PPLX part of a city,
// PPLQ abandoned, PPLH historical, PPLW destroyed, PPLCH historical capital,
// PPLR religious community, PPLF farm village, STLMT settlement.
const NOT_A_CITY = new Set(["PPLX", "PPLQ", "PPLH", "PPLW", "PPLCH", "PPLR", "PPLF", "STLMT"]);

// Names in the site's list that differ from the name in index.json.
const COUNTRY_ALIASES = {
  korea: "KR",
  macedonia: "MK",
  "czech republic": "CZ",
  macau: "MO",
  netherlands: "NL",
  "virgin islands": "VI",
};
// Areas whose name is not the name of a place.
// Regions named like a hamlet: use the coordinates of the main city of the region.
const AREA_ALIASES = { hk: "hong kong", wales: "cardiff", northland: "whangarei" };

// ---- read the site's own list ----------------------------------------------
const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const index = readJson(path.join(WORLD, "index.json"));
const countryName = new Map(index.map((c) => [c.c, c.n]));
const codeOf = new Map(index.map((c) => [norm(c.n), c.c]));
for (const [k, v] of Object.entries(COUNTRY_ALIASES)) codeOf.set(k, v);

const areas = []; // { cc, group, name }
const skipped = [];
const addArea = (cc, group, name) => areas.push({ cc, group, name });

const countryJson = readJson(path.join(PUBLIC, "country.json"));
for (const root of countryJson) {
  for (const child of root.children || []) {
    if (root.name === "United States" || root.name === "Canada") {
      const cc = root.name === "Canada" ? "CA" : "US";
      for (const city of child.children || []) addArea(cc, child.name, city.name);
      continue;
    }
    if (child.name === "Caribbean") {
      // Each entry is a whole country, not a city.
      for (const place of child.children || []) {
        const cc = codeOf.get(norm(place.name));
        if (cc) addArea(cc, countryName.get(cc), place.name);
        else skipped.push(`${child.name}/${place.name}`);
      }
      continue;
    }
    const cc = codeOf.get(norm(child.name));
    if (!cc) {
      skipped.push(`${root.name}/${child.name}`);
      continue;
    }
    for (const city of child.children || []) addArea(cc, countryName.get(cc), city.name);
  }
}

// Asia and Africa only exist in the flat countries.json (parentId links).
const idOf = (x) => (x && x.$oid) || x;
const flat = readJson(path.join(PUBLIC, "countries.json")).filter((n) => !n.isDelete);
const kidsOf = new Map();
for (const n of flat) {
  const p = idOf(n.parentId);
  if (!p) continue;
  if (!kidsOf.has(p)) kidsOf.set(p, []);
  kidsOf.get(p).push(n);
}
for (const root of flat.filter((n) => !n.parentId && (n.name === "Asia" || n.name === "Africa"))) {
  for (const country of kidsOf.get(idOf(root._id)) || []) {
    const cc = codeOf.get(norm(country.name));
    if (!cc) {
      skipped.push(`${root.name}/${country.name}`);
      continue;
    }
    for (const city of kidsOf.get(idOf(country._id)) || []) addArea(cc, countryName.get(cc), city.name);
  }
}

// Countries with a fuller list (scripts/extraAreas.js) replace the original one.
const extra = require("./extraAreas");
for (const [cc, groups] of Object.entries(extra.add || {})) {
  for (const [group, names] of Object.entries(groups)) for (const name of names) addArea(cc, group, name);
}
for (const [cc, groups] of Object.entries(extra.replace || {})) {
  const wanted = new Set(Object.values(groups).flat().map(norm));
  for (const a of areas) {
    if (a.cc === cc && !wanted.has(norm(a.name))) {
      console.warn(`warning: original area "${a.name}" (${cc}) is missing from scripts/extraAreas.js`);
    }
  }
  for (let i = areas.length - 1; i >= 0; i -= 1) if (areas[i].cc === cc) areas.splice(i, 1);
  for (const [group, names] of Object.entries(groups)) for (const name of names) addArea(cc, group, name);
}

// ---- GeoNames ----------------------------------------------------------------
const admin1 = new Map(); // "US.IL" -> [normalized name, normalized ascii name]
for (const line of fs.readFileSync(admin1File, "utf8").split("\n").filter(Boolean)) {
  const [code, name, ascii] = line.split("\t");
  admin1.set(code, [norm(name), norm(ascii)]);
}

const rows = fs
  .readFileSync(c1000, "utf8")
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    const f = line.split("\t");
    return {
      id: f[0],
      name: f[1],
      ascii: f[2],
      alt: f[3],
      lat: round2(f[4]),
      lon: round2(f[5]),
      fc: f[7],
      cc: f[8],
      admin1: f[10],
      pop: Number(f[14]) || 0,
    };
  });

// Per country: names a place is known by. "main" = its name and ASCII name,
// "alt" = every other spelling GeoNames has for it.
const byCountry = new Map();
const countryOf = (cc) => {
  if (!byCountry.has(cc)) byCountry.set(cc, { main: new Map(), alt: new Map(), rows: [], capital: null });
  return byCountry.get(cc);
};
const push = (map, key, row) => {
  if (!key) return;
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(row);
};
for (const r of rows) {
  const c = countryOf(r.cc);
  c.rows.push(r);
  push(c.main, norm(r.name), r);
  push(c.main, norm(r.ascii), r);
  for (const a of r.alt.split(",")) push(c.alt, norm(a), r);
  if (r.fc === "PPLC" && (!c.capital || r.pop > c.capital.pop)) c.capital = r;
}

const inState = (row, cc, group) => (admin1.get(`${cc}.${row.admin1}`) || []).includes(norm(group));
const byPop = (list) => list.slice().sort((a, b) => b.pop - a.pop)[0] || null;

// Edit distance, giving up as soon as it is certain to be more than `max`.
function distance(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i += 1) {
    const row = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j += 1) {
      const v = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      row[j] = v;
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return max + 1;
    prev = row;
  }
  return prev[b.length];
}

const stateScoped = (cc) => cc === "US" || cc === "CA";
const stats = { areas: 0, exact: 0, altName: 0, fuzzy: 0, country: 0, noCoords: 0 };

/** The GeoNames place behind one of the site's areas, or null. */
function findRow({ cc, group, name }) {
  const c = byCountry.get(cc);
  if (!c) return null;
  const key = norm(AREA_ALIASES[norm(name)] || name)
    .replace(/^ft /, "fort ")
    .replace(/^st /, "saint ")
    .replace(/^mt /, "mount ");
  if (!key) return null;
  const ok = (r) => !stateScoped(cc) || inState(r, cc, group);
  // Another spelling or a typo is only trusted for a real city: a village that
  // happens to have a similar name ("Madeira" / "Maceira") would give wrong coordinates.
  const bigEnough = (r) => ok(r) && r.pop >= LOOSE_MATCH_MIN_POP;
  let hit = byPop((c.main.get(key) || []).filter(ok));
  const viaAlt = byPop((c.alt.get(key) || []).filter(bigEnough));
  // "Newcastle" is a hamlet by its own name but a big city by another spelling
  // (Newcastle upon Tyne): take the city.
  if (hit && hit.pop < LOOSE_MATCH_MIN_POP && viaAlt && viaAlt.pop > hit.pop) hit = null;
  if (hit) {
    stats.exact += 1;
    return hit;
  }
  if (viaAlt) {
    stats.altName += 1;
    return viaAlt;
  }
  if (key.length >= 5) {
    const max = key.length >= 9 ? 2 : 1;
    let best = null;
    for (const [k, list] of c.main) {
      const d = distance(key, k, max);
      if (d > max) continue;
      const cand = byPop(list.filter(bigEnough));
      if (!cand) continue;
      if (!best || d < best.d || (d === best.d && cand.pop > best.row.pop)) best = { d, row: cand };
    }
    if (best) {
      stats.fuzzy += 1;
      return best.row;
    }
  }
  // "Vietnam", "Kuwait": the area is the whole country, use its capital.
  if (key === norm(countryName.get(cc)) && c.capital) {
    stats.country += 1;
    return c.capital;
  }
  return null;
}

// ---- decide what is listed ---------------------------------------------------
const listed = new Map(); // cc -> [{ group, name, row }]
const seenArea = new Set();
for (const a of areas) {
  const dupe = `${a.cc}|${a.group}|${norm(a.name)}`;
  if (seenArea.has(dupe)) continue;
  seenArea.add(dupe);
  stats.areas += 1;
  const row = findRow(a);
  if (!row) stats.noCoords += 1;
  // SHOW_MATCHES=1 prints how every area was matched, to check by eye.
  if (process.env.SHOW_MATCHES) {
    console.log(`${a.cc} | ${a.group} | ${a.name} -> ${row ? `${row.name} (${row.cc}.${row.admin1}, ${row.pop})` : "NONE"}`);
  }
  if (!listed.has(a.cc)) listed.set(a.cc, []);
  listed.get(a.cc).push({ group: a.group, name: a.name, row });
}
const curatedCountries = listed.size;

// A country the site's list covers thinly (often only the country itself, like
// "Bahrain") is topped up with its most populated cities: capital first, then by
// population. A country already at its target is left exactly as it is.
let nonCurated = 0;
const topUp = []; // [cc, before, after] for SHOW_TOPUP=1
for (const c of index) {
  const data = byCountry.get(c.c);
  if (!data) continue;
  const real = data.rows.filter((r) => !NOT_A_CITY.has(r.fc));
  const target = Math.min(MAX_LISTED, Math.max(MIN_LISTED, real.filter((r) => r.pop >= TOPUP_BIG_POP).length));
  const before = (listed.get(c.c) || []).length;
  if (before >= MIN_LISTED || before >= target) continue; // already a real list of its own
  // "Bahrain" / "Vietnam" as a city is the whole country: the capital replaces it.
  const isWholeCountry = (e) => e.row && e.row === data.capital && norm(e.name) === norm(c.n);
  const entries = (listed.get(c.c) || []).filter((e) => !isWholeCountry(e));
  // Skip a city the list already has, by its own name or by another one ("Bombay" = Mumbai).
  const taken = new Set(entries.flatMap((e) => [norm(e.name), e.row && norm(e.row.name)]).filter(Boolean));
  const original = new Set(entries.map((e) => e.row).filter(Boolean));
  const candidates = [data.capital, ...real.slice().sort((a, b) => b.pop - a.pop).filter((r) => r.pop >= TOPUP_MIN_POP)];
  for (const r of candidates) {
    if (entries.length >= target) break;
    // Plain letters: "Can Tho", not "Cần Thơ". GeoNames writes the Vietnamese đ as "GJ".
    const name = r && (r.ascii || r.name).replace(/GJ/g, "D").replace(/gj/g, "d").replace(/`/g, "'");
    const key = name && norm(name);
    if (!key || taken.has(key) || taken.has(norm(r.name)) || original.has(r)) continue;
    entries.push({ group: c.n, name, row: r });
    taken.add(key);
  }
  listed.set(c.c, entries);
  nonCurated += entries.length - before;
  topUp.push([c.c, before, entries.length]);
}
if (process.env.SHOW_TOPUP) {
  for (const [cc, b, a] of topUp) console.log(`TOPUP ${cc} ${countryName.get(cc)}: ${b} -> ${a}`);
}

// ---- write -------------------------------------------------------------------
for (const dir of ["geo", "s", "p"]) {
  fs.rmSync(path.join(WORLD, dir), { recursive: true, force: true });
  fs.mkdirSync(path.join(WORLD, dir), { recursive: true });
}

const sShards = new Map(); // letter -> [{ e, pop }]
let total = 0;
let notSearchable = 0;
for (const c of index) {
  const entries = listed.get(c.c) || [];
  const groups = [];
  const geo = [];
  for (const e of entries) {
    let g = groups.find((x) => x[0] === e.group);
    if (!g) groups.push((g = [e.group, []]));
    g[1].push(e.name);
    if (e.row) geo.push([e.name, e.group, e.row.lat, e.row.lon]);
    const key = norm(e.name);
    if (!key) {
      notSearchable += 1; // no latin letters: cannot be searched
      continue;
    }
    const letter = shardKey(key);
    if (!sShards.has(letter)) sShards.set(letter, []);
    sShards.get(letter).push({ e: [e.name, c.c, e.group], pop: e.row ? e.row.pop : 0 });
  }
  c.k = entries.length;
  total += entries.length;
  fs.writeFileSync(path.join(WORLD, `${c.c}.json`), JSON.stringify(groups));
  fs.writeFileSync(path.join(WORLD, "geo", `${c.c}.json`), JSON.stringify(geo));
}
fs.writeFileSync(path.join(WORLD, "index.json"), JSON.stringify(index));

for (const [letter, list] of sShards) {
  list.sort((a, b) => b.pop - a.pop);
  fs.writeFileSync(path.join(WORLD, "s", `${letter}.json`), JSON.stringify(list.map((x) => x.e)));
}

// Every place of 1,000+ people. Not listed on the site: only used to find the
// listed city closest to a name that is not listed (or is spelled differently).
const pShards = new Map();
const seen = new Set();
let places = 0;
for (const r of rows.slice().sort((a, b) => b.pop - a.pop)) {
  const key = norm(r.name);
  if (!key) continue;
  const dupe = `${r.cc}|${key}`;
  if (seen.has(dupe)) continue; // keep the most populated place of a name per country
  seen.add(dupe);
  const letter = shardKey(key);
  if (!pShards.has(letter)) pShards.set(letter, []);
  pShards.get(letter).push([r.name, r.cc, r.lat, r.lon]);
  places += 1;
}
for (const [letter, list] of pShards) {
  fs.writeFileSync(path.join(WORLD, "p", `${letter}.json`), JSON.stringify(list));
}

console.log("site list: ", stats.areas, "areas in", curatedCountries, "countries");
console.log("  found in GeoNames: exact", stats.exact, " other spelling", stats.altName, " close spelling", stats.fuzzy, " whole country", stats.country);
console.log("  no coordinates (kept, but never suggested as 'closest'):", stats.noCoords);
console.log("topped up:", topUp.length, "countries, net", nonCurated, "cities added (biggest cities, capital first)");
console.log("TOTAL listed:", total, " not searchable (no latin letters):", notSearchable);
console.log("places for 'closest city':", places, " files s/:", sShards.size, " p/:", pShards.size);
if (skipped.length) console.log("skipped (no country code):", skipped.join(", "));
const empty = index.filter((c) => c.k === 0).map((c) => c.c);
if (empty.length) console.log("countries with no listed city:", empty.join(", "));
