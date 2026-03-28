import type { AgentReputation } from "@/types/events";

// Country code → common first names pool
const COUNTRY_NAMES: Record<string, string[]> = {
  US: ["James", "Emily", "Marcus", "Sara", "Tyler"],
  GB: ["Oliver", "Charlotte", "Harry", "Emma", "Liam"],
  FR: ["Julien", "Marie", "Baptiste", "Camille", "Louis"],
  DE: ["Thomas", "Anna", "Felix", "Laura", "Max"],
  JP: ["Kenji", "Yuki", "Hiroshi", "Aiko", "Sota"],
  SG: ["Wei", "Mei", "Rajan", "Priya", "Jun"],
  AU: ["Ethan", "Sophie", "Lachlan", "Chloe", "Jack"],
  KR: ["Jiwoo", "Sooyeon", "Minjun", "Hyejin", "Taehyun"],
  IN: ["Aryan", "Priya", "Rohan", "Sneha", "Vikram"],
  BR: ["Gabriel", "Isabela", "Lucas", "Mariana", "Mateus"],
  NG: ["Emeka", "Amaka", "Chidi", "Ngozi", "Tunde"],
  TR: ["Emre", "Zeynep", "Berk", "Elif", "Mert"],
  AE: ["Ahmed", "Fatima", "Khalid", "Layla", "Omar"],
  PL: ["Piotr", "Katarzyna", "Marek", "Agnieszka", "Michał"],
  HU: ["Bence", "Eszter", "Dávid", "Réka", "Ádám"],
  NO: ["Lars", "Ingrid", "Erik", "Sigrid", "Olav"],
  IT: ["Marco", "Sofia", "Luca", "Giulia", "Matteo"],
};

const FALLBACK_NAMES = ["Alex", "Sam", "Jordan", "Casey", "Riley"];

// Country code → time-of-day flavor
const TZ_FLAVOR: Record<string, { hour: number; label: string }[]> = {
  US: [{ hour: 2, label: "2am in New York" }, { hour: 23, label: "11pm in San Francisco" }],
  GB: [{ hour: 1, label: "1am in London" }, { hour: 22, label: "10pm in London" }],
  FR: [{ hour: 2, label: "2am in Paris" }],
  DE: [{ hour: 3, label: "3am in Berlin" }, { hour: 23, label: "11pm in Munich" }],
  JP: [{ hour: 4, label: "4am in Tokyo" }],
  SG: [{ hour: 3, label: "3am in Singapore" }],
  AU: [{ hour: 1, label: "1am in Sydney" }],
  KR: [{ hour: 4, label: "4am in Seoul" }],
  IN: [{ hour: 0, label: "midnight in Mumbai" }],
  BR: [{ hour: 3, label: "3am in São Paulo" }],
  NG: [{ hour: 2, label: "2am in Lagos" }],
  TR: [{ hour: 2, label: "2am in Istanbul" }],
  AE: [{ hour: 3, label: "3am in Dubai" }],
  PL: [{ hour: 3, label: "3am in Warsaw" }],
  HU: [{ hour: 3, label: "3am in Budapest" }],
  NO: [{ hour: 1, label: "1am in Oslo" }],
  IT: [{ hour: 2, label: "2am in Milan" }],
};

const FALLBACK_TZ = [{ hour: 2, label: "2am" }];

// Job type descriptions
const JOB_TYPES = [
  "web research jobs",
  "data extraction tasks",
  "content summarization jobs",
  "API integration tasks",
  "document analysis jobs",
  "translation tasks",
  "code review jobs",
  "market research tasks",
];

// Sleep verbs
const SLEEP_VERBS = ["sleeps", "is fast asleep", "rests", "is offline"];

// Deterministic hash from string
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export interface EarningStory {
  ownerName: string;
  timeLabel: string;
  agentName: string;
  city: string;
  country: string;
  jobsThisWeek: number;
  jobType: string;
  apiCostUsd: number;
  earnedUsd: number;
  netUsd: number;
  netSol: number;
  trend: "rising" | "stable" | "falling";
  averageScore: number;
  isTopAgent: boolean;
  sleepVerb: string;
}

const SOL_PRICE_USD = 90;
// Avg earnings per job based on score: score * $0.50 roughly
const EARNINGS_PER_JOB_BASE = 0.5;
// API cost = ~6.5% of gross earnings
const API_COST_RATIO = 0.065;

export function buildStory(agent: AgentReputation): EarningStory {
  const h = hash(agent.agent_id);
  const country = agent.country ?? "US";

  const namePool = COUNTRY_NAMES[country] ?? FALLBACK_NAMES;
  const ownerName = namePool[h % namePool.length];

  const tzPool = TZ_FLAVOR[country] ?? FALLBACK_TZ;
  const tzEntry = tzPool[h % tzPool.length];

  // Jobs this week: scale feedback_count down to a weekly slice (assume 4-week history)
  const jobsThisWeek = Math.max(1, Math.round(agent.feedback_count / 4));

  const jobType = JOB_TYPES[h % JOB_TYPES.length];
  const sleepVerb = SLEEP_VERBS[h % SLEEP_VERBS.length];

  // Earnings: per-job value scaled by average score
  const earnedUsd = Math.round(jobsThisWeek * agent.average_score * EARNINGS_PER_JOB_BASE * 100) / 100;
  const apiCostUsd = Math.round(earnedUsd * API_COST_RATIO * 100) / 100;
  const netUsd = Math.round((earnedUsd - apiCostUsd) * 100) / 100;
  const netSol = Math.round((netUsd / SOL_PRICE_USD) * 1000) / 1000;

  const isTopAgent = agent.average_score >= 4.5 && agent.feedback_count >= 30;

  return {
    ownerName,
    timeLabel: tzEntry.label,
    agentName: agent.name ?? agent.agent_id.slice(0, 8),
    city: agent.city ?? "",
    country,
    jobsThisWeek,
    jobType,
    apiCostUsd,
    earnedUsd,
    netUsd,
    netSol,
    trend: agent.trend,
    averageScore: agent.average_score,
    isTopAgent,
    sleepVerb,
  };
}
