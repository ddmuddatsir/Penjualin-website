"use client";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    name: "Management Kontak",
    path: "/management-contact",
    desc: "",
  },
  {
    name: "Pipeline Penjualan",
    path: "/pipeline-penjualan",
    desc: "",
  },
  {
    name: "Kolaborasi Tim & Tugas",
    path: "/kolaborasi-tim",
    desc: "Kelola anggota tim dan hak akses mereka.",
  },
  {
    name: "Laporan & Analitik",
    path: "/laporan-analitik",
    desc: "Analisis kinerja penjualan dan aktivitas tim berdasarkan data terkini.",
  },
  {
    name: "Automasi Tugas",
    path: "/automasi-tugas",
    desc: "Permudah tugas dengan cara automasi tugas yang ada.",
  },
  { name: "Penjualin", path: "/" },
];

export default function Topbar() {
  const pathname = usePathname();
  const { user, isSignedIn } = useUser();

  const currentPage = menuItems.find((item) => pathname.startsWith(item.path));

  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/users/sync", {
        method: "POST",
      });
    }
  }, [isSignedIn]);

  return (
    <div className="h-16 px-6 flex items-center justify-between">
      <div
        className={`flex flex-col ${
          currentPage?.desc ? "pt-12 pl-4" : "pt-6"
        }  `}
      >
        <h2 className="text-xl font-semibold text-gray-700">
          {currentPage?.name === "Penjualin" ? (
            <Link href="/" className="hover:underline text-indigo-600">
              {currentPage.name}
            </Link>
          ) : (
            currentPage?.name || "Halaman"
          )}
        </h2>
        <p className="text-gray-600 mb-8 text-md">
          {currentPage ? currentPage.desc : "decs"}
        </p>
      </div>
      <div className="space-x-2">
        <SignedOut>
          <Link href="/sign-in">
            <button className="px-3 py-1 text-sm border rounded-md text-gray-700 hover:bg-gray-100">
              Login
            </button>
          </Link>
          <Link href="/sign-up">
            <button className="px-3 py-1 text-sm border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 hover:text-blue-600">
              Sign In
            </button>
          </Link>
        </SignedOut>
        <SignedIn>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-700">
              {user?.primaryEmailAddress?.emailAddress}
            </span>
            <UserButton />
          </div>
        </SignedIn>
      </div>
    </div>
  );
}
