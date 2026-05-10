import { NextResponse } from "next/server";
import { getSupplyDemandList, prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || undefined;
  const search = searchParams.get("search") || undefined;
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 20;

  const result = await getSupplyDemandList({
    type,
    search,
    page,
    pageSize,
  });

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, herbId, quantity, price, origin, contact, description } = body;

    if (!type || !herbId || !quantity || !contact) {
      return NextResponse.json(
        { error: "类型、品种、数量和联系方式为必填项" },
        { status: 400 }
      );
    }

    const supplyDemand = await prisma.supplyDemand.create({
      data: {
        type,
        herbId: Number(herbId),
        quantity,
        price: price || null,
        origin: origin || null,
        contact,
        description: description || null,
        status: "pending",
      },
      include: { herb: { select: { id: true, name: true, category: true } } },
    });

    return NextResponse.json(supplyDemand, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "创建供求信息失败" },
      { status: 500 }
    );
  }
}
