import type {
  ActivityEvent,
  AgentReputation,
  NetworkStats,
} from "@/types/events";

const CITIES: { country: string; city: string }[] = [
  { country: "US", city: "New York" },
  { country: "US", city: "Los Angeles" },
  { country: "US", city: "San Francisco" },
  { country: "GB", city: "London" },
  { country: "FR", city: "Paris" },
  { country: "DE", city: "Berlin" },
  { country: "JP", city: "Tokyo" },
  { country: "SG", city: "Singapore" },
  { country: "AU", city: "Sydney" },
  { country: "KR", city: "Seoul" },
  { country: "IN", city: "Mumbai" },
  { country: "BR", city: "São Paulo" },
  { country: "NG", city: "Lagos" },
  { country: "TR", city: "Istanbul" },
  { country: "AE", city: "Dubai" },
  { country: "PL", city: "Kraków" },
  { country: "PL", city: "Warsaw" },
  { country: "HU", city: "Budapest" },
  { country: "NO", city: "Oslo" },
  { country: "IT", city: "Milan" },
];

const NAMES = [
  "atlas", "nova", "sentinel", "cipher", "nexus", "oracle",
  "meridian", "vanguard", "phantom", "zenith", "cortex", "prism",
  "vector", "cascade", "beacon", "argon", "helix", "flux",
  "obsidian", "summit", "drift", "echo", "radiant", "forge",
  "pulse", "nebula", "titan", "vortex", "ember", "frost",
  "quantum", "sage", "raven", "luna", "solar",
];

function randomHexId(): string {
  const chars = "0123456789abcdef";
  let result = "";
  for (let i = 0; i < 64; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

const AGENT_IDS = Array.from({ length: 35 }, () => randomHexId());

let eventCounter = 1000;

export function generateMockAgents(): AgentReputation[] {
  return AGENT_IDS.map((agent_id, i) => {
    const city = CITIES[i % CITIES.length];
    const feedbackCount = 5 + Math.floor(Math.random() * 80);
    const positiveCount = Math.floor(feedbackCount * (0.6 + Math.random() * 0.35));
    const negativeCount = Math.floor((feedbackCount - positiveCount) * Math.random());
    const neutralCount = feedbackCount - positiveCount - negativeCount;

    return {
      agent_id,
      feedback_count: feedbackCount,
      total_score: positiveCount * 4 + neutralCount * 2 - negativeCount * 2,
      positive_count: positiveCount,
      neutral_count: neutralCount,
      negative_count: negativeCount,
      verdict_count: Math.floor(Math.random() * 5),
      average_score: 2 + Math.random() * 3,
      last_updated: Date.now() - Math.floor(Math.random() * 86400000),
      trend: (["rising", "stable", "falling"] as const)[Math.floor(Math.random() * 3)],
      last_seen: Date.now() - Math.floor(Math.random() * 3600000),
      name: NAMES[i % NAMES.length],
      country: city.country,
      city: city.city,
      latency: { "us-east": 30 + Math.floor(Math.random() * 100) },
      geo_consistent: Math.random() > 0.1,
    };
  });
}

export function generateMockNetworkStats(): NetworkStats {
  return {
    agent_count: 28 + Math.floor(Math.random() * 15),
    interaction_count: 4500 + Math.floor(Math.random() * 2000),
    beacon_count: 12000 + Math.floor(Math.random() * 5000),
    beacon_bpm: 3 + Math.floor(Math.random() * 8),
    started_at: Date.now() - 86400000 * 14,
  };
}

export function generateMockEvent(): ActivityEvent {
  const types = ["JOIN", "FEEDBACK", "DISPUTE", "VERDICT"] as const;
  const type = types[Math.floor(Math.random() * types.length)];
  const agent = AGENT_IDS[Math.floor(Math.random() * AGENT_IDS.length)];
  const agentIdx = AGENT_IDS.indexOf(agent);
  const target = AGENT_IDS[Math.floor(Math.random() * AGENT_IDS.length)];
  const targetIdx = AGENT_IDS.indexOf(target);

  return {
    id: eventCounter++,
    ts: Math.floor(Date.now() / 1000),
    event_type: type,
    agent_id: agent,
    target_id: type !== "JOIN" ? target : undefined,
    score: type === "FEEDBACK" ? 1 + Math.floor(Math.random() * 5) : undefined,
    name: NAMES[agentIdx % NAMES.length],
    target_name: type !== "JOIN" ? NAMES[targetIdx % NAMES.length] : undefined,
    slot: Math.floor(Math.random() * 10000),
    conversation_id: type !== "JOIN" ? randomHexId().slice(0, 16) : undefined,
  };
}
