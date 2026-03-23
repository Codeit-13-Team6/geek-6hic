"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import "./LoungeEditor.css";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false, // SSR(서버 사이드 렌더링)을 비활성화
  // "use client"를 써도 넥스트는 서버가 미리 그려보게되기 때문에 아래 ssr:false 필요
  // Quill은 브라우저의 window 객체가 필요하기 때문에 서버에서 미리 그릴 경우 발생하는
  // "window is not defined" 에러를 방지하기 위한 필수 설정
  loading: () => (
    <div className="flex h-[300px] items-center justify-center text-gray-400">
      에디터 로딩 중...
    </div>
  ),
});

export default function LoungeEditor({
  value,
  onChange,
  placeholder,
}: EditorProps) {
  // 1. 모듈 설정: 그룹별로 배열을 나누면 Quill이 자동으로 .ql-formats라는 div로 감싸게 됨
  const modules = useMemo(
    () => ({
      toolbar: [
        // 1. 구조 (가장 왼쪽: 글의 뼈대를 잡는 헤딩)
        [{ header: 1 }, { header: 2 }, { header: 3 }],
        // 2. 텍스트 스타일 (가장 자주 쓰는 기본 도구)
        ["bold", "italic", "underline", "strike", "blockquote"],
        // 3. 나열 (가독성을 높여주는 리스트)
        [{ list: "ordered" }, { list: "bullet" }],
        // 4. 특수 기능 (개발 관련이나 강조용 코드)
        ["code", "code-block"],
        // 5. 레이아웃 (우측 끝: 전체적인 정렬 설정)
        [{ align: "" }, { align: "center" }, { align: "right" }],
      ],
    }),
    [],
  );

  // 2. 사용될 포맷 옵션들
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code",
    "code-block",
    "list",
    "align",
  ];

  return (
    <div className="quill-wrap">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
}
