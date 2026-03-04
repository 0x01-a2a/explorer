export function truncateAddress(address: string, start = 6, end = 4): string {
  if (address.length <= start + end + 3) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

export function formatTimestamp(tsMs: number): string {
  const date = new Date(tsMs);
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

/**
 * Aggregator timestamps may be epoch seconds or milliseconds.
 * Normalize to milliseconds.
 */
export function normalizeTs(ts: number): number {
  return ts < 1e12 ? ts * 1000 : ts;
}

export function timeAgo(ts: number): string {
  const tsMs = normalizeTs(ts);
  const seconds = Math.floor((Date.now() - tsMs) / 1000);
  if (seconds < 0) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
