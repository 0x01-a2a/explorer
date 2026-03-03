const BASE = process.env.NEXT_PUBLIC_APP_URL || "";

export async function fetchPeers() {
  const res = await fetch(`${BASE}/api/peers`, { next: { revalidate: 30 } });
  if (!res.ok) throw new Error("Failed to fetch peers");
  return res.json();
}

export async function fetchKPI() {
  const res = await fetch(`${BASE}/api/activity`, { next: { revalidate: 30 } });
  if (!res.ok) throw new Error("Failed to fetch KPI data");
  return res.json();
}

export async function fetchReputation(agentId: string) {
  const res = await fetch(`${BASE}/api/reputation/${agentId}`);
  if (!res.ok) throw new Error("Failed to fetch reputation");
  return res.json();
}
