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

// City → coordinates lookup for globe visualization
// Aggregator returns country/city strings, globe needs lat/lng
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  "New York": { lat: 40.7128, lng: -74.006 },
  "Los Angeles": { lat: 34.0522, lng: -118.2437 },
  "San Francisco": { lat: 37.7749, lng: -122.4194 },
  Chicago: { lat: 41.8781, lng: -87.6298 },
  Miami: { lat: 25.7617, lng: -80.1918 },
  Seattle: { lat: 47.6062, lng: -122.3321 },
  Austin: { lat: 30.2672, lng: -97.7431 },
  Denver: { lat: 39.7392, lng: -104.9903 },
  London: { lat: 51.5074, lng: -0.1278 },
  Paris: { lat: 48.8566, lng: 2.3522 },
  Berlin: { lat: 52.52, lng: 13.405 },
  Amsterdam: { lat: 52.3676, lng: 4.9041 },
  Munich: { lat: 48.1351, lng: 11.582 },
  Frankfurt: { lat: 50.1109, lng: 8.6821 },
  Zurich: { lat: 47.3769, lng: 8.5417 },
  Vienna: { lat: 48.2082, lng: 16.3738 },
  Madrid: { lat: 40.4168, lng: -3.7038 },
  Barcelona: { lat: 41.3874, lng: 2.1686 },
  Rome: { lat: 41.9028, lng: 12.4964 },
  Milan: { lat: 45.4642, lng: 9.19 },
  Lisbon: { lat: 38.7223, lng: -9.1393 },
  Stockholm: { lat: 59.3293, lng: 18.0686 },
  Oslo: { lat: 59.9139, lng: 10.7522 },
  Copenhagen: { lat: 55.6761, lng: 12.5683 },
  Helsinki: { lat: 60.1699, lng: 24.9384 },
  Warsaw: { lat: 52.2297, lng: 21.0122 },
  "Kraków": { lat: 50.0647, lng: 19.945 },
  Krakow: { lat: 50.0647, lng: 19.945 },
  Prague: { lat: 50.0755, lng: 14.4378 },
  Budapest: { lat: 47.4979, lng: 19.0402 },
  Bucharest: { lat: 44.4268, lng: 26.1025 },
  Moscow: { lat: 55.7558, lng: 37.6173 },
  Istanbul: { lat: 41.0082, lng: 28.9784 },
  Tokyo: { lat: 35.6762, lng: 139.6503 },
  Seoul: { lat: 37.5665, lng: 126.978 },
  Shanghai: { lat: 31.2304, lng: 121.4737 },
  Beijing: { lat: 39.9042, lng: 116.4074 },
  "Hong Kong": { lat: 22.3193, lng: 114.1694 },
  Singapore: { lat: 1.3521, lng: 103.8198 },
  Bangkok: { lat: 13.7563, lng: 100.5018 },
  Dubai: { lat: 25.2048, lng: 55.2708 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Bangalore: { lat: 12.9716, lng: 77.5946 },
  "Tel Aviv": { lat: 32.0853, lng: 34.7818 },
  Lagos: { lat: 6.5244, lng: 3.3792 },
  Nairobi: { lat: -1.2921, lng: 36.8219 },
  "Cape Town": { lat: -33.9249, lng: 18.4241 },
  Cairo: { lat: 30.0444, lng: 31.2357 },
  "São Paulo": { lat: -23.5505, lng: -46.6333 },
  "Buenos Aires": { lat: -34.6037, lng: -58.3816 },
  "Mexico City": { lat: 19.4326, lng: -99.1332 },
  Bogota: { lat: 4.711, lng: -74.0721 },
  Lima: { lat: -12.0464, lng: -77.0428 },
  Sydney: { lat: -33.8688, lng: 151.2093 },
  Melbourne: { lat: -37.8136, lng: 144.9631 },
  Auckland: { lat: -36.8485, lng: 174.7633 },
  Toronto: { lat: 43.6532, lng: -79.3832 },
  Vancouver: { lat: 49.2827, lng: -123.1207 },
  Montreal: { lat: 45.5017, lng: -73.5673 },
};

