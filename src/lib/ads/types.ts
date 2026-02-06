export type AdSlotName = "HEADER" | "BELOW_PLAYER_NATIVE" | "INFEED_NATIVE";

export type AdVariant = "A" | "B";

export type AdKeySet = {
  A: string[];
  B: string[];
};

export type AdSize = {
  width: number;
  height: number;
};

export type AdSlotConfig = {
  slot: AdSlotName;
  provider: "adsterra";
  label?: string;
  minHeight: number;
  placement: string;
  keys: AdKeySet;
  responsive?: {
    breakpoint: number;
    desktop: AdSize;
    mobile: AdSize;
    desktopKeys?: AdKeySet;
    mobileKeys?: AdKeySet;
  };
  capTtlMs?: number;
};

export type AdSystemConfig = {
  enabled: boolean;
  providerEnabled: boolean;
  basePath: string;
  slots: Record<AdSlotName, AdSlotConfig>;
};
