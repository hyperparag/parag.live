export const findCityMeta = ({ city, state }) => {
  const place = [city, state].filter(Boolean).join(", ");
  return {
    title: `Free classifieds in ${place} | Parag`,
    description: `Free local classified ads in ${place}: community, dating, marketplace and services. Post an ad or browse what is near you on Parag.`,
    keywords: `classifieds ${city ?? ""}, community, dating, marketplace, services, Parag`,
    city,
  };
};
