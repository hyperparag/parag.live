// Page titles and descriptions for the category pages.
// `data` is the route: [city, state, category].
const COPY = {
  Community: {
    what: "community groups, events and local news",
    keywords: "community, local groups, events, volunteers, activities",
  },
  Dating: {
    what: "dating and friendship",
    keywords: "dating, friendship, meet people, relationships",
  },
  Marketplace: {
    what: "things to buy and sell",
    keywords: "buy and sell, marketplace, for sale, used goods, electronics",
  },
  Services: {
    what: "local and professional services",
    keywords: "local services, professional services, lessons, repairs",
  },
};

export const findMeta = (data) => {
  const city = data?.[0] ?? "";
  const category = data?.[2];
  const copy = COPY[category];
  if (!copy) {
    return {
      title: `Classifieds in ${city} | Parag`,
      description: `Browse free classified ads in ${city} on Parag.`,
      keywords: `classifieds, ${city}`,
      category: category ?? "",
    };
  }
  return {
    title: `${category} in ${city} | Parag`,
    description: `Browse ${copy.what} in ${city} on Parag. Post a free ad or find what you need near you.`,
    keywords: `${category} ${city}, ${copy.keywords}`,
    category,
  };
};
