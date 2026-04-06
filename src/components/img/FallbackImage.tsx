"use client";
import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";
import defaultImg from "@/assets/img/empty/img-default.png";

export default function FallbackImage({
  src,
  fallbackSrc = defaultImg,
  ...props
}: ImageProps & { fallbackSrc?: ImageProps["src"] }) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  // src prop이 바뀌면 내부 state도 새 값으로 동기화한다.
  // (예: 모임 수정으로 이미지가 변경되어 부모가 새 src를 내려줄 때)
  useEffect(() => {
    setImgSrc(src || fallbackSrc);
  }, [src, fallbackSrc]);

  return (
    <Image {...props} alt={props.alt || 'fallback'} src={imgSrc} onError={() => setImgSrc(fallbackSrc)} unoptimized />
  );
}
