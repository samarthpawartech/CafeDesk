"use client";

import * as React from "react";
import { GripVerticalIcon } from "lucide-react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { cn } from "./utils";

// PanelGroup wrapper
function ResizablePanelGroup({ className, children, ...props }) {
  return (
    <PanelGroup className={cn("flex w-full h-full", className)} {...props}>
      {children}
    </PanelGroup>
  );
}

// Individual Panel
function ResizablePanel({ children, ...props }) {
  return <Panel {...props}>{children}</Panel>;
}

// Resize handle between panels
function ResizableHandle({ withHandle = true, className, ...props }) {
  return (
    <PanelResizeHandle
      className={cn(
        "flex items-center justify-center w-3 cursor-col-resize bg-gray-100 hover:bg-gray-200",
        className,
      )}
      {...props}
    >
      {withHandle && <GripVerticalIcon className="w-4 h-4 text-gray-500" />}
    </PanelResizeHandle>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
