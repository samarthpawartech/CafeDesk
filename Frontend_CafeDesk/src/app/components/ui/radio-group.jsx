"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CircleIcon } from "lucide-react";

import { cn } from "./utils";

// RadioGroup wrapper
function RadioGroup({ className, children, ...props }) {
  return (
    <RadioGroupPrimitive.Root
      className={cn("flex flex-col space-y-2", className)}
      {...props}
    >
      {children}
    </RadioGroupPrimitive.Root>
  );
}

// Individual Radio item
function RadioGroupItem({ className, children, ...props }) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        "relative flex items-center space-x-2 rounded-md border p-2 cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="absolute left-2 flex items-center justify-center w-4 h-4">
        <CircleIcon className="w-3 h-3 text-blue-500" />
      </RadioGroupPrimitive.Indicator>
      <span>{children}</span>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
