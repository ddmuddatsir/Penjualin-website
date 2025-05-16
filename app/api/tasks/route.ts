import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const tasks = await prisma.task.findMany({
      where: {
        deadline: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        deal: true,
        assignee: true,
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil tasks" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { title, description, deadline, completed, dealId, assigneeId } =
      await req.json();

    const task = await prisma.task.create({
      data: { title, description, deadline, completed, dealId, assigneeId },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal membuat task" }, { status: 500 });
  }
}
