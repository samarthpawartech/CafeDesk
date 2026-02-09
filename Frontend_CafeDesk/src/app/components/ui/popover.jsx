"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "./utils";

// Root Popover wrapper
function Popover({ children, ...props }) {
  return <PopoverPrimitive.Root {...props}>{children}</PopoverPrimitive.Root>;
}

// Popover trigger
function PopoverTrigger({ children, ...props }) {
  return (
    <PopoverPrimitive.Trigger {...props}>{children}</PopoverPrimitive.Trigger>
  );
}

// Popover content
function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  children,
  ...props
}) {
  return (
    <PopoverPrimitive.Content
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "rounded-md border bg-white p-4 shadow-md animate-in fade-in-80",
        className,
      )}
      {...props}
    >
      {children}
      <PopoverPrimitive.Arrow className="fill-white" />
    </PopoverPrimitive.Content>
  );
}

// Popover anchor
function PopoverAnchor({ children, ...props }) {
  return (
    <PopoverPrimitive.Anchor {...props}>{children}</PopoverPrimitive.Anchor>
  );
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
