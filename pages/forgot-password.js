import axios from "axios";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
import { api } from "@/component/utils/api";
const Footer = dynamic(() => import("@/component/footer/footer2"));

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(api("/api/users/forgot-password"), { email: email.trim() });
    } catch (error) {
      // The server gives the same answer either way; show it regardless.
    }
    setSent(true);
    setLoading(false);
  };

  return (
    <div className='page-bg' style={{ display: "flex", flexDirection: "column" }}>
      <Head>
        <link rel='icon' href='/logo.png' />
        <title>Forgot password | Parag</title>
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
            Forgot your password?
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
            {sent ? (
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
                If that email has an account, we have sent a link to choose a
                new password. It works for 1 hour. Check your spam folder too.
              </p>
            ) : (
              <form onSubmit={submit} style={{ display: "grid", gap: "10px" }}>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                  Enter your email and we will send you a link.
                </p>
                <input
                  className='themed-input'
                  type='email'
                  required
                  placeholder='Email'
                  autoComplete='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button className='btn-accent' type='submit' disabled={loading}>
                  {loading ? "Sending..." : "Send reset link"}
                </button>
              </form>
            )}
          </div>
          <p style={{ textAlign: "center", marginTop: "16px", fontSize: "0.85rem" }}>
            <Link href='/login' style={{ color: "var(--accent)" }}>
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
