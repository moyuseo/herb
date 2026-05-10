import { NextResponse } from "next/server";
import { getSupplyDemandById } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numericId = Number(id);

  if (isNaN(numericId)) {
    return NextResponse.json(
      { error: "无效的ID" },
      { status: 400 }
    );
  }

  const supplyDemand = await getSupplyDemandById(numericId);

  if (!supplyDemand) {
    return NextResponse.json(
      { error: "供求信息不存在" },
      { status: 404 }
    );
  }

  return NextResponse.json(supplyDemand);
}
