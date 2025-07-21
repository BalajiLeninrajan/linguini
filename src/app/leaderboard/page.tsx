"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import Link from "next/link";
import Header from "../_components/header";
import LeaderboardContainer from "../_components/leaderboardContainer";
import { api } from "~/trpc/react";
import type { LeaderboardUser } from "~/server/db";

export default function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [error, setError] = useState("");

  const { data: recentGame } = api.leaderboard.getMostRecentGame.useQuery();
  const gameId = recentGame?.id?.toString() ?? "";

  const {
    data,
    isLoading,
    error: queryError,
  } = api.leaderboard.getGlobalLeaderboard.useQuery({
    gameId: gameId,
  });

  useEffect(() => {
    if (data) {
      setUsers(data as LeaderboardUser[]);
    }
    if (queryError) {
      setError(queryError.message);
    }
  }, [data, queryError]);

  return (
    <>
      <Header />
      <div className="flex min-h-screen items-center justify-center bg-[#FFF1D4] py-28">
        <div className="w-1/3">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-5xl text-yellow-600">
                Global Leaderboard
              </CardTitle>
            </CardHeader>

            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <LeaderboardContainer users={users} />
            )}
          </Card>

          <div className="mt-6 flex justify-center text-yellow-600">
            <p className="text-3xl font-light">
              Checkout out{" "}
              <span className="cursor-pointer font-bold">
                <Link href="leaderboard/group">Friend Leaderboard</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
