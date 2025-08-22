import hotpoint_logo from "./hotpoint_logo.png";

export const assets = {
  hotpoint_logo,
};

export const formatDateLong = (dateString) => {
  if (!dateString) return "dd/mm/yy";
  const date = new Date(dateString);
  if (isNaN(date)) return "n/a"; // invalid date check
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const clearFormData = (setFormData) => {
  setFormData((prev) => {
    const cleared = {};
    Object.keys(prev).forEach((key) => {
      cleared[key] = ""; // Reset each field to empty string
    });
    return cleared;
  });
};
