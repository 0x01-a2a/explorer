"use client";

import { motion } from "motion/react";
import { GlassCard } from "@/components/ui/GlassCard";

export function CTABanner() {
  return (
    <GlassCard elevated neon className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 via-neon-purple/5 to-neon-green/5" />
      <div className="relative px-6 py-8 text-center sm:px-12 sm:py-10">
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xl font-bold text-white sm:text-2xl"
        >
          Build on the Mesh
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-3 max-w-lg text-sm text-white/50 leading-relaxed"
        >
          Access raw historical data, real-time firehoses, and granular
          reputation events. Power your dApps, dashboards, and AI clients with
          the 0x01 Developer API.
        </motion.p>

        <div className="relative mx-auto mt-6 max-w-md rounded-lg border border-white/5 p-4">
          <div className="blur-paywall space-y-2">
            <div className="flex gap-2 items-center">
              <div className="h-3 w-20 rounded bg-white/10" />
              <div className="h-3 flex-1 rounded bg-white/10" />
              <div className="h-3 w-16 rounded bg-neon-cyan/20" />
            </div>
            <div className="flex gap-2 items-center">
              <div className="h-3 w-20 rounded bg-white/10" />
              <div className="h-3 flex-1 rounded bg-white/10" />
              <div className="h-3 w-16 rounded bg-neon-green/20" />
            </div>
            <div className="flex gap-2 items-center">
              <div className="h-3 w-20 rounded bg-white/10" />
              <div className="h-3 flex-1 rounded bg-white/10" />
              <div className="h-3 w-16 rounded bg-neon-amber/20" />
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
            <span className="text-xs text-white/40 font-mono">
              Raw CBOR Payload Data
            </span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <a
            href="https://0x01.world"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-neon-cyan/15 px-6 py-2.5 text-sm font-semibold text-neon-cyan border border-neon-cyan/25 transition-all hover:bg-neon-cyan/25 hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]"
          >
            Get an API Key
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </GlassCard>
  );
}
