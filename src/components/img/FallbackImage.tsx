"use client";
import Image, { ImageProps, StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import defaultMeetingImg from "@/assets/img/fallback/fallback-meeting-02.png";
import defaultPostImg from "@/assets/img/fallback/fallback-post-01.webp";
import defaultUserImg from "@/assets/img/fallback/fallback-user.png";

type FallbackImageType = "meeting" | "post" | "user";

interface FallbackImageProps extends Omit<ImageProps, "src"> {
  src?: string | null; // null 받을 수 있도록 허용
  type?: FallbackImageType;
  fallbackSrc?: ImageProps["src"];
}

const FALLBACK_MAP: Record<FallbackImageType, StaticImageData> = {
  meeting: defaultMeetingImg,
  post: defaultPostImg,
  user: defaultUserImg,
};

export default function FallbackImage({
  src,
  type = "meeting",
  fallbackSrc,
  ...props
}: FallbackImageProps) {
  const targetFallback = fallbackSrc || FALLBACK_MAP[type];
  const [imgSrc, setImgSrc] = useState(src || targetFallback);

  useEffect(() => {
    setImgSrc(src || targetFallback);
  }, [src, targetFallback]);

  return (
    <Image
      {...props}
      alt={props.alt || `${type} 기본 이미지`}
      src={imgSrc as string}
      onError={() => setImgSrc(targetFallback)}
      unoptimized
    />
  );
}
