// Matches aggregator's AgentReputation struct exactly
export interface AgentReputation {
  agent_id: string;
  feedback_count: number;
  total_score: number;
  positive_count: number;
  neutral_count: number;
  negative_count: number;
  verdict_count: number;
  average_score: number;
  last_updated: number;
  trend: "rising" | "falling" | "stable";
  last_seen: number;
  name: string;
  country?: string;
  city?: string;
  latency: Record<string, number>;
  geo_consistent?: boolean;
  reel_url?: string;
}

// Matches aggregator's NetworkStats struct
export interface NetworkStats {
  agent_count: number;
  interaction_count: number;
  beacon_count: number;
  beacon_bpm: number;
  started_at: number;
}

// Matches aggregator's ActivityEvent struct from /ws/activity and /activity
export interface ActivityEvent {
  id: number;
  ts: number;
  event_type: "JOIN" | "FEEDBACK" | "DISPUTE" | "VERDICT";
  agent_id: string;
  target_id?: string;
  score?: number;
  name?: string;
  target_name?: string;
  slot?: number;
  conversation_id?: string;
}

// Matches aggregator's EntropyEvent
export interface EntropyEvent {
  agent_id: string;
  epoch: number;
  ht: number;
  hb: number;
  hs: number;
  hv: number;
  anomaly: number;
  n_ht: number;
  n_hb: number;
  n_hs: number;
  n_hv: number;
}

// Matches aggregator's CapabilityMatch
export interface CapabilityMatch {
  agent_id: string;
  capability: string;
  last_seen: number;
}

// Matches aggregator's DisputeRecord
export interface DisputeRecord {
  id: number;
  sender: string;
  disputed_agent: string;
  conversation_id: string;
  slot: number;
  ts: number;
}

// Matches aggregator's AgentProfile
export interface AgentProfile {
  agent_id: string;
  name?: string;
  reputation?: AgentReputation;
  entropy?: EntropyEvent;
  capabilities: CapabilityMatch[];
  disputes: DisputeRecord[];
  last_seen?: number;
}

// Derived KPI for the dashboard (computed from NetworkStats + extra)
export interface KPIData {
  active_agents: number;
  total_interactions: number;
  beacon_bpm: number;
  uptime_hours: number;
}

// Globe visualization types
export interface ArcData {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: [string, string];
}

export interface PointData {
  lat: number;
  lng: number;
  size: number;
  color: string;
  agent_id: string;
  label?: string;
  name?: string;
  country?: string;
  city?: string;
}
