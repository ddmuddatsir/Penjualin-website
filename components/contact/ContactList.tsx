"use client";

import { useEffect, useState } from "react";
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
};

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("/api/customers");
        setCustomers(response.data);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Daftar Customer</h2>
      <ul className="space-y-2">
        {customers.map((cust) => (
          <li key={cust.id} className="border p-3 rounded shadow-sm">
            <p>
              <strong>{cust.name}</strong>
            </p>
            {cust.email && <p>Email: {cust.email}</p>}
            {cust.phone && <p>Phone: {cust.phone}</p>}
            {cust.company && <p>Company: {cust.company}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
