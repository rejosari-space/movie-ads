const DEFAULT_BASE_URL = "https://zeldvorik.ru/apiv3/api.php";
const SERVER_BASE_URL =
  process.env.API_BASE || process.env.NEXT_PUBLIC_API_BASE || DEFAULT_BASE_URL;
const RAW_BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH ||
  process.env.NEXT_PUBLIC_ADS_BASE_PATH ||
  "";

const normalizeBasePath = (value: string) => {
  if (!value || value === "/") return "";
  const withLeading = value.startsWith("/") ? value : `/${value}`;
  return withLeading.endsWith("/") ? withLeading.slice(0, -1) : withLeading;
};

const PUBLIC_BASE_PATH = normalizeBasePath(RAW_BASE_PATH);
const CLIENT_BASE_URL = `${PUBLIC_BASE_PATH}/api/stream`;

const resolveBaseUrl = () => {
  if (typeof window === "undefined") return SERVER_BASE_URL;
  if (/^https?:\/\//i.test(CLIENT_BASE_URL)) return CLIENT_BASE_URL;
  return new URL(CLIENT_BASE_URL, window.location.origin).toString();
};

type ApiResponse = {
  items?: any[];
  data?: any;
  success?: boolean;
  hasMore?: boolean;
  [key: string]: any;
};

const fetchFromApi = async (
  params: Record<string, string | number | boolean>
): Promise<ApiResponse> => {
  try {
    const url = new URL(resolveBaseUrl());
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, String(params[key]))
    );

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    const data = await response.json();
    return data as ApiResponse;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const api = {
  getTrending: (page = 1) => fetchFromApi({ action: "trending", page }),
  getIndonesianMovies: (page = 1) =>
    fetchFromApi({ action: "indonesian-movies", page }),
  getIndonesianDrama: (page = 1) =>
    fetchFromApi({ action: "indonesian-drama", page }),
  getKDrama: (page = 1) => fetchFromApi({ action: "kdrama", page }),
  getShortTV: (page = 1) => fetchFromApi({ action: "short-tv", page }),
  getAnime: (page = 1) => fetchFromApi({ action: "anime", page }),
  getAdultComedy: (page = 1) =>
    fetchFromApi({ action: "adult-comedy", page }),
  getWesternTV: (page = 1) => fetchFromApi({ action: "western-tv", page }),
  getIndoDub: (page = 1) => fetchFromApi({ action: "indo-dub", page }),
  search: (keyword: string) => fetchFromApi({ action: "search", q: keyword }),
  getDetail: (detailPath: string) =>
    fetchFromApi({ action: "detail", detailPath }),
};
