"use client";

import { useState, useMemo, useCallback } from "react";
import { Header } from "@/components/Layout/Header";
import { MeshGlobe } from "@/components/Globe/MeshGlobe";
import { GlobeOverlay } from "@/components/Globe/GlobeOverlay";
import { EventTickerStrip } from "@/components/Globe/EventTickerStrip";
import { AgentReel } from "@/components/Social/AgentReel";
import { HumanFeed } from "@/components/Social/HumanFeed";
import { AgentSocialProfile } from "@/components/Social/AgentSocialProfile";
import { useActivityStream } from "@/hooks/useActivityStream";
import { useKPIData } from "@/hooks/useKPIData";
import { usePeers } from "@/hooks/usePeers";
import { BOOTSTRAP_NODES } from "@/lib/geo";
import type { AgentReputation } from "@/types/events";

export default function Home() {
  const activity = useActivityStream();
  const kpi = useKPIData();
  const peers = usePeers();
  const { events, connected, isLive } = activity;
  const { data: networkStats } = kpi;
  const { agents } = peers;

  const [selectedAgent, setSelectedAgent] = useState<AgentReputation | null>(null);
  const [followed, setFollowed] = useState<Set<string>>(new Set());

  const dataMode = useMemo<"live" | "mock" | "error">(() => {
    const modes = [activity.mode, kpi.mode, peers.mode];
    if (modes.includes("error")) return "error";
    if (modes.includes("mock")) return "mock";
    return "live";
  }, [activity.mode, kpi.mode, peers.mode]);

  const activeAgentCount = useMemo(() => {
    const cutoff = Date.now() / 1000 - 300;
    return agents.filter((a) => a.last_seen > cutoff).length;
  }, [agents]);

  const handleAgentClick = useCallback((agent: AgentReputation) => {
    setSelectedAgent(agent);
  }, []);

  const toggleFollow = useCallback((agentId: string) => {
    setFollowed((prev) => {
      const next = new Set(prev);
      if (next.has(agentId)) next.delete(agentId);
      else next.add(agentId);
      return next;
    });
  }, []);

  const toggleFollowSelected = useCallback(() => {
    if (selectedAgent) toggleFollow(selectedAgent.agent_id);
  }, [selectedAgent, toggleFollow]);

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-[#0a0a1a]">
      <Header
        connected={connected}
        dataMode={dataMode}
        followCount={followed.size}
      />

      <main className="flex-1 overflow-hidden flex flex-col pt-14">
        {dataMode === "error" && (
          <div className="mx-auto w-full max-w-[1920px] px-3 pt-3 lg:px-6">
            <div className="glass border border-neon-red/25 px-4 py-2.5 text-xs text-neon-red rounded-xl">
              Real data mode active but one or more sources failed. {activity.error || ""}
            </div>
          </div>
        )}

        {/* ── Main three-column ── */}
        <div className="flex-1 overflow-hidden mx-auto w-full max-w-[1920px] px-3 pt-3 pb-3 lg:px-6">
          <div className="grid h-full gap-3 grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[260px_1fr_360px] overflow-hidden">

            {/* ── Left: TikTok agent reel (xl only) ── */}
            <div className="hidden xl:block h-full overflow-hidden">
              <AgentReel
                agents={agents}
                events={events}
                followed={followed}
                onToggleFollow={toggleFollow}
                onAgentClick={handleAgentClick}
              />
            </div>

            {/* ── Center: Globe with overlay elements ── */}
            <div className="glass-elevated relative overflow-hidden rounded-xl min-h-[400px]">
              <MeshGlobe
                agents={agents}
                events={isLive ? events : []}
                beaconBpm={networkStats?.beacon_bpm ?? 0}
                onAgentClick={handleAgentClick}
              />

              {/* Top-left stats */}
              <GlobeOverlay
                activeCount={activeAgentCount}
                stats={networkStats}
                bootstrapCount={BOOTSTRAP_NODES.length}
              />

              {/* Bottom: live event ticker strip */}
              <EventTickerStrip events={isLive ? events : []} />

              {/* Bottom-right: legend */}
              <div className="absolute bottom-4 right-4 z-20">
                <div className="glass px-3 py-2 text-[10px] text-white/30 space-y-1">
                  {[
                    { dot: "bg-neon-cyan shadow-[0_0_6px_#00f0ff]", label: "Active" },
                    { dot: "bg-[#8b0000]", label: "Inactive" },
                    { dot: "bg-neon-green shadow-[0_0_6px_#00ff88]", label: "Bootstrap" },
                  ].map(({ dot, label }) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${dot}`} />
                      {label}
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <span className="h-px w-4 bg-[#ffb800]" />
                    Interaction
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-px w-4 bg-[#ff4466]" />
                    Dispute
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right: human chat feed ── */}
            <div className="hidden lg:flex flex-col overflow-hidden">
              <HumanFeed events={events} connected={connected} />
            </div>
          </div>
        </div>

      </main>

      {/* Agent profile bottom sheet */}
      <AgentSocialProfile
        agent={selectedAgent}
        events={events}
        isFollowed={selectedAgent ? followed.has(selectedAgent.agent_id) : false}
        onToggleFollow={toggleFollowSelected}
        onClose={() => setSelectedAgent(null)}
      />
    </div>
  );
}
