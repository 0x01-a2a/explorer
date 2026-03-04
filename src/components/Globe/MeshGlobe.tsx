"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { GlobeMethods } from "react-globe.gl";
import type { AgentReputation, ArcData, PointData } from "@/types/events";
import { resolveGeo, nearestBootstrap, BOOTSTRAP_NODES } from "@/lib/geo";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

interface MeshGlobeProps {
  agents: AgentReputation[];
  onAgentClick?: (agent: AgentReputation) => void;
}

export function MeshGlobe({ agents, onAgentClick }: MeshGlobeProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

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

  const points: PointData[] = useMemo(() => {
    const agentPoints: PointData[] = [];
    for (const a of agents) {
      const geo = resolveGeo(a.country, a.city);
      if (!geo) continue;
      const isActive = Date.now() - a.last_seen < 300000;
      agentPoints.push({
        lat: geo.lat,
        lng: geo.lng,
        size: isActive ? 0.6 : 0.3,
        color: isActive ? "#00f0ff" : "#ffffff44",
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

  const arcs: ArcData[] = useMemo(() => {
    return agents
      .filter((a) => {
        const geo = resolveGeo(a.country, a.city);
        return geo && Date.now() - a.last_seen < 300000;
      })
      .map((a) => {
        const geo = resolveGeo(a.country, a.city)!;
        const bootstrap = nearestBootstrap(geo.lat, geo.lng);
        return {
          startLat: geo.lat,
          startLng: geo.lng,
          endLat: bootstrap.lat,
          endLng: bootstrap.lng,
          color: ["#00f0ff88", "#00ff8844"] as [string, string],
        };
      });
  }, [agents]);

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
        arcsData={arcs}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor="color"
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={1500}
        arcStroke={0.5}
        arcAltitudeAutoScale={0.3}
        animateIn={true}
      />
    </div>
  );
}
