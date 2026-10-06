import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Responsive = () => {
  const [loading, setLoading] = useState(true);
  const [ads, setAds] = useState({});

  async function getads() {
    try {
      const response = await axios.get(
        `https://paraglive-backend.vercel.app/api/responsive-ads/`,
        {
          method: "GET",
        },
      );
      setLoading(false);
      setAds(response?.data?.response?.links);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }

  useEffect(() => {
    setLoading(true);
    getads();
  }, []);

  // Nothing to show until an admin has added a banner.
  if (loading || !ads?.image) return null;

  return (
    <div className='my-4' style={{ padding: "0 16px" }}>
      <Link
        href={ads?.link || "/"}
        target='_blank'
        rel='noopener noreferrer nofollow sponsored'
      >
        <img
          src={ads.image}
          alt='Sponsored'
          style={{
            display: "block",
            width: "100%",
            maxWidth: "1200px",
            height: "auto",
            margin: "0 auto",
            borderRadius: "8px",
          }}
        />
      </Link>
    </div>
  );
};

export default Responsive;
