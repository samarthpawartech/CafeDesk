"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { PanelLeftIcon } from "lucide-react";

import { useIsMobile } from "./use-mobile";
import { cn } from "./utils";
import { Button } from "./button";
import { Input } from "./input";
import { Separator } from "./separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./sheet";
import { Skeleton } from "./skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

const SidebarContext = React.createContext(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context)
    throw new Error("useSidebar must be used within a SidebarProvider.");
  return context;
}

function SidebarProvider({ defaultOpen = true, children }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(defaultOpen);
  const [openMobile, setOpenMobile] = React.useState(false);

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) setOpenMobile((prev) => !prev);
    else setOpen((prev) => !prev);
  }, [isMobile]);

  const contextValue = React.useMemo(
    () => ({
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      toggleSidebar,
      isMobile,
    }),
    [open, setOpen, openMobile, setOpenMobile, toggleSidebar, isMobile],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  );
}

function Sidebar({ children, className }) {
  const { open, openMobile, isMobile } = useSidebar();

  // Mobile sidebar via sheet
  if (isMobile) {
    return (
      <Sheet>
        <SheetContent side="left">{children}</SheetContent>
      </Sheet>
    );
  }

  // Desktop sidebar
  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-gray-50 border-r transition-all",
        open ? "w-64" : "w-16",
        className,
      )}
    >
      {children}
    </aside>
  );
}

function SidebarTrigger({ className, children, ...props }) {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      onClick={toggleSidebar}
      className={cn("mb-2", className)}
      {...props}
    >
      {children || "Toggle Sidebar"}
    </Button>
  );
}

// Basic structural components
function SidebarHeader({ className, children }) {
  return (
    <div className={cn("px-4 py-2 font-semibold", className)}>{children}</div>
  );
}
function SidebarFooter({ className, children }) {
  return <div className={cn("px-4 py-2 mt-auto", className)}>{children}</div>;
}
function SidebarContent({ className, children }) {
  return (
    <div className={cn("flex-1 overflow-y-auto", className)}>{children}</div>
  );
}
function SidebarSeparator({ className }) {
  return <Separator className={cn("my-2", className)} />;
}
function SidebarInset({ className, children }) {
  return <div className={cn("px-2 py-2", className)}>{children}</div>;
}

// Group
function SidebarGroup({ className, children }) {
  return <div className={cn("mb-2", className)}>{children}</div>;
}
function SidebarGroupLabel({ className, asChild = false, children }) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      className={cn(
        "px-2 py-1 text-xs font-medium text-gray-500 uppercase",
        className,
      )}
    >
      {children}
    </Comp>
  );
}
function SidebarGroupContent({ className, children }) {
  return <div className={cn("pl-2", className)}>{children}</div>;
}

// Menu / Items
function SidebarMenu({ className, children }) {
  return <div className={cn("flex flex-col", className)}>{children}</div>;
}
function SidebarMenuItem({ className, children }) {
  return (
    <div className={cn("px-2 py-1 hover:bg-gray-200 rounded-md", className)}>
      {children}
    </div>
  );
}
function SidebarMenuButton({ className, children, asChild = false }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(
        "w-full text-left px-2 py-1 rounded-md hover:bg-gray-200",
        className,
      )}
    >
      {children}
    </Comp>
  );
}

export {
  Sidebar,
  SidebarProvider,
  useSidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarSeparator,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
};
