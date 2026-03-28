"use client";

import { motion } from "motion/react";
import { AgentAvatar } from "@/components/ui/AgentAvatar";
import type { AgentReputation } from "@/types/events";
import { buildStory } from "@/lib/stories";

interface EarningStoryCardProps {
  agent: AgentReputation;
  isFollowed: boolean;
  onFollow: (e: React.MouseEvent) => void;
  onClick: () => void;
}

function deriveHue(id: string): number {
  let h = 0;
  for (let i = 0; i < Math.min(id.length, 16); i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return h % 360;
}

function TrendBadge({ trend }: { trend: "rising" | "stable" | "falling" }) {
  if (trend === "rising")
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-neon-green/25 bg-neon-green/10 px-2 py-0.5 text-[10px] text-neon-green font-mono">
        ↑ rising
      </span>
    );
  if (trend === "falling")
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-neon-red/25 bg-neon-red/10 px-2 py-0.5 text-[10px] text-neon-red font-mono">
        ↓ falling
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/35 font-mono">
      → stable
    </span>
  );
}

export function EarningStoryCard({
  agent,
  isFollowed,
  onFollow,
  onClick,
}: EarningStoryCardProps) {
  const hue = deriveHue(agent.agent_id);
  const story = buildStory(agent);
  const isOnline = Date.now() / 1000 - agent.last_seen < 300;

  return (
    <div
      className="h-full w-full flex-shrink-0 relative overflow-hidden cursor-pointer select-none"
      style={{ scrollSnapAlign: "start" }}
      onClick={onClick}
    >
      {/* Ambient color wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, hsla(${hue},50%,18%,0.7) 0%, transparent 65%)`,
        }}
      />
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(255,255,255,0.5) 31px, rgba(255,255,255,0.5) 32px), repeating-linear-gradient(90deg, transparent, transparent 31px, rgba(255,255,255,0.5) 31px, rgba(255,255,255,0.5) 32px)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col px-5 pt-8 pb-5">

        {/* Time + place header */}
        <div className="mb-5">
          <p className="text-[11px] font-mono text-white/30 uppercase tracking-widest mb-1">
            It&apos;s {story.timeLabel}
          </p>
          <p className="text-white/50 text-sm leading-relaxed">
            While{" "}
            <span className="text-white/80 font-semibold">{story.ownerName}</span>{" "}
            {story.sleepVerb}, their agent{" "}
            <span style={{ color: `hsl(${hue},80%,65%)` }} className="font-semibold">
              {story.agentName}
            </span>{" "}
            just completed its{" "}
            <span className="text-white/80 font-semibold">{story.jobsThisWeek}th</span> job this
            week.
          </p>
        </div>

        {/* Earning breakdown card */}
        <div
          className="rounded-2xl border px-5 py-4 mb-5 backdrop-blur-sm"
          style={{
            borderColor: `hsla(${hue},50%,50%,0.15)`,
            background: `hsla(${hue},40%,12%,0.45)`,
          }}
        >
          <p className="text-[10px] uppercase tracking-widest text-white/25 font-mono mb-3">
            This week
          </p>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/45">API costs</span>
              <span className="text-sm font-mono text-white/50">
                −${story.apiCostUsd.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/45">Earned</span>
              <span className="text-sm font-mono text-neon-cyan">
                +${story.earnedUsd.toFixed(2)}
              </span>
            </div>
            <div className="h-px bg-white/8 my-1" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white/70">Net</span>
              <div className="flex items-baseline gap-1.5">
                <span
                  className="text-xl font-bold tabular-nums"
                  style={{ color: `hsl(${hue},80%,65%)` }}
                >
                  +${story.netUsd.toFixed(2)}
                </span>
                <span className="text-[10px] text-white/25 font-mono">
                  ({story.netSol.toFixed(3)} SOL)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Job type + trend */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-[10px] font-mono text-white/30 bg-white/5 border border-white/8 rounded-full px-2.5 py-1">
            {story.jobType}
          </span>
          <TrendBadge trend={story.trend} />
          {story.isTopAgent && (
            <span className="text-[10px] font-mono text-neon-amber border border-neon-amber/20 bg-neon-amber/8 rounded-full px-2.5 py-1">
              top agent
            </span>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Agent identity footer */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-shrink-0">
            <AgentAvatar agentId={agent.agent_id} name={agent.name} size="md" />
            {isOnline && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-neon-green border-2 border-[#0a0a1a]" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white/80 truncate">
              {story.agentName}
            </p>
            {story.city ? (
              <p className="text-[11px] text-white/30 truncate">
                {story.city}, {story.country}
              </p>
            ) : null}
          </div>
          <div className="ml-auto flex items-baseline gap-1">
            <span
              className="text-lg font-bold tabular-nums"
              style={{ color: `hsl(${hue},75%,60%)` }}
            >
              {story.averageScore.toFixed(1)}
            </span>
            <span className="text-white/25 text-xs">/5</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2.5">
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
        <div className="mt-4 flex flex-col items-center gap-1 opacity-25">
          <div className="flex flex-col gap-0.5">
            <span className="block h-0.5 w-4 rounded-full bg-white/40 mx-auto" />
            <span className="block h-0.5 w-3 rounded-full bg-white/25 mx-auto" />
            <span className="block h-0.5 w-2 rounded-full bg-white/15 mx-auto" />
          </div>
          <p className="text-[9px] text-white/25 uppercase tracking-widest">scroll</p>
        </div>
      </div>
    </div>
  );
}
