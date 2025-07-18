"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import Header from "../../_components/header";

export default function AddGroupMemberPage() {
  const [email, setEmail] = useState("");

  return (
    <>
      <Header />
<<<<<<< HEAD
      <div className="min-h-screen flex items-center justify-center bg-[#FFF1D4] relative px-4">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto">
          <Card variant="yellow" className="w-full p-2 sm:p-4 md:p-8 min-h-[200px] sm:min-h-[300px] md:min-h-[400px] relative">
            <CardHeader className="text-center">
              <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-900">
                Patricks Group: <span className="font-extrabold">SE2028</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 flex flex-col flex-1 pb-12 sm:pb-16">
              <form onSubmit={(e) => {
                e.preventDefault();
              }} className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <Input
                    placeholder="New member email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button variant="default" className="w-full" type="submit">
                  Add Member
                </Button>
              </form>
            </CardContent>
            <div className="absolute bottom-0 left-0 w-full text-center text-sm sm:text-base md:text-lg pb-4 sm:pb-6 text-amber-900">
=======
      <div className="min-h-screen flex items-center justify-center bg-[#FFF1D4] relative">
        <div className="w-full max-w-2xl mx-auto">
          <Card variant="yellow" className="w-full p-12 min-h-[500px] relative">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold" style={{ color: '#7C4A12' }}>
                Patrick’s Group: <span className="font-extrabold">SE2028</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 flex flex-col flex-1 pb-16">
              <div className="space-y-2">
                <Input
                  placeholder="New member email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button variant="default" className="w-full">
                Add Member
              </Button>
            </CardContent>
            <div className="absolute bottom-0 left-0 w-full text-center text-lg pb-6" style={{ color: '#7C4A12' }}>
>>>>>>> eef84aeb3b3bc6f365b60fbf53e33d847ecd30be
              <span className="font-bold">Note:</span> All members must have Linguini accounts
            </div>
          </Card>
        </div>
      </div>
    </>
  );
} 