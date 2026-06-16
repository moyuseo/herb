import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const quoteId = parseInt(id, 10);

  if (isNaN(quoteId)) {
    return NextResponse.json(
      { success: false, error: "无效的行情ID" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { herbId, price, change, changePercent, origin, spec, date } = body;

    const data: Record<string, unknown> = {};
    if (herbId !== undefined) data.herbId = parseInt(herbId, 10);
    if (price !== undefined) data.price = parseFloat(price);
    if (change !== undefined) data.change = parseFloat(change);
    if (changePercent !== undefined) data.changePercent = parseFloat(changePercent);
    if (origin !== undefined) data.origin = origin || null;
    if (spec !== undefined) data.spec = spec || null;
    if (date !== undefined) data.date = new Date(date);

    const quote = await prisma.priceQuote.update({
      where: { id: quoteId },
      data,
      include: { herb: { select: { id: true, name: true, category: true } } },
    });

    return NextResponse.json({ success: true, data: quote });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "更新失败";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
