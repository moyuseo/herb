import { NextResponse } from "next/server";
import { getTopGainers, getTopLosers } from "@/lib/db";

export async function GET() {
  const [gainers, losers] = await Promise.all([
    getTopGainers(10),
    getTopLosers(10),
  ]);

  return NextResponse.json({ success: true, data: { gainers, losers } });
}
