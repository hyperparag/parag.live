import React, { useEffect, useState } from "react";
import {
  AiFillFacebook,
  AiFillTwitterSquare,
  AiFillInstagram,
} from "react-icons/ai";
import { BsPinterest } from "react-icons/bs";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import Link from "next/link";

const Footer = () => {
  const [user, setUser] = useState();

  const usersStringfy = Cookies.get("token");
  useEffect(() => {
    if (usersStringfy) {
      const user = jwt_decode(usersStringfy);
      setUser(user);
    }
  }, []);

  const socialLinks = [
    { href: "#", icon: AiFillFacebook, label: "Facebook" },
    { href: "", icon: AiFillInstagram, label: "Instagram" },
    { href: "#", icon: AiFillTwitterSquare, label: "Twitter" },
    { href: "#", icon: BsPinterest, label: "Pinterest" },
  ];

  return (
    <footer
      style={{
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        marginTop: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "40px 24px 24px",
        }}
      >
        {/* Nav links */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          {[
            { href: "/", label: "Home" },
            { href: "/about-us", label: "About Us" },
            { href: "/contact-us", label: "Contact" },
            { href: "/blogs", label: "Blogs" },
            { href: "/privacy-policy", label: "Privacy" },
            { href: "/terms", label: "Terms" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                color: "var(--text-secondary)",
                textDecoration: "none",
                fontSize: "0.85rem",
                fontWeight: 500,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "var(--accent)")}
              onMouseLeave={(e) =>
                (e.target.style.color = "var(--text-secondary)")
              }
            >
              {l.label}
            </Link>
          ))}
          {user?._id && (
            <Link
              href='/recharge-credits/'
              style={{
                color: "var(--text-secondary)",
                textDecoration: "none",
                fontSize: "0.85rem",
                fontWeight: 500,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "var(--accent)")}
              onMouseLeave={(e) =>
                (e.target.style.color = "var(--text-secondary)")
              }
            >
              Buy Credit
            </Link>
          )}
        </div>

        {/* <hr
          style={{
            border: "none",
            borderTop: "1px solid var(--border)",
            marginBottom: "24px",
          }}
        /> */}

        {/* SEO links */}
        {/* <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "16px",
            marginBottom: "28px",
          }}
        >
          {[
            { href: "/skip-the-games", label: "Parag" },
            { href: "/female-escort", label: "Female Escort" },
            {
              href: "/tryst-san-antonio-escorts",
              label: "Tryst San Antonio Escorts",
            },
            { href: "/skipthe-games", label: "Parag Games" },
            { href: "/skip-yhe-games", label: "Parag Live" },
            { href: "#", label: "Parag Ads" },
            { href: "/tescorts", label: "Tescorts" },
            { href: "/skip-the-games-wv", label: "Parag WV" },
            {
              href: "/skip-the-games-hudson-valley",
              label: "Parag Hudson Valley",
            },
            { href: "/skip-the-games-worcester", label: "Parag Worcester" },
            { href: "/skip-the-games-cape-cod", label: "Parag Cape Cod" },
          ].map((l) => (
            <Link
              key={l.href + l.label}
              href={l.href}
              style={{
                color: "var(--text-muted)",
                textDecoration: "none",
                fontSize: "0.75rem",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "var(--accent)")}
              onMouseLeave={(e) => (e.target.style.color = "var(--text-muted)")}
            >
              {l.label}
            </Link>
          ))}
        </div> */}

        <hr
          style={{
            border: "none",
            borderTop: "1px solid var(--border)",
            marginBottom: "20px",
          }}
        />

        {/* Social icons */}
        {/* <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          {socialLinks.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.label}
                href={s.href}
                target='_blank'
                rel='noopener noreferrer'
                title={s.label}
                style={{
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  border: "1px solid var(--border)",
                  color: "var(--text-muted)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.color = "var(--accent)";
                  e.currentTarget.style.background = "var(--accent-dim)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--text-muted)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <Icon
                  style={{ width: "18px", height: "18px", color: "inherit" }}
                />
              </Link>
            );
          })}
        </div> */}

        {/* Copyright */}
        <p
          style={{
            textAlign: "center",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
          }}
        >
          Copyright &copy; 2009 &ndash; 2026. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
