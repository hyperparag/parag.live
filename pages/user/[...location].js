import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
const Footer = dynamic(() => import("@/component/footer/footer2"));
const Header = dynamic(() => import("@/component/header/header"));
import style from "../../styles/moduleCss/location.module.css";
import { BsArrowRight } from "react-icons/bs";
import Head from "next/head";
import cities from "../../public/usa.json";
import CitySearch from "@/component/search/CitySearch";

/**
 * Pick where to post: search any city, or browse by country > state > city.
 *
 * The US list is the original one (public/usa.json). Every other country comes
 * from /public/world/{code}.json ([[state, [cities]], ...]), the same lists the
 * home page browses, loaded only when that country is opened. Both are turned
 * into the same shape: [{ _id, name, children: [{ _id, name }] }].
 */

const US = "US";
const usRegions = cities?.[0]?.children || [];

const toRegions = (code, list) =>
  list.map(([name, places], i) => ({
    _id: `${code}-${i}`,
    name,
    children: places.map((place, j) => ({
      _id: `${code}-${i}-${j}`,
      name: place,
      parentId: `${code}-${i}`,
    })),
  }));

const Location = () => {
  const router = useRouter();
  const [state, setState] = useState([]); // cities picked for a multi-city post
  const [countries, setCountries] = useState([]);
  const [code, setCode] = useState(US);
  const [loaded, setLoaded] = useState({ code: "", data: null }); // non-US country
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    fetch("/world/index.json")
      .then((r) => r.json())
      .then((list) => setCountries(list.filter((c) => c.k > 0))) // no empty countries
      .catch(() => {
        /* the US list still works without it */
      });
  }, []);

  useEffect(() => {
    if (code === US) return undefined;
    let cancelled = false;
    setLoadError("");
    fetch(`/world/${code}.json`)
      .then((r) => {
        if (!r.ok) throw new Error("missing");
        return r.json();
      })
      .then((data) => !cancelled && setLoaded({ code, data }))
      .catch(() => !cancelled && setLoadError("Could not load the cities."));
    return () => {
      cancelled = true;
    };
  }, [code]);

  const regions = useMemo(() => {
    if (code === US) return usRegions;
    return loaded.code === code && loaded.data ? toRegions(code, loaded.data) : null;
  }, [code, loaded]);

  const countryName = countries.find((c) => c.c === code)?.n || "United States";

  // Multi-city picks are kept by city name: ads are matched by city name.
  const picked = useMemo(() => new Set(state.map((c) => c.name)), [state]);

  const addCities = (list) =>
    setState((prev) => {
      const have = new Set(prev.map((c) => c.name));
      const fresh = [];
      list.forEach((c) => {
        if (have.has(c.name)) return;
        have.add(c.name);
        fresh.push({ _id: c._id, name: c.name, isChecked: true });
      });
      return fresh.length ? [...prev, ...fresh] : prev;
    });

  const removeCities = (list) => {
    const drop = new Set(list.map((c) => c.name));
    setState((prev) => prev.filter((c) => !drop.has(c.name)));
  };

  const toggleGroup = (list, on) => (on ? addCities(list) : removeCities(list));

  const toggleCity = (d) => toggleGroup([d], !picked.has(d.name));

  const citiesName = () => {
    localStorage.setItem("cities", JSON.stringify(state.map((a) => a.name)));
  };

  const isMultiple = router?.query?.location?.[0] == "multiple-city-ads";

  const allCities = useMemo(
    () => (regions ? regions.flatMap((r) => r.children) : []),
    [regions],
  );
  const allPicked = allCities.length > 0 && allCities.every((c) => picked.has(c.name));

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
        <p className='text-lg font-semibold mb-3' style={{color: "var(--text)"}}>
          Or choose a country and city
        </p>
        <select
          className='themed-select notranslate mb-4'
          aria-label='Country'
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{ width: "100%", maxWidth: 320 }}
        >
          {countries.length === 0 && <option value={code}>{countryName}</option>}
          {countries.map((c) => (
            <option key={c.c} value={c.c}>
              {c.n} ({c.k})
            </option>
          ))}
        </select>

        {loadError && (
          <p className='text-sm mb-3' style={{ color: "var(--error)" }}>
            {loadError}
          </p>
        )}
        {!regions && !loadError && (
          <p className='text-sm' style={{ color: "var(--text-muted)" }}>
            Loading cities...
          </p>
        )}

        {regions && isMultiple && (
          <>
            <label className='flex items-center gap-2 text-sm font-semibold mb-4 cursor-pointer w-fit' style={{color: "var(--text)"}}>
              <input
                type='checkbox'
                className='w-4 h-4' style={{accentColor: "var(--accent)"}}
                checked={allPicked}
                onChange={(e) => toggleGroup(allCities, e.target.checked)}
              />
              Select All Cities in {countryName}
            </label>

            <div className='flex flex-col gap-2'>
              {regions.map((c) => (
                <div
                  key={c._id}
                  className='collapse collapse-arrow rounded-xl overflow-hidden' style={{background: "var(--surface)", border: "1px solid var(--border)"}}
                >
                  <input type='checkbox' className='peer' />
                  <div className='collapse-title font-medium text-sm py-3 px-4' style={{color: "var(--text)"}}>
                    {c.name}
                  </div>
                  <div className='collapse-content' style={{background: "var(--surface)"}}>
                    <div className='pt-2 pb-1'>
                      <label className='flex items-center gap-2 text-sm font-semibold mb-3 cursor-pointer w-fit' style={{color: "var(--text-secondary)"}}>
                        <input
                          type='checkbox'
                          className='w-4 h-4' style={{accentColor: "var(--accent)"}}
                          checked={c.children.length > 0 && c.children.every((d) => picked.has(d.name))}
                          onChange={(e) => toggleGroup(c.children, e.target.checked)}
                        />
                        Select all in {c.name}
                      </label>
                      <div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
                        {c.children.map((d) => (
                          <label
                            key={d._id}
                            className='flex items-center gap-2 text-sm cursor-pointer transition-colors' style={{color: "var(--text-secondary)"}}
                          >
                            <input
                              type='checkbox'
                              className='w-4 h-4' style={{accentColor: "var(--accent)"}}
                              checked={picked.has(d.name)}
                              onChange={() => toggleCity(d)}
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
        )}

        {regions && !isMultiple && (
          <div className='flex flex-col gap-2'>
            {regions.map((c) => (
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
                    {c.children.map((d) => (
                      <Link
                        key={d._id}
                        href={`/posts/${router?.query?.location?.[0]}/${encodeURIComponent(d.name)}`}
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
