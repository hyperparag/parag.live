// Meta keywords for an ad page. `data` is the route query: { city, sub }.
const KEYWORDS = {
  Community: "community, local groups, events",
  Dating: "dating, friendship, meet people",
  Marketplace: "buy and sell, for sale, marketplace",
  Services: "local services, professional services",
};

export const findPostMeta = (data) => {
  const extra = KEYWORDS[data?.sub];
  return {
    name: data?.sub ?? "",
    keywords: [data?.sub, data?.city, extra, "Parag", "classifieds"]
      .filter(Boolean)
      .join(", "),
  };
};
