import http from "node:http";
import dotenv from "dotenv";

dotenv.config();

const PORT = Number(process.env.PORT) || 8000;
const API_KEY = process.env.API_KEY;
const OMDB_BASE_URL = "https://www.omdbapi.com/";

const allowedOrigins = (process.env.FRONTEND_ORIGIN || "*")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

function sendJson(res, statusCode, payload) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(payload));
}

function setCorsHeaders(req, res) {
    const requestOrigin = req.headers.origin;
    const allowAnyOrigin = allowedOrigins.includes("*");

    if (allowAnyOrigin) {
        res.setHeader("Access-Control-Allow-Origin", "*");
    } else if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
        res.setHeader("Access-Control-Allow-Origin", requestOrigin);
        res.setHeader("Vary", "Origin");
    }

    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

if (!API_KEY) {
    console.error("Missing API_KEY. Add it to environment variables before starting the backend.");
    process.exit(1);
}

const server = http.createServer(async (req, res) => {
    setCorsHeaders(req, res);

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    const host = req.headers.host || `localhost:${PORT}`;
    const requestUrl = new URL(req.url || "/", `http://${host}`);
    const { pathname, searchParams } = requestUrl;

    try {
        if (req.method !== "GET") {
            sendJson(res, 405, { error: "Method Not Allowed" });
            return;
        }

        if (pathname === "/health") {
            sendJson(res, 200, { status: "ok" });
            return;
        }

        if (pathname === "/") {
            sendJson(res, 200, {
                status: "ok",
                message: "Movie Watchlist backend is running",
                endpoints: ["/health", "/api/search?s={query}", "/api/movie?i={imdbID}"]
            });
            return;
        }

        if (pathname === "/api/search") {
            const searchValue = searchParams.get("s")?.trim();

            if (!searchValue) {
                sendJson(res, 400, { error: "Missing required query parameter: s" });
                return;
            }

            const upstreamUrl = new URL(OMDB_BASE_URL);
            upstreamUrl.searchParams.set("apikey", API_KEY);
            upstreamUrl.searchParams.set("s", searchValue);

            const response = await fetch(upstreamUrl);
            const data = await response.json();
            sendJson(res, response.ok ? 200 : 502, data);
            return;
        }

        if (pathname === "/api/movie") {
            const movieId = searchParams.get("i")?.trim();

            if (!movieId) {
                sendJson(res, 400, { error: "Missing required query parameter: i" });
                return;
            }

            const upstreamUrl = new URL(OMDB_BASE_URL);
            upstreamUrl.searchParams.set("apikey", API_KEY);
            upstreamUrl.searchParams.set("i", movieId);

            const response = await fetch(upstreamUrl);
            const data = await response.json();
            sendJson(res, response.ok ? 200 : 502, data);
            return;
        }

        sendJson(res, 404, { error: "Not Found" });
    } catch (error) {
        console.error("Unhandled server error:", error);
        sendJson(res, 500, { error: "Internal Server Error" });
    }
});

server.listen(PORT, () => {
    console.log(`Backend API running on http://localhost:${PORT}`);
});