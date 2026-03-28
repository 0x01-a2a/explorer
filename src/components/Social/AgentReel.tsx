"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { EarningStoryCard } from "./EarningStoryCard";
import type { AgentReputation, ActivityEvent } from "@/types/events";

interface AgentReelProps {
  agents: AgentReputation[];
  events: ActivityEvent[];
  followed: Set<string>;
  onToggleFollow: (agentId: string) => void;
  onAgentClick: (agent: AgentReputation) => void;
}

const AUTO_ADVANCE_MS = 6000;

export function AgentReel({
  agents,
  events,
  followed,
  onToggleFollow,
  onAgentClick,
}: AgentReelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  // Build latest event per agent
  const latestByAgent = useMemo(() => {
    const map = new Map<string, ActivityEvent>();
    for (const ev of events) {
      for (const id of [ev.agent_id, ev.target_id].filter(Boolean) as string[]) {
        const cur = map.get(id);
        if (!cur || ev.ts > cur.ts) map.set(id, ev);
      }
    }
    return map;
  }, [events]);

  // Sort: followed first, then by recency
  const sorted = useMemo(() => {
    return [...agents]
      .sort((a, b) => {
        const fa = followed.has(a.agent_id) ? 1 : 0;
        const fb = followed.has(b.agent_id) ? 1 : 0;
        if (fb !== fa) return fb - fa;
        const ta = latestByAgent.get(a.agent_id)?.ts ?? a.last_seen;
        const tb = latestByAgent.get(b.agent_id)?.ts ?? b.last_seen;
        return tb - ta;
      })
      .slice(0, 20);
  }, [agents, latestByAgent, followed]);

  // Auto-advance
  useEffect(() => {
    if (hovering) return;
    const el = containerRef.current;
    if (!el || sorted.length < 2) return;

    const id = setInterval(() => {
      const itemH = el.clientHeight;
      const maxScroll = el.scrollHeight - itemH;
      if (el.scrollTop >= maxScroll - 4) {
        el.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ top: itemH, behavior: "smooth" });
      }
    }, AUTO_ADVANCE_MS);

    return () => clearInterval(id);
  }, [hovering, sorted.length]);

  if (sorted.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-xs text-white/25">Waiting for agents...</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-scroll glass-elevated rounded-xl"
      style={{
        scrollSnapType: "y mandatory",
        scrollbarWidth: "none",
        WebkitOverflowScrolling: "touch",
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <style>{`.reel-hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
      {sorted.map((agent) => (
        <EarningStoryCard
          key={agent.agent_id}
          agent={agent}
          isFollowed={followed.has(agent.agent_id)}
          onFollow={(e) => {
            e.stopPropagation();
            onToggleFollow(agent.agent_id);
          }}
          onClick={() => onAgentClick(agent)}
        />
      ))}
    </div>
  );
}
