"use client";

interface BadgeProps {
  variant: "online" | "offline" | "warning" | "info";
  children: React.ReactNode;
}

const VARIANTS = {
  online: "bg-neon-green/15 text-neon-green border-neon-green/30",
  offline: "bg-white/5 text-white/40 border-white/10",
  warning: "bg-neon-amber/15 text-neon-amber border-neon-amber/30",
  info: "bg-neon-cyan/15 text-neon-cyan border-neon-cyan/30",
};

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${VARIANTS[variant]}`}
    >
      {variant === "online" && (
        <span className="h-1.5 w-1.5 rounded-full bg-neon-green animate-pulse-glow" />
      )}
      {children}
    </span>
  );
}
