"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter,
  CardContent,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import SignupPage from "../signup/page";
import Link from "next/link";
import Header from "../_components/header";

export default function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = () => {
    //call to the API to login the user
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
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  loginUser();
                }}
              >
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
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button variant="default" type="submit" className="w-full">
                Log in
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-6 flex justify-center text-yellow-600">
            <p className="text-2xl font-normal">
              New around here?{" "}
              <span className="cursor-pointer font-bold">
                <Link href="/signup">Sign up</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
