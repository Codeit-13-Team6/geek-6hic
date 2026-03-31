"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "w-full cursor-pointer group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-sm font-black whitespace-nowrap transition-all outline-none select-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-main-purple text-white hover:bg-slate-900 disabled:bg-gray-100 disabled:text-gray-600",
        outline:
          "bg-transparent text-slate-950 border-2 border-slate-950 hover:bg-slate-950 hover:text-white",
        teritary:
          "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50",
        orange:
          "bg-[#FFB900] text-slate-950 border-none hover:bg-[#E5A700] shadow-lg shadow-[#FFB900]/20",
      },
      size: {
        default: "h-14 text-lg font-black rounded-2xl px-6",
        sm: "h-10 text-xs font-black rounded-xl px-4 uppercase tracking-widest",
        md: "h-12 text-base font-black rounded-xl sm:h-14 sm:text-lg",
        fixedSize: "h-12 text-base font-black rounded-xl px-6",
        icon: "size-10 rounded-full",
        "icon-xs": "size-6 rounded-full",
        "icon-sm": "size-10 rounded-full",
        "icon-md": "size-14 rounded-full",
        "icon-lg": "size-16 rounded-full",
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
