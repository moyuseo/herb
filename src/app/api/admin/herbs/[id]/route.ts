import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const herbId = parseInt(id, 10);

  if (isNaN(herbId)) {
    return NextResponse.json(
      { success: false, error: "无效的品种ID" },
      { status: 400 }
    );
  }

  const herb = await prisma.herb.findUnique({ where: { id: herbId } });

  if (!herb) {
    return NextResponse.json(
      { success: false, error: "品种未找到" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: herb });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const herbId = parseInt(id, 10);

  if (isNaN(herbId)) {
    return NextResponse.json(
      { success: false, error: "无效的品种ID" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { name, aliases, source, origin, category, properties, efficacy, usage, specGrade, description, imageUrl } = body;

    const herb = await prisma.herb.update({
      where: { id: herbId },
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

    return NextResponse.json({ success: true, data: herb });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "更新失败";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const herbId = parseInt(id, 10);

  if (isNaN(herbId)) {
    return NextResponse.json(
      { success: false, error: "无效的品种ID" },
      { status: 400 }
    );
  }

  try {
    await prisma.herb.delete({ where: { id: herbId } });
    return NextResponse.json({ success: true, message: "删除成功" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "删除失败";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
