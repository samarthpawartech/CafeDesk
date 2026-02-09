"use client";

import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

import { cn } from "./utils";

// Wrapper for HoverCard
function HoverCard({ children, ...props }) {
  return (
    <HoverCardPrimitive.Root {...props}>{children}</HoverCardPrimitive.Root>
  );
}

// Trigger component
function HoverCardTrigger({ children, ...props }) {
  return (
    <HoverCardPrimitive.Trigger {...props}>
      {children}
    </HoverCardPrimitive.Trigger>
  );
}

// Content component
function HoverCardContent({
  className,
  align = "center",
  sideOffset = 4,
  children,
  ...props
}) {
  return (
    <HoverCardPrimitive.Content
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "rounded-md border bg-white p-4 shadow-md animate-in fade-in-80",
        className,
      )}
      {...props}
    >
      {children}
    </HoverCardPrimitive.Content>
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };
