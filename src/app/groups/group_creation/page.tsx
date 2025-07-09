"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import Header from "../../_components/header";

export default function GroupCreationPage() {
  const [groupName, setGroupName] = useState("");

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-[#FFF1D4]">
        <div className="w-full max-w-2xl mx-auto">
          <Card variant="yellow" className="w-full p-12 min-h-[500px] relative">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold" style={{ color: '#7C4A12' }}>
                Patrick's New Group
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 flex flex-col flex-1 pb-16">
              <div className="space-y-2">
                <Input
                  placeholder="Group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button variant="default" className="w-full">
                Create Group
              </Button>
            </CardContent>
            <div className="absolute bottom-0 left-0 w-full text-center text-lg pb-6" style={{ color: '#7C4A12' }}>
              <span className="font-bold">Note:</span> All members must have Linguini accounts
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
