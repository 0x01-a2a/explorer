import type {
  ActivityEvent,
  PeerSnapshot,
  KPIData,
  ActivityEventType,
} from "@/types/events";
import { jitterGeo } from "./geo";

const CITIES: { lat: number; lng: number; country: string; city: string }[] = [
  { lat: 40.7128, lng: -74.006, country: "US", city: "New York" },
  { lat: 34.0522, lng: -118.2437, country: "US", city: "Los Angeles" },
  { lat: 51.5074, lng: -0.1278, country: "GB", city: "London" },
  { lat: 48.8566, lng: 2.3522, country: "FR", city: "Paris" },
  { lat: 52.52, lng: 13.405, country: "DE", city: "Berlin" },
  { lat: 35.6762, lng: 139.6503, country: "JP", city: "Tokyo" },
  { lat: 1.3521, lng: 103.8198, country: "SG", city: "Singapore" },
  { lat: -33.8688, lng: 151.2093, country: "AU", city: "Sydney" },
  { lat: 55.7558, lng: 37.6173, country: "RU", city: "Moscow" },
  { lat: 37.5665, lng: 126.978, country: "KR", city: "Seoul" },
  { lat: 19.076, lng: 72.8777, country: "IN", city: "Mumbai" },
  { lat: -23.5505, lng: -46.6333, country: "BR", city: "São Paulo" },
  { lat: 30.0444, lng: 31.2357, country: "EG", city: "Cairo" },
  { lat: 41.0082, lng: 28.9784, country: "TR", city: "Istanbul" },
  { lat: 25.2048, lng: 55.2708, country: "AE", city: "Dubai" },
  { lat: 50.0647, lng: 19.945, country: "PL", city: "Kraków" },
  { lat: 52.2297, lng: 21.0122, country: "PL", city: "Warsaw" },
  { lat: 47.4979, lng: 19.0402, country: "HU", city: "Budapest" },
  { lat: 59.9139, lng: 10.7522, country: "NO", city: "Oslo" },
  { lat: 45.4642, lng: 9.19, country: "IT", city: "Milan" },
];

const SERVICES = [
  "coding",
  "translation",
  "data_analysis",
  "local_delivery",
  "image_gen",
  "web_scraping",
  "nlp",
  "audio_transcription",
  "summarization",
  "verification",
];

function randomId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let result = "sati";
  for (let i = 0; i < 40; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

const AGENT_IDS = Array.from({ length: 35 }, () => randomId());

export function generateMockPeers(): PeerSnapshot[] {
  return AGENT_IDS.map((agent_id, i) => {
    const city = CITIES[i % CITIES.length];
    const [lat, lng] = jitterGeo(city.lat, city.lng, 1.5);
    const numServices = 1 + Math.floor(Math.random() * 3);
    const shuffled = [...SERVICES].sort(() => Math.random() - 0.5);
    return {
      agent_id,
      peer_id: `12D3KooW${randomId().slice(0, 20)}`,
      sati_ok: Math.random() > 0.1,
      lease_ok: Math.random() > 0.15,
      last_active_epoch: Date.now() - Math.floor(Math.random() * 86400000),
      geo: {
        lat,
        lng,
        country: city.country,
        city: city.city,
        region: `${city.country}-${city.city.slice(0, 4)}`,
      },
      services: shuffled.slice(0, numServices),
    };
  });
}

export function generateMockKPI(): KPIData {
  return {
    mesh_volume_24h: 12450 + Math.floor(Math.random() * 3000),
    active_agents_24h: 28 + Math.floor(Math.random() * 15),
    completed_quests_24h: 156 + Math.floor(Math.random() * 50),
  };
}

export function generateMockEvent(): ActivityEvent {
  const types: ActivityEventType[] = [
    "JOIN",
    "FEEDBACK",
    "DISPUTE",
    "VERDICT",
    "ADVERTISE",
    "ESCROW_LOCKED",
    "ESCROW_RELEASED",
  ];
  const type = types[Math.floor(Math.random() * types.length)];
  const agent = AGENT_IDS[Math.floor(Math.random() * AGENT_IDS.length)];
  const target = AGENT_IDS[Math.floor(Math.random() * AGENT_IDS.length)];
  const city = CITIES[Math.floor(Math.random() * CITIES.length)];

  return {
    id: crypto.randomUUID(),
    ts: Date.now(),
    event_type: type,
    agent_id: agent,
    target_id: type === "FEEDBACK" || type === "VERDICT" ? target : undefined,
    score: type === "FEEDBACK" ? 60 + Math.floor(Math.random() * 40) : undefined,
    amount:
      type === "ESCROW_LOCKED" || type === "ESCROW_RELEASED"
        ? parseFloat((0.5 + Math.random() * 9.5).toFixed(2))
        : undefined,
    service:
      type === "ADVERTISE"
        ? SERVICES[Math.floor(Math.random() * SERVICES.length)]
        : undefined,
    region: `${city.country}-${city.city.slice(0, 4)}`,
  };
}
