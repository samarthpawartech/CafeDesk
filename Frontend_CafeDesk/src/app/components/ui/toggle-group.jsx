"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cn } from "./utils";
import { toggleVariants } from "./toggle"; // assuming this exists

// Context to provide default size/variant to items
const ToggleGroupContext = React.createContext({
  size: "default",
  variant: "default",
});

// ToggleGroup wrapper
function ToggleGroup({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}) {
  return (
    <ToggleGroupContext.Provider value={{ variant, size }}>
      <ToggleGroupPrimitive.Root
        type="single"
        className={cn("inline-flex rounded-md", className)}
        {...props}
      >
        {children}
      </ToggleGroupPrimitive.Root>
    </ToggleGroupContext.Provider>
  );
}

// ToggleGroup item
function ToggleGroupItem({ className, children, variant, size, ...props }) {
  const context = React.useContext(ToggleGroupContext);

  const finalVariant = variant || context.variant;
  const finalSize = size || context.size;

  return (
    <ToggleGroupPrimitive.Item
      className={cn(
        toggleVariants({ variant: finalVariant, size: finalSize }),
        "focus:outline-none focus:ring-2 focus:ring-blue-500",
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

export { ToggleGroup, ToggleGroupItem };
