"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "./utils";

// Root Sheet wrapper
function Sheet({ children, ...props }) {
  return <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>;
}

// Trigger button
function SheetTrigger({ children, ...props }) {
  return (
    <DialogPrimitive.Trigger {...props}>{children}</DialogPrimitive.Trigger>
  );
}

// Close button
function SheetClose({ children, ...props }) {
  return <DialogPrimitive.Close {...props}>{children}</DialogPrimitive.Close>;
}

// Portal wrapper
function SheetPortal({ children, ...props }) {
  return <DialogPrimitive.Portal {...props}>{children}</DialogPrimitive.Portal>;
}

// Overlay (background behind the sheet)
function SheetOverlay({ className, ...props }) {
  return (
    <DialogPrimitive.Overlay
      className={cn("fixed inset-0 bg-black/50 backdrop-blur-sm", className)}
      {...props}
    />
  );
}

// Sheet content
function SheetContent({ className, children, side = "right", ...props }) {
  const sideClasses = {
    top: "top-0 left-0 w-full h-1/2",
    bottom: "bottom-0 left-0 w-full h-1/2",
    left: "left-0 top-0 h-full w-80",
    right: "right-0 top-0 h-full w-80",
  };

  return (
    <DialogPrimitive.Content
      className={cn(
        "fixed bg-white shadow-lg p-6 outline-none animate-in",
        sideClasses[side],
        className,
      )}
      {...props}
    >
      {children}
      <SheetClose className="absolute top-4 right-4 rounded-full p-1 hover:bg-gray-200">
        <XIcon className="w-5 h-5" />
      </SheetClose>
    </DialogPrimitive.Content>
  );
}

// Header wrapper
function SheetHeader({ className, children, ...props }) {
  return (
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  );
}

// Footer wrapper
function SheetFooter({ className, children, ...props }) {
  return (
    <div className={cn("mt-4", className)} {...props}>
      {children}
    </div>
  );
}

// Title
function SheetTitle({ className, children, ...props }) {
  return (
    <DialogPrimitive.Title
      className={cn("text-lg font-semibold", className)}
      {...props}
    >
      {children}
    </DialogPrimitive.Title>
  );
}

// Description
function SheetDescription({ className, children, ...props }) {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm text-gray-500", className)}
      {...props}
    >
      {children}
    </DialogPrimitive.Description>
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
