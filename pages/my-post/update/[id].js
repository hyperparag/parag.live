import React, { useEffect, useState } from "react";
import Head from "next/head";
import { FaTrash, FaUser } from "react-icons/fa";
import categories from "../../../public/category.json";
import axios from "axios";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { message } from "antd";
import Link from "next/link";
import User from "@/component/user";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { DatePicker } from "antd";
import { compressImage, formatBytes } from "@/component/utils/compressImage";
import { api, jsonAuthHeaders } from "@/component/utils/api";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
const Header = dynamic(() => import("@/component/header/header"));
const Footer = dynamic(() => import("@/component/footer/footer"));

const initialState = {
  name: "",
  phone: "",
  email: "",
  description: "",
  category: "",
  subCategory: "",
  imgOne: "",
  imgTwo: "",
  imgThree: "",
  imgFour: "",
  city: "",
  month: "",
  cities: [],
  link: "",
  age: "",
  altTexts: ["", "", "", ""],
  imageFileIds: [],
  publishAt: null,
  posterId: "",
  isPremium: false,
  isApproved: false,
  error: "",
};

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
  ],
};

const UpdatePost = () => {
  const router = useRouter();
  const { users } = User();
  const { data: session } = useSession();
  const [state, setState] = useState(initialState);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [compressing, setCompressing] = useState(false);

  // Fetch existing post data
  useEffect(() => {
    if (!router.query.id) return;
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `https://paraglive-backend.vercel.app/api/products/${router.query.id}`,
        );
        const post = Array.isArray(response.data.data)
          ? response.data.data[0]
          : response.data.data.product?.[0];
        if (post) {
          setState((prev) => ({
            ...prev,
            name: post.name || "",
            phone: post.phone || "",
            email: post.email || "",
            description: post.description || "",
            category: post.category || "",
            subCategory: post.subCategory || "",
            imgOne: post.imgOne || "",
            imgTwo: post.imgTwo || "",
            imgThree: post.imgThree || "",
            imgFour: post.imgFour || "",
            city: post.city || "",
            cities: Array.isArray(post.cities) ? post.cities : [],
            link: post.link || "",
            age: post.age || "",
            altTexts: Array.isArray(post.altTexts)
              ? [...post.altTexts, "", "", "", ""].slice(0, 4)
              : ["", "", "", ""],
            imageFileIds: Array.isArray(post.imageFileIds)
              ? post.imageFileIds
              : [],
            publishAt: post.publishAt || null,
            isPremium: post.isPremium || false,
            isApproved: post.isApproved || false,
            posterId: post.posterId || "",
          }));

          // Build preview URLs from existing images
          const imgs = [
            post.imgOne,
            post.imgTwo,
            post.imgThree,
            post.imgFour,
          ].filter((img) => img && img !== "" && img !== "empty");
          setPreviewUrls(imgs);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchPost();
  }, [router.query.id]);

  // Set posterId from session
  useEffect(() => {
    if (session?.user?.id) {
      setState((prev) => ({ ...prev, posterId: session.user.id }));
    }
  }, [session]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /** Same browser-side optimisation as the create form: resize, never reject. */
  const handleFileChange = async (event) => {
    const picked = Array.from(event.target.files || []);
    event.target.value = "";
    if (picked.length === 0) return;

    const room = 4 - previewUrls.length;
    if (room <= 0) {
      message.error({ content: "You can have up to 4 images" });
      return;
    }

    const queue = picked.slice(0, room);
    if (picked.length > room) {
      message.warning({
        content: `Only ${room} more image${room === 1 ? "" : "s"} can be added`,
      });
    }

    setCompressing(true);
    try {
      const accepted = [];
      for (const original of queue) {
        const result = await compressImage(original);

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

      setSelectedFiles((prev) => [...prev, ...accepted]);
      setPreviewUrls((prev) => [
        ...prev,
        ...accepted.map((file) => URL.createObjectURL(file)),
      ]);
    } finally {
      setCompressing(false);
    }
  };

  const handleAltTextChange = (index, value) => {
    setState((prev) => {
      const altTexts = [...(prev.altTexts || ["", "", "", ""])];
      altTexts[index] = value;
      return { ...prev, altTexts };
    });
  };

  const removeImage = (url) => {
    const idx = previewUrls.findIndex((u) => u === url);
    if (idx !== -1) {
      setSelectedFiles((prev) => {
        const copy = [...prev];
        // Only splice if it's a new file (blob URL), not existing server URL
        const existingCount = previewUrls.filter(
          (u) => !u.startsWith("blob:"),
        ).length;
        const newFileIdx = idx - existingCount;
        if (newFileIdx >= 0) copy.splice(newFileIdx, 1);
        return copy;
      });
      setPreviewUrls((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const log = (value) => {
    setState((prev) => ({ ...prev, description: value }));
    setErrors((prev) => ({ ...prev, description: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!state.name.trim()) errs.name = "Title is required";
    else if (state.name.length > 150)
      errs.name = "Title must be under 150 characters";
    if (!state.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(state.email))
      errs.email = "Enter a valid email";
    if (!state.subCategory) errs.subCategory = "Please select a category";
    if (!state.description || state.description === "<p><br></p>")
      errs.description = "Description is required";
    return errs;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      message.error({ content: "Please fill all required fields" });
      return;
    }
    setErrors({});
    setSubmitting(true);

    const data = { ...state };

    // Upload new images if any.
    //
    // This posted to /api/files/files, which is the dead AWS S3 route (its
    // credentials are commented out in the backend .env), so replacing an image
    // on an existing ad silently did nothing. /api/files2/files is the live
    // ImageKit route, and it also returns the fileId we need for cleanup.
    if (selectedFiles.length > 0) {
      const fileIds = [...(data.imageFileIds || [])];

      for (let i = 0; i < selectedFiles.length; i++) {
        const formData = new FormData();
        formData.append("images", selectedFiles[i]);
        try {
          const res = await fetch(api("/api/files2/files"), {
            method: "POST",
            body: formData,
          });
          if (!res.ok) throw new Error("upload failed");
          const result = await res.json();

          const uploaded = Array.isArray(result)
            ? { url: result[0] }
            : (result.files || [])[0] || { url: (result.urls || [])[0] };

          if (!uploaded?.url) throw new Error("no url returned");

          // Find next empty image slot
          if (!data.imgOne || data.imgOne === "empty") data.imgOne = uploaded.url;
          else if (!data.imgTwo || data.imgTwo === "empty")
            data.imgTwo = uploaded.url;
          else if (!data.imgThree || data.imgThree === "empty")
            data.imgThree = uploaded.url;
          else if (!data.imgFour || data.imgFour === "empty")
            data.imgFour = uploaded.url;

          if (uploaded.fileId) fileIds.push(uploaded.fileId);
        } catch (err) {
          console.error(err);
          message.error({
            content: "One of your images could not be uploaded.",
          });
        }
      }

      data.imageFileIds = fileIds;
    }

    try {
      const response = await axios.patch(
        api(`/api/products/${router.query.id}`),
        data,
        { headers: jsonAuthHeaders(session) },
      );
      setSubmitting(false);
      if (response.data.status === "success") {
        Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Your post has been updated",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          router.push("/dashboard/profile");
        });
      }
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  return (
    <div className='page-bg'>
      <Head>
        <title>Edit Post</title>
        <link rel='icon' href='/logo.png' />
      </Head>
      <Header />

      <div className='sm:mx-20 mx-4 py-6'>
        {/* Header */}
        <h1 className='text-xl font-bold mb-1' style={{ color: "var(--text)" }}>
          Edit Post
        </h1>

        <div className='flex flex-wrap gap-2 mb-5'>
          <span
            className='rounded-lg px-3 py-1.5 text-sm'
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            Credits: <strong>${users?.credit?.toFixed(2)}</strong>
          </span>
        </div>

        {/* Image upload */}
        <div className='mb-5'>
          <p
            className='text-sm font-semibold mb-2'
            style={{ color: "var(--text)" }}
          >
            Photos{" "}
            <span
              className='font-normal text-xs'
              style={{ color: "var(--text-muted)" }}
            >
              (max 4 &mdash; any size, we optimise them for you)
            </span>
          </p>
          {loading ? (
            <p className='text-sm' style={{ color: "var(--text-muted)" }}>
              Loading...
            </p>
          ) : (
            <div className='flex flex-wrap gap-3 items-start'>
              {previewUrls.map((url, index) => (
                <div
                  key={index}
                  className='relative w-[110px] h-[130px] rounded-lg overflow-hidden group'
                  style={{ border: "1px solid var(--border)" }}
                >
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className='w-full h-full object-cover'
                  />
                  <button
                    onClick={() => removeImage(url)}
                    className='absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity'
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              ))}
              {previewUrls.length < 4 && (
                <label
                  className='relative w-[110px] h-[130px] rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all'
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface-2)",
                    color: "var(--text-muted)",
                  }}
                >
                  {compressing ? (
                    <span className='text-xs px-2 text-center'>
                      Optimising...
                    </span>
                  ) : (
                    <>
                      <FaUser className='text-3xl mb-1' />
                      <span className='text-xs'>Add Photo</span>
                    </>
                  )}
                  <input
                    type='file'
                    accept='image/*'
                    multiple
                    disabled={compressing}
                    onChange={handleFileChange}
                    className='absolute inset-0 opacity-0 cursor-pointer w-full h-full'
                  />
                </label>
              )}
            </div>
          )}

          {/* Alt text, one per photo. */}
          {!loading && previewUrls.length > 0 && (
            <div className='mt-4'>
              <p
                className='text-sm font-semibold mb-2'
                style={{ color: "var(--text)" }}
              >
                Alt Text{" "}
                <span
                  className='font-normal text-xs'
                  style={{ color: "var(--text-muted)" }}
                >
                  (optional &mdash; describe each photo)
                </span>
              </p>
              <div className='flex flex-col gap-2'>
                {previewUrls.map((url, index) => (
                  <div key={`alt-${index}`} className='flex items-center gap-2'>
                    <img
                      src={url}
                      alt=''
                      className='w-10 h-10 rounded object-cover flex-shrink-0'
                      style={{ border: "1px solid var(--border)" }}
                    />
                    <input
                      type='text'
                      maxLength={125}
                      value={state.altTexts?.[index] ?? ""}
                      onChange={(e) =>
                        handleAltTextChange(index, e.target.value)
                      }
                      placeholder={`Describe photo ${index + 1}`}
                      className='w-full rounded-lg px-3 py-2 text-sm focus:outline-none themed-input'
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Form fields */}
        <div
          className='rounded-xl p-5 flex flex-col gap-4'
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <div className='flex sm:flex-row flex-col gap-4'>
            <div className='sm:w-1/2 w-full'>
              <p
                className='text-sm font-semibold mb-1'
                style={{ color: "var(--text)" }}
              >
                <span style={{ color: "var(--error)" }}>*</span> Title
              </p>
              <input
                name='name'
                type='text'
                maxLength={150}
                onChange={handleInput}
                value={state.name}
                placeholder='Enter ad title'
                className='w-full rounded-lg px-3 py-2 text-sm focus:outline-none themed-input'
              />
              <div className='flex justify-between mt-0.5'>
                {errors.name && (
                  <p className='text-xs' style={{ color: "var(--error)" }}>
                    {errors.name}
                  </p>
                )}
                <p
                  className='text-xs ml-auto'
                  style={{
                    color:
                      state.name.length > 130
                        ? "var(--error)"
                        : "var(--text-muted)",
                  }}
                >
                  {state.name.length}/150
                </p>
              </div>
            </div>
            <div className='sm:w-1/2 w-full'>
              <p
                className='text-sm font-semibold mb-1'
                style={{ color: "var(--text)" }}
              >
                Phone
              </p>
              <input
                name='phone'
                type='number'
                onChange={handleInput}
                value={state.phone}
                placeholder='Phone number'
                className='w-full rounded-lg px-3 py-2 text-sm focus:outline-none themed-input'
              />
            </div>
          </div>

          <div className='flex sm:flex-row flex-col gap-4'>
            <div className='sm:w-1/2 w-full'>
              <p
                className='text-sm font-semibold mb-1'
                style={{ color: "var(--text)" }}
              >
                <span style={{ color: "var(--error)" }}>*</span> Email
              </p>
              <input
                name='email'
                type='email'
                onChange={handleInput}
                value={state.email}
                placeholder='your@email.com'
                className='w-full rounded-lg px-3 py-2 text-sm focus:outline-none themed-input'
              />
              {errors.email && (
                <p className='text-xs mt-0.5' style={{ color: "var(--error)" }}>
                  {errors.email}
                </p>
              )}
            </div>
            <div className='sm:w-1/2 w-full'>
              <p
                className='text-sm font-semibold mb-1'
                style={{ color: "var(--text)" }}
              >
                Age
              </p>
              <input
                name='age'
                type='number'
                onChange={handleInput}
                value={state.age}
                placeholder='Your age'
                className='w-full rounded-lg px-3 py-2 text-sm focus:outline-none themed-input'
              />
            </div>
          </div>

          <div>
            <p
              className='text-sm font-semibold mb-1'
              style={{ color: "var(--text)" }}
            >
              <span style={{ color: "var(--error)" }}>*</span> Category
            </p>
            <select
              name='subCategory'
              onChange={handleInput}
              value={state.subCategory}
              className='w-full sm:w-1/2 rounded-lg px-3 py-2 text-sm focus:outline-none themed-select'
            >
              <option value=''>-- Select Category --</option>
              {categories?.map((cat) => (
                <option key={cat?.name} value={cat?.name}>
                  {cat?.name}
                </option>
              ))}
            </select>
            {errors.subCategory && (
              <p className='text-xs mt-0.5' style={{ color: "var(--error)" }}>
                {errors.subCategory}
              </p>
            )}
          </div>

          <div>
            <p
              className='text-sm font-semibold mb-1'
              style={{ color: "var(--text)" }}
            >
              <span style={{ color: "var(--error)" }}>*</span> Description
            </p>
            <div
              className='rounded-lg overflow-hidden'
              style={{ border: "1px solid var(--border)" }}
            >
              <ReactQuill
                value={state.description}
                onChange={log}
                className='h-[320px]'
                modules={modules}
              />
            </div>
            {errors.description && (
              <p className='text-xs mt-1' style={{ color: "var(--error)" }}>
                {errors.description}
              </p>
            )}
          </div>

          {/* Selected Areas */}
          {(state.city ||
            (Array.isArray(state.cities) && state.cities.length > 0)) && (
            <div
              className='pt-4'
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <p
                className='text-sm font-semibold mb-2'
                style={{ color: "var(--text)" }}
              >
                Selected Area
              </p>
              <div className='flex flex-wrap gap-2'>
                {state.city ? (
                  <span
                    className='rounded-lg px-3 py-1.5 text-sm'
                    style={{
                      background: "var(--surface-2)",
                      border: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {state.city}
                  </span>
                ) : (
                  state.cities.map((city) => (
                    <span
                      key={city}
                      className='rounded-lg px-3 py-1.5 text-sm'
                      style={{
                        background: "var(--surface-2)",
                        border: "1px solid var(--border)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {city}
                    </span>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Schedule. Only editable while the ad is still waiting to go live;
              once it is published there is nothing left to schedule. */}
          {state.publishAt &&
            new Date(state.publishAt).getTime() > Date.now() && (
              <div
                className='pt-4'
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <p
                  className='text-sm font-semibold mb-2'
                  style={{ color: "var(--text)" }}
                >
                  Scheduled to go live
                </p>
                <DatePicker
                  showTime={{ format: "HH:mm" }}
                  format='YYYY-MM-DD HH:mm'
                  placeholder='Pick a date and time'
                  disabledDate={(current) =>
                    current && current.endOf("day").valueOf() < Date.now()
                  }
                  onChange={(value) =>
                    setState((prev) => ({
                      ...prev,
                      publishAt: value ? value.toISOString() : null,
                    }))
                  }
                />
                <p
                  className='text-xs mt-2'
                  style={{ color: "var(--text-secondary)" }}
                >
                  Currently {new Date(state.publishAt).toLocaleString()}. Clear
                  the date to publish it straight away.
                </p>
              </div>
            )}

          {/* Submit */}
          <div className='pt-2'>
            {submitting || compressing ? (
              <button
                disabled
                className='font-semibold px-8 py-2.5 rounded-lg text-sm cursor-not-allowed'
                style={{
                  background: "var(--surface-2)",
                  color: "var(--text-muted)",
                }}
              >
                {compressing ? "Optimising photos..." : "Submitting..."}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className='font-semibold px-8 py-2.5 rounded-lg text-sm transition-colors btn-accent'
              >
                Update Post
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UpdatePost;
