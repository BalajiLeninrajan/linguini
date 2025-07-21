import * as React from "react";
import { cn } from "~/lib/utils";

interface GameStatsProps {
  characterCount: number;
  categoryCount: number;
  className?: string;
}

export function GameStats({
  characterCount,
  categoryCount,
  className,
}: GameStatsProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 sm:justify-between sm:gap-0",
        className,
      )}
    >
      <div className="text-center">
        <div className="text-2xl font-bold text-amber-900 sm:text-3xl md:text-4xl lg:text-5xl">
          {characterCount}/100
        </div>
        <div className="text-xs text-gray-600 sm:text-sm">character count</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-amber-900 sm:text-3xl md:text-4xl lg:text-5xl">
          {categoryCount}
        </div>
        <div className="text-xs text-gray-600 sm:text-sm">category count</div>
      </div>
    </div>
  );
}
