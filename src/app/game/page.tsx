"use client";
import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Timer } from "~/components/ui/timer";
import { GameStats } from "~/components/ui/game-stats";
import { CategoryDisplay } from "~/components/ui/category-display";
import Header from "../_components/header";

export default function GamePage() {
  const [word, setWord] = useState("");
  const [timer, setTimer] = useState("2 min 34 s");
  const [characterCount, setCharacterCount] = useState(13);
  const [categoryCount, setCategoryCount] = useState(2);
  const [currentCategory, setCurrentCategory] = useState("Actor");

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#FFF1D4]">
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-3 sm:px-4">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md space-y-12 sm:space-y-16">
            <div className="-mt-12 sm:-mt-20">
              <Timer time={timer} />
            </div>

            <GameStats 
              characterCount={characterCount} 
              categoryCount={categoryCount} 
            />

            <div className="space-y-3 sm:space-y-4">
              <CategoryDisplay category={currentCategory} />

              <form onSubmit={(e) => {
                e.preventDefault();
              }} className="space-y-4 sm:space-y-6">
                <Input
                  placeholder="Enter your word here..."
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  className="w-full"
                />
                <Button variant="default" className="w-full" type="submit">
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