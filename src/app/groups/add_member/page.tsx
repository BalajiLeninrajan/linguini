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
      <div className="relative flex min-h-screen items-center justify-center bg-[#FFF1D4] px-4">
        <div className="mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl">
          <Card
            variant="yellow"
            className="relative min-h-[200px] w-full p-2 sm:min-h-[300px] sm:p-4 md:min-h-[400px] md:p-8"
          >
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-bold text-amber-900 sm:text-2xl md:text-3xl">
                Patricks Group: <span className="font-extrabold">SE2028</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col space-y-4 pb-12 sm:space-y-6 sm:pb-16">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                className="space-y-4 sm:space-y-6"
              >
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
            <div className="absolute bottom-0 left-0 w-full pb-4 text-center text-sm text-amber-900 sm:pb-6 sm:text-base md:text-lg">
              <span className="font-bold">Note:</span> All members must have
              Linguini accounts
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
