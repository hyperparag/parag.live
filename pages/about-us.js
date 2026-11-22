import Link from "next/link";
import React from "react";
import InfoPage, {
  textStyle,
  headingStyle,
  listStyle,
} from "@/component/layout/InfoPage";

const AboutUs = () => (
  <InfoPage
    title='About Us'
    description='Parag is a free local classifieds site for community, dating, marketplace and services.'
    path='/about-us'
  >
    <p style={textStyle}>
      Parag (parag.live) is a free classifieds site. People post and find ads in
      cities all over the world, in four categories:
    </p>
    <ul style={listStyle}>
      <li style={{ listStyleType: "disc" }}>
        <b>Community</b>: local groups, events and news
      </li>
      <li style={{ listStyleType: "disc" }}>
        <b>Dating</b>: dating and friendship
      </li>
      <li style={{ listStyleType: "disc" }}>
        <b>Marketplace</b>: buying and selling goods
      </li>
      <li style={{ listStyleType: "disc" }}>
        <b>Services</b>: local and professional services
      </li>
    </ul>

    <h2 style={headingStyle}>How it works</h2>
    <p style={textStyle}>
      Create an account, verify your ID, choose your home city and post. Posting
      in your home city is free. Posting in other cities uses credits.
    </p>

    <h2 style={headingStyle}>Safety</h2>
    <p style={textStyle}>
      Everyone who posts has a verified government ID. Ads are checked
      automatically for banned words and images, and flagged ads are reviewed by
      our team. Please read our{" "}
      <Link href='/posting-rules' style={{ color: "var(--accent)" }}>
        posting rules
      </Link>{" "}
      and report anything that looks wrong from the ad page.
    </p>

    <h2 style={headingStyle}>Contact</h2>
    <p style={textStyle}>
      Questions or problems? See our{" "}
      <Link href='/contact-us' style={{ color: "var(--accent)" }}>
        contact page
      </Link>
      .
    </p>
  </InfoPage>
);

export default AboutUs;
