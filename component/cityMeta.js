export const findCityMeta = ({ city, state }) => {
  const datas = [
    {
      id: 1,
      title: `Find The Best Cheap escorts at Parag in ${city}  ${state?.slice(
        0,
        2,
      )}`,
      description: `Explore the Backpage alternatives to Parag ${city} ${state}. For Escort alligator & Erotic Massage by our Cheap & Tryst escort services`,
      keywords: ``,
      city: "Auburn",
    },
  ];

  const getMeta = datas.find((a) => a);

  return getMeta;
};
