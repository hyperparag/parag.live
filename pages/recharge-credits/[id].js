import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
const Header = dynamic(() => import("@/component/header/header"));
const Footer = dynamic(() => import("@/component/footer/footer2"));
import style from "../../styles/moduleCss/credit.module.css";
import axios from "axios";
import User from "@/component/user";
import Link from "next/link";

const Credits = () => {
  const [amount, setAmount] = useState(10);
  const [loading, setLoading] = useState(false);
  // Referral code, applied at purchase time: the referrer is credited 50% of
  // what is paid here once the payment confirms.
  const [referralCode, setReferralCode] = useState("");
  const [referralError, setReferralError] = useState("");
  const usersStringfy = Cookies.get("token");
  const { users } = User();
  const router = useRouter();
  const id = router?.query?.id;

  useEffect(() => {
    if (!id) {
      return;
    }
    if (!users?._id) {
      return;
    }
    if (users?._id !== id) {
      Cookies.remove("token");
      router.push("/login");
    }
  }, [id]);

  let requested = false;

  async function recharge(e) {
    e.preventDefault();
    setLoading(true);
    setReferralError("");
    if (requested) return;
    requested = true;
    try {
      const response = await axios.post(
        `  https://paraglive-backend.vercel.app/api/recharge/${id}`,
        { amount, referralCode: referralCode.trim().toUpperCase() || undefined },
        {
          headers: {
            authorization: `Bearer ${usersStringfy}`,
          },
        },
      );
      const data = response.data;

      setLoading(false);
      if (data?.redirectURI) {
        location.href = data.redirectURI;
      }
    } catch (error) {
      setLoading(false);
      requested = false;
      // The server rejects an unknown code, or your own code, with a 422 so you
      // find out here rather than after paying.
      const message = error?.response?.data?.message;
      if (error?.response?.status === 422 && message) {
        setReferralError(message);
      } else {
        console.error(error);
      }
    }
  }

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
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
            Your Current Account Balance: $ {users?.credit?.toFixed(2)}
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              marginTop: "8px",
              lineHeight: 1.7,
            }}
          >
            Add Credits in your parag account to post & upgrade your Ad. <br />
            After one ads promotion, remaining credits will be still available
            in your account for feature ads promotions!
          </p>
        </div>

        <form onSubmit={recharge}>
          <div className={style.container}>
            <h1
              style={{
                fontSize: "1.3rem",
                fontWeight: 700,
                color: "var(--text)",
                marginBottom: "16px",
              }}
            >
              Recharge Credits -
            </h1>
            <div>
              <h1
                style={{
                  fontSize: "0.95rem",
                  color: "var(--text)",
                  marginBottom: "6px",
                }}
              >
                Select Amount
              </h1>
              <input
                className='themed-input'
                placeholder='Input Amount'
                required
                type='number'
                min={10}
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </div>
            <small style={{ color: "var(--error)", fontSize: "0.75rem" }}>
              Minimum deposit amount is $10
            </small>

            <div style={{ marginTop: "12px" }}>
              <label
                style={{
                  cursor: "pointer",
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                <input
                  type='checkbox'
                  required
                  style={{ accentColor: "var(--accent)" }}
                />
                <Link
                  href='/terms'
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.85rem",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "var(--accent)")}
                  onMouseLeave={(e) =>
                    (e.target.style.color = "var(--text-secondary)")
                  }
                >
                  I agree to Terms and Conditions
                </Link>
              </label>
            </div>
            <div style={{ marginTop: "16px" }}>
              <label
                htmlFor='referralCode'
                style={{
                  display: "block",
                  color: "var(--text)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  marginBottom: "6px",
                }}
              >
                Referral code{" "}
                <span
                  style={{ color: "var(--text-muted)", fontWeight: 400 }}
                >
                  (optional)
                </span>
              </label>
              <input
                id='referralCode'
                type='text'
                value={referralCode}
                onChange={(e) => {
                  setReferralCode(e.target.value.toUpperCase());
                  setReferralError("");
                }}
                placeholder='e.g. K7MPQR24'
                maxLength={16}
                className='themed-input'
                style={{ maxWidth: "260px", letterSpacing: "0.08em" }}
              />
              {referralError ? (
                <p
                  style={{
                    color: "var(--error)",
                    fontSize: "0.8rem",
                    marginTop: "6px",
                  }}
                >
                  {referralError}
                </p>
              ) : (
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.8rem",
                    marginTop: "6px",
                  }}
                >
                  If someone invited you, enter their code and they receive 50%
                  of this purchase as posting credit.
                </p>
              )}
            </div>

            <button
              className='btn-accent'
              style={{ marginTop: "16px", padding: "10px 32px" }}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>

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
            {[100, 200, 500, 1000].map((val) => (
              <button
                key={val}
                onClick={() => setAmount(val)}
                style={{
                  border:
                    amount == val
                      ? "2px solid var(--accent)"
                      : "2px dotted var(--border)",
                  background:
                    amount == val ? "var(--surface-2)" : "transparent",
                  color: "var(--text)",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  padding: "10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "3px",
                    border:
                      amount == val
                        ? "2px solid var(--accent)"
                        : "2px solid var(--border)",
                    background: amount == val ? "var(--accent)" : "transparent",
                    display: "inline-block",
                  }}
                />
                Diposit ${val} to get $
                {val === 100
                  ? 120
                  : val === 200
                    ? 250
                    : val === 500
                      ? 650
                      : 1500}
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
              { label: "binance.com", href: "https://www.binance.com/" },
            ].map((item, i) => (
              <a
                key={i}
                href={item.href}
                target='_blank'
                rel='noopener noreferrer'
                className='btn-accent'
                style={{
                  padding: "6px 16px",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
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
