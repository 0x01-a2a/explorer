"use client";

import { useEffect, useState, useCallback } from "react";
import type { AgentReputation } from "@/types/events";
import { generateMockAgents } from "@/lib/mock";

export function usePeers() {
  const [agents, setAgents] = useState<AgentReputation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAgents = useCallback(async () => {
    try {
      const res = await fetch("/api/peers");
      if (res.ok) {
        const data: AgentReputation[] = await res.json();
        setAgents(data);
      } else {
        setAgents(generateMockAgents());
      }
    } catch {
      setAgents(generateMockAgents());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
    const interval = setInterval(fetchAgents, 60000);
    return () => clearInterval(interval);
  }, [fetchAgents]);

  return { agents, loading };
}
