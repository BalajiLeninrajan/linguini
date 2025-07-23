"use client";
import { useState, useEffect } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Timer } from "~/components/ui/timer";
import { GameStats } from "~/components/ui/game-stats";
import { CategoryDisplay } from "~/components/ui/category-display";
import Header from "../_components/header";
import { api } from "~/trpc/react";

export default function GamePage() {
  const [word, setWord] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [currentCategory, setCurrentCategory] = useState("Actor");
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  const { data: gameId } = api.game.getTodaysGame.useQuery();

  const currentUser = api.auth.currentUser.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const userId = currentUser.data?.id;

  const utils = api.useUtils();

  const { mutate: addPlay } = api.play.addPlay.useMutation({
    onSuccess: () => {
      setGameStarted(true);
      void utils.play.playExists.invalidate();
    },
    onError: (error) => {
      console.error("Failed to create play:", error.message);
    },
  });

  const { mutate: endPlay } = api.play.endPlay.useMutation({
    onSuccess: () => {
      setGameEnded(true);
    },
    onError: (error) => {
      console.error("Failed to end play:", error);
    },
  });

  // Get today's date as YYYY-MM-DD string to avoid timezone issues
  const today = new Date().toISOString().split("T")[0]!;

  const playExists = api.play.playExists.useQuery(
    {
      gameId: gameId ?? 0,
      userId: userId ?? 0,
    },
    {
      enabled: userId !== undefined,
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    if (
      !playExists.isLoading &&
      playExists.data !== undefined &&
      !gameStarted
    ) {
      if (playExists.data) {
        alert("You have already played this game!");
        setGameEnded(true);
      }
    }
  }, [playExists.data, playExists.isLoading, gameStarted]);

  const handleWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWord(e.target.value);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameEnded && characterCount < 100) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameEnded, characterCount]);

  useEffect(() => {
    if (characterCount === 100 && gameStarted && !gameEnded) {
      endPlay({
        gameId: gameId ?? 0,
        userId: userId ?? 0,
        categoryCount: categoryCount,
        endTime: new Date(),
      });
    }
  }, [
    characterCount,
    gameStarted,
    gameEnded,
    addPlay,
    endPlay,
    gameId,
    userId,
    categoryCount,
  ]);

  useEffect(() => {
    if (
      !playExists.isLoading &&
      playExists.data === false &&
      gameId &&
      userId &&
      !gameStarted
    ) {
      addPlay({
        gameId: gameId,
        userId: userId,
        startTime: new Date(),
      });
    }
  }, [
    playExists.data,
    playExists.isLoading,
    gameId,
    userId,
    gameStarted,
    addPlay,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (word.trim() && !gameEnded && characterCount < 100) {
      const newCharacterCount = Math.min(characterCount + word.length, 100);
      setCharacterCount(newCharacterCount);
      setCategoryCount((prev) => prev + 1);
      setWord("");
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#FFF1D4]">
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-3 sm:px-4">
          <div className="w-full max-w-xs space-y-12 sm:max-w-sm sm:space-y-16 md:max-w-md">
            <div className="-mt-12 sm:-mt-20">
              <Timer seconds={seconds} />
            </div>

            <GameStats
              characterCount={characterCount}
              categoryCount={categoryCount}
            />

            <div className="space-y-3 sm:space-y-4">
              <CategoryDisplay category={currentCategory} />

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <Input
                  placeholder={
                    gameEnded || characterCount >= 100
                      ? "Game finished!"
                      : "Enter your word here..."
                  }
                  value={word}
                  onChange={handleWordChange}
                  className="w-full"
                  disabled={gameEnded || characterCount >= 100}
                />
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => console.log("skip category clicked")}
                  disabled={gameEnded || characterCount >= 100}
                >
                  Skip Category
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
