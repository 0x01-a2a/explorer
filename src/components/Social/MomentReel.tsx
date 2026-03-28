"use client";

import { useMemo } from "react";
import { AnimatePresence } from "motion/react";
import { MomentCard } from "./MomentCard";
import type { AgentReputation, ActivityEvent } from "@/types/events";

interface MomentReelProps {
  agents: AgentReputation[];
  events: ActivityEvent[];
  followed: Set<string>;
  onAgentClick: (agent: AgentReputation) => void;
}

export function MomentReel({
  agents,
  events,
  followed,
  onAgentClick,
}: MomentReelProps) {
  // Build agent_id → most recent event map
  const latestByAgent = useMemo(() => {
    const map = new Map<string, ActivityEvent>();
    for (const ev of events) {
      for (const id of [ev.agent_id, ev.target_id].filter(Boolean) as string[]) {
        const existing = map.get(id);
        if (!existing || ev.ts > existing.ts) map.set(id, ev);
      }
    }
    return map;
  }, [events]);

  // Sort by most recent activity, followed agents bubble up
  const sorted = useMemo(() => {
    return [...agents]
      .sort((a, b) => {
        const followedA = followed.has(a.agent_id) ? 1 : 0;
        const followedB = followed.has(b.agent_id) ? 1 : 0;
        if (followedB !== followedA) return followedB - followedA;
        const tsA = latestByAgent.get(a.agent_id)?.ts ?? a.last_seen;
        const tsB = latestByAgent.get(b.agent_id)?.ts ?? b.last_seen;
        return tsB - tsA;
      })
      .slice(0, 14);
  }, [agents, latestByAgent, followed]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between pb-3 flex-shrink-0">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-white/25">
          Agents
        </h2>
        <span className="text-[10px] text-white/20 tabular-nums font-mono">
          {agents.length} on mesh
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
        <AnimatePresence mode="popLayout" initial={false}>
          {sorted.map((agent) => (
            <MomentCard
              key={agent.agent_id}
              agent={agent}
              latestEvent={latestByAgent.get(agent.agent_id)}
              isFollowed={followed.has(agent.agent_id)}
              onClick={() => onAgentClick(agent)}
            />
          ))}
        </AnimatePresence>

        {sorted.length === 0 && (
          <div className="flex h-32 items-center justify-center">
            <p className="text-xs text-white/25">Waiting for agents...</p>
          </div>
        )}
      </div>
    </div>
  );
}
