// app/components/Navbar.tsx

"use client";

import Link from "next/link";
import React, { useState } from "react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 shadow-sm bg-white">
      <Link href="/" className="text-2xl font-bold text-indigo-600">
        RelasiPro
      </Link>
      <nav className="space-x-4">
        <Link href="/login" className="hover:text-indigo-600 text-gray-700">
          Masuk
        </Link>
        <Link
          href="/register"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Daftar
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
