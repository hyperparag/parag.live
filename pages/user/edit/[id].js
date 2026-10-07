import axios from "axios";
import React, { useEffect, useState } from "react";
import style from "../../../styles/moduleCss/edit.module.css";
import { FaPencilAlt } from "react-icons/fa";

import { PlusOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import User from "@/component/user";
import { useRouter } from "next/router";
import { Modal, Upload, message } from "antd";
import { compressImage, formatBytes } from "@/component/utils/compressImage";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Header from "@/component/header/header";
import Footer from "@/component/footer/footer";
import { jsonAuthHeaders } from "@/component/utils/api";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  avater: "",
  edit: false,
  userData: [],
  limit: "",
  selected: "",
  oldPassword: "",
  newPass: "",
  newConPass: "",
  passError: "",
};

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const Edit = () => {
  const router = useRouter();
  const [state, setState] = useState(initialState);
  const [imagLoading, setUpdateLoding] = useState(false);
  const [passLoaidng, setPassLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { users } = User();
  const { data: session } = useSession();
  // The compressed avatar, kept separately from antd's list (which swaps it
  // back to the original file).
  const [avatarFile, setAvatarFile] = useState(null);

  const dispatch = (e) => {
    setState({ ...state, [e.type]: e.payload });
  };
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    );
  };
  // Selecting a file is handled in beforeAvatarUpload; this only has to react
  // to the user removing the picture.
  const handleChange = ({ fileList: newFileList }) => {
    if (newFileList.length === 0) {
      setFileList([]);
      setAvatarFile(null);
    }
  };

  /**
   * antd calls this before adding the file to the list. Returning false stops
   * the automatic upload (this Upload has action={false} anyway) and we hand the
   * compressed File back in place of the original, so the avatar is optimised
   * before it is ever sent.
   */
  const beforeAvatarUpload = async (file) => {
    const result = await compressImage(file, { maxDimension: 800 });

    if (result.skipped === "undecodable") {
      message.error({
        content:
          "That image could not be read by this browser. Please save it as JPG or PNG and try again.",
        duration: 6,
      });
      return Upload.LIST_IGNORE;
    }

    if (result.compressed) {
      message.success({
        content: `Optimised: ${formatBytes(result.originalSize)} to ${formatBytes(result.size)}`,
        duration: 3,
      });
    }

    setAvatarFile(result.file);
    setFileList([
      {
        uid: `avatar-${Date.now()}`,
        name: result.file.name,
        status: "done",
        originFileObj: result.file,
        url: URL.createObjectURL(result.file),
      },
    ]);

    return false;
  };

  async function getUser(users) {
    try {
      const response = await axios.get(
        `  https://paraglive-backend.vercel.app/api/users/${users._id}`,
      );
      const data = response.data.data.user;
      setLoading(false);
      setState({ ...state, userData: data });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    setLoading(true);
    if (users) {
      getUser(users);
    } else {
      return;
    }
  }, [users]);

  // updata profile
  const updateProfile = async () => {
    setUpdateLoding(true);
    // Only the fields the form edits. The whole state used to be sent,
    // including the loaded user record.
    const datas = {
      firstName: state.firstName,
      lastName: state.lastName,
      email: state.email,
      phone: state.phone,
    };
    const options = { headers: jsonAuthHeaders(session) };

    try {
      if (avatarFile) {
        const formData = new FormData();
        formData.append("images", avatarFile);

        const res = await fetch(
          "  https://paraglive-backend.vercel.app/api/image/upload-file",
          { method: "POST", body: formData },
        );
        const data = await res.json();
        if (!res.ok || !data?.payload?.url) {
          throw new Error("The picture could not be uploaded.");
        }
        datas.avater = data.payload.url;
      }

      const res = await axios.patch(
        `  https://paraglive-backend.vercel.app/api/users/${state.userData._id}`,
        datas,
        options,
      );
      if (res.data.status == "success") {
        await Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Your Profile has been updated",
          showConfirmButton: false,
          timer: 1500,
        });
        router.push("/dashboard/profile");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Could not update your profile",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Please try again.",
      });
    } finally {
      setUpdateLoding(false);
    }
  };

  const updatePassword = async () => {
    if (state.newConPass !== state.newPass) {
      setState({ ...state, passError: "New Passwords are not matched" });
      return;
    }
    setState({ ...state, passError: "" });
    setPassLoading(true);

    const data = { password: state.newPass, oldPassword: state.oldPassword };
    const options = { headers: jsonAuthHeaders(session) };

    try {
      const res = await axios.patch(
        `  https://paraglive-backend.vercel.app/api/users/password/${state.userData._id}`,
        data,
        options,
      );
      if (res.data.status == "success") {
        await Swal.fire({
          position: "top-center",
          icon: "success",
          title: "Your password has been changed",
          showConfirmButton: false,
          timer: 1500,
        });
        router.push("/dashboard/profile");
      } else {
        Swal.fire({ icon: "error", title: "Old password is wrong" });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title:
          err?.response?.status == 422
            ? "Old password is wrong"
            : "Could not change the password",
      });
    } finally {
      setPassLoading(false);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  return (
    <div className='page-bg' style={{ minHeight: "100vh" }}>
      <Head>
        <title>Edit My Profile</title>
      </Head>
      <Header />
      <div style={{ padding: "24px 0" }}>
    <div className={style.container}>
      {loading ? (
        <button className='btn loading bg-transparent lowercase border-0 m-auto w-full'>
          loading
        </button>
      ) : (
        <>
          <div className='profile'>
            <Upload
              action={false}
              accept='image/*'
              listType='picture-card'
              fileList={fileList}
              beforeUpload={beforeAvatarUpload}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            <Modal
              open={previewOpen}
              title={previewTitle}
              footer={null}
              onCancel={handleCancel}
            >
              <img
                alt='example'
                style={{
                  width: "100%",
                }}
                src={previewImage}
              />
            </Modal>
          </div>

          <div className={style.profileContainer}>
            <label className={style.labels}>
              First Name :
              <br />
              <input
                onChange={(e) =>
                  dispatch({
                    type: "firstName",
                    payload: e.target.value,
                  })
                }
                type='text'
                placeholder={state.userData?.firstName}
                className={`${style.editableInputs} input-bordered input-warning w-full`}
                style={{ background: "var(--surface-2)", color: "var(--text)" }}
              />
            </label>
            <label className={style.labels}>
              Last Name :
              <br />
              <input
                onChange={(e) =>
                  dispatch({
                    type: "lastName",
                    payload: e.target.value,
                  })
                }
                type='text'
                placeholder={state.userData?.lastName}
                className={`${style.editableInputs} input-bordered input-warning w-full`}
                style={{ background: "var(--surface-2)", color: "var(--text)" }}
              />
            </label>
            <label className={style.labels}>
              Email :
              <br />
              <input
                onChange={(e) =>
                  dispatch({
                    type: "email",
                    payload: e.target.value,
                  })
                }
                type='text'
                placeholder={state.userData?.email}
                className={`${style.editableInputs} input-bordered input-warning w-full`}
                style={{ background: "var(--surface-2)", color: "var(--text)" }}
              />
            </label>

            <label className={style.labels}>
              Phone :
              <br />
              <input
                onChange={(e) =>
                  dispatch({ type: "phone", payload: e.target.value })
                }
                type='text'
                placeholder={state.userData?.phone}
                className={`${style.editableInputs} input-bordered input-warning w-full`}
                style={{ background: "var(--surface-2)", color: "var(--text)" }}
              />
            </label>
            {imagLoading ? (
              <button className={`${style.updateButton} `}>Updating</button>
            ) : (
              <button
                className={style.updateButton}
                onClick={() => updateProfile()}
              >
                Update
              </button>
            )}
          </div>

          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <div className={style.profileContainer}>
            <label className={style.labels}>
              Current Password :
              <br />
              <input
                onChange={(e) =>
                  dispatch({ type: "oldPassword", payload: e.target.value })
                }
                type='password'
                placeholder='Current Password'
                className={`${style.readOnlyInputs} input-bordered input-success w-full`}
                style={{ background: "var(--surface-2)", color: "var(--text)" }}
              />
            </label>
            <label className={style.labels}>
              New Password :
              <br />
              <input
                onChange={(e) =>
                  dispatch({ type: "newPass", payload: e.target.value })
                }
                type='password'
                placeholder='New Password'
                className={`${style.readOnlyInputs} input-bordered input-success w-full`}
                style={{ background: "var(--surface-2)", color: "var(--text)" }}
              />
            </label>
            <label className={style.labels}>
              Confirm New Password :
              <br />
              <input
                onChange={(e) =>
                  dispatch({ type: "newConPass", payload: e.target.value })
                }
                type='password'
                placeholder='Confirm New Password'
                className={`${style.readOnlyInputs} input-bordered input-success w-full`}
                style={{ background: "var(--surface-2)", color: "var(--text)" }}
              />
              {state.passError ? (
                <p className='text-sm' style={{ color: "var(--error)" }}>
                  {state.passError}
                </p>
              ) : (
                ""
              )}
            </label>
            {passLoaidng ? (
              <button className={style.editButton}>
                Changing <FaPencilAlt className='ml-2 text-white' />
              </button>
            ) : (
              <button
                onClick={() => updatePassword()}
                className={style.editButton}
              >
                Change <FaPencilAlt className='ml-2 text-white' />
              </button>
            )}
          </div>
        </>
      )}
    </div>
      </div>
      <Footer />
    </div>
  );
};

export default Edit;
