import React, { useState } from "react";
import { Button, Input, Modal, Popover, QRCode, Tooltip, message } from "antd";
import { FaCopy } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import axios from "axios";
import { jsonAuthHeaders } from "@/component/utils/api";

const Deposit = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState("");
  const [address, setAddress] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { data: session } = useSession();

  const showModal = (e) => {
    setCurrency(e.currency);
    setAddress(e.address);
    setOpen(true);
  };

  const handleCopy = (e) => {
    global.navigator.clipboard.writeText(e);
    message.success("Copied to clipboard");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    const trxid = e.target.trxid.value;
    const amount = e.target.amount.value;
    const email = session.user.email;
    const userName = session.user.name;
    const userId = session.user.id;
    const provider = currency;

    const data = {
      email,
      trxid,
      amount,
      provider,
      userName,
      userId,
      referralCode: referralCode.trim().toUpperCase(),
    };

    try {
      const response = await axios.post(
        "https://paraglive-backend.vercel.app/api/deposit",
        data,
        { headers: jsonAuthHeaders(session) },
      );
      if (response.data.status == "success") {
        Swal.fire({
          position: "top-center",
          icon: "success",
          title:
            "Your deposit will be verified and credit will be added to your wallet.",
          showConfirmButton: false,
          timer: 2500,
        });
        setTimeout(() => {
          router.reload();
        }, 2500);
      } else {
        setErrorMsg(response.data?.message || "Could not submit deposit.");
      }
    } catch (error) {
      setErrorMsg(
        error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className='p-3 sm:w-[800px] m-auto my-10'
        style={{ background: "var(--surface)" }}
      >
        <h1
          className='text-2xl p-3 font-bold'
          style={{ color: "var(--success)" }}
        >
          Choose Diposit Option
        </h1>
        <div className='grid sm:grid-cols-3 grid-cols-1 gap-5  '>
          <div
            className='border-2'
            onClick={() =>
              showModal({
                currency: "BTC",
                address: "1D41XWNDepQZ14PtVwSzygf2ymU4rLCCKj",
              })
            }
          >
            <img
              className='w-[100px] h-[100px] m-auto'
              src='/currency/btc.png'
            />
            <h2 className='text-center' style={{ color: "var(--text)" }}>
              BTC
            </h2>
          </div>
          {/* <div
            className='border-2'
            onClick={() =>
              showModal({
                currency: "USDT",
                address: "TDvE2zRwYDLL4h2BiRLbtQNAtHuf4V265t",
              })
            }
          >
            <img
              className='w-[100px] h-[100px] m-auto'
              src='/currency/usdt.png'
            />
            <h2 className='text-center' style={{ color: "var(--text)" }}>
              USDT
            </h2>
          </div>
          <div
            className='border-2'
            onClick={() =>
              showModal({
                currency: "LTC",
                address: "0xbcd4b2711240252955ace7189f8d2a65e77b6e00",
              })
            }
          >
            <img
              className='w-[100px] h-[100px] m-auto'
              src='/currency/ltc.png'
            />
            <h2 className='text-center' style={{ color: "var(--text)" }}>
              LTC
            </h2>
          </div>
          <div
            className='border-2'
            onClick={() =>
              showModal({
                currency: "DOGE",
                address: "0xbcd4b2711240252955ace7189f8d2a65e77b6e00",
              })
            }
          >
            <img
              className='w-[100px] h-[100px] m-auto'
              src='/currency/doge.svg'
            />
            <h2 className='text-center' style={{ color: "var(--text)" }}>
              DOGE
            </h2>
          </div>
          <div
            className='border-2'
            onClick={() =>
              showModal({
                currency: "ETH",
                address: "0xbcd4b2711240252955ace7189f8d2a65e77b6e00",
              })
            }
          >
            <img
              className='w-[100px] h-[100px] m-auto'
              src='/currency/eth.png'
            />
            <h2 className='text-center' style={{ color: "var(--text)" }}>
              ETH
            </h2>
          </div>
          <div
            className='border-2'
            onClick={() =>
              showModal({
                currency: "TRX",
                address: "TDvE2zRwYDLL4h2BiRLbtQNAtHuf4V265t",
              })
            }
          >
            <img
              className='w-[100px] h-[100px] m-auto'
              src='/currency/trx.png'
            />
            <h2 className='text-center' style={{ color: "var(--text)" }}>
              TRX
            </h2>
          </div> */}
        </div>
        <Modal
          className='themed-modal'
          title={`Deposit ${currency}`}
          open={open}
          onCancel={() => setOpen(false)}
          okButtonProps={{
            hidden: true,
          }}
          cancelButtonProps={{
            hidden: true,
          }}
        >
          <div className='m-auto p-2'>
            <div
              className='flex gap-2 items-center justify-center p-2 mb-3 rounded font-mono break-all'
              style={{
                background: "var(--surface)",
                color: "var(--text)",
                border: "1px solid var(--border)",
              }}
            >
              <span style={{ color: "var(--text)" }}>{address}</span>
              <Tooltip title='copy'>
                <div
                  onClick={() => handleCopy(`${address}`)}
                  style={{ color: "var(--text)" }}
                >
                  <FaCopy className='text-xl cursor-pointer' />
                </div>
              </Tooltip>
            </div>
            <div
              className='m-auto p-3 rounded'
              style={{ background: "#fff", width: "fit-content" }}
            >
              <QRCode value={address} bgColor='#fff' color='#000' />
            </div>
          </div>
          <hr className='my-5' style={{ borderColor: "var(--border)" }} />
          <small style={{ color: "var(--text-secondary)" }}>
            After completing the payment, please send us the transaction ID and
            the amount you have sent.
          </small>
          <hr className='my-5' style={{ borderColor: "var(--border)" }} />
          <form onSubmit={handleSubmit}>
            <label>Transaction ID</label>
            <input
              name='trxid'
              placeholder='Transaction ID'
              className='w-full mb-3'
              style={{ background: "var(--surface-2)", color: "var(--text)" }}
            />

            <label className='pt-5'>Amount</label>
            <input
              name='amount'
              placeholder='Amount you added'
              className='w-full'
              style={{ background: "var(--surface-2)", color: "var(--text)" }}
            />

            <label className='pt-5 block mt-3'>Referral code (optional)</label>
            <input
              name='referralCode'
              placeholder='e.g. AB12CD34'
              maxLength={12}
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              className='w-full'
              style={{ background: "var(--surface-2)", color: "var(--text)" }}
            />
            <small style={{ color: "var(--text-secondary)" }}>
              If someone invited you, enter their code. They earn 50% of what
              you pay as referral earnings, at no extra cost to you.
            </small>
            {errorMsg && (
              <p style={{ color: "var(--error)" }} className='mt-2 text-sm'>
                {errorMsg}
              </p>
            )}
            {loading ? (
              <button
                disabled
                className='mt-3 rounded-lg px-3 text-lg font-bold cursor-not-allowed'
                style={{
                  background: "var(--success)",
                  color: "#fff",
                  border: "1px solid var(--success)",
                }}
              >
                loading
              </button>
            ) : (
              <button
                type='submit'
                className='mt-3 rounded-lg px-3 text-lg font-bold btn-accent'
              >
                Submit
              </button>
            )}
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default Deposit;
