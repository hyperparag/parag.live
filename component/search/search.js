import { useRouter } from "next/router";
import React from "react";
import CitySearch from "./CitySearch";
import { cityPageHref } from "@/component/utils/citySearch";

// Homepage search: any city in the world. A city the site does not list can
// still be opened by name ("Open").
const Search = () => {
  const router = useRouter();

  return (
    <div style={{ margin: "24px auto", maxWidth: "600px" }}>
      <CitySearch
        allowCustom
        customLabel='Open'
        placeholder='Search any city in the world...'
        onSelect={(city) => router.push(cityPageHref(city))}
      />
    </div>
  );
};

export default Search;
