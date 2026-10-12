import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const Gallery = ({ data1, data2, category }) => {
  const router = useRouter();

  const SectionHeader = ({ label, filled }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "14px",
        marginTop: "8px",
      }}
    >
      <span
        style={{
          fontWeight: 700,
          fontSize: "0.75rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          padding: "4px 14px",
          borderRadius: "4px",
          background: filled ? "var(--text)" : "transparent",
          color: filled ? "var(--surface)" : "var(--text)",
          border: filled ? "none" : "1px solid var(--text-secondary)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
    </div>
  );

  const Tiles = ({ ads }) => (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px" }}>
      {ads.map((a, index) => (
        <Link
          key={a._id || index}
          target='_blank'
          rel='noopener noreferrer'
          href={`/post/details/${a._id}?city=${router.query.post}&sub=${category}`}
          style={{
            borderRadius: "10px",
            overflow: "hidden",
            border: "1px solid var(--border)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <img
            style={{ height: "300px", objectFit: "cover", display: "block" }}
            src={a.imgOne}
            alt={a.altTexts?.[0] || a.name}
          />
        </Link>
      ))}
    </div>
  );

  return (
    <div>
      {data1?.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <SectionHeader label='Premium Gallery' filled />
          <Tiles ads={data1} />
        </div>
      )}

      {data2?.length > 0 && (
        <>
          <SectionHeader label='Regular Gallery' />
          <Tiles ads={data2} />
        </>
      )}

      {!data1?.length && !data2?.length && (
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "0.9rem",
            textAlign: "center",
            padding: "24px 0",
          }}
        >
          No ads found.
        </p>
      )}
    </div>
  );
};

export default Gallery;
