import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";
const Footer = dynamic(() => import("@/component/footer/footer"));
const Header = dynamic(() => import("@/component/header/header"));

const Terms = () => {
  const s = {
    color: "var(--text-secondary)",
    lineHeight: 1.8,
    marginBottom: "12px",
  };
  const h = {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "var(--accent)",
    marginBottom: "12px",
    marginTop: "24px",
  };

  return (
    <div className='page-bg'>
      <Head>
        <title>Terms</title>
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
            Terms
          </h1>
          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--border)",
              marginBottom: "20px",
            }}
          />
          <p style={{ ...s, fontWeight: 600, color: "var(--text)" }}>
            Updated December 27, 2025
            <br />
            <br />
            Objectives/Content:
          </p>
          <p style={s}>
            The Site reserves the privilege to alter the Terms at any time and
            for almost any reason. Updated versions of the Conditions will
            undoubtedly be submitted to the Site in parag.com and also you
            should visit this page periodically to keep apprised of any changes.
            By continuing to make use of the Site after any such change, you
            accept and agree on the modified Terms. You agree that the website
            will not be responsible for you personally or some other third party
            for practically any modification or discontinuance of the website.
          </p>
          <p style={{ ...s, fontWeight: 700, color: "var(--text)" }}>
            Consumer Conduct:
          </p>
          <p style={s}>
            Without limitation, you agree to refrain from the following actions
            while using the Site:
          </p>
          {[
            "Harassing, threatening, embarrassing or causing distress or discomfort upon another individual or entity or impersonating any person or entity or otherwise restricting or inhibiting any other person from using or enjoying the Site;",
            "Transmitting any information, data, text, files, hyperlinks, software, chats, communication or other materials which is unlawful, false, misleading, dangerous, threatening, abusive, invasive of a person's privacy, harassing, defamatory, vulgar, disgusting, hateful or racially or otherwise objectionable;",
            "Posting advertising or solicitation in categories Which Is not right, or posting the Identical thing or agency at more than 1 category or greater than once every 7 days;",
            "Posting adult content or explicit adult material and some other content country to this law which applies.",
            "Composing, anyplace around the Site, obscene or lewd and lascivious graphics or photos which portray genitalia or actual or simulated sexual acts;",
            "Putting up any solicitation straight or at coded fashion for Absolutely Any illegal service exchanging sexual favors for money or other valuable consideration;",
            "Putting up any substance on the Website that exploits minors in any way;",
            "Publishing any substance on the Site that in any way constitutes or aids in human trafficking.",
            "Posting any ad for products or services, use or sale of which can be illegal by any legislation or law;",
            "Supplying mail, e-mail, voice messages or faxes for solicitation of any other Item to a user of the Website unless the consumer has given permission;",
            "Using any automated device, robot, spider, crawler, information mining instrument to gain access, copy, or obtain any part of the Website unless expressly permitted;",
            "Gaining or trying to obtain unauthorized accessibility to non public regions of the website;",
            "Attempting to decipher, decompile, disassemble or reverse engineer any of the software comprising the Site;",
            "Discriminating on the Basis of race, religion, national origin, sex, handicap, age, marital status, sexual orientation;",
            "Posting any job ads separating the anti-discrimination conditions of the Immigration and Nationality Act;",
            "Using the site to engage in fraudulent, abusive, manipulative or illegal activity.",
            "Posting Totally Free ads promoting links to commercial providers except in areas explicitly permitted;",
            "Putting up any material advertisements firearms that the use, carrying, or advertising which is prohibited by applicable national, state, or community authorities.",
          ].map((item, i) => (
            <p key={i} style={s}>
              {i + 1}. {item}
            </p>
          ))}

          <p
            style={{
              ...s,
              fontWeight: 700,
              color: "var(--text)",
              marginTop: "24px",
            }}
          >
            Use of Materials:
          </p>
          <p style={s}>
            Any messages or ads that you submit, transmit, or make available for
            viewing on public aspects of the website are going to be medicated
            since it is non-confidential and non-proprietary. You grant the Site
            the irrevocable right to use and/or edit your ads and messages for
            almost any purpose whatsoever.
          </p>

          <p
            style={{
              ...s,
              fontWeight: 700,
              color: "var(--text)",
              marginTop: "24px",
            }}
          >
            Fair Housing:
          </p>
          <p style={s}>
            Title VIII of the Civil Rights Act of 1968 (Fair Housing Act), as
            amended, prohibits discrimination in the sale, rental, and financing
            of dwellings. The Site is not going to knowingly accept any real
            estate advertising which is in violation of any pertinent law.
          </p>

          <h2 style={h}>Disclaimer:</h2>
          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--border)",
              marginBottom: "16px",
            }}
          />
          <p style={s}>
            USE OF THIS SITE IS AT YOUR OWN RISK. THE SITE IS NOT RESPONSIBLE
            FOR ANY CONTENT FOUND ON THESE CLASSIFIEDS. THE SITE IS PROVIDED ON
            AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS.
          </p>

          <p
            style={{
              ...s,
              fontWeight: 700,
              color: "var(--text)",
              marginTop: "24px",
            }}
          >
            Limitation of Obligation:
          </p>
          <p style={s}>
            The advice services available for your requirements on this Site
            could contain errors and are susceptible to periods of interruption.
            By applying the site, you agree to defend, indemnify and hold
            harmless the indemnified parties from all liability regarding your
            use of the website.
          </p>

          <p style={s}>
            parag.com can be a web site that hosts categorized advertisements
            and relevant articles. Your use of the website is governed by these
            Conditions of Use and the Privacy Policy.
          </p>

          <p style={{ ...s, fontWeight: 700, color: "var(--text)" }}>
            Posting rules, verification and credits:
          </p>
          {[
            "You must verify your identity with a valid government photo ID (national ID card or driving licence) before you can post. Using someone else's ID, or a false or altered ID, is not allowed and will lead to a permanent ban.",
            "Posting in your home city is free. Posting in any other city costs credits. You choose your home city in your profile and can change it once every 30 days.",
            "Ads may only be in the categories Community, Dating, Marketplace and Services. Adult content, escort or sexual services, and anything illegal in your country or in the city where you post are not allowed.",
            "We use automatic filters and human review. We may remove any ad, or close any account, at any time if it breaks these rules or the law.",
            "To keep the site free, when our storage is nearly full we automatically delete the oldest ads and their images. Ads and images can be removed without notice.",
            "Credits and referral rewards have no cash value, cannot be sold or transferred, and may be changed or withdrawn at any time. Abuse of the referral program, such as fake accounts or self-referrals, ends in a ban and loss of rewards.",
            "Copyright complaints are handled under our DMCA page (/dmca).",
          ].map((item, i) => (
            <p key={`extra-${i}`} style={s}>
              {item}
            </p>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
