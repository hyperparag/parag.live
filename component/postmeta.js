// Meta keywords for an ad page. `data` is the route query: { city, sub }.
const KEYWORDS = {
  Community: "community, local groups, events, classes, workshops, volunteers, lost and found, rideshare, local announcements, activities, musicians, artists",
  Dating: "dating, friendship, meet people, personals, singles, relationships, local singles, casual encounters, activity partners, companionship",
  Marketplace: "buy and sell, for sale, marketplace, real estate, apartments for rent, housing, cars and vehicles, electronics, furniture, appliances, free stuff, secondhand, used items, deals",
  Services: "local services, professional services, jobs, gigs, hiring, home repair, cleaning, moving, tutoring, beauty and wellness, automotive repair, freelance, skilled trades",
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
