export const formatDate = (date: Date | string | number | undefined | null): string => {
  if (!date) return "نامشخص";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "نامشخص";
  return parsed.toLocaleDateString("fa-IR", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};
