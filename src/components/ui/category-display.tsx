import * as React from "react";
import { cn } from "~/lib/utils";

interface CategoryDisplayProps {
  category: string;
  className?: string;
}

export function CategoryDisplay({ category, className }: CategoryDisplayProps) {
  return (
    <div className={cn("text-center", className)}>
      <span
        className="text-xl sm:text-2xl md:text-3xl"
        style={{ color: "#CD853F" }}
      >
        Category:{" "}
      </span>
      <span
        className="text-xl font-bold sm:text-2xl md:text-3xl"
        style={{ color: "#CD853F" }}
      >
        {category}
      </span>
    </div>
  );
}
