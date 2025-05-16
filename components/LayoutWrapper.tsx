"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

function SyncUser() {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      fetch("/api/users/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.primaryEmailAddress?.emailAddress,
          name: user.fullName,
          externalId: user.id,
        }),
      });
    }
  }, [isSignedIn, user]);

  return null;
}

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const showSidebar = ![
    "/",
    "/sign-in",
    "/sign-up",
    "/create",
    "/verify-email-address",
    "sign-up/verify-email-address",
  ].includes(pathname);

  const isPublicPage = ["/", "/sign-in", "/sign-up"].includes(pathname);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {showSidebar && <Sidebar />}

      <div className={`flex-1 flex flex-col ${showSidebar ? "ml-64" : ""}`}>
        {!isPublicPage && <SyncUser />}
        <Topbar />

        {children}
        {!showSidebar && <Footer />}
      </div>
    </div>
  );
}
