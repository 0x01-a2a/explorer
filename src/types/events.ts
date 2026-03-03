export type ActivityEventType =
  | "JOIN"
  | "FEEDBACK"
  | "DISPUTE"
  | "VERDICT"
  | "ADVERTISE"
  | "ESCROW_LOCKED"
  | "ESCROW_RELEASED";

export interface ActivityEvent {
  id: string;
  ts: number;
  event_type: ActivityEventType;
  agent_id: string;
  target_id?: string;
  score?: number;
  name?: string;
  target_name?: string;
  slot?: number;
  conversation_id?: string;
  amount?: number;
  service?: string;
  region?: string;
}

export interface PeerSnapshot {
  agent_id: string;
  peer_id: string;
  sati_ok: boolean;
  lease_ok: boolean;
  last_active_epoch: number;
  geo?: {
    lat: number;
    lng: number;
    country?: string;
    city?: string;
    region?: string;
  };
  services?: string[];
}

export interface ReputationSnapshot {
  agent_id: string;
  reliability: number;
  cooperation: number;
  notary_accuracy: number;
  total_tasks: number;
  total_disputes: number;
  last_active_epoch: number;
}

export interface KPIData {
  mesh_volume_24h: number;
  active_agents_24h: number;
  completed_quests_24h: number;
}

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
  services?: string[];
  region?: string;
}
