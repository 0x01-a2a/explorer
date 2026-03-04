"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedCounter } from "./AnimatedCounter";
import type { NetworkStats } from "@/types/events";

interface KPICardsProps {
  data: NetworkStats | null;
  loading: boolean;
  activeAgentCount?: number;
}

function uptimeHours(startedAt: number): number {
  const ms = startedAt < 1e12 ? startedAt * 1000 : startedAt;
  return Math.floor((Date.now() - ms) / 3600000);
}

export function KPICards({ data, loading, activeAgentCount }: KPICardsProps) {
  const cards = [
    {
      key: "active-agents",
      label: "Active Agents",
      value: activeAgentCount ?? 0,
      prefix: "",
      suffix: "",
      icon: (
        <svg className="h-5 w-5 text-neon-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        </svg>
      ),
      gradient: "from-neon-cyan/20 to-transparent",
    },
    {
      key: "total-agents",
      label: "Total Agents",
      value: data?.agent_count ?? 0,
      prefix: "",
      suffix: "",
      icon: (
        <svg className="h-5 w-5 text-neon-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
        </svg>
      ),
      gradient: "from-neon-green/20 to-transparent",
    },
    {
      key: "signals",
      label: "Signals",
      value: data?.beacon_count ?? 0,
      prefix: "",
      suffix: "",
      icon: (
        <svg className="h-5 w-5 text-neon-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
        </svg>
      ),
      gradient: "from-neon-amber/20 to-transparent",
    },
    {
      key: "beacons",
      label: "Beacon Rate",
      value: data?.beacon_bpm ?? 0,
      prefix: "",
      suffix: " /min",
      icon: (
        <svg className="h-5 w-5 text-neon-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.652a3.75 3.75 0 0 1 0-5.304m5.304 0a3.75 3.75 0 0 1 0 5.304m-7.425 2.121a6.75 6.75 0 0 1 0-9.546m9.546 0a6.75 6.75 0 0 1 0 9.546M5.106 18.894c-3.808-3.807-3.808-9.98 0-13.788m13.788 0c3.808 3.807 3.808 9.98 0 13.788M12 12h.008v.008H12V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
      ),
      gradient: "from-neon-purple/20 to-transparent",
    },
    {
      key: "interactions",
      label: "Interactions",
      value: data?.interaction_count ?? 0,
      prefix: "",
      suffix: "",
      icon: (
        <svg className="h-5 w-5 text-neon-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        </svg>
      ),
      gradient: "from-neon-red/20 to-transparent",
    },
    {
      key: "uptime",
      label: "Uptime",
      value: data ? uptimeHours(data.started_at) : 0,
      prefix: "",
      suffix: "h",
      icon: (
        <svg className="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      gradient: "from-white/5 to-transparent",
    },
  ];

  return (
    <div id="stats" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 sm:gap-4">
      {cards.map((card) => (
        <GlassCard key={card.key} elevated neon className="relative overflow-hidden p-4 sm:p-5">
          <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-50`} />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              {card.icon}
              <span className="text-[10px] font-medium uppercase tracking-wider text-white/40 sm:text-xs">
                {card.label}
              </span>
            </div>
            <div className="text-2xl font-bold text-white sm:text-3xl">
              {loading || !data ? (
                <span className="inline-block h-8 w-20 rounded animate-shimmer" />
              ) : (
                <AnimatedCounter
                  value={card.value}
                  prefix={card.prefix}
                  suffix={card.suffix}
                />
              )}
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
