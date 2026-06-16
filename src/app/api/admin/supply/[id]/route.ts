import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supplyId = parseInt(id, 10);

  if (isNaN(supplyId)) {
    return NextResponse.json(
      { success: false, error: "无效的供求ID" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { status } = body;

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "无效的审核状态" },
        { status: 400 }
      );
    }

    const item = await prisma.supplyDemand.findUnique({
      where: { id: supplyId },
    });

    if (!item) {
      return NextResponse.json(
        { success: false, error: "供求信息未找到" },
        { status: 404 }
      );
    }

    const updated = await prisma.supplyDemand.update({
      where: { id: supplyId },
      data: { status },
      include: { herb: { select: { id: true, name: true, category: true } } },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: status === "approved" ? "已通过" : "已拒绝",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "操作失败";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
