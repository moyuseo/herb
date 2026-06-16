import { NextRequest, NextResponse } from "next/server";
import { getPriceIndexList } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name") || undefined;
    const daysParam = searchParams.get("days");
    const days = daysParam ? parseInt(daysParam, 10) : 30;

    if (isNaN(days) || days <= 0) {
      return NextResponse.json(
        { success: false, error: "days 参数必须为正整数" },
        { status: 400 }
      );
    }

    const data = await getPriceIndexList(name, days);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "获取价格指数数据失败" },
      { status: 500 }
    );
  }
}
