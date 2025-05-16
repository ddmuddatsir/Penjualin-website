// app/deals/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Note {
  id: string;
  content: string;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface Deal {
  id: string;
  name: string;
  value: number;
  stage: string;
  customer: { name: string };
  owner: { name: string };
  notes: Note[];
  tasks: Task[];
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await axios.get("/api/deals");
        setDeals(res.data);
      } catch (error) {
        console.error("Gagal mengambil data deals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  if (loading) return <p className="p-4">Memuat data deals...</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Daftar Deals</h1>
      {deals.length === 0 ? (
        <p>Tidak ada deal yang ditemukan.</p>
      ) : (
        <ul className="space-y-6">
          {deals.map((deal) => (
            <li key={deal.id} className="border p-4 rounded shadow bg-white">
              <h2 className="text-lg font-semibold">{deal.name}</h2>
              <p>Nilai: Rp{deal.value.toLocaleString()}</p>
              <p>Stage: {deal.stage}</p>
              <p>Customer: {deal.customer?.name}</p>
              <p>Owner: {deal.owner?.name}</p>

              {/* Notes */}
              {deal.notes.length > 0 && (
                <div className="mt-3">
                  <h3 className="font-semibold">Catatan:</h3>
                  <ul className="list-disc list-inside text-sm">
                    {deal.notes.map((note) => (
                      <li key={note.id}>{note.content}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tasks */}
              {deal.tasks.length > 0 && (
                <div className="mt-3">
                  <h3 className="font-semibold">Tugas:</h3>
                  <ul className="list-disc list-inside text-sm">
                    {deal.tasks.map((task) => (
                      <li key={task.id}>
                        {task.title}{" "}
                        <span
                          className={
                            task.completed ? "text-green-600" : "text-red-500"
                          }
                        >
                          ({task.completed ? "Selesai" : "Belum"})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
