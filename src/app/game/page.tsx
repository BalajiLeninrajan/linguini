"use client";
import { useState, useEffect } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Timer } from "~/components/ui/timer";
import { GameStats } from "~/components/ui/game-stats";
import { CategoryDisplay } from "~/components/ui/category-display";
import Header from "../_components/header";
import { api } from "~/trpc/react";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default function GamePage() {
  const [gameState, setGameState] = useState({
    word: "",
    seconds: 0,
    characterCount: 0,
    categoryCount: 0,
    currentCategory: "world",
    gameStarted: false,
    gameEnded: false,
  });

  const { data: currentUser, isLoading: isLoadingUser } =
    api.auth.currentUser.useQuery(undefined, {
      refetchOnWindowFocus: false,
    });

  const { data: gameId } = api.game.getTodaysGame.useQuery();

  const {
    data: playData,
    isLoading: isCheckingPlay,
    refetch: refetchPlay,
  } = api.play.playExists.useQuery(
    {
      gameId: gameId ?? -1,
      userId: currentUser?.id ?? -1,
    },
    {
      enabled: !!currentUser,
    },
  );

  const { data: categories } =
    api.wordCategories.generateCategoriesList.useQuery();

  useEffect(() => {
    if (playData) {
      setGameState((prev) => ({
        ...prev,
        gameStarted: true,
      }));

      if (playData.end_time) {
        setGameState((prev) => ({
          ...prev,
          gameEnded: true,
          categoryCount: playData.category_count,
          characterCount: 100,
          seconds: Math.floor(
            ((playData.end_time?.getTime() ?? 0) -
              playData.start_time.getTime()) /
              1000,
          ),
        }));
      }
    }
  }, [playData]);

  const { mutate: addPlay } = api.play.addPlay.useMutation({
    onSuccess: () => {
      setGameState((prev) => ({ ...prev, gameStarted: true }));
    },
  });

  const { mutate: endPlay } = api.play.endPlay.useMutation({
    onSuccess: () => {
      setGameState((prev) => ({ ...prev, gameEnded: true }));
    },
  });

  const { mutate: requestWordHook } = api.wordRequests.create.useMutation({
    onSuccess: () => {
      toast("You have requested to add a new word to the game!");
    },
    onError: (error) => {
      console.error(error);
      toast("Something went wrong, please try again!");
    },
  });

  const { mutate: verifyWord } = api.wordCategories.verify.useMutation({
    onSuccess: (result) => {
      if (result) {
        const newCharacterCount = Math.min(
          gameState.characterCount + gameState.word.length,
          100,
        );
        setGameState((prev) => ({
          ...prev,
          characterCount: newCharacterCount,
          categoryCount: prev.categoryCount + 1,
        }));
      } else {
        toast("Invalid word", {
          action: {
            label: "Request Word",
            onClick: () => {
              try {
                if (!categories) {
                  throw new Error();
                }
                requestWordHook({
                  word: gameState.word,
                  category:
                    categories[gameState.categoryCount % categories?.length]
                      ?.category ?? "",
                });
              } catch {
                toast("Error adding word, please try again");
              }
            },
          },
        });
      }
      setGameState((prev) => ({
        ...prev,
        word: "",
      }));
    },
  });

  useEffect(() => {
    if (!isLoadingUser && !currentUser) {
      redirect("/auth/login");
    }
  }, [currentUser, isLoadingUser]);

  // Handle timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (
      gameState.gameStarted &&
      !gameState.gameEnded &&
      gameState.characterCount < 100
    ) {
      interval = setInterval(() => {
        setGameState((prev) => ({ ...prev, seconds: prev.seconds + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState.gameStarted, gameState.gameEnded, gameState.characterCount]);

  // Handle game completion
  useEffect(() => {
    const handleEndGame = async () => {
      if (
        gameState.characterCount === 100 &&
        gameState.gameStarted &&
        !gameState.gameEnded &&
        currentUser
      ) {
        await refetchPlay();
        endPlay({
          gameId: gameId ?? -1,
          userId: currentUser.id,
          categoryCount: gameState.categoryCount,
          endTime: playData
            ? new Date(playData.start_time.getTime() + gameState.seconds * 1000)
            : new Date(0),
        });
      }
    };
    handleEndGame().catch((error) => {
      console.error("Error ending game:", error);
      toast("Something went wrong 😭");
    });
  }, [gameState, currentUser, endPlay, playData, refetchPlay, gameId]);

  if (!categories || !gameId) {
    return (
      <>
        <Header />
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFF1D4]">
          <h1>unable to load game :(</h1>
        </div>
      </>
    );
  }

  const handleWordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const word = gameState.word.trim();
    verifyWord({
      word: word,
      category:
        categories[gameState.categoryCount % categories.length]?.category ??
        " ",
    });
  };

  if (isLoadingUser || isCheckingPlay) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF1D4]">
        Loading...
      </div>
    );
  }

  if (
    !gameState.gameStarted &&
    !gameState.gameEnded &&
    !isLoadingUser &&
    !isCheckingPlay &&
    !playData
  ) {
    return (
      <>
        <Header />
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFF1D4]">
          <Button
            className="mt-8"
            onClick={() => {
              if (currentUser) {
                setGameState((prev) => ({
                  ...prev,
                  gameStarted: true,
                }));
                addPlay({
                  gameId,
                  userId: currentUser.id,
                  startTime: new Date(),
                });
              }
            }}
          >
            Start Game
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#FFF1D4]">
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-3 sm:px-4">
          <div className="w-full max-w-xs space-y-12 sm:max-w-sm sm:space-y-16 md:max-w-md">
            <div className="-mt-12 sm:-mt-20">
              <Timer seconds={gameState.seconds} />
            </div>

            <GameStats
              characterCount={gameState.characterCount}
              categoryCount={gameState.categoryCount}
            />

            <div className="space-y-3 sm:space-y-4">
              {!gameState.gameEnded && (
                <CategoryDisplay
                  category={
                    categories[gameState.categoryCount % categories.length]
                      ?.category ?? "sorry we messed up :("
                  }
                />
              )}
              <form
                onSubmit={handleWordSubmit}
                className="space-y-4 sm:space-y-6"
              >
                <Input
                  placeholder={
                    gameState.gameEnded || gameState.characterCount >= 100
                      ? "Game finished!"
                      : "Enter your word here..."
                  }
                  value={gameState.word}
                  onChange={(e) =>
                    setGameState((prev) => ({ ...prev, word: e.target.value }))
                  }
                  className="w-full"
                  disabled={
                    gameState.gameEnded || gameState.characterCount >= 100
                  }
                />
                <Button
                  variant="default"
                  className="w-full"
                  type="submit"
                  disabled={
                    gameState.gameEnded || gameState.characterCount >= 100
                  }
                >
                  Submit
                </Button>
              </form>
              <Button
                variant="default"
                className="w-full"
                onClick={() =>
                  setGameState((prev) => ({
                    ...prev,
                    categoryCount: prev.categoryCount + 1,
                  }))
                }
                disabled={
                  gameState.gameEnded || gameState.characterCount >= 100
                }
              >
                Skip Category
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
