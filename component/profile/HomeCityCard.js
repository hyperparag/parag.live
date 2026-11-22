import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { api, jsonAuthHeaders } from "@/component/utils/api";
import CitySearch from "@/component/search/CitySearch";

/**
 * Lets a user choose their home city. Ads in the home city are free; ads in any
 * other city cost credits. After the first choice it can be changed only once
 * every 30 days, so the city is picked from the search box (same spelling as
 * the city pages) instead of being typed by hand.
 */
const HomeCityCard = ({ users, onSaved }) => {
  const { data: session } = useSession();
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  // True when the person typed a city that is not in our list, so the country
  // is not known and they can add it.
  const [typedByHand, setTypedByHand] = useState(false);
  const [saving, setSaving] = useState(false);

  const choose = (picked) => {
    setCity(picked.name);
    setCountry(picked.country || "");
    setTypedByHand(Boolean(picked.custom));
  };

  useEffect(() => {
    setCity(users?.address?.city || "");
    setCountry(users?.address?.country || "");
  }, [users?.address?.city, users?.address?.country]);

  const save = async () => {
    if (!city.trim()) {
      Swal.fire("Choose your city", "Type the city you live in.", "info");
      return;
    }
    setSaving(true);
    try {
      await axios.patch(
        api("/api/users/home-city"),
        { city: city.trim(), country: country.trim() },
        { headers: jsonAuthHeaders(session) },
      );
      Swal.fire("Saved", "Your home city is set.", "success");
      if (onSaved) onSaved();
    } catch (error) {
      Swal.fire(
        "Could not save",
        error?.response?.data?.message || "Please try again.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "16px",
        background: "var(--surface)",
        margin: "16px 0",
      }}
    >
      <h2 style={{ fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
        Home city
      </h2>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
        Posting in your home city is free. Posting in any other city uses
        credits. You can change your home city once every 30 days.
      </p>
      <div style={{ marginTop: 12, maxWidth: 520 }}>
        <CitySearch
          allowCustom
          customLabel='Use'
          placeholder='Search your city'
          onSelect={choose}
        />
      </div>
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          alignItems: "center",
          marginTop: 12,
        }}
      >
        <p className='notranslate' style={{ color: "var(--text)", flex: "1 1 200px" }}>
          {city ? (
            <>
              <strong>{city}</strong>
              {country ? `, ${country}` : ""}
            </>
          ) : (
            <span style={{ color: "var(--text-muted)" }}>No city chosen yet</span>
          )}
        </p>
        {typedByHand && (
          <input
            className='themed-input'
            placeholder='Country (optional)'
            value={country}
            maxLength={100}
            onChange={(e) => setCountry(e.target.value)}
            style={{ flex: "1 1 160px" }}
          />
        )}
        <button className='btn-accent' onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default HomeCityCard;
