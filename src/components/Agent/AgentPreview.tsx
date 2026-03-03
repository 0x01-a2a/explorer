"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { PeerSnapshot, ReputationSnapshot } from "@/types/events";
import { truncateAddress, timeAgo } from "@/lib/format";
import { RepScore } from "./RepScore";
import { Badge } from "@/components/ui/Badge";

interface AgentPreviewProps {
  agent: PeerSnapshot | null;
  onClose: () => void;
}

export function AgentPreview({ agent, onClose }: AgentPreviewProps) {
  const [reputation, setReputation] = useState<ReputationSnapshot | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!agent) {
      setReputation(null);
      return;
    }

    setLoading(true);
    fetch(`/api/reputation/${agent.agent_id}`)
      .then((r) => r.json())
      .then((data) => setReputation(data))
      .catch(() => setReputation(null))
      .finally(() => setLoading(false));
  }, [agent]);

  const isOnline = agent
    ? Date.now() - agent.last_active_epoch < 300000
    : false;

  const overallScore = reputation
    ? Math.round(
        (reputation.reliability +
          reputation.cooperation +
          reputation.notary_accuracy) /
          3
      )
    : 0;

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
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Agent Profile
                  </h3>
                  <p className="mt-1 font-mono text-xs text-neon-cyan">
                    {truncateAddress(agent.agent_id, 8, 6)}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-5 mb-5">
                {loading ? (
                  <div className="h-20 w-20 rounded-full animate-shimmer" />
                ) : (
                  <RepScore score={overallScore} />
                )}
                <div className="space-y-2">
                  <Badge variant={isOnline ? "online" : "offline"}>
                    {isOnline ? "Online" : "Offline"}
                  </Badge>
                  {agent.geo && (
                    <p className="text-xs text-white/40">
                      {agent.geo.city}, {agent.geo.country}
                    </p>
                  )}
                  <p className="text-[10px] text-white/25">
                    Last active: {timeAgo(agent.last_active_epoch)}
                  </p>
                </div>
              </div>

              {agent.services && agent.services.length > 0 && (
                <div className="mb-5">
                  <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-white/30">
                    Services
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {agent.services.map((s) => (
                      <span
                        key={s}
                        className="rounded-md bg-neon-cyan/10 border border-neon-cyan/20 px-2 py-0.5 text-[11px] font-mono text-neon-cyan"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {reputation && (
                <div className="mb-5 space-y-2">
                  <h4 className="text-xs font-medium uppercase tracking-wider text-white/30">
                    Reputation
                  </h4>
                  {[
                    { label: "Reliability", value: reputation.reliability },
                    { label: "Cooperation", value: reputation.cooperation },
                    { label: "Notary Acc.", value: reputation.notary_accuracy },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center gap-3">
                      <span className="w-24 text-xs text-white/40">
                        {stat.label}
                      </span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.value}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full rounded-full bg-neon-cyan"
                          style={{
                            boxShadow: "0 0 8px rgba(0, 240, 255, 0.4)",
                          }}
                        />
                      </div>
                      <span className="w-8 text-right text-xs tabular-nums text-white/60">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                  <div className="mt-3 flex gap-4 text-[11px] text-white/30">
                    <span>
                      Tasks: <strong className="text-white/60">{reputation.total_tasks}</strong>
                    </span>
                    <span>
                      Disputes: <strong className="text-white/60">{reputation.total_disputes}</strong>
                    </span>
                  </div>
                </div>
              )}

              <div className="relative rounded-lg border border-white/5 p-4">
                <div className="blur-paywall space-y-2">
                  <div className="h-3 w-3/4 rounded bg-white/10" />
                  <div className="h-3 w-full rounded bg-white/10" />
                  <div className="h-3 w-2/3 rounded bg-white/10" />
                  <div className="h-3 w-5/6 rounded bg-white/10" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-black/40">
                  <p className="text-xs text-white/50 mb-2">
                    Transaction History
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