// Country → approximate center coordinates (fallback when city is unknown)
const COUNTRY_COORDS: Record<string, { lat: number; lng: number }> = {
  US: { lat: 39.8283, lng: -98.5795 },
  GB: { lat: 51.5074, lng: -0.1278 },
  DE: { lat: 51.1657, lng: 10.4515 },
  FR: { lat: 46.2276, lng: 2.2137 },
  NL: { lat: 52.1326, lng: 5.2913 },
  JP: { lat: 36.2048, lng: 138.2529 },
  KR: { lat: 35.9078, lng: 127.7669 },
  SG: { lat: 1.3521, lng: 103.8198 },
  AU: { lat: -25.2744, lng: 133.7751 },
  BR: { lat: -14.235, lng: -51.9253 },
  IN: { lat: 20.5937, lng: 78.9629 },
  NG: { lat: 9.082, lng: 8.6753 },
  PL: { lat: 51.9194, lng: 19.1451 },
  TR: { lat: 38.9637, lng: 35.2433 },
  AE: { lat: 23.4241, lng: 53.8478 },
  CA: { lat: 56.1304, lng: -106.3468 },
  MX: { lat: 23.6345, lng: -102.5528 },
  AR: { lat: -38.4161, lng: -63.6167 },
  EG: { lat: 26.8206, lng: 30.8025 },
  KE: { lat: -0.0236, lng: 37.9062 },
  ZA: { lat: -30.5595, lng: 22.9375 },
  CN: { lat: 35.8617, lng: 104.1954 },
  RU: { lat: 61.524, lng: 105.3188 },
  IT: { lat: 41.8719, lng: 12.5674 },
  ES: { lat: 40.4637, lng: -3.7492 },
  PT: { lat: 39.3999, lng: -8.2245 },
  SE: { lat: 60.1282, lng: 18.6435 },
  NO: { lat: 60.472, lng: 8.4689 },
  DK: { lat: 56.2639, lng: 9.5018 },
  FI: { lat: 61.9241, lng: 25.7482 },
  CZ: { lat: 49.8175, lng: 15.473 },
  HU: { lat: 47.1625, lng: 19.5033 },
  RO: { lat: 45.9432, lng: 24.9668 },
  IL: { lat: 31.0461, lng: 34.8516 },
  TH: { lat: 15.87, lng: 100.9925 },
  CO: { lat: 4.5709, lng: -74.2973 },
  PE: { lat: -9.19, lng: -75.0152 },
  NZ: { lat: -40.9006, lng: 174.886 },
  CL: { lat: -35.6751, lng: -71.543 },
  UA: { lat: 48.3794, lng: 31.1656 },
  GR: { lat: 39.0742, lng: 21.8243 },
  AT: { lat: 47.5162, lng: 14.5501 },
  CH: { lat: 46.8182, lng: 8.2275 },
  BE: { lat: 50.5039, lng: 4.4699 },
  IE: { lat: 53.1424, lng: -7.6921 },
  HK: { lat: 22.3193, lng: 114.1694 },
};

/**
 * Resolve lat/lng from aggregator's country/city strings.
 * Returns jittered coordinates for privacy.
 */
export function resolveGeo(
  country?: string,
  city?: string
): { lat: number; lng: number } | null {
  if (city && CITY_COORDS[city]) {
    const coords = CITY_COORDS[city];
    const [lat, lng] = jitterGeo(coords.lat, coords.lng, 0.8);
    return { lat, lng };
  }

  if (country && COUNTRY_COORDS[country]) {
    const coords = COUNTRY_COORDS[country];
    const [lat, lng] = jitterGeo(coords.lat, coords.lng, 3);
    return { lat, lng };
  }

  return null;
}
