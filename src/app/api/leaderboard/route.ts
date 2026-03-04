import { NextRequest, NextResponse } from "next/server";
import { generateMockAgents } from "@/lib/mock";

// Proxies to aggregator GET /leaderboard?limit=N → AgentReputation[] sorted by average_score
export async function GET(request: NextRequest) {
  const limit = request.nextUrl.searchParams.get("limit") || "20";

  if (process.env.USE_MOCK_DATA === "true") {
    const agents = generateMockAgents()
      .sort((a, b) => b.average_score - a.average_score)
      .slice(0, Number(limit));
    return NextResponse.json(agents);
  }

  try {
    const res = await fetch(
      `${process.env.AGGREGATOR_URL}/leaderboard?limit=${limit}`,
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
    const agents = generateMockAgents()
      .sort((a, b) => b.average_score - a.average_score)
      .slice(0, Number(limit));
    return NextResponse.json(agents);
  }
}
