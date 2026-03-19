const configuredApiOrigin = (import.meta.env.VITE_API_ORIGIN || "").trim();

function getRuntimeApiOrigin() {
  if (configuredApiOrigin) return configuredApiOrigin;
  if (import.meta.env.DEV) return "";
  if (typeof window === "undefined") return "";

  const { protocol, hostname } = window.location;
  const isLocalRuntime =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    /^10(?:\.\d{1,3}){3}$/.test(hostname) ||
    /^192\.168(?:\.\d{1,3}){2}$/.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2}$/.test(hostname);

  // Local static runtimes keep the backend in :3001.
  if (isLocalRuntime) return `${protocol}//${hostname}:3001`;

  // Cloud runtimes (Vercel, Netlify, etc.) should use same-origin /api unless overridden.
  return "";
}

const apiOrigin = getRuntimeApiOrigin();
const API_TIMEOUT_MS = 12000;

export function apiFetch(path, options = {}) {
  const url = apiOrigin ? `${apiOrigin}${path}` : path;
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  const callerSignal = options.signal;
  if (callerSignal) {
    callerSignal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  return fetch(url, {
    credentials: "include",
    signal: controller.signal,
    ...options,
  }).finally(() => {
    window.clearTimeout(timeoutId);
  });
}
