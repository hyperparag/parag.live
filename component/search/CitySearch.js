import React, { useEffect, useId, useRef, useState } from "react";
import {
  closestCities,
  loadCountryNames,
  searchCities,
} from "@/component/utils/citySearch";

/**
 * A search box for any city in the world.
 *
 * Type two letters and the cities that start with them appear, with their state
 * and country. When nothing matches it suggests similar spellings, and for a
 * small place the site does not list it shows the nearest cities that it does.
 *
 * onSelect gets { name, state, cc, country, custom }. `custom` is true when the
 * person chose to use exactly what they typed (only offered with allowCustom).
 */

const DEBOUNCE_MS = 180;
const IDLE = { status: "idle", results: [], didYouMean: [], nearby: [] };

const muted = { color: "var(--text-muted)", fontSize: "0.8rem" };
const sectionLabel = {
  ...muted,
  padding: "8px 12px 4px",
  fontWeight: 600,
};

const CitySearch = ({
  onSelect,
  placeholder = "Search any city in the world",
  allowCustom = false,
  customLabel = "Use",
  autoFocus = false,
}) => {
  const listId = useId();
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [found, setFound] = useState(IDLE);
  const [countries, setCountries] = useState({});
  const latest = useRef(0);

  useEffect(() => {
    loadCountryNames().then(setCountries).catch(() => {});
  }, []);

  useEffect(() => {
    const q = text.trim();
    latest.current += 1;
    const mine = latest.current;
    setActive(-1);
    if (q.length < 2) {
      setFound(IDLE);
      return undefined;
    }
    setFound((f) => ({ ...f, status: "loading" }));
    const timer = setTimeout(async () => {
      try {
        const results = await searchCities(q, 8);
        if (mine !== latest.current) return;
        if (results.length > 0) {
          setFound({ status: "results", results, didYouMean: [], nearby: [] });
          return;
        }
        const closest = await closestCities(q);
        if (mine !== latest.current) return;
        setFound({ status: "none", results: [], ...closest });
      } catch {
        if (mine === latest.current) setFound({ ...IDLE, status: "error" });
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [text]);

  const typed = text.trim();
  const countryOf = (cc) => countries[cc] || cc;

  // Every choice in the order it is shown, so the arrow keys can walk them.
  const options = [];
  found.results.forEach((c) => options.push(c));
  found.didYouMean.forEach((c) => options.push(c));
  found.nearby.forEach((n) => n.cities.forEach((c) => options.push(c)));
  const offerCustom =
    allowCustom &&
    typed.length >= 2 &&
    found.status !== "loading" &&
    !found.results.some((c) => c.name.toLowerCase() === typed.toLowerCase());
  if (offerCustom) {
    options.push({ name: typed, state: "", cc: "", custom: true });
  }

  const pick = (option) => {
    onSelect({
      name: option.name,
      state: option.state || "",
      cc: option.cc || "",
      country: option.cc ? countryOf(option.cc) : "",
      custom: Boolean(option.custom),
    });
    setText("");
    setFound(IDLE);
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(-1, i - 1));
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Enter") {
      e.preventDefault(); // this box sits inside pages that have forms
      if (found.status === "loading") return; // the list on screen is for older text
      const chosen = options[active >= 0 ? active : 0];
      if (chosen) pick(chosen);
    }
  };

  const row = (option, index, extra) => (
    <button
      key={`${index}-${option.name}-${option.cc}-${option.state}`}
      type='button'
      id={`${listId}-${index}`}
      role='option'
      aria-selected={active === index}
      onMouseEnter={() => setActive(index)}
      onClick={() => pick(option)}
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        width: "100%",
        textAlign: "left",
        padding: "8px 12px",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
        color: "var(--text)",
        fontSize: "0.9rem",
        background: active === index ? "var(--accent-dim)" : "transparent",
      }}
    >
      <span>
        {option.custom ? (
          <>
            {customLabel} <strong>&ldquo;{option.name}&rdquo;</strong>
          </>
        ) : (
          <>
            <strong>{option.name}</strong>
            <span style={{ ...muted, marginLeft: 8 }}>
              {[option.state, countryOf(option.cc)].filter(Boolean).join(", ")}
            </span>
          </>
        )}
      </span>
      {extra && <span style={muted}>{extra}</span>}
    </button>
  );

  // Running index into `options` while rendering the sections below.
  let n = 0;
  const showPanel = open && typed.length >= 2;
  const kmLabel = (km) => (km < 1 ? "<1 km" : `${km} km`);

  return (
    <div
      style={{ position: "relative" }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <input
        className='themed-input'
        type='search'
        role='combobox'
        aria-expanded={showPanel}
        aria-controls={listId}
        aria-autocomplete='list'
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
        autoComplete='off'
        autoFocus={autoFocus}
        placeholder={placeholder}
        value={text}
        maxLength={80}
        onChange={(e) => {
          setText(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        style={{ width: "100%" }}
      />

      {showPanel && (
        <div
          id={listId}
          role='listbox'
          className='notranslate'
          // Keep focus in the input while a row is clicked; otherwise Safari
          // closes the list before the click lands.
          onMouseDown={(e) => e.preventDefault()}
          style={{
            position: "absolute",
            zIndex: 30,
            left: 0,
            right: 0,
            top: "calc(100% + 6px)",
            maxHeight: 360,
            overflowY: "auto",
            padding: 6,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            boxShadow: "var(--shadow)",
          }}
        >
          {found.status === "loading" && (
            <p style={{ ...muted, padding: "8px 12px" }}>Searching...</p>
          )}

          {found.status === "error" && (
            <p style={{ ...muted, padding: "8px 12px" }}>
              Could not load the city list. Check your connection and try again.
            </p>
          )}

          {found.results.map((c) => row(c, n++))}

          {found.status === "none" && (
            <>
              <p style={{ ...muted, padding: "8px 12px" }}>
                &ldquo;{typed}&rdquo; is not in our list.
              </p>
              {found.didYouMean.length > 0 && (
                <>
                  <p style={sectionLabel}>Did you mean</p>
                  {found.didYouMean.map((c) => row(c, n++))}
                </>
              )}
              {found.nearby.map((place) => (
                <React.Fragment key={`${place.place.cc}-${place.place.name}`}>
                  <p style={sectionLabel}>
                    Closest cities to {place.place.name}, {countryOf(place.place.cc)}
                  </p>
                  {place.cities.map((c) => row(c, n++, kmLabel(c.km)))}
                </React.Fragment>
              ))}
              {found.didYouMean.length === 0 && found.nearby.length === 0 && (
                <p style={{ ...muted, padding: "0 12px 8px" }}>
                  Check the spelling, or try the name in English.
                </p>
              )}
            </>
          )}

          {offerCustom && (
            <>
              {options.length > 1 && (
                <div
                  style={{ borderTop: "1px solid var(--border)", margin: "6px 0" }}
                />
              )}
              {row(options[options.length - 1], options.length - 1)}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CitySearch;
