"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import Header from "~/app/_components/header";

export default function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const currentUser = api.auth.currentUser.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (currentUser.data) {
      redirect("/game");
    }
  }, [currentUser.data]);

  const login = api.auth.login.useMutation({
    onSuccess: async (data) => {
      localStorage.setItem("token", data.token);
      await currentUser.refetch();
    },
    onError: (error) => {
      setError(error.message);
      toast("An error has occured, please try again!");
    },
  });

  const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
    //call to the API to login the user
    e.preventDefault();
    try {
      login.mutate({
        identifier: usernameOrEmail,
        password: password,
      });
    } catch (e) {
      toast("An error has occured, please try again!");
      console.log(e);
    }
  };

  return (
    <>
      <Header />
      <div className="flex min-h-screen items-center justify-center bg-[#FFF1D4]">
        <div className="w-1/4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Welcome Back</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={loginUser}>
                <div className="flex flex-col gap-3">
                  <div className="grid gap-1">
                    <Input
                      id="usernameEmail"
                      type="text"
                      placeholder="Username or Email"
                      required
                      value={usernameOrEmail}
                      onChange={(e) => setUsernameOrEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <Button variant="default" type="submit" className="w-full">
                    Log in
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-6 flex justify-center text-yellow-600">
            <p className="text-2xl font-normal">
              New around here?{" "}
              <span className="cursor-pointer font-bold">
                <Link href="/auth/signup">Sign up</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
