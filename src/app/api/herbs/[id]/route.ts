import { NextRequest, NextResponse } from "next/server";
import { getHerbById } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const herbId = parseInt(id, 10);

  if (isNaN(herbId)) {
    return NextResponse.json({ error: "无效的品种ID" }, { status: 400 });
  }

  const herb = await getHerbById(herbId);

  if (!herb) {
    return NextResponse.json({ error: "品种未找到" }, { status: 404 });
  }

  return NextResponse.json(herb);
}
