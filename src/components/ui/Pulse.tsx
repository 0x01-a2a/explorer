"use client";

interface PulseProps {
  color?: string;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: "h-2 w-2",
  md: "h-3 w-3",
  lg: "h-4 w-4",
};

export function Pulse({ color = "bg-neon-cyan", size = "md" }: PulseProps) {
  return (
    <span className="relative inline-flex">
      <span
        className={`${SIZES[size]} rounded-full ${color} animate-pulse-glow`}
      />
      <span
        className={`absolute inset-0 ${SIZES[size]} rounded-full ${color} opacity-40 animate-ping`}
      />
    </span>
  );
}
