"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Users, Home, BarChart3, Heart, LogOut } from "lucide-react";
import { api } from "~/trpc/react";

export default function Header() {
  const currentUser = api.auth.currentUser.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const handleLogout = async () => {
    localStorage.removeItem("token");
    await currentUser.refetch();
  };

  return (
    <div className="absolute z-5 flex w-full items-center justify-between bg-[#F6CF81] p-4">
      <div className="flex-1"></div>

      <div className="flex items-center">
        <Image src="/linguini.svg" alt="Linguini" width={250} height={250} />
        <Image
          src="/pasta.svg"
          alt="Linguini"
          width={250}
          height={200}
          className="absolute top-24 left-0 hidden sm:block"
        />
      </div>

      {currentUser.data ? (
        <div className="flex flex-1 justify-end gap-3">
          <Link href="/groups">
            <Button variant="nav" size="nav">
              <Users />
            </Button>
          </Link>
          <Link href="/game">
            <Button variant="nav" size="nav">
              <Home />
            </Button>
          </Link>
          <Link href="/leaderboard">
            <Button variant="nav" size="nav">
              <BarChart3 />
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="nav" size="nav">
              <Heart />
            </Button>
          </Link>
          <Button variant="nav" size="nav" onClick={handleLogout}>
            <LogOut />
          </Button>
        </div>
      ) : (
        <div className="flex flex-1 justify-end gap-3"></div> // css breaks without this
      )}
    </div>
  );
}
