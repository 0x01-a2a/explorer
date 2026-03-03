"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { GlobeMethods } from "react-globe.gl";
import type { PeerSnapshot, ArcData, PointData } from "@/types/events";
import { jitterGeo, nearestBootstrap, BOOTSTRAP_NODES } from "@/lib/geo";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

interface MeshGlobeProps {
  peers: PeerSnapshot[];
  onAgentClick?: (agent: PeerSnapshot) => void;
}

export function MeshGlobe({ peers, onAgentClick }: MeshGlobeProps) {
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
    const agentPoints: PointData[] = peers
      .filter((p) => p.geo)
      .map((p) => {
        const [lat, lng] = jitterGeo(p.geo!.lat, p.geo!.lng, 0.8);
        return {
          lat,
          lng,
          size: p.sati_ok ? 0.6 : 0.3,
          color: p.sati_ok ? "#00f0ff" : "#ffffff44",
          agent_id: p.agent_id,
          label: p.geo?.city,
          services: p.services,
          region: p.geo?.region,
        };
      });

    const bootstrapPoints: PointData[] = BOOTSTRAP_NODES.map((n) => ({
      lat: n.lat,
      lng: n.lng,
      size: 0.9,
      color: "#00ff88",
      agent_id: `bootstrap-${n.label}`,
      label: n.label,
      region: n.label,
    }));

    return [...agentPoints, ...bootstrapPoints];
  }, [peers]);

  const arcs: ArcData[] = useMemo(() => {
    return peers
      .filter((p) => p.geo && p.sati_ok)
      .map((p) => {
        const bootstrap = nearestBootstrap(p.geo!.lat, p.geo!.lng);
        const [lat, lng] = jitterGeo(p.geo!.lat, p.geo!.lng, 0.8);
        return {
          startLat: lat,
          startLng: lng,
          endLat: bootstrap.lat,
          endLng: bootstrap.lng,
          color: ["#00f0ff88", "#00ff8844"] as [string, string],
        };
      });
  }, [peers]);

  const handlePointClick = useCallback(
    (point: object) => {
      const p = point as PointData;
      if (p.agent_id.startsWith("bootstrap-")) return;
      const peer = peers.find((peer) => peer.agent_id === p.agent_id);
      if (peer && onAgentClick) onAgentClick(peer);
    },
    [peers, onAgentClick]
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
