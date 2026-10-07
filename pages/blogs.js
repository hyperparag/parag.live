import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
import React, { useContext, useEffect, useState } from "react";
const Footer = dynamic(() => import("@/component/footer/footer2"));
const Header = dynamic(() => import("@/component/header/header"));
import { Input, Pagination } from "antd";
import category from "../public/category.json";
import { MyContext } from "./_app";
import Script from "next/script";

const { Search } = Input;

const Blogs = () => {
  const { blogcurrent, setBlogCurrent, catKey, setCatKey } =
    useContext(MyContext);
  const [blogs, setBlogs] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [pages, setPage] = useState(1);

  async function getBlogs() {
    try {
      const response = await axios.get(
        `  https://paraglive-backend.vercel.app/api/blogs?page=${blogcurrent}&q=${keyword}&cat=${catKey}`,
      );
      const data = response.data;
      setBlogs(data);
      setPage(data.page);
      setIsLoading(false);
    } catch (error) {
      setBlogs([]);
      setIsLoading(false);
      console.error(error);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    getBlogs();
  }, [catKey, keyword, blogcurrent]);

  const onSearch = (e) => {
    setKeyword(e);
    setBlogCurrent(1);
  };

  const onChange = (page) => {
    setBlogCurrent(page);
  };

  const changeCategory = (e) => {
    setCatKey(e.target.value);
    setBlogCurrent(1);
  };

  return (
    <div className='page-bg'>
      <Head>
        <link rel='icon' href='/logo.png' />
        <title>Blogs</title>
      </Head>
      <Header />

      <div
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px 16px" }}
      >
        {/* Filter bar */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "16px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Showing {blogs?.data?.blogs?.length || 0} posts of{" "}
            {blogs?.page || 0}
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <select
              className='themed-select'
              onChange={(e) => changeCategory(e)}
              defaultValue={catKey}
              style={{ minWidth: "140px" }}
            >
              {catKey && <option value={catKey}>{catKey}</option>}
              <option value={""}>Select Category</option>
              <option value={""}>All</option>
              {category.map((a) => (
                <option key={a.name} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
            <Search
              style={{ maxWidth: "200px" }}
              placeholder='title or writer name'
              onSearch={(e) => onSearch(e)}
              enterButton
            />
          </div>
        </div>

        {isloading ? (
          <div className='themed-loader'>
            <img width={100} src='/loader.gif' alt='parag.live' />
          </div>
        ) : (
          <>
            {blogs?.data?.blogs?.length == 0 || blogs?.length == 0 ? (
              <p
                style={{
                  fontSize: "1.25rem",
                  color: "var(--error)",
                  textAlign: "center",
                  padding: "48px 0",
                }}
              >
                No Blog Found
              </p>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                {blogs?.data?.blogs?.map((a) => (
                  <Link
                    href={`/blog/${a.permalink}`}
                    key={a._id}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: "12px",
                        overflow: "hidden",
                        transition: "all 0.2s ease",
                        height: "100%",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--accent)";
                        e.currentTarget.style.boxShadow = "var(--shadow)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--border)";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      {/^https?:\/\//.test(a?.image || "") && (
                        <img
                          style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                          }}
                          src={a?.image}
                          alt={a?.altText || a?.title}
                        />
                      )}
                      <div style={{ padding: "16px" }}>
                        <div style={{ marginBottom: "8px" }}>
                          {a?.category && (
                            <span
                              style={{
                                display: "inline-block",
                                padding: "2px 10px",
                                borderRadius: "20px",
                                fontSize: "0.7rem",
                                fontWeight: 600,
                                textTransform: "uppercase",
                                border: "1px solid var(--accent)",
                                color: "var(--accent)",
                              }}
                            >
                              {a?.category}
                            </span>
                          )}
                        </div>
                        <h2
                          style={{
                            fontSize: "1rem",
                            fontWeight: 700,
                            color: "var(--text)",
                            lineHeight: 1.4,
                          }}
                        >
                          {a?.title}
                        </h2>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <div
              style={{
                marginTop: "40px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Pagination
                defaultCurrent={blogcurrent}
                pageSize={6}
                onChange={onChange}
                showSizeChanger={false}
                total={pages}
              />
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Blogs;
