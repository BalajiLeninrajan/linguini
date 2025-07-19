import * as React from "react";
import { cn } from "~/lib/utils";

interface GameStatsProps {
  characterCount: number;
  categoryCount: number;
  className?: string;
}

export function GameStats({ characterCount, categoryCount, className }: GameStatsProps) {
  return (
    <div className={cn("flex justify-center items-center gap-2 sm:justify-between sm:gap-0", className)}>
      <div className="text-center">
        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-amber-900">
          {characterCount}/100
        </div>
        <div className="text-xs sm:text-sm text-gray-600">character count</div>
      </div>
      <div className="text-center">
        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-amber-900">
          {categoryCount}
        </div>
        <div className="text-xs sm:text-sm text-gray-600">category count</div>
      </div>
    </div>
  );
} 