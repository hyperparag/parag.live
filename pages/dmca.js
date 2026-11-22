import React from "react";
import InfoPage, {
  textStyle,
  headingStyle,
  listStyle,
} from "@/component/layout/InfoPage";

const DMCA_EMAIL = "dmca@parag.live";

const Dmca = () => (
  <InfoPage
    title='DMCA and Copyright Notice'
    description='How to report copyright infringement on Parag and how we respond.'
    path='/dmca'
  >
    <p style={textStyle}>
      Parag respects the rights of copyright owners. Ads on this site are posted
      by users. If you believe something on Parag infringes your copyright, send
      us a notice and we will act on it.
    </p>

    <h2 style={headingStyle}>How to send a takedown notice</h2>
    <p style={textStyle}>
      Email{" "}
      <a href={`mailto:${DMCA_EMAIL}`} style={{ color: "var(--accent)" }}>
        {DMCA_EMAIL}
      </a>{" "}
      with all of the following:
    </p>
    <ul style={listStyle}>
      <li style={{ listStyleType: "disc" }}>
        Your name, address, phone number and email address.
      </li>
      <li style={{ listStyleType: "disc" }}>
        A description of the copyrighted work you say was copied.
      </li>
      <li style={{ listStyleType: "disc" }}>
        The full link (URL) of each ad or image on parag.live that you want
        removed.
      </li>
      <li style={{ listStyleType: "disc" }}>
        A statement that you believe in good faith that the use is not
        authorised by the copyright owner, its agent or the law.
      </li>
      <li style={{ listStyleType: "disc" }}>
        A statement, under penalty of perjury, that the information in your
        notice is accurate and that you are the copyright owner or are
        authorised to act for the owner.
      </li>
      <li style={{ listStyleType: "disc" }}>
        Your physical or electronic signature.
      </li>
    </ul>

    <h2 style={headingStyle}>What we do</h2>
    <p style={textStyle}>
      When we receive a complete notice we remove or disable access to the
      material and tell the person who posted it. Sending a false notice can make
      you liable for damages.
    </p>

    <h2 style={headingStyle}>Counter-notice</h2>
    <p style={textStyle}>
      If your content was removed by mistake, or you have permission to use it,
      email {DMCA_EMAIL} with your name and contact details, the link to the
      removed material, a statement under penalty of perjury that you believe it
      was removed by mistake, and your consent to the courts for your address. We
      may restore the material after 10 to 14 business days unless the copyright
      owner tells us they have started a court action.
    </p>

    <h2 style={headingStyle}>Repeat infringers</h2>
    <p style={textStyle}>
      We close the accounts of users who repeatedly post material that infringes
      copyright.
    </p>
  </InfoPage>
);

export default Dmca;
