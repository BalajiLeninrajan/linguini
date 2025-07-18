"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Header from "../_components/header";
import { GroupName } from "~/components/ui/group-name";

export default function GroupsPage() {
  const [groups, setGroups] = useState([
    { name: "Balajists", canEdit: true },
    { name: "Mariyas Group", canEdit: false },
    { name: "Janezeng4ever", canEdit: false },
  ]);

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-[#FFF1D4]">
        <div className="w-full max-w-3xl flex flex-col items-center">
          <Card className="w-full">
            <CardHeader>
                        <CardTitle className='text-yellow-600 text-5xl'>My Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 mb-6">
                {groups.map((group, idx) => (
                  <div key={group.name} className="flex items-center justify-between bg-white rounded-full px-4 py-3 min-h-14 w-full">
                    <GroupName name={group.name} />
                    <div className="flex flex-shrink-0 justify-end space-x-1 md:space-x-2 w-auto md:w-96 flex-wrap">
                      {group.canEdit && (
                        <Button variant="edit" className="h-10 px-6 rounded-full">Edit</Button>
                      )}
                      <Button variant="leaderboard" className="h-10 px-6 rounded-full">Leaderboard</Button>
                      <Button variant="danger" className="h-10 px-6 rounded-full">{group.canEdit ? "Delete" : "Leave"}</Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="default" className="w-full text-base sm:text-lg font-bold h-16">Create Group</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
