import { NextResponse } from "next/server";
import { getShopeeAffiliateUrl } from "@/lib/affiliate/shopee.config";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const item = searchParams.get("item") || "DEFAULT_HIGH_COMMISSION";
  const slot = searchParams.get("slot") || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";

  const url = getShopeeAffiliateUrl(item);
  const timestamp = new Date().toISOString();
  console.log(`[shopee] ${timestamp} item=${item} slot=${slot} ua=${userAgent}`);

  return NextResponse.redirect(url, { status: 302 });
}
