"use client";

import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "./utils";

// Root NavigationMenu
function NavigationMenu({ className, children, viewport = true, ...props }) {
  return (
    <NavigationMenuPrimitive.Root
      className={cn("relative flex", className)}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

// List wrapper
function NavigationMenuList({ className, children, ...props }) {
  return (
    <NavigationMenuPrimitive.List
      className={cn("flex list-none p-1 m-0", className)}
      {...props}
    >
      {children}
    </NavigationMenuPrimitive.List>
  );
}

// Individual item
function NavigationMenuItem({ className, children, ...props }) {
  return (
    <NavigationMenuPrimitive.Item
      className={cn("relative", className)}
      {...props}
    >
      {children}
    </NavigationMenuPrimitive.Item>
  );
}

// Trigger styles using cva
const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
);

// Trigger button
function NavigationMenuTrigger({ className, children, ...props }) {
  return (
    <NavigationMenuPrimitive.Trigger
      className={cn(navigationMenuTriggerStyle(), className)}
      {...props}
    >
      {children} <ChevronDownIcon className="ml-1 w-4 h-4" />
    </NavigationMenuPrimitive.Trigger>
  );
}

// Content (dropdown)
function NavigationMenuContent({ className, children, ...props }) {
  return (
    <NavigationMenuPrimitive.Content
      className={cn(
        "absolute top-full left-0 z-50 mt-2 min-w-[200px] rounded-md border bg-white p-4 shadow-md",
        className,
      )}
      {...props}
    >
      {children}
    </NavigationMenuPrimitive.Content>
  );
}

// Viewport (for animation & portal)
function NavigationMenuViewport({ className, ...props }) {
  return (
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "absolute top-full left-0 mt-2 h-0 w-full origin-top-left overflow-hidden rounded-md border bg-white shadow-md transition-all data-[state=open]:h-64",
        className,
      )}
      {...props}
    />
  );
}

// Link
function NavigationMenuLink({ className, children, ...props }) {
  return (
    <NavigationMenuPrimitive.Link
      className={cn(
        "block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md",
        className,
      )}
      {...props}
    >
      {children}
    </NavigationMenuPrimitive.Link>
  );
}

// Indicator
function NavigationMenuIndicator({ className, ...props }) {
  return (
    <NavigationMenuPrimitive.Indicator
      className={cn(
        "top-full z-10 h-2 w-2 rotate-45 bg-white shadow-md",
        className,
      )}
      {...props}
    />
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};
