import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import styles from "../../styles/moduleCss/home.module.css";

/**
 * Pick any country, then any state and city in it.
 *
 * The data is in /public/world: index.json lists every country, and each
 * country has its own file ([[state, [cities]], ...]) that is loaded only when
 * that country is opened. The lists are the site's own areas (public/country.json),
 * plus a capital and a few big cities for countries that list does not cover; see
 * scripts/buildCitySearch.js. Any other city is opened with "Open any city".
 */

const SHOW_FIRST = 24; // cities shown per state before "show more"

const cityHref = (city, place) =>
  `/${encodeURIComponent(city)}${place ? `?state=${encodeURIComponent(place)}` : ""}`;

const linkStyle = {
  color: "var(--text-secondary)",
  textDecoration: "none",
  padding: "4px 10px",
  borderRadius: "6px",
  fontSize: "0.85rem",
  fontWeight: 500,
};

const StateCard = ({ state, cities, forceOpen }) => {
  const [open, setOpen] = useState(false);
  const shown = open || forceOpen ? cities : cities.slice(0, SHOW_FIRST);
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "12px",
        breakInside: "avoid",
        boxShadow: "var(--card-glow)",
      }}
    >
      <h2
        style={{
          fontSize: "1rem",
          fontWeight: 700,
          marginBottom: "12px",
          paddingLeft: "12px",
          borderLeft: "3px solid var(--accent)",
          lineHeight: 1.2,
        }}
      >
        {state}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {shown.map((city) => (
          <Link key={city} href={cityHref(city, state)} style={linkStyle}>
            {city}
          </Link>
        ))}
        {!open && !forceOpen && cities.length > SHOW_FIRST && (
          <button
            onClick={() => setOpen(true)}
            style={{
              ...linkStyle,
              background: "transparent",
              border: "none",
              textAlign: "left",
              cursor: "pointer",
              color: "var(--accent)",
            }}
          >
            Show {cities.length - SHOW_FIRST} more
          </button>
        )}
      </div>
    </div>
  );
};

const Index = () => {
  const router = useRouter();
  const [countries, setCountries] = useState([]);
  const [code, setCode] = useState("US");
  const [states, setStates] = useState(null); // [[state, [cities]], ...]
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [customCity, setCustomCity] = useState("");
  const [customCountry, setCustomCountry] = useState("");

  useEffect(() => {
    fetch("/world/index.json")
      .then((r) => r.json())
      .then((list) => setCountries(list.filter((c) => c.k > 0))) // no empty countries (Tokelau)
      .catch(() => setError("Could not load the country list."));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setStates(null);
    setError("");
    fetch(`/world/${code}.json`)
      .then((r) => {
        if (!r.ok) throw new Error("missing");
        return r.json();
      })
      .then((data) => !cancelled && setStates(data))
      .catch(() => !cancelled && setError("Could not load the cities."));
    return () => {
      cancelled = true;
    };
  }, [code]);

  const country = countries.find((c) => c.c === code);
  const needle = query.trim().toLowerCase();

  // Keep a state if its name matches (all its cities) or some city matches.
  const visible = useMemo(() => {
    if (!states) return [];
    if (!needle) return states;
    return states
      .map(([state, cities]) => {
        if (state.toLowerCase().includes(needle)) return [state, cities];
        const hits = cities.filter((c) => c.toLowerCase().includes(needle));
        return hits.length ? [state, hits] : null;
      })
      .filter(Boolean);
  }, [states, needle]);

  const openCustom = (e) => {
    e.preventDefault();
    const city = customCity.trim();
    if (!city) return;
    router.push(cityHref(city, customCountry.trim()));
  };

  return (
    <div className={styles.container} style={{ color: "var(--text)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 800,
            marginBottom: "6px",
            letterSpacing: "-0.02em",
          }}
        >
          Choose your city
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "16px" }}>
          Free classifieds in cities around the world.
        </p>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
          <select
            className='themed-select notranslate'
            aria-label='Country'
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setQuery("");
            }}
            style={{ width: "auto", minWidth: 220 }}
          >
            {countries.length === 0 && <option value={code}>Loading...</option>}
            {countries.map((c) => (
              <option key={c.c} value={c.c}>
                {c.n} ({c.k})
              </option>
            ))}
          </select>
          <input
            className='themed-input'
            placeholder={`Search a state or city${country ? ` in ${country.n}` : ""}`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: "1 1 260px", maxWidth: 420 }}
          />
        </div>

        {error && <p style={{ color: "var(--error)" }}>{error}</p>}
        {!states && !error && (
          <p style={{ color: "var(--text-muted)" }}>Loading cities...</p>
        )}
        {states && visible.length === 0 && (
          <p style={{ color: "var(--text-muted)" }}>
            No match. Use &quot;Open any city&quot; below to go to a city that
            is not listed.
          </p>
        )}
        {states && visible.length > 0 && (
          <div className='columns-1 sm:columns-2 lg:columns-4 gap-3'>
            {visible.map(([state, cities]) => (
              <StateCard
                key={`${code}-${state}`}
                state={state}
                cities={cities}
                forceOpen={Boolean(needle)}
              />
            ))}
          </div>
        )}

        <form
          onSubmit={openCustom}
          style={{
            marginTop: "28px",
            padding: "20px",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            background: "var(--surface)",
          }}
        >
          <h2 style={{ fontWeight: 700, marginBottom: "6px" }}>Open any city</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "12px" }}>
            Your city or town is not in the list? Type it and go. Ads are shown
            for the city name you enter.
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <input
              className='themed-input'
              placeholder='City'
              required
              value={customCity}
              onChange={(e) => setCustomCity(e.target.value)}
              style={{ flex: "1 1 180px" }}
            />
            <input
              className='themed-input'
              placeholder='State or country (optional)'
              value={customCountry}
              onChange={(e) => setCustomCountry(e.target.value)}
              style={{ flex: "1 1 180px" }}
            />
            <button className='btn-accent' type='submit'>
              Go
            </button>
          </div>
        </form>

        <p style={{ marginTop: "16px", fontSize: "0.75rem", color: "var(--text-muted)" }}>
          City search uses data from <a href='https://www.geonames.org/' style={{ color: "var(--accent)" }}>GeoNames</a>,
          licensed CC BY 4.0.
        </p>
      </div>
    </div>
  );
};

export default Index;
