"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "w-full group/button inline-flex shrink-0 items-center justify-center rounded-10 border border-transparent bg-clip-padding text-14 font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-main-green-500 text-white hover:bg-main-green-600 disabled:bg-gray-100 disabled:text-gray-600",
        outline:
          "bg-background text-main-green-600 border border-main-green-500 hover:bg-main-green-100",
        teritary:
          "bg-white text-gray-600 border border-gray-200 hover:bg-main-green-100 aria-expanded:bg-secondary",
      },
      size: {
        default: "h-60 text-20 font-semibold rounded-16",
        sm: "h-40 text-14 font-semibold rounded-10 px-16",
        md: "h-48 text-16 font-semibold rounded-12",
        icon: "size-8",
        "icon-xs": "size-18 rounded-full",
        "icon-sm": "size-40 rounded-full",
        "icon-md": "size-48 rounded-full",
        "icon-lg": "size-60 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ButtonProps
  extends ButtonPrimitive.Props, VariantProps<typeof buttonVariants> {}

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
