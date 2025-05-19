import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// PUT - update customer by id
export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop(); // Ambil ID dari URL

    if (!id) {
      return NextResponse.json(
        { error: "ID tidak ditemukan" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, email, phone, address, company } = body;

    if (!name) {
      return NextResponse.json({ error: "Nama wajib diisi" }, { status: 400 });
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        address,
        company,
      },
    });

    return NextResponse.json(updatedCustomer, { status: 200 });
  } catch (error) {
    console.error("Gagal memperbarui customer:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui customer" },
      { status: 500 }
    );
  }
}

// DELETE - hapus customer by id
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop(); // Ambil ID dari URL

    if (!id) {
      return NextResponse.json(
        { error: "ID tidak ditemukan" },
        { status: 400 }
      );
    }

    await prisma.customer.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Customer berhasil dihapus" });
  } catch (error) {
    console.error("Gagal hapus customer:", error);
    return NextResponse.json(
      { error: "Gagal hapus customer" },
      { status: 500 }
    );
  }
}
