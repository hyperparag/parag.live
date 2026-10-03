// import React, { useEffect, useRef, useState } from "react";
// import style from "./postForm.module.css";
// import { FiPlus } from "react-icons/fi";
// import { FaTrash } from "react-icons/fa";
// import { FaRegEdit } from "react-icons/fa";
// import categories from "../../public/category.json";
// import { Editor } from "@tinymce/tinymce-react";
// import axios from "axios";
// import { useRouter } from "next/router";
// import Swal from "sweetalert2";
// import { FaUser } from "react-icons/fa";
// import { Radio, message } from "antd";
// import Link from "next/link";
// import User from "../user";
// import { useSession } from "next-auth/react";
// import dynamic from "next/dynamic";

// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// const initialState = {
//   name: "",
//   phone: "",
//   email: "",
//   description: "",
//   category: "Adult",
//   subCategory: "",
//   imgOne: "",
//   imgTwo: "",
//   imgThree: "",
//   imgFour: "",
//   city: "",
//   month: "",
//   cities: "",
//   premiumDay: 0,
//   age: "",
//   posterId: "",
//   isPremium: false,
//   isApproved: false,
//   error: "",
// };

// const PostForm = () => {
//   const router = useRouter();
//   const { users } = User();
//   const { data: session } = useSession();
//   const [state, setState] = useState(initialState);
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [previewUrls, setPreviewUrls] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [local, setLocal] = useState(0);
//   const [value1, setValue1] = useState(0);

//   const handleFileChange = (event) => {
//     const files = event.target.files;

//     if (files?.[0].size > 50000) {
//       message.error({
//         type: "error",
//         content: "Max Image Size is 50kb",
//       });
//       return;
//     }

//     if (previewUrls?.length == 5) {
//       alert("Max 5 files");
//       return;
//     }
//     if (files.length > 0) {
//       const newSelectedFiles = Array.from(files);
//       setSelectedFiles([...selectedFiles, ...newSelectedFiles]);

//       const newPreviewUrls = newSelectedFiles.map((file) =>
//         URL.createObjectURL(file),
//       );
//       setPreviewUrls([...previewUrls, ...newPreviewUrls]);
//     }
//   };

//   const removeImage = (e) => {
//     const indexToRemove = previewUrls.findIndex((url) => url === e);

//     if (indexToRemove !== -1) {
//       const newSelectedFiles = [...selectedFiles];
//       newSelectedFiles.splice(indexToRemove, 1);

//       const newPreviewUrls = [...previewUrls];
//       newPreviewUrls.splice(indexToRemove, 1);
//       setSelectedFiles(newSelectedFiles);
//       setPreviewUrls(newPreviewUrls);
//     }
//   };
//   const handleInput = (e) => {
//     setState({ ...state, [e.type]: e.payload });
//   };

//   const subCategories = categories.find((e) => e.name == state.category);

//   const log = (e) => {
//     console.log(e);
//     setState({ ...state, description: e });
//   };

//   const options = [
//     {
//       label: "Default (free)",
//       value: 0,
//     },
//     {
//       label: "7 Days ($7)",
//       value: 7,
//     },
//     {
//       label: "14 Days ($10)",
//       value: 10,
//     },
//     {
//       label: "30 Days ($15)",
//       value: 15,
//     },
//   ];
//   const topForDays = ({ target: { value } }) => {
//     setValue1(value);
//     let e = JSON.parse(localStorage?.getItem("cities"));

//     if (e?.query?.name?.[0] == "multiple-city-ads") {
//       const newData = 0.05 + value * e.length;
//       setLocal(newData);
//     } else {
//       const newData = 0.0 + value;
//       setLocal(newData);
//     }
//   };

//   useEffect(() => {
//     if (router.query.name?.[0] == "multiple-city-ads") {
//       let e = JSON.parse(localStorage?.getItem("cities"));
//       if (e == null) {
//         setLocal(0);
//         return;
//       } else {
//         setLocal(e?.length * 0.05);
//       }
//     }
//     if (router.query.name?.[0] == "local-ads") {
//       setLocal(0.0);
//     }
//     if (router.query.name?.[0] == "premium-ads") {
//       setLocal(1);
//     }
//   }, [router.query.name]);

