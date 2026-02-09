"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva } from "class-variance-authority";

import { cn } from "./utils";

// Define Tailwind variants for the Toggle
const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "bg-gray-200 text-gray-900 hover:bg-gray-300",
        outline:
          "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50",
      },
      size: {
        default: "h-9 px-4",
        sm: "h-8 px-3 text-sm",
        lg: "h-10 px-6 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

// Toggle component
function Toggle({ className, variant, size, ...props }) {
  return (
    <TogglePrimitive.Root
      className={cn(toggleVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
