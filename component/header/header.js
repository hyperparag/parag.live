import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import ThemeToggle from "../ThemeToggle";
import LanguageSwitcher from "../translate/LanguageSwitcher";

const Header = () => {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();

  // The language picker lives in this header, so hide the floating one while
  // the header is on the page (see `.lang-float` in globals.css).
  useEffect(() => {
    document.documentElement.setAttribute("data-has-header", "");
    return () => document.documentElement.removeAttribute("data-has-header");
  }, []);

  const logout = () => {
    setMobileOpen(false);
    signOut();
    router.push("/login");
  };

  return (
    <header
      style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href='/'
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Image
            src='/logo.png'
            alt='Parag'
            width={50}
            height={40}
            className='header-logo'
            style={{ objectFit: "contain" }}
            priority
          />
          <span
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "var(--accent)",
              letterSpacing: "-0.02em",
              marginLeft: "0px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            PARAG
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className='hidden sm:flex items-center gap-3'>
          {router?.query?.state && (
            <span
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.85rem",
                fontWeight: 500,
              }}
            >
              {router.query.state} / {router.query.post}
            </span>
          )}
          <LanguageSwitcher inline />
          <ThemeToggle />
          <Link href='/user/post'>
            <button
              className='btn-accent'
              style={{ fontSize: "0.8rem", padding: "8px 18px" }}
            >
              + Post Ad
            </button>
          </Link>
          {session?.user?.email ? (
            <>
              {router.asPath === "/dashboard/profile" ? (
                <Link
                  href='/'
                  style={{
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "var(--accent)")}
                  onMouseLeave={(e) =>
                    (e.target.style.color = "var(--text-secondary)")
                  }
                >
                  Home
                </Link>
              ) : (
                <Link
                  href='/dashboard/profile'
                  style={{
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "var(--accent)")}
                  onMouseLeave={(e) =>
                    (e.target.style.color = "var(--text-secondary)")
                  }
                >
                  My Account
                </Link>
              )}
              <button
                onClick={() => signOut()}
                style={{
                  background: "transparent",
                  border: "1px solid var(--error)",
                  color: "var(--error)",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "var(--error)";
                  e.target.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "var(--error)";
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href='/login'
              className='btn-ghost'
              style={{ padding: "8px 18px", fontSize: "0.8rem" }}
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile: hamburger only */}
        <div className='flex sm:hidden items-center gap-2'>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "8px",
              cursor: "pointer",
              color: "var(--text)",
              display: "flex",
              alignItems: "center",
            }}
          >
            {mobileOpen ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth='2'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth='2'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M4 6h16M4 12h8m-8 6h16'
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          className='sm:hidden'
          style={{
            position: "absolute",
            top: "64px",
            left: 0,
            right: 0,
            background: "var(--surface)",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
            padding: "12px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            zIndex: 50,
          }}
        >
          {router?.query?.state && (
            <span
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.85rem",
                fontWeight: 500,
                padding: "4px 0",
              }}
            >
              {router.query.state} / {router.query.post}
            </span>
          )}

          {/* Theme toggle row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 0",
            }}
          >
            <span
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            >
              Theme
            </span>
            <ThemeToggle />
          </div>

          {/* Language row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 0",
            }}
          >
            <span
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            >
              Language
            </span>
            <LanguageSwitcher inline />
          </div>

          <Link href='/user/post' onClick={() => setMobileOpen(false)}>
            <button
              className='btn-accent'
              style={{ width: "100%", justifyContent: "center" }}
            >
              + Post Ad
            </button>
          </Link>

          {session?.user?.email ? (
            <>
              {router.asPath === "/dashboard/profile" ? (
                <Link
                  href='/'
                  onClick={() => setMobileOpen(false)}
                  style={{
                    color: "var(--text-secondary)",
                    padding: "10px 0",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    textDecoration: "none",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  Home
                </Link>
              ) : (
                <Link
                  href='/dashboard/profile'
                  onClick={() => setMobileOpen(false)}
                  style={{
                    color: "var(--text-secondary)",
                    padding: "10px 0",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    textDecoration: "none",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  My Account
                </Link>
              )}
              <button
                onClick={logout}
                style={{
                  background: "var(--error)",
                  color: "#fff",
                  border: "none",
                  padding: "10px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href='/login'
              onClick={() => setMobileOpen(false)}
              style={{
                color: "var(--text-secondary)",
                padding: "10px 0",
                fontSize: "0.875rem",
                fontWeight: 500,
                textDecoration: "none",
                borderTop: "1px solid var(--border)",
                textAlign: "center",
              }}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
