export const findCityMeta = ({ city, state }) => {
  const datas = [
    {
      id: 1,
      title: `Find the best Craigslist replacement for free dating, cheap escorts, erotic massage and erotica listings at Parag in ${city}  ${state?.slice(
        0,
        2,
      )}`,
      description: `Explore the Backpage alternatives to Parag ${city} ${state}. For Escort alligator & Erotic Massage by our Cheap & Tryst escort services. Also find the love of your life from local personals for free dating or erotica listings near you`,
      keywords: ``,
      city: "Auburn",
    },
  ];

  const getMeta = datas.find((a) => a);

  return getMeta;
};
