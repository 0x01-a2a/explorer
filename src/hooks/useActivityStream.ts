"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { ActivityEvent } from "@/types/events";
import { generateMockEvent } from "@/lib/mock";

const MAX_EVENTS = 100;

export function useActivityStream() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const mockTimer = useRef<ReturnType<typeof setInterval>>(undefined);
  const backoff = useRef(1000);

  const addEvent = useCallback((event: ActivityEvent) => {
    setEvents((prev) => [event, ...prev].slice(0, MAX_EVENTS));
  }, []);

  useEffect(() => {
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

    if (useMock) {
      setConnected(true);
      for (let i = 0; i < 8; i++) {
        const e = generateMockEvent();
        e.ts = Math.floor(Date.now() / 1000) - (8 - i) * 3;
        addEvent(e);
      }
      mockTimer.current = setInterval(() => {
        addEvent(generateMockEvent());
      }, 2000 + Math.random() * 3000);

      return () => {
        if (mockTimer.current) clearInterval(mockTimer.current);
      };
    }

    // Real WebSocket to aggregator (via proxy or direct)
    // Aggregator accepts auth via query param: ?token=<secret>
    // In production, connect directly to aggregator if token is public,
    // or use a server-side proxy route for the WS upgrade
    function connect() {
      const wsUrl =
        process.env.NEXT_PUBLIC_WS_URL ||
        `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/api/ws`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        backoff.current = 1000;
      };

      ws.onmessage = (e) => {
        try {
          const event: ActivityEvent = JSON.parse(e.data);
          addEvent(event);
        } catch {
          // skip malformed messages
        }
      };

      ws.onclose = () => {
        setConnected(false);
        reconnectTimer.current = setTimeout(() => {
          backoff.current = Math.min(backoff.current * 2, 30000);
          connect();
        }, backoff.current);
      };

      ws.onerror = () => ws.close();
    }

    connect();

    return () => {
      wsRef.current?.close();
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };
  }, [addEvent]);

  return { events, connected };
}
