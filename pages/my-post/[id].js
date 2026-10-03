import axios from "axios";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import { Image } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
const Footer = dynamic(() => import("@/component/footer/footer2"));
const Header = dynamic(() => import("@/component/header/header"));
import style from "../../styles/moduleCss/postDetails.module.css";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import { api, authHeaders, jsonAuthHeaders } from "@/component/utils/api";

const Details = () => {
  const router = useRouter();
  const id = router?.query?.id;
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reposting, setReposting] = useState(false);
  const { data: session } = useSession();

  async function posts(id) {
    try {
      const response = await axios.get(
        `https://paraglive-backend.vercel.app/api/products/${id}`,
        {
          method: "GET",
        },
      );

      const newPost = response.data.data?.[0];
      setPost(newPost);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    setLoading(true);
    if (id) {
      posts(id);
    }
  }, [router?.query]);

  const repost = async () => {
    if (reposting || !id) return;
    setReposting(true);

    try {
      const quoteRes = await axios.get(api(`/api/products/repost-quote/${id}`), {
        headers: authHeaders(session),
      });
      const quote = quoteRes.data?.data ?? {};
      const fee = Number(quote.fee ?? 0);

      if (!quote.affordable) {
        Swal.fire({
          icon: "error",
          title: "Not enough credits",
          text: `Reposting this ad costs $${fee.toFixed(2)} but your balance is $${Number(
            quote.credit ?? 0,
          ).toFixed(2)}.`,
        });
        setReposting(false);
        return;
      }

      const confirmed = await Swal.fire({
        title: fee > 0 ? `Repost for $${fee.toFixed(2)}?` : "Repost this ad?",
        text:
          fee > 0
            ? "Reposting moves this ad back to the top. The same charge as the original post applies."
            : "Reposting moves this ad back to the top of the listings. This one is free.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: fee > 0 ? "Yes, charge me" : "Yes, repost it",
      });

      if (!confirmed.isConfirmed) {
        setReposting(false);
        return;
      }

      const response = await axios.post(
        api(`/api/products/repost/${id}`),
        {},
        { headers: jsonAuthHeaders(session) },
      );

      if (response.data.status === "success") {
        const held = response.data.data?.isApproved === false;
        await Swal.fire({
          icon: held ? "info" : "success",
          title: held ? "Reposted, pending review" : "Reposted",
          text: held
            ? response.data.message
            : "Your ad is back at the top of the listings.",
        });
        router.push("/dashboard/profile");
      } else {
        Swal.fire({
          icon: "error",
          title: "Could not repost",
          text: response.data.message || "Please try again.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Could not repost",
        text:
          error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setReposting(false);
    }
  };

  return (
    <div className='page-bg'>
      <Head>
        <title>{post?.name == undefined ? "loading" : `${post?.name}`}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header></Header>
      {loading ? (
        <div className='btn  bg-transparent border-0 loading flex m-auto'>
          loading
        </div>
      ) : (
        <div className='m-10'>
          <h1
            className='text-lg font-bold sm:text-2xl'
            style={{ color: "var(--text)" }}
          >
            {post?.name}
          </h1>

          <hr />

          <div className={style.contentContainer}>
            <div
              className={style.desc}
              dangerouslySetInnerHTML={{
                __html: post?.description,
              }}
            ></div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <Image.PreviewGroup
                preview={{
                  onChange: (current, prev) =>
                    console.log(
                      `current index: ${current}, prev index: ${prev}`,
                    ),
                }}
              >
                {!post?.imgOne || post?.imgOne == "empty" ? (
                  ""
                ) : (
                  <Image
                    className={style.fImg}
                    width={200}
                    height={250}
                    src={post?.imgOne}
                  />
                )}
                {!post?.imgTwo || post?.imgTwo == "empty" ? (
                  ""
                ) : (
                  <Image
                    className={style.fImg}
                    width={200}
                    height={250}
                    src={post?.imgTwo}
                  />
                )}

                {!post?.imgThree || post?.imgThree == "empty" ? (
                  ""
                ) : (
                  <Image
                    className={style.fImg}
                    width={200}
                    height={250}
                    src={post?.imgThree}
                  />
                )}
                {!post?.imgFour || post?.imgFour == "empty" ? (
                  ""
                ) : (
                  <Image
                    className={style.fImg}
                    width={200}
                    height={250}
                    src={post?.imgFour}
                  />
                )}
              </Image.PreviewGroup>
            </div>
          </div>
          <div>
            <ul className='m-10' style={{ color: "var(--text)" }}>
              <li className='list-disc'>
                age : <span style={{ color: "var(--error)" }}>{post?.age}</span>
              </li>
              <li className='list-disc'>
                Mobile :{" "}
                <span style={{ color: "var(--error)" }}>
                  {post?.phone}
                </span>{" "}
              </li>
              <li className='list-disc'>
                Email :{" "}
                <span style={{ color: "var(--error)" }}>{post?.email}</span>
              </li>
            </ul>
          </div>
          <div className='flex flex-wrap gap-3 m-10 mt-0'>
            <Link className='p-2 btn-accent' href={`/my-post/update/${id}`}>
              Edit This post
            </Link>
            <button
              onClick={repost}
              disabled={reposting}
              title='Move this ad back to the top of the listings'
              className='btn-accent'
              style={{ opacity: reposting ? 0.6 : 1 }}
            >
              {reposting ? "Reposting..." : "Repost to top"}
            </button>
          </div>
        </div>
      )}

      <Footer></Footer>
    </div>
  );
};

export default Details;
