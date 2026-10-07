import Footer from "@/component/footer/footer2";
import Header2 from "@/component/header/header";
import User from "@/component/user";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { message } from "antd";
import { FaTrash, FaUser } from "react-icons/fa";

import { compressImage, formatBytes } from "@/component/utils/compressImage";

const BACKEND = "  https://paraglive-backend.vercel.app";
const MAX_IMAGES = 2;

const Verify = () => {
  const { users } = User();
  const { data: session } = useSession();
  const router = useRouter();

  const [verification, setVerification] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [compressing, setCompressing] = useState(false);

  async function loadStatus() {
    try {
      const response = await axios.get(
        `${BACKEND}/api/verification/user/${session?.user?.id}`,
      );
      setVerification(response?.data?.data?.verification ?? null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingStatus(false);
    }
  }

  useEffect(() => {
    if (session?.user?.id) {
      loadStatus();
    } else {
      setLoadingStatus(false);
    }
  }, [session?.user?.id]);

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (previewUrls?.length >= MAX_IMAGES) {
      message.error({ type: "error", content: `Max ${MAX_IMAGES} files` });
      return;
    }
    if (files.length > 0) {
      const picked = Array.from(files).slice(0, MAX_IMAGES - previewUrls.length);
      event.target.value = "";

      // ID photos come straight off a phone camera, so compress them here too
      // rather than pushing several megabytes at the server. A little more
      // headroom than an ad photo gets: the document has to stay readable.
      setCompressing(true);
      try {
        const accepted = [];
        for (const original of picked) {
          const result = await compressImage(original, {
            maxBytes: 150 * 1024,
            maxDimension: 2000,
            minDimension: 800,
          });

          if (result.skipped === "undecodable") {
            message.error({
              content: `${original.name} could not be read by this browser. Please save it as JPG or PNG and try again.`,
              duration: 6,
            });
            continue;
          }

          if (result.compressed) {
            message.success({
              content: `${original.name}: ${formatBytes(result.originalSize)} to ${formatBytes(result.size)}`,
              duration: 3,
            });
          }

          accepted.push(result.file);
        }

        if (accepted.length === 0) return;

        setSelectedFiles([...selectedFiles, ...accepted]);
        setPreviewUrls([
          ...previewUrls,
          ...accepted.map((file) => URL.createObjectURL(file)),
        ]);
      } finally {
        setCompressing(false);
      }
    }
  };

  const removeImage = (url) => {
    const indexToRemove = previewUrls.findIndex((u) => u === url);
    if (indexToRemove !== -1) {
      const newSelectedFiles = [...selectedFiles];
      newSelectedFiles.splice(indexToRemove, 1);
      const newPreviewUrls = [...previewUrls];
      newPreviewUrls.splice(indexToRemove, 1);
      setSelectedFiles(newSelectedFiles);
      setPreviewUrls(newPreviewUrls);
    }
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) {
      message.error({
        type: "error",
        content: "Please select at least one image",
      });
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("images", file));

      const uploaded = await fetch(`${BACKEND}/api/files2/files`, {
        method: "POST",
        body: formData,
      }).then((res) => res.json());

      // The endpoint used to return a bare array of URLs; it now returns
      // { urls, files } so the fileIds can be stored for later cleanup.
      const uploadedUrls = Array.isArray(uploaded)
        ? uploaded
        : uploaded.urls || [];
      const uploadedFileIds = Array.isArray(uploaded)
        ? []
        : (uploaded.files || []).map((f) => f.fileId).filter(Boolean);

      await axios.post(`${BACKEND}/api/verification`, {
        userId: session?.user?.id,
        images: uploadedUrls,
        imageFileIds: uploadedFileIds,
      });

      Swal.fire({
        icon: "success",
        title: "Verification request submitted",
        text: "We'll review your documents and update your status soon.",
        showConfirmButton: false,
        timer: 2500,
      }).then(() => {
        setTimeout(() => router.reload(), 300);
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderUploadForm = (heading) => (
    <div style={{ marginTop: "24px" }}>
      {heading && (
        <p
          style={{
            color: "var(--text)",
            fontWeight: 600,
            marginBottom: "10px",
          }}
        >
          {heading}
        </p>
      )}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "flex-start",
        }}
      >
        {previewUrls.map((url, index) => (
          <div
            key={index}
            style={{
              position: "relative",
              width: "110px",
              height: "130px",
              borderRadius: "8px",
              overflow: "hidden",
              border: "1px solid var(--border)",
            }}
            className='group'
          >
            <img
              src={url}
              alt={`Preview ${index + 1}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <button
              onClick={() => removeImage(url)}
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.5)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                cursor: "pointer",
              }}
            >
              <FaTrash size={14} />
            </button>
          </div>
        ))}
        {previewUrls.length < MAX_IMAGES && (
          <label
            style={{
              position: "relative",
              width: "110px",
              height: "130px",
              borderRadius: "8px",
              border: "2px dashed var(--border)",
              background: "var(--surface-2)",
              color: "var(--text-muted)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <FaUser style={{ fontSize: "1.6rem", marginBottom: "4px" }} />
            <span style={{ fontSize: "0.75rem" }}>Add Photo</span>
            <input
              type='file'
              accept='image/*'
              onChange={handleFileChange}
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0,
                cursor: "pointer",
                width: "100%",
                height: "100%",
              }}
            />
          </label>
        )}
      </div>
      <button
        onClick={handleSubmit}
        disabled={submitting || selectedFiles.length === 0}
        style={{
          marginTop: "16px",
          background: "var(--accent)",
          color: "var(--text-inverse)",
          border: "none",
          borderRadius: "8px",
          padding: "10px 24px",
          fontWeight: 600,
          fontSize: "0.9rem",
          cursor:
            submitting || selectedFiles.length === 0
              ? "not-allowed"
              : "pointer",
          opacity: submitting || selectedFiles.length === 0 ? 0.6 : 1,
        }}
      >
        {submitting ? "Submitting..." : "Submit for Verification"}
      </button>
    </div>
  );

  let statusSection = null;
  if (!loadingStatus) {
    if (verification?.status === "verified") {
      statusSection = (
        <div
          className='text-green-600'
          style={{ marginTop: "24px", color: "var(--accent)", fontWeight: 600 }}
        >
          Your account is verified ✓
        </div>
      );
    } else if (verification?.status === "pending") {
      statusSection = (
        <div
          style={{ marginTop: "24px", color: "var(--text)", fontWeight: 600 }}
        >
          Your verification request is under review. We&apos;ll notify you once
          it&apos;s processed.
        </div>
      );
    } else if (verification?.status === "rejected") {
      statusSection = (
        <>
          <div
            className='text-red-600'
            style={{
              marginTop: "24px",
              color: "var(--error)",
              fontWeight: 600,
            }}
          >
            Your last verification request was rejected
            {verification?.note ? `: ${verification.note}` : "."}
          </div>
          {renderUploadForm("Submit new photos to try again")}
        </>
      );
    } else {
      statusSection = renderUploadForm(null);
    }
  }

  return (
    <div className='page-bg' style={{ minHeight: "100vh" }}>
      <Header2 />
      <div
        style={{ maxWidth: "800px", margin: "24px auto", padding: "0 16px" }}
      >
        <div
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "12px 20px",
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            flexWrap: "wrap",
          }}
        >
          <Link
            href='/recharge-credits/'
            style={{
              color: "var(--text-secondary)",
              fontWeight: 600,
              fontSize: "0.85rem",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => (e.target.style.color = "var(--accent)")}
            onMouseLeave={(e) =>
              (e.target.style.color = "var(--text-secondary)")
            }
          >
            Buy Credits
          </Link>
          <Link
            href='/dashboard/profile'
            style={{
              color: "var(--text-secondary)",
              fontWeight: 600,
              fontSize: "0.85rem",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => (e.target.style.color = "var(--accent)")}
            onMouseLeave={(e) =>
              (e.target.style.color = "var(--text-secondary)")
            }
          >
            My Account
          </Link>
          <Link
            href='/support'
            style={{
              color: "var(--text-secondary)",
              fontWeight: 600,
              fontSize: "0.85rem",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => (e.target.style.color = "var(--accent)")}
            onMouseLeave={(e) =>
              (e.target.style.color = "var(--text-secondary)")
            }
          >
            Support
          </Link>
          <span
            style={{
              color: "var(--accent)",
              fontWeight: 600,
              fontSize: "0.85rem",
            }}
          >
            Verify
          </span>
        </div>

        <div
          style={{
            marginTop: "32px",
            color: "var(--text)",
            fontSize: "1.1rem",
            lineHeight: 2,
          }}
        >
          Step 1: take a photo of your government ID on a flat surface.
          <br />
          <img
            width={200}
            src='/id.png'
            style={{ borderRadius: "8px", margin: "12px 0" }}
          />
          <br />
          Step 2: take a selfie of your government ID close to your face.
          <br />
          <img
            width={200}
            src='/selfi.png'
            style={{ borderRadius: "8px", margin: "12px 0" }}
          />
          <br />
          Step 3: Submit Your SSN Details.
        </div>

        {statusSection}
      </div>
      <Footer />
    </div>
  );
};

export default Verify;
