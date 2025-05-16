"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "../ChartCard";
import { CustomTooltip } from "./CustomTooltip";

interface MonthlyDealAreaChartProps {
  data: {
    bulan: string;
    total: number;
  }[];
  title?: string;
}

export const MonthlyDealAreaChart = ({ data }: MonthlyDealAreaChartProps) => {
  return (
    <ChartCard title="Grafik Data Penjualan Bulanan">
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 20, left: -30, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366F1" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
            </linearGradient>
          </defs>

          <Area
            type="monotone"
            dataKey="total"
            stroke="#6366F1"
            strokeWidth={3}
            fill="url(#colorTotal)"
          />
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis
            dataKey="bulan"
            tick={{ fontSize: 14, fill: "#4B5563", fontWeight: 500 }}
          />
          <YAxis tick={{ fontSize: 14, fill: "#4B5563", fontWeight: 500 }} />
          <Tooltip content={CustomTooltip} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};
