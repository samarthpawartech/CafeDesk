"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { cn } from "./utils";

// Root Select wrapper
function Select({ children, ...props }) {
  return <SelectPrimitive.Root {...props}>{children}</SelectPrimitive.Root>;
}

// Group wrapper
function SelectGroup({ children, ...props }) {
  return <SelectPrimitive.Group {...props}>{children}</SelectPrimitive.Group>;
}

// Selected value
function SelectValue({ children, ...props }) {
  return <SelectPrimitive.Value {...props}>{children}</SelectPrimitive.Value>;
}

// Trigger button
function SelectTrigger({ className, size = "default", children, ...props }) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "inline-flex items-center justify-between rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
        size === "default" && "h-10",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon>
        <ChevronDownIcon className="w-4 h-4" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

// Content dropdown
function SelectContent({ className, children, position = "popper", ...props }) {
  return (
    <SelectPrimitive.Content
      className={cn(
        "overflow-hidden rounded-md border bg-white shadow-md animate-in fade-in-80",
        className,
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.ScrollUpButton className="flex items-center justify-center h-6 bg-gray-100 cursor-default">
        <ChevronUpIcon className="w-4 h-4" />
      </SelectPrimitive.ScrollUpButton>

      <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>

      <SelectPrimitive.ScrollDownButton className="flex items-center justify-center h-6 bg-gray-100 cursor-default">
        <ChevronDownIcon className="w-4 h-4" />
      </SelectPrimitive.ScrollDownButton>
    </SelectPrimitive.Content>
  );
}

// Label inside select
function SelectLabel({ className, children, ...props }) {
  return (
    <SelectPrimitive.Label
      className={cn("px-3 py-1 text-xs font-medium text-gray-500", className)}
      {...props}
    >
      {children}
    </SelectPrimitive.Label>
  );
}

// Individual option item
function SelectItem({ className, children, ...props }) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm outline-none focus:bg-gray-100 data-[highlighted]:bg-gray-100",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute left-2 inline-flex items-center">
        <CheckIcon className="w-4 h-4" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

// Separator
function SelectSeparator({ className, ...props }) {
  return (
    <SelectPrimitive.Separator
      className={cn("my-1 h-px bg-gray-200", className)}
      {...props}
    />
  );
}

// Scroll buttons (up & down)
function SelectScrollUpButton({ className, ...props }) {
  return (
    <SelectPrimitive.ScrollUpButton
      className={cn(
        "flex items-center justify-center h-6 bg-gray-100 cursor-default",
        className,
      )}
      {...props}
    >
      <ChevronUpIcon className="w-4 h-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({ className, ...props }) {
  return (
    <SelectPrimitive.ScrollDownButton
      className={cn(
        "flex items-center justify-center h-6 bg-gray-100 cursor-default",
        className,
      )}
      {...props}
    >
      <ChevronDownIcon className="w-4 h-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
