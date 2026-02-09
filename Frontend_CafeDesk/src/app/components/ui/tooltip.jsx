"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "./utils";

// TooltipProvider wrapper
function TooltipProvider({ delayDuration = 0, children, ...props }) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration} {...props}>
      {children}
    </TooltipPrimitive.Provider>
  );
}

// Tooltip wrapper
function Tooltip({ children, ...props }) {
  return <TooltipPrimitive.Root {...props}>{children}</TooltipPrimitive.Root>;
}

// Tooltip trigger (the element that shows the tooltip)
function TooltipTrigger({ children, ...props }) {
  return (
    <TooltipPrimitive.Trigger asChild {...props}>
      {children}
    </TooltipPrimitive.Trigger>
  );
}

// Tooltip content (the popup)
function TooltipContent({ className, sideOffset = 4, children, ...props }) {
  return (
    <TooltipPrimitive.Content
      sideOffset={sideOffset}
      className={cn(
        "rounded-md bg-gray-900 px-2 py-1 text-xs text-white shadow-md animate-in fade-in",
        className,
      )}
      {...props}
    >
      {children}
      <TooltipPrimitive.Arrow className="fill-gray-900" />
    </TooltipPrimitive.Content>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
