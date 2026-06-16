import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
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

  const article = await prisma.newsArticle.findUnique({
    where: { id: newsId },
    include: { herb: { select: { id: true, name: true } } },
  });

  if (!article) {
    return NextResponse.json(
      { success: false, error: "资讯未找到" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: article });
}

export async function PUT(
  request: NextRequest,
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
    const body = await request.json();
    const { title, content, category, source, herbId, isPublished } = body;

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (content !== undefined) data.content = content;
    if (category !== undefined) data.category = category;
    if (source !== undefined) data.source = source || null;
    if (herbId !== undefined) data.herbId = herbId ? parseInt(herbId, 10) : null;
    if (isPublished !== undefined) {
      data.isPublished = isPublished;
      if (isPublished) {
        data.publishedAt = new Date();
      } else {
        data.publishedAt = null;
      }
    }

    const article = await prisma.newsArticle.update({
      where: { id: newsId },
      data,
      include: { herb: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ success: true, data: article });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "更新失败";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
