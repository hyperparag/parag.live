import Cookies from "js-cookie";
import Head from "next/head";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
const Header = dynamic(() => import("@/component/header/header"));
const Footer = dynamic(() => import("@/component/footer/footer2"));
import style from "../../styles/moduleCss/reports.module.css";
import jwt_decode from "jwt-decode";
import axios from "axios";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import { api } from "@/component/utils/api";

const initialState = {
  subject: "",
  reportDesc: "",
  isRead: false,
  userData: [],
};

const Reposts = () => {
  const [state, setState] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const { data: session } = useSession();
  const id = router.query.id;
  const usersStringfy = Cookies.get("token");

  useEffect(() => {
    if (usersStringfy) {
      try {
        const users = jwt_decode(usersStringfy);
        setState((prev) => ({ ...prev, userData: users }));
      } catch (error) {
        // An expired or malformed cookie should not break the form; the report
        // can still be filed, just without an attributed reporter.
        console.log(error);
      }
    }
  }, [usersStringfy]);

  const dispatch = (e) => {
    setState((prev) => ({ ...prev, [e.type]: e.payload }));
    setErrors((prev) => ({ ...prev, [e.type]: "" }));
  };

  const handleReport = async () => {
    const subject = state.subject.trim();
    const reportDesc = state.reportDesc.trim();

    const nextErrors = {};
    if (!subject) nextErrors.subject = "Please give the report a subject";
    if (!reportDesc) nextErrors.reportDesc = "Please describe the problem";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    // The route is /reports/<postId>__<posterId>.
    const [postId, posterId] = String(id ?? "").split("__");

    if (!postId || !posterId) {
      Swal.fire({
        icon: "error",
        title: "Could not file this report",
        text: "The link looks broken. Please go back to the ad and try again.",
      });
      return;
    }

    // Prefer the NextAuth session: the site signs in with Google, so the legacy
    // `token` cookie is usually absent and reporterId silently came through as
    // undefined. Fall back to the cookie for email/password sessions.
    const reporterId = session?.user?.id || state.userData?._id || undefined;

    const data = {
      subject,
      isRead: false,
      reporterId,
      reportDesc,
      postId,
      posterId,
    };

    setSubmitting(true);
    try {
      const response = await axios.post(api("/api/reports"), data, {
        headers: { "content-type": "application/json" },
      });

      setSubmitting(false);

      if (response.data.status === "success") {
        setState((prev) => ({ ...prev, subject: "", reportDesc: "" }));
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Thanks for the report",
          text: "Our team will review this ad.",
        }).then(() => {
          router.push(`/post/details/${postId}`);
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Could not file this report",
          text: response.data.message || "Please try again.",
        });
      }
    } catch (error) {
      setSubmitting(false);
      Swal.fire({
        icon: "error",
        title: "Could not file this report",
        text:
          error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className='page-bg'>
      <Head>
        <title>Report</title>
        <link rel='icon' href='/logo.png' />
      </Head>
      <Header />

      <div className='mt-5'>
        <div className={style.reportContainer}>
          <h1
            className='text-lg font-bold mb-1'
            style={{ color: "var(--text)" }}
          >
            Report this ad
          </h1>
          <p
            className='text-sm mb-4'
            style={{ color: "var(--text-secondary)" }}
          >
            Tell us what is wrong with this ad and our team will review it.
          </p>

          <div className='w-full flex items-center justify-between'>
            <label className='w-full mr-1' style={{ color: "var(--text)" }}>
              Subject : <br />
              <input
                type='text'
                placeholder='Subject'
                value={state.subject}
                maxLength={150}
                className='input input-bordered input-accent w-full themed-input'
                onChange={(e) =>
                  dispatch({ type: "subject", payload: e.target.value })
                }
              />
            </label>
          </div>
          {errors.subject && (
            <p className='text-xs mt-1' style={{ color: "var(--error)" }}>
              {errors.subject}
            </p>
          )}
          <br />
          <div>
            <label style={{ color: "var(--text)" }}>
              Write in details : <br />
              <textarea
                className='textarea textarea-accent w-full h-full'
                style={{
                  height: "190px",
                  background: "var(--surface-2)",
                  color: "var(--text)",
                }}
                placeholder='Write your report'
                value={state.reportDesc}
                onChange={(e) =>
                  dispatch({ type: "reportDesc", payload: e.target.value })
                }
              ></textarea>
            </label>
          </div>
          {errors.reportDesc && (
            <p className='text-xs mb-2' style={{ color: "var(--error)" }}>
              {errors.reportDesc}
            </p>
          )}
          <button
            onClick={handleReport}
            disabled={submitting}
            className='btn-accent'
            style={{ opacity: submitting ? 0.6 : 1 }}
          >
            {submitting ? "Sending..." : "Submit Report"}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Reposts;
