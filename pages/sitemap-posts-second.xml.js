//pages/sitemap-posts-second.xml.js
import { sendPostSitemap } from "@/lib/postSitemap";

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  await sendPostSitemap(res, "sitemap2");

  return {
    props: {},
  };
}

export default SiteMap;
