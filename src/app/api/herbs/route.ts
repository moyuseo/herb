import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const herbs = await prisma.herb.findMany({
    select: { id: true, name: true, category: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(herbs);
}
