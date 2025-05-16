"use client";

import { useState } from "react";
import axios from "axios";

export default function CustomerForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    company: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/customers", formData);
      console.log("Customer created:", response.data);
      alert("Customer berhasil ditambahkan!");
    } catch (error) {
      console.error("Error creating customer:", error);
      alert("Terjadi kesalahan");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-md">
      {["name", "email", "phone", "address", "company"].map((field) => (
        <input
          key={field}
          name={field}
          placeholder={field}
          value={(formData as any)[field]}
          onChange={handleChange}
          className="border p-2 rounded"
          required={field === "name"}
        />
      ))}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Tambah Customer
      </button>
    </form>
  );
}
