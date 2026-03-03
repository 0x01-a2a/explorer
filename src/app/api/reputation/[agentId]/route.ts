import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  const { agentId } = await params;

  if (process.env.USE_MOCK_DATA === "true") {
    return NextResponse.json({
      agent_id: agentId,
      reliability: 70 + Math.floor(Math.random() * 30),
      cooperation: 65 + Math.floor(Math.random() * 35),
      notary_accuracy: 75 + Math.floor(Math.random() * 25),
      total_tasks: 10 + Math.floor(Math.random() * 90),
      total_disputes: Math.floor(Math.random() * 5),
      last_active_epoch: Date.now() - Math.floor(Math.random() * 3600000),
    });
  }

  try {
    const res = await fetch(
      `${process.env.AGGREGATOR_URL}/reputation/${agentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AGGREGATOR_API_TOKEN}`,
        },
      }
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
    return NextResponse.json(
      { error: "Failed to fetch reputation" },
      { status: 500 }
    );
  }
}
