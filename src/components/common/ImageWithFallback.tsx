"use client";

import { useEffect, useState } from "react";
import Image, { type ImageProps } from "next/image";

type ImageWithFallbackProps = Omit<ImageProps, "src"> & {
  src: string;
  fallbackSrc?: string;
};

const DEFAULT_FALLBACK = "/placeholder-poster.svg";

const ImageWithFallback = ({
  src,
  fallbackSrc = DEFAULT_FALLBACK,
  onError,
  ...props
}: ImageWithFallbackProps) => {
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  return (
    <Image
      {...props}
      src={currentSrc}
      onError={(event) => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
        onError?.(event);
      }}
    />
  );
};

export default ImageWithFallback;
