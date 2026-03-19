"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";
// 툴바에서 theme 사용 안 하지만 컨텐츠 부분에 사용
import "react-quill-new/dist/quill.snow.css";

// SSR 방지를 위한 다이내믹 임포트
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[300px] items-center justify-center text-gray-400">
      에디터 로딩 중...
    </div>
  ),
});

interface LoungeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function LoungeEditor({
  value,
  onChange,
  placeholder,
}: LoungeEditorProps) {
  // 툴바 설정 (ID 매칭)
  const modules = useMemo(
    () => ({
      toolbar: { container: "#custom-toolbar" },
    }),
    [],
  );

  const toolbarIconClass =
    "size-4 sm:size-5 text-gray-500 hover:text-gray-800 transition-colors";

  return (
    <div className="flex h-full flex-col">
      {/* 커스텀 툴바 */}
      <div
        id="custom-toolbar"
        className="scrollbar-hide mb-4 flex items-center justify-between overflow-x-auto border-b border-gray-200 pb-4 sm:mb-6 sm:pb-5"
      >
        <div className="flex min-w-max items-center gap-3 pr-4 sm:gap-4.5">
          <button className="ql-bold">
            <Bold className={toolbarIconClass} />
          </button>
          <button className="ql-italic">
            <Italic className={toolbarIconClass} />
          </button>
          <button className="ql-underline">
            <Underline className={toolbarIconClass} />
          </button>
          <button className="ql-strike">
            <Strikethrough className={toolbarIconClass} />
          </button>
          <div className="mx-1 h-4 w-px bg-gray-200 sm:mx-0" />
          <button className="ql-list" value="ordered">
            <ListOrdered className={toolbarIconClass} />
          </button>
          <button className="ql-list" value="bullet">
            <List className={toolbarIconClass} />
          </button>
        </div>
        <div className="flex min-w-max items-center gap-3 border-l border-gray-100 pl-4 sm:gap-4.5 sm:border-none">
          <button className="ql-align" value="">
            <AlignLeft className={toolbarIconClass} />
          </button>
          <button className="ql-align" value="center">
            <AlignCenter className={toolbarIconClass} />
          </button>
          <button className="ql-align" value="right">
            <AlignRight className={toolbarIconClass} />
          </button>
          <button className="ql-align" value="justify">
            <AlignJustify className={toolbarIconClass} />
          </button>
        </div>
      </div>

      {/* 에디터 본문 */}
      <div className="quill-custom-style relative w-full flex-1 overflow-hidden">
        <ReactQuill
          theme={null as unknown as string}
          value={value}
          onChange={onChange}
          modules={modules}
          placeholder={placeholder}
        />
        {/* 테일윈드로 제어 불가능한 스타일 */}
        <style jsx global>{`
          .quill-custom-style .ql-container.ql-snow {
            border: none !important;
            font-family: inherit;
          }
          .quill-custom-style .ql-editor {
            padding: 0 !important;
            font-size: 1rem;
            line-height: 1.7;
            min-height: 300px;
          }
          .quill-custom-style .ql-editor.ql-blank::before {
            left: 0 !important;
            color: #d1d5db !important;
            font-style: normal !important;
          }
        `}</style>
      </div>
    </div>
  );
}
