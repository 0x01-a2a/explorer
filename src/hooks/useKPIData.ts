"use client";

import { useEffect, useState, useCallback } from "react";
import type { KPIData } from "@/types/events";
import { generateMockKPI } from "@/lib/mock";

export function useKPIData(refreshInterval = 30000) {
  const [data, setData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/activity");
      if (res.ok) {
        const kpi = await res.json();
        setData(kpi);
      } else {
        setData(generateMockKPI());
      }
    } catch {
      setData(generateMockKPI());
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
