import { findCityMeta } from "@/component/cityMeta";
import Footer from "@/component/footer/footer";
import Gallery from "@/component/gallery/gallery";
import Header from "@/component/header/header";
import Responsive from "@/component/responsive/responsive";
import List from "@/component/list/list";
import OnlyTextList from "@/component/onlyTextList/OnlyTextList";
import { Pagination } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { api } from "@/component/utils/api";

const myLink = process.env.NEXT_PUBLIC_OFFERLINK;

const PostList = () => {
  const router = useRouter();
  const [layout, setLayout] = useState("list");
  const [regularPosts, setRegularPosts] = useState([]);
  const [boostedPosts, setBoostedPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(true);
  const [gallery, setGallery] = useState([]);
  const [links, setLinks] = useState();
  const [age, setAge] = useState("");
  const [category, setCategory] = useState("Women-Men");
  const [reload, setReload] = useState(false);
  const [sideAds, setSideAds] = useState([]);

  async function getPosts() {
    try {
      const response = await axios.get(
        `https://paraglive-backend.vercel.app/api/products/all?page=${current}&category=${category}&state=${router?.query?.post}`,
      );

      setLinks(response.data.links?.[0]);
      setPage(response.data.pages);
      setGallery(response.data.data.products);
      setBoostedPosts(response.data.data.products?.filter((a) => a.boosted));
      setRegularPosts(
        response.data.data.products?.filter((a) => !a.boosted),
      );
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setPage(0);
      setGallery([]);
      setBoostedPosts([]);
      setRegularPosts([]);
    }
  }

  function groupByDate(objects) {
    const sorted = [...objects].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
    const groupedByDate = {};
    sorted.forEach((obj) => {
      const date = new Date(obj.createdAt).toDateString();
      if (!groupedByDate[date]) groupedByDate[date] = [];
      groupedByDate[date].push(obj);
    });
    return Object.entries(groupedByDate)
      .map(([date, objects]) => ({ date, objects }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  const groupedData = groupByDate(boostedPosts);
  const groupedData2 = groupByDate(regularPosts);

  useEffect(() => {
    setLoading(true);
    if (!router?.query?.post) return;
    else getPosts();
  }, [router?.query?.post, current, reload, category]);

  useEffect(() => {
    let cancelled = false;

    async function getSideAds() {
      try {
        const response = await axios.get(
          api(
            `/api/sideads/category?category=${encodeURIComponent(
              category ?? "",
            )}&fallback=1&limit=4`,
          ),
        );
        if (!cancelled) setSideAds(response.data?.ads ?? []);
      } catch (error) {
        if (!cancelled) setSideAds([]);
      }
    }

    getSideAds();
    return () => {
      cancelled = true;
    };
  }, [category]);

  const onChange = (pageNumber) => setCurrent(pageNumber);

  let content;
  if (layout == "list")
    content = (
      <List
        data1={groupedData}
        data2={groupedData2}
        category={category}
      />
    );
  if (layout == "text")
    content = (
      <OnlyTextList
        data1={groupedData}
        data2={groupedData2}
        category={category}
      />
    );
  if (layout == "gallery")
    content = <Gallery data1={gallery} category={category} />;

  const setAdult = (e) => {
    Cookies.set("age", e);
    setReload(!reload);
  };
  useEffect(() => {
    const useOld = Cookies.get("age");
    setAge(useOld);
  }, [reload]);

  const meta = findCityMeta({
    city: router?.query?.post,
    state: router?.query?.state,
  });
  const catChange = (e) => setCategory(e);

  const categories = [
    "Women-Men",
    "Men-Men",
    "Men-Women",
    "Transgender",
    "Women-Women",
  ];

  return (
    <div className='page-bg'>
      <Head>
        <title>{meta?.title}</title>
        <link rel='icon' href='/logo.png' />
        <meta name='title' content={`${meta?.title}`} />
        <meta name='description' content={`${meta?.description}`} />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='keywords' content={`${meta?.keywords}`} />
        <link
          name='canonical'
          rel='canonical'
          href={`https://parag.live${router?.asPath}`}
        />
        <meta name='robots' content='index,follow' />
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
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textDecoration: "none",
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
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textDecoration: "none",
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
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textDecoration: "none",
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

      {/* Responsive banner ad (managed under Ads > Responsive Ad) */}
      <Responsive />

      {/* Layout toggle */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          display: "flex",
          gap: "8px",
          padding: "16px",
        }}
      >
        {["list", "gallery"].map((l) => (
          <button
            key={l}
            onClick={() => setLayout(l)}
            style={{
              background: layout === l ? "var(--accent)" : "var(--surface)",
              border: `1px solid ${layout === l ? "var(--accent)" : "var(--border)"}`,
              color:
                layout === l ? "var(--text-inverse)" : "var(--text-secondary)",
              fontWeight: layout === l ? 600 : 500,
              fontSize: "0.8rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              padding: "8px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {l === "list" ? "Ads List" : "Gallery"}
          </button>
        ))}
      </div>

      {/* Main content */}
      {loading ? (
        <div className='themed-loader' style={{ minHeight: "400px" }}>
          <img
            width={80}
            src='/loader.gif'
            alt='loading'
            style={{ opacity: 0.7 }}
          />
        </div>
      ) : (
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "0 12px 48px",
          }}
        >
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "var(--shadow)",
            }}
          >
            {age == undefined ? (
              <div style={{ padding: "24px" }}>
                <h1
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 800,
                    color: "var(--accent)",
                    marginBottom: "16px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Age Disclaimer
                </h1>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                    marginBottom: "24px",
                  }}
                >
                  This section contains sexual content, including pictorial
                  nudity and adult language. It is to be accessed only by
                  persons who are 21 years of age or older and who live in a
                  community where explicit adult materials are not prohibited by
                  law. By proceeding, you confirm you meet the above
                  qualifications.
                </p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    className='btn-accent'
                    onClick={() => setAdult("Adult")}
                  >
                    I am over 18
                  </button>
                  <Link href='/'>
                    <button className='btn-ghost'>Exit</button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Top bar: breadcrumb + category select */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginBottom: "20px",
                    paddingBottom: "16px",
                    borderBottom: "1px solid var(--border)",
                  }}
                  className='sm:flex-row sm:items-center sm:justify-between'
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      flexWrap: "wrap",
                      fontSize: "0.8rem",
                      color: "var(--text-muted)",
                    }}
                  >
                    <Link
                      href='/'
                      style={{
                        color: "var(--text-secondary)",
                        textDecoration: "none",
                      }}
                    >
                      Home
                    </Link>
                    <span style={{ color: "var(--text-muted)" }}>&rsaquo;</span>
                    <Link
                      href={`/${router?.query?.post}`}
                      style={{
                        color: "var(--text-secondary)",
                        textDecoration: "none",
                      }}
                    >
                      {router?.query?.post}
                    </Link>
                    <span style={{ color: "var(--text-muted)" }}>&rsaquo;</span>
                    <span style={{ color: "var(--text)", fontWeight: 600 }}>
                      {category ?? "Adult"}
                    </span>
                    {page > 0 && (
                      <>
                        <span style={{ color: "var(--text-muted)" }}>
                          &rsaquo;
                        </span>
                        <span
                          style={{
                            color: "var(--text-muted)",
                            fontSize: "0.75rem",
                          }}
                        >
                          {page} results
                        </span>
                      </>
                    )}
                  </div>
                  <select
                    className='themed-select'
                    onChange={(e) => catChange(e.target.value)}
                    value={category}
                    style={{ width: "auto" }}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {content}

                {sideAds?.length > 0 && (
                  <div style={{ marginTop: "28px" }}>
                    <h2
                      style={{
                        color: "var(--text)",
                        fontSize: "1rem",
                        fontWeight: 700,
                        marginBottom: "10px",
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
                                height: "110px",
                                objectFit: "cover",
                              }}
                            />
                          ) : null}
                          <div style={{ padding: "8px 10px" }}>
                            <p
                              style={{
                                color: "var(--text-secondary)",
                                fontSize: "0.78rem",
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

                <div
                  style={{
                    marginTop: "28px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Pagination
                    showSizeChanger={false}
                    pageSize={35}
                    defaultCurrent={current}
                    current={current}
                    onChange={onChange}
                    total={page}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PostList;
