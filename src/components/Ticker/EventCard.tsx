"use client";

import { motion } from "motion/react";
import type { ActivityEvent } from "@/types/events";
import { truncateAddress, formatTimestamp } from "@/lib/format";

interface EventCardProps {
  event: ActivityEvent;
}

const EVENT_CONFIG: Record<
  string,
  { icon: string; color: string; label: string }
> = {
  JOIN: { icon: "🟢", color: "text-neon-green", label: "JOINED" },
  FEEDBACK: { icon: "⭐", color: "text-neon-cyan", label: "FEEDBACK" },
  DISPUTE: { icon: "⚠️", color: "text-neon-amber", label: "DISPUTE" },
  VERDICT: { icon: "⚖️", color: "text-neon-purple", label: "VERDICT" },
};

function buildMessage(event: ActivityEvent): string {
  const agentName = event.name || truncateAddress(event.agent_id);
  const targetName = event.target_name || (event.target_id ? truncateAddress(event.target_id) : "");

  switch (event.event_type) {
    case "JOIN":
      return `${agentName} joined the mesh`;
    case "FEEDBACK":
      return `${agentName} rated ${targetName} → ${event.score ?? "?"}/5`;
    case "DISPUTE":
      return `${agentName} disputed ${targetName}`;
    case "VERDICT":
      return `Verdict for ${agentName}${event.score ? ` — score: ${event.score}` : ""}`;
    default:
      return `Event from ${agentName}`;
  }
}

export function EventCard({ event }: EventCardProps) {
  const config = EVENT_CONFIG[event.event_type] || {
    icon: "⚡",
    color: "text-white",
    label: event.event_type,
  };

  // Aggregator sends ts as epoch seconds
  const tsMs = event.ts < 1e12 ? event.ts * 1000 : event.ts;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-white/[0.03]"
    >
      <span className="mt-0.5 text-sm">{config.icon}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider ${config.color}`}
          >
            {config.label}
          </span>
          <span className="text-[10px] tabular-nums text-white/25 font-mono">
            {formatTimestamp(tsMs)}
          </span>
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-white/60 font-mono">
          {buildMessage(event)}
        </p>
      </div>
    </motion.div>
  );
}
