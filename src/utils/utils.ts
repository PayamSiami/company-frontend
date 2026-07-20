export const formatDate = (date: string) => {
  if (!date) return "نامشخص";
  return new Date(date).toLocaleDateString("fa-IR", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};
