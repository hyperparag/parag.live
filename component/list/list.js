import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const List = ({ data1, data2, data3, category }) => {
  const router = useRouter();

  const AdCard = ({ b, city, tag }) => (
    <Link
      target='_blank'
      rel='noopener noreferrer'
      href={`/post/details/${b._id}?city=${router.query.post}&sub=${category}`}
      key={b._id}
      style={{
        display: "flex",
        gap: "14px",
        border: tag ? "1px solid var(--text)" : "1px solid var(--border)",
        borderRadius: "10px",
        marginBottom: "8px",
        textDecoration: "none",
        overflow: "hidden",
        transition: "box-shadow 0.2s ease",
        background: "var(--surface)",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.18)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {tag && (
        <span
          style={{
            position: "absolute",
            top: "6px",
            right: "8px",
            background: "var(--text)",
            color: "var(--surface)",
            fontSize: "0.6rem",
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: "3px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {tag}
        </span>
      )}
      <img
        style={{
          width: "100px",
          height: "100px",
          objectFit: "cover",
          flexShrink: 0,
        }}
        src={b.imgOne}
        alt={b.name}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "8px 8px 8px 0",
        }}
      >
        <span
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            color: "var(--text)",
            marginBottom: "4px",
          }}
        >
          {b.name?.slice(0, 100)}
        </span>
        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
          {b.age}
        </span>
      </div>
    </Link>
  );

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
          color: filled ? "var(--surface)" : "var(--text-muted)",
          border: filled ? "none" : "1px solid var(--border)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
    </div>
  );

  return (
    <div>
      {data1?.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <SectionHeader label='Boosted Ads' filled />
          {data1.map((a, index) => (
            <div key={index}>
              {a.objects.map((b) => (
                <AdCard
                  key={b._id}
                  b={b}
                  city={router.query.post?.[0]}
                  tag='Boosted'
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {data2?.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <SectionHeader label='Premium Ads' filled />
          {data2.map((a, index) => (
            <div key={index}>
              {a.objects.map((b) => (
                <AdCard
                  key={b._id}
                  b={b}
                  city={router.query.post?.[0]}
                  tag='Premium'
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {(data3?.length > 0 || (!data1?.length && !data2?.length)) && (
        <>
          <SectionHeader label='Ads' />
          {(data3 ?? []).map((a, index) => (
            <div key={index}>
              {a.objects.map((b) => (
                <AdCard key={b._id} b={b} city={router.query.post} />
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default List;
