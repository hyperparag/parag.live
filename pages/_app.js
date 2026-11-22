import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Script from "next/script";
import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import LanguageSwitcher from "@/component/translate/LanguageSwitcher";
import "react-quill/dist/quill.snow.css";
import InPagePushAd from "@/component/InPagePushAd";

export const MyContext = createContext();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const [blogcurrent, setBlogCurrent] = useState(1);
  const [catKey, setCatKey] = useState("");

  // Remember the referral code from a ?ref=CODE link for 30 days, so it can be
  // attached when the visitor signs up.
  useEffect(() => {
    try {
      const ref = new URLSearchParams(window.location.search).get("ref");
      if (ref && /^[A-Za-z0-9]{4,16}$/.test(ref)) {
        Cookies.set("ref", ref.toUpperCase(), { expires: 30, sameSite: "lax" });
      }
    } catch (e) {
      /* a blocked cookie must not break the page */
    }
  }, []);

  return (
    <SessionProvider session={session}>
      <MyContext.Provider
        value={{ blogcurrent, setBlogCurrent, catKey, setCatKey }}
      >
        <Component {...pageProps} />
        <LanguageSwitcher />
        {/* <InPagePushAd /> */}
      </MyContext.Provider>
    </SessionProvider>
  );
}
