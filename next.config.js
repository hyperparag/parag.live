const REMOVED_PAGES = [
  "/female-escort",
  "/tescorts",
  "/tryst-san-antonio-escorts",
  "/skip-the-games",
  "/skip-the-games-cape-cod",
  "/skip-the-games-hudson-valley",
  "/skip-the-games-worcester",
  "/skip-the-games-wv",
  "/skip-yhe-games",
  "/skipthe-games",
  "/old",
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    // Uploads can live on any host (R2 public URL, ImageKit, Google avatars),
    // so do not depend on an env var being set at build time.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    domains: [
      "ik.imagekit.io",
      ...(process.env.R2_PUBLIC_HOST ? [process.env.R2_PUBLIC_HOST] : []),
      "adbacklist.s3.ap-southeast-1.amazonaws.com",
      "dk3vy6fruyw6l.cloudfront.net",
    ],
  },
  async redirects() {
    return [
      // No www <-> parag.live redirect here. That is set in Vercel (Settings ->
      // Domains); a second one in code made an endless redirect loop and took
      // the whole site down on 2026-11-22.
      // The old escort-era landing pages are gone. Send visitors and search
      // engines to the home page instead of a 404.
      ...REMOVED_PAGES.map((source) => ({
        source,
        destination: "/",
        permanent: true,
      })),
    ];
  },
  async rewrites() {
    return [
      {
        source: "/robots.txt",
        destination: "/api/robots",
      },
      // The page was first named "forth". Keep that URL working; without a
      // match it falls through to the [post] city page and returns HTML.
      {
        source: "/sitemap-posts-forth.xml",
        destination: "/sitemap-posts-fourth.xml",
      },
    ];
  },
};

module.exports = nextConfig;
