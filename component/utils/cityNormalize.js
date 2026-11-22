// Turns a place name into a plain lowercase key, so "Łódź", "lodz" and "LODZ"
// all match. Used by the city search box (component/utils/citySearch.js) and by
// scripts/buildCitySearch.js, which writes the search files. Both must use the
// same function, so it lives here as CommonJS (Node and the browser bundle can
// both load it).

// Letters that do not split into "letter + accent" under Unicode NFD.
const EXTRA = {
  "ł": "l", "ø": "o", "đ": "d", "ð": "d", "þ": "th", "ß": "ss", "æ": "ae",
  "œ": "oe", "ı": "i", "ħ": "h", "ŋ": "n", "ĸ": "k", "ŧ": "t",
};

function norm(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[łøđðþßæœıħŋĸŧ]/g, (c) => EXTRA[c])
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// Search files are split by the first letter of the key. Anything that does not
// start with a-z goes in "_".
function shardKey(key) {
  const c = key.charAt(0);
  return c >= "a" && c <= "z" ? c : "_";
}

module.exports = { norm, shardKey };
