"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import Header from "../../_components/header";
import { api } from "~/trpc/react";
import { useRouter } from 'next/navigation';

export default function GroupCreationPage() {
  const [groupName, setGroupName] = useState("");
  const [username, setuserName] = useState("");
  const router = useRouter();

  const currentUser = api.auth.currentUser.useQuery(undefined, {
        refetchOnWindowFocus: false,
    })
  
  const userId = currentUser.data?.id;
  const userInfo = api.users.getById.useQuery(
    {userId: userId ?? -1}
  )

  const { mutate: createNewGroup } = api.groups.create.useMutation({
    onSuccess: () => {
      router.push("/groups");
    },
    onError: (error) => {
      console.log(error);
    }
  })

  useEffect(() => {
    if(userInfo.data){
      setuserName(userInfo.data.username);
    }
  }, [userInfo.data])

  const createGroup = () => {
    try{
      createNewGroup({
        name: groupName,
      })
    }catch(error){
      console.log(error);
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-[#FFF1D4] px-4">
        {username && (
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto">
            <Card variant="yellow" className="w-full p-2 sm:p-4 md:p-8 min-h-[200px] sm:min-h-[300px] md:min-h-[400px] relative">
              <CardHeader className="text-center">
                <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-900">
                  {username}&apos;s New Group
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 flex flex-col flex-1 pb-12 sm:pb-16">
                <div className="space-y-2">
                  <Input
                    placeholder="Group name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button variant="default" className="w-full" onClick={createGroup}>
                  Create Group
                </Button>
              </CardContent>
              <div className="absolute bottom-0 left-0 w-full text-center text-sm sm:text-base md:text-lg pb-4 sm:pb-6 text-amber-900">
                <span className="font-bold">Note:</span> All members must have Linguini accounts
              </div>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}
