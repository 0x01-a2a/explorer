export async function fetchAgents() {
  const res = await fetch("/api/peers");
  if (!res.ok) throw new Error("Failed to fetch agents");
  return res.json();
}

export async function fetchNetworkStats() {
  const res = await fetch("/api/activity");
  if (!res.ok) throw new Error("Failed to fetch network stats");
  return res.json();
}

export async function fetchRecentEvents(limit = 50) {
  const res = await fetch(`/api/activity?events=true&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

export async function fetchAgentProfile(agentId: string) {
  const res = await fetch(`/api/reputation/${agentId}`);
  if (!res.ok) throw new Error("Failed to fetch agent profile");
  return res.json();
}

export async function fetchLeaderboard(limit = 20) {
  const res = await fetch(`/api/leaderboard?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch leaderboard");
  return res.json();
}
