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
  FEEDBACK: { icon: "🔵", color: "text-neon-cyan", label: "FEEDBACK" },
  DISPUTE: { icon: "🟠", color: "text-neon-amber", label: "DISPUTE" },
  VERDICT: { icon: "⚖️", color: "text-neon-purple", label: "VERDICT" },
  ADVERTISE: { icon: "📢", color: "text-neon-cyan", label: "ADVERTISE" },
  ESCROW_LOCKED: { icon: "🔒", color: "text-neon-amber", label: "ESCROW" },
  ESCROW_RELEASED: { icon: "💰", color: "text-neon-green", label: "RELEASED" },
};

function buildMessage(event: ActivityEvent): string {
  const agent = truncateAddress(event.agent_id);
  switch (event.event_type) {
    case "JOIN":
      return `Agent ${agent} joined the mesh${event.region ? ` (${event.region})` : ""}`;
    case "ADVERTISE":
      return `'${event.service || "service"}' offered by ${agent}${event.amount ? ` at ${event.amount} USDC` : ""}`;
    case "ESCROW_LOCKED":
      return `${event.amount?.toFixed(2) || "?"} USDC locked by ${agent}`;
    case "ESCROW_RELEASED":
      return `${event.amount?.toFixed(2) || "?"} USDC released to ${agent}`;
    case "FEEDBACK":
      return `${agent} scored ${event.score || "?"}/100${event.target_id ? ` for ${truncateAddress(event.target_id)}` : ""}`;
    case "DISPUTE":
      return `Dispute raised by ${agent}${event.target_id ? ` against ${truncateAddress(event.target_id)}` : ""}`;
    case "VERDICT":
      return `Verdict delivered for ${agent}${event.score ? ` — score: ${event.score}` : ""}`;
    default:
      return `Event from ${agent}`;
  }
}

export function EventCard({ event }: EventCardProps) {
  const config = EVENT_CONFIG[event.event_type] || {
    icon: "⚡",
    color: "text-white",
    label: event.event_type,
  };

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
            {formatTimestamp(event.ts)}
          </span>
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-white/60 font-mono">
          {buildMessage(event)}
        </p>
      </div>
    </motion.div>
  );
}
