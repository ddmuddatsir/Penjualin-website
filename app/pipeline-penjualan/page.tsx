"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AddProspectModal from "@/components/deals/AddProspectModal";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { DroppableColumn } from "@/components/deals/DroppableColumn";
import { DraggableDealCard } from "@/components/deals/DraggableDealCard";
import DealDetailModal from "@/components/deals/DealDetailModal";

type Stage = "Prospek" | "Negosiasi" | "Closing" | "Selesai";

interface Note {
  id: string;
  content: string;
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

interface Deal {
  id: string;
  name: string;
  value: number;
  stage: Stage;
  customer: { name: string };
  owner: { name: string };
  notes: Note[];
  tasks: Task[];
}

const stages: Stage[] = ["Prospek", "Negosiasi", "Closing", "Selesai"];

export default function Page() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState<Stage | "">("");
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  useEffect(() => {
    fetchDeals();
  }, []);

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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const dealId = active.id.toString();
    const newStage = over.id.toString() as Stage;

    setDeals((prevDeals) =>
      prevDeals.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d))
    );

    try {
      await axios.put(`/api/deals`, { id: dealId, stage: newStage });
    } catch (error) {
      console.error("Gagal memperbarui stage:", error);
    }
  };

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch = deal.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStage = selectedStage ? deal.stage === selectedStage : true;
    return matchesSearch && matchesStage;
  });

  const openDetailModal = (deal: Deal) => {
    setSelectedDeal(deal);
  };

  useEffect(() => {
    if (selectedDeal) {
      setShowDetailModal(true);
    }
  }, [selectedDeal]);

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedDeal(null);
  };

  if (loading) return <p className="p-4">Memuat data deals...</p>;

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      <AddProspectModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdded={fetchDeals}
      />

      {showDetailModal && selectedDeal && (
        <DealDetailModal deal={selectedDeal} onClose={closeDetailModal} />
      )}

      <section className="px-6 py-10 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 gap-4">
          <input
            type="text"
            placeholder="Cari Prospek..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border rounded-lg w-1/3"
          />

          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            + Tambah Prospek
          </button>
        </div>

        {/* Informasi tambahan */}
        <p className="text-sm text-gray-500 mb-4 italic">
          💡 Klik dua kali pada data penjualan untuk melihat detail lengkap.
        </p>

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stages.map((stage) => (
              <DroppableColumn key={stage} stage={stage}>
                {filteredDeals
                  .filter((deal) => deal.stage === stage)
                  .map((deal) => (
                    <DraggableDealCard
                      key={deal.id}
                      deal={deal}
                      onDetailClick={() => openDetailModal(deal)}
                    />
                  ))}
              </DroppableColumn>
            ))}
          </div>
        </DndContext>
      </section>
    </main>
  );
}
