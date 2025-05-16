import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const notes = await prisma.note.findMany({
      include: {
        user: true,
        deal: true,
        attachments: true,
      },
    });

    if (notes.length === 0) {
      // Data default jika kosong
      const defaultNotes = [
        {
          id: "default-note-1",
          content: "Contoh catatan untuk deal",
          user: {
            id: "default-user-1",
            name: "User Contoh",
            email: "user@example.com",
          },
          deal: {
            id: "default-deal-1",
            name: "Contoh Deal",
            value: 1000000,
            stage: "Prospek",
          },
          attachments: [],
        },
      ];
      return NextResponse.json(defaultNotes);
    }

    return NextResponse.json(notes);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil notes" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { content, userId, dealId } = await req.json();

    const note = await prisma.note.create({
      data: { content, userId, dealId },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal membuat note" }, { status: 500 });
  }
}
