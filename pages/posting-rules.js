import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { POSTING_LIMITS } from "@/component/utils/postingRules";
const Footer = dynamic(() => import("@/component/footer/footer"));
const Header = dynamic(() => import("@/component/header/header"));

const PostingRules = () => {
  const L = POSTING_LIMITS;

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
    marginTop: "28px",
  };
  const list = {
    ...s,
    paddingLeft: "20px",
    listStyle: "disc",
  };
  const item = { marginBottom: "8px" };
  const strong = { color: "var(--text)", fontWeight: 600 };
  const card = {
    background: "var(--surface-2)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    padding: "14px 16px",
    marginBottom: "10px",
  };

  const reviewRules = [
    {
      title: `Write a real description: at least ${L.minDescriptionWords} words`,
      body: "Say what you offer, where and when, in your own words. A line or two is too thin to be useful to readers or to search engines.",
    },
    {
      title: "Post each ad once",
      body: "Do not post the same title or the same text again, and do not repeat an ad from a second account. To move an ad back to the top, use Repost in your dashboard. To reach more places, pick several cities in one ad instead of posting it once per city.",
    },
    {
      title: `No more than ${L.maxAdsPerDay} new ads in 24 hours`,
      body: "Reposting an existing ad does not count towards this.",
    },
    {
      title: "No keyword stuffing",
      body: "Do not repeat the same word over and over to rank in search. The same word three or more times in a title, or one word making up more than a tenth of the description, is held for review.",
    },
    {
      title: `At most ${L.maxLinks} links, and only to normal websites`,
      body: "Link shorteners (bit.ly, tinyurl and similar), Telegram and WhatsApp links, OnlyFans, Fansly, Cash App and Venmo links, and links to bare IP addresses are not allowed. Links are shown as plain text, not clickable.",
    },
    {
      title: "No code or hidden text",
      body: "Write your ad in the editor. Pasted scripts, embedded frames or hidden markup are removed and the ad is held for review.",
    },
    {
      title: "No forbidden wording",
      body: "See the list below. Wording connected to these topics is held for review even when it is meant innocently, so an admin can check it.",
    },
  ];

  return (
    <div className='page-bg'>
      <Head>
        <title>Posting Rules</title>
        <link rel='icon' href='/logo.png' />
        <meta
          name='description'
          content='What you need to post an ad, the rules every ad must follow, and what happens when an ad is held for review.'
        />
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
            Posting Rules
          </h1>
          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--border)",
              marginBottom: "20px",
            }}
          />
          <p style={s}>
            Follow these rules and your ad goes live as soon as you submit it.
            An ad that breaks a rule is <strong style={strong}>not</strong>{" "}
            rejected: it is saved as <strong style={strong}>Pending</strong>,
            and an admin checks it. If it is fine, the admin approves it. If it
            breaks the rules, the admin deletes it.
          </p>
          <p style={s}>
            The rules stop the same ad from filling every page, and keep spam
            off the site so that it, and your ad, stay visible on Google.
          </p>

          <h2 style={h}>1. What you need before you post</h2>
          <ul style={list}>
            <li style={item}>
              <strong style={strong}>Be signed in.</strong> If you see
              &ldquo;session expired&rdquo;, sign in again and resubmit.
            </li>
            <li style={item}>
              <strong style={strong}>
                1 to {L.maxPhotos} photos.
              </strong>{" "}
              Any size is fine; they are resized for you. If a photo cannot be
              read (some iPhone HEIC photos), save it as JPG or PNG first.
            </li>
            <li style={item}>
              <strong style={strong}>A title</strong> of up to{" "}
              {L.maxTitleLength} characters.
            </li>
            <li style={item}>
              <strong style={strong}>A working email address</strong>, a{" "}
              <strong style={strong}>category</strong> and a{" "}
              <strong style={strong}>description</strong>.
            </li>
            <li style={item}>
              <strong style={strong}>At least one city.</strong>
            </li>
            <li style={item}>
              <strong style={strong}>Enough credits for paid options.</strong>{" "}
              Posting in one city is free. Posting in more than one city costs $
              {L.multiCityRate.toFixed(2)} per city (10 cities = $
              {(10 * L.multiCityRate).toFixed(2)}). A boost costs $7 for 7 days,
              $10 for 14 days or $15 for 30 days. Your balance and the total
              charge are shown at the top of the form.{" "}
              <Link
                href='/recharge-credits/'
                style={{ color: "var(--accent)" }}
              >
                Buy credits
              </Link>
            </li>
            <li style={item}>
              <strong style={strong}>
                Tick &ldquo;I have read the posting rules&rdquo;
              </strong>{" "}
              at the bottom of the form.
            </li>
          </ul>

          <h2 style={h}>2. Rules every ad must follow</h2>
          <p style={s}>
            An ad that breaks any of these goes to Pending instead of going
            live. The message you see after submitting says which rule it was.
          </p>
          {reviewRules.map((r, i) => (
            <div key={r.title} style={card}>
              <p
                style={{
                  color: "var(--text)",
                  fontWeight: 600,
                  marginBottom: "4px",
                }}
              >
                {i + 1}. {r.title}
              </p>
              <p style={{ ...s, marginBottom: 0 }}>{r.body}</p>
            </div>
          ))}

          <h2 style={h}>3. Never allowed</h2>
          <p style={s}>Ads like these are deleted:</p>
          <ul style={list}>
            <li style={item}>
              Anyone under 18, or wording that suggests it (for example
              &ldquo;teen&rdquo;, &ldquo;schoolgirl&rdquo;, &ldquo;barely
              legal&rdquo;).
            </li>
            <li style={item}>
              Trafficking, or anyone who is not acting of their own free will.
            </li>
            <li style={item}>Illegal drugs.</li>
            <li style={item}>Weapons.</li>
            <li style={item}>
              Fraud: stolen cards, &ldquo;money flips&rdquo; and similar
              schemes.
            </li>
            <li style={item}>Offers of unprotected services.</li>
            <li style={item}>
              Photos or contact details of someone else, or photos you do not
              have the right to use.
            </li>
          </ul>
          <p style={s}>
            The full list of prohibited content is in the{" "}
            <Link href='/terms' style={{ color: "var(--accent)" }}>
              Terms
            </Link>
            .
          </p>

          <h2 style={h}>4. What happens after you submit</h2>
          <ul style={list}>
            <li style={item}>
              <strong style={strong}>Follows every rule:</strong> live
              straight away, or at the time you scheduled.
            </li>
            <li style={item}>
              <strong style={strong}>Breaks a rule:</strong> saved as Pending
              and hidden from the public until an admin approves it. If it is
              deleted instead, post a new ad that follows the rules.
            </li>
            <li style={item}>
              <strong style={strong}>Editing an ad</strong> checks it again. If
              the edit breaks a rule, the ad goes back to Pending.
            </li>
            <li style={item}>
              <strong style={strong}>Credits</strong> for boosts and extra
              cities are taken when you submit, including for ads that go to
              Pending.
            </li>
          </ul>

          <h2 style={h}>5. Tips for a quick approval</h2>
          <ul style={list}>
            <li style={item}>Write normally. Avoid ALL CAPS titles.</li>
            <li style={item}>
              Add alt text to your photos; it helps your ad show up in image
              search.
            </li>
            <li style={item}>
              Keep one ad per service and edit it, rather than posting a new one
              each time.
            </li>
          </ul>

          <div style={{ marginTop: "28px" }}>
            <Link href='/user/post' className='btn-accent'>
              Post an ad
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PostingRules;
