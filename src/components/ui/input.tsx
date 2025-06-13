import * as React from "react"

import { cn } from "~/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        `w-full h-14 px-6 rounded-3xl bg-white/50 \
         text-center text-lg font-inter text-[#888888]\n         border border-[#888888]/20 placeholder-[#888888]/60\n         focus:outline-none focus:border-[#7A532A]`,
        className
      )}
      {...props}
    />
  )
)
Input.displayName = "Input"
