import hotpoint_logo from "./hotpoint_logo.svg";

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

export const HotpointSvgLogo = () => {
  return (
    <Image
      src={assets.hotpoint_logo}
      alt="Company Logo"
      width={150}
      height={150}
      className="mx-auto h-20 w-auto"
      priority
    />
  );
};
