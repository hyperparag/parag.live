import Head from "next/head";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const Footer = dynamic(() => import("@/component/footer/footer"));
const Header = dynamic(() => import("@/component/header/header"));
import style from "../../styles/moduleCss/blogDetails.module.css";
import axios from "axios";
import { useRouter } from "next/router";
import Image from "next/image";

const BlogDetails = () => {
  const router = useRouter();
  const id = router.query.id;
  const [blog, setBlogs] = useState([]);
  const [ads, setAds] = useState([]);
  const [isloading, setIsLoading] = useState(false);

  async function getUser() {
    try {
      const response = await axios.get(
        `  https://paraglive-backend.vercel.app/api/blogs/single?q=${id}`,
      );

      const data = response.data.data.blogs;
      setBlogs(data?.[0]);
      setIsLoading(false);
      getAds(data);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  }

  async function getAds(data) {
    try {
      const response = await axios.get(
        `  https://paraglive-backend.vercel.app/api/sideads/category?category=${encodeURIComponent(
          data?.[0]?.category ?? "",
        )}&fallback=1`,
      );

      const datas = response.data.ads;

      setAds(datas);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    if (!id) {
      return;
    } else if (id) {
      getUser();
    }
  }, [id]);

  return (
    <div className='page-bg'>
      <Head>
        <title>{blog?.title ? `${blog?.title}` : "loading"}</title>
        <link rel='icon' href='/favicon.ico' />
        <meta name='description' content={blog?.metaDesc} />
        <meta name='keywords' content={blog?.metaKey} />
      </Head>
      <Header />
      {isloading ? (
        <img
          className='block m-auto'
          width={100}
          src='/loader.gif'
          alt='parag.live'
        />
      ) : (
        <>
          <div className={style.blogContainer}>
            <div
              className='p-3 m-4 sm:m-10'
              style={{ background: "var(--surface)" }}
            >
              {/* A plain <img> that scales to the column: next/image with a fixed
                  500x100 box distorted every picture and refused any host that
                  was not whitelisted in next.config.js. Posts saved without a
                  picture hold the placeholder "avater", which is not a URL. */}
              {/^https?:\/\//.test(blog?.image || "") && (
                <img
                  className={style.blogImages}
                  src={blog.image}
                  alt={blog?.altText || blog?.title || "blog image"}
                />
              )}
              <br />
              {blog?.category == "Adult" ? (
                <span className={style.category}> {blog?.category} </span>
              ) : (
                ""
              )}

              {blog?.category == "Dating" ||
              blog?.category == "Community" ||
              blog?.category == "Services" ? (
                <span className={style.category1}> {blog?.category} </span>
              ) : (
                ""
              )}

              {blog?.category == "For Sell" ||
              blog?.category == "Jobs" ||
              blog?.category == "Sport and Fitness" ? (
                <span className={style.category2}> {blog?.category} </span>
              ) : (
                ""
              )}

              {blog?.category == "Housing" ||
              blog?.category == "Electronics and Computer" ||
              blog?.category == "Pets" ? (
                <span className={style.category3}> {blog?.category} </span>
              ) : (
                ""
              )}
              <br />
              <h1
                className='text-2xl font-bold'
                style={{ color: "var(--text)" }}
              >
                {blog?.title}
                <br className='block sm:hidden ' />
                <span className='text-sm font-normal'></span>
              </h1>
              <br />

              <div
                className={style.desc}
                dangerouslySetInnerHTML={{
                  __html: blog?.desc,
                }}
              ></div>
            </div>
            <div className=' p-3 m-4 sm:m-8 h-fit'>
              {ads.map((a) => (
                <div className={style.othersLinkContainer} key={a._id}>
                  <a href={`${a.link}`} target='_blank' rel='noreferrer'>
                    <Image
                      className={style.othersLinkImage}
                      src={`${a.image}`}
                      width={1000}
                      height={800}
                      alt='image'
                    />
                    <p style={{ color: "var(--accent)" }}>{a.title}</p>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      <Footer />
    </div>
  );
};

export default BlogDetails;
