// app/api/checkConnection/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json({ message: "Connection successful", users });
  } catch (error) {
    console.error("Database connection failed", error);
    return NextResponse.json(
      { error: "Failed to connect to the database" },
      { status: 500 }
    );
  }
}
