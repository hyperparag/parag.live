import User from "@/component/user";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Head from "next/head";
import Header from "@/component/header/header";
import Footer from "@/component/footer/footer";
import { Input, Pagination, Select } from "antd";
import cate from "../../public/category.json";
import { useSession } from "next-auth/react";
import Script from "next/script";
const { Search } = Input;

const Dashboards = () => {
  const { users, usersStringfy } = User();
  const { data: session } = useSession();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [startIndex, setStartIndex] = useState(0);

  async function posts() {
    if (session) {
      try {
        const response = await axios.get(
          `https://paraglive-backend.vercel.app/api/products/posterid/${session?.user?.id}?page=${pages}&searchText=${searchText}&status=${status}&category=${category}`,
          { method: "GET" },
        );
        setLoading(false);
        if (response?.code == 404) {
          setAds([]);
        } else {
          const post = response.data.data.posts;
          setPage(response.data.pages);
          setAds(post);
          setStartIndex(response?.data?.startIndex);
        }
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    }
  }

  useEffect(() => {
    setLoading(true);
    if (session) {
      posts();
    } else {
      return;
    }
  }, [session?.user?.email, pages, category, status, searchText]);

  const deletePost = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://paraglive-backend.vercel.app/api/products/${id}`, {})
          .then((response) => {
            if (response.data.status == "success") {
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
            }
            const newPost = ads?.filter((a) => a._id !== id);
            setAds(newPost);
          });
      }
    });
  };

  const onChange = (page) => setPages(page);
  const onChangeCategory = (value) =>
    setCategory(value === undefined ? "" : value);
  const onChangeStatus = (value) => setStatus(value === undefined ? "" : value);
  const onSearch = (value) => setSearchText(value === undefined ? "" : value);

  return (
    <div className='page-bg'>
      <Head>
        <title>My Profile</title>
      </Head>
      <Header />

      <div
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px 16px" }}
      >
        {/* Profile card */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "var(--shadow)",
          }}
        >
          {/* Top bar with credits & email */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "8px 16px",
                  border: "1px solid var(--accent)",
                  borderRadius: "8px",
                  color: "var(--accent)",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
              >
                Credits: {users?.credit?.toFixed(2)}
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "8px 16px",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--text-secondary)",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
              >
                Ads: {ads?.length ? page : 0}
              </span>
            </div>
            <div style={{ textAlign: "right" }}>
              <p
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "var(--text)",
                  marginBottom: "4px",
                }}
                className='sm:text-lg'
              >
                {session?.user?.email}
              </p>
              <Link
                href={`/user/edit/${users._id}`}
                style={{
                  color: "var(--accent)",
                  fontSize: "0.85rem",
                  textDecoration: "none",
                }}
              >
                Edit Profile
              </Link>
            </div>
          </div>

          {/* Nav tabs */}
          <div
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              padding: "12px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", gap: "16px" }}>
              <Link
                href={"/dashboard/profile"}
                style={{
                  color: "var(--accent)",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  textDecoration: "none",
                }}
              >
                My Profile
              </Link>
              <Link
                href={"/dashboard/recharge"}
                style={{
                  color: "var(--text-secondary)",
                  fontWeight: 500,
                  fontSize: "0.85rem",
                  textDecoration: "none",
                }}
              >
                My Recharge
              </Link>
            </div>
            <Link href={`/recharge-credits/`}>
              <button
                className='btn-accent'
                style={{ padding: "6px 16px", fontSize: "0.8rem" }}
              >
                Buy Credit
              </button>
            </Link>
          </div>

          {/* Filters */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <Select
                showSearch
                className='w-36'
                allowClear
                placeholder='Category'
                optionFilterProp='children'
                onChange={onChangeCategory}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={cate.map((a) => ({ label: a.name, value: a.name }))}
              />
              <Select
                placeholder='Status'
                className='w-36'
                optionFilterProp='children'
                onChange={onChangeStatus}
                allowClear
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={[
                  { value: "false", label: "Free" },
                  { value: "true", label: "Boosted" },
                ]}
              />
            </div>
            <Search
              className='w-72'
              placeholder='Post Name'
              onSearch={onSearch}
              allowClear
              enterButton
            />
          </div>

          {/* Table */}
          {loading ? (
            <div className='themed-loader'>
              <p style={{ color: "var(--text-secondary)" }}>loading....</p>
            </div>
          ) : (
            <>
              {ads?.length == 0 ? (
                <p
                  style={{
                    fontSize: "1.25rem",
                    textAlign: "center",
                    color: "var(--text-muted)",
                    padding: "48px 0",
                  }}
                >
                  No Data Found
                </p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th
                          style={{
                            background: "var(--surface-2)",
                            color: "var(--text-secondary)",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            padding: "12px",
                            border: "1px solid var(--border)",
                          }}
                        ></th>
                        <th
                          style={{
                            background: "var(--surface-2)",
                            color: "var(--text-secondary)",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            padding: "12px",
                            border: "1px solid var(--border)",
                          }}
                        >
                          Date
                        </th>
                        <th
                          style={{
                            background: "var(--surface-2)",
                            color: "var(--text-secondary)",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            padding: "12px",
                            border: "1px solid var(--border)",
                          }}
                        >
                          Title
                        </th>
                        <th
                          style={{
                            background: "var(--surface-2)",
                            color: "var(--text-secondary)",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            padding: "12px",
                            border: "1px solid var(--border)",
                          }}
                        >
                          Category
                        </th>
                        <th
                          style={{
                            background: "var(--surface-2)",
                            color: "var(--text-secondary)",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            padding: "12px",
                            border: "1px solid var(--border)",
                          }}
                        >
                          Boost
                        </th>
                        <th
                          style={{
                            background: "var(--surface-2)",
                            color: "var(--text-secondary)",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            padding: "12px",
                            border: "1px solid var(--border)",
                          }}
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {ads?.map((a, index) => (
                        <tr key={a._id}>
                          <td
                            style={{
                              padding: "10px 12px",
                              border: "1px solid var(--border)",
                              color: "var(--text)",
                              fontWeight: 600,
                            }}
                          >
                            {startIndex + index}
                          </td>
                          <td
                            style={{
                              padding: "10px 12px",
                              border: "1px solid var(--border)",
                              color: "var(--text-secondary)",
                              fontSize: "0.85rem",
                            }}
                          >
                            {a?.createdAt?.split("T")[0]}
                          </td>
                          <td
                            style={{
                              padding: "10px 12px",
                              border: "1px solid var(--border)",
                              color: "var(--text)",
                              fontSize: "0.85rem",
                            }}
                          >
                            {a.name.slice(0, 50)}
                          </td>
                          <td
                            style={{
                              padding: "10px 12px",
                              border: "1px solid var(--border)",
                              color: "var(--text-secondary)",
                              fontSize: "0.85rem",
                            }}
                          >
                            {a.category} &gt; {a.subCategory}
                          </td>
                          <td
                            style={{
                              padding: "10px 12px",
                              border: "1px solid var(--border)",
                              textAlign: "center",
                            }}
                          >
                            {(() => {
                              const boostExpiry = a.boostExpiresAt
                                ? new Date(a.boostExpiresAt)
                                : null;
                              const boostActive =
                                boostExpiry && boostExpiry > new Date();
                              const boostExpired =
                                boostExpiry && boostExpiry <= new Date();

                              if (boostActive) {
                                return (
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                      gap: "3px",
                                    }}
                                  >
                                    <span
                                      style={{
                                        background: "var(--text)",
                                        color: "var(--surface)",
                                        padding: "2px 10px",
                                        borderRadius: "4px",
                                        fontSize: "0.7rem",
                                        fontWeight: 700,
                                        letterSpacing: "0.06em",
                                        textTransform: "uppercase",
                                      }}
                                    >
                                      Premium
                                    </span>
                                    <span
                                      style={{
                                        fontSize: "0.65rem",
                                        color: "var(--text-muted)",
                                      }}
                                    >
                                      until {boostExpiry.toLocaleDateString()}
                                    </span>
                                  </div>
                                );
                              }
                              if (boostExpired) {
                                return (
                                  <span
                                    style={{
                                      background: "var(--surface-2)",
                                      color: "var(--text-muted)",
                                      padding: "2px 10px",
                                      borderRadius: "4px",
                                      fontSize: "0.7rem",
                                      fontWeight: 600,
                                      border: "1px solid var(--border)",
                                      display: "inline-block",
                                      textTransform: "uppercase",
                                      letterSpacing: "0.06em",
                                    }}
                                  >
                                    Expired
                                  </span>
                                );
                              }
                              return (
                                <span
                                  style={{
                                    background: "transparent",
                                    color: "var(--text-muted)",
                                    padding: "2px 10px",
                                    borderRadius: "4px",
                                    fontSize: "0.7rem",
                                    fontWeight: 600,
                                    border: "1px solid var(--border)",
                                    display: "inline-block",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.06em",
                                  }}
                                >
                                  Free
                                </span>
                              );
                            })()}
                          </td>
                          <td
                            style={{
                              padding: "10px 12px",
                              border: "1px solid var(--border)",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                gap: "6px",
                                flexWrap: "wrap",
                              }}
                            >
                              <Link href={`/my-post/update/${a._id}`}>
                                <button
                                  style={{
                                    background: "var(--info)",
                                    color: "#fff",
                                    border: "none",
                                    padding: "4px 12px",
                                    borderRadius: "6px",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                  }}
                                >
                                  Edit
                                </button>
                              </Link>
                              <Link href={`/my-post/${a._id}`}>
                                <button
                                  style={{
                                    background: "var(--warning)",
                                    color: "#fff",
                                    border: "none",
                                    padding: "4px 12px",
                                    borderRadius: "6px",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                  }}
                                >
                                  View
                                </button>
                              </Link>
                              <button
                                onClick={() => deletePost(a._id)}
                                style={{
                                  background: "var(--error)",
                                  color: "#fff",
                                  border: "none",
                                  padding: "4px 12px",
                                  borderRadius: "6px",
                                  fontSize: "0.75rem",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          <div
            style={{
              marginTop: "24px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Pagination
              defaultCurrent={pages}
              pageSize={10}
              onChange={onChange}
              showSizeChanger={false}
              total={page}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboards;
