import * as React from "react";
import { cn } from "~/lib/utils";

interface TimerProps {
  seconds: number;
  className?: string;
}

// Helper function to format timer display
const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export function Timer({ seconds, className }: TimerProps) {
  return (
    <div className={cn("text-center", className)}>
      <div
        className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl"
        style={{ color: "#CD853F" }}
      >
        {formatTime(seconds)}
      </div>
    </div>
  );
}
