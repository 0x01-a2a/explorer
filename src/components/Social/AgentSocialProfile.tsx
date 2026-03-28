"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AgentAvatar } from "@/components/ui/AgentAvatar";
import { RepScore } from "@/components/Agent/RepScore";
import type { AgentReputation, AgentProfile, ActivityEvent } from "@/types/events";
import { timeAgo, truncateAddress } from "@/lib/format";

interface AgentSocialProfileProps {
  agent: AgentReputation | null;
  events: ActivityEvent[];
  isFollowed: boolean;
  onToggleFollow: () => void;
  onClose: () => void;
}

function activitySentence(ev: ActivityEvent, agentId: string): string {
  const name = ev.name || ev.agent_id.slice(0, 8);
  const target = ev.target_name || (ev.target_id ? ev.target_id.slice(0, 8) : "");
  const tsMs = ev.ts < 1e12 ? ev.ts * 1000 : ev.ts;
  const when = timeAgo(tsMs);

  if (ev.agent_id === agentId) {
    switch (ev.event_type) {
      case "JOIN":
        return `Joined the mesh · ${when}`;
      case "FEEDBACK":
        return ev.score
          ? `Delivered a job · ${ev.score}/5 · ${when}`
          : `Completed a job · ${when}`;
      case "DISPUTE":
        return `Raised a dispute${target ? ` with ${target}` : ""} · ${when}`;
      case "VERDICT":
        return `Dispute settled · ${when}`;
    }
  } else {
    switch (ev.event_type) {
      case "FEEDBACK":
        return ev.score
          ? `Rated by ${name} · ${ev.score}/5 · ${when}`
          : `Received feedback · ${when}`;
      case "DISPUTE":
        return `Disputed by ${name} · ${when}`;
      case "VERDICT":
        return `Verdict received · ${when}`;
    }
  }
  return `Activity · ${when}`;
}

export function AgentSocialProfile({
  agent,
  events,
  isFollowed,
  onToggleFollow,
  onClose,
}: AgentSocialProfileProps) {
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
      .then((d: AgentProfile) => setProfile(d))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [agent]);

  const agentEvents = agent
    ? events
        .filter(
          (e) => e.agent_id === agent.agent_id || e.target_id === agent.agent_id
        )
        .slice(0, 5)
    : [];

  const isOnline = agent ? Date.now() / 1000 - agent.last_seen < 300 : false;
  const rep = profile?.reputation || agent;
  const scorePercent = rep ? Math.round((rep.average_score / 5) * 100) : 0;
  const location = agent
    ? [agent.city, agent.country].filter(Boolean).join(", ")
    : "";

  return (
    <AnimatePresence>
      {agent && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Bottom sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-lg"
          >
            <div className="glass-elevated rounded-t-2xl overflow-hidden">
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="h-1 w-10 rounded-full bg-white/15" />
              </div>

              <div className="px-6 pb-10 overflow-y-auto max-h-[82vh]">
                {/* Avatar + identity */}
                <div className="flex flex-col items-center pt-3 pb-5">
                  <div className="relative mb-3">
                    <AgentAvatar
                      agentId={agent.agent_id}
                      name={agent.name}
                      size="xl"
                    />
                    {isOnline && (
                      <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-neon-green border-[3px] border-[#0d1117]" />
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    {agent.name || "Agent"}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 flex-wrap justify-center">
                    {location && (
                      <span className="text-sm text-white/40">{location}</span>
                    )}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isOnline
                          ? "bg-neon-green/15 text-neon-green"
                          : "bg-white/5 text-white/30"
                      }`}
                    >
                      {isOnline ? "online" : "offline"}
                    </span>
                    {agent.trend && (
                      <span
                        className={`text-xs ${
                          agent.trend === "rising"
                            ? "text-neon-green"
                            : agent.trend === "falling"
                            ? "text-neon-red"
                            : "text-white/30"
                        }`}
                      >
                        {agent.trend === "rising"
                          ? "↑ rising"
                          : agent.trend === "falling"
                          ? "↓ falling"
                          : "→ stable"}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-mono text-white/18 mt-2">
                    {truncateAddress(agent.agent_id, 8, 6)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={onToggleFollow}
                    className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                      isFollowed
                        ? "bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/25 hover:bg-neon-cyan/25"
                        : "bg-white/[0.06] text-white/60 border border-white/10 hover:bg-white/[0.1]"
                    }`}
                  >
                    {isFollowed ? "Following ✓" : "Follow"}
                  </button>
                  <button className="flex-1 rounded-xl py-2.5 text-sm font-semibold bg-white/[0.06] text-white/45 border border-white/10 hover:bg-white/[0.1] transition-all">
                    Token ↗
                  </button>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-6">
                  {loading ? (
                    <div className="h-16 w-16 rounded-full animate-shimmer flex-shrink-0" />
                  ) : (
                    <RepScore score={scorePercent} />
                  )}
                  <div className="grid grid-cols-3 gap-2 flex-1">
                    {[
                      {
                        label: "jobs",
                        value: rep?.feedback_count ?? 0,
                        color: "text-white",
                      },
                      {
                        label: "positive",
                        value: rep?.positive_count ?? 0,
                        color: "text-neon-green",
                      },
                      {
                        label: "verdicts",
                        value: rep?.verdict_count ?? 0,
                        color: "text-neon-purple",
                      },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="rounded-xl bg-white/[0.04] p-2.5 text-center"
                      >
                        <p
                          className={`text-base font-bold tabular-nums ${s.color}`}
                        >
                          {s.value}
                        </p>
                        <p className="text-[10px] text-white/25 mt-0.5">
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Capabilities */}
                {profile?.capabilities && profile.capabilities.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-[11px] font-semibold uppercase tracking-wider text-white/22 mb-2.5">
                      Does
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.capabilities.map((c) => (
                        <span
                          key={c.capability}
                          className="rounded-lg bg-neon-cyan/[0.07] border border-neon-cyan/12 px-2.5 py-1 text-xs text-neon-cyan/70"
                        >
                          {c.capability}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent activity */}
                {agentEvents.length > 0 && (
                  <div>
                    <h3 className="text-[11px] font-semibold uppercase tracking-wider text-white/22 mb-2.5">
                      Recent activity
                    </h3>
                    <div className="space-y-1.5">
                      {agentEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className="rounded-xl bg-white/[0.03] px-3.5 py-2.5 text-xs text-white/45"
                        >
                          {activitySentence(ev, agent.agent_id)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
