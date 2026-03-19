"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { GripVertical, ImageIcon, Link2, Loader2, X } from "lucide-react";
import { BtnCommon } from "@/components/ui/BtnCommon";
import LoungeEditor from "@/components/features/editor/LoungeEditor";
import { toastCommon } from "@/lib/toastCommon";
import axiosInstance from "@/lib/axios";
import { useLoungeLink } from "@/hooks/useLoungeLink";
import LoungeLinkItem from "@/components/features/card/LinkCard";

interface PostPayload {
  title: string;
  content: string;
  image?: string;
}

export default function LoungeCreatePage() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  // 링크 커스텀 훅 (모든 링크 로직 위임)
  const {
    linkList,
    thumbnailImage,
    isLoading,
    draggingIndex,
    addLink,
    removeLink,
    selectThumbnail,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useLoungeLink();

  const TITLE_MAX_LENGTH = 30;

  // 본문 글자 수 계산 최적화 (useMemo 사용)
  const plainText = useMemo(() => {
    return content.replace(/<[^>]*>?/gm, "").trim();
  }, [content]);
  const contentWithSpaces = plainText.length;
  const contentWithoutSpaces = plainText.replace(/\s/g, "").length;

  // 링크 추가 버튼 클릭 핸들러
  const handleAddLinkAction = async () => {
    // 훅의 addLink 호출 후 성공하면 입력창 초기화
    const isSuccessed = await addLink(linkUrl);
    if (isSuccessed) setLinkUrl("");
  };

  // 게시글 등록 제출 핸들러
  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    const trimmedContentText = plainText.trim();

    if (!trimmedTitle || !trimmedContentText) {
      return toastCommon({
        message: "제목과 내용을 모두 입력해주세요.",
        size: "sm",
      });
    }

    setIsSubmitting(true);

    // 추가한 링크들을 본문에 붙일 HTML로 변환 (.join("") 피드백 반영)
    const linksHtml = linkList
      .map(
        (link) =>
          `<p><a href="${link.url}" target="_blank" rel="noopener noreferrer" style="color: #10b981; text-decoration: underline;">🔗 ${link.title}</a></p>`,
      )
      .join("");

    // 기존 본문 + 구분선(<hr/>) + 링크들
    const finalContent =
      linkList.length > 0 ? `${content}<hr/>${linksHtml}` : content;

    const postPayload: PostPayload = {
      title: trimmedTitle,
      content: finalContent,
    };

    // 썸네일 이미지가 있을 때만 image 필드 추가
    if (thumbnailImage && thumbnailImage.trim() !== "") {
      postPayload.image = thumbnailImage;
    }

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
        {/* 헤더 영역 */}
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
          {/* 에디터 영역 */}
          <div className="flex-1">
            <LoungeEditor
              value={content}
              onChange={setContent}
              placeholder="본문 내용을 입력해주세요"
            />
          </div>

          {/* 링크 입력 영역 */}
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
                onClick={handleAddLinkAction}
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
                <LoungeLinkItem
                  key={link.id}
                  link={link}
                  index={index}
                  isThumbnail={link.image === thumbnailImage}
                  isDragging={draggingIndex === index}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  onSelect={selectThumbnail}
                  onRemove={removeLink}
                />
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
