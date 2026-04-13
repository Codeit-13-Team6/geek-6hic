"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import "react-quill-new/dist/quill.snow.css";
import "./LoungeEditor.css";
import { EditorProps } from "@/types";
declare global {
  interface Window {
    hljs: typeof hljs;
  }
}

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="h-[300px] rounded-2xl bg-slate-50" />,
});

const quillModules = {
  syntax: {
    highlight: (text: string) => hljs.highlightAuto(text).value,
  },
  toolbar: [
    [{ header: 1 }, { header: 2 }, { header: 3 }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["code", { "code-block": true }],
    [{ align: "" }, { align: "center" }, { align: "right" }],
  ],
};

export default function LoungeEditor({
  value,
  onChange,
  placeholder,
}: EditorProps) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.hljs = hljs;
    }
  }, []);

  return (
    <div className="quill-wrap">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={(val) => {
          console.log("HTML:", val);
      
          const plainText = val.replace(/<[^>]*>?/gm, "");
          console.log("텍스트 길이:", plainText.length);
      
          onChange(val);
        }}
        modules={quillModules}
        placeholder={placeholder}
      />
    </div>
  );
}
