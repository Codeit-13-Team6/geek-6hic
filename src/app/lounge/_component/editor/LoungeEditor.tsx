"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import "react-quill-new/dist/quill.snow.css";
import "./LoungeEditor.css";
import { EditorProps } from "@/types";

// hljs를 전역 객체로 등록 (Quill 내부 로직용)
if (typeof window !== "undefined") {
  window.hljs = hljs;
}

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="h-[300px] rounded-2xl bg-slate-50" />,
});

export default function LoungeEditor({
  value,
  onChange,
  placeholder,
}: EditorProps) {
  const modules = useMemo(
    () => ({
      syntax: {
        highlight: (text: string) => hljs.highlightAuto(text).value,
      },
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ "code-block": true }],
        [{ align: [] }],
      ],
    }),
    [],
  );

  return (
    <div className="quill-wrap">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
      />
    </div>
  );
}
