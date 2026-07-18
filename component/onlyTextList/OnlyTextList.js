import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const OnlyTextList = ({ data1, data2, category }) => {
  const router = useRouter();

  const SectionHeader = ({ label, premium }) => (
    <div
      style={{
        background: premium
          ? "linear-gradient(90deg, var(--accent), transparent)"
          : "linear-gradient(90deg, var(--text-muted), transparent)",
        padding: "8px 16px",
        borderRadius: "8px",
        marginBottom: "12px",
        width: "fit-content",
        minWidth: "60%",
      }}
    >
      <span style={{ color: "#fff", fontWeight: 700, fontSize: "1rem" }}>
        {label}
      </span>
    </div>
  );

  return (
    <div>
      {data1?.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <SectionHeader label="Premium Ads" premium />
          {data1.map((a, index) => (
            <div key={index}>
              <ul>
                {a.objects.map((b) => (
                  <Link
                    target='_blank'
                    rel='noopener noreferrer'
                    href={`/post/details/${b._id}?city=${router.query.post}&sub=${category}`}
                    key={b._id}
                    style={{
                      display: "block",
                      padding: "8px 12px",
                      margin: "4px 0",
                      color: "var(--accent)",
                      textDecoration: "none",
                      fontSize: "1rem",
                      fontWeight: 500,
                      borderRadius: "6px",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => (e.target.style.background = "var(--accent-dim)")}
                    onMouseLeave={(e) => (e.target.style.background = "transparent")}
                  >
                    {b.name}
                  </Link>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <SectionHeader label="Regular Ads" />
      {data2.map((a, index) => (
        <div key={index}>
          <ul>
            {a.objects.map((b) => (
              <Link
                target='_blank'
                rel='noopener noreferrer'
                href={`/post/details/${b._id}?city=${router.query.post}&sub=${category}`}
                key={b._id}
                style={{
                  display: "block",
                  padding: "8px 12px",
                  margin: "4px 0",
                  color: "var(--accent)",
                  textDecoration: "none",
                  fontSize: "1rem",
                  fontWeight: 500,
                  borderRadius: "6px",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.target.style.background = "var(--accent-dim)")}
                onMouseLeave={(e) => (e.target.style.background = "transparent")}
              >
                {b.name} - <span style={{ color: "var(--text-muted)" }}>{b.age}</span>
              </Link>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default OnlyTextList;
