import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        deal: true,
        assignee: true,
      },
    });

    if (tasks.length === 0) {
      // Data default jika kosong
      const defaultTasks = [
        {
          id: "default-task-1",
          title: "Follow up pelanggan",
          description: "Hubungi pelanggan terkait deal terbaru",
          deadline: new Date().toISOString(),
          completed: false,
          deal: {
            id: "default-deal-id",
            name: "Contoh Deal",
            value: 500000,
            stage: "Prospek",
          },
          assignee: {
            id: "default-user-id",
            name: "User Contoh",
            email: "user@example.com",
          },
        },
      ];

      return NextResponse.json(defaultTasks);
    }

    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil tasks" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { taskId, completed } = await req.json();

    if (!taskId || typeof completed !== "boolean") {
      return NextResponse.json(
        { error: "taskId dan completed wajib diisi." },
        { status: 400 }
      );
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { completed },
    });

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("Gagal memperbarui tugas:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memperbarui tugas." },
      { status: 500 }
    );
  }
}
