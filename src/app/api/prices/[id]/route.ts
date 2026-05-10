import { NextRequest, NextResponse } from "next/server";
import { getHerbById, getQuoteHistory } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const herbId = Number(id);

  if (isNaN(herbId)) {
    return NextResponse.json(
      { success: false, error: "无效的品种ID" },
      { status: 400 }
    );
  }

  const { searchParams } = request.nextUrl;
  const days = Number(searchParams.get("days")) || 30;

  const [herb, history] = await Promise.all([
    getHerbById(herbId),
    getQuoteHistory(herbId, days),
  ]);

  if (!herb) {
    return NextResponse.json(
      { success: false, error: "品种不存在" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: { herb, history } });
}
