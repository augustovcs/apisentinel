"use client";

import React from "react";

type Props = {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
};

export default function Spinner({ size = "md", className = "" }: Props) {
  const sizeClass = `loading-${size}`;
  const sizeMap: Record<string, number> = {
    xs: 12,
    sm: 18,
    md: 28,
    lg: 44,
    xl: 80,
  };
  const px = sizeMap[size] ?? 28;

  return (
    <div className={`flex items-center justify-center ${className}`.trim()}>
      <span
        className={`loading loading-infinity ${sizeClass}`.trim()}
        style={{ width: px, height: px, display: "block" }}
        aria-hidden="true"
      />
      {/* fallback visible when daisyUI classes are not present; inline sizing overrides global default */}
      <span className="spinner" style={{ width: px, height: px, display: "block" }} aria-hidden="true"></span>
    </div>
  );
}
