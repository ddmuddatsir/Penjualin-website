import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const deals = await prisma.deal.findMany({
      include: {
        customer: true,
        owner: true,
        notes: true,
        tasks: true,
      },
    });

    if (deals.length === 0) {
      // Data default jika kosong
      const defaultDeals = [
        {
          id: "default-1",
          name: "Contoh Penjualan",
          value: 1000000,
          stage: "Prospek",
          customer: {
            name: "Customer Contoh",
            email: "customer@example.com",
          },
          owner: {
            name: "Owner Contoh",
            email: "owner@example.com",
          },
          notes: [],
          tasks: [],
        },
      ];
      return NextResponse.json(defaultDeals);
    }

    return NextResponse.json(deals);
  } catch (error) {
    console.error("GET /api/deals error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data penjualan" },
      { status: 500 }
    );
  }
}

// POST - Membuat deal baru
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, value, stage = "Pospek", customerId, ownerId } = body;

    if (!name || !value || !customerId || !ownerId) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });
    const owner = await prisma.user.findUnique({ where: { id: ownerId } });

    if (!customer || !owner) {
      return NextResponse.json(
        { error: "Customer atau Owner tidak ditemukan" },
        { status: 404 }
      );
    }

    const newDeal = await prisma.deal.create({
      data: {
        name,
        value,
        stage,
        customerId,
        ownerId,
      },
    });

    return NextResponse.json(newDeal, { status: 201 });
  } catch (error) {
    console.error("POST /api/deals error:", error);
    return NextResponse.json(
      { error: "Gagal membuat data penjualan" },
      { status: 500 }
    );
  }
}

// PUT - Memperbarui deal berdasarkan ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params; // Mengambil ID dari params route
  const body = await req.json();
  const { stage } = body;

  if (!stage) {
    return NextResponse.json(
      { error: "Stage tidak boleh kosong" },
      { status: 400 }
    );
  }

  try {
    // Cari deal yang ingin diperbarui
    const updatedDeal = await prisma.deal.update({
      where: { id },
      data: { stage }, // Hanya update field 'stage'
    });

    return NextResponse.json(updatedDeal);
  } catch (error) {
    console.error("PUT /api/deals error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui deal" },
      { status: 500 }
    );
  }
}
