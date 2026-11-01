//pages/sitemap-posts.xml.js
import { sendPostSitemap } from "@/lib/postSitemap";

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  await sendPostSitemap(res, "sitemap");

  return {
    props: {},
  };
}

export default SiteMap;
