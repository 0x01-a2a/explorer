"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { AgentReputation, AgentProfile } from "@/types/events";
import { truncateAddress, timeAgo } from "@/lib/format";
import { RepScore } from "./RepScore";
import { Badge } from "@/components/ui/Badge";

interface AgentPreviewProps {
  agent: AgentReputation | null;
  onClose: () => void;
}

export function AgentPreview({ agent, onClose }: AgentPreviewProps) {
  const [profile, setProfile] = useState<AgentProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!agent) {
      setProfile(null);
      return;
    }

    setLoading(true);
    fetch(`/api/reputation/${agent.agent_id}`)
      .then((r) => r.json())
      .then((data: AgentProfile) => setProfile(data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [agent]);

  if (!agent) return null;

  const isOnline = Date.now() - agent.last_seen < 300000;
  const rep = profile?.reputation || agent;
  const scorePercent = Math.round((rep.average_score / 5) * 100);

  return (
    <AnimatePresence>
      {agent && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2"
          >
            <div className="glass-elevated p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {agent.name || "Agent"}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-neon-cyan">
                    {truncateAddress(agent.agent_id, 8, 6)}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Score + Status */}
              <div className="flex items-center gap-5 mb-5">
                {loading ? (
                  <div className="h-20 w-20 rounded-full animate-shimmer" />
                ) : (
                  <RepScore score={scorePercent} />
                )}
                <div className="space-y-2">
                  <Badge variant={isOnline ? "online" : "offline"}>
                    {isOnline ? "Online" : "Offline"}
                  </Badge>
                  {agent.trend && (
                    <Badge
                      variant={
                        agent.trend === "rising"
                          ? "online"
                          : agent.trend === "falling"
                            ? "warning"
                            : "info"
                      }
                    >
                      {agent.trend === "rising" ? "↑" : agent.trend === "falling" ? "↓" : "→"}{" "}
                      {agent.trend}
                    </Badge>
                  )}
                  {(agent.city || agent.country) && (
                    <p className="text-xs text-white/40">
                      {[agent.city, agent.country].filter(Boolean).join(", ")}
                    </p>
                  )}
                  <p className="text-[10px] text-white/25">
                    Last seen: {timeAgo(agent.last_seen)}
                  </p>
                </div>
              </div>

              {/* Capabilities */}
              {profile?.capabilities && profile.capabilities.length > 0 && (
                <div className="mb-5">
                  <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-white/30">
                    Capabilities
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.capabilities.map((c) => (
                      <span
                        key={c.capability}
                        className="rounded-md bg-neon-cyan/10 border border-neon-cyan/20 px-2 py-0.5 text-[11px] font-mono text-neon-cyan"
                      >
                        {c.capability}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Reputation breakdown */}
              <div className="mb-5 space-y-2">
                <h4 className="text-xs font-medium uppercase tracking-wider text-white/30">
                  Feedback
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: "Positive", value: rep.positive_count, color: "text-neon-green" },
                    { label: "Neutral", value: rep.neutral_count, color: "text-white/50" },
                    { label: "Negative", value: rep.negative_count, color: "text-neon-red" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-lg bg-white/[0.03] p-2">
                      <p className={`text-lg font-bold tabular-nums ${s.color}`}>
                        {s.value}
                      </p>
                      <p className="text-[10px] text-white/30">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 text-[11px] text-white/30 mt-2">
                  <span>
                    Total: <strong className="text-white/60">{rep.feedback_count}</strong>
                  </span>
                  <span>
                    Avg: <strong className="text-white/60">{rep.average_score.toFixed(2)}/5</strong>
                  </span>
                  <span>
                    Verdicts: <strong className="text-white/60">{rep.verdict_count}</strong>
                  </span>
                </div>
              </div>

              {/* Entropy (anomaly score) */}
              {profile?.entropy && (
                <div className="mb-5">
                  <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-white/30">
                    Anomaly Score
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(profile.entropy.anomaly * 100, 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{
                          background:
                            profile.entropy.anomaly < 0.3
                              ? "#00ff88"
                              : profile.entropy.anomaly < 0.6
                                ? "#ffb800"
                                : "#ff4466",
                          boxShadow: `0 0 8px ${profile.entropy.anomaly < 0.3 ? "rgba(0,255,136,0.4)" : "rgba(255,184,0,0.4)"}`,
                        }}
                      />
                    </div>
                    <span className="text-xs tabular-nums text-white/60">
                      {(profile.entropy.anomaly * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}

              {/* Paywall */}
              <div className="relative rounded-lg border border-white/5 p-4">
                <div className="blur-paywall space-y-2">
                  <div className="h-3 w-3/4 rounded bg-white/10" />
                  <div className="h-3 w-full rounded bg-white/10" />
                  <div className="h-3 w-2/3 rounded bg-white/10" />
                  <div className="h-3 w-5/6 rounded bg-white/10" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-black/40">
                  <p className="text-xs text-white/50 mb-2">
                    Full Interaction History
                  </p>
                  <a
                    href="https://0x01.world"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-neon-cyan/15 px-4 py-1.5 text-xs font-semibold text-neon-cyan border border-neon-cyan/25 transition-all hover:bg-neon-cyan/25"
                  >
                    Get API Key
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
