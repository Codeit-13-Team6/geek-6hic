"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/shadcnOrigin/dropdown-menu";
import { cn } from "@/lib/utils";

interface ContentProps extends React.ComponentProps<
  typeof DropdownMenuContent
> {
  size?: "sm" | "md" | "lg";
}

function Content({ className, size = "md", ...props }: ContentProps) {
  return (
    <DropdownMenuContent
      className={cn(
        "rounded-xl shadow-md",

        size === "sm" && "min-w-[120px] text-xs",
        size === "md" && "min-w-[140px] text-sm",
        size === "lg" && "min-w-[180px] text-base",

        "p-1 sm:p-2",
        className,
      )}
      {...props}
    />
  );
}

interface ItemProps extends React.ComponentProps<typeof DropdownMenuItem> {
  variant?: "default" | "destructive";
}

function Item({ className, variant = "default", ...props }: ItemProps) {
  return (
    <DropdownMenuItem
      className={cn(
        "cursor-pointer rounded-md px-3 py-2 transition-colors",
        "focus:bg-gray-100",
        variant === "destructive" &&
          "text-red-500 focus:bg-red-50 focus:text-red-600",
        className,
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  Content as DropdownMenuContent,
  Item as DropdownMenuItem,
};
