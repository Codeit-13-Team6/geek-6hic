"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function FlipWrapper({
  children,
}: {
  children: [React.ReactNode, React.ReactNode]; // 프로필, Grade 카드 두 개를 받음
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative h-fit w-full cursor-pointer md:cursor-default"
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ perspective: "1200px" }}
    >
      <motion.div
        className="relative w-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, bounce: 0, type: "spring" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* 앞면: 프로필 (모바일 전용) */}
        <div style={{ backfaceVisibility: "hidden" }} className="md:hidden">
          {children[0]}
        </div>

        {/* 뒷면: Grade (모바일 전용) */}
        <div
          className="absolute top-0 left-0 w-full md:hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {children[1]}
        </div>

        {/* 태블릿/데스크탑: 뒤집기 없이 나란히 혹은 위아래로 배치 (애니메이션 영향 X) */}
        <div className="hidden md:flex md:flex-col md:gap-4 lg:block">
          <div className="md:flex md:gap-4 lg:block">
            <div className="md:flex-1 lg:w-full">{children[0]}</div>
            <div className="md:flex-1 lg:mt-4 lg:w-full">{children[1]}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
