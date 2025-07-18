"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Header from "../_components/header";
import { GroupName } from "~/components/ui/group-name";
import { api } from "~/trpc/react";
import Link from 'next/link';

export default function GroupsPage() {

  const [groups, setGroups] = useState<{ id: number, name: string; canEdit: boolean }[]>([]);

  const currentUser = api.auth.currentUser.useQuery(undefined, {
      refetchOnWindowFocus: false,
  })

  const userId = currentUser.data?.id;

  const groupIDs = api.users.getGroupMembershipsById.useQuery(
    {userId: userId || -1}
  )

  const trpcContext = api.useUtils();

  const { mutate: deleteGroupHook } = api.groups.delete.useMutation();
  const { mutate: leaveGroupHook} = api.groups.leaveGroup.useMutation();

   useEffect(() => {
    const fetchGroupInfo = async () => {
      if (!groupIDs.data) return;

      const results = await Promise.all(
        groupIDs.data.map((group) =>
          trpcContext.groups.getGroupFromId.fetch({ groupId: group.group_id })
        )
      );

      const trimmedResults = results.map(group => ({
        id: group.id,
        name: group.name,
        canEdit: group.owner.id == userId
      }))

      setGroups(trimmedResults);

      console.log(trimmedResults);
    };

    fetchGroupInfo();
  }, [groupIDs]);

  const deleteGroup = async (groupId: number) => {
    try{
      deleteGroupHook({
        groupId: groupId,
      })
      await groupIDs.refetch();

    }catch(error){
      console.log(error);
    }
  }

  const leaveGroup = async (groupId: number) => {
    try{
      leaveGroupHook({
        groupId: groupId,
      })
      await groupIDs.refetch();

    }catch(error){
      console.log(error);
    }
  }


  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-[#FFF1D4]">
        <div className="w-full max-w-3xl flex flex-col items-center">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className='text-yellow-600 text-5xl'>My Groups</CardTitle>
            </CardHeader>

            {groups && groups.length > 0 ? (
              <CardContent>
                <div className="flex flex-col gap-2 mb-6">
                  {groups.map((group, idx) => (
                    <div key={group.name} className="flex items-center justify-between bg-white rounded-full px-4 py-3 min-h-14 w-full">
                      <GroupName name={group.name} />
                      <div className="flex flex-shrink-0 justify-end space-x-1 md:space-x-2 w-auto md:w-96 flex-wrap">
                        {group.canEdit && (
                          <Link href={`/groups/change_group_name?groupId=${group.id}`}>
                              <Button variant="edit" className="h-10 px-6 rounded-full">Edit</Button>
                          </Link>
                        )}
                        <Link href={`/leaderboard/group?groupId=${group.id}&groupName=${group.name}`} >
                          <Button variant="leaderboard" className="h-10 px-6 rounded-full">Leaderboard</Button>
                        </Link>
                        <Button variant="danger" className="h-10 px-6 rounded-full" onClick={group.canEdit ? () => {deleteGroup(group.id)} : () => {leaveGroup(group.id)}}>
                          {group.canEdit ? "Delete" : "Leave"}</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="default" className="w-full text-base sm:text-lg font-bold h-16">Create Group</Button>
            </CardContent>
            ) : (
              <p>Loading...</p>
            )}

          </Card>
        </div>
      </div>
    </>
  );
}


