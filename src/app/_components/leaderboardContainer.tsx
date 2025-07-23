"use client";
import type { LeaderboardUser } from "~/server/db";
import type { TimeValue } from "~/types";

interface UserProps {
  users: LeaderboardUser[];
}

export default function LeaderboardContainer({ users }: UserProps) {
  const formatTime = (time: TimeValue) => {
    if (typeof time === "number") {
      return time;
    }
    if (typeof time === "object" && time !== null) {
      console.log(time);
      if (!time.seconds) return "0:00";
      if (!time.minutes) return `0:${time.seconds.toString().padStart(2, "0")}`;
      return `${time.minutes}:${time.seconds.toString().padStart(2, "0")}`;
    }
    return time;
  };

  return (
    <>
      {users.map((value: LeaderboardUser, key: number) => (
        <div
          key={key}
          className="-mb-2 flex w-full flex-row justify-between rounded-full bg-white px-4 py-4"
        >
          <div className="flex w-1/4 flex-row justify-between">
            <p className="text-xl font-bold text-yellow-600">{key + 1}</p>
            <p className="ml-auto w-1/2 text-left text-xl text-gray-600">
              {value.username}
            </p>
          </div>
          <div className="flex flex-row justify-between pr-4">
            <p className="text-xl font-bold text-amber-700">
              {value.category_count} ct.
            </p>
            <p className="mr-4 ml-8 w-5 text-xl font-bold text-amber-700">
              {formatTime(value.time)}
            </p>
          </div>
        </div>
      ))}
    </>
  );
}
