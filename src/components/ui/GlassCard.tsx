"use client";

import { motion } from "motion/react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
  neon?: boolean;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className = "",
  elevated = false,
  neon = false,
  onClick,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onClick={onClick}
      className={`
        ${elevated ? "glass-elevated" : "glass"}
        ${neon ? "neon-border" : ""}
        ${onClick ? "cursor-pointer hover:bg-glass-bg-hover transition-colors" : ""}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
