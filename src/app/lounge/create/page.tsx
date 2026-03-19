"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Link2, Loader2, X } from "lucide-react";
import { BtnCommon } from "@/components/ui/BtnCommon";
import LoungeEditor from "@/components/features/editor/LoungeEditor";
import { toastCommon } from "@/lib/toastCommon";
import axiosInstance from "@/lib/axios";
import { getOgData } from "@/api/og";

interface OGData {
  id: string;
  title: string;
  image: string;
  url: string;
}

export default function LoungeCreatePage() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkList, setLinkList] = useState<OGData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const TITLE_MAX_LENGTH = 30;
  // 본문 글자 수 계산 로직
  const plainText = useMemo(() => content.replace(/<[^>]*>?/gm, ""), [content]);
  const contentWithSpaces = plainText.length;
  const contentWithoutSpaces = plainText.replace(/\s/g, "").length;

  const handleFetchPreview = async () => {
    if (!linkUrl.trim())
      return toastCommon({ message: "링크를 입력해주세요.", size: "sm" });

    setIsLoading(true);
    try {
      const result = await getOgData(linkUrl);
      setLinkList((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          title: result.title || "제목 없음",
          image: result.image || "",
          url: result.url || linkUrl,
        },
      ]);
      setLinkUrl("");
    } catch (error: any) {
      console.error("OG Fetch Error:", error);

      const status = error.response?.status;
      let errorMessage = "링크 정보를 가져올 수 없습니다.";

      if (status === 403 || status === 502) {
        errorMessage = "보안 정책상 미리보기를 제공하지 않는 사이트입니다.";
        setLinkList((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            title: "미리보기를 지원하지 않는 링크",
            image: "",
            url: linkUrl,
          },
        ]);
        setLinkUrl("");
      } else if (status === 404) {
        errorMessage = "존재하지 않거나 삭제된 페이지입니다.";
      }
      toastCommon({ message: `${errorMessage}`, size: "sm" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveLink = (id: string) => {
    setLinkList((prev) => prev.filter((link) => link.id !== id));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !plainText.trim())
      return toastCommon({
        message: "제목과 내용을 모두 입력해주세요.",
        size: "sm",
      });
    setIsSubmitting(true);

    // 1. 대표 이미지 선정
    const firstLinkWithImage = linkList.find((link) => link.image);
    // 2. 추가한 링크들을 본문에 붙일 HTML로 변환
    // 단순히 주소만 적는 게 아니라 제목과 함께 클릭 가능한 링크로 만듭니다.
    const linksHtml = linkList
      .map(
        (link) =>
          `<p><a href="${link.url}" target="_blank" rel="noopener noreferrer" style="color: #10b981; text-decoration: underline;">🔗 ${link.title}</a></p>`,
      )
      .join("");

    // 3. 기존 본문 + 구분선 + 링크들
    const finalContent =
      linkList.length > 0 ? `${content}<hr/>${linksHtml}` : content;
    const postPayload = {
      title,
      content: finalContent,
      image: firstLinkWithImage ? firstLinkWithImage.image : null,
    };

    try {
      await axiosInstance.post("/posts", postPayload);
      toastCommon({ message: "게시글이 등록되었습니다.", size: "sm" });
      router.push("/lounge");
    } catch (error) {
      console.error("게시글 등록 실패:", error);
      toastCommon({ message: "게시글 등록에 실패했습니다.", size: "sm" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full pt-6 pb-20 sm:pt-10 lg:pt-[48px]">
      <div className="mx-auto w-full max-w-[860px] px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-5 flex !h-[40px] items-center justify-between gap-6 sm:mb-8 sm:!h-[50px] lg:mb-10">
          <div className="relative flex-1 pl-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={TITLE_MAX_LENGTH}
              placeholder="제목을 입력해주세요"
              className="w-full border-b-2 border-gray-300 bg-transparent pt-2 pr-11 pb-1 text-lg font-bold text-gray-900 transition-colors placeholder:text-gray-300 focus:border-green-500 focus:outline-none sm:pb-3 sm:text-2xl lg:text-3xl"
            />
            <span className="absolute right-0 bottom-2 text-sm text-gray-400 sm:bottom-4">
              <span className={title.length > 0 ? "text-green-500" : ""}>
                {title.length}
              </span>
              /{TITLE_MAX_LENGTH}
            </span>
          </div>
          <BtnCommon
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="!h-[40px] flex-0 !rounded-[12px] px-4 text-xs font-semibold disabled:bg-gray-200 sm:!h-[50px] sm:px-6 sm:text-lg"
          >
            등록
          </BtnCommon>
        </div>

        {/* 메인 카드 영역 */}
        <div className="flex min-h-[500px] flex-col rounded-[24px] bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:min-h-[600px] sm:p-6 md:p-8">
          <div className="flex-1">
            <LoungeEditor
              value={content}
              onChange={setContent}
              placeholder="본문 내용을 입력해주세요"
            />
          </div>

          {/* 링크 영역 */}
          <div className="mt-6 flex flex-col gap-2 sm:gap-3">
            <div className="flex gap-2 sm:gap-3">
              <div className="relative flex-1">
                <Link2 className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400 sm:left-4 sm:size-5" />
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="공유할 링크를 붙여넣으세요"
                  className="w-full rounded-[12px] border border-gray-200 bg-gray-50 py-2.5 pr-4 pl-9 text-sm focus:border-green-500 focus:outline-none sm:py-3 sm:pl-11"
                />
              </div>
              <button
                onClick={handleFetchPreview}
                disabled={isLoading}
                className="flex shrink-0 items-center justify-center rounded-[12px] bg-gray-800 px-3 text-sm font-medium text-white hover:bg-gray-900 disabled:bg-gray-400 sm:px-5"
              >
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin sm:size-5" />
                ) : (
                  "추가"
                )}
              </button>
            </div>

            {/* 링크 카드 리스트 */}
            <div className="mt-2 flex flex-col gap-3">
              {linkList.map((link, index) => (
                <div
                  key={link.id}
                  className={`relative flex items-center gap-3 rounded-[12px] border p-3 pr-10 transition-all sm:gap-4 sm:p-4 sm:pr-12 ${index === 0 ? "border-green-500 bg-green-50" : "border-gray-200 bg-gray-50"}`}
                >
                  <div className="relative flex size-12 shrink-0 items-center justify-center rounded-lg bg-gray-200 sm:size-16">
                    <Link2 className="absolute text-gray-400" />
                    {link.image && (
                      // Image 태그 사용 X -> Next.js의 Image 컴포넌트는 외부 이미지에 최적화되어 있지 않음
                      <img
                        src={link.image}
                        alt="thumb"
                        className="z-10 size-12 shrink-0 rounded-lg bg-gray-200 object-cover sm:size-16"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.opacity = "0";
                          // 에러 나면 투명하게해서 기본 아이콘만 보이도록 처리
                        }}
                      />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="truncate text-sm font-bold text-gray-900 sm:text-base">
                      {link.title}
                    </h4>
                    <p className="mt-0.5 truncate text-xs text-gray-500 sm:mt-1">
                      {link.url}
                    </p>
                    {index === 0 && link.image && (
                      <span className="mt-1 block text-[10px] font-bold text-green-600">
                        대표 썸네일
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveLink(link.id)}
                    className="absolute top-1/2 right-2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-500 sm:right-3"
                  >
                    <X className="size-4 sm:size-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 border-t border-gray-100 pt-4 text-right text-xs font-medium text-gray-400 sm:mt-4 sm:pt-5 sm:text-sm">
            공백포함 : {contentWithSpaces.toLocaleString()}자 | 공백제외 :{" "}
            {contentWithoutSpaces.toLocaleString()}자
          </div>
        </div>
      </div>
    </div>
  );
}
