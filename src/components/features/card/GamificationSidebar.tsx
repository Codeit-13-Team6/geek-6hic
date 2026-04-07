"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function GamificationSidebar({
  postCount = 0,
  meetingCount = 0,
  favoriteCount = 0,
  daysSinceJoin = 1,
  insight = "오늘도 즐거운 코딩 되세요! 🚀",
  isFlipped = false, // 뒤집힘 상태를 프로필 카드와 동기화하거나 내부에서 관리
}) {
  return (
    <div className="flex w-full flex-col gap-3 lg:gap-4">
      {/* 1. Grade 카드 (모바일에서는 뒤집혔을 때만 보임, 태블릿/데스크탑은 고정) */}
      <div className="relative overflow-hidden rounded-[32px] bg-[#260656] p-6 text-white shadow-lg lg:rounded-[40px]">
        <div className="absolute -right-4 -bottom-4 text-8xl font-black italic opacity-10 select-none">
          CG
        </div>
        <div className="relative z-10 mb-6 flex flex-col gap-1">
          <span className="text-[10px] font-bold tracking-[0.2em] text-white/60 uppercase">
            Sprint Grade
          </span>
          <h3 className="text-2xl font-black tracking-tighter">
            새싹 스프린터 🌱
          </h3>
        </div>
        <div className="relative z-10 flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-medium text-white/50">
              함께한 지
            </span>
            <span className="font-mono text-xl font-bold">
              {daysSinceJoin}일째
            </span>
          </div>
          <div className="rounded-xl bg-white/20 px-3 py-1.5 text-[11px] font-bold italic backdrop-blur-md">
            LV.5
          </div>
        </div>
      </div>

      {/* 2. 게이미피케이션 스탯 그리드 */}
      {/* 모바일: 2열 (Created 1줄, 나머지 2x2 2줄, 명언 1줄) */}
      {/* 태블릿/데스크탑: 4열 (Created가 상황에 따라 조정) */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-2 lg:gap-3">
        {/* Created Meetings (항상 한 줄 꽉 차게) */}
        <div className="col-span-2 flex items-center justify-between rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm md:col-span-4 lg:col-span-2">
          <div className="flex flex-col">
            <span className="mb-1 text-[11px] font-bold text-slate-400 uppercase">
              Created Meetings
            </span>
            <span className="text-2xl font-black text-slate-900">
              {meetingCount}
              <span className="ml-1 text-sm font-medium text-slate-400">
                개
              </span>
            </span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-2xl">
            🏗️
          </div>
        </div>

        {/* 나머지 4개 (모바일 2x2, 태블릿 4열 일렬, 데스크탑 2x2) */}
        {[
          {
            label: "Posts",
            val: postCount,
            icon: "✍️",
            bg: "bg-blue-50",
            text: "text-blue-600",
          },
          {
            label: "Favs",
            val: favoriteCount,
            icon: "💖",
            bg: "bg-rose-50",
            text: "text-rose-600",
          },
          {
            label: "Comments",
            val: postCount,
            icon: "🔖",
            bg: "bg-green-50",
            text: "text-green-600",
          },
          {
            label: "Parts",
            val: favoriteCount,
            icon: "👥",
            bg: "bg-yellow-50",
            text: "text-yellow-600",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-2 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm md:col-span-1"
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-xl ${item.bg} text-sm ${item.text}`}
            >
              {item.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                {item.label}
              </span>
              <span className="text-lg font-black text-slate-900">
                {item.val}
              </span>
            </div>
          </div>
        ))}

        {/* 데일리 명언 (항상 한 줄 꽉 차게) */}
        <div className="col-span-2 flex items-center gap-3 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-4 md:col-span-4 lg:col-span-2">
          <div className="flex-1 overflow-hidden">
            <p className="mb-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              Daily Insight
            </p>
            <p className="truncate text-xs font-medium text-slate-700 italic">
              "{insight}"
            </p>
          </div>
          <div className="h-2 w-2 animate-pulse rounded-full bg-[#260656]" />
        </div>
      </div>
    </div>
  );
}
