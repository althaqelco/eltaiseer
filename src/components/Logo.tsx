import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  variant?: "light" | "dark";
}

export function Logo({ className = "", variant = "dark" }: LogoProps) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src="/logo.png"
        alt="التيسير للاستثمار العقاري"
        width={180}
        height={60}
        className={`object-contain ${variant === "light" ? "brightness-0 invert" : ""}`}
        priority
        style={{ 
          width: 'auto', 
          height: '100%',
          maxHeight: '100%'
        }}
      />
    </div>
  );
}
