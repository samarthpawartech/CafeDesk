"use client";

import * as React from "react";
import * as DrawerPrimitive from "vaul";
import { cn } from "./utils";

function Drawer(props) {
  return <DrawerPrimitive.Root {...props} />;
}

function DrawerTrigger(props) {
  return <DrawerPrimitive.Trigger {...props} />;
}

function DrawerPortal(props) {
  return <DrawerPrimitive.Portal {...props} />;
}

function DrawerClose(props) {
  return <DrawerPrimitive.Close {...props} />;
}

function DrawerOverlay({ className, ...props }) {
  return (
    <DrawerPrimitive.Overlay
      className={cn(
        "fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity",
        className,
      )}
      {...props}
    />
  );
}

function DrawerContent({ className, children, ...props }) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        className={cn(
          "fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg p-6 outline-none",
          className,
        )}
        {...props}
      >
        {children}
        <DrawerClose
          className={cn(
            "absolute right-4 top-4 inline-flex h-6 w-6 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none",
          )}
        >
          ×
        </DrawerClose>
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

function DrawerHeader({ className, ...props }) {
  return (
    <div className={cn("flex flex-col space-y-2", className)} {...props} />
  );
}

function DrawerFooter({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex flex-row-reverse items-center px-4 py-3 gap-2",
        className,
      )}
      {...props}
    />
  );
}

function DrawerTitle({ className, ...props }) {
  return (
    <DrawerPrimitive.Title
      className={cn("text-lg font-semibold text-gray-900", className)}
      {...props}
    />
  );
}

function DrawerDescription({ className, ...props }) {
  return (
    <DrawerPrimitive.Description
      className={cn("text-sm text-gray-500", className)}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerTrigger,
  DrawerPortal,
  DrawerOverlay,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
