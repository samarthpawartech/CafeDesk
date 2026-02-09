"use client";

import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import { cn } from "./utils";
import { Button, buttonVariants } from "./button";

// Root Pagination wrapper
function Pagination({ className, children, ...props }) {
  return (
    <nav
      className={cn("inline-flex items-center space-x-2", className)}
      {...props}
    >
      {children}
    </nav>
  );
}

// Pagination content wrapper
function PaginationContent({ className, children, ...props }) {
  return (
    <ul
      className={cn("inline-flex items-center space-x-1", className)}
      {...props}
    >
      {children}
    </ul>
  );
}

// Individual pagination item
function PaginationItem({ children, className, ...props }) {
  return (
    <li className={cn("inline-block", className)} {...props}>
      {children}
    </li>
  );
}

// Pagination link button
function PaginationLink({
  className,
  isActive,
  size = "icon",
  children,
  ...props
}) {
  return (
    <Button
      size={size}
      variant={isActive ? "default" : "outline"}
      className={cn("px-2 py-1 rounded-md", className)}
      {...props}
    >
      {children}
    </Button>
  );
}

// Previous button
function PaginationPrevious({ className, ...props }) {
  return (
    <Button
      variant="outline"
      className={cn("flex items-center space-x-1", className)}
      {...props}
    >
      <ChevronLeftIcon className="w-4 h-4" />
      <span>Previous</span>
    </Button>
  );
}

// Next button
function PaginationNext({ className, ...props }) {
  return (
    <Button
      variant="outline"
      className={cn("flex items-center space-x-1", className)}
      {...props}
    >
      <span>Next</span>
      <ChevronRightIcon className="w-4 h-4" />
    </Button>
  );
}

// Ellipsis for skipped pages
function PaginationEllipsis({ className, ...props }) {
  return (
    <span
      className={cn("flex items-center px-2 py-1 text-gray-500", className)}
      {...props}
    >
      <MoreHorizontalIcon className="w-4 h-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
