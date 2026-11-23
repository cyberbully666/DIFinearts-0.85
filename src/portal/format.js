const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatINR(value) {
  if (value === null || value === undefined || value === "") return "";
  const n = Number(value);
  return Number.isFinite(n) ? inr.format(n) : "";
}

export function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatSize(w, h) {
  if (!w && !h) return "";
  return `${w || "?"} × ${h || "?"} cm`;
}

export function pricingLine(a) {
  const parts = [];
  if (a.for_sale && a.sale_price) parts.push(`Buy ${formatINR(a.sale_price)}`);
  else if (a.for_sale) parts.push("For sale");
  if (a.for_rent && a.rent_monthly) parts.push(`Rent ${formatINR(a.rent_monthly)}/month`);
  else if (a.for_rent) parts.push("For rent");
  return parts.join(" · ");
}
