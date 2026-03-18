"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link2,
  Image as ImageIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";

import { BtnCommon } from "@/components/ui/BtnCommon";

export default function LoungeCreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const TITLE_MAX_LENGTH = 30;

  const titleLength = title.length;
  const contentWithSpaces = content.length;
  const contentWithoutSpaces = content.replace(/\s/g, "").length;

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }
    // TODO: API 연동 로직 (POST /posts)
    // 성공 시 이동: router.push("/lounge");
  };

  const toolbarIconClass =
    "size-4 sm:size-5 text-gray-500 hover:text-gray-900 cursor-pointer transition-colors";

  return (
    <div className="min-h-screen w-full pt-6 pb-20 sm:pt-10 lg:pt-[48px]">
      <div className="mx-auto w-full max-w-[860px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex !h-[40px] items-center justify-between gap-6 sm:!h-[50px] lg:mb-10">
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
              <span className={titleLength > 0 ? "text-green-500" : ""}>
                {titleLength}
              </span>
              /{TITLE_MAX_LENGTH}
            </span>
          </div>

          <BtnCommon
            onClick={handleSubmit}
            className="!h-[40px] flex-0 !rounded-[12px] px-4 text-sm font-semibold sm:!h-[50px] sm:px-8 sm:text-lg"
          >
            등록
          </BtnCommon>
        </div>

        <div className="flex min-h-[500px] flex-col rounded-[24px] bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:min-h-[600px] sm:p-6 md:p-8">
          <div className="scrollbar-hide mb-4 flex items-center justify-between overflow-x-auto border-b border-gray-200 pb-4 sm:mb-6 sm:pb-5">
            <div className="flex min-w-max items-center gap-3 pr-4 sm:gap-4.5">
              <Bold className={toolbarIconClass} />
              <Italic className={toolbarIconClass} />
              <Underline className={toolbarIconClass} />
              <Strikethrough className={toolbarIconClass} />
              <div className="mx-1 h-4 w-px bg-gray-200 sm:mx-0" />{" "}
              <Link2 className={toolbarIconClass} />
              <ImageIcon className={toolbarIconClass} />
              <div className="mx-1 h-4 w-px bg-gray-200 sm:mx-0" />{" "}
              <ListOrdered className={toolbarIconClass} />
              <List className={toolbarIconClass} />
            </div>

            <div className="flex min-w-max items-center gap-3 border-l border-gray-100 pl-4 sm:gap-4.5 sm:border-none">
              <AlignLeft className={toolbarIconClass} />
              <AlignCenter className={toolbarIconClass} />
              <AlignRight className={toolbarIconClass} />
              <AlignJustify className={toolbarIconClass} />
            </div>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="본문 내용을 입력해주세요"
            className="w-full flex-1 resize-none text-base leading-relaxed text-gray-800 placeholder:text-gray-300 focus:outline-none"
          />

          <div className="mt-6 border-t border-gray-100 pt-5 text-right text-sm font-medium text-gray-500">
            공백포함 : 총 {contentWithSpaces.toLocaleString()}자 | 공백제외 : 총{" "}
            {contentWithoutSpaces.toLocaleString()}자
          </div>
        </div>
      </div>
    </div>
  );
}
