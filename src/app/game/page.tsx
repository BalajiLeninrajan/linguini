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

  //TO CHANGE: for testing only
  const sampleUserId = 1;
  const gameId = 101;

  const { mutate: addPlay } = api.play.addPlay.useMutation({
    onSuccess: () => {
      console.log("Play created successfully");
      setGameStarted(true);
    },
    onError: (error) => {
      console.error("Failed to create play:", error);
    },
  });

  const { mutate: endPlay } = api.play.endPlay.useMutation({
    onSuccess: () => {
      console.log("Play ended successfully!");
      setGameEnded(true);
    },
    onError: (error) => {
      console.error("Failed to end play:", error);
    },
  });

  const playExists = api.play.playExists.useQuery({
    gameId: gameId,
    userId: sampleUserId,
  });

  useEffect(() => {
    if (playExists.data !== undefined) {
      if (playExists.data) {
        alert("You have already played this game!");
        setGameEnded(true); // Prevent playing
      }
    }
  }, [playExists.data]);

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
        gameId: gameId,
        userId: sampleUserId,
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
    sampleUserId,
  ]);

  useEffect(() => {
    if (playExists.data === false) {
      addPlay({
        gameId: gameId,
        userId: sampleUserId,
        startTime: new Date(),
      });
    }
  }, [playExists.data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (word.trim() && !gameEnded && characterCount < 100) {
      const newCharacterCount = Math.min(characterCount + word.length, 100);
      setCharacterCount(newCharacterCount);
      setCategoryCount((prev) => prev + 1);
      setWord("");
      console.log("Word submitted, character count:", newCharacterCount);
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
