import { prisma } from "./prisma";

export async function listClosures() {
  return prisma.closure.findMany({ orderBy: { from: "asc" } });
}
