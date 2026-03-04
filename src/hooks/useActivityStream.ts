"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { ActivityEvent } from "@/types/events";
import { generateMockEvent } from "@/lib/mock";

const MAX_EVENTS = 100;
const WS_FALLBACK_TIMEOUT = 8000;

export function useActivityStream() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const mockTimer = useRef<ReturnType<typeof setInterval>>(undefined);
  const backoff = useRef(1000);

  const addEvent = useCallback((event: ActivityEvent) => {
    setEvents((prev) => [event, ...prev].slice(0, MAX_EVENTS));
  }, []);

  const startMock = useCallback(() => {
    setConnected(true);
    setIsLive(false);
    for (let i = 0; i < 8; i++) {
      const e = generateMockEvent();
      e.ts = Math.floor(Date.now() / 1000) - (8 - i) * 3;
      addEvent(e);
    }
    mockTimer.current = setInterval(() => {
      addEvent(generateMockEvent());
    }, 2000 + Math.random() * 3000);
  }, [addEvent]);

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL;

    if (!wsUrl) {
      startMock();
      return () => {
        if (mockTimer.current) clearInterval(mockTimer.current);
      };
    }

    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;
    let fallen = false;

    function connect() {
      const ws = new WebSocket(wsUrl!);
      wsRef.current = ws;

      fallbackTimer = setTimeout(() => {
        if (!fallen && ws.readyState !== WebSocket.OPEN) {
          fallen = true;
          ws.close();
          startMock();
        }
      }, WS_FALLBACK_TIMEOUT);

      ws.onopen = () => {
        if (fallbackTimer) clearTimeout(fallbackTimer);
        setConnected(true);
        setIsLive(true);
        backoff.current = 1000;
      };

      ws.onmessage = (e) => {
        try {
          const event: ActivityEvent = JSON.parse(e.data);
          addEvent(event);
        } catch {
          // skip malformed
        }
      };

      ws.onclose = () => {
        setConnected(false);
        setIsLive(false);
        if (!fallen) {
          reconnectTimer.current = setTimeout(() => {
            backoff.current = Math.min(backoff.current * 2, 30000);
            connect();
          }, backoff.current);
        }
      };

      ws.onerror = () => ws.close();
    }

    connect();

    return () => {
      if (fallbackTimer) clearTimeout(fallbackTimer);
      if (mockTimer.current) clearInterval(mockTimer.current);
      wsRef.current?.close();
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };
  }, [addEvent, startMock]);

  return { events, connected, isLive };
}
