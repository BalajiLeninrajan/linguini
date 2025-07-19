import * as React from "react"

import { cn } from "~/lib/utils"

interface CardProps extends React.ComponentProps<"div"> {
  variant?: "default" | "yellow";
}

function Card({ className, variant = "default", ...props }: CardProps) {
  const variantClass =
    variant === "yellow"
      ? "bg-[#F6CF81] rounded-xl"
      : "";
  return (
    <div
      data-slot="card"
      className={cn(
        "text-card-foreground flex flex-col gap-2 sm:gap-3 md:gap-4 lg:gap-6 py-1 sm:py-2 md:py-4 lg:py-6 px-1 sm:px-2 md:px-4 lg:px-6",
        variantClass,
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1 sm:gap-1.5 px-2 sm:px-3 md:px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-3 sm:pb-4 md:pb-6", // responsive horizontal padding
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-bold text-center text-lg sm:text-xl md:text-2xl lg:text-4xl text-amber-900", className)} // responsive text size
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-xs sm:text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-2 sm:px-3 md:px-6 space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6", className)} // responsive horizontal padding and spacing
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-2 sm:px-3 md:px-6 [.border-t]:pt-2 sm:pt-3 md:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
