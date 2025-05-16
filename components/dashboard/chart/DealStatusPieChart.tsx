"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartCard } from "../ChartCard";
import { CustomTooltip } from "./CustomTooltip";

// const COLORS = [
//   "oklch(0.6 0.118 184.704)",
//   "oklch(0.785 0.115 274.713)",
//   "oklch(0.444 0.177 26.899)",
//   "oklch(0.457 0.24 277.023)",
// ];

const COLORS = [
  "oklch(0.87 0.065 274.039)",
  "oklch(0.673 0.182 276.935)",
  "oklch(0.398 0.195 277.366)",
  "oklch(0.257 0.09 281.288)",
];

interface DealStatusPieChartProps {
  data: {
    status: string;
    jumlah: number;
  }[];
}

export const DealStatusPieChart = ({ data }: DealStatusPieChartProps) => {
  return (
    <div className="col-span-1 xl:col-span-1 h-full">
      <ChartCard title="Status Deal" customHeight="h-[416px]">
        <div className="flex flex-row text-gray-700 gap-4 text-sm">
          <div className="flex flex-row items-center gap-1">
            <p>Prospek Baru</p>
            <div className="w-3 h-3 rounded-full bg-indigo-100"></div>
          </div>

          <div className="flex flex-row items-center gap-1">
            <p>Negosiasi</p>
            <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
          </div>

          <div className="flex flex-row items-center gap-1">
            <p>Closing</p>
            <div className="w-3 h-3 rounded-full bg-indigo-700"></div>
          </div>

          <div className="flex flex-row items-center gap-1">
            <p>Deal Selesai</p>
            <div className="w-3 h-3 rounded-full bg-indigo-900"></div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: -50, right: 0, left: 0, bottom: 5 }}>
            <Pie
              data={data}
              dataKey="jumlah"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={CustomTooltip} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};
