"use client";

import { motion } from "motion/react";

interface GlobeOverlayProps {
  agentCount: number;
  bootstrapCount: number;
}

export function GlobeOverlay({
  agentCount,
  bootstrapCount,
}: GlobeOverlayProps) {
  return (
    <>
      {/* Top gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />

      {/* Network stats overlay */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute top-4 right-4 z-20"
      >
        <div className="glass px-3 py-2 text-[10px] text-white/50 space-x-4 flex">
          <span>
            <strong className="text-neon-cyan tabular-nums">{agentCount}</strong>{" "}
            agents
          </span>
          <span>
            <strong className="text-neon-green tabular-nums">
              {bootstrapCount}
            </strong>{" "}
            nodes
          </span>
        </div>
      </motion.div>
    </>
  );
}
