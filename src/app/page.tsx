"use client";

import { useState } from "react";
import { Header } from "@/components/Layout/Header";
import { MeshGlobe } from "@/components/Globe/MeshGlobe";
import { GlobeOverlay } from "@/components/Globe/GlobeOverlay";
import { EventTicker } from "@/components/Ticker/EventTicker";
import { KPICards } from "@/components/Dashboard/KPICards";
import { AgentPreview } from "@/components/Agent/AgentPreview";
import { CTABanner } from "@/components/Layout/CTABanner";
import { BOOTSTRAP_NODES } from "@/lib/geo";
import { useActivityStream } from "@/hooks/useActivityStream";
import { useKPIData } from "@/hooks/useKPIData";
import { usePeers } from "@/hooks/usePeers";
import type { PeerSnapshot } from "@/types/events";

export default function Explorer() {
  const { events, connected } = useActivityStream();
  const { data: kpiData, loading: kpiLoading } = useKPIData();
  const { peers } = usePeers();
  const [selectedAgent, setSelectedAgent] = useState<PeerSnapshot | null>(null);

  return (
    <div className="min-h-screen">
      <Header connected={connected} />

      <main className="pt-14">
        {/* KPI Bar */}
        <section className="mx-auto max-w-[1920px] px-4 pt-4 lg:px-8">
          <KPICards data={kpiData} loading={kpiLoading} />
        </section>

        {/* Globe + Ticker */}
        <section className="mx-auto max-w-[1920px] px-4 pt-4 lg:px-8">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">
            {/* Globe */}
            <div
              id="globe"
              className="glass-elevated relative overflow-hidden"
              style={{ minHeight: "clamp(400px, 60vh, 800px)" }}
            >
              <MeshGlobe
                peers={peers}
                onAgentClick={(agent) => setSelectedAgent(agent)}
              />
              <GlobeOverlay
                agentCount={peers.length}
                bootstrapCount={BOOTSTRAP_NODES.length}
              />
              <div className="absolute bottom-4 left-4 z-20">
                <div className="glass px-3 py-2 text-[10px] text-white/40 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-neon-cyan" />
                    Active Agent
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-neon-green" />
                    Bootstrap Node
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-6 border-t border-dashed border-neon-cyan/50" />
                    Relay Connection
                  </div>
                </div>
              </div>
            </div>

            {/* Ticker */}
            <div
              className="lg:max-h-[clamp(400px,60vh,800px)]"
            >
              <EventTicker events={events} connected={connected} />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-[1920px] px-4 py-8 lg:px-8">
          <CTABanner />
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-6">
          <div className="mx-auto max-w-[1920px] px-4 lg:px-8 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
            <p className="text-xs text-white/25">
              &copy; {new Date().getFullYear()} 0x01 Network. All rights
              reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://0x01.world"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/25 hover:text-white/50 transition-colors"
              >
                Website
              </a>
              <a
                href="https://docs.0x01.world"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/25 hover:text-white/50 transition-colors"
              >
                Docs
              </a>
              <a
                href="https://github.com/0x01-a2a"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/25 hover:text-white/50 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </main>

      <AgentPreview
        agent={selectedAgent}
        onClose={() => setSelectedAgent(null)}
      />
    </div>
  );
}
