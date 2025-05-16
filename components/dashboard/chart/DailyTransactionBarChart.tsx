import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "../ChartCard";
import { CustomTooltip } from "./CustomTooltip";

interface DailyTransactionBarChartProps {
  data: {
    hari: string;
    total: number;
  }[];
}

export const DailyTransactionBarChart = ({
  data,
}: DailyTransactionBarChartProps) => {
  return (
    <ChartCard title="Aktivitas Transaksi Harian">
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, left: -30, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="hari"
            tick={{ fontSize: 14, fill: "#4B5563", fontWeight: 500 }}
          />
          <YAxis tick={{ fontSize: 14, fill: "#4B5563", fontWeight: 500 }} />
          <Tooltip content={CustomTooltip} />
          <Bar dataKey="total" fill="#6366F1" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};
