import React, { useEffect, useState } from "react";
import { LANGUAGES, SOURCE_LANGUAGE } from "./languages";

/**
 * Free, whole-page translation using the Google Translate website widget (no
 * API key, no server cost).
 *
 * How it works: the widget translates the page into the language named in the
 * `googtrans` cookie. Picking a language sets that cookie and reloads. The
 * widget script is only loaded when a translation is active, so visitors who
 * read English do not download it.
 *
 * On a first visit, if the browser's language is one we offer, it is chosen
 * automatically. Picking "Original" turns that off.
 */

const COOKIE = "googtrans";
const AUTO_FLAG = "parag-lang-auto"; // set once the auto-detect has run
const SCRIPT_ID = "google-translate-script";

const readCookie = () => {
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : "";
};

// "/en/es" -> "es"
const activeLanguage = () => {
  const value = readCookie();
  const parts = value.split("/");
  return parts.length === 3 ? parts[2] : "";
};

const setCookie = (value) => {
  const host = window.location.hostname;
  const expires = value ? "" : "; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  const base = `${COOKIE}=${value}${expires}; path=/`;
  document.cookie = base;
  // The widget also reads a domain-wide cookie on real domains.
  if (host.includes(".")) document.cookie = `${base}; domain=.${host.replace(/^www\./, "")}`;
};

const safeStorage = {
  get: (key) => {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },
  set: (key, value) => {
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      /* storage can be blocked; ignore */
    }
  },
};

export const changeLanguage = (code) => {
  safeStorage.set(AUTO_FLAG, "1");
  setCookie(!code || code === SOURCE_LANGUAGE ? "" : `/${SOURCE_LANGUAGE}/${code}`);
  window.location.reload();
};

function loadWidget() {
  if (document.getElementById(SCRIPT_ID)) return;
  window.googleTranslateElementInit = () => {
    // eslint-disable-next-line no-new
    new window.google.translate.TranslateElement(
      { pageLanguage: SOURCE_LANGUAGE, autoDisplay: false },
      "google_translate_element",
    );
  };
  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.src =
    "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.body.appendChild(script);
}

/**
 * `compact` renders a small "Translate" select for post and blog pages.
 * `inline` renders just the select, for the header (desktop nav and mobile menu).
 * Without either, a floating language button is shown. Pages that have the
 * header hide it (see `.lang-float` in globals.css), so it no longer sits on top
 * of the scroll-to-top button; it only stays on pages without a header.
 */
const LanguageSwitcher = ({ compact = false, inline = false }) => {
  const [current, setCurrent] = useState("");

  useEffect(() => {
    const active = activeLanguage();
    setCurrent(active);

    if (active) {
      loadWidget();
      return;
    }

    // First visit: use the browser language if we offer it.
    if (!safeStorage.get(AUTO_FLAG)) {
      safeStorage.set(AUTO_FLAG, "1");
      const wanted = (navigator.language || "").trim();
      const match =
        LANGUAGES.find((l) => l.code.toLowerCase() === wanted.toLowerCase()) ||
        LANGUAGES.find((l) => l.code.toLowerCase() === wanted.slice(0, 2).toLowerCase());
      if (match && match.code !== SOURCE_LANGUAGE) {
        setCookie(`/${SOURCE_LANGUAGE}/${match.code}`);
        window.location.reload();
      }
    }
  }, []);

  const select = (
    <select
      className='themed-select notranslate'
      aria-label='Translate this page'
      value={current || SOURCE_LANGUAGE}
      onChange={(e) => changeLanguage(e.target.value)}
      style={{ width: "auto", fontSize: "0.85rem" }}
    >
      {LANGUAGES.map((l) => (
        <option key={l.code} value={l.code}>
          {l.name}
        </option>
      ))}
    </select>
  );

  if (compact) {
    return (
      <span
        className='notranslate'
        style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
      >
        <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
          Translate:
        </span>
        {select}
      </span>
    );
  }

  if (inline) return select;

  return (
    <div
      className='notranslate lang-float'
      style={{ position: "fixed", right: 12, bottom: 12, zIndex: 50 }}
    >
      {select}
      <div id='google_translate_element' style={{ display: "none" }} />
    </div>
  );
};

export default LanguageSwitcher;
