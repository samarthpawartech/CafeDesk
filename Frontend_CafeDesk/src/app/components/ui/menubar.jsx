"use client";

import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";

import { cn } from "./utils";

// Root Menubar
function Menubar({ className, ...props }) {
  return (
    <MenubarPrimitive.Root
      className={cn("flex space-x-2", className)}
      {...props}
    />
  );
}

// Menu wrapper
function MenubarMenu({ children, ...props }) {
  return <MenubarPrimitive.Menu {...props}>{children}</MenubarPrimitive.Menu>;
}

// Group wrapper
function MenubarGroup({ children, ...props }) {
  return <MenubarPrimitive.Group {...props}>{children}</MenubarPrimitive.Group>;
}

// Portal wrapper
function MenubarPortal({ children, ...props }) {
  return (
    <MenubarPrimitive.Portal {...props}>{children}</MenubarPrimitive.Portal>
  );
}

// RadioGroup wrapper
function MenubarRadioGroup({ children, ...props }) {
  return (
    <MenubarPrimitive.RadioGroup {...props}>
      {children}
    </MenubarPrimitive.RadioGroup>
  );
}

// Trigger (button) for Menubar menu
function MenubarTrigger({ className, children, ...props }) {
  return (
    <MenubarPrimitive.Trigger
      className={cn(
        "px-3 py-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
        className,
      )}
      {...props}
    >
      {children}
    </MenubarPrimitive.Trigger>
  );
}

// Content (dropdown) for Menubar menu
function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  children,
  ...props
}) {
  return (
    <MenubarPrimitive.Content
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      className={cn(
        "min-w-[180px] rounded-md border bg-white p-1 shadow-md",
        className,
      )}
      {...props}
    >
      {children}
    </MenubarPrimitive.Content>
  );
}

// Individual item
function MenubarItem({
  className,
  children,
  inset,
  variant = "default",
  ...props
}) {
  return (
    <MenubarPrimitive.Item
      className={cn(
        "relative flex items-center px-3 py-2 text-sm rounded-md cursor-pointer select-none outline-none focus:bg-gray-100",
        inset && "pl-8",
        className,
      )}
      {...props}
    >
      {children}
    </MenubarPrimitive.Item>
  );
}

// Checkbox item
function MenubarCheckboxItem({ className, children, checked, ...props }) {
  return (
    <MenubarPrimitive.CheckboxItem
      checked={checked}
      className={cn(
        "relative flex items-center px-3 py-2 text-sm rounded-md cursor-pointer select-none outline-none focus:bg-gray-100",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2">
        {checked && <CheckIcon className="w-4 h-4" />}
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  );
}

// Radio item
function MenubarRadioItem({ className, children, ...props }) {
  return (
    <MenubarPrimitive.RadioItem
      className={cn(
        "relative flex items-center px-3 py-2 text-sm rounded-md cursor-pointer select-none outline-none focus:bg-gray-100",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2">
        <CircleIcon className="w-4 h-4" />
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  );
}

// Label
function MenubarLabel({ className, inset, children, ...props }) {
  return (
    <MenubarPrimitive.Label
      className={cn(
        "px-3 py-1 text-xs font-medium text-gray-500 uppercase",
        inset && "pl-8",
        className,
      )}
      {...props}
    >
      {children}
    </MenubarPrimitive.Label>
  );
}

// Separator
function MenubarSeparator({ className, ...props }) {
  return (
    <MenubarPrimitive.Separator
      className={cn("my-1 h-px bg-gray-200", className)}
      {...props}
    />
  );
}

// Shortcut text
function MenubarShortcut({ className, children, ...props }) {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest text-gray-500", className)}
      {...props}
    >
      {children}
    </span>
  );
}

// Submenu
function MenubarSub({ children, ...props }) {
  return <MenubarPrimitive.Sub {...props}>{children}</MenubarPrimitive.Sub>;
}

// Submenu trigger
function MenubarSubTrigger({ className, inset, children, ...props }) {
  return (
    <MenubarPrimitive.SubTrigger
      className={cn(
        "relative flex items-center px-3 py-2 text-sm rounded-md cursor-pointer select-none outline-none focus:bg-gray-100",
        inset && "pl-8",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto w-4 h-4" />
    </MenubarPrimitive.SubTrigger>
  );
}

// Submenu content
function MenubarSubContent({ className, children, ...props }) {
  return (
    <MenubarPrimitive.SubContent
      className={cn(
        "min-w-[180px] rounded-md border bg-white p-1 shadow-md",
        className,
      )}
      {...props}
    >
      {children}
    </MenubarPrimitive.SubContent>
  );
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
};
