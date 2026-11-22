import Link from "next/link";
import React from "react";
import InfoPage, {
  textStyle,
  headingStyle,
  listStyle,
} from "@/component/layout/InfoPage";

// The amounts below must match REFERRAL_SIGNUP_TIERS and
// REFERRAL_SIGNUP_DAILY_CAP in Backend/src/api/v1/config/pricing.js.
const TIERS = [
  { range: "Referrals 1 to 10", reward: "$0.05 each" },
  { range: "Referrals 11 to 50", reward: "$0.10 each" },
  { range: "Referrals 51 and more", reward: "$0.20 each" },
];

const Referral = () => (
  <InfoPage
    title='Referral Rewards'
    description='Share Parag with friends and earn credits when they join and verify their ID.'
    path='/referral'
  >
    <p style={textStyle}>
      Share your personal link. When someone joins through it and gets their ID
      verified, you earn a small reward. You can turn your rewards into credits
      and use them to post ads.
    </p>

    <h2 style={headingStyle}>1. Get your link</h2>
    <p style={textStyle}>
      Sign in and open your{" "}
      <Link href='/dashboard/profile' style={{ color: "var(--accent)" }}>
        profile
      </Link>
      . Your link looks like <b>https://parag.live/?ref=YOURCODE</b>. Press
      &quot;Copy link&quot; and share it anywhere: messages, social media, your
      own page.
    </p>

    <h2 style={headingStyle}>2. Earn when they verify</h2>
    <p style={textStyle}>
      You are paid once for each person who signs up through your link and has
      their ID verified. The more people you bring, the higher the reward per
      person:
    </p>
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: "8px",
        overflow: "hidden",
        marginBottom: "12px",
      }}
    >
      {TIERS.map((tier) => (
        <div
          key={tier.range}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 14px",
            borderBottom: "1px solid var(--border)",
            color: "var(--text-secondary)",
          }}
        >
          <span>{tier.range}</span>
          <b style={{ color: "var(--text)" }}>{tier.reward}</b>
        </div>
      ))}
    </div>
    <p style={textStyle}>
      You can earn up to 20 of these rewards per day. You also earn 50% of what
      each person you referred pays when they buy credits.
    </p>

    <h2 style={headingStyle}>3. Use your rewards</h2>
    <p style={textStyle}>
      In your profile, press &quot;Convert to credit&quot;. Credits pay for:
    </p>
    <ul style={listStyle}>
      <li style={{ listStyleType: "disc" }}>
        Posting an ad in a city other than your home city
      </li>
      <li style={{ listStyleType: "disc" }}>
        Premium ads that stay at the top of the list (7, 14 or 30 days)
      </li>
      <li style={{ listStyleType: "disc" }}>Reposting an ad to bring it back to the top</li>
    </ul>
    <p style={textStyle}>
      Posting in your own home city is always free. See the{" "}
      <Link href='/posting-rules' style={{ color: "var(--accent)" }}>
        posting rules
      </Link>
      .
    </p>

    <h2 style={headingStyle}>Rules</h2>
    <ul style={listStyle}>
      <li style={{ listStyleType: "disc" }}>
        You cannot refer yourself, and you cannot use fake or duplicate
        accounts. Every account needs a real, verified ID.
      </li>
      <li style={{ listStyleType: "disc" }}>
        Do not spam. Share your link only where it is allowed.
      </li>
      <li style={{ listStyleType: "disc" }}>
        Rewards and credits have no cash value and cannot be sold or
        transferred.
      </li>
      <li style={{ listStyleType: "disc" }}>
        We may change the amounts, or cancel rewards earned by abuse, at any
        time. Abuse leads to a ban.
      </li>
    </ul>
  </InfoPage>
);

export default Referral;
