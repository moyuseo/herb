import { NextRequest, NextResponse } from "next/server";
import { getNewsList } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

  const result = await getNewsList({
    category,
    isPublished: true,
    page,
    pageSize,
  });

  return NextResponse.json(result);
}
