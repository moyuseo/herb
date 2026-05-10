import { NextRequest, NextResponse } from "next/server";
import { getPriceList } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("search") || undefined;
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 20;

  const result = await getPriceList({ category, search, page, pageSize });

  return NextResponse.json({ success: true, data: result });
}
