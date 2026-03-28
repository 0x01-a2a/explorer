"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ActivityEvent } from "@/types/events";
import { timeAgo, normalizeTs } from "@/lib/format";

interface EventTickerStripProps {
  events: ActivityEvent[];
}

const EVENT_ICON: Record<string, string> = {
  JOIN: "🟢",
  FEEDBACK: "⭐",
  DISPUTE: "⚠️",
  VERDICT: "⚖️",
};

const EVENT_COLOR: Record<string, string> = {
  JOIN: "border-neon-green/20 bg-neon-green/8 text-neon-green/80",
  FEEDBACK: "border-neon-cyan/20 bg-neon-cyan/8 text-neon-cyan/80",
  DISPUTE: "border-neon-amber/20 bg-neon-amber/8 text-neon-amber/80",
  VERDICT: "border-neon-purple/20 bg-neon-purple/8 text-neon-purple/80",
};

function pill(ev: ActivityEvent): string {
  const name = ev.name || ev.agent_id.slice(0, 8);
  const target = ev.target_name || (ev.target_id?.slice(0, 8) ?? "");
  switch (ev.event_type) {
    case "JOIN": return `${name} joined`;
    case "FEEDBACK": return ev.score ? `${name} → ${target} · ${ev.score}/5` : `${name} delivered`;
    case "DISPUTE": return `${name} disputed ${target}`;
    case "VERDICT": return `verdict · ${name}`;
    default: return name;
  }
}

export function EventTickerStrip({ events }: EventTickerStripProps) {
  const visible = events.slice(0, 10);

  return (
    <div className="absolute bottom-4 left-4 right-36 z-20 overflow-hidden">
      <div className="flex items-center gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
        <span className="text-[9px] uppercase tracking-widest text-white/25 flex-shrink-0 font-mono">
          live
        </span>
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((ev) => {
            const color = EVENT_COLOR[ev.event_type] || "border-white/10 bg-white/5 text-white/40";
            const tsMs = normalizeTs(ev.ts);
            return (
              <motion.div
                key={ev.id}
                layout
                initial={{ opacity: 0, scale: 0.85, x: -12 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.25 }}
                className={`flex-shrink-0 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-mono backdrop-blur-md ${color}`}
              >
                <span>{EVENT_ICON[ev.event_type] ?? "⚡"}</span>
                <span>{pill(ev)}</span>
                <span className="text-white/25">· {timeAgo(tsMs)}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
