import { PrismaClient } from "@/prisma/app/generated/prisma";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"], // bisa dihapus atau diganti sesuai kebutuhan
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
