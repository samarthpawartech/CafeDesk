"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Toaster as SonnerToaster } from "sonner";

function Toaster({ ...props }) {
  const { theme = "system" } = useTheme();

  return (
    <SonnerToaster
      theme={theme === "system" ? "light" : theme} // fallback to light if system
      position="top-right"
      {...props}
    />
  );
}

export { Toaster };
