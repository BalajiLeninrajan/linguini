"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import Link from "next/link";
import Header from "./header";
import LeaderboardContainer from "~/app/_components/leaderboardContainer";
import { api } from "~/trpc/react";
import type { userGroup } from "~/server/db";
import type { LeaderboardUser } from "~/types";
import { useSearchParams } from "next/navigation";

export default function GroupLeaderboardComponent() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [usergroups, setUserGroups] = useState<userGroup[]>([]);
  const [error, setError] = useState("");
  const [current, setCurrent] = useState("");
  const { data: recentGame } = api.leaderboard.getMostRecentGame.useQuery();
  const gameId = recentGame?.id?.toString() ?? "";
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");
  const groupName = searchParams.get("groupName");

  const currentUser = api.auth.currentUser.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const currUserId = currentUser.data?.id;

  const {
    data: userGroups,
    isLoading: groupsLoading,
    error: queryError,
  } = api.leaderboard.getUserGroups.useQuery(
    { userId: currUserId ?? -1 },
    {
      enabled: !!currUserId,
    },
  );

  const currentGroup =
    groupId && groupName
      ? { id: groupId, name: groupName }
      : userGroups && userGroups.length > 0
        ? (userGroups as userGroup[])?.[0]
        : null;

  const {
    data: localLeaderboard,
    isLoading: isLoadingLeaderboard,
    error: leaderboardError,
  } = api.leaderboard.getLocalLeaderboard.useQuery(
    {
      groupId: currentGroup?.id?.toString() ?? "",
      gameId: gameId,
    },
    {
      enabled: !!currentGroup && !!gameId,
    },
  );

  useEffect(() => {
    if (userGroups && currentGroup) {
      setUserGroups(userGroups);
      setCurrent(currentGroup?.name?.toString() ?? "");
    }
    if (queryError) {
      setError(queryError.message);
    }
  }, [userGroups, queryError, currentGroup]);

  useEffect(() => {
    if (localLeaderboard) {
      setUsers(localLeaderboard);
    }
    if (leaderboardError) {
      setError(leaderboardError.message);
    }
  }, [localLeaderboard, leaderboardError]);

  return (
    <>
      <Header />
      <div className="flex min-h-screen items-center justify-center bg-[#FFF1D4] py-28">
        <div className="w-1/3">
          {userGroups && userGroups.length == 0 ? (
            <p>You are not a part of any groups yet :(</p>
          ) : (
            <>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-5xl text-yellow-600">
                    {current}
                  </CardTitle>
                  <CardTitle className="text-3xl font-light text-yellow-600">
                    Leaderboard
                  </CardTitle>
                </CardHeader>

                {isLoadingLeaderboard ? (
                  <p>Loading...</p>
                ) : users ? (
                  <LeaderboardContainer users={users} />
                ) : null}
              </Card>

              <div className="absolute top-1/2 left-1/20 w-1/5 rounded-3xl bg-[#F6CF81] p-6">
                <p className="mb-4 text-center text-2xl font-bold text-amber-900">
                  Checkout Your <br></br> Other Groups
                </p>

                {groupsLoading ? (
                  <p>Loading...</p>
                ) : (
                  usergroups.map((value, key) => (
                    <Link
                      href={`/leaderboard/group?groupId=${value.id}&groupName=${value.name}`}
                      key={key}
                    >
                      <div className="mb-2 flex w-full flex-row justify-between rounded-full bg-white p-3 px-6">
                        <span className="text-xl font-bold text-yellow-600">
                          {key + 1}
                        </span>
                        <span className="text-xl text-gray-600">
                          {value.name}
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </>
          )}

          <div className="mt-6 flex justify-center text-yellow-600">
            <p className="text-3xl font-light">
              Checkout out{" "}
              <span className="cursor-pointer font-bold">
                <Link href="/leaderboard">Global Leaderboard</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
