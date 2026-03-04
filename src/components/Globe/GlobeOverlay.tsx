"use client";

import { motion } from "motion/react";
import { AnimatedCounter } from "@/components/Dashboard/AnimatedCounter";
import type { NetworkStats } from "@/types/events";

interface GlobeOverlayProps {
  activeCount: number;
  stats: NetworkStats | null;
  bootstrapCount: number;
}

interface StatItem {
  key: string;
  label: string;
  color: string;
  suffix?: string;
}

const STATS_ITEMS: StatItem[] = [
  { key: "active", label: "Active Agents", color: "text-neon-cyan" },
  { key: "total", label: "Total Agents", color: "text-white/80" },
  { key: "signals", label: "Signals", color: "text-neon-amber" },
  { key: "beacon", label: "Beacon Rate", color: "text-neon-green", suffix: "/min" },
  { key: "interactions", label: "Interactions", color: "text-neon-purple" },
  { key: "uptime", label: "Uptime", color: "text-white/60", suffix: "h" },
];

function uptimeHours(startedAt: number): number {
  const ms = startedAt < 1e12 ? startedAt * 1000 : startedAt;
  return Math.max(0, Math.floor((Date.now() - ms) / 3600000));
}

export function GlobeOverlay({
  activeCount,
  stats,
  bootstrapCount,
}: GlobeOverlayProps) {
  const values: Record<string, number> = {
    active: activeCount,
    total: stats?.agent_count ?? 0,
    signals: stats?.beacon_count ?? 0,
    beacon: stats?.beacon_bpm ?? 0,
    interactions: stats?.interaction_count ?? 0,
    uptime: stats ? uptimeHours(stats.started_at) : 0,
  };

  return (
    <>
      {/* Top gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />

      {/* Right badge: active + nodes */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute top-4 right-4 z-20"
      >
        <div className="glass px-3 py-2 text-[10px] text-white/50 space-x-4 flex">
          <span>
            <strong className="text-neon-cyan tabular-nums">{activeCount}</strong>{" "}
            active
          </span>
          <span>
            <strong className="text-neon-green tabular-nums">
              {bootstrapCount}
            </strong>{" "}
            nodes
          </span>
        </div>
      </motion.div>

      {/* Left stats panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute top-4 left-4 z-20"
      >
        <div className="glass px-4 py-3 space-y-0">
          {STATS_ITEMS.map((item, i) => (
            <div key={item.key}>
              {i > 0 && <div className="border-t border-white/5 my-2" />}
              <p className="text-[9px] uppercase tracking-widest text-white/30">
                {item.label}
              </p>
              <p className={`text-base font-bold tabular-nums leading-tight ${item.color}`}>
                <AnimatedCounter
                  value={values[item.key]}
                  suffix={item.suffix}
                />
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
