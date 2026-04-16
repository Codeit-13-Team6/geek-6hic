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
} from "@/components/ui/Chart";

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
        margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
      >
        <CartesianGrid horizontal={false} vertical={false} />

        <XAxis hide />
        <YAxis hide />

        <ChartTooltip
          cursor={{ fill: "rgba(241, 245, 249, 0.6)", radius: 4 }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="flex items-center gap-3 rounded-[16px] border border-slate-100 bg-white/95 px-3 py-2 shadow-[0_10px_25px_rgba(0,0,0,0.08)] backdrop-blur-sm">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: data.fill }}
                  />
                  <span className="text-[13px] font-semibold text-slate-600">
                    {data.label}
                  </span>
                  <span
                    className="text-[14px] font-black"
                    style={{ color: data.fill }}
                  >
                    {data.visitors}명
                  </span>
                </div>
              );
            }
            return null;
          }}
        />

        <Bar dataKey="visitors" radius={[4, 4, 4, 4]} barSize={18}></Bar>
      </BarChart>
    </ChartContainer>
  );
}
