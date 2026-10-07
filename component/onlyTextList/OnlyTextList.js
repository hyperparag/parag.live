import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const OnlyTextList = ({ data1, data2, category }) => {
  const router = useRouter();

  const SectionHeader = ({ label, filled }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "10px",
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

  const TitleRow = ({ b }) => (
    <Link
      target='_blank'
      rel='noopener noreferrer'
      href={`/post/details/${b._id}?city=${router.query.post}&sub=${category}`}
      className='title-row'
      style={{
        display: "block",
        padding: "10px 12px",
        color: "var(--text)",
        textDecoration: "none",
        fontSize: "0.95rem",
        fontWeight: 500,
        borderBottom: "1px solid var(--border)",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {b.name}
    </Link>
  );

  return (
    <div>
      {data1?.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <SectionHeader label='Premium Ads' filled />
          {data1.map((a, index) => (
            <div key={index}>
              {a.objects.map((b) => (
                <TitleRow key={b._id} b={b} />
              ))}
            </div>
          ))}
        </div>
      )}

      {data2?.length > 0 && (
        <>
          <SectionHeader label='Regular Ads' />
          {data2.map((a, index) => (
            <div key={index}>
              {a.objects.map((b) => (
                <TitleRow key={b._id} b={b} />
              ))}
            </div>
          ))}
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

      <style jsx global>{`
        .title-row:hover {
          background: var(--accent-dim);
        }
      `}</style>
    </div>
  );
};

export default OnlyTextList;
