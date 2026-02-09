import * as React from "react";
import { cn } from "./utils";

// Skeleton loader component
function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded bg-gray-200 dark:bg-gray-700",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
