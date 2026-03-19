import app from "../server/index.js";

export default function handler(req, res) {
  const rawPath = req.query?.path;
  const normalizedPath = Array.isArray(rawPath) ? rawPath.join("/") : rawPath || "";

  req.url = `/api/${normalizedPath}`;
  return app(req, res);
}
