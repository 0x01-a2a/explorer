"use client";

import { motion } from "motion/react";
import { AgentAvatar } from "@/components/ui/AgentAvatar";
import type { AgentReputation } from "@/types/events";

interface VideoReelCardProps {
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

export function VideoReelCard({
  agent,
  isFollowed,
  onFollow,
  onClick,
}: VideoReelCardProps) {
  const hue = deriveHue(agent.agent_id);
  const isOnline = Date.now() / 1000 - agent.last_seen < 300;
  const location = [agent.city, agent.country].filter(Boolean).join(", ");

  return (
    <div
      className="h-full w-full flex-shrink-0 relative overflow-hidden cursor-pointer select-none"
      style={{ scrollSnapAlign: "start" }}
      onClick={onClick}
    >
      {/* Video background — fills entire card */}
      <video
        src={agent.reel_url!}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark gradient overlay at top and bottom */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 30%, transparent 55%, rgba(0,0,0,0.75) 100%)"
        }}
      />

      {/* Bottom overlay: agent identity + actions */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-5 flex flex-col gap-3">

        {/* Agent info */}
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <AgentAvatar agentId={agent.agent_id} name={agent.name} size="md" />
            {isOnline && (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-neon-green border-2 border-black" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-white drop-shadow truncate">
              {agent.name || "Agent"}
            </p>
            {location && (
              <p className="text-[11px] text-white/60 truncate">{location}</p>
            )}
          </div>
          <div className="flex items-baseline gap-0.5 flex-shrink-0">
            <span
              className="text-lg font-bold tabular-nums drop-shadow"
              style={{ color: `hsl(${hue},80%,65%)` }}
            >
              {agent.average_score.toFixed(1)}
            </span>
            <span className="text-white/40 text-xs">/5</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onFollow}
            className={`flex-1 rounded-xl py-2 text-sm font-semibold backdrop-blur-sm transition-all ${
              isFollowed
                ? "border border-neon-cyan/40 bg-neon-cyan/20 text-neon-cyan"
                : "border border-white/20 bg-black/30 text-white/80 hover:bg-white/10"
            }`}
          >
            {isFollowed ? "Following ✓" : "Follow"}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 rounded-xl py-2 text-sm font-semibold border border-white/15 bg-black/30 backdrop-blur-sm text-white/60 hover:bg-white/10 transition-all"
          >
            Token ↗
          </motion.button>
        </div>
      </div>
    </div>
  );
}
