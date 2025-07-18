import * as React from "react";

interface GroupNameProps {
  name: string;
}

export function GroupName({ name }: GroupNameProps) {
  return (
    <span className="text-left text-base sm:text-lg md:text-xl text-gray-600 flex-grow pr-2 md:truncate md:overflow-hidden">{name}</span>
  );
} 