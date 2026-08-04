export const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(`${value}T00:00:00`))
    : "—";
export const formatSalary = (app) => {
  if (!app.minimumSalary && !app.maximumSalary) return "Not specified";
  const fmt = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: app.currency === "Other" ? "IDR" : app.currency || "IDR",
    maximumFractionDigits: 0,
  });
  return `${app.minimumSalary ? fmt.format(app.minimumSalary) : "—"} – ${app.maximumSalary ? fmt.format(app.maximumSalary) : "—"}`;
};
