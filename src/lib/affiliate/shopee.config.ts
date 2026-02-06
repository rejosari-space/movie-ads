import type { ShopeeAffiliateConfig } from "./types";

export const SHOPEE_AFFILIATES: ShopeeAffiliateConfig = {
  DEFAULT_HIGH_COMMISSION: {
    id: "DEFAULT_HIGH_COMMISSION",
    url: "https://shope.ee/5fF9wXkW2a",
  },
  FALLBACK_SHOP: {
    id: "FALLBACK_SHOP",
    url: "https://shope.ee/8pQ7RzKx3b",
  },
};

export const getShopeeAffiliateUrl = (itemId?: string | null) => {
  if (!itemId) return SHOPEE_AFFILIATES.FALLBACK_SHOP.url;
  const item = SHOPEE_AFFILIATES[itemId];
  return item?.url || SHOPEE_AFFILIATES.FALLBACK_SHOP.url;
};
