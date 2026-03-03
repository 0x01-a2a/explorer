export function jitterGeo(
  lat: number,
  lng: number,
  radius = 0.5
): [number, number] {
  const angle = Math.random() * 2 * Math.PI;
  const r = Math.sqrt(Math.random()) * radius;
  return [lat + r * Math.cos(angle), lng + r * Math.sin(angle)];
}

export const BOOTSTRAP_NODES: { lat: number; lng: number; label: string }[] = [
  { lat: 37.7749, lng: -122.4194, label: "US-West (GCP)" },
  { lat: 39.0438, lng: -77.4874, label: "US-East (GCP)" },
  { lat: 51.5074, lng: -0.1278, label: "EU-West (GCP)" },
  { lat: 50.1109, lng: 8.6821, label: "EU-Central (GCP)" },
  { lat: 1.3521, lng: 103.8198, label: "Asia-SE (GCP)" },
  { lat: 35.6762, lng: 139.6503, label: "Asia-NE (GCP)" },
];

export function nearestBootstrap(
  lat: number,
  lng: number
): { lat: number; lng: number; label: string } {
  let minDist = Infinity;
  let nearest = BOOTSTRAP_NODES[0];
  for (const node of BOOTSTRAP_NODES) {
    const dist = Math.hypot(node.lat - lat, node.lng - lng);
    if (dist < minDist) {
      minDist = dist;
      nearest = node;
    }
  }
  return nearest;
}
