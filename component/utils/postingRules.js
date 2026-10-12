/**
 * Numbers quoted to users on /posting-rules and in the post form. The server
 * enforces them, so keep them in step with
 * Backend/src/api/v1/utils/moderation.js and Backend/src/api/v1/config/pricing.js.
 */
export const POSTING_LIMITS = {
  minDescriptionWords: 20,
  maxLinks: 2,
  maxAdsPerDay: 5,
  maxTitleLength: 150,
  maxPhotos: 4,
  multiCityRate: 0.05,
};

/** Words in editor HTML, counted the way the server counts them. */
export function countWords(html) {
  if (!html) return 0;
  const text = String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .trim();
  return text ? text.split(/\s+/).length : 0;
}
