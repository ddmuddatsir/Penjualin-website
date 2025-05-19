import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        clerkId: true,
        createdAt: true,
        updatedAt: true,
        isOnline: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data user" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Invalid content-type" },
        { status: 400 }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or empty JSON body" },
        { status: 400 }
      );
    }

    const { email, name } = body;

    if (!userId || !email || !name) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        email,
        name,
      },
      create: {
        clerkId: userId,
        email,
        name,
      },
    });

    return NextResponse.json({ message: "User synced successfully" });
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Invalid content-type" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { id, role } = body;

    if (!id || !role) {
      return NextResponse.json(
        { error: "Missing id or role" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("PATCH /api/users/sync error:", error);
    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 }
    );
  }
}
