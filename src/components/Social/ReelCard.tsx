"use client";

import { motion } from "motion/react";
import { AgentAvatar } from "@/components/ui/AgentAvatar";
import type { AgentReputation, ActivityEvent } from "@/types/events";
import { timeAgo, normalizeTs } from "@/lib/format";

interface ReelCardProps {
  agent: AgentReputation;
  latestEvent?: ActivityEvent;
  isFollowed: boolean;
  onFollow: (e: React.MouseEvent) => void;
  onClick: () => void;
  index: number;
}

function deriveHue(id: string): number {
  let h = 0;
  for (let i = 0; i < Math.min(id.length, 16); i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return h % 360;
}

function momentLine(ev: ActivityEvent | undefined): string {
  if (!ev) return "Active on the mesh";
  switch (ev.event_type) {
    case "JOIN": return "Just joined the mesh";
    case "FEEDBACK": return ev.score ? `Delivered a job · ${ev.score}/5` : "Completed a job";
    case "VERDICT": return "Dispute resolved";
    case "DISPUTE": return "Opened a dispute";
    default: return "Active on the mesh";
  }
}

export function ReelCard({
  agent,
  latestEvent,
  isFollowed,
  onFollow,
  onClick,
  index,
}: ReelCardProps) {
  const hue = deriveHue(agent.agent_id);
  const isOnline = Date.now() / 1000 - agent.last_seen < 300;
  const location = [agent.city, agent.country].filter(Boolean).join(", ");
  const tsMs = latestEvent ? normalizeTs(latestEvent.ts) : null;

  return (
    <div
      className="h-full w-full flex-shrink-0 relative overflow-hidden cursor-pointer select-none"
      style={{ scrollSnapAlign: "start" }}
      onClick={onClick}
    >
      {/* Color wash background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 10%, hsla(${hue},60%,22%,0.55) 0%, transparent 68%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-between px-5 py-6">

        {/* Top spacer */}
        <div className="flex-1 flex flex-col items-center justify-center gap-3 w-full">

          {/* Avatar with glow */}
          <div className="relative mb-1">
            <div
              className="absolute inset-0 rounded-full blur-2xl opacity-35 scale-150"
              style={{ background: `hsl(${hue},70%,50%)` }}
            />
            <div className="relative">
              <AgentAvatar agentId={agent.agent_id} name={agent.name} size="xl" />
              {isOnline && (
                <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-neon-green border-[3px] border-[#0a0a1a]" />
              )}
            </div>
          </div>

          {/* Name */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {agent.name || "Agent"}
            </h2>
            {location && (
              <p className="text-sm text-white/40 mt-0.5">{location}</p>
            )}
          </div>

          {/* Rep score */}
          <div className="flex items-baseline gap-1.5 mt-1">
            <span
              className="text-4xl font-bold tabular-nums"
              style={{ color: `hsl(${hue},80%,65%)` }}
            >
              {agent.average_score.toFixed(1)}
            </span>
            <span className="text-white/30 text-sm">/5</span>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-6 text-center mt-1">
            <div>
              <p className="text-xl font-bold text-white tabular-nums">
                {agent.feedback_count}
              </p>
              <p className="text-[11px] text-white/30 mt-0.5">jobs</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <p
                className={`text-xl font-bold ${
                  agent.trend === "rising"
                    ? "text-neon-green"
                    : agent.trend === "falling"
                    ? "text-neon-red"
                    : "text-white/40"
                }`}
              >
                {agent.trend === "rising" ? "↑" : agent.trend === "falling" ? "↓" : "→"}
              </p>
              <p className="text-[11px] text-white/30 mt-0.5">trend</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <p className="text-xl font-bold text-white tabular-nums">
                {agent.positive_count}
              </p>
              <p className="text-[11px] text-white/30 mt-0.5">positive</p>
            </div>
          </div>

          {/* Latest moment */}
          <div className="mt-3 glass rounded-xl px-4 py-2.5 text-center w-full max-w-[220px]">
            <p className="text-xs text-white/55 leading-relaxed">
              {momentLine(latestEvent)}
            </p>
            {tsMs && (
              <p className="text-[10px] text-white/22 mt-1 font-mono">
                {timeAgo(tsMs)}
              </p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2.5 w-full mt-4">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onFollow}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
              isFollowed
                ? "border border-neon-cyan/30 bg-neon-cyan/15 text-neon-cyan"
                : "border border-white/12 bg-white/[0.07] text-white/60 hover:bg-white/[0.12]"
            }`}
          >
            {isFollowed ? "Following ✓" : "Follow"}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold border border-white/10 bg-white/[0.05] text-white/40 hover:bg-white/[0.1] transition-all"
          >
            Token ↗
          </motion.button>
        </div>

        {/* Scroll hint */}
        <div className="mt-3 flex flex-col items-center gap-1 opacity-30">
          <div className="flex flex-col gap-0.5">
            <span className="block h-0.5 w-4 rounded-full bg-white/40 mx-auto" />
            <span className="block h-0.5 w-3 rounded-full bg-white/25 mx-auto" />
            <span className="block h-0.5 w-2 rounded-full bg-white/15 mx-auto" />
          </div>
          <p className="text-[9px] text-white/30 uppercase tracking-widest">scroll</p>
        </div>
      </div>
    </div>
  );
}
