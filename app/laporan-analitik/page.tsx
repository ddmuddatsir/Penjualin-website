"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getISOWeek, format } from "date-fns";

type SalesItem = {
  period: string;
  sales: number;
};

type ConversionItem = {
  stage: string;
  count: number;
};

type Stage = "Prospek" | "Negosiasi" | "Closing" | "Selesai";

export default function ReportPage() {
  const [filter, setFilter] = useState("bulan");
  const [salesData, setSalesData] = useState<SalesItem[]>([]);
  const [conversionData, setConversionData] = useState<ConversionItem[]>([]);
  const [summary, setSummary] = useState({
    revenue: 0,
    newProspects: 0,
    successfulDeals: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resDeals, resCustomers] = await Promise.all([
          axios.get("/api/deals"),
          axios.get("/api/customers"),
        ]);

        const deals = resDeals.data || [];
        const customers = resCustomers.data || [];

        const groupedSales = new Map();
        const conversionStages: Record<Stage, number> = {
          Prospek: 0,
          Negosiasi: 0,
          Closing: 0,
          Selesai: 0,
        };

        let totalRevenue = 0;
        let dealCount = 0;

        for (const deal of deals) {
          const rawStage: any = deal.stage || "Prospek";
          const createdAt = new Date(deal.createdAt);
          const value = deal.value || 0;

          let key;
          switch (filter) {
            case "minggu":
              const week = getISOWeek(createdAt);
              key = `${createdAt.getFullYear()}-W${week}`;
              break;
            case "tahun":
              key = `${createdAt.getFullYear()}`;
              break;
            case "bulan":
            default:
              key = createdAt.toLocaleString("default", { month: "short" });
              break;
          }

          if (rawStage === "Selesai") {
            groupedSales.set(key, (groupedSales.get(key) || 0) + value);
            totalRevenue += value;
            dealCount++;
          }

          // Validasi agar rawStage hanya bisa Stage
          if (
            ["Prospek", "Negosiasi", "Closing", "Selesai"].includes(rawStage)
          ) {
            conversionStages[rawStage as Stage]++;
          }
        }

        const salesArray = Array.from(groupedSales.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([period, sales]) => ({ period, sales }));

        const conversionArray = Object.entries(conversionStages).map(
          ([stage, count]) => ({ stage, count })
        );

        setSalesData(salesArray);
        setConversionData(conversionArray);
        setSummary({
          revenue: totalRevenue,
          newProspects: customers.length,
          successfulDeals: dealCount,
        });
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      }
    };

    fetchData();
  }, [filter]);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      <section className="px-6 py-10 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            <option value="minggu">Mingguan</option>
            <option value="bulan">Bulanan</option>
            <option value="tahun">Tahunan</option>
          </select>
        </div>

        {/* Grafik Penjualan */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">
            Total Penjualan (Deal Selesai)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis tickFormatter={(v) => `Rp${v / 1000}k`} />
              <Tooltip
                formatter={(value) => [
                  `Rp${value.toLocaleString()}`,
                  "Penjualan",
                ]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#6366f1"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Konversi Pipeline */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Konversi Pipeline</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Statistik Ringkasan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-50 p-4 rounded-lg shadow text-center">
            <h3 className="text-sm text-gray-500">Pendapatan Total</h3>
            <p className="text-2xl font-bold text-indigo-700">
              Rp {summary.revenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow text-center">
            <h3 className="text-sm text-gray-500">Prospek Baru</h3>
            <p className="text-2xl font-bold text-green-700">
              {summary.newProspects}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow text-center">
            <h3 className="text-sm text-gray-500">Kesepakatan Berhasil</h3>
            <p className="text-2xl font-bold text-yellow-700">
              {summary.successfulDeals}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
