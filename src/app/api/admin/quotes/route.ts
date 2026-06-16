import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);
  const herbId = searchParams.get("herbId");

  const where: Record<string, unknown> = {};
  if (herbId) where.herbId = parseInt(herbId, 10);

  const [data, total] = await Promise.all([
    prisma.priceQuote.findMany({
      where,
      include: { herb: { select: { id: true, name: true, category: true } } },
      orderBy: { date: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.priceQuote.count({ where }),
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
    const { herbId, price, change, changePercent, origin, spec, date } = body;

    if (!herbId || price === undefined || !date) {
      return NextResponse.json(
        { success: false, error: "品种、价格和日期为必填项" },
        { status: 400 }
      );
    }

    const quote = await prisma.priceQuote.create({
      data: {
        herbId: parseInt(herbId, 10),
        price: parseFloat(price),
        change: parseFloat(change) || 0,
        changePercent: parseFloat(changePercent) || 0,
        origin: origin || null,
        spec: spec || null,
        date: new Date(date),
      },
      include: { herb: { select: { id: true, name: true, category: true } } },
    });

    return NextResponse.json({ success: true, data: quote }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "创建失败";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
