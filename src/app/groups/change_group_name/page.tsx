"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import Header from "../../_components/header";
import { useSearchParams , useRouter } from 'next/navigation';
import { api } from "~/trpc/react";

export default function GroupNameUpdatePage() {
    const [newGroupName, setNewGroupName] = useState("");
    const searchParams = useSearchParams();
    const groupId = searchParams.get('groupId')
    const router = useRouter();
    const { mutate } = api.groups.update.useMutation();

    const changeName = () => {
        try{
            console.log(newGroupName)
            mutate({
                groupId: Number(groupId),
                name: newGroupName
            });
            router.push("/groups");
        }catch(error){
            console.log(error);
        }
    }


  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-[#FFF1D4] px-4">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto">
          <Card variant="yellow" className="w-full p-2 sm:p-4 md:p-8 min-h-[200px] sm:min-h-[300px] md:min-h-[400px] relative">
            <CardHeader className="text-center">
              <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-900">
                Patricks Group
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 flex flex-col flex-1 pb-12 sm:pb-16">
              <div className="space-y-2">
                <Input
                  placeholder="New group name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button variant="default" className="w-full" onClick={changeName}>
                Update Group Name
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
