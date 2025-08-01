import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-amber-900 text-yellow-400 text-xs sm:text-lg font-bold hover:bg-amber-800 h-16 px-3 sm:px-6 rounded-full cursor-pointer",
        leaderboard:
          "bg-amber-900 text-yellow-400 text-xs sm:text-lg font-bold rounded-full px-3 sm:px-6 py-2 sm:py-3 hover:bg-amber-800 cursor-pointer",
        edit: "bg-green-200 text-green-900 text-xs sm:text-lg font-bold rounded-full px-3 sm:px-6 py-2 sm:py-3 hover:bg-green-300 cursor-pointer",
        danger:
          "bg-red-200 text-red-900 text-xs sm:text-lg font-bold rounded-full px-3 sm:px-6 py-2 sm:py-3 hover:bg-red-300 cursor-pointer",
        placeholder: "h-8 sm:h-10 px-3 sm:px-6 rounded-full invisible",
        nav: "bg-[#FFF1D4] text-amber-900 hover:bg-amber-200 rounded-full p-2 [&_svg]:size-16",
      },
      size: {
        // default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        nav: "size-16",
        default: "h-13",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
