"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import axios from "axios";

type Customer = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
  createdAt: string;
  updatedAt: string;
  status?: "Aktif" | "Nonaktif";
};

export default function Page() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<Customer | null>(null);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newStatus, setNewStatus] = useState<"Aktif" | "Nonaktif">("Aktif");

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddContact = async () => {
    try {
      const newContact = {
        name: newName,
        email: newEmail,
        phone: newPhone,
        status: newStatus,
      };

      const response = await axios.post("/api/customers", newContact);
      setCustomers([...customers, response.data]);
      setOpen(false);
      setNewName("");
      setNewEmail("");
      setNewPhone("");
      setNewStatus("Aktif");
    } catch (error) {
      console.error("Gagal tambah kontak:", error);
      alert("Gagal menambahkan kontak");
    }
  };

  const handleUpdate = async () => {
    if (!editing) return;
    try {
      const response = await axios.put(`/api/customers/${editing.id}`, editing);
      setCustomers((prev) =>
        prev.map((c) => (c.id === editing.id ? response.data : c))
      );
      setEditing(null);
    } catch (error) {
      console.error("Gagal update:", error);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;

    try {
      await axios.delete(`/api/customers/${deleting.id}`);
      setCustomers((prev) => prev.filter((c) => c.id !== deleting.id));
      setDeleting(null);
    } catch (error) {
      console.error("Gagal hapus:", error);
    }
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("/api/customers");
        setCustomers(response.data);
      } catch (error) {
        console.error("Gagal fetch customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      <section className="px-4 py-10 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <Input
            placeholder="Cari kontak..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 transition">
                + Tambah Kontak
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Tambah Kontak Baru</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nama</Label>
                  <Input
                    id="name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Masukkan nama"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Masukkan email"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">No Telepon</Label>
                  <Input
                    id="phone"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="Masukkan no telepon"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newStatus}
                    onValueChange={(v) =>
                      setNewStatus(v as "Aktif" | "Nonaktif")
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aktif">Aktif</SelectItem>
                      <SelectItem value="Nonaktif">Nonaktif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddContact}>Simpan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full">
            <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <tr>
                <th className="px-6 py-3">Nama</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">No Telepon</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {filtered.map((cust) => (
                <tr key={cust.id}>
                  <td className="px-6 py-4">{cust.name}</td>
                  <td className="px-6 py-4">{cust.email}</td>
                  <td className="px-6 py-4">{cust.phone}</td>
                  <td className="px-6 py-4">{cust.status ?? "Aktif"}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="text-blue-600 hover:underline px-0"
                          onClick={() => setEditing(cust)}
                        >
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Kontak</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Nama</Label>
                            <Input
                              value={editing?.name || ""}
                              onChange={(e) =>
                                setEditing((prev) =>
                                  prev
                                    ? { ...prev, name: e.target.value }
                                    : prev
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label>Email</Label>
                            <Input
                              value={editing?.email || ""}
                              onChange={(e) =>
                                setEditing((prev) =>
                                  prev
                                    ? { ...prev, email: e.target.value }
                                    : prev
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label>No Telepon</Label>
                            <Input
                              value={editing?.phone || ""}
                              onChange={(e) =>
                                setEditing((prev) =>
                                  prev
                                    ? { ...prev, phone: e.target.value }
                                    : prev
                                )
                              }
                            />
                          </div>
                          <div className="flex justify-end pt-2">
                            <Button onClick={handleUpdate}>Simpan</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="text-red-600 hover:underline px-0"
                          onClick={() => setDeleting(cust)}
                        >
                          Hapus
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Kontak</AlertDialogTitle>
                          <AlertDialogDescription>
                            Yakin ingin menghapus{" "}
                            <strong>{deleting?.name}</strong>?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete}>
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center px-6 py-8 text-gray-500"
                  >
                    Tidak ada kontak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
