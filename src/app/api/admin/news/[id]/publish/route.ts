import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const newsId = parseInt(id, 10);

  if (isNaN(newsId)) {
    return NextResponse.json(
      { success: false, error: "无效的资讯ID" },
      { status: 400 }
    );
  }

  try {
    const article = await prisma.newsArticle.findUnique({
      where: { id: newsId },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: "资讯未找到" },
        { status: 404 }
      );
    }

    const newStatus = !article.isPublished;
    const updated = await prisma.newsArticle.update({
      where: { id: newsId },
      data: {
        isPublished: newStatus,
        publishedAt: newStatus ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: newStatus ? "已发布" : "已下架",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "操作失败";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
