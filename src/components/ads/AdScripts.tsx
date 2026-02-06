import Script from "next/script";
import { AD_CONFIG } from "@/lib/ads/config";

const adsterraScriptSrc = process.env.NEXT_PUBLIC_ADSTERRA_SCRIPT_SRC;

const AdScripts = () => {
  if (!AD_CONFIG.enabled || !AD_CONFIG.providerEnabled) return null;
  if (!adsterraScriptSrc) return null;

  return (
    <Script
      id="adsterra-loader"
      src={adsterraScriptSrc}
      strategy="afterInteractive"
    />
  );
};

export default AdScripts;
