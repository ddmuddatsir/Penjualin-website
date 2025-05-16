import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// PUT - update customer by id
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await req.json();

    const updated = await prisma.customer.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Gagal update:", error);
    return NextResponse.json(
      { error: "Gagal update customer" },
      { status: 500 }
    );
  }
}

// DELETE - hapus customer by id
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.customer.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Customer berhasil dihapus" });
  } catch (error) {
    console.error("Gagal hapus:", error);
    return NextResponse.json(
      { error: "Gagal hapus customer" },
      { status: 500 }
    );
  }
}
