"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "./utils";

// Tabs root
function Tabs({ className, children, ...props }) {
  return (
    <TabsPrimitive.Root className={cn("flex flex-col", className)} {...props}>
      {children}
    </TabsPrimitive.Root>
  );
}

// Tabs list (the tab headers)
function TabsList({ className, children, ...props }) {
  return (
    <TabsPrimitive.List
      className={cn("flex border-b border-gray-200", className)}
      {...props}
    >
      {children}
    </TabsPrimitive.List>
  );
}

// Single tab trigger (tab button)
function TabsTrigger({ className, children, ...props }) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "px-4 py-2 text-sm font-medium text-gray-700 rounded-t-lg hover:bg-gray-100 data-[state=active]:bg-white data-[state=active]:text-blue-600",
        className,
      )}
      {...props}
    >
      {children}
    </TabsPrimitive.Trigger>
  );
}

// Tabs content (the panel)
function TabsContent({ className, children, ...props }) {
  return (
    <TabsPrimitive.Content
      className={cn("p-4 bg-white rounded-b-lg", className)}
      {...props}
    >
      {children}
    </TabsPrimitive.Content>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
