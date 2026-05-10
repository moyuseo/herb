import { NextRequest, NextResponse } from "next/server";
import { getMarketAnalysisList } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

    const result = await getMarketAnalysisList({
      category,
      isPublished: true,
      page,
      pageSize,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "获取市场分析列表失败" },
      { status: 500 }
    );
  }
}
