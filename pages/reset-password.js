import axios from "axios";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { api } from "@/component/utils/api";
const Footer = dynamic(() => import("@/component/footer/footer2"));

const ResetPassword = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const { token, email } = router.query;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Use a password of at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("The two passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(api("/api/users/reset-password"), {
        token,
        email,
        password,
      });
      setDone(true);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Could not change the password. Please try again.",
      );
    }
    setLoading(false);
  };

  return (
    <div className='page-bg' style={{ display: "flex", flexDirection: "column" }}>
      <Head>
        <link rel='icon' href='/logo.png' />
        <title>Choose a new password | Parag</title>
        <meta name='robots' content='noindex' />
      </Head>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "64px 16px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "var(--accent)",
              textAlign: "center",
              marginBottom: "16px",
            }}
          >
            Choose a new password
          </h1>
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "32px",
              boxShadow: "var(--shadow)",
            }}
          >
            {done ? (
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                Your password has been changed.{" "}
                <Link href='/login' style={{ color: "var(--accent)" }}>
                  Sign in
                </Link>
              </p>
            ) : (
              <form onSubmit={submit} style={{ display: "grid", gap: "10px" }}>
                <input
                  className='themed-input'
                  type='password'
                  required
                  placeholder='New password (8 or more characters)'
                  autoComplete='new-password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <input
                  className='themed-input'
                  type='password'
                  required
                  placeholder='Confirm new password'
                  autoComplete='new-password'
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
                {error && (
                  <p style={{ fontSize: "0.8rem", color: "var(--error)" }}>{error}</p>
                )}
                <button
                  className='btn-accent'
                  type='submit'
                  disabled={loading || !token || !email}
                >
                  {loading ? "Saving..." : "Change password"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;
