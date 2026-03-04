"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { GlobeMethods } from "react-globe.gl";
import type { AgentReputation, ArcData, PointData } from "@/types/events";
import {
  resolveGeo,
  geoFromId,
  nearestBootstrap,
  BOOTSTRAP_NODES,
} from "@/lib/geo";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

interface MeshGlobeProps {
  agents: AgentReputation[];
  beaconBpm?: number;
  onAgentClick?: (agent: AgentReputation) => void;
}

interface RingData {
  lat: number;
  lng: number;
  maxR: number;
  propagationSpeed: number;
  repeatPeriod: number;
}

interface SignalArc {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: [string, string];
  id: number;
}

export function MeshGlobe({ agents, beaconBpm = 0, onAgentClick }: MeshGlobeProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [signalArcs, setSignalArcs] = useState<SignalArc[]>([]);
  const arcIdRef = useRef(0);

  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const globe = globeRef.current;
    if (globe && typeof globe.controls === "function") {
      const controls = globe.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.4;
      controls.enableZoom = true;
    }
  }, []);

  // Live signal arcs — fire between bootstrap nodes at beacon rate
  useEffect(() => {
    if (beaconBpm <= 0) return;
    const intervalMs = Math.max(400, 60000 / beaconBpm);

    const timer = setInterval(() => {
      const from = BOOTSTRAP_NODES[Math.floor(Math.random() * BOOTSTRAP_NODES.length)];
      let to = BOOTSTRAP_NODES[Math.floor(Math.random() * BOOTSTRAP_NODES.length)];
      while (to === from && BOOTSTRAP_NODES.length > 1) {
        to = BOOTSTRAP_NODES[Math.floor(Math.random() * BOOTSTRAP_NODES.length)];
      }

      const id = arcIdRef.current++;
      const colors: [string, string][] = [
        ["#00f0ffcc", "#00ff88aa"],
        ["#ff4466aa", "#ffb800aa"],
        ["#a855f7aa", "#00f0ffaa"],
        ["#00ff88cc", "#ffb800aa"],
      ];
      const color = colors[id % colors.length];

      setSignalArcs((prev) => {
        const next = [...prev, { startLat: from.lat, startLng: from.lng, endLat: to.lat, endLng: to.lng, color, id }];
        if (next.length > 8) next.shift();
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [beaconBpm]);

  const points: PointData[] = useMemo(() => {
    const agentPoints: PointData[] = [];
    for (const a of agents) {
      const geo = resolveGeo(a.country, a.city) ?? geoFromId(a.agent_id);
      const isActive = Date.now() / 1000 - a.last_seen < 300;
      const hasRealGeo = !!(a.country || a.city);

      agentPoints.push({
        lat: geo.lat,
        lng: geo.lng,
        size: isActive ? 0.6 : hasRealGeo ? 0.3 : 0.25,
        color: isActive ? "#00f0ff" : hasRealGeo ? "#00f0ff44" : "#8b0000",
        agent_id: a.agent_id,
        label: a.city || a.country,
        name: a.name,
        country: a.country,
        city: a.city,
      });
    }

    const bootstrapPoints: PointData[] = BOOTSTRAP_NODES.map((n) => ({
      lat: n.lat,
      lng: n.lng,
      size: 0.9,
      color: "#00ff88",
      agent_id: `bootstrap-${n.label}`,
      label: n.label,
      name: n.label,
    }));

    return [...agentPoints, ...bootstrapPoints];
  }, [agents]);

  // Static arcs: active agents → nearest bootstrap
  const staticArcs: ArcData[] = useMemo(() => {
    return agents
      .filter((a) => {
        const geo = resolveGeo(a.country, a.city);
        return geo && Date.now() / 1000 - a.last_seen < 300;
      })
      .map((a) => {
        const geo = resolveGeo(a.country, a.city)!;
        const bootstrap = nearestBootstrap(geo.lat, geo.lng);
        return {
          startLat: geo.lat,
          startLng: geo.lng,
          endLat: bootstrap.lat,
          endLng: bootstrap.lng,
          color: ["#00f0ff55", "#00ff8833"] as [string, string],
        };
      });
  }, [agents]);

  // Combine static arcs + live signal arcs
  const allArcs = useMemo(() => [...staticArcs, ...signalArcs], [staticArcs, signalArcs]);

  // Pulsing rings on bootstrap nodes
  const rings: RingData[] = useMemo(() => {
    if (beaconBpm <= 0) return [];
    const period = Math.max(800, 60000 / beaconBpm);
    return BOOTSTRAP_NODES.map((n) => ({
      lat: n.lat,
      lng: n.lng,
      maxR: 5,
      propagationSpeed: 3,
      repeatPeriod: period,
    }));
  }, [beaconBpm]);

  const handlePointClick = useCallback(
    (point: object) => {
      const p = point as PointData;
      if (p.agent_id.startsWith("bootstrap-")) return;
      const agent = agents.find((a) => a.agent_id === p.agent_id);
      if (agent && onAgentClick) onAgentClick(agent);
    },
    [agents, onAgentClick]
  );

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 pointer-events-none z-10" />
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        backgroundColor="rgba(0,0,0,0)"
        atmosphereColor="#00f0ff"
        atmosphereAltitude={0.2}
        pointsData={points}
        pointLat="lat"
        pointLng="lng"
        pointRadius="size"
        pointColor="color"
        pointAltitude={0.01}
        pointsMerge={false}
        onPointClick={handlePointClick}
        arcsData={allArcs}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor="color"
        arcDashLength={0.6}
        arcDashGap={0.3}
        arcDashAnimateTime={1200}
        arcStroke={0.8}
        arcAltitudeAutoScale={0.4}
        ringsData={rings}
        ringLat="lat"
        ringLng="lng"
        ringMaxRadius="maxR"
        ringPropagationSpeed="propagationSpeed"
        ringRepeatPeriod="repeatPeriod"
        ringColor={() => (t: number) => `rgba(0,240,255,${(1 - t) * 0.6})`}
        animateIn={true}
      />
    </div>
  );
}
