// Page titles and descriptions for the category pages.
// `data` is the route: [city, state, category].
const COPY = {
  Community: {
    what: "community groups, events and local news",
    keywords: "community, local groups, events, volunteers, activities, classes, workshops, lost and found, rideshare, local announcements, activities, musicians, artists, support groups, neighborhood",
  },
  Dating: {
    what: "dating and friendship",
    keywords: "dating, friendship, meet people, relationships, personals, singles, local singles, activity partners, companionship, casual dating, social meetup, networking",
  },
  Marketplace: {
    what: "things to buy and sell",
    keywords: "buy and sell, marketplace, for sale, used goods, electronics, real estate, housing, apartments for rent, rooms for rent, cars and vehicles, motorcycles, furniture, appliances, free stuff, secondhand",
  },
  Services: {
    what: "local and professional services",
    keywords: "local services, professional services, lessons, repairs, jobs, gigs, hiring, home repair, cleaning, moving, tutoring, beauty and wellness, automotive repair, freelance, skilled trades, plumbing, electrical",
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
