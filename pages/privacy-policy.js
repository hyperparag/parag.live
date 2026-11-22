import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";
const Footer = dynamic(() => import("@/component/footer/footer2"));
const Header = dynamic(() => import("@/component/header/header"));

const PrivacyPolicy = () => {
  const sectionStyle = {
    color: "var(--text-secondary)",
    lineHeight: 1.8,
    marginBottom: "12px",
  };
  const headingStyle = {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "var(--accent)",
    marginBottom: "12px",
    marginTop: "24px",
  };

  return (
    <div className='page-bg'>
      <Head>
        <link rel='icon' href='/logo.png' />
        <title>Privacy Policy</title>
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
            Privacy Policy
          </h1>
          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--border)",
              marginBottom: "20px",
            }}
          />
          <p style={{ ...sectionStyle, fontWeight: 600, color: "var(--text)" }}>
            parag is a legal Classified Site to promote affiliates. You can put
            up anything on the Site and find jobs. Below is our online Privacy
            Policy on this website:
          </p>

          <h2 style={headingStyle}>Post & Protection:</h2>
          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--border)",
              marginBottom: "16px",
            }}
          />
          <p style={sectionStyle}>
            We'd like to inform you that parag will not accept any fraud or
            scams and much more. parag is a place open for all anyone is welcome
            to post any information here. However, we have a particular rule to
            protect our customers and everyone else. It is not allowed to use
            scams on parag. If anyone uploads any photos and there is a
            complaint regarding the photo or other personal concerns, We will
            remove the image and take it down. parag will always be your legal
            protection. You can use parag however you like and worry about
            privacy!
          </p>

          <h2 style={headingStyle}>Acceptance of online privacy policies</h2>
          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--border)",
              marginBottom: "16px",
            }}
          />
          <p style={sectionStyle}>
            When you access, use the article, write an article, answer or browse
            the Site by using the Site, you acknowledge your acceptance of the
            current online privacy policy. If you disagree with the Privacy
            Policy If you don't, then you're not authorized to use the Site and
            should end your use of the Site immediately.
          </p>

          <h2 style={headingStyle}>
            Group and the application of private information
          </h2>
          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--border)",
              marginBottom: "16px",
            }}
          />
          <p style={sectionStyle}>
            We gather private information on you whenever you participate in
            trade transactions through the Site, utilize the products and
            services offered by the Site, request information or materials and
            upgrade or make changes to your account information, place orders,
            make purchases and even browse the website. For example, the
            information we gather and save on you could include your first and
            last name, your current email address for debit or credit card
            number, contact information billing and sending information, and
            command records, with any other pertinent information about your
            personal.
          </p>

          <h2 style={headingStyle}>
            We can make use of the information we gather to:
          </h2>
          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--border)",
              marginBottom: "16px",
            }}
          />
          <ul style={{ ...sectionStyle, paddingLeft: "24px" }}>
            <li style={{ listStyleType: "disc", marginBottom: "6px" }}>
              present remarkable providers;
            </li>
            <li style={{ listStyleType: "disc", marginBottom: "6px" }}>
              Get ready for a variety of news and other information that you
              might be interested in;
            </li>
            <li style={{ listStyleType: "disc", marginBottom: "6px" }}>
              urge you to make use of brand new characteristics, articles, and
              provisions as well as products and services suppliers;
            </li>
            <li style={{ listStyleType: "disc", marginBottom: "6px" }}>
              Get in touch with a representative regarding your article,
              questions, or advice on accounts;
            </li>
            <li style={{ listStyleType: "disc", marginBottom: "6px" }}>
              procedure and address your own questions;
            </li>
            <li style={{ listStyleType: "disc", marginBottom: "6px" }}>
              Enhance the Website
            </li>
            <li style={{ listStyleType: "disc", marginBottom: "6px" }}>
              Monitor and oversee the usage of the website
            </li>
            <li style={{ listStyleType: "disc", marginBottom: "6px" }}>
              Implement the Terms of Use (together with the "Tasks").
            </li>
          </ul>
          <p style={sectionStyle}>
            You have given the website permission to send emails for users to
            reply to their messages and manage Actions. However, if you opt to
            receive notifications, you need to accept and agree that the Site
            sends text messages to phones on mobiles, and it could also lead to
            some text or data costs that will be used.
          </p>

          <h2 style={headingStyle}>Identity verification:</h2>
          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--border)",
              marginBottom: "16px",
            }}
          />
          <p style={sectionStyle}>
            To post an ad you must verify your identity with a government photo
            ID (a national ID card or a driving licence) and a selfie. We use
            these only to confirm who you are and to keep the site safe. They are
            stored securely, are seen only by our verification staff, and are
            never shown on your ad or shared with other users. We keep them while
            your account is open and delete them within a reasonable time after
            your account is closed, unless the law requires us to keep them
            longer.
          </p>

          <h2 style={headingStyle}>Users around the world:</h2>
          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--border)",
              marginBottom: "16px",
            }}
          />
          <p style={sectionStyle}>
            Parag is available in many countries. Your information may be
            processed in countries other than your own. You can ask us to see,
            correct or delete the personal data we hold about you by emailing
            support@parag.live. Ads you post are public, so do not put private
            information in them.
          </p>

          <h2 style={headingStyle}>Old ads and storage:</h2>
          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--border)",
              marginBottom: "16px",
            }}
          />
          <p style={sectionStyle}>
            To keep the site free, when our storage is nearly full we
            automatically delete the oldest ads and their images. Deleted ads
            cannot be recovered.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
