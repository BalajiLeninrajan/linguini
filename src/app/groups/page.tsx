"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Header from "../_components/header";

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
        <div className="w-1/3 flex flex-col items-center">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-4xl">My Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 mb-6">
                {groups.map((group, idx) => (
                  <div key={group.name} className="flex items-center justify-between bg-white rounded-full px-4 py-3">
                    <span className="text-left w-1/2 text-xl text-gray-600">{group.name}</span>
                    <div className="flex gap-2">
                      {group.canEdit ? (
                        <Button variant="edit" className="h-10 px-6 rounded-full">Edit</Button>
                      ) : (
                        <Button variant="placeholder">Edit</Button>
                      )}
                      <Button variant="leaderboard" className="h-10 px-6 rounded-full">Leaderboard</Button>
                      <Button variant="danger" className="h-10 px-6 rounded-full">{group.canEdit ? "Delete" : "Leave"}</Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="default" className="w-full text-lg font-bold">Create Group</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
