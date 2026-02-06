import type { NextRequest } from "next/server";

const DEFAULT_API_BASE = "https://zeldvorik.ru/apiv3/api.php";
const API_BASE =
  process.env.API_BASE || process.env.NEXT_PUBLIC_API_BASE || DEFAULT_API_BASE;

const ALLOWED_ACTIONS = new Set([
  "trending",
  "indonesian-movies",
  "indonesian-drama",
  "kdrama",
  "short-tv",
  "anime",
  "adult-comedy",
  "western-tv",
  "indo-dub",
  "search",
  "detail",
]);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  if (!action || !ALLOWED_ACTIONS.has(action)) {
    return new Response(JSON.stringify({ success: false, error: "Invalid action" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const apiUrl = new URL(API_BASE);
  searchParams.forEach((value, key) => {
    apiUrl.searchParams.set(key, value);
  });

  const response = await fetch(apiUrl.toString(), { cache: "no-store" });
  const body = await response.text();

  return new Response(body, {
    status: response.status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
}
