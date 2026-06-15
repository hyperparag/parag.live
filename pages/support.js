import Footer from "@/component/footer/footer2";
import Header2 from "@/component/header/header";
import User from "@/component/user";
import Head from "next/head";
import Link from "next/link";
import React from "react";

const Support = () => {
  const { users } = User();
  const sectionStyle = {
    color: "var(--text-secondary)",
    lineHeight: 1.8,
    marginBottom: "12px",
  };
  const headingStyle = {
    fontWeight: 700,
    color: "var(--text)",
    marginBottom: "8px",
    marginTop: "20px",
  };
  return (
    <div className='page-bg' style={{ minHeight: "100vh" }}>
      <Head>
        <title>Support</title>
        <link rel='icon' href='/logo.png' />
      </Head>
      <Header2 />
      <div style={{ maxWidth: "800px", margin: "24px auto", padding: "0 16px" }}>
        <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "10px", padding: "12px 20px", display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap" }}>
          <Link href='/recharge-credits/' style={{ color: "var(--text-secondary)", fontWeight: 600, fontSize: "0.85rem", textDecoration: "none" }}
            onMouseEnter={e => e.target.style.color = "var(--accent)"} onMouseLeave={e => e.target.style.color = "var(--text-secondary)"}>
            Buy Credits
          </Link>
          <Link href='/dashboard/profile' style={{ color: "var(--text-secondary)", fontWeight: 600, fontSize: "0.85rem", textDecoration: "none" }}
            onMouseEnter={e => e.target.style.color = "var(--accent)"} onMouseLeave={e => e.target.style.color = "var(--text-secondary)"}>
            My Account
          </Link>
          <span style={{ color: "var(--accent)", fontWeight: 600, fontSize: "0.85rem" }}>Support</span>
          <Link href='/verify' style={{ color: "var(--text-secondary)", fontWeight: 600, fontSize: "0.85rem", textDecoration: "none" }}
            onMouseEnter={e => e.target.style.color = "var(--accent)"} onMouseLeave={e => e.target.style.color = "var(--text-secondary)"}>
            Verify
          </Link>
        </div>
      </div>
      <div style={{ maxWidth: "800px", margin: "24px auto", padding: "0 16px" }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "32px", boxShadow: "var(--shadow)" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--accent)", marginBottom: "16px" }}>
            Support Center
          </h1>
          <p style={{ ...sectionStyle, fontSize: "1.1rem" }}>
            Need a hand with your account, credits, verification, or a post? Our
            support team is here to help you get back on track quickly.
          </p>

          <h2 style={headingStyle}>Contact Support</h2>
          <p style={sectionStyle}>
            The fastest way to reach us is by email at{" "}
            <a href='mailto:support@parag.live' style={{ color: "var(--accent)" }}>
              support@parag.live
            </a>
            . Send us a brief description of your issue, and we&apos;ll get
            back to you as soon as possible.
          </p>

          <h2 style={headingStyle}>What we can help with</h2>
          <p style={sectionStyle}>
            <Link href='/recharge-credits/' style={{ color: "var(--accent)" }}>
              Buying credits
            </Link>{" "}
            — questions about purchasing, pricing, or recharging your credit
            balance.
          </p>
          <p style={sectionStyle}>
            <Link href='/verify' style={{ color: "var(--accent)" }}>
              Account verification
            </Link>{" "}
            — help completing or troubleshooting the verification process.
          </p>
          <p style={sectionStyle}>
            <Link href='/dashboard/profile' style={{ color: "var(--accent)" }}>
              Account &amp; profile management
            </Link>{" "}
            — updating your details, login issues, or general account questions.
          </p>
          <p style={sectionStyle}>
            Posting issues — assistance with creating, editing, or managing
            your listings.
          </p>

          <h2 style={headingStyle}>Response Time</h2>
          <p style={sectionStyle}>
            Our support team typically responds to email inquiries within 24
            hours. Thanks for your patience while we work through your request.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Support;
