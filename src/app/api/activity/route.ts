import { NextResponse } from "next/server";
import { generateMockKPI } from "@/lib/mock";

export async function GET() {
  if (process.env.USE_MOCK_DATA === "true") {
    return NextResponse.json(generateMockKPI());
  }

  try {
    const res = await fetch(`${process.env.AGGREGATOR_URL}/stats`, {
      headers: {
        Authorization: `Bearer ${process.env.AGGREGATOR_API_TOKEN}`,
      },
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Upstream error" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(generateMockKPI());
  }
}
