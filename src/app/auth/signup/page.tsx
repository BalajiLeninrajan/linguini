"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { api } from "~/trpc/react";
import { toast } from "sonner";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");

  const currentUser = api.auth.currentUser.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const register = api.auth.register.useMutation({
    onSuccess: async (data) => {
      localStorage.setItem("token", data.token);
      await currentUser.refetch();
    },
    onError: (error) => {
      setError(error.message);
      toast("An error has occured, please try again!");
    },
  });

  const createAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log(username, email, password, passwordConfirmation);
    e.preventDefault();

    if (passwordConfirmation != password) {
      toast("Your passwords do not match! Please try again.");
      setPassword("");
      setPasswordConfirmation("");
    } else {
      //call to the API to signup the user
      try {
        register.mutate({
          email: email,
          username: username,
          password: password,
        });
      } catch (e) {
        toast("An error has occured, please try again!");
        console.log(e);
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFF1D4]">
      <div className="w-1/4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Sign up</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createAccount}>
              <div className="flex flex-col gap-3">
                <div className="grid gap-1">
                  <Input
                    id="username"
                    type="text"
                    placeholder="Username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Input
                    id="passwordConfirmation"
                    type="password"
                    placeholder="Confirm Password"
                    required
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                  />
                </div>
                <Button variant="brownPrimary" type="submit" className="w-full">
                  Create Account
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-center text-yellow-600">
          <p className="text-2xl font-normal">
            Not a newbie around here?{" "}
            <span className="cursor-pointer font-bold">
              <Link href="login">Log in</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
