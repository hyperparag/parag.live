import React, { useEffect, useState } from "react";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillTwitterSquare,
} from "react-icons/ai";
import Link from "next/link";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { BsPinterest } from "react-icons/bs";

const Footer = () => {
  const [user, setUser] = useState();

  const usersStringfy = Cookies.get("token");
  useEffect(() => {
    if (usersStringfy) {
      const user = jwt_decode(usersStringfy);
      setUser(user);
    }
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about-us", label: "About Us" },
    { href: "/contact-us", label: "Contact Us" },
    { href: "/blogs", label: "Blogs" },
    { href: "/privacy-policy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ];

  const socialLinks = [
    {
      href: "#",
      icon: AiFillFacebook,
      label: "Facebook",
    },
    {
      href: "https://www.instagram.com/#/",
      icon: AiFillInstagram,
      label: "Instagram",
    },
    {
      href: "https://twitter.com/#",
      icon: AiFillTwitterSquare,
      label: "Twitter",
    },
    {
      href: "https://www.pinterest.com/#/",
      icon: BsPinterest,
      label: "Pinterest",
    },
  ];

  return (
    <footer
      style={{
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        marginTop: "40px",
        padding: "40px 16px 24px",
      }}
    >
      {/* Nav links */}
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        {navLinks.map((l) => (
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

      {/* Divider */}
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto 24px",
          borderTop: "1px solid var(--border)",
        }}
      />

      {/* Social icons */}
      {/* <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        {socialLinks.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.href}
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
                style={{
                  width: "20px",
                  height: "20px",
                  display: "block",
                  color: "inherit",
                }}
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
    </footer>
  );
};

export default Footer;
