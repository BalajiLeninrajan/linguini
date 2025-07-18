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
        "text-card-foreground flex flex-col gap-3 sm:gap-4 md:gap-6 py-2 sm:py-4 md:py-6 px-2 sm:px-4 md:px-6",
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
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-3 sm:px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6", // responsive horizontal padding
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
      className={cn("leading-none font-bold text-center text-2xl sm:text-4xl text-amber-900", className)} // responsive text size
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
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
      className={cn("px-3 sm:px-6 space-y-3 sm:space-y-4 md:space-y-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-3 sm:px-6 [.border-t]:pt-4 sm:pt-6", className)}
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