//   // form

//   const handleSubmit = async () => {
//     setLoading(true);
//     const data = { ...state };

//     if (router?.query?.name[0] != "local-ads") {
//       const city = localStorage.getItem("cities");
//       if (city == null) {
//         message.error({
//           type: "error",
//           content:
//             "You have not any city selected. please select minimum a city. Try again",
//         });
//         setLoading(false);
//         return;
//       }
//     }

//     const formData = new FormData();
//     formData.append("images", selectedFiles[0]);
//     formData.append("images", selectedFiles[1]);
//     formData.append("images", selectedFiles[2]);
//     formData.append("images", selectedFiles[3]);

//     await fetch(
//       "https://paraglive-backend.vercel.app/api/files2/files",
//       {
//         method: "POST",
//         body: formData,
//       },
//     )
//       .then((res) => res.json())
//       .then((result) => {
//         data.imgOne = result[0] ?? "empty";
//         data.imgTwo = result[1] ?? "empty";
//         data.imgThree = result[2] ?? "empty";
//         data.imgFour = result[3] ?? "empty";
//       });

//     if (router.query.name[0] == "local-ads") {
//       ((data.cities = [router.query.name[1]]), (data.isPremium = true));
//     } else {
//       let i = JSON.parse(localStorage.getItem("cities"));
//       data.isApproved = true;
//       data.isPremium = true;
//       data.cities = i;
//     }

//     if (local == 0.0) {
//       data.premiumDay = 0;
//     }
//     if (local == 7) {
//       data.premiumDay = 7 * 24;
//       data.isPremium = false;
//       data.isApproved = true;
//     }
//     if (local == 10) {
//       data.premiumDay = 14 * 24;
//       data.isPremium = false;
//       data.isApproved = true;
//     }
//     if (local == 15) {
//       data.premiumDay = 30 * 24;
//       data.isApproved = true;
//       data.isPremium = false;
//     }
//     console.log(data);
//     if (
//       data.name == "" ||
//       data.category == "" ||
//       data.description == "" ||
//       data.email == "" ||
//       data.imgOne == "empty"
//     ) {
//       message.error({
//         type: "error",
//         content: "Image, Title, Category and Description is required",
//       });
//       setLoading(false);
//       return;
//     }

//     data.posterId = session?.user?.id;
//     await fetch("https://paraglive-backend.vercel.app/api/products", {
//       method: "POST",
//       headers: {
//         "content-type": "application/json",
//       },
//       body: JSON.stringify(data),
//     })
//       .then((e) => e.json())
//       .then((t) => {
//         localStorage.removeItem("cities");
//         const newCredit = users?.credit - local?.toFixed(2);
//         axios
//           .patch(
//             `https://paraglive-backend.vercel.app/api/users/${session?.user?.id}`,
//             {
//               credit: newCredit,
//             },
//           )
//           .then((response) => {
//             setLoading(false);
//             if (response.data.status == "success") {
//               Swal.fire({
//                 position: "top-center",
//                 icon: "success",
//                 title: "Your work has been saved",
//                 showConfirmButton: false,
//                 timer: 2500,
//               }).then(
//                 setTimeout(() => {
//                   router.push("/dashboard/profile");
//                 }, 500),
//               );
//             }
//           })
//           .catch((err) => console.log(err));
//       });
//   };

//   const modules = {
//     toolbar: [
//       [{ header: "1" }, { header: "2" }, { font: [] }],
//       [{ list: "ordered" }, { list: "bullet" }],
//       ["bold", "italic", "underline"],
//       [{ color: [] }, { background: [] }],
//       ["link", "image"],
//       [{ align: [] }],
//     ],
//   };

