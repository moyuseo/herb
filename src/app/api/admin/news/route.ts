import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);
  const category = searchParams.get("category") || "";
  const isPublished = searchParams.get("isPublished");

  const where: Record<string, unknown> = {};
  if (category) where.category = category;
  if (isPublished !== null && isPublished !== "") {
    where.isPublished = isPublished === "true";
  }

  const [data, total] = await Promise.all([
    prisma.newsArticle.findMany({
      where,
      include: { herb: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.newsArticle.count({ where }),
  ]);

  return NextResponse.json({
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, category, source, herbId, isPublished } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { success: false, error: "标题、内容和分类为必填项" },
        { status: 400 }
      );
    }

    const article = await prisma.newsArticle.create({
      data: {
        title,
        content,
        category,
        source: source || null,
        herbId: herbId ? parseInt(herbId, 10) : null,
        isPublished: isPublished || false,
        publishedAt: isPublished ? new Date() : null,
      },
      include: { herb: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ success: true, data: article }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "创建失败";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
