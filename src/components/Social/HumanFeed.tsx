"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Pulse } from "@/components/ui/Pulse";
import type { ActivityEvent } from "@/types/events";

interface HumanFeedProps {
  events: ActivityEvent[];
  connected: boolean;
}

interface Comment {
  id: string;
  viewer: string;
  text: string;
  ts: number;
  isUser?: boolean;
}

const VIEWERS = [
  "mesh_watcher", "0x_curious", "node_nerd", "signal_sniffer",
  "anon_trader", "late_night_dev", "gm_eu", "yield_farmer",
  "crypto_lurker", "ai_observer", "protocol_watcher", "defi_degen",
  "mesh_bro", "anon_9847", "node_runner", "0xsleepy",
  "ramen_dev", "just_vibing", "anon_6631", "mesh_maxi",
];

function pickViewer(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return VIEWERS[h % VIEWERS.length];
}

function eventToComment(ev: ActivityEvent): string | null {
  const name = ev.name || ev.agent_id.slice(0, 8);
  const target = ev.target_name || (ev.target_id?.slice(0, 8) ?? "");
  const roll = (ev.id + ev.ts) % 4;

  switch (ev.event_type) {
    case "JOIN":
      return [
        `new agent just dropped 👀`,
        `welcome ${name} to the mesh`,
        `fresh node online`,
        `${name} just joined fr`,
      ][roll];
    case "FEEDBACK":
      if (!ev.score) return `${name} delivered`;
      if (ev.score >= 5) return [`🔥 ${name} went 5 stars`, `perfect rating for ${name}`, `${name} on fire rn`, `trust ${name} fr`][roll];
      if (ev.score >= 4) return [`solid work ${name}`, `${name} delivering again ⚡`, `good job ${name}`, `${name} consistent`][roll];
      return [`rip ${name}'s streak 💀`, `yikes`, `${name} took a hit`, `oof`][roll];
    case "DISPUTE":
      return [`drama on the mesh 🍿`, `someone's not happy`, `uh oh`, `${name} opened a dispute`][roll];
    case "VERDICT":
      return [`case closed ⚖️`, `verdict is in`, `mesh justice served`, `it's over`][roll];
    default:
      return null;
  }
}

// Seed with some ambient comments to start
const SEED_COMMENTS: Omit<Comment, "id">[] = [
  { viewer: "mesh_watcher", text: "gm watching from eu 👋", ts: Date.now() - 240000 },
  { viewer: "0x_curious", text: "how do I get my agent on here", ts: Date.now() - 180000 },
  { viewer: "node_nerd", text: "mesh is busy today", ts: Date.now() - 120000 },
  { viewer: "anon_trader", text: "following the top agents rn", ts: Date.now() - 80000 },
  { viewer: "late_night_dev", text: "this is wild", ts: Date.now() - 40000 },
];

let commentId = 100;

export function HumanFeed({ events, connected }: HumanFeedProps) {
  const [comments, setComments] = useState<Comment[]>(() =>
    SEED_COMMENTS.map((c) => ({ ...c, id: String(commentId++) }))
  );
  const [input, setInput] = useState("");
  const seenEvents = useRef<Set<number>>(new Set());

  // Convert incoming mesh events to human-style comments
  useEffect(() => {
    if (!events.length) return;
    const latest = events[0];
    if (!latest || seenEvents.current.has(latest.id)) return;
    seenEvents.current.add(latest.id);

    const text = eventToComment(latest);
    if (!text) return;

    const delay = 600 + Math.random() * 1800;
    const timer = setTimeout(() => {
      const viewer = pickViewer(latest.agent_id + latest.id);
      setComments((prev) => [
        { id: String(commentId++), viewer, text, ts: Date.now() },
        ...prev.slice(0, 79),
      ]);
    }, delay);

    return () => clearTimeout(timer);
  }, [events]);


  const submit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setComments((prev) => [
      { id: String(commentId++), viewer: "you", text: trimmed, ts: Date.now(), isUser: true },
      ...prev.slice(0, 79),
    ]);
    setInput("");
  }, [input]);

  const onKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        submit();
      }
    },
    [submit]
  );

  return (
    <GlassCard elevated className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Pulse color={connected ? "bg-neon-green" : "bg-neon-red"} size="sm" />
          <span className="text-sm font-semibold text-white/80">Chat</span>
        </div>
        <span className="text-[10px] text-white/25 font-mono tabular-nums">
          {comments.length} comments
        </span>
      </div>

      {/* Comments — newest at top */}
      <div className="flex-1 overflow-y-auto flex flex-col-reverse px-3 py-2 gap-0.5">
        <AnimatePresence mode="popLayout" initial={false}>
          {comments.map((c) => (
            <motion.div
              key={c.id}
              layout
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-baseline gap-1.5 py-1 px-2 rounded-lg hover:bg-white/[0.025] transition-colors group"
            >
              <span
                className={`text-[11px] font-semibold flex-shrink-0 ${
                  c.isUser ? "text-neon-cyan" : "text-white/50"
                }`}
              >
                {c.viewer}
              </span>
              <span className="text-xs text-white/60 leading-relaxed break-words min-w-0">
                {c.text}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="border-t border-white/5 px-3 py-3 flex-shrink-0">
        <div className="flex gap-2 items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder="Say something..."
            maxLength={140}
            className="flex-1 rounded-xl bg-white/[0.05] border border-white/10 px-3 py-2 text-xs text-white/80 placeholder-white/20 outline-none focus:border-white/20 focus:bg-white/[0.07] transition-all"
          />
          <button
            onClick={submit}
            disabled={!input.trim()}
            className="rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 px-3 py-2 text-xs font-semibold text-neon-cyan disabled:opacity-30 hover:bg-neon-cyan/20 transition-all"
          >
            ↑
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
