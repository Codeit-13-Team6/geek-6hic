"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "w-full cursor-pointer rounded-xl font-black active:scale-[0.98] bg-main-purple text-white hover:bg-slate-900 disabled:bg-gray-100 disabled:text-gray-600",
        outline:
          "w-full cursor-pointer rounded-xl font-black active:scale-[0.98] bg-transparent text-slate-950 border-2 border-slate-950 hover:bg-slate-950 hover:text-white",
        teritary:
          "w-full cursor-pointer rounded-xl font-black active:scale-[0.98] bg-white text-slate-600 border border-slate-200 hover:bg-slate-50",
        orange:
          "w-full cursor-pointer rounded-xl font-black active:scale-[0.98] bg-[#FFB900] text-slate-950 border-none hover:bg-[#E5A700] shadow-lg shadow-[#FFB900]/20",
        "outline-subtle":
          "rounded-lg text-sm font-medium border-border bg-background hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        ghost:
          "rounded-lg text-sm font-medium hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        secondary:
          "rounded-lg text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "rounded-lg text-sm font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
        link: "text-sm font-medium text-primary underline-offset-4 hover:underline",
      },
      size: {
        xxs: "h-7 gap-1 px-2.5 text-xs",
        xs: "h-8 gap-1.5 px-2.5 text-sm",
        sm: "h-9 gap-1.5 px-2.5 text-sm",
        md: "h-10 text-xs px-4 uppercase tracking-widest",
        lg: "h-12 text-base px-6",
        xl: "h-14 text-lg px-6",
        "responsive-lg": "h-12 text-base sm:h-14 sm:text-lg px-6",
        "fixed-lg": "h-12 text-base px-6",
        icon: "size-10 rounded-full",
        "icon-xxs": "size-6 rounded-full",
        "icon-xs": "size-7",
        "icon-sm": "size-8",
        "icon-md": "size-10 rounded-full",
        "icon-lg": "size-14 rounded-full",
        "icon-xl": "size-16 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "xl",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "xl",
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

export { Button, buttonVariants };
