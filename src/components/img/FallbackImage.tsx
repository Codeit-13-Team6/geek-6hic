"use client";
import Image, { ImageProps } from "next/image";
import { useState } from "react";
import defaultImg from "@/assets/img/empty/img-default.png";

export default function FallbackImage({
  src,
  fallbackSrc = defaultImg,
  ...props
}: ImageProps & { fallbackSrc?: ImageProps["src"] }) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  return (
    <Image {...props} src={imgSrc} onError={() => setImgSrc(fallbackSrc)} unoptimized />
  );
}
