// Builds the text shown for where an ad is located:
//   the free-text location the poster typed (if any), then the cities.
// e.g. "Near the station, Austin, Dallas +2 more"
export const formatAdLocation = (ad, maxCities = 3) => {
  if (!ad) return "";
  const parts = [];
  const location = typeof ad.location === "string" ? ad.location.trim() : "";
  if (location) parts.push(location);

  const cities = Array.isArray(ad.cities)
    ? ad.cities.filter(Boolean)
    : ad.city
      ? [ad.city]
      : [];
  if (cities.length) {
    parts.push(cities.slice(0, maxCities).join(", "));
    if (cities.length > maxCities) {
      parts[parts.length - 1] += ` +${cities.length - maxCities} more`;
    }
  }
  return parts.join(", ");
};
