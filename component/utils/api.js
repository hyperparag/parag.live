/**
 * Backend base URL and auth header in one place.
 *
 * The host was hardcoded inline in roughly 25 files. New code uses this; the
 * existing inline strings are left alone so this change stays reviewable.
 *
 * NEXT_PUBLIC_API_URL overrides it when set, which is what makes a staging
 * deploy possible without editing source.
 */
import Cookies from "js-cookie";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://paraglive-backend.vercel.app";

export const api = (path = "") =>
  `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;

/**
 * The backend JWT for the signed-in user.
 *
 * Google sign-in goes through /api/users/save, which now returns a token; the
 * NextAuth callbacks put it on the session as accessToken. The legacy `token`
 * cookie is still checked so an email/password session keeps working.
 */
export function getAuthToken(session) {
  return session?.user?.accessToken || Cookies.get("token") || null;
}

/** Headers for an authenticated JSON request. */
export function authHeaders(session, extra = {}) {
  const token = getAuthToken(session);
  return {
    ...(token ? { authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

/** Headers for an authenticated request with a JSON body. */
export function jsonAuthHeaders(session) {
  return authHeaders(session, { "content-type": "application/json" });
}
