"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "w-full group/button inline-flex shrink-0 items-center justify-center rounded-10 border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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
        default: "h-15 text-xl font-semibold rounded-2xl",
        sm: "h-10 text-sm font-semibold rounded-xl px-4",
        md: "h-12 text-base font-semibold rounded-xl",
        icon: "size-8",
        "icon-xs": "size-4.5 rounded-full",
        "icon-sm": "size-10 rounded-full",
        "icon-md": "size-12 rounded-full",
        "icon-lg": "size-15 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function BtnCommon({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { BtnCommon, buttonVariants };
