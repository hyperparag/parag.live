// The only categories on the site. Keep in step with
// Backend/src/api/v1/utils/categories.js.
//
// A post stores the same value in `category` and `subCategory`; the listing
// API filters on `subCategory`.
export const CATEGORIES = ["Community", "Dating", "Marketplace", "Services"];

export const DEFAULT_CATEGORY = "Marketplace";

export const CATEGORY_DESCRIPTIONS = {
  Community: "Community and local groups",
  Dating: "Dating and friendship",
  Marketplace: "General buying and selling of goods",
  Services: "Local and professional services",
};

export const isValidCategory = (value) => CATEGORIES.includes(value);
