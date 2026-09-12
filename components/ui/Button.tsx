"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "champagne" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  showArrow?: boolean;
  children: React.ReactNode;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  href,
  showArrow = false,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-sans tracking-[0.2em] text-xs uppercase font-bold transition-all duration-300 ease-out focus:outline-none disabled:opacity-50 disabled:pointer-events-none group rounded-full";

  const sizeStyles = {
    sm: "px-5 py-2.5 text-[11px]",
    md: "px-7 py-3.5 text-xs",
    lg: "px-9 py-4 text-[13px]",
  };

  const variantStyles = {
    primary:
      "bg-[#A78D78] text-black hover:bg-[#BEB5A9] shadow-xl border border-black font-extrabold",
    outline:
      "bg-transparent text-black border border-black hover:bg-[#BEB5A9]/50 font-extrabold",
    champagne:
      "bg-[#E1D4C2] text-black hover:bg-[#BEB5A9] shadow-xl border border-black font-extrabold",
    ghost:
      "bg-transparent text-black hover:text-black px-0 py-2 border-b border-black font-extrabold",
  };

  const content = (
    <>
      <span>{children}</span>
      {showArrow && (
        <ArrowUpRight
          className={cn(
            "ml-2 w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-black"
          )}
        />
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {content}
    </button>
  );
}
