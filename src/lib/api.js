const configuredApiOrigin = (import.meta.env.VITE_API_ORIGIN || "").trim();

function getRuntimeApiOrigin() {
  if (configuredApiOrigin) return configuredApiOrigin;
  if (import.meta.env.DEV) return "";
  if (typeof window === "undefined") return "http://localhost:3001";

  // Keep backend host aligned with the frontend host in static-network runs.
  return `${window.location.protocol}//${window.location.hostname}:3001`;
}

const apiOrigin = getRuntimeApiOrigin();

export function apiFetch(path, options = {}) {
  const url = apiOrigin ? `${apiOrigin}${path}` : path;
  return fetch(url, {
    credentials: "include",
    ...options,
  });
}
