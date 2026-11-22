import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const Footer = dynamic(() => import("@/component/footer/footer2"));
const Header = dynamic(() => import("@/component/header/header"));
import style from "../../styles/moduleCss/location.module.css";
import { BsArrowRight } from "react-icons/bs";
import Head from "next/head";
import cities from "../../public/usa.json";
import CitySearch from "@/component/search/CitySearch";

const Location = () => {
  const router = useRouter();
  const [state, setState] = useState([]);
  const [reload, setReload] = useState(false);
  const [isCountrySelected, setisCountrySelected] = useState({});

  const seleceCountry = (e) => {
    const { checked } = e.target;
    const q = e.target.value;
    if (checked) {
      const selectedRegion = cities?.find((a) => a?._id == q);
      setisCountrySelected(selectedRegion);
      const regions = selectedRegion?.children?.map((a) =>
        a.children.map((a) => {
          const data = a.name ? { ...a, isChecked: true } : a;
          const findData = state.find((s) => s._id == a._id);
          if (findData) return;
          state.push(data);
        }),
      );
    } else if (checked == false) {
      const selectedRegion = cities?.find((a) => a?._id == q);
      setisCountrySelected({});
      state.pop(selectedRegion);
      const regions = selectedRegion?.children?.map((a) =>
        a.children.map((p) => {
          const data = p.name ? { ...p, isChecked: false } : p;
          state.pop(data);
        }),
      );
    }
    setReload(!reload);
  };

  const selectAll = (e) => {
    const { checked } = e.target;
    const q = e.target.value.split(",");
    if (checked) {
      const selectedRegion = cities?.find((a) => a?._id == q[0]);
      const regions = selectedRegion?.children?.find((a) => a?._id == q[1]);
      const checkData = state.filter((a) => a.parentId == q[1]);
      if (checkData) {
        const removeOld = checkData.map((a) => state.pop(a));
      }
      const localCities = regions?.children?.filter((a) => a.parentId == q[1]);
      const city = localCities?.map((a) =>
        a.name ? { ...a, isChecked: true } : a,
      );
      const res = city.map((a) => state.push(a));
    } else if (checked == false) {
      const selectedRegion = cities?.find((a) => a?._id == q[0]);
      const regions = selectedRegion?.children?.find((a) => a?._id == q[1]);
      const checkData = state.filter((a) => a.parentId !== q[1]);
      setState(checkData);
    }
    setReload(!reload);
  };

  const seletectedCity = (d) => {
    const seleted = state.find((a) => a._id == d._id);
    if (seleted) {
      const newState = state.filter((a) => a._id !== d._id);
      setState(newState);
    } else {
      const New = { ...d, isChecked: true };
      setState([...state, New]);
    }
  };

  const citiesName = () => {
    let data = [];
    const cities = state.map((a) => data.push(a.name));
    localStorage.setItem("cities", JSON.stringify(data));
  };

  const isMultiple = router?.query?.location?.[0] == "multiple-city-ads";

  // A city from the search box. It can be any city in the world, listed or not:
  // ads are matched by city name.
  const [added, setAdded] = useState("");
  const addSearchedCity = (city) => {
    const name = city.name;
    if (isMultiple) {
      if (!state.find((c) => c.name.toLowerCase() === name.toLowerCase())) {
        setState([...state, { _id: `custom-${name}`, name, isChecked: true }]);
      }
      setAdded(name);
    } else {
      router.push(`/posts/${router?.query?.location?.[0]}/${encodeURIComponent(name)}`);
    }
  };

  return (
    <div className='page-bg min-h-screen'>
      <Head>
        <title>Select Location</title>
        <link rel='icon' href='/logo.png' />
      </Head>
      <Header />

      {/* ── Selected cities + Next bar ── */}
      {isMultiple && (
        <div className='mx-4 sm:mx-24 mt-4 rounded-xl px-5 py-3 flex flex-row-reverse justify-between items-center' style={{background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow)"}}>
          <div>
            {state.length === 0 ? (
              <button
                disabled
                className='flex items-center gap-2 cursor-not-allowed font-semibold px-5 py-2 rounded-lg text-sm' style={{background: "var(--surface-2)", color: "var(--text-muted)", border: "1px solid var(--border)"}}
              >
                Next <BsArrowRight />
              </button>
            ) : (
              <Link href='/posts/multiple-city-ads'>
                <button
                  onClick={citiesName}
                  className='flex items-center gap-2 font-semibold px-5 py-2 rounded-lg text-sm transition-colors btn-accent'
                >
                  Post <BsArrowRight />
                </button>
              </Link>
            )}
          </div>
          <p className='text-sm' style={{color: "var(--text-secondary)"}}>
            Selected:{" "}
            <span className='font-bold' style={{color: "var(--accent)"}}>{state.length}</span>{" "}
            cities
          </p>
        </div>
      )}

      {/* ── Main content ── */}
      <div className='mx-4 sm:mx-24 my-5'>
        <div style={{ maxWidth: 520, marginBottom: 20 }}>
          <CitySearch
            allowCustom
            customLabel={isMultiple ? "Add" : "Use"}
            placeholder='Search any city in the world'
            onSelect={addSearchedCity}
          />
          {isMultiple && added && (
            <p className='text-sm mt-2' style={{ color: "var(--success)" }}>
              Added {added}. Selected: {state.length}.
            </p>
          )}
        </div>
        <p className='text-lg font-semibold mb-4' style={{color: "var(--text)"}}>
          Or choose from US cities
        </p>

        {isMultiple ? (
          <>
            <label className='flex items-center gap-2 text-sm font-semibold mb-4 cursor-pointer w-fit' style={{color: "var(--text)"}}>
              <input
                type='checkbox'
                className='w-4 h-4' style={{accentColor: "var(--accent)"}}
                value={["63d4d4c23f5c38ce5f287cd1"]}
                onClick={seleceCountry}
              />
              Select All Cities
            </label>

            <div className='flex flex-col gap-2'>
              {cities?.[0]?.children?.map((c) => (
                <div
                  key={c._id}
                  className='collapse collapse-arrow rounded-xl overflow-hidden' style={{background: "var(--surface)", border: "1px solid var(--border)"}}
                >
                  <input type='checkbox' className='peer' />
                  <div className='collapse-title font-medium text-sm py-3 px-4' style={{color: "var(--text)"}}>
                    {c?.name}
                  </div>
                  <div className='collapse-content' style={{background: "var(--surface)"}}>
                    <div className='pt-2 pb-1'>
                      <label className='flex items-center gap-2 text-sm font-semibold mb-3 cursor-pointer w-fit' style={{color: "var(--text-secondary)"}}>
                        <input
                          type='checkbox'
                          className='w-4 h-4' style={{accentColor: "var(--accent)"}}
                          disabled={isCountrySelected?.children?.find((a) =>
                            a.name == c.name ? true : false,
                          )}
                          checked={isCountrySelected?.children?.find((a) =>
                            a.name == c.name ? true : false,
                          )}
                          value={[cities?.[0]._id, c?._id]}
                          onClick={selectAll}
                        />
                        Select all in {c?.name}
                      </label>
                      <div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
                        {c?.children?.map((d) => (
                          <label
                            key={d._id}
                            className='flex items-center gap-2 text-sm cursor-pointer transition-colors' style={{color: "var(--text-secondary)"}}
                          >
                            <input
                              type='checkbox'
                              className='w-4 h-4' style={{accentColor: "var(--accent)"}}
                              checked={state.find((a) =>
                                a.name == d.name ? true : false,
                              )}
                              onChange={() => seletectedCity(d)}
                            />
                            {d.name}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className='flex flex-col gap-2'>
            {cities?.[0]?.children?.map((c) => (
              <div
                key={c._id}
                className='collapse collapse-arrow rounded-xl overflow-hidden' style={{background: "var(--surface)", border: "1px solid var(--border)"}}
              >
                <input type='checkbox' className='peer' />
                <div className='collapse-title font-medium text-sm py-3 px-4' style={{color: "var(--text)"}}>
                  {c.name}
                </div>
                <div className='collapse-content' style={{background: "var(--surface)"}}>
                  <div className={style.stateBox}>
                    {c?.children?.map((d) => (
                      <Link
                        key={d._id}
                        href={`/posts/${router?.query?.location?.[0]}/${d.name}`}
                        className='text-sm transition-colors' style={{color: "var(--text-secondary)"}}
                      >
                        {d.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Location;