//   return (
//     <div className='sm:mx-20'>
//       <h1 className='text-lg mb-5 text-black sm:text-2xl'>
//         {router?.query ? (
//           <div>
//             <p>
//               Post an Ad{" "}
//               <span className='text-xs'> ({router?.query?.name?.[0]})</span>
//             </p>{" "}
//             <p className='text-red-600 font-bold border p-2 border-green-400 w-10/12 sm:w-4/12'>
//               Your Credits : ${users?.credit?.toFixed(2)}
//             </p>
//             {router?.query?.name?.[0] == "premium-ads" && (
//               <p className='text-blue-600 font-bold w-10/12 sm:w-4/12'>
//                 You will be charged : ${local?.toFixed(2)}
//               </p>
//             )}
//             {router?.query?.name?.[0] == "local-ads" && (
//               <p className='text-blue-600 font-bold w-10/12 sm:w-4/12'>
//                 You will be charged : ${local?.toFixed(2)}
//               </p>
//             )}
//             {router?.query?.name?.[0] == "multiple-city-ads" && (
//               <div className='text-blue-600 font-bold w-10/12 sm:w-4/12'>
//                 You will be charged : ${local?.toFixed(2)}
//               </div>
//             )}
//           </div>
//         ) : (
//           "Loading"
//         )}
//       </h1>
//       <div className='flex justify-center sm:flex-row flex-col gap-5'>
//         <div
//           className={`${previewUrls.length < 4 ? "block" : "hidden"} h-[200px]`}
//         >
//           {previewUrls.length < 4 && (
//             <label className='block font-bold relative'>
//               <input
//                 className='rounded w-[170px]'
//                 type='file'
//                 accept='image/*'
//                 onChange={handleFileChange}
//               />
//               <FaUser className='absolute top-0 bg-white w-[170px] h-[200px] p-5 text-gray-400 border border-red-500 rounded' />
//             </label>
//           )}
//         </div>
//         <div>
//           {previewUrls.length > 0 && (
//             <div className='grid grid-cols-2 sm:flex items-center sm:flex-row  gap-5'>
//               {previewUrls.map((url, index) => (
//                 <div key={index} className={`${style.card}`}>
//                   <img src={url} alt={`Preview ${index + 1}`} />
//                   <p
//                     className={`${style.cross}`}
//                     onClick={() => removeImage(url)}
//                   >
//                     <span>
//                       <FaTrash />
//                     </span>
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       <br />
//       {/*form start here */}
//       <div className='flex justify-between sm:flex-row flex-col sm:gap-10 gap-2'>
//         <label className='text-black font-bold text-xs sm:text-xl sm:mb-5 sm:w-6/12'>
//           <span className='text-red-600'>*</span> Title :
//           <br />
//           <input
//             onChange={(e) =>
//               handleInput({ type: "name", payload: e.target.value })
//             }
//             type='text'
//             className='input bg-gray-200  w-full '
//           />
//         </label>

//         <label className='text-black font-bold text-xs sm:text-xl mb-5 sm:w-6/12'>
//           Phone :
//           <br />
//           <input
//             type='number'
//             onChange={(e) =>
//               handleInput({ type: "phone", payload: e.target.value })
//             }
//             className='input bg-gray-200  w-full '
//           />
//         </label>
//       </div>
//       <div className='flex justify-between sm:flex-row flex-col sm:gap-10 gap-2'>
//         <label className='text-black font-bold text-xs sm:text-xl sm:w-6/12'>
//           <span className='text-red-600'>*</span> Email :
//           <br />
//           <input
//             type='email'
//             onChange={(e) =>
//               handleInput({ type: "email", payload: e.target.value })
//             }
//             className='input bg-gray-200 w-full '
//           />
//         </label>

//         <label className='text-black font-bold text-xs sm:text-xl sm:w-6/12'>
//           Your Age :
//           <br />
//           <input
//             type='number'
//             onChange={(e) =>
//               handleInput({ type: "age", payload: e.target.value })
//             }
//             className='input bg-gray-200  w-full '
//           />
//         </label>
//       </div>
//       <br />
//       <div className='flex justify-between sm:flex-row flex-col sm:gap-10 gap-2'>
//         <label className='text-black font-bold text-xs sm:text-xl sm:w-6/12'>
//           <span className='text-red-600'>*</span> Category :
//           <br />
//           <select
//             name='category'
//             id='category'
//             onChange={(e) =>
//               handleInput({ type: "subCategory", payload: e.target.value })
//             }
//             className='input bg-gray-200 w-full'
//           >
//             <option value='category'>-- Select Category --</option>

