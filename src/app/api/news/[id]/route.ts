import { NextRequest, NextResponse } from "next/server";
import { getNewsById, getRelatedNews } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: "无效的资讯ID" }, { status: 400 });
  }

  const article = await getNewsById(id);

  if (!article) {
    return NextResponse.json({ error: "资讯不存在" }, { status: 404 });
  }

  const related = await getRelatedNews(article.category, article.id, 5);

  return NextResponse.json({ ...article, related });
}
