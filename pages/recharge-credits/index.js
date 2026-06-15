import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
const Header = dynamic(() => import("@/component/header/header"));
const Footer = dynamic(() => import("@/component/footer/footer2"));
import { useSession } from "next-auth/react";
import Link from "next/link";
import Deposit from "@/component/diposit/deposit";
import User from "@/component/user";

const Credits = () => {
  const { data: session } = useSession();
  const { users } = User();
  return (
    <div className='page-bg' style={{ minHeight: "100vh" }}>
      <Header></Header>
      <div
        style={{ maxWidth: "900px", margin: "24px auto", padding: "0 16px" }}
      >
        <div
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "12px 20px",
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              color: "var(--accent)",
              fontWeight: 600,
              fontSize: "0.85rem",
            }}
          >
            Buy Credits
          </span>
          <Link
            href={"/dashboard/profile"}
            style={{
              color: "var(--text-secondary)",
              fontWeight: 600,
              fontSize: "0.85rem",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => (e.target.style.color = "var(--accent)")}
            onMouseLeave={(e) =>
              (e.target.style.color = "var(--text-secondary)")
            }
          >
            My Account
          </Link>
          <Link
            href={"/support"}
            style={{
              color: "var(--text-secondary)",
              fontWeight: 600,
              fontSize: "0.85rem",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => (e.target.style.color = "var(--accent)")}
            onMouseLeave={(e) =>
              (e.target.style.color = "var(--text-secondary)")
            }
          >
            Support
          </Link>
          <Link
            href={"/verify"}
            style={{
              color: "var(--text-secondary)",
              fontWeight: 600,
              fontSize: "0.85rem",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => (e.target.style.color = "var(--accent)")}
            onMouseLeave={(e) =>
              (e.target.style.color = "var(--text-secondary)")
            }
          >
            Verify
          </Link>
        </div>

        <div style={{ marginTop: "24px", color: "var(--text)" }}>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--text)",
            }}
          >
            Your Current Account Balance : $ {users?.credit?.toFixed(2)}
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              marginTop: "8px",
              lineHeight: 1.7,
            }}
          >
            Add Credits in your Parag account to post & upgrade your Ad. <br />
            After one ads promotion, remaining credits will be still available
            in your account for feature ads promotions!
          </p>
        </div>

        <Deposit />

        <div
          style={{
            maxWidth: "600px",
            margin: "24px auto",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <p
              style={{
                color: "var(--success)",
                fontSize: "1.3rem",
                fontWeight: 700,
              }}
            >
              Bonus Offers
            </p>
            <img style={{ width: "40px" }} src='/rose.gif' />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            {[
              { text: "Diposit $100 to get $120" },
              { text: "Diposit $200 to get $250" },
              { text: "Diposit $500 to get $650" },
              { text: "Diposit $1000 to get $1500" },
            ].map((item, i) => (
              <button
                key={i}
                style={{
                  border: "2px dotted var(--accent)",
                  background: "transparent",
                  color: "var(--text)",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  padding: "10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.borderColor = "var(--accent-hover)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.borderColor = "var(--accent)")
                }
              >
                {item.text}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            background: "var(--surface)",
            border: "2px dashed var(--success)",
            borderRadius: "12px",
            padding: "24px",
            marginTop: "24px",
          }}
        >
          <h1
            style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: "8px",
            }}
          >
            How do I buy Bitcoin ?
          </h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "12px" }}>
            You can buy Bitcon from several place:
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {[
              {
                label: "Cashapp",
                href: "https://www.youtube.com/watch?v=HK57o2JQDeI",
              },
              { label: "Coinbase", href: "https://www.coinbase.com/signin" },
              { label: "abra.com", href: "https://abra.com/" },
              { label: "bitcoin.com", href: "https://bitcoin.com/" },
              { label: "binance.com", href: "https://bitcoin.com/" },
            ].map((item, i) => (
              <a
                key={i}
                href={item.href}
                target='_blank'
                rel='noopener noreferrer'
                style={{
                  background: "var(--accent)",
                  color: "#fff",
                  padding: "6px 16px",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background = "var(--accent-hover)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "var(--accent)")
                }
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Credits;
