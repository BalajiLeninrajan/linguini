"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Header from "../_components/header";
import { GroupName } from "~/components/ui/group-name";
import { api } from "~/trpc/react";
import Link from "next/link";
import Alert from "../_components/alertComponent";
import { toast } from "sonner"

export default function GroupsPage() {
  const [groups, setGroups] = useState<
    { id: number; name: string; canEdit: boolean }[]
  >();
  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  const [pendingAction, setPendingAction] = useState<null | {
    type: 'delete' | 'leave',
    groupId: number,
    groupName: string
  }>(null);

  const currentUser = api.auth.currentUser.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const userId = currentUser.data?.id;

  const groupIDs = api.users.getGroupMembershipsById.useQuery({
    userId: userId ?? -1,
  });

  const trpcContext = api.useUtils();

  const { mutate: deleteGroupHook } = api.groups.delete.useMutation({
    onSuccess: async () => {
      await groupIDs.refetch();
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const { mutate: leaveGroupHook } = api.groups.leaveGroup.useMutation({
    onSuccess: async () => {
      await groupIDs.refetch();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    const fetchGroupInfo = async () => {
      if (!groupIDs.data) return;

      const results = await Promise.all(
        groupIDs.data.map((group) =>
          trpcContext.groups.getGroupFromId.fetch({ groupId: group.group_id }),
        ),
      );

      console.log(results);

      const trimmedResults = results.map((group) => ({
        id: group.id,
        name: group.name,
        canEdit: group.owner.id == userId,
      }));

      setGroups(trimmedResults);

      console.log(trimmedResults);
    };

    void fetchGroupInfo();
  }, [groupIDs.data, userId]);

  const deleteGroup = (groupId: number, groupName: string) => {
      setAlertContent(`You are about to delete your group ${groupName}`);
      setPendingAction({type: 'delete', groupId, groupName});
      setShowAlert(true);
  }

  const leaveGroup = (groupId: number, groupName: string) => {
    setAlertContent(`You are about to leave a group ${groupName}`);
    setPendingAction({type: 'leave', groupId, groupName});
    setShowAlert(true);
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

            {groupIDs.isLoading ? (
              <CardContent>
                <p>Loading...</p>
              </CardContent>
            ) : groups && groups.length > 0 ? (
              <CardContent>
                <div className="mb-6 flex flex-col gap-2">
                  {groups.map((group, idx) => (
                    <div
                      key={group.name}
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
                          onClick={
                            group.canEdit
                              ? () => {
                                  deleteGroup(group.id, group.name);
                                }
                              : () => {
                                  leaveGroup(group.id, group.name);
                                }
                          }
                        >
                          {group.canEdit ? "Delete" : "Leave"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/groups/group_creation">
                  <Button
                    variant="default"
                    className="h-16 w-full text-base font-bold sm:text-lg"
                  >
                    Create Group
                  </Button>
                </Link>
              </CardContent>
            ) : groupIDs.data && groupIDs.data.length == 0 ? (
              <CardContent>
                <p>You are not a part of any groups :(</p>
                <Link href="/groups/group_creation">
                  <Button
                    variant="default"
                    className="h-16 w-full text-base font-bold sm:text-lg"
                  >
                    Create Group
                  </Button>
                </Link>
              </CardContent>
            ) : (
              <></>
            )}
          </Card>
        </div>
      </div>

      <Alert
        open={showAlert}
        onOpenChange={setShowAlert}
        body={alertContent}
        onConfirm={() => {
          if(!pendingAction){
            return;
          }

          if(pendingAction.type == 'delete'){
            try{
                deleteGroupHook({
                  groupId: pendingAction.groupId,
                })

            }catch(error){
              console.log(error);
              toast("Something went wrong, please try again.")
            }
          }

          if(pendingAction.type == 'leave'){
            try{
              leaveGroupHook({
                groupId: pendingAction.groupId,
              })

            }catch(error){
              console.log(error);
              toast("Something went wrong, please try again.")
            }
          }
          
          setShowAlert(false);
        }}
      />
    </>
  );
}


