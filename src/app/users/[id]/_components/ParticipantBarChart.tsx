"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// 도넛 차트와 완전히 동일한 브랜드 컬러 유지
const chartConfig = {
  visitors: { label: "참여자 수" },
  team: { label: "팀미팅", color: "#06b6d4" },
  study: { label: "스터디", color: "#6366f1" },
  project: { label: "프로젝트", color: "#a855f7" },
  jobPrep: { label: "취준생", color: "#f43f5e" },
  etc: { label: "기타", color: "#94a3b8" },
} satisfies ChartConfig;

interface ParticipantBarChartProps {
  stats: {
    team?: number;
    study?: number;
    project?: number;
    jobPrep?: number;
    etc?: number;
  };
}

export function ParticipantBarChart({ stats }: ParticipantBarChartProps) {
  const chartData = React.useMemo(() => {
    // ✨ 정렬(sort)을 빼고, 원하시는 순서대로 배열을 고정했습니다.
    return [
      {
        type: "team",
        label: "팀미팅",
        visitors: stats.team || 0,
        fill: "var(--color-team)",
      },
      {
        type: "study",
        label: "스터디",
        visitors: stats.study || 0,
        fill: "var(--color-study)",
      },
      {
        type: "project",
        label: "프로젝트",
        visitors: stats.project || 0,
        fill: "var(--color-project)",
      },
      {
        type: "jobPrep",
        label: "취준생",
        visitors: stats.jobPrep || 0,
        fill: "var(--color-jobPrep)",
      },
      {
        type: "etc",
        label: "기타",
        visitors: stats.etc || 0,
        fill: "var(--color-etc)",
      },
    ];
  }, [stats]);

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <BarChart
        data={chartData}
        // ✨ 라벨이 없으므로 마진을 최소화해서 아래 박스와 밀착시킵니다.
        margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
      >
        <CartesianGrid horizontal={false} vertical={false} />

        {/* ✨ X축과 Y축의 모든 텍스트/선을 지워 차트 자체만 남깁니다. */}
        <XAxis hide />
        <YAxis hide />

        <ChartTooltip
          cursor={{ fill: "rgba(241, 245, 249, 0.5)" }}
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(value) => `${value}명`}
            />
          }
        />

        <Bar dataKey="visitors" radius={[4, 4, 4, 4]} barSize={18}></Bar>
      </BarChart>
    </ChartContainer>
  );
}
