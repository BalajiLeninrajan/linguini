"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import Link from "next/link";
import Header from "../_components/header";
import { api } from "~/trpc/react";
import type { UserInvite } from "~/server/db";
import { Button } from "~/components/ui/button";
import { toast } from "sonner"

export default function Invitations() {
  const [myInvites, setMyInvites] = useState<UserInvite[]>()

  const currentUser = api.auth.currentUser.useQuery(undefined, {
      refetchOnWindowFocus: false,
    });
  
  const userId = currentUser.data?.id;

  const invites = api.invites.getInboundInvites.useQuery();

  const { mutate: acceptInviteHook } = api.invites.accept.useMutation({
    onSuccess: async() => {
      await invites.refetch();
    },
    onError: (error) => {
      console.log(error);
      toast("Something went wrong, please try again!")
    }
  })

  const { mutate: declineInviteHook } = api.invites.decline.useMutation({
    onSuccess: async() => {
      await invites.refetch();
    },
    onError: (error) => {
      console.log(error);
      toast("Something went wrong, please try again!")
    }
  })

  useEffect(() => {
    if(invites.data){
      setMyInvites(invites.data);
      console.log(invites.data)
    }
  }, [invites.data])

  const acceptInvite = (groupId:number, senderId: number) => {
    try{
      acceptInviteHook({
        groupId: groupId,
        senderId: senderId,
      })
    }catch(error){
      console.log(error);
      toast("Something went wrong, please try again!")
    }
  }

  const declineInvite = (groupId: number, senderId: number) => {
    try{
      declineInviteHook({
        groupId: groupId,
        senderId: senderId
      })
    }catch(error){
      console.log(error);
      toast("Something went wrong, please try again!")
    }
  }

  return (
    <>
      <Header />
      <div className="flex min-h-screen items-center justify-center bg-[#FFF1D4] py-18">
        <div className="w-1/2">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-5xl text-yellow-600">
                My Invitations
              </CardTitle>
            </CardHeader>

            {myInvites && myInvites.length > 0 ? (
              <CardContent className="flex flex-1 flex-col space-y-4 pb-12 sm:space-y-6 sm:pb-16">
                {myInvites.map((value, key) => (
                  <div key={key} className="bg-white w-full rounded-full flex justify-between p-4">
                    <p className="w-1/3 flex justify-start items-center">Group: <span className="text-yellow-600 font-bold">{value.name}</span></p>
                    <p className="w-1/3 flex justify-start items-center">Sender: <span className="text-yellow-600 font-bold">{value.username}</span></p>
                      <Button
                        variant="edit"
                        className="h-10 rounded-full px-6"
                        onClick={() => acceptInvite(value.group_id, value.sender_id)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="danger"
                        className="h-10 rounded-full px-6 ml-2"
                        onClick={() => declineInvite(value.group_id, value.sender_id)}
                      >
                        Decline
                      </Button>
                  </div>
                ))}
              </CardContent>
            ): myInvites && myInvites.length == 0 ? (
              <CardContent className="flex flex-1 flex-col space-y-4 pb-12 sm:space-y-6 sm:pb-16">
                  Sorry, you have no invites yet :(
              </CardContent>
            ) : (
              <h4>Loading...</h4>
            )}
   
          </Card>

        </div>
      </div>
    </>
  );
}
