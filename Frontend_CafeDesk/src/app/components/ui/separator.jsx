"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "./utils";

// Separator component
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return (
    <SeparatorPrimitive.Root
      className={cn(
        orientation === "vertical"
          ? "h-full w-px bg-gray-200"
          : "h-px w-full bg-gray-200",
        className,
      )}
      orientation={orientation}
      decorative={decorative}
      {...props}
    />
  );
}

export { Separator };
