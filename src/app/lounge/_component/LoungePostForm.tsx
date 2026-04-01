"use client";

import { useMemo, useState, useEffect } from "react";
import { Link2, Loader2 } from "lucide-react";
import { BtnCommon } from "@/components/ui/BtnCommon";
import LoungeEditor from "@/app/lounge/_component/editor/LoungeEditor";
import { ToastCommon } from "@/components/ui/ToastCommon";
import { useLoungeLink } from "@/hooks/useLoungeLink";
import LinkCard from "@/app/lounge/_component/LinkCard";
import { stitchPostData } from "@/lib/contentLinkUtils";
import { PostPayload, LoungePostFormProps } from "@/types";

export default function LoungePostForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitButtonText = "등록",
}: LoungePostFormProps) {
  const TITLE_MAX_LENGTH = 30;

  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
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
    setLinkList,
    setThumbnailImage,
  } = useLoungeLink();

  useEffect(() => {
    if (initialData?.links && initialData.links.length > 0) {
      setLinkList(initialData.links);
    }
    if (initialData?.image) {
      setThumbnailImage(initialData.image);
    }
  }, [initialData, setLinkList, setThumbnailImage]);

  // 글자 수 계산
  const plainText = useMemo(() => {
    if (!content) return "";

    const text = content.replace(/<[^>]*>?/gm, "");
    const entities: { [key: string]: string } = {
      "&nbsp;": " ",
      "&lt;": "<",
      "&gt;": ">",
      "&amp;": "&",
      "&quot;": '"',
      "&#39;": "'",
    };
    return text.replace(/&[a-z0-9#]+;/gi, (match) => entities[match] || " ");
  }, [content]);

  const contentWithSpaces = plainText.length;
  const contentWithoutSpaces = plainText.replace(/\s/g, "").length;

  const handleAddLinkAction = async () => {
    const isSuccessed = await addLink(linkUrl);
    if (isSuccessed) setLinkUrl("");
  };

  // 게시물 제출 핸들러 (유틸 함수로 합친 뒤 부모에게 전달)
  const handleLocalSubmit = () => {
    const trimmedTitle = title.trim();
    const trimmedContentText = plainText.trim();

    if (!trimmedTitle ) {
      return ToastCommon({
        message: "제목을 입력해주세요.",
        size: "sm",
      });
    }

    if (linkList.length === 0 && trimmedContentText.length === 0) {
      return ToastCommon({
        message: "본문 내용 또는 링크를 입력해주세요",
        size: "sm",
      });
    }

    const finalHtml = stitchPostData(content, linkList);

    const payload: PostPayload = {
      title: trimmedTitle,
      content: finalHtml,
    };

    if (thumbnailImage && thumbnailImage.trim() !== "") {
      payload.image = thumbnailImage;
    }

    onSubmit(payload);
  };

  return (
    <div className="min-h-screen w-full pt-6 pb-20 sm:pt-10 lg:pt-[48px]">
      <div className="mx-auto w-full max-w-[900px] px-4 sm:px-6 lg:px-8">
        {/* 헤더 (제목 입력 & 등록 버튼) */}
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
            onClick={handleLocalSubmit}
            disabled={isSubmitting}
            className="!h-[40px]  flex-0 !rounded-[12px] px-4 text-xs font-semibold disabled:bg-gray-200 sm:!h-[50px] sm:px-6 sm:text-lg"
          >
            {submitButtonText}
          </BtnCommon>
        </div>

        {/* 메인 카드 영역 */}
        <div className="flex min-h-[500px] flex-col rounded-[24px] bg-white p-4 pt-3 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:min-h-[600px] sm:p-6 sm:pt-4 md:p-8 md:pt-5">
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
                <LinkCard
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
