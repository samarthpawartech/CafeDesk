"use client";

import * as React from "react";
import { cn } from "./utils";

// Main Table wrapper
function Table({ className, children, ...props }) {
  return (
    <table
      className={cn("min-w-full divide-y divide-gray-200", className)}
      {...props}
    >
      {children}
    </table>
  );
}

// Table header wrapper
function TableHeader({ className, children, ...props }) {
  return (
    <thead className={cn("bg-gray-50", className)} {...props}>
      {children}
    </thead>
  );
}

// Table body wrapper
function TableBody({ className, children, ...props }) {
  return (
    <tbody
      className={cn("bg-white divide-y divide-gray-200", className)}
      {...props}
    >
      {children}
    </tbody>
  );
}

// Table footer wrapper
function TableFooter({ className, children, ...props }) {
  return (
    <tfoot className={cn("bg-gray-50", className)} {...props}>
      {children}
    </tfoot>
  );
}

// Table row
function TableRow({ className, children, ...props }) {
  return (
    <tr className={cn("hover:bg-gray-100", className)} {...props}>
      {children}
    </tr>
  );
}

// Table head cell
function TableHead({ className, children, ...props }) {
  return (
    <th
      scope="col"
      className={cn(
        "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
        className,
      )}
      {...props}
    >
      {children}
    </th>
  );
}

// Table body cell
function TableCell({ className, children, ...props }) {
  return (
    <td
      className={cn(
        "px-6 py-4 whitespace-nowrap text-sm text-gray-900",
        className,
      )}
      {...props}
    >
      {children}
    </td>
  );
}

// Table caption
function TableCaption({ className, children, ...props }) {
  return (
    <caption
      className={cn("text-sm text-gray-500 text-left mt-2", className)}
      {...props}
    >
      {children}
    </caption>
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