//             {categories?.map((e) => (
//               <option value={e?.name}>{e?.name}</option>
//             ))}
//           </select>
//         </label>
//       </div>
//       <div className='sm:w-full w-full m-auto mb-5 pt-10 '>
//         <ReactQuill
//           value={state?.description}
//           onChange={log}
//           className='h-[350px] rounded'
//           modules={modules}
//         />
//       </div>
//       {router.query.name?.[0] == "multiple-city-ads" ? (
//         ""
//       ) : (
//         <div className='sm:w-full w-full m-auto pt-10 '>
//           <label className='text-black font-bold text-xs sm:text-xl'>
//             Show your adds at top <small>(extra charged)</small>
//           </label>
//           <br />

//           <Radio.Group options={options} onChange={topForDays} value={value1} />
//         </div>
//       )}
//       <br />
//       <p className='text-red-600 text-xs'>{state.error}</p>
//       <br />
//       <div className=' w-full m-auto pt-10 '>
//         {users?.credit < local || local == "null" ? (
//           <>
//             <h1 className='text-2xl text-red-600 font-bold'>
//               Insufficient Balance
//             </h1>
//             <br />
//             <Link
//               href={`/recharge-credits/`}
//               className='rounded bg-green-400 font-bold text-white p-2 hover:bg-red-400'
//             >
//               Buy Credits
//             </Link>
//           </>
//         ) : (
//           <>
//             {loading ? (
//               <button className={`${style.postButton} loading`} role='button'>
//                 Wait...
//               </button>
//             ) : (
//               <button
//                 className={style.postButton}
//                 onClick={() => handleSubmit(router?.query?.name)}
//                 role='button'
//               >
//                 Submit Post
//               </button>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PostForm;
import React, { useEffect, useState } from "react";
import style from "./postForm.module.css";
import { FaTrash, FaUser } from "react-icons/fa";
import categories from "../../public/category.json";
import axios from "axios";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { Radio, message } from "antd";
import Link from "next/link";
import User from "../user";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { DatePicker } from "antd";
import { compressImage, formatBytes } from "../utils/compressImage";
import { api, jsonAuthHeaders, authHeaders } from "../utils/api";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const initialState = {
  name: "",
  phone: "",
  email: "",
  description: "",
  category: "Adult",
  subCategory: "",
  imgOne: "",
  imgTwo: "",
  imgThree: "",
  imgFour: "",
  city: "",
  month: "",
  cities: "",
  premiumDay: 0,
  age: "",
  // Per-image alt text, parallel to imgOne..imgFour.
  altTexts: ["", "", "", ""],
  // null posts immediately; an ISO date schedules the ad for later.
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

const PostForm = () => {
  const router = useRouter();
  const { users } = User();
  const { data: session } = useSession();
  const [state, setState] = useState(initialState);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [local, setLocal] = useState(0);
  const [value1, setValue1] = useState(0);
  const [errors, setErrors] = useState({});
  const [compressing, setCompressing] = useState(false);
  const [scheduleLater, setScheduleLater] = useState(false);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /**
   * Photos are resized and re-encoded in the browser until they fit under 50KB,
   * rather than being rejected for being too big. Note the old version only ever
   * looked at files[0], so a multi-select slipped past the check entirely.
   */
  const handleFileChange = async (event) => {
    const picked = Array.from(event.target.files || []);
    // Let the same file be chosen again later.
    event.target.value = "";
    if (picked.length === 0) return;

    const room = 4 - previewUrls.length;
    if (room <= 0) {
      message.error({ type: "error", content: "You can upload up to 4 photos" });
      return;
    }

    const queue = picked.slice(0, room);
    if (picked.length > room) {
      message.warning({
        content: `Only ${room} more photo${room === 1 ? "" : "s"} can be added`,
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

        if (result.size > 50 * 1024) {
          // Both quality and resolution bottomed out. Still upload it, but say so.
          message.warning({
            content: `${original.name} could only be reduced to ${formatBytes(result.size)}.`,
            duration: 5,
          });
        } else if (result.compressed) {
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
      setErrors((prev) => ({ ...prev, image: "" }));
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
    const indexToRemove = previewUrls.findIndex((u) => u === url);
    if (indexToRemove !== -1) {
      const newSelectedFiles = [...selectedFiles];
      newSelectedFiles.splice(indexToRemove, 1);
      const newPreviewUrls = [...previewUrls];
      newPreviewUrls.splice(indexToRemove, 1);
      // Alt text belongs to a photo, so it has to move with it.
      const newAltTexts = [...(state.altTexts || ["", "", "", ""])];
      newAltTexts.splice(indexToRemove, 1);
      newAltTexts.push("");

      URL.revokeObjectURL(url);
      setSelectedFiles(newSelectedFiles);
      setPreviewUrls(newPreviewUrls);
      setState((prev) => ({ ...prev, altTexts: newAltTexts }));
    }
  };

  const log = (e) => {
    setState((prev) => ({ ...prev, description: e }));
    setErrors((prev) => ({ ...prev, description: "" }));
  };

  const options = [
    { label: "Default (free)", value: 0 },
    { label: "7 Days ($7)", value: 7 },
    { label: "14 Days ($10)", value: 10 },
    { label: "30 Days ($15)", value: 15 },
  ];

  const MULTI_CITY_RATE = 0.05;

  /** How many cities this ad will cover, as the server will see them. */
  const selectedCityCount = () => {
    if (router.query.name?.[0] == "local-ads") return 1;
    try {
      const cities = JSON.parse(localStorage?.getItem("cities"));
      return Array.isArray(cities) ? cities.length : 0;
    } catch (error) {
      return 0;
    }
  };

  /**
   * Mirrors feeForAd() on the server: the boost price, plus a per-city charge
   * only once an ad covers more than one city.
   */
  const quote = (boostPrice) => {
    const cities = selectedCityCount();
    const multiCity = cities > 1 ? cities * MULTI_CITY_RATE : 0;
    return Math.round((Number(boostPrice || 0) + multiCity) * 100) / 100;
  };

  const topForDays = ({ target: { value } }) => {
    setValue1(value);
    setLocal(quote(value));
  };

  useEffect(() => {
    setLocal(quote(value1));
  }, [router.query.name, value1]);

  const validate = () => {
    const e = {};
    if (!state.name.trim()) e.name = "Title is required";
    else if (state.name.length > 150)
      e.name = "Title must be under 150 characters";
    if (!state.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(state.email)) e.email = "Enter a valid email";
    if (!state.subCategory) e.subCategory = "Please select a category";
    if (!state.description || state.description === "<p><br></p>")
      e.description = "Description is required";
    if (previewUrls.length === 0) e.image = "At least one image is required";
    return e;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      message.error({
        type: "error",
        content: "Please fill all required fields",
      });
      return;
    }
    setErrors({});
    setLoading(true);
    const data = { ...state };

    if (router?.query?.name[0] != "local-ads") {
      const city = localStorage.getItem("cities");
      if (city == null) {
        message.error({
          type: "error",
          content: "No city selected. Please select at least one city.",
        });
        setLoading(false);
        return;
      }
    }

    const formData = new FormData();
    // Only append the photos that actually exist: appending selectedFiles[1..3]
    // unconditionally used to send the string "undefined" for empty slots.
    selectedFiles.forEach((file) => {
      if (file) formData.append("images", file);
    });

    try {
      const uploadRes = await fetch(api("/api/files2/files"), {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) throw new Error("upload failed");
      const result = await uploadRes.json();

      // The endpoint now returns { urls, files } so the ImageKit fileId can be
      // stored alongside each URL, which is what makes cleanup possible.
      const urls = Array.isArray(result) ? result : result.urls || [];
      const uploaded = Array.isArray(result) ? [] : result.files || [];

      data.imgOne = urls[0] ?? "empty";
      data.imgTwo = urls[1] ?? "empty";
      data.imgThree = urls[2] ?? "empty";
      data.imgFour = urls[3] ?? "empty";
      data.imageFileIds = uploaded.map((f) => f.fileId).filter(Boolean);
    } catch (uploadError) {
      console.log(uploadError);
      message.error({
        type: "error",
        content: "Could not upload your photos. Please try again.",
      });
      setLoading(false);
      return;
    }

    // Alt text only for the slots that have a photo.
    data.altTexts = (state.altTexts || [])
      .slice(0, selectedFiles.length)
      .map((t) => (t || "").trim());

    if (router.query.name[0] == "local-ads") {
      data.cities = [router.query.name[1]];
    } else {
      data.cities = JSON.parse(localStorage.getItem("cities"));
    }

    // premiumDay is the only boost input the server accepts; it derives the
    // price, isPremium and boostExpiresAt itself. isApproved is decided by
    // moderation on the server and is no longer sent from here at all.
    if (value1 == 0) data.premiumDay = 0;
    if (value1 == 7) data.premiumDay = 7 * 24;
    if (value1 == 10) data.premiumDay = 14 * 24;
    if (value1 == 15) data.premiumDay = 30 * 24;

    delete data.isApproved;
    delete data.isPremium;
    delete data.error;

    data.publishAt = scheduleLater && state.publishAt ? state.publishAt : null;
    data.posterId = session?.user?.id;

    // The second host was a leftover mirror; posting to it duplicated every ad
    // and its response was discarded anyway.
    await fetch(api("/api/products"), {
      method: "POST",
      headers: jsonAuthHeaders(session),
      body: JSON.stringify(data),
    })
      .then((e) => e.json())
      .then((t) => {
        setLoading(false);

        if (t.code === 401 || t.code === 403) {
          message.error({
            type: "error",
            content: "Your session has expired. Please sign in again.",
          });
          return;
        }

        if (t.code === 402) {
          Swal.fire({
            icon: "error",
            title: "Not enough credits",
            text: t.message || "Please top up your balance and try again.",
          });
          return;
        }

        if (t.status !== "success") {
          Swal.fire({
            icon: "error",
            title: "Could not post your ad",
            text: t.message || "Please try again.",
          });
          return;
        }

        localStorage.removeItem("cities");

        // The balance is no longer recalculated here. The server charges the
        // fee when it creates the ad, so writing it back from the browser both
        // double-charged boosts and allowed any balance to be set.
        const heldForReview = t.data && t.data.isApproved === false;
        const scheduled = t.data && t.data.publishAt;

        Swal.fire({
          position: "top-center",
          icon: heldForReview ? "info" : "success",
          title: heldForReview
            ? "Submitted for review"
            : scheduled
              ? "Your ad is scheduled"
              : "Your work has been saved",
          text: heldForReview
            ? t.message
            : scheduled
              ? `It will go live on ${new Date(scheduled).toLocaleString()}.`
              : undefined,
          showConfirmButton: heldForReview || Boolean(scheduled),
          timer: heldForReview || scheduled ? undefined : 2500,
        }).then(() => {
          router.push("/dashboard/profile");
        });
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        message.error({
          type: "error",
          content: "Something went wrong. Please try again.",
        });
      });
  };

  return (
    <div className='sm:mx-20 mx-4 py-6'>
      {/* Header */}
      <h1 className='text-xl font-bold mb-1' style={{ color: "var(--text)" }}>
        Post an Ad{" "}
        <span
          className='text-xs font-normal'
          style={{ color: "var(--text-muted)" }}
        >
          ({router?.query?.name?.[0]})
        </span>
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
        <span
          className='rounded-lg px-3 py-1.5 text-sm'
          style={{
            background: "var(--accent-dim)",
            border: "1px solid var(--accent)",
            color: "var(--accent)",
          }}
        >
          Charge: <strong>${local?.toFixed(2)}</strong>
        </span>
      </div>

      {/* Image upload */}
      <div className='mb-5'>
        <p
          className='text-sm font-semibold mb-2'
          style={{ color: "var(--text)" }}
        >
          <span style={{ color: "var(--error)" }}>*</span> Photos{" "}
          <span
            className='font-normal text-xs'
            style={{ color: "var(--text-muted)" }}
          >
            (max 4 &mdash; any size, we optimise them for you)
          </span>
        </p>
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
                <span className='text-xs px-2 text-center'>Optimising...</span>
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
        {errors.image && (
          <p className='text-xs mt-1' style={{ color: "var(--error)" }}>
            {errors.image}
          </p>
        )}

        {/* Alt text, one per photo. Describes the image for screen readers and
            for anyone whose images fail to load, and it helps search engines. */}
        {previewUrls.length > 0 && (
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
                    onChange={(e) => handleAltTextChange(index, e.target.value)}
                    placeholder={`Describe photo ${index + 1}`}
                    className='w-full rounded-lg px-3 py-2 text-sm focus:outline-none themed-input'
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Form fields — plain inputs, no wrapper component */}
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
              className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none themed-input ${errors.email ? "" : ""}`}
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
            className={`w-full sm:w-1/2 rounded-lg px-3 py-2 text-sm focus:outline-none themed-select ${errors.subCategory ? "" : ""}`}
          >
            <option value=''>-- Select Category --</option>
            {categories?.map((e) => (
              <option key={e?.name} value={e?.name}>
                {e?.name}
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
            style={{ border: `1px solid var(--border)` }}
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

        <div
          className='pt-8'
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p
            className='text-sm font-semibold mb-2'
            style={{ color: "var(--text)" }}
          >
            Boost your ad{" "}
            <span
              className='font-normal'
              style={{ color: "var(--text-muted)" }}
            >
              (extra charge)
            </span>
          </p>
          <Radio.Group
            options={options}
            onChange={topForDays}
            value={value1}
          />
        </div>

        {/* Schedule: post now, or pick a date and time for it to go live. The ad
            is hidden from the public listings until then. */}
        <div className='pt-6' style={{ borderTop: "1px solid var(--border)" }}>
          <p
            className='text-sm font-semibold mb-2'
            style={{ color: "var(--text)" }}
          >
            When should this go live?
          </p>
          <Radio.Group
            value={scheduleLater}
            onChange={(e) => {
              setScheduleLater(e.target.value);
              if (!e.target.value) {
                setState((prev) => ({ ...prev, publishAt: null }));
              }
            }}
            options={[
              { label: "Post now", value: false },
              { label: "Schedule for later", value: true },
            ]}
          />
          {scheduleLater && (
            <div className='mt-3'>
              <DatePicker
                showTime={{ format: "HH:mm" }}
                format='YYYY-MM-DD HH:mm'
                placeholder='Pick a date and time'
                // Only today onwards; a past time would publish immediately.
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
              {state.publishAt && (
                <p
                  className='text-xs mt-2'
                  style={{ color: "var(--text-secondary)" }}
                >
                  Goes live on {new Date(state.publishAt).toLocaleString()}. It
                  stays hidden until then.
                </p>
              )}
            </div>
          )}
        </div>

        <div className='pt-2'>
          {users?.credit < local ? (
            <div className='flex flex-col gap-2'>
              <p className='font-bold' style={{ color: "var(--error)" }}>
                Insufficient Balance
              </p>
              <Link
                href='/recharge-credits/'
                className='inline-block font-semibold px-5 py-2 rounded-lg text-sm w-fit'
                style={{ background: "var(--success)", color: "#fff" }}
              >
                Buy Credits
              </Link>
            </div>
          ) : loading || compressing ? (
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
              onClick={() => handleSubmit(router?.query?.name)}
              className='font-semibold px-8 py-2.5 rounded-lg text-sm transition-colors btn-accent'
            >
              Submit Post
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostForm;
