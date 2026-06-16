import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  const where: Record<string, unknown> = {};
  if (category) where.category = category;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { aliases: { contains: search } },
      { origin: { contains: search } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.herb.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.herb.count({ where }),
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
    const { name, aliases, source, origin, category, properties, efficacy, usage, specGrade, description, imageUrl } = body;

    if (!name || !category) {
      return NextResponse.json(
        { success: false, error: "名称和分类为必填项" },
        { status: 400 }
      );
    }

    const herb = await prisma.herb.create({
      data: {
        name,
        aliases: aliases || null,
        source: source || null,
        origin: origin || null,
        category,
        properties: properties || null,
        efficacy: efficacy || null,
        usage: usage || null,
        specGrade: specGrade || null,
        description: description || null,
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json({ success: true, data: herb }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "创建失败";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
