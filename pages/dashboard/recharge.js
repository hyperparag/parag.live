import User from "@/component/user";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import Footer from "@/component/footer/footer";
import Header from "@/component/header/header";
import { useSession } from "next-auth/react";
import { Pagination } from "antd";
import { api, authHeaders } from "@/component/utils/api";

const PAGE_SIZE = 10;

const TABS = [
  { label: "All", kind: "" },
  { label: "Purchases", kind: "recharge" },
  { label: "Credit from admin", kind: "admin-credit" },
  { label: "Ad spend", kind: "ad-spend" },
  { label: "Reposts", kind: "repost" },
  { label: "Referral earnings", kind: "referral-bonus" },
  { label: "Bonus", kind: "earn-bonus" },
  { label: "Converted", kind: "referral-convert" },
];

const KIND_META = {
  recharge: { label: "Credit purchase", color: "var(--success)" },
  "admin-credit": { label: "Credit from admin", color: "var(--success)" },
  "ad-spend": { label: "Ad spend", color: "var(--error)" },
  repost: { label: "Repost", color: "var(--error)" },
  "referral-bonus": { label: "Referral earning", color: "var(--warning)" },
  "referral-convert": { label: "Converted to credit", color: "var(--info, var(--accent))" },
  "earn-bonus": { label: "Earn bonus", color: "var(--warning)" },
};

const money = (n) => `$${Number(n || 0).toFixed(2)}`;

const th = {
  background: "var(--surface-2)",
  color: "var(--text)",
  padding: "10px 12px",
  fontSize: "0.8rem",
  fontWeight: 600,
  textAlign: "left",
  borderBottom: "1px solid var(--border)",
  whiteSpace: "nowrap",
};
const td = {
  padding: "10px 12px",
  color: "var(--text)",
  fontSize: "0.85rem",
};

// Colored badge. Text stays dark/light via the badge background trick:
// translucent tint of the color with the color as border, text in var(--text).
const Badge = ({ color, children }) => (
  <span
    style={{
      display: "inline-block",
      border: `1px solid ${color}`,
      color: "var(--text)",
      padding: "2px 10px",
      borderRadius: "4px",
      fontSize: "0.75rem",
      fontWeight: 600,
      whiteSpace: "nowrap",
    }}
  >
    <span
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: color,
        marginRight: 6,
      }}
    />
    {children}
  </span>
);

const depositStatus = (status) => {
  const s = String(status || "").toLowerCase();
  if (s === "pending") return { label: "Pending", color: "var(--warning)" };
  if (["success", "approved", "completed", "confirmed"].includes(s))
    return { label: "Success", color: "var(--success)" };
  if (["rejected", "failed", "declined", "cancelled", "canceled"].includes(s))
    return {
      label: s.charAt(0).toUpperCase() + s.slice(1),
      color: "var(--error)",
    };
  return {
    label: s ? s.charAt(0).toUpperCase() + s.slice(1) : "Unknown",
    color: "var(--text-muted)",
  };
};

const SummaryCard = ({ title, value, children }) => (
  <div
    style={{
      background: "var(--surface-2)",
      border: "1px solid var(--border)",
      borderRadius: "10px",
      padding: "12px 16px",
    }}
  >
    <p style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>
      {title}
    </p>
    <p
      style={{
        color: "var(--text)",
        fontSize: "1.25rem",
        fontWeight: 700,
        margin: "2px 0",
      }}
    >
      {value}
    </p>
    {children}
  </div>
);

