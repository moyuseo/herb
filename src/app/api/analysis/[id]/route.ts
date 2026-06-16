import { NextRequest, NextResponse } from "next/server";
import { getMarketAnalysisById, getRelatedAnalysis } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "无效的文章ID" },
        { status: 400 }
      );
    }

    const analysis = await getMarketAnalysisById(id);

    if (!analysis) {
      return NextResponse.json(
        { success: false, error: "文章不存在" },
        { status: 404 }
      );
    }

    const related = await getRelatedAnalysis(analysis.category, id);

    return NextResponse.json({ success: true, data: { analysis, related } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "获取文章详情失败" },
      { status: 500 }
    );
  }
}
