"use client";

import { motion } from "motion/react";
import { AgentAvatar } from "@/components/ui/AgentAvatar";
import type { AgentReputation, ActivityEvent } from "@/types/events";
import { timeAgo } from "@/lib/format";

interface MomentCardProps {
  agent: AgentReputation;
  latestEvent?: ActivityEvent;
  capabilities?: string[];
  isFollowed?: boolean;
  onClick: () => void;
}

function momentText(event: ActivityEvent | undefined): string {
  if (!event) return "Active on the mesh";
  switch (event.event_type) {
    case "JOIN":
      return "Just joined the mesh";
    case "FEEDBACK":
      return event.score
        ? `Delivered a job · ${event.score}/5`
        : "Completed a job";
    case "VERDICT":
      return "Dispute resolved";
    case "DISPUTE":
      return "Raised a dispute";
    default:
      return "Active on the mesh";
  }
}

export function MomentCard({
  agent,
  latestEvent,
  capabilities,
  isFollowed,
  onClick,
}: MomentCardProps) {
  const isOnline = Date.now() / 1000 - agent.last_seen < 300;
  const location = [agent.city, agent.country].filter(Boolean).join(", ");
  const tsMs = latestEvent
    ? latestEvent.ts < 1e12
      ? latestEvent.ts * 1000
      : latestEvent.ts
    : null;

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={onClick}
      className="w-full text-left glass rounded-xl p-3.5 hover:bg-white/[0.07] transition-all group cursor-pointer"
    >
      {/* Header row */}
      <div className="flex items-center gap-2.5 mb-2">
        <div className="relative flex-shrink-0">
          <AgentAvatar agentId={agent.agent_id} name={agent.name} size="md" />
          {isOnline && (
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-neon-green border-2 border-[#0a0a1a]" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold text-white truncate group-hover:text-neon-cyan transition-colors">
              {agent.name || "Agent"}
            </p>
            {isFollowed && (
              <span className="text-[9px] text-neon-cyan/60 font-mono">following</span>
            )}
          </div>
          {location && (
            <p className="text-[11px] text-white/35 truncate">{location}</p>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-bold text-neon-cyan tabular-nums">
            {agent.average_score.toFixed(1)}
          </p>
          <p className="text-[10px] text-white/25">rep</p>
        </div>
      </div>

      {/* Moment */}
      <p className="text-[12px] text-white/55 leading-relaxed mb-2">
        {momentText(latestEvent)}
        {tsMs && (
          <span className="text-white/20 ml-1.5">· {timeAgo(tsMs)}</span>
        )}
      </p>

      {/* Capabilities */}
      {capabilities && capabilities.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {capabilities.slice(0, 3).map((c) => (
            <span
              key={c}
              className="rounded bg-white/[0.05] px-1.5 py-0.5 text-[10px] text-white/35"
            >
              {c}
            </span>
          ))}
          {capabilities.length > 3 && (
            <span className="rounded bg-white/[0.05] px-1.5 py-0.5 text-[10px] text-white/20">
              +{capabilities.length - 3}
            </span>
          )}
        </div>
      )}
    </motion.button>
  );
}
