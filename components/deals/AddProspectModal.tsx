"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void;
}

interface Customer {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
}

export default function AddProspectModal({ isOpen, onClose, onAdded }: Props) {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stage, setStage] = useState("Prospek");
  const [customerId, setCustomerId] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchData = async () => {
      try {
        const [customersRes, usersRes] = await Promise.all([
          axios.get("/api/customers"),
          axios.get("/api/users/sync"),
        ]);
        setCustomers(customersRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      }
    };

    fetchData();
  }, [mounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/deals", {
        name,
        value: parseInt(value),
        stage,
        customerId,
        ownerId,
      });

      const deal = res.data;

      if (noteContent.trim()) {
        await axios.post("/api/notes", {
          content: noteContent,
          dealId: deal.id,
          userId: ownerId,
        });
      }

      if (taskTitle.trim()) {
        await axios.post("/api/tasks", {
          title: taskTitle,
          completed: false,
          dealId: deal.id,
          assigneeId,
        });
      }

      onAdded(); // optional callback
      router.push("/pipeline-penjualan");
    } catch (error) {
      console.error("Gagal membuat deal:", error);
      setError("Gagal membuat deal");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Tambah Prospek Baru</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nama Transaksi"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Nilai Deal"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />

          <select
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="Prospek">Prospek</option>
            <option value="Negosiasi">Negosiasi</option>
            <option value="Closing">Closing</option>
            <option value="Selesai">Selesai</option>
          </select>

          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Pilih Customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>

          <select
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Pilih Owner</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Catatan (opsional)"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Judul Tugas (opsional)"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <select
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Pilih Penanggung Jawab (opsional)</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
