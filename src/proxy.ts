import { NextResponse, type NextRequest } from "next/server";
import { getRemovedSlugs } from "@/content/catalog";
import { getBasePath } from "@/lib/seo/urls";

const removedSlugs = new Set(getRemovedSlugs());
const basePath = getBasePath();

const applySecurityHeaders = (response: NextResponse) => {
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
  );
};

const stripBasePath = (pathname: string) => {
  if (!basePath || basePath === "/" || basePath === "") return pathname;
  if (pathname.startsWith(basePath)) {
    const stripped = pathname.slice(basePath.length);
    return stripped.length === 0 ? "/" : stripped;
  }
  return pathname;
};

export function proxy(request: NextRequest) {
  const normalizedPath = stripBasePath(request.nextUrl.pathname);

  if (normalizedPath.startsWith("/detail/")) {
    const slug = decodeURIComponent(normalizedPath.replace("/detail/", "").split("/")[0]);
    if (removedSlugs.has(slug)) {
      const response = new NextResponse("Gone", { status: 410 });
      applySecurityHeaders(response);
      return response;
    }
  }

  const response = NextResponse.next();
  applySecurityHeaders(response);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
