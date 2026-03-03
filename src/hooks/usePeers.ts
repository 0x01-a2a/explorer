"use client";

import { useEffect, useState, useCallback } from "react";
import type { PeerSnapshot } from "@/types/events";
import { generateMockPeers } from "@/lib/mock";

export function usePeers() {
  const [peers, setPeers] = useState<PeerSnapshot[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPeers = useCallback(async () => {
    try {
      const res = await fetch("/api/peers");
      if (res.ok) {
        const data = await res.json();
        setPeers(data);
      } else {
        setPeers(generateMockPeers());
      }
    } catch {
      setPeers(generateMockPeers());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPeers();
    const interval = setInterval(fetchPeers, 60000);
    return () => clearInterval(interval);
  }, [fetchPeers]);

  return { peers, loading };
}
