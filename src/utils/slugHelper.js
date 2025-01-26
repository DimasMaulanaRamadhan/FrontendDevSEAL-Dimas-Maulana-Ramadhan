// src/utils/slugHelper.js
export const createSlug = (title) =>
  title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim(); // Remove leading/trailing hyphens
