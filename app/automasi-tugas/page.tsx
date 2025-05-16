"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

type Automation = {
  id: number;
  name: string;
  trigger: string;
  action: string;
  active: boolean;
};

const initialAutomations: Automation[] = [
  {
    id: 1,
    name: "Follow-up Kontak Baru",
    trigger: "Saat kontak ditambahkan",
    action: "Kirim email follow-up dalam 3 hari",
    active: true,
  },
  {
    id: 2,
    name: "Tugas Reminder Penawaran",
    trigger: "Saat prospek masuk tahap 'Negosiasi'",
    action: "Buat tugas reminder 2 hari setelah",
    active: false,
  },
];

export default function AutomationPage() {
  const [automations] = useState<Automation[]>(initialAutomations);

  return (
    <>
      <Sidebar />
      <main className="min-h-screen bg-gray-50 text-gray-800">
        {/* Navbar */}

        {/* Header */}
        <section className="px-6 py-10 max-w-6xl mx-auto">
          <div className="flex justify-end items-center mb-6">
            <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
              + Tambah Automasi
            </button>
          </div>

          {/* List Automasi */}
          <div className="space-y-4">
            {automations.map((auto) => (
              <div
                key={auto.id}
                className="bg-white rounded shadow p-4 flex justify-between items-start"
              >
                <div>
                  <h2 className="text-lg font-semibold">{auto.name}</h2>
                  <p className="text-sm text-gray-600">
                    🧲 Trigger: <span className="italic">{auto.trigger}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    ⚙️ Aksi: <span className="italic">{auto.action}</span>
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                      auto.active
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {auto.active ? "Aktif" : "Nonaktif"}
                  </span>
                  <button className="text-sm text-blue-600 hover:underline">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
