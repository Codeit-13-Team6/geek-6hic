"use client";

import { useState, useEffect, useRef } from "react";
import { Link2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import LoungeEditor from "@/app/lounge/_components/editor/LoungeEditor";
import { Toast } from "@/components/ui/Toast";
import { useLoungeLink } from "@/app/lounge/_hooks/useLoungeLink";
import LinkCard from "@/app/lounge/_components/LinkCard";
import { parsePostData, stitchPostData } from "@/lib/contentLinkUtils";
import { decodeHtmlEntities } from "@/lib/decodeHtmlEntities";
import { PostPayload, LoungePostFormProps } from "@/types";
import { BtnBack } from "@/components/ui/BtnBack";

export default function LoungePostForm({
  id,
  initialData,
  onSubmit,
  isSubmitting,
  submitButtonText = "등록",
}: LoungePostFormProps) {
  "use memo";

  const TITLE_MAX_LENGTH = 30;
  const POST_HTML_MAX_LENGTH  = 50000;
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [linkUrl, setLinkUrl] = useState("");
  const isSubmittingRef = useRef(false);

  // isSubmitting(isPending)이 false로 돌아오면 ref도 함께 초기화
  useEffect(() => {
    if (!isSubmitting) {
      isSubmittingRef.current = false;
    }
  }, [isSubmitting]);

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

  const { content: parsedContent, links: parsedLinks } = parsePostData(
    String(initialData?.content),
  );

  // 글자 수 계산
  const plainText = (() => {
    if (!content) return "";

    const text = content.replace(/<[^>]*>?/gm, "");
    return decodeHtmlEntities(text);
  })();

  const contentWithSpaces = plainText.length;
  const contentWithoutSpaces = plainText.replace(/\s/g, "").length;

  const handleAddLinkAction = async () => {
    const isSuccessed = await addLink(linkUrl);
    if (isSuccessed) setLinkUrl("");
  };

  const finalHtml = stitchPostData(content, linkList);

  // 게시물 제출 핸들러 (유틸 함수로 합친 뒤 부모에게 전달)
  const handleLocalSubmit = () => {
    if (isSubmittingRef.current) return;

    const trimmedTitle = title.trim();
    const trimmedContentText = plainText.trim();

    if (!trimmedTitle) {
      return Toast({
        message: "제목을 입력해주세요.",
        type: "info",
      });
    }

    if (linkList.length === 0 && trimmedContentText.length === 0) {
      return Toast({
        message: "본문 내용 또는 링크를 입력해주세요",
        type: "info",
      });
    }

    if (finalHtml.length > POST_HTML_MAX_LENGTH) {
      return Toast({
        message: "게시글 최대 입력수를 초과하였습니다.",
        type: "error",
      });
    }

    if (linkUrl.trim().length > 0) {
      return Toast({
        message: (
          <>
            입력하신 링크가 추가되지 않았습니다.
            <br />
            링크 추가 버튼을 눌러주세요!
          </>
        ),
        type: "info",
        duration: 3500,
      });
    }

    const payload: PostPayload = {
      title: trimmedTitle,
      content: finalHtml,
    };

    if (thumbnailImage && thumbnailImage.trim() !== "") {
      payload.image = thumbnailImage;
    }

    isSubmittingRef.current = true;
    onSubmit(payload);
  };

  useEffect(() => {
    if (!initialData) return;
    setContent(parsedContent);
    setLinkList(
      initialData.links?.length ? initialData.links : (parsedLinks ?? []),
    );

    if (initialData.image) {
      setThumbnailImage(initialData.image);
    }
  }, [initialData, parsedContent, parsedLinks, setLinkList, setThumbnailImage]);

  return (
    <div className="mx-auto w-full max-w-[900px] px-6 py-10 2xl:px-0">
      {/* 헤더 (제목 입력 & 등록 버튼) */}
      <BtnBack fallbackHref={`/lounge/${id}`} />

      <div className="mb-5 flex !h-[40px] items-center justify-between gap-6 sm:mb-8 sm:!h-[50px] lg:mb-10">
        <div className="relative flex-1 pl-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={TITLE_MAX_LENGTH}
            placeholder="제목을 입력해주세요"
            className="focus:border-main-purple w-full border-b-2 border-gray-300 bg-transparent pt-2 pr-11 pb-1 text-lg font-bold text-gray-900 transition-colors placeholder:text-gray-300 focus:outline-none sm:pb-3 sm:text-2xl lg:text-3xl"
          />
          <span className="absolute right-0 bottom-2 text-sm text-gray-400 sm:bottom-4">
            <span className={title.length > 0 ? "text-main-purple" : ""}>
              {title.length}
            </span>
            /{TITLE_MAX_LENGTH}
          </span>
        </div>
        <Button
          onClick={handleLocalSubmit}
          disabled={isSubmitting}
          className="!h-[40px] flex-0 !rounded-[12px] px-4 text-xs font-semibold disabled:bg-gray-200 sm:!h-[50px] sm:px-6 sm:text-lg"
        >
          {submitButtonText}
        </Button>
      </div>

      {/* 메인 카드 영역 */}
      <div className="flex min-h-[500px] flex-col rounded-[24px] bg-white p-8 pt-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:min-h-[600px] sm:px-10 lg:px-14 lg:pb-12">
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
                className="focus:border-main-purple w-full rounded-[12px] border border-gray-200 bg-gray-50 py-2.5 pr-4 pl-9 text-sm focus:outline-none sm:py-3 sm:pl-11"
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
        {/* <div className="mt-5 border-t border-gray-100 pt-4 text-right text-xs font-medium sm:mt-4 sm:pt-5 sm:text-sm">
          <span
            className={
              contentWithoutSpaces > CONTENT_MAX_LENGTH
                ? "text-red-500"
                : "text-gray-400"
            }
          >
            공백제외 : {contentWithoutSpaces.toLocaleString()} / {CONTENT_MAX_LENGTH}자
          </span>
        </div> */}
      </div>
    </div>
  );
}
