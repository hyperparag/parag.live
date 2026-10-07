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
    const data = { ...state, isLoading: true };
    await axios
      .post("  https://paraglive-backend.vercel.app/api/users/login", data)
      .then((response) => {
        if (response.data.message == "success") {
          Cookies.set("token", response.data.token);
          setState({ ...state, emailError: "" });
          if (router?.asPath == "/login") router.push("/");
          else
            setTimeout(() => {
              router.reload(router?.asPath);
            }, 500);
          setIsLoading(false);
        } else {
          setState({ ...state, emailError: "Something went wrong" });
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setState({ ...state, emailError: error?.response?.data?.message });
      });
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
