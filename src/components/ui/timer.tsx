import * as React from "react";
import { cn } from "~/lib/utils";

interface TimerProps {
  time: string;
  className?: string;
}

export function Timer({ time, className }: TimerProps) {
  return (
    <div className={cn("text-center", className)}>
      <div 
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold"
        style={{ color: '#CD853F' }}
      >
        {time}
      </div>
    </div>
  );
} 