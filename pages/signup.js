import axios from "axios";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { api } from "@/component/utils/api";
const Footer = dynamic(() => import("@/component/footer/footer2"));

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirm: "",
};

// Sign up with an email address, for people who do not have a Google account.
const Signup = () => {
  const router = useRouter();
  const [state, setState] = useState(initialState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setState({ ...state, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (state.password.length < 8) {
      setError("Use a password of at least 8 characters.");
      return;
    }
    if (state.password !== state.confirm) {
      setError("The two passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(api("/api/users"), {
        firstName: state.firstName.trim(),
        lastName: state.lastName.trim(),
        email: state.email.trim(),
        password: state.password,
        // From the visitor's ?ref= link, if they came through one.
        ref: Cookies.get("ref"),
      });
      const result = await signIn("credentials", {
        email: state.email.trim(),
        password: state.password,
        redirect: false,
      });
      if (result?.ok) router.push("/user/edit/me");
      else router.push("/login");
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Could not create your account. Please try again.",
      );
      setLoading(false);
    }
  };

  return (
    <div className='page-bg' style={{ display: "flex", flexDirection: "column" }}>
      <Head>
        <link rel='icon' href='/logo.png' />
        <title>Sign up | Parag</title>
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
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                color: "var(--accent)",
                marginBottom: "4px",
              }}
            >
              PARAG
            </h1>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Create your account
            </p>
          </div>
          <form
            onSubmit={submit}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "32px",
              boxShadow: "var(--shadow)",
              display: "grid",
              gap: "10px",
            }}
          >
            <input
              className='themed-input'
              placeholder='First name'
              required
              autoComplete='given-name'
              value={state.firstName}
              onChange={set("firstName")}
            />
            <input
              className='themed-input'
              placeholder='Last name'
              autoComplete='family-name'
              value={state.lastName}
              onChange={set("lastName")}
            />
            <input
              className='themed-input'
              type='email'
              placeholder='Email'
              required
              autoComplete='email'
              value={state.email}
              onChange={set("email")}
            />
            <input
              className='themed-input'
              type='password'
              placeholder='Password (8 or more characters)'
              required
              autoComplete='new-password'
              value={state.password}
              onChange={set("password")}
            />
            <input
              className='themed-input'
              type='password'
              placeholder='Confirm password'
              required
              autoComplete='new-password'
              value={state.confirm}
              onChange={set("confirm")}
            />
            {error && (
              <p style={{ fontSize: "0.8rem", color: "var(--error)" }}>{error}</p>
            )}
            <button className='btn-accent' type='submit' disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </button>
            <p
              style={{
                textAlign: "center",
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
              }}
            >
              Already have an account?{" "}
              <Link href='/login' style={{ color: "var(--accent)" }}>
                Sign in
              </Link>
            </p>
          </form>
          <p
            style={{
              textAlign: "center",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              marginTop: "20px",
            }}
          >
            By signing up you agree to our{" "}
            <Link href='/terms' style={{ color: "var(--accent)" }}>
              Terms
            </Link>{" "}
            and{" "}
            <Link href='/privacy-policy' style={{ color: "var(--accent)" }}>
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
