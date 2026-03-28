"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AgentAvatar } from "@/components/ui/AgentAvatar";
import { Pulse } from "@/components/ui/Pulse";
import { GlassCard } from "@/components/ui/GlassCard";
import type { ActivityEvent } from "@/types/events";
import { timeAgo } from "@/lib/format";

interface SocialFeedProps {
  events: ActivityEvent[];
  connected: boolean;
  watcherCount: number;
  onAgentClick: (agentId: string) => void;
}

const REACTIONS = [
  { emoji: "👀", label: "watching" },
  { emoji: "🔥", label: "fire" },
  { emoji: "⚡", label: "signal" },
  { emoji: "🌍", label: "global" },
];

const EVENT_ACCENT: Record<string, string> = {
  JOIN: "text-neon-green",
  FEEDBACK: "text-neon-cyan",
  DISPUTE: "text-neon-amber",
  VERDICT: "text-neon-purple",
};

function toSentence(ev: ActivityEvent): { verb: string; detail?: string } {
  const target = ev.target_name || (ev.target_id ? ev.target_id.slice(0, 8) : "");
  switch (ev.event_type) {
    case "JOIN":
      return { verb: "came online" };
    case "FEEDBACK":
      return {
        verb: ev.score ? `delivered a job · ${ev.score}/5` : "completed a job",
        detail: target ? `for ${target}` : undefined,
      };
    case "DISPUTE":
      return {
        verb: "opened a dispute",
        detail: target ? `with ${target}` : undefined,
      };
    case "VERDICT":
      return {
        verb: "dispute settled",
        detail: ev.score ? `score: ${ev.score}/5` : undefined,
      };
    default:
      return { verb: "sent a signal" };
  }
}

export function SocialFeed({
  events,
  connected,
  watcherCount,
  onAgentClick,
}: SocialFeedProps) {
  const [reactions, setReactions] = useState(() =>
    REACTIONS.map((r) => ({
      ...r,
      count: Math.floor(Math.random() * 18) + 4,
    }))
  );

  return (
    <GlassCard elevated className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Pulse color={connected ? "bg-neon-green" : "bg-neon-red"} size="sm" />
          <span className="text-sm font-semibold text-white/80">Live</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-white/25 font-mono">
          <span>👁</span>
          <span className="tabular-nums">{watcherCount}</span>
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/[0.03]">
        <AnimatePresence mode="popLayout" initial={false}>
          {events.map((ev) => {
            const { verb, detail } = toSentence(ev);
            const name = ev.name || ev.agent_id.slice(0, 8);
            const tsMs = ev.ts < 1e12 ? ev.ts * 1000 : ev.ts;
            const accent = EVENT_ACCENT[ev.event_type] || "text-white/50";

            return (
              <motion.div
                key={ev.id}
                layout
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.22 }}
                className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.025] transition-colors cursor-pointer"
                onClick={() => onAgentClick(ev.agent_id)}
              >
                <AgentAvatar
                  agentId={ev.agent_id}
                  name={name}
                  size="sm"
                  className="mt-0.5"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className={`text-xs font-semibold ${accent}`}>
                      {name}
                    </span>
                    <span className="text-xs text-white/45">{verb}</span>
                  </div>
                  {detail && (
                    <p className="text-[11px] text-white/25 mt-0.5">{detail}</p>
                  )}
                  <p className="text-[10px] text-white/18 mt-0.5 font-mono">
                    {timeAgo(tsMs)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {events.length === 0 && (
          <div className="flex h-32 items-center justify-center">
            <p className="text-xs text-white/25">Waiting for signals...</p>
          </div>
        )}
      </div>

      {/* Reactions */}
      <div className="border-t border-white/5 px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          {reactions.map((r, i) => (
            <button
              key={r.label}
              onClick={() =>
                setReactions((prev) =>
                  prev.map((x, idx) =>
                    idx === i ? { ...x, count: x.count + 1 } : x
                  )
                )
              }
              className="flex items-center gap-1 rounded-full glass px-2.5 py-1 text-[11px] transition-all hover:bg-white/[0.08] active:scale-95"
            >
              <span>{r.emoji}</span>
              <span className="text-white/35 tabular-nums font-mono">
                {r.count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
