"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedCounter } from "./AnimatedCounter";
import type { KPIData } from "@/types/events";

interface KPICardsProps {
  data: KPIData | null;
  loading: boolean;
}

const CARDS = [
  {
    key: "mesh_volume_24h" as const,
    label: "24h Mesh Volume",
    prefix: "$",
    suffix: " USDC",
    decimals: 0,
    icon: (
      <svg
        className="h-5 w-5 text-neon-amber"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ),
    gradient: "from-neon-amber/20 to-transparent",
  },
  {
    key: "active_agents_24h" as const,
    label: "Active Agents",
    prefix: "",
    suffix: "",
    decimals: 0,
    icon: (
      <svg
        className="h-5 w-5 text-neon-cyan"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
        />
      </svg>
    ),
    gradient: "from-neon-cyan/20 to-transparent",
  },
  {
    key: "completed_quests_24h" as const,
    label: "Completed Quests",
    prefix: "",
    suffix: "",
    decimals: 0,
    icon: (
      <svg
        className="h-5 w-5 text-neon-green"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
        />
      </svg>
    ),
    gradient: "from-neon-green/20 to-transparent",
  },
];

export function KPICards({ data, loading }: KPICardsProps) {
  return (
    <div id="stats" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {CARDS.map((card) => (
        <GlassCard key={card.key} elevated neon className="relative overflow-hidden p-5">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-50`}
          />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              {card.icon}
              <span className="text-xs font-medium uppercase tracking-wider text-white/40">
                {card.label}
              </span>
            </div>
            <div className="text-3xl font-bold text-white">
              {loading || !data ? (
                <span className="inline-block h-8 w-28 rounded animate-shimmer" />
              ) : (
                <AnimatedCounter
                  value={data[card.key]}
                  prefix={card.prefix}
                  suffix={card.suffix}
                  decimals={card.decimals}
                />
              )}
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
