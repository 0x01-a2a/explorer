import { NextResponse } from "next/server";
import { generateMockAgents } from "@/lib/mock";

// Proxies to aggregator GET /agents?sort=recent&limit=200
// Returns AgentReputation[] — the globe uses country/city for coordinates
export async function GET() {
  if (process.env.USE_MOCK_DATA === "true") {
    return NextResponse.json(generateMockAgents());
  }

  try {
    const res = await fetch(
      `${process.env.AGGREGATOR_URL}/agents?sort=recent&limit=200`,
      { next: { revalidate: 30 } }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Upstream error" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(generateMockAgents());
  }
}
