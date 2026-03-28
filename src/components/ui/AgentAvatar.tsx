"use client";

interface AgentAvatarProps {
  agentId: string;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

function deriveHue(id: string): number {
  let h = 0;
  for (let i = 0; i < Math.min(id.length, 16); i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return h % 360;
}

const SIZES: Record<string, string> = {
  xs: "h-5 w-5 text-[9px]",
  sm: "h-7 w-7 text-[11px]",
  md: "h-9 w-9 text-sm",
  lg: "h-14 w-14 text-lg",
  xl: "h-20 w-20 text-2xl",
};

export function AgentAvatar({
  agentId,
  name,
  size = "md",
  className = "",
}: AgentAvatarProps) {
  const hue = deriveHue(agentId);
  const initial = (name || "?")[0].toUpperCase();

  return (
    <div
      className={`${SIZES[size]} rounded-full flex items-center justify-center font-bold flex-shrink-0 select-none ${className}`}
      style={{
        background: `radial-gradient(circle at 35% 35%, hsl(${hue},75%,60%), hsl(${hue},65%,30%))`,
        boxShadow: `0 0 10px hsla(${hue},75%,50%,0.25)`,
      }}
    >
      <span className="leading-none" style={{ color: `hsl(${hue},20%,95%)` }}>
        {initial}
      </span>
    </div>
  );
}
