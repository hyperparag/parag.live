import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const Gallery = ({ data1, category }) => {
  const router = useRouter();
  return (
    <div>
      {data1?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px" }}>
          {data1.map((a, index) => (
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
      )}
    </div>
  );
};

export default Gallery;
