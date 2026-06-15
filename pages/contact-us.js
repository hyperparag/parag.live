import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import React from "react";
const Footer = dynamic(() => import("@/component/footer/footer"));
const Header = dynamic(() => import("@/component/header/header"));

const ContactUs = () => {
  return (
    <div className='page-bg'>
      <Head>
        <title>Contact Us</title>
        <link rel='icon' href='/logo.png' />
      </Head>
      <Header />
      <div
        style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 16px" }}
      >
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "32px",
            boxShadow: "var(--shadow)",
          }}
        >
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--accent)",
              marginBottom: "16px",
            }}
          >
            Contact Us
          </h1>
          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--border)",
              marginBottom: "20px",
            }}
          />
          <p
            style={{
              color: "var(--text-secondary)",
              lineHeight: 1.8,
              marginBottom: "16px",
            }}
          >
            We are here to provide your assistance only. Our customer support
            team is available to answer promptly. If you're facing any minor
            problem, contact us anytime to get assistance and solutions. We
            provide the best assistance and responsiveness. Our customers are
            happy with our support and work in addition. We're always eager to
            help you. Tell us about your problem and how we can assist you!
            parag Customer support is offered at no cost. We are available all
            day, so you don't have to worry about response times. Contact us
            anytime, and you will receive the best service. Live support agents
            are available 24/7 to help with any questions you might need! So
            chat with us and find the best solution!
          </p>
          <p
            style={{
              color: "var(--text)",
              fontWeight: 600,
              marginBottom: "4px",
            }}
          >
            Live Chat
          </p>
          <p
            style={{
              color: "var(--text-secondary)",
              lineHeight: 1.8,
              marginBottom: "4px",
            }}
          >
            Our live representatives are available 24/7 to assist you with any
            and all questions you may have.
          </p>

          <p
            style={{
              color: "var(--text)",
              fontWeight: 600,
              marginBottom: "4px",
            }}
          >
            Email Support
          </p>
          <p
            style={{
              color: "var(--text-secondary)",
              lineHeight: 1.8,
              marginBottom: "32px",
            }}
          >
            For any questions or assistance, email us at{" "}
            <a
              href='mailto:support@parag.live'
              style={{ color: "var(--accent)" }}
            >
              support@parag.live
            </a>
            .
          </p>

          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--accent)",
              marginBottom: "16px",
            }}
          >
            Contact Best Website similar to Backpage [parag]
          </h2>
          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--border)",
              marginBottom: "20px",
            }}
          />
          <p
            style={{
              color: "var(--text-secondary)",
              lineHeight: 1.8,
              marginBottom: "16px",
            }}
          >
            parag is the most popular{" "}
            <Link href='/' style={{ color: "var(--accent)" }}>
              backpage replacement
            </Link>{" "}
            currently! It is the most reliable website,{" "}
            <Link href='/' style={{ color: "var(--accent)" }}>
              similar to Backpage
            </Link>
            . Are you looking for the most straightforward alternative sites to
            Backpage? It's not all alone! parag will ensure that you are
            satisfied with Backpages. The site was once the best online site for
            personal or commercial ads; Backpage was a one-stop shop for
            everything from electronics to events, alerts for vacant land, and
            more. However, later on, it became the center of questionable adult
            content. Evidently, the federal authorities were not thrilled! After
            more revelations surfaced based on the digital seams, the government
            eventually pulled the connection this fall and enlisted the FBI to
            permanently remove the location.
          </p>
          <p
            style={{
              color: "var(--text-secondary)",
              lineHeight: 1.8,
              marginBottom: "32px",
            }}
          >
            Wait a minute, do you think the age of backpages and similar
            websites finally means that they are over and entirely over?
          </p>

          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--accent)",
              marginBottom: "16px",
            }}
          >
            Similar to Backpage Websites [parag]
          </h2>
          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--border)",
              marginBottom: "20px",
            }}
          />
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
            When Backpage.com was shut down entirely, all web users gathered and
            went to search for the next. Legally classified ad sites on the
            internet. In this the spirit of this article, we review the 10 most
            trusted and highly reliable similar to backpage sites that we think
            will offer the most simple experience - free of deceit, serious
            fraud, or untrustworthy. Before you endorse adding to the list, look
            at the newest backpage alternative websites
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUs;
