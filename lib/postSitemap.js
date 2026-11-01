// Shared by pages/sitemap-posts*.xml.js. The backend splits approved posts into
// chunks of 30,000 (products/sitemap, sitemap2, sitemap3, sitemap4), one chunk
// per sitemap file.
const API_URL = "https://paraglive-backend.vercel.app/api/products";
const SITE_URL = "https://parag.live";

export function generateSiteMap(posts) {
  const urls = posts
    .filter((post) => post?._id)
    .map(
      (post) =>
        `  <url>\n    <loc>${SITE_URL}/post/details/${post._id}</loc>\n  </url>\n`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}</urlset>\n`;
}

// Writes the sitemap for one backend chunk to `res`. If the backend is down or
// slow this answers 503 rather than letting Next render its HTML error page,
// which Search Console reads as "sitemap is HTML". 503 also tells Google to
// retry later, where an empty 200 would be taken as "this site has no pages".
export async function sendPostSitemap(res, endpoint) {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`);
    if (!response.ok) {
      throw new Error(`backend responded with ${response.status}`);
    }
    const { data } = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("backend did not return a list of posts");
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.write(generateSiteMap(data));
  } catch (error) {
    console.error(`sitemap ${endpoint} failed:`, error);
    res.statusCode = 503;
    res.setHeader("Retry-After", "3600");
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.write("Sitemap temporarily unavailable");
  }
  res.end();
}