const Dashboards = () => {
  const { users } = User();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [error, setError] = useState("");
  const [kind, setKind] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [summary, setSummary] = useState(null);
  const [deposits, setDeposits] = useState([]);

  async function loadTransactions() {
    setTxLoading(true);
    setError("");
    try {
      const response = await axios.get(api("/api/transaction/mine"), {
        headers: authHeaders(session),
        params: { kind, page, size: PAGE_SIZE },
      });
      setRows(response.data?.data || []);
      setTotal(response.data?.total || 0);
      if (response.data?.summary) setSummary(response.data.summary);
    } catch (e) {
      setRows([]);
      setTotal(0);
      setError(
        e?.response?.data?.message || "Could not load your transactions.",
      );
    } finally {
      setTxLoading(false);
    }
  }

  async function loadDeposits() {
    setLoading(true);
    try {
      const response = await axios.get(
        api(`/api/deposit/get/${session?.user?.id}`),
        { headers: authHeaders(session) },
      );
      setDeposits(response.data?.deposits || []);
    } catch (e) {
      setDeposits([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (session) loadTransactions();
  }, [session?.user?.email, kind, page]);

  useEffect(() => {
    if (session) loadDeposits();
  }, [session?.user?.email]);

  const credit = summary?.credit ?? users?.credit ?? session?.user?.credit;

  return (
    <div className='page-bg' style={{ minHeight: "100vh" }}>
      <Head>
        <title>Transaction History</title>
      </Head>
      <Header />
      <div
        style={{ maxWidth: "1000px", margin: "24px auto", padding: "0 16px" }}
      >
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "var(--shadow)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "20px",
              paddingBottom: "16px",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <span
              className='btn-accent'
              style={{
                display: "inline-block",
                padding: "6px 16px",
                borderRadius: "8px",
                fontSize: "0.85rem",
              }}
            >
              Credits : {Number(credit || 0).toFixed(2)}
            </span>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
              {session?.user?.email}
            </p>
          </div>

          <div
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "12px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <span style={{ display: "flex", gap: "24px" }}>
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
                My Profile
              </Link>
              <span
                style={{
                  color: "var(--accent)",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
              >
                Transaction History
              </span>
            </span>
            <Link
              className='btn-accent'
              style={{
                padding: "6px 16px",
                borderRadius: "6px",
                fontSize: "0.8rem",
                fontWeight: 700,
              }}
              href={`/recharge-credits/`}
            >
              Buy Credit
            </Link>
          </div>

          {/* Summary cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <SummaryCard title='Credit balance' value={money(credit)} />
            <SummaryCard title='Purchased' value={money(summary?.purchased)} />
            <SummaryCard title='Spent' value={money(summary?.spent)} />
            <SummaryCard
              title='Referral / bonus earned'
              value={money(summary?.earned)}
            />
            <SummaryCard
              title='Available to convert'
              value={money(summary?.available)}
            >
              <Link
                href='/dashboard/profile'
                style={{
                  color: "var(--accent)",
                  fontSize: "0.75rem",
                  textDecoration: "underline",
                }}
              >
                Convert in profile
              </Link>
            </SummaryCard>
          </div>

          {/* Filter tabs */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            {TABS.map((t) => {
              const active = kind === t.kind;
              return (
                <button
                  key={t.label}
                  type='button'
                  onClick={() => {
                    setKind(t.kind);
                    setPage(1);
                  }}
                  className={active ? "btn-accent" : undefined}
                  style={{
                    padding: "5px 14px",
                    borderRadius: "999px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    ...(active
                      ? {}
                      : {
                          background: "transparent",
                          color: "var(--text-secondary)",
                          border: "1px solid var(--border)",
                        }),
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {error && (
            <p style={{ color: "var(--error)", marginBottom: "12px" }}>
              {error}
            </p>
          )}

          {txLoading ? (
            <div className='themed-loader' style={{ minHeight: "200px" }}>
              <img
                width={60}
                src='/loader.gif'
                alt='loading'
                style={{ opacity: 0.7 }}
              />
            </div>
          ) : rows.length === 0 ? (
            <p
              style={{
                fontSize: "1.1rem",
                textAlign: "center",
                color: "var(--text-muted)",
                padding: "40px 0",
              }}
            >
              No transactions found
            </p>
          ) : (
            <>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {["Date", "Type", "Amount", "Reference / note"].map(
                        (h) => (
                          <th key={h} style={th}>
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => {
                      const meta = KIND_META[r.kind] || {
                        label: r.kind || "Other",
                        color: "var(--text-muted)",
                      };
                      const plus = r.flow !== "debit";
                      const neutral = r.flow === "convert";
                      return (
                        <tr
                          key={r._id}
                          style={{ borderBottom: "1px solid var(--border)" }}
                        >
                          <td style={{ ...td, whiteSpace: "nowrap" }}>
                            {new Date(r.createdAt).toLocaleString()}
                          </td>
                          <td style={td}>
                            <Badge color={meta.color}>{meta.label}</Badge>
                          </td>
                          <td
                            style={{
                              ...td,
                              fontWeight: 700,
                              whiteSpace: "nowrap",
                              color: neutral
                                ? "var(--text)"
                                : plus
                                  ? "var(--success)"
                                  : "var(--error)",
                            }}
                          >
                            {neutral ? "" : plus ? "+" : "-"}
                            {money(Math.abs(r.amount))}
                          </td>
                          <td
                            style={{
                              ...td,
                              color: "var(--text-secondary)",
                              wordBreak: "break-word",
                            }}
                          >
                            {[r.invoice, r.note].filter(Boolean).join(" - ") ||
                              "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {total > PAGE_SIZE && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "16px",
                  }}
                >
                  <Pagination
                    current={page}
                    pageSize={PAGE_SIZE}
                    total={total}
                    showSizeChanger={false}
                    onChange={(p) => setPage(p)}
                  />
                </div>
              )}
            </>
          )}

          {/* Manual crypto deposits (pending ones are not in the ledger yet) */}
          <h2
            style={{
              color: "var(--text)",
              fontSize: "1.1rem",
              fontWeight: 700,
              margin: "32px 0 12px",
            }}
          >
            Crypto deposits
          </h2>
          {loading ? (
            <p style={{ color: "var(--text-muted)" }}>Loading...</p>
          ) : deposits.length === 0 ? (
            <p style={{ color: "var(--text-muted)", padding: "16px 0" }}>
              No crypto deposits yet
            </p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {[
                      "Date",
                      "Provider",
                      "Status",
                      "Amount",
                      "TRX",
                      "Referral code",
                    ].map((h) => (
                      <th key={h} style={th}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {deposits.map((a, index) => {
                    const st = depositStatus(a?.status);
                    return (
                      <tr
                        key={a?._id || index}
                        style={{ borderBottom: "1px solid var(--border)" }}
                      >
                        <td style={{ ...td, whiteSpace: "nowrap" }}>
                          {new Date(a?.createdAt).toDateString()}
                        </td>
                        <td style={td}>{a?.provider}</td>
                        <td style={td}>
                          <Badge color={st.color}>{st.label}</Badge>
                        </td>
                        <td
                          style={{
                            ...td,
                            color: "var(--accent)",
                            fontWeight: 700,
                          }}
                        >
                          ${a?.amount}
                        </td>
                        <td
                          style={{
                            ...td,
                            color: "var(--text-secondary)",
                            wordBreak: "break-all",
                          }}
                        >
                          {a?.trxid}
                        </td>
                        <td
                          style={{ ...td, color: "var(--text-secondary)" }}
                        >
                          {a?.referralCode || "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboards;
