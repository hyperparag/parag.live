import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Image } from "antd";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
const Footer = dynamic(() => import("@/component/footer/footer2"));

import { AiOutlineMail } from "react-icons/ai";
import { BsTelephone } from "react-icons/bs";
import { ImBlocked } from "react-icons/im";
import { findPostMeta } from "@/component/postmeta";
import Header from "@/component/header/header";
import { api } from "@/component/utils/api";

const myLink = process.env.NEXT_PUBLIC_OFFERLINK;

function stripLinks(html) {
  if (!html) return "";
  return html.replace(/<a\b[^>]*>(.*?)<\/a>/gi, "$1");
}

const Details = () => {
  const router = useRouter();
  const id = router?.query?.id;
  const query = router.asPath.split("?")?.[1];
  const [postDetails, setPost] = useState();
  const [newAds, setAds] = useState([]);
  const [resonsive, setResposiveAds] = useState({});
  const [rainbow, setRainbow] = useState({});
  const [links, setLinks] = useState();
  const [loading, setLoading] = useState(false);
  // Related ads paging. The list cycles rather than ending, so there is always
  // something more to show.
  const [relatedPage, setRelatedPage] = useState(1);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [relatedExhausted, setRelatedExhausted] = useState(false);
  const [sideAds, setSideAds] = useState([]);

  useEffect(() => {
    setLoading(true);
    if (id) {
      getUser(id);
    } else {
      return;
    }
  }, [id]);

  async function getUser(id) {
    try {
      const response = await axios.get(
        `https://paraglive-backend.vercel.app/api/products/${id}`,
      );
      setPost(response.data.data[0]);
      setAds(response.data.related);
      setLinks(response.data.links?.[0]);
      setResposiveAds(response.data.responsiveads);
      setRainbow(response.data.rainbow);
      setLoading(false);

      // Navigating to another ad starts the related list over.
      setRelatedPage(1);
      setRelatedExhausted(false);

      // Side ads for this ad category, falling back to the latest ones so the
      // slot is not left empty when no category matches.
      try {
        const subCategory = response.data.data?.[0]?.subCategory;
        const sideRes = await axios.get(
          api(
            `/api/sideads/category?category=${encodeURIComponent(
              subCategory ?? "",
            )}&fallback=1&limit=4`,
          ),
        );
        setSideAds(sideRes.data?.ads ?? []);
      } catch (sideError) {
        setSideAds([]);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }

  /**
   * Load the next page of related ads and append them.
   *
   * The backend wraps its offset with a modulo, so once the end of the list is
   * reached it starts again from the beginning. Repeats are intentional: the
   * button should never stop producing ads.
   */
  async function loadMoreRelated() {
    if (!id || relatedLoading) return;
    setRelatedLoading(true);
    try {
      const nextPage = relatedPage + 1;
      const response = await axios.get(
        api(`/api/products/${id}/related?page=${nextPage}&limit=8`),
      );
      const more = response.data?.data?.related ?? [];
      if (more.length === 0) {
        // Only happens when the whole site has no other ads to show.
        setRelatedExhausted(true);
      } else {
        setAds((prev) => [...(prev ?? []), ...more]);
        setRelatedPage(nextPage);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setRelatedLoading(false);
    }
  }

  const meta = findPostMeta(router.query);
  const words = rainbow?.text?.split(" ");
  const cleanDescription = stripLinks(postDetails?.description);

  return (
    <div className='page-bg'>
      <Head>
        <link rel='icon' href='/logo.png' />
        <title>{postDetails?.name?.slice(0, 65)}</title>
        <meta name='title' content={`${postDetails?.name?.slice(0, 65)}`} />
        <meta
          name='description'
          content={`${postDetails?.description?.slice(0, 318)}`}
        />
        <link
          name='canonical'
          rel='canonical'
          href={`https://parag.live${router?.asPath}`}
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='keywords' content={`${meta?.keywords}`} />
      </Head>

      <Header />

      {/* Top links bar */}
      <div
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          padding: "10px 24px",
          display: "flex",
          justifyContent: "center",
          gap: "32px",
          flexWrap: "wrap",
        }}
      >
        {links ? (
          <>
            <Link
              target='_blank'
              rel='noopener noreferrer'
              href={`${links?.shemale}`}
              style={{
                color: "var(--accent)",
                fontSize: "0.8rem",
                fontWeight: 600,
                textTransform: "uppercase",
                textDecoration: "none",
                letterSpacing: "0.06em",
              }}
            >
              Shemale Escorts
            </Link>
            <Link
              target='_blank'
              rel='noopener noreferrer'
              href={`${links?.meet}`}
              style={{
                color: "var(--accent)",
                fontSize: "0.8rem",
                fontWeight: 600,
                textTransform: "uppercase",
                textDecoration: "none",
                letterSpacing: "0.06em",
              }}
            >
              Meet & Fuck
            </Link>
            <Link
              target='_blank'
              rel='noopener noreferrer'
              href={`${links?.live}`}
              style={{
                color: "var(--accent)",
                fontSize: "0.8rem",
                fontWeight: 600,
                textTransform: "uppercase",
                textDecoration: "none",
                letterSpacing: "0.06em",
              }}
            >
              Live Escorts
            </Link>
          </>
        ) : (
          <>
            <Link
              href='#'
              style={{
                color: "var(--accent)",
                fontSize: "0.8rem",
                fontWeight: 600,
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Shemale Escorts
            </Link>
            <Link
              href='#'
              style={{
                color: "var(--accent)",
                fontSize: "0.8rem",
                fontWeight: 600,
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Meet &amp; Fuck
            </Link>
            <Link
              href='#'
              style={{
                color: "var(--accent)",
                fontSize: "0.8rem",
                fontWeight: 600,
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Live Escorts
            </Link>
          </>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "24px 16px 48px",
        }}
      >
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "var(--shadow)",
          }}
        >
          {loading ? (
            <div className='themed-loader'>
              <img width={100} src='/loader.gif' alt='parag.live' />
            </div>
          ) : (
            <>
              <h1
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "var(--text)",
                  marginBottom: "16px",
                }}
                className='sm:text-2xl'
              >
                {postDetails?.name}
              </h1>

              {/* Contact buttons */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                {postDetails?.email && (
                  <a
                    href={`mailto:${postDetails?.email}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "var(--success)",
                      color: "#fff",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      textDecoration: "none",
                      transition: "opacity 0.2s",
                    }}
                  >
                    <AiOutlineMail style={{ fontSize: "1.2rem" }} />
                    {postDetails?.email}
                  </a>
                )}
                {postDetails?.phone && (
                  <a
                    href={`tel:${postDetails?.phone}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "var(--warning)",
                      color: "#fff",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      textDecoration: "none",
                      transition: "opacity 0.2s",
                    }}
                  >
                    <BsTelephone style={{ fontSize: "1rem" }} />
                    {postDetails?.phone}
                  </a>
                )}
              </div>

              {/* Scam alert */}
              <div
                style={{
                  border: "2px dashed var(--error)",
                  borderRadius: "12px",
                  padding: "20px",
                  margin: "16px auto",
                  maxWidth: "600px",
                  textAlign: "center",
                }}
              >
                <h2
                  style={{
                    color: "var(--error)",
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    marginBottom: "8px",
                  }}
                >
                  SCAM Alert !!!!!
                </h2>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                  }}
                >
                  If ad poster asks for money, credit card info, cashapp, gift
                  card or tell you to verify in another website, consider its a
                  SCAM !
                  <br />
                  Don&apos;t pay anything before meet the Provider!
                </p>
              </div>

              <div
                style={{
                  background: "var(--accent-dim)",
                  borderRadius: "8px",
                  padding: "12px",
                  textAlign: "center",
                  marginBottom: "24px",
                  maxWidth: "600px",
                  margin: "12px auto 24px",
                  color: "var(--text)",
                  fontSize: "0.85rem",
                }}
              >
                When you call, tell me that you saw my ad on PARAG
              </div>

              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid var(--border)",
                  marginBottom: "24px",
                }}
              />

              {/* Description + Images */}
              <div className='flex flex-col-reverse gap-5 items-start sm:flex-row sm:grid sm:grid-cols-2'>
                <div
                  style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}
                  dangerouslySetInnerHTML={{ __html: cleanDescription }}
                ></div>

                <div className='grid grid-cols-2' style={{ gap: "8px" }}>
                  <Image.PreviewGroup
                    preview={{
                      onChange: (current, prev) =>
                        console.log(
                          `current index: ${current}, prev index: ${prev}`,
                        ),
                    }}
                  >
                    {!postDetails?.imgTwo || postDetails?.imgTwo == "empty" ? (
                      ""
                    ) : (
                      <Image
                        style={{ borderRadius: "8px", objectFit: "cover" }}
                        width={200}
                        height={250}
                        src={postDetails?.imgTwo}
                        alt={
                          postDetails?.altTexts?.[1] || postDetails?.name
                        }
                      />
                    )}
                    {!postDetails?.imgThree ||
                    postDetails?.imgThree == "empty" ? (
                      ""
                    ) : (
                      <Image
                        style={{ borderRadius: "8px", objectFit: "cover" }}
                        width={200}
                        height={250}
                        src={postDetails?.imgThree}
                        alt={
                          postDetails?.altTexts?.[2] || postDetails?.name
                        }
                      />
                    )}
                    {!postDetails?.imgOne || postDetails?.imgOne == "empty" ? (
                      ""
                    ) : (
                      <Image
                        style={{ borderRadius: "8px", objectFit: "cover" }}
                        width={200}
                        height={250}
                        src={postDetails?.imgOne}
                        alt={
                          postDetails?.altTexts?.[0] || postDetails?.name
                        }
                      />
                    )}
                    {!postDetails?.imgFour ||
                    postDetails?.imgFour == "empty" ? (
                      ""
                    ) : (
                      <Image
                        style={{ borderRadius: "8px", objectFit: "cover" }}
                        width={200}
                        height={250}
                        src={postDetails?.imgFour}
                        alt={
                          postDetails?.altTexts?.[3] || postDetails?.name
                        }
                      />
                    )}
                  </Image.PreviewGroup>
                </div>
              </div>

              {/* Rainbow text */}
              <div style={{ textAlign: "center", margin: "48px 0" }}>
                <Link
                  href={rainbow?.link ?? "/"}
                  style={{ textDecoration: "none" }}
                >
                  {words?.map((word, index) => (
                    <span
                      key={index}
                      style={{ color: `hsl(${index * 80}, 100%, 40%)` }}
                      className='text-3xl font-bold'
                    >
                      {word}{" "}
                    </span>
                  ))}
                </Link>
              </div>

              <Link
                href={`/reports/${id}__${postDetails?.owner?.[0]?._id}`}
              >
                <button
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "var(--error)",
                    color: "#fff",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    border: "none",
                    cursor: "pointer",
                    transition: "opacity 0.2s",
                  }}
                >
                  <ImBlocked style={{ fontSize: "1rem" }} /> Ad Report
                </button>
              </Link>

              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid var(--border)",
                  margin: "24px 0",
                }}
              />
            </>
          )}

          {/* Responsive ad */}
          <div style={{ textAlign: "center" }}>
            <Link href={resonsive?.link ?? "/"}>
              <img
                className='sm:w-[600px] m-auto mt-10'
                src={resonsive?.image}
                style={{ borderRadius: "8px" }}
              />
            </Link>
          </div>

          {/* Related ads */}
          {newAds?.length ? (
            <h2
              style={{
                color: "var(--text)",
                fontSize: "1.25rem",
                fontWeight: 700,
                marginTop: "32px",
                marginBottom: "16px",
              }}
            >
              Related Ads
            </h2>
          ) : (
            ""
          )}

          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
            {newAds?.map((a, i) => (
              <Link
                // The list cycles, so the same ad can legitimately appear twice;
                // the index keeps React keys unique.
                key={`${a._id}-${i}`}
                href={`${a?._id}?${query}`}
                target='_blank'
                rel='noreferrer'
                style={{
                  display: "block",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.boxShadow = "var(--shadow)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ overflow: "hidden" }}>
                  <img
                    src={a?.imgOne}
                    style={{
                      width: "100%",
                      height: "160px",
                      objectFit: "cover",
                      transition: "transform 0.3s",
                    }}
                    className='sm:h-[200px]'
                    alt={a?.altTexts?.[0] || a?.name}
                    onMouseEnter={(e) =>
                      (e.target.style.transform = "scale(1.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.transform = "scale(1)")
                    }
                  />
                </div>
                <div style={{ padding: "10px" }}>
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      lineHeight: 1.4,
                    }}
                  >
                    {a?.name?.slice(0, 50)}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {newAds?.length > 0 && !relatedExhausted && (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button
                onClick={loadMoreRelated}
                disabled={relatedLoading}
                className='btn-accent'
                style={{
                  opacity: relatedLoading ? 0.6 : 1,
                  cursor: relatedLoading ? "wait" : "pointer",
                }}
              >
                {relatedLoading ? "Loading..." : "See More"}
              </button>
            </div>
          )}

          {/* Side ads. These existed in the admin panel but were only ever
              rendered on blog detail pages, so they looked switched off. */}
          {sideAds?.length > 0 && (
            <div style={{ marginTop: "32px" }}>
              <h2
                style={{
                  color: "var(--text)",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  marginBottom: "12px",
                }}
              >
                Sponsored
              </h2>
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                {sideAds.map((ad) => (
                  <a
                    key={ad._id}
                    href={ad.link || "#"}
                    target='_blank'
                    rel='noreferrer nofollow sponsored'
                    style={{
                      display: "block",
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: "1px solid var(--border)",
                      background: "var(--surface)",
                      textDecoration: "none",
                    }}
                  >
                    {ad.image && ad.image !== "undefined" ? (
                      <img
                        src={ad.image}
                        alt={ad.title || "Sponsored"}
                        style={{
                          width: "100%",
                          height: "120px",
                          objectFit: "cover",
                        }}
                      />
                    ) : null}
                    <div style={{ padding: "10px" }}>
                      <p
                        style={{
                          color: "var(--text-secondary)",
                          fontSize: "0.8rem",
                          fontWeight: 500,
                        }}
                      >
                        {ad.title}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Details;
