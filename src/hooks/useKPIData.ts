"use client";

import { useEffect, useState, useCallback } from "react";
import type { NetworkStats } from "@/types/events";
import { generateMockNetworkStats } from "@/lib/mock";

export function useKPIData(refreshInterval = 30000) {
  const [data, setData] = useState<NetworkStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/activity");
      if (res.ok) {
        const stats: NetworkStats = await res.json();
        setData(stats);
      } else {
        setData(generateMockNetworkStats());
      }
    } catch {
      setData(generateMockNetworkStats());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);

  return { data, loading };
}
