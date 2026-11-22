/**
 * Builds the data behind the city search box. One-off: run it again only when
 * the city list changes.
 *
 *   node scripts/buildCitySearch.js <cities5000.txt> <cities1000.txt> <admin1CodesASCII.txt>
 *
 * The three input files are free downloads from https://download.geonames.org/export/dump/
 * (cities5000.zip, cities1000.zip, admin1CodesASCII.txt). GeoNames data is CC BY 4.0.
 *
 * It reads the existing public/world/<CC>.json lists (the cities the site covers)
 * and writes, next to them:
 *
 *   public/world/geo/<CC>.json  covered cities of one country with coordinates,
 *                               [[name, state, lat, lon], ...]. Used to find the
 *                               nearest covered city.
 *   public/world/s/<x>.json     covered cities of the whole world whose name starts
 *                               with letter x, most populated first,
 *                               [[name, countryCode, state], ...]. Used by the search box.
 *   public/world/p/<x>.json     smaller places (1,000 to 5,000 people) that the site
 *                               does not list, [[name, countryCode, lat, lon], ...].
 *                               Only used to answer "which covered city is closest
 *                               to the place you typed?".
 */
const fs = require("fs");
const path = require("path");
const { norm, shardKey } = require("../component/utils/cityNormalize");

const [c5000, c1000, admin1File] = process.argv.slice(2);
if (!c5000 || !c1000 || !admin1File) {
  console.error("usage: node scripts/buildCitySearch.js <cities5000.txt> <cities1000.txt> <admin1CodesASCII.txt>");
  process.exit(1);
}

const WORLD = path.join(__dirname, "..", "public", "world");
const round2 = (n) => Math.round(Number(n) * 100) / 100;

const rowsOf = (file) =>
  fs
    .readFileSync(file, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const f = line.split("\t");
      return {
        id: f[0],
        name: f[1],
        lat: round2(f[4]),
        lon: round2(f[5]),
        cc: f[8],
        admin1: f[10],
        pop: Number(f[14]) || 0,
      };
    });

// admin1 code ("US.IL") -> normalized state names (native and ASCII spelling).
const admin1 = new Map();
for (const line of fs.readFileSync(admin1File, "utf8").split("\n").filter(Boolean)) {
  const [code, name, ascii] = line.split("\t");
  admin1.set(code, [norm(name), norm(ascii)]);
}

const covered = rowsOf(c5000);
const coveredIds = new Set(covered.map((r) => r.id));

// country -> normalized city name -> rows
const lookup = new Map();
for (const r of covered) {
  if (!lookup.has(r.cc)) lookup.set(r.cc, new Map());
  const byName = lookup.get(r.cc);
  const k = norm(r.name);
  if (!byName.has(k)) byName.set(k, []);
  byName.get(k).push(r);
}

fs.mkdirSync(path.join(WORLD, "geo"), { recursive: true });
const sShards = new Map(); // letter -> [{ e, pop }]
const stats = { cities: 0, exact: 0, loose: 0, noCoords: 0, noKey: 0 };

const countryFiles = fs
  .readdirSync(WORLD)
  .filter((f) => /^[A-Z]{2}\.json$/.test(f));

for (const file of countryFiles) {
  const cc = file.slice(0, 2);
  const states = JSON.parse(fs.readFileSync(path.join(WORLD, file), "utf8"));
  const byName = lookup.get(cc) || new Map();
  const used = new Set();
  const geo = [];

  for (const [state, cities] of states) {
    const stateKey = norm(state);
    for (const city of cities) {
      stats.cities += 1;
      const key = norm(city);
      const candidates = (byName.get(key) || []).filter((r) => !used.has(r.id));
      let row = candidates.find((r) => {
        const names = admin1.get(`${cc}.${r.admin1}`) || [];
        return names.includes(stateKey);
      });
      if (row) stats.exact += 1;
      else if (candidates.length) {
        row = candidates.sort((a, b) => b.pop - a.pop)[0];
        stats.loose += 1;
      }
      if (row) {
        used.add(row.id);
        geo.push([city, state, row.lat, row.lon]);
      } else {
        stats.noCoords += 1;
      }

      if (!key) {
        stats.noKey += 1; // name has no latin letters: cannot be searched
        continue;
      }
      const letter = shardKey(key);
      if (!sShards.has(letter)) sShards.set(letter, []);
      sShards.get(letter).push({ e: [city, cc, state], pop: row ? row.pop : 0 });
    }
  }
  fs.writeFileSync(path.join(WORLD, "geo", file), JSON.stringify(geo));
}

fs.mkdirSync(path.join(WORLD, "s"), { recursive: true });
for (const [letter, list] of sShards) {
  list.sort((a, b) => b.pop - a.pop);
  fs.writeFileSync(
    path.join(WORLD, "s", `${letter}.json`),
    JSON.stringify(list.map((x) => x.e)),
  );
}

// Places the site does not list, only used to find "the closest covered city".
const pShards = new Map();
const seen = new Set();
let places = 0;
for (const r of rowsOf(c1000)) {
  if (coveredIds.has(r.id)) continue;
  const key = norm(r.name);
  if (!key) continue;
  const dupe = `${r.cc}|${key}`;
  if (seen.has(dupe)) continue; // keep the most populated place of a name per country
  seen.add(dupe);
  const letter = shardKey(key);
  if (!pShards.has(letter)) pShards.set(letter, []);
  pShards.get(letter).push({ e: [r.name, r.cc, r.lat, r.lon], pop: r.pop });
  places += 1;
}
fs.mkdirSync(path.join(WORLD, "p"), { recursive: true });
for (const [letter, list] of pShards) {
  list.sort((a, b) => b.pop - a.pop);
  fs.writeFileSync(
    path.join(WORLD, "p", `${letter}.json`),
    JSON.stringify(list.map((x) => x.e)),
  );
}

console.log("covered cities:", stats.cities);
console.log("  coordinates, exact state match:", stats.exact);
console.log("  coordinates, matched by name only:", stats.loose);
console.log("  no coordinates found:", stats.noCoords);
console.log("  not searchable (no latin letters):", stats.noKey);
console.log("extra places for 'closest city':", places);
console.log("search files s/:", sShards.size, " place files p/:", pShards.size);
