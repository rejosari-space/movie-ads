const DEFAULT_API_BASE = "https://zeldvorik.ru/apiv3/api.php";
const API_BASE =
  process.env.API_BASE || process.env.NEXT_PUBLIC_API_BASE || DEFAULT_API_BASE;

export type ApiResponse = {
  items?: any[];
  data?: any;
  success?: boolean;
  hasMore?: boolean;
  [key: string]: any;
};

const fetchFromApi = async (
  params: Record<string, string | number | boolean>
): Promise<ApiResponse> => {
  const url = new URL(API_BASE);
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, String(params[key]))
  );

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  return (await response.json()) as ApiResponse;
};

export const apiServer = {
  getTrending: (page = 1) => fetchFromApi({ action: "trending", page }),
  getDetail: (detailPath: string) =>
    fetchFromApi({ action: "detail", detailPath }),
  search: (keyword: string) => fetchFromApi({ action: "search", q: keyword }),
  getCategory: (category: string, page = 1) =>
    fetchFromApi({ action: category, page }),
};
