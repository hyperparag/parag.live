import { findMeta } from "@/component/categorymeta";
import Footer from "@/component/footer/footer";
import Gallery from "@/component/gallery/gallery";
import Header from "@/component/header/header";
import List from "@/component/list/list";
import OnlyTextList from "@/component/onlyTextList/OnlyTextList";
import { Pagination } from "antd";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Ahad = () => {
  const router = useRouter();
  const [layout, setLayout] = useState("list");
  const [regularPosts, setRegularPosts] = useState([]);
  const [boostedPosts, setBoostedPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);

  async function getPosts() {
    try {
      const response = await axios.get(
        `  https://paraglive-backend.vercel.app/api/products/all?page=${current}&category=${router?.query?.names?.[2]}&state=${router?.query?.names?.[0]}&cat=${router?.query?.names?.[1]}`,
      );
      setPage(response.data.pages);

      setBoostedPosts(response.data.data.products?.filter((a) => a.boosted));
      setRegularPosts(
        response.data.data.products?.filter((a) => !a.boosted),
      );
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  function groupByDate(objects) {
    const sorted = [...objects].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
    const groupedByDate = {};
    sorted.forEach((obj) => {
      const date = new Date(obj.createdAt).toDateString();
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
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
    if (!router?.query?.names?.[0]) {
      return;
    } else {
      getPosts();
    }
  }, [router?.query?.names?.[0], current, reload]);

  const onChange = (pageNumber) => {
    setCurrent(pageNumber);
  };

  let content;
  if (layout == "list") {
    content = <List data1={groupedData} data2={groupedData2} />;
  }
  if (layout == "text") {
    content = (
      <OnlyTextList data1={groupedData} data2={groupedData2} />
    );
  }
  if (layout == "gallery") {
    content = <Gallery data1={boostedPosts} data2={regularPosts} />;
  }

  const meta = findMeta(router?.query?.names);

  return (
    <div className='page-bg'>
      <Head>
        <title>{meta?.title}</title>
        <link rel='icon' href='/logo.png' />
        <meta name='title' content={`${meta?.title}`} />
        <meta name='description' content={`${meta?.description}`} />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='keywords' content={`${meta?.keywords}`} />
      </Head>
      <Header />
      <div className='w-[300px] gap-5 flex m-auto my-3'>
        <button
          className={`px-3 border-2 ${layout == "list" ? "font-bold" : ""}`}
          style={{
            borderColor: "var(--accent)",
            color: layout == "list" ? "#fff" : "var(--text)",
            background: layout == "list" ? "var(--accent)" : "transparent",
          }}
          onClick={() => setLayout("list")}
        >
          Ads List
        </button>
        <button
          className={`px-3 border-2 ${layout == "text" ? "font-bold" : ""}`}
          style={{
            borderColor: "var(--accent)",
            color: layout == "text" ? "#fff" : "var(--text)",
            background: layout == "text" ? "var(--accent)" : "transparent",
          }}
          onClick={() => setLayout("text")}
        >
          Only Text
        </button>
        <button
          className={`px-3 border-2 ${layout == "gallery" ? "font-bold" : ""}`}
          style={{
            borderColor: "var(--accent)",
            color: layout == "gallery" ? "#fff" : "var(--text)",
            background: layout == "gallery" ? "var(--accent)" : "transparent",
          }}
          onClick={() => setLayout("gallery")}
        >
          Gallery
        </button>
      </div>

      {loading ? (
        <div
          style={{ height: "700px" }}
          className='flex justify-center items-center'
        >
          <img className='' width={100} src='/loader.gif' alt='parag.live' />
        </div>
      ) : (
        <div
          className='sm:w-9/12 m-auto my-5 p-3 rounded'
          style={{ background: "var(--surface)", color: "var(--text)" }}
        >
          {(
            <>
              <ul className='flex gap-2'>
                <li style={{ color: "var(--text)" }}>
                  <Link href={`/`}>Home</Link>
                </li>
                &#62;
                <li style={{ color: "var(--text)" }}>
                  <Link href={`/${router?.query?.names?.[0]}`}>
                    {router?.query?.names?.[0]}
                  </Link>
                </li>
                &#62;
                <li style={{ color: "var(--text)" }}>
                  <Link href={`/${router?.query?.names?.[0]}`}>
                    {router?.query?.names?.[1]}
                  </Link>
                </li>
                &#62;
                <li className='font-bold' style={{ color: "var(--text)" }}>
                  {router?.query?.names?.[2]} ({page} results)
                </li>
              </ul>
              {content}
              <div className='mt-10 m-auto'>
                <Pagination
                  showSizeChanger={false}
                  pageSize={35}
                  defaultCurrent={current}
                  onChange={onChange}
                  total={page}
                />
              </div>
            </>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Ahad;
