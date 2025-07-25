import * as React from "react";
import { cn } from "~/lib/utils";

interface CategoryDisplayProps {
  category: string;
  className?: string;
}

export function CategoryDisplay({ category, className }: CategoryDisplayProps) {
  return (
    <div className={cn("text-center", className)}>
      <span className="text-xl text-red-300 sm:text-2xl md:text-3xl">
        Category:{" "}
      </span>
      <span className="text-xl font-bold text-red-500 sm:text-2xl md:text-3xl">
        {category}
      </span>
    </div>
  );
}
