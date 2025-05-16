import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (customers.length === 0) {
      const defaultCustomers = [
        {
          id: "default-customer-id",
          name: "Contoh Pelanggan",
          email: "pelanggan@example.com",
          phone: "081234567890",
          address: "Jl. Contoh No. 123, Jakarta",
          company: "PT Contoh Abadi",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      return NextResponse.json(defaultCustomers);
    }

    return NextResponse.json(customers);
  } catch (error) {
    console.log("Data gagal di ambil", error);
    return NextResponse.json(
      { error: "Gagal mengambil data customer" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, address, company } = body;

    if (!name) {
      return NextResponse.json({ error: "Nama wajib diisi" }, { status: 400 });
    }

    const newCustomer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        address,
        company,
      },
    });

    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    console.error("Gagal menambahkan customer:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan customer" },
      { status: 500 }
    );
  }
}
