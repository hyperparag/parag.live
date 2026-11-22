import React from "react";
import InfoPage, { textStyle, headingStyle } from "@/component/layout/InfoPage";

const ContactUs = () => (
  <InfoPage
    title='Contact Us'
    description='Contact the Parag team for support, takedown requests and questions.'
    path='/contact-us'
  >
    <p style={textStyle}>
      For questions, help with your account or credits, or to report a problem,
      email us at{" "}
      <a
        href='mailto:support@parag.live'
        style={{ color: "var(--accent)", fontWeight: 600 }}
      >
        support@parag.live
      </a>
      . We usually reply within two working days.
    </p>

    <h2 style={headingStyle}>Report an ad</h2>
    <p style={textStyle}>
      Use the report button on the ad page. Tell us what is wrong with the ad.
    </p>

    <h2 style={headingStyle}>Copyright and takedown requests</h2>
    <p style={textStyle}>
      See our{" "}
      <a href='/dmca' style={{ color: "var(--accent)", fontWeight: 600 }}>
        DMCA page
      </a>
      .
    </p>
  </InfoPage>
);

export default ContactUs;
