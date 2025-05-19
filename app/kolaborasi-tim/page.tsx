"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaCircle } from "react-icons/fa";
import { FiClipboard, FiMail, FiSend, FiUserPlus } from "react-icons/fi";

type Member = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Sales" | "Manager";
  createAt: string;
  isOnline: boolean;
  taskToday: string;
  taskStatus: "Selesai" | "Belum Selesai";
};

type Task = {
  id: string;
  title: string;
  completed: boolean;
  assignee: {
    id: string;
    name: string;
  };
  createdAt: string;
};

export default function Page() {
  const [members, setMembers] = useState<Member[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [origin, setOrigin] = useState("");

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [newRole, setNewRole] = useState<"Admin" | "Sales" | "Manager" | "">(
    ""
  );
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const inviteLink = origin ? `${origin}/sign-up` : "";
  // const inviteLink = `${window.location.origin}/sign-up`;

  const handleCopyLink = async () => {
    if (!inviteLink) {
      alert("Link belum tersedia.");
      return;
    }
    try {
      await navigator.clipboard.writeText(inviteLink);
      alert("Link berhasil disalin!");
    } catch (err) {
      alert("Gagal menyalin link.");
    }
  };

  const handleWhatsAppInvite = () => {
    if (!inviteLink) return;
    const message = encodeURIComponent(
      `Hai! Yuk bergabung ke tim kami lewat link berikut: ${inviteLink}`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const handleEmailInvite = () => {
    if (!inviteLink) return;
    const subject = encodeURIComponent("Undangan Bergabung ke Tim");
    const body = encodeURIComponent(
      `Hai,\n\nSaya ingin mengundang Anda untuk bergabung ke tim kami. Silakan klik link berikut untuk mendaftar:\n\n${inviteLink}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  useEffect(() => {
    async function fetchMembersAndTasks() {
      try {
        const [usersRes, tasksTodayRes, tasksAllRes, dealsRes] =
          await Promise.all([
            axios.get("/api/users/sync"),
            axios.get("/api/tasks/"),
            axios.get("/api/tasks/all"),
            axios.get("/api/deals"),
          ]);

        const users = usersRes.data;
        const tasksToday = tasksTodayRes.data;
        const allTasks = tasksAllRes.data;
        const deals = dealsRes.data;

        const finishedDealsUserIds = deals
          .filter((deal: any) => deal.stage === "selesai")
          .map((deal: any) => deal.assignee?.id);

        const enrichedUsers = users.map((user: any) => {
          const todayTask = tasksToday.find(
            (task: any) => task.assignee?.id === user.id
          );

          const hasFinishedDeal = finishedDealsUserIds.includes(user.id);

          const taskStatus =
            todayTask?.completed || hasFinishedDeal
              ? "Selesai"
              : "Belum Selesai";

          return {
            ...user,
            taskToday: todayTask?.title || "Tidak ada",
            taskStatus,
          };
        });

        setMembers(enrichedUsers);
        setTasks(allTasks);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMembersAndTasks();
  }, []);

  const handleChangeRole = async (
    id: string,
    newRole: "ADMIN" | "SALES" | "MANAGER"
  ) => {
    try {
      const res = await axios.patch(`/api/users/sync`, {
        id,
        role: newRole,
      });

      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, role: res.data.role } : m))
      );
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat mengubah peran.");
    }
  };

  const openModal = (member: Member) => {
    setSelectedMember(member);
    setNewRole(member.role);
  };

  const closeModal = () => {
    setSelectedMember(null);
    setNewRole("");
  };

  const handleModalSave = () => {
    if (selectedMember && newRole) {
      handleChangeRole(
        selectedMember.id,
        newRole.toUpperCase() as "ADMIN" | "SALES" | "MANAGER"
      );
      closeModal();
    }
  };

  const toggleTaskStatus = async (taskId: string, completed: boolean) => {
    try {
      const res = await axios.patch("/api/tasks/all", {
        taskId,
        completed,
      });

      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? { ...task, completed } : task))
      );
    } catch (err) {
      console.error("Gagal mengubah status tugas:", err);
      alert("Gagal mengubah status tugas.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      <section className="px-4 py-10 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-gray-800">
            Daftar Team Kami
          </h1>
          <button
            onClick={() => setInviteModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            <FiUserPlus className="text-lg" />
            <span>Undang Anggota</span>
          </button>
        </div>

        {/* Tabel Anggota */}
        <div className="overflow-x-auto rounded-lg shadow-md bg-white mb-10">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-indigo-100 text-indigo-800">
              <tr>
                <th className="py-3 px-4">Nama</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Peran</th>
                <th className="py-3 px-4">Bergabung</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Tugas Hari Ini</th>
                <th className="py-3 px-4">Status Tugas</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-5 text-gray-400">
                    Memuat data anggota...
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-5 text-gray-400">
                    Belum ada anggota dalam tim.
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr
                    key={member.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {member.name}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{member.email}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-semibold">
                        {member.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {member.createAt
                        ? new Date(member.createAt).toISOString().slice(0, 10)
                        : "-"}
                    </td>
                    <td className="py-3 px-4">
                      {member.isOnline ? (
                        <span className="flex items-center space-x-2 text-green-500">
                          <FaCircle size={8} /> <span>Online</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-2 text-gray-500">
                          <FaCircle size={8} /> <span>Offline</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">{member.taskToday}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          member.taskStatus === "Selesai"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {member.taskStatus === "Selesai" ? (
                          <FaCheck />
                        ) : (
                          <FaTimes />
                        )}{" "}
                        {member.taskStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        className="text-sm text-indigo-600 hover:underline"
                        onClick={() => openModal(member)}
                      >
                        Ubah Peran
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Tabel Tugas per Anggota */}
        <div className="overflow-x-auto rounded-lg shadow-md bg-white">
          <h2 className="text-lg font-semibold px-4 pt-6 pb-2 text-gray-800">
            Tabel Tugas Per Anggota
          </h2>
          <table className="min-w-full text-sm text-left mb-6">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4">Nama Anggota</th>
                <th className="py-3 px-4">Judul Tugas</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-5 text-gray-400">
                    Tidak ada tugas yang ditemukan.
                  </td>
                </tr>
              ) : (
                tasks
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .map((task) => (
                    <tr key={task.id} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {task.assignee?.name || "-"}
                      </td>
                      <td className="py-3 px-4">{task.title}</td>
                      <td className="py-3 px-4">
                        {new Date(task.createdAt).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() =>
                            toggleTaskStatus(task.id, !task.completed)
                          }
                          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold transition duration-200 ${
                            task.completed
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                        >
                          {task.completed ? "Selesai" : "Belum Selesai"}
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal Ubah Peran */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              Ubah Peran: {selectedMember.name}
            </h2>
            <select
              className="w-full border p-2 rounded mb-4"
              value={newRole}
              onChange={(e) =>
                setNewRole(e.target.value as "Admin" | "Sales" | "Manager")
              }
            >
              <option value="Admin">Admin</option>
              <option value="Sales">Sales</option>
              <option value="Manager">Manager</option>
            </select>

            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleModalSave}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Undang Anggota</h2>
            <p className="text-sm mb-4 text-gray-600">
              Bagikan link ini kepada anggota baru untuk bergabung.
            </p>

            <div className="bg-gray-100 p-3 rounded-md mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-800 truncate">
                {inviteLink}
              </span>
              <button onClick={handleCopyLink}>
                <FiClipboard className="text-gray-600 hover:text-gray-800" />
              </button>
            </div>

            <div className="flex justify-between gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  "Hai! Bergabunglah dengan tim kami lewat link ini: " +
                    inviteLink
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-500 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-green-600"
              >
                <FiSend /> WhatsApp
              </a>

              <a
                href={`mailto:?subject=Undangan%20Tim&body=${encodeURIComponent(
                  "Hai! Bergabunglah dengan tim kami lewat link ini:\n" +
                    inviteLink
                )}`}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-blue-600"
              >
                <FiMail /> Email
              </a>
            </div>

            <button
              onClick={() => setInviteModalOpen(false)}
              className="mt-4 w-full text-gray-600 text-sm hover:underline"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
