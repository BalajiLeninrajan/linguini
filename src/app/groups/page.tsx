"use client";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Header from "../_components/header";
import { GroupName } from "~/components/ui/group-name";
import { api } from "~/trpc/react";
import Link from "next/link";

export default function GroupsPage() {
  const currentUser = api.auth.currentUser.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const userId = currentUser.data?.id;

  const groupMemberships = api.users.getGroupMembershipsById.useQuery(
    { userId: userId ?? -1 },
    { enabled: !!userId },
  );

  const groupIds =
    groupMemberships.data?.map((membership) => membership.group_id) ?? [];

  const groupQueries = api.useQueries((t) =>
    groupIds.map((groupId) =>
      t.groups.getGroupFromId({ groupId }, { enabled: groupIds.length > 0 }),
    ),
  );

  const { mutate: deleteGroupHook } = api.groups.delete.useMutation({
    onSuccess: () => {
      void groupMemberships.refetch();
    },
  });

  const { mutate: leaveGroupHook } = api.groups.leaveGroup.useMutation({
    onSuccess: () => {
      void groupMemberships.refetch();
    },
  });

  const deleteGroup = (groupId: number) => {
    deleteGroupHook({ groupId });
  };

  const leaveGroup = (groupId: number) => {
    leaveGroupHook({ groupId });
  };

  const isLoading =
    currentUser.isLoading ||
    groupMemberships.isLoading ||
    groupQueries.some((q) => q.isLoading);
  const hasError =
    currentUser.error ??
    groupMemberships.error ??
    groupQueries.some((q) => q.error);

  const groups = groupQueries
    .filter((query) => query.data)
    .map((query) => ({
      id: query.data!.id,
      name: query.data!.name,
      canEdit: query.data!.owner.id === userId,
    }));

  if (hasError) {
    return (
      <>
        <Header />
        <div className="flex min-h-screen items-center justify-center bg-[#FFF1D4]">
          <div className="flex w-full max-w-3xl flex-col items-center">
            <Card className="w-full">
              <CardContent>
                <p className="text-red-600">
                  Error loading groups. Please try again.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="flex min-h-screen items-center justify-center bg-[#FFF1D4]">
        <div className="flex w-full max-w-3xl flex-col items-center">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-5xl text-yellow-600">
                My Groups
              </CardTitle>
            </CardHeader>

            {isLoading ? (
              <CardContent>
                <p>Loading...</p>
              </CardContent>
            ) : groups.length > 0 ? (
              <CardContent>
                <div className="mb-6 flex flex-col gap-2">
                  {groups.map((group) => (
                    <div
                      key={group.id}
                      className="flex min-h-14 w-full items-center justify-between rounded-full bg-white px-4 py-3"
                    >
                      <GroupName name={group.name} />
                      <div className="flex w-auto flex-shrink-0 flex-wrap justify-end space-x-1 md:w-96 md:space-x-2">
                        {group.canEdit && (
                          <Link
                            href={`/groups/change_group_name?groupId=${group.id}`}
                          >
                            <Button
                              variant="edit"
                              className="h-10 rounded-full px-6"
                            >
                              Edit
                            </Button>
                          </Link>
                        )}
                        <Link
                          href={`/leaderboard/group?groupId=${group.id}&groupName=${group.name}`}
                        >
                          <Button
                            variant="leaderboard"
                            className="h-10 rounded-full px-6"
                          >
                            Leaderboard
                          </Button>
                        </Link>
                        <Button
                          variant="danger"
                          className="h-10 rounded-full px-6"
                          onClick={() =>
                            group.canEdit
                              ? deleteGroup(group.id)
                              : leaveGroup(group.id)
                          }
                        >
                          {group.canEdit ? "Delete" : "Leave"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="default"
                  className="h-16 w-full text-base font-bold sm:text-lg"
                >
                  Create Group
                </Button>
              </CardContent>
            ) : (
              <CardContent>
                <p>No groups found.</p>
                <Button
                  variant="default"
                  className="mt-4 h-16 w-full text-base font-bold sm:text-lg"
                >
                  Create Group
                </Button>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
