/** Shared formatting helpers for title documentation. */

export const formatCurrency = (value?: number) =>
  value && value > 0
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)
    : null;

export const formatRuntime = (minutes?: number) => {
  if (!minutes || minutes <= 0) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m (${minutes} min)` : `${m} min`;
};

export const formatDate = (value?: string) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
};

export const formatList = (items?: { name: string }[]) =>
  items && items.length > 0 ? items.map((i) => i.name).join(", ") : null;

const LANGUAGE_NAMES =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["en"], { type: "language" })
    : null;

export const formatLanguage = (code?: string) => {
  if (!code) return null;
  try {
    return LANGUAGE_NAMES?.of(code) ?? code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
};

/** US certification (e.g. PG-13) out of a TMDB movie release_dates payload. */
export const getMovieCertification = (releaseDates: any): string | null => {
  const us = releaseDates?.results?.find((r: any) => r.iso_3166_1 === "US");
  const cert = us?.release_dates?.find((d: any) => d.certification)?.certification;
  return cert || null;
};

/** US content rating (e.g. TV-MA) out of a TMDB tv content_ratings payload. */
export const getTVRating = (contentRatings: any): string | null => {
  const us = contentRatings?.results?.find((r: any) => r.iso_3166_1 === "US");
  return us?.rating || null;
};

export const profitLabel = (budget?: number, revenue?: number) => {
  if (!budget || !revenue || budget <= 0 || revenue <= 0) return null;
  const diff = revenue - budget;
  const multiple = (revenue / budget).toFixed(2);
  return `${formatCurrency(Math.abs(diff))} ${diff >= 0 ? "profit" : "loss"} · ${multiple}x budget`;
};
