"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Kontak", path: "/management-contact" },
  { name: "Penjualan", path: "/pipeline-penjualan" },
  { name: "Tim & Tugas", path: "/kolaborasi-tim" },
  { name: "Laporan", path: "/laporan-analitik" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 w-64 bg-white border-r h-screen px-4 py-4">
      <Link href="/">
        <h1 className="text-2xl font-bold text-indigo-600 mb-8">Penjualin</h1>
      </Link>
      <nav className="space-y-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`block px-4 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-indigo-800 text-indigo-100 font-semibold"
                  : "text-gray-700 hover:bg-indigo-50"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
