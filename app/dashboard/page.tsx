"use client";

import { Card } from "@/components/dashboard/Card";
import { DailyTransactionBarChart } from "@/components/dashboard/chart/DailyTransactionBarChart";
import { DealStatusPieChart } from "@/components/dashboard/chart/DealStatusPieChart";
import { MonthlyDealAreaChart } from "@/components/dashboard/chart/MonthlyDealAreaChart";
import axios from "axios";
import { useEffect, useState } from "react";

type Stage = "Prospek" | "Negosiasi" | "Closing" | "Selesai";

interface Deal {
  stage: Stage;
  createdAt: string;
  value: number;
}

interface Customer {
  id: string;
  name: string;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  updatedAt: string;
  assignee?: {
    name: string;
  };
}

export default function Page() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchCustomers = await axios.get("/api/customers");
        const fetchDeals = await axios.get("/api/deals");
        const fetchTasks = await axios.get("/api/tasks/all");
        const fetchNotes = await axios.get("/api/notes");
        const fetchUser = await axios.get("/api/users/sync");

        setCustomers(fetchCustomers.data);
        setDeals(fetchDeals.data);
        setTasks(fetchTasks.data);
        setNotes(fetchNotes.data);
        setUsers(fetchUser.data);
      } catch (error) {
        console.error("Data Tidak ada:", error);
        alert("Data Tidak ada:");
      }
    };

    fetchData();
  }, []);

  // Data AreaChart
  const now = new Date();
  const dealsSelesaiBulanan = Array.from({ length: 12 }, (_, i) => {
    const total = deals.filter((deal) => {
      const date = new Date(deal.createdAt);
      return (
        deal.stage === "Selesai" &&
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === i
      );
    }).length;

    const bulan = new Date(0, i).toLocaleString("id-ID", { month: "short" });
    return { bulan, total };
  });

  const dataPenjualan = dealsSelesaiBulanan;

  // Data PieChart
  const statusDealData = [
    {
      status: "Prospek Baru",
      jumlah: deals.filter((deal) => deal.stage === "Prospek").length,
    },
    {
      status: "Negosiasi",
      jumlah: deals.filter((deal) => deal.stage === "Negosiasi").length,
    },
    {
      status: "Ditolak",
      jumlah: deals.filter((deal) => deal.stage === "Closing").length, // Asumsikan "Closing" = gagal/ditolak
    },
    {
      status: "Deal Selesai",
      jumlah: deals.filter((deal) => deal.stage === "Selesai").length,
    },
  ];

  // Data BarChart
  const getLast7Days = () => {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      days.push(day);
    }

    return days;
  };

  const days = getLast7Days();

  const aktivitasHarian = days.map((day) => {
    const dayLabel = day.toLocaleDateString("id-ID", { weekday: "short" }); // e.g., "Sen", "Sel", etc.

    const total = deals.filter((deal) => {
      const dealDate = new Date(deal.createdAt);
      return (
        dealDate.toDateString() === day.toDateString() // sama tanggal
      );
    }).length;

    return {
      hari: dayLabel,
      total,
    };
  });

  // Tugas terbaru yang telah diselesaikan
  const latestCompletedTask = tasks
    .filter((task: any) => task.completed)
    .sort(
      (a: any, b: any) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )[0];

  // Kontak/customer terbaru
  const latestCustomer = customers.sort(
    (a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];

  // Deal terbaru berdasarkan waktu dibuat
  const latestDeal = deals.sort(
    (a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];

  return (
    <>
      <div className="mx-4">
        {/* Statistik Ringkas */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
          <Card title="Total Kontak" value={customers.length.toString()} />
          <Card
            title="Prospek Aktif"
            value={deals
              .filter((deal) =>
                ["Prospek", "Negosiasi", "Closing"].includes(deal.stage)
              )
              .length.toString()}
          />
          <Card
            title="Total Deal Berhasil"
            value={deals
              .filter((deal) => deal.stage === "Selesai")
              .length.toString()}
          />
          <Card
            title="Omzet Tahun Ini"
            value={new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(
              deals
                .filter((deal) => {
                  const created = new Date(deal.createdAt);
                  const now = new Date();
                  return (
                    deal.stage === "Selesai" &&
                    created.getFullYear() === now.getFullYear()
                  );
                })
                .reduce((acc, curr) => acc + curr.value, 0)
            )}
          />
        </div>

        {/* Grafik Kiri & Status Deal */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
          {/* Kolom Kiri: Dua Grafik */}
          <div className="flex flex-col gap-4">
            <MonthlyDealAreaChart data={dataPenjualan} />

            <DailyTransactionBarChart data={aktivitasHarian} />
          </div>

          {/* Kolom Kanan: Status Deal (tinggi sama dengan dua grafik kiri) */}
          <DealStatusPieChart data={statusDealData} />
        </div>

        {/* Aktivitas & Ringkasan Penjualan */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h5 className="text-md font-semibold mb-4 text-gray-700">
              Aktivitas Terbaru
            </h5>
            <ul className="space-y-3 text-sm text-gray-700">
              {latestCompletedTask && (
                <li>
                  ✔️ Tugas "{latestCompletedTask.title}" diselesaikan oleh{" "}
                  {latestCompletedTask.assignee?.name || "Pengguna"}
                </li>
              )}
              {latestCustomer && (
                <li>📞 Kontak baru "{latestCustomer.name}" ditambahkan</li>
              )}
              {latestDeal && (
                <li>
                  📈 Deal senilai Rp
                  {latestDeal.value.toLocaleString("id-ID")} masuk tahap{" "}
                  {latestDeal.stage}
                </li>
              )}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h5 className="text-md font-semibold mb-4 text-gray-700">
              Ringkasan Penjualan
            </h5>
            <div className="text-gray-700">
              <p>
                Total deal bulan ini:{" "}
                <strong>
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(
                    deals
                      .filter((deal) => {
                        const created = new Date(deal.createdAt);
                        const now = new Date();
                        return (
                          created.getFullYear() === now.getFullYear() &&
                          created.getMonth() === now.getMonth() &&
                          deal.stage === "Selesai"
                        );
                      })
                      .reduce((acc, deal) => acc + deal.value, 0)
                  )}
                </strong>
              </p>
              <p>
                Deal berhasil:{" "}
                <strong>
                  {
                    deals.filter((deal) => {
                      const created = new Date(deal.createdAt);
                      const now = new Date();
                      return (
                        created.getFullYear() === now.getFullYear() &&
                        created.getMonth() === now.getMonth() &&
                        deal.stage === "Selesai"
                      );
                    }).length
                  }
                </strong>
              </p>
              <p>
                Dalam pipeline:{" "}
                <strong>
                  {
                    deals.filter((deal) =>
                      ["Prospek", "Negosiasi", "Closing"].includes(deal.stage)
                    ).length
                  }
                </strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
