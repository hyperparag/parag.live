import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import dynamic from "next/dynamic";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import Cookies from "js-cookie";
const Footer = dynamic(() => import("@/component/footer/footer2"));
import axios from "axios";

const initialState = {
  email: "",
  password: "",
  passError: "",
  emailError: "",
};

const Login = () => {
  const router = useRouter();
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = (e) => {
    setState({ ...state, [e.type]: e.payload });
  };

  const usersStringfy = Cookies.get("token");
  useEffect(() => {
    if (usersStringfy) router.push(router.asPath);
  }, []);

  const login = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setState({ ...state, emailError: "" });
    const result = await signIn("credentials", {
      email: state.email.trim(),
      password: state.password,
      redirect: false,
    });
    setIsLoading(false);
    if (result?.ok) {
      router.push(router?.query?.callbackUrl || "/");
    } else {
      setState({ ...state, emailError: "Wrong email or password" });
    }
  };

  return (
    <div
      className='page-bg'
      style={{ display: "flex", flexDirection: "column" }}
    >
      <Head>
        <link rel='icon' href='/logo.png' />
        <title>Login – PARAG</title>
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
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                color: "var(--accent)",
                letterSpacing: "-0.02em",
                marginBottom: "4px",
              }}
            >
              PARAG
            </h1>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Sign in to your account
            </p>
          </div>

          {/* Card */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "32px",
              boxShadow: "var(--shadow)",
            }}
          >
            <button
              onClick={() =>
                signIn("google", {
                  callbackUrl: router?.query?.callbackUrl
                    ? router?.query?.callbackUrl
                    : "/",
                })
              }
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                border: "1px solid var(--border)",
                background: "var(--surface-2)",
                color: "var(--text)",
                fontWeight: 600,
                fontSize: "0.9rem",
                padding: "14px",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.background = "var(--accent-dim)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.background = "var(--surface-2)";
              }}
            >
              <FcGoogle style={{ width: "22px", height: "22px" }} />
              Sign in with Google
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                margin: "20px 0",
                color: "var(--text-muted)",
                fontSize: "0.75rem",
              }}
            >
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              or use your email
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>
            <form onSubmit={login} style={{ display: "grid", gap: "10px" }}>
              <input
                type='email'
                required
                placeholder='Email'
                autoComplete='email'
                className='themed-input'
                value={state.email}
                onChange={(e) =>
                  dispatch({ type: "email", payload: e.target.value })
                }
              />
              <input
                type='password'
                required
                placeholder='Password'
                autoComplete='current-password'
                className='themed-input'
                value={state.password}
                onChange={(e) =>
                  dispatch({ type: "password", payload: e.target.value })
                }
              />
              <button className='btn-accent' type='submit' disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </form>
            <p style={{ textAlign: "center", fontSize: "0.85rem", marginTop: "10px" }}>
              <Link href='/forgot-password' style={{ color: "var(--accent)" }}>
                Forgot your password?
              </Link>
            </p>
            <p
              style={{
                textAlign: "center",
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
                marginTop: "14px",
              }}
            >
              No account?{" "}
              <Link href='/signup' style={{ color: "var(--accent)" }}>
                Sign up with email
              </Link>
            </p>

            {state.emailError && (
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--error)",
                  textAlign: "center",
                  marginTop: "12px",
                }}
              >
                {state.emailError}
              </p>
            )}
          </div>

          <p
            style={{
              textAlign: "center",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              marginTop: "24px",
            }}
          >
            By signing in, you agree to our{" "}
            <Link
              href='/terms'
              style={{ color: "var(--accent)", textDecoration: "none" }}
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href='/privacy-policy'
              style={{ color: "var(--accent)", textDecoration: "none" }}
            >
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

export default Login;
