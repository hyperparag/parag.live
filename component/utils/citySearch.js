import cityNormalize from "./cityNormalize";

const { norm, shardKey } = cityNormalize;

/**
 * City search over the files in /public/world (built by scripts/buildCitySearch.js).
 *
 *   searchCities(q)    cities the site lists whose name starts with q
 *   closestCities(q)   when nothing matches: "did you mean" spellings, and for a
 *                      small place the site does not list, the nearest cities it does
 *
 * Every file is fetched once and kept in memory. Nothing here talks to a server
 * other than our own static files.
 */

const MIN_LENGTH = 2;

const files = new Map(); // url -> Promise<any>
const getJson = (url) => {
  if (!files.has(url)) {
    files.set(
      url,
      fetch(url)
        .then((r) => {
          if (!r.ok) throw new Error(`${url}: ${r.status}`);
          return r.json();
        })
        .catch((error) => {
          files.delete(url); // let a later keystroke try again
          throw error;
        }),
    );
  }
  return files.get(url);
};

// A letter file with no entries (or one that is missing) just means no matches.
const getList = (url) => getJson(url).catch(() => []);

// Search keys of a letter file, worked out once per file.
const keyCache = new WeakMap();
const keysOf = (list) => {
  if (!keyCache.has(list)) keyCache.set(list, list.map((e) => norm(e[0])));
  return keyCache.get(list);
};

let countryNames = null;
/** { US: "United States", ... } */
export const loadCountryNames = async () => {
  if (!countryNames) {
    const list = await getJson("/world/index.json");
    countryNames = Object.fromEntries(list.map((c) => [c.c, c.n]));
  }
  return countryNames;
};

/**
 * Cities the site lists, most populated first.
 * @returns {Promise<Array<{name: string, state: string, cc: string}>>}
 */
export async function searchCities(query, limit = 8) {
  const q = norm(query);
  if (q.length < MIN_LENGTH) return [];

  const list = await getList(`/world/s/${shardKey(q)}.json`);
  const keys = keysOf(list);
  const exact = [];
  const prefix = [];
  for (let i = 0; i < list.length && exact.length + prefix.length < 400; i += 1) {
    if (keys[i] === q) exact.push(list[i]);
    else if (keys[i].startsWith(q)) prefix.push(list[i]);
  }
  return [...exact, ...prefix]
    .slice(0, limit)
    .map(([name, cc, state]) => ({ name, cc, state }));
}

// Edit distance with swapped neighbours counting as one change ("chiacgo").
// Gives up early once it is certain to be more than `max`.
function distance(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev2 = null;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i += 1) {
    const row = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + cost);
      if (prev2 && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        v = Math.min(v, prev2[j - 2] + 1);
      }
      row[j] = v;
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return max + 1;
    prev2 = prev;
    prev = row;
  }
  return prev[b.length];
}

const toRad = (d) => (d * Math.PI) / 180;
/** Distance between two points in km. */
export function haversineKm(lat1, lon1, lat2, lon2) {
  const a =
    Math.sin(toRad(lat2 - lat1) / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(toRad(lon2 - lon1) / 2) ** 2;
  return 12742 * Math.asin(Math.min(1, Math.sqrt(a)));
}

/** The `limit` listed cities of a country nearest to a point. */
async function nearestListed(cc, lat, lon, limit) {
  const geo = await getList(`/world/geo/${cc}.json`);
  return geo
    .map(([name, state, clat, clon]) => ({
      name,
      state,
      cc,
      km: Math.round(haversineKm(lat, lon, clat, clon)),
    }))
    .sort((a, b) => a.km - b.km)
    .slice(0, limit);
}

/**
 * For a name that is not listed.
 *
 * @returns {Promise<{
 *   didYouMean: Array<{name, state, cc}>,
 *   nearby: Array<{place: {name, cc}, cities: Array<{name, state, cc, km}>}>
 * }>}
 *   didYouMean: listed cities with a similar spelling.
 *   nearby: for each unlisted place with that name (at most 2, in different
 *   countries), the nearest listed cities in the same country.
 */
export async function closestCities(query, { limit = 3 } = {}) {
  const out = { didYouMean: [], nearby: [] };
  const q = norm(query);
  if (q.length < 3) return out;

  const key = shardKey(q);
  const [listed, places] = await Promise.all([
    getList(`/world/s/${key}.json`),
    getList(`/world/p/${key}.json`),
  ]);
  const listedKeys = keysOf(listed);
  const placeKeys = keysOf(places);

  // 1. A real place with this exact name that the site does not list.
  let found = [];
  for (let i = 0; i < places.length && found.length < 2; i += 1) {
    if (placeKeys[i] === q && !found.some((p) => p[1] === places[i][1])) {
      found.push(places[i]);
    }
  }

  // 2. Otherwise places whose name starts with what was typed ("Smallv").
  if (found.length === 0 && q.length >= 4) {
    for (let i = 0; i < places.length && found.length < 2; i += 1) {
      if (placeKeys[i].startsWith(q) && !found.some((p) => p[1] === places[i][1])) {
        found.push(places[i]);
      }
    }
  }

  // 3. Otherwise a spelling that is one or two letters off.
  if (found.length === 0) {
    const max = q.length <= 4 ? 1 : 2;
    const scored = [];
    const consider = (e, k, isListed) => {
      const d = Math.min(
        distance(q, k, max),
        k.length > q.length ? distance(q, k.slice(0, q.length), max) + 1 : max + 1,
      );
      if (d <= max) scored.push({ e, d, isListed });
    };
    listed.forEach((e, i) => consider(e, listedKeys[i], true));
    places.forEach((e, i) => consider(e, placeKeys[i], false));
    scored.sort((a, b) => a.d - b.d);
    const similarListed = scored.filter((s) => s.isListed);
    if (similarListed.length > 0) {
      // A listed city is spelled almost the same: that is the likely answer.
      // Do not also offer unrelated small places with a similar name.
      out.didYouMean = similarListed
        .filter((s) => s.d === similarListed[0].d) // only the closest spellings
        .slice(0, 4)
        .map((s) => ({ name: s.e[0], cc: s.e[1], state: s.e[2] }));
    } else {
      for (const s of scored) {
        if (found.length >= 2) break;
        if (!found.some((p) => p[1] === s.e[1])) found.push(s.e);
      }
    }
  }

  out.nearby = (
    await Promise.all(
      found.map(async ([name, cc, lat, lon]) => ({
        place: { name, cc },
        cities: await nearestListed(cc, lat, lon, limit),
      })),
    )
  ).filter((n) => n.cities.length > 0);
  return out;
}

/** Page of a listed city on the site: /Paris?state=Ile-de-France */
export const cityPageHref = ({ name, state }) =>
  `/${encodeURIComponent(name)}${state ? `?state=${encodeURIComponent(state)}` : ""}`;
