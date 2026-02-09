"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { cn } from "./utils";

// ScrollArea wrapper
function ScrollArea({ className, children, ...props }) {
  return (
    <ScrollAreaPrimitive.Root
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport className="w-full h-full">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar orientation="vertical" />
      <ScrollBar orientation="horizontal" />
      <ScrollAreaPrimitive.Corner className="bg-gray-200" />
    </ScrollAreaPrimitive.Root>
  );
}

// ScrollBar component
function ScrollBar({ className, orientation = "vertical", ...props }) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      className={cn(
        "flex touch-none select-none transition-colors bg-gray-200 hover:bg-gray-300",
        orientation === "vertical" ? "w-2" : "h-2",
        className,
      )}
      orientation={orientation}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb className="flex-1 bg-gray-400 rounded-full" />
    </ScrollAreaPrimitive.Scrollbar>
  );
}

export { ScrollArea, ScrollBar };
