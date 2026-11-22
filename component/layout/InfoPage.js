import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";

const Footer = dynamic(() => import("@/component/footer/footer"));
const Header = dynamic(() => import("@/component/header/header"));

export const textStyle = {
  color: "var(--text-secondary)",
  lineHeight: 1.8,
  marginBottom: "12px",
};

export const headingStyle = {
  fontWeight: 700,
  color: "var(--text)",
  marginBottom: "8px",
  marginTop: "24px",
  fontSize: "1.1rem",
};

export const listStyle = {
  margin: "0 0 12px 24px",
  color: "var(--text-secondary)",
  lineHeight: 1.8,
};

/** Shared shell for plain text pages (about, contact, DMCA, referral...). */
const InfoPage = ({ title, description, path, children }) => (
  <div className='page-bg'>
    <Head>
      <title>{`${title} | Parag`}</title>
      {description && <meta name='description' content={description} />}
      <link rel='icon' href='/logo.png' />
      {path && <link rel='canonical' href={`https://parag.live${path}`} />}
    </Head>
    <Header />
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 16px" }}>
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "32px",
          boxShadow: "var(--shadow)",
        }}
      >
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--accent)",
            marginBottom: "16px",
          }}
        >
          {title}
        </h1>
        <hr
          style={{
            border: "none",
            borderTop: "1px solid var(--border)",
            marginBottom: "20px",
          }}
        />
        {children}
      </div>
    </div>
    <Footer />
  </div>
);

export default InfoPage;
