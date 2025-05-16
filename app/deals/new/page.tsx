"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Customer {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
}

export default function NewDealPage() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // ⛔ Hindari render sebelum client mount
  if (!hasMounted) return null;

  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [stage, setStage] = useState("Prospek");
  const [customerId, setCustomerId] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
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
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

      router.push("/deals");
    } catch (error) {
      console.error("Gagal membuat deal:", error);
      alert("Gagal membuat deal");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Tambah Deal Baru</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nama Deal"
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

        {/* Customer */}
        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Pilih Customer</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Owner */}
        <select
          value={ownerId}
          onChange={(e) => setOwnerId(e.target.value)}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Pilih Owner</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>

        {/* Note */}
        <textarea
          placeholder="Catatan (opsional)"
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {/* Task */}
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

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Tambah
        </button>
      </form>
    </div>
  );
}
