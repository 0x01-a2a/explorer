"use client";

import { AnimatePresence } from "motion/react";
import type { ActivityEvent } from "@/types/events";
import { EventCard } from "./EventCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { Pulse } from "@/components/ui/Pulse";

interface EventTickerProps {
  events: ActivityEvent[];
  connected: boolean;
}

export function EventTicker({ events, connected }: EventTickerProps) {
  return (
    <GlassCard
      elevated
      className="flex h-full flex-col overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <Pulse color={connected ? "bg-neon-green" : "bg-neon-red"} size="sm" />
          <h2 className="text-sm font-semibold text-white/80">
            Live Activity
          </h2>
        </div>
        <span className="text-[10px] tabular-nums text-white/30 font-mono">
          {events.length} events
        </span>
      </div>

      <div
        id="activity"
        className="flex-1 overflow-y-auto divide-y divide-white/[0.03]"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </AnimatePresence>

        {events.length === 0 && (
          <div className="flex h-32 items-center justify-center">
            <p className="text-xs text-white/30">Waiting for events...</p>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
