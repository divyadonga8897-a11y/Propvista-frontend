import { NextResponse } from "next/server";
import { getFlatById, MOCK_FLATS } from "@/data/mockData";

export async function GET() {
  const flat = getFlatById("flat-apt-1-f1-1");
  return NextResponse.json({
    success: true,
    totalFlats: MOCK_FLATS.length,
    flatFound: !!flat,
    flat,
  });
}
