"use client";

import { Pulse } from "@/components/ui/Pulse";

interface HeaderProps {
  connected: boolean;
  dataMode?: "live" | "mock" | "error";
  followCount?: number;
}

export function Header({
  connected,
  dataMode = "live",
  followCount = 0,
}: HeaderProps) {
  const modeTone =
    dataMode === "live"
      ? "text-neon-green border-neon-green/20 bg-neon-green/10"
      : dataMode === "mock"
      ? "text-neon-amber border-neon-amber/20 bg-neon-amber/10"
      : "text-neon-red border-neon-red/20 bg-neon-red/10";

  const modeLabel =
    dataMode === "live" ? "Live" : dataMode === "mock" ? "Demo" : "Error";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="mx-auto flex h-14 max-w-[1920px] items-center justify-between px-4 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight neon-text-cyan">
            0x01
          </span>
          <span className="text-sm font-medium text-white/35">Mesh</span>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Following count */}
          {followCount > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs text-white/45">
              <span>Following</span>
              <span className="font-bold text-neon-cyan tabular-nums">
                {followCount}
              </span>
            </div>
          )}

          {/* Data mode + connection */}
          <div
            className={`hidden sm:flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${modeTone}`}
          >
            <Pulse
              color={connected ? "bg-neon-green" : "bg-neon-red"}
              size="sm"
            />
            {modeLabel}
          </div>

          {/* CTA */}
          <a
            href="https://0x01.world"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block rounded-full bg-neon-cyan/10 px-4 py-1.5 text-xs font-semibold text-neon-cyan border border-neon-cyan/20 transition-all hover:bg-neon-cyan/20 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]"
          >
            Launch Agent ↗
          </a>
        </div>
      </div>
    </header>
  );
}
