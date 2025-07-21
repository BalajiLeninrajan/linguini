import * as React from "react";

interface GroupNameProps {
  name: string;
}

export function GroupName({ name }: GroupNameProps) {
  return (
    <span className="flex-grow pr-2 text-left text-base text-gray-600 sm:text-lg md:truncate md:overflow-hidden md:text-xl">
      {name}
    </span>
  );
}
