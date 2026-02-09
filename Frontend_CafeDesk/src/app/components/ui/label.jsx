"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "./utils";

function Label({ className, ...props }) {
  return (
    <LabelPrimitive.Root
      className={cn("text-sm font-medium text-gray-700", className)}
      {...props}
    />
  );
}

export { Label };
