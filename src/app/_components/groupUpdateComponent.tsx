"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import Header from "./header";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { type User } from "~/types";
import Link from "next/link";
import { toast } from "sonner"
import { type UserInvite } from "~/server/db";

export default function GroupUpdateComponent() {
  const [newGroupName, setNewGroupName] = useState("");
  const [currGroupName, setCurrGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState<User[]>([]);
  const [username, setuserName] = useState("");
  const [newMember, setNewMember] = useState("");
  const [sentInvitations, setSentInvitations] = useState<Pick<UserInvite, "recipient_id" | "username">[]>();
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");

  const currentUser = api.auth.currentUser.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const userId = currentUser.data?.id;

  const userInfo = api.users.getById.useQuery({ userId: userId ?? -1 });

  const groupInfo = api.groups.getGroupFromId.useQuery(
    { groupId: Number(groupId) ?? -1 },
    {
      enabled: !!groupId,
    },
  );

  const invites = api.invites.getOutboundInvites.useQuery();

  const { mutate } = api.groups.update.useMutation({
    onSuccess: async () => {
      await groupInfo.refetch();
    },
    onError: (error) => {
      console.log(error);
      toast("Something went wrong, please try again!")
    },
  });

  const { mutate: removeMemberHook } = api.groups.removeMember.useMutation({
    onSuccess: async () => {
      await groupInfo.refetch();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { mutate: inviteHook } = api.invites.send.useMutation({
    onSuccess: async() => {
      await invites.refetch();
      toast("You just invited someone to join your group !")
    },
    onError: (error) => {
      console.log(error)
      toast("Something went wrong, please try again!")
    }
  })

  const { mutate: withdrawHook } = api.invites.withdraw.useMutation({
    onSuccess: async() => {
      await invites.refetch();
      toast("You just withdrew someone from your your group !")
    },
    onError: (error) => {
      console.log(error);
      toast("Something went wrong, please try again!")
    }
  })


  useEffect(() => {
    if (userInfo.data) {
      setuserName(userInfo.data.username);
    }
  }, [userInfo.data]);

  useEffect(() => {
    if (groupInfo.data) {
      setCurrGroupName(groupInfo.data.name);
      //filter out the owner from the members array
      const updatedList = groupInfo.data.members.filter(
        (user) => user.id != userId,
      );
      setGroupMembers(updatedList);
    }
  }, [groupInfo.data]);

  useEffect(() => {
    if(invites.data){
      setSentInvitations(invites.data);
      console.log(invites.data);
    }
  }, [invites.data])

  const changeName = () => {
    try {
      if (newGroupName != currGroupName) {
        mutate({
          groupId: Number(groupId),
          name: newGroupName,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeMember = (memberId: number) => {
    try {
      removeMemberHook({
        groupId: Number(groupId),
        userId: memberId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const inviteMember = (username: string) => {
    //checking if the new member is not already a member of the group
    if (!groupMembers.some((user) => user.username == username)) {
      try{
        inviteHook({
          groupId: Number(groupId),
          identifier: newMember,
        })
      }catch(error){
        console.log(error);
        toast("Something went wrong, please try again!");
      }
    }
  };

  const withdrawInvite = (recipientId: number, recipientName: string) => {
    try{
      withdrawHook({
        groupId: Number(groupId),
        recipientId: recipientId,
      })
    }catch(error){
      console.log(error);
      toast("Something went wrong, please try again")
    }
  }

  return (
    <>
      <Header />
      <div className="flex min-h-screen items-center justify-center bg-[#FFF1D4] px-4">
        {username && currGroupName  ? (
          <div className="mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl">
            <Card
              variant="yellow"
              className="relative min-h-[200px] w-full p-2 sm:min-h-[300px] sm:p-4 md:min-h-[400px] md:p-8"
            >
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-bold text-amber-900 sm:text-2xl md:text-3xl">
                  {username}&apos;s Group: {currGroupName}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col space-y-4 pb-12 sm:space-y-6 sm:pb-16">
                <div className="flex justify-between space-y-2">
                  <Input
                    placeholder={currGroupName}
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="w-5/7"
                  />
                  <Button
                    variant="default"
                    className="w-1/4"
                    onClick={changeName}
                  >
                    Change
                  </Button>
                </div>
                <div className="space-y-2">
                  {(groupMembers || sentInvitations) && (
                    <h4 className="sm:text-md text-sm font-bold text-amber-900 md:text-lg">
                      Members:
                    </h4>
                  )}
                  {groupMembers && groupMembers.length > 0 && (
                    <>
                      <h4 className="sm:text-md text-sm font-bold text-amber-900 md:text-lg">
                        Members:
                      </h4>
                      {groupMembers.map((value, key) => (
                        <div
                          key={key}
                          className="flex w-1/2 justify-between rounded-full bg-white p-2 px-4"
                        >
                          <h4>{value.username}</h4>
                          <Button
                              variant="edit"
                              className="h-10 rounded-full px-6"
                            >
                              Accepted
                          </Button>
                          <h4
                            className="cursor-pointer"
                            onClick={() => removeMember(value.id)}
                          >
                            x
                          </h4>
                        </div>
                      ))}
                    </>
                  )}
                  {sentInvitations && sentInvitations.length > 0 && (
                    <>
                      {sentInvitations.map((value, key) => (
                        <div
                          key={key}
                          className="flex w-1/2 justify-between rounded-full bg-white p-2 px-4 items-center"
                        >
                          <h4>{value.username}</h4>
                          <Button
                              variant="danger"
                              className="h-10 rounded-full px-6"
                            >
                              Pending
                          </Button>
                          <h4
                            className="cursor-pointer"
                            onClick={() => withdrawInvite(value.recipient_id, value.username)}
                          >
                            x
                          </h4>
                        </div>
                      ))}
                    </>
                  )}
                </div>
                <div className="flex justify-between space-y-2">
                  <Input
                    placeholder={"New member username or email"}
                    value={newMember}
                    onChange={(e) => setNewMember(e.target.value)}
                    className="w-5/7"
                  />
                  <Button
                    variant="default"
                    className="w-1/4"
                    onClick={() => inviteMember(newMember)}
                  >
                    Invite
                  </Button>
                </div>
                <Link href="/groups">
                  <Button variant="default" className="w-full">
                    Update Group
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
}
