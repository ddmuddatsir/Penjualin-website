import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
  createdAt: string;
  updatedAt: string;
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/customers");
      setCustomers(res.data);
    } catch (error) {
      console.error("Gagal ambil kontak", error);
    } finally {
      setLoading(false);
    }
  };

  const addCustomers = async (
    data: Omit<Customer, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const res = await axiosInstance.post("/api/customers", data);
      setCustomers((prev) => [res.data, ...prev]);
    } catch (error) {
      console.error("Gagal tambah kontak", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return { customers, loading, addCustomers };
}
