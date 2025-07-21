"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
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
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="mx-auto w-full max-w-md sm:max-w-lg md:max-w-xl">
          <Card variant="yellow" className="relative w-full">
            {/* Header Bar */}
            <div className="flex items-center justify-between rounded-t-xl bg-amber-800 px-4 py-3">
              <div className="text-2xl font-bold text-amber-100 italic">
                linguini
              </div>
              <div className="flex gap-2">
                {/* Placeholder for icons - not adding actual icons as requested */}
                <div className="h-6 w-6 rounded bg-amber-700"></div>
                <div className="h-6 w-6 rounded bg-amber-700"></div>
                <div className="h-6 w-6 rounded bg-amber-700"></div>
                <div className="h-6 w-6 rounded bg-amber-700"></div>
              </div>
            </div>

            {/* Main Game Content */}
            <CardContent className="space-y-6 p-6">
              {/* Timer */}
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-900 sm:text-4xl">
                  {timer}
                </div>
              </div>

              {/* Statistics */}
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-900 sm:text-3xl">
                    {characterCount}/100
                  </div>
                  <div className="text-sm text-gray-600">character count</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-900 sm:text-3xl">
                    {categoryCount}
                  </div>
                  <div className="text-sm text-gray-600">category count</div>
                </div>
              </div>

              {/* Category */}
              <div className="text-center">
                <span className="text-amber-700">Category: </span>
                <span className="font-bold text-amber-900">
                  {currentCategory}
                </span>
              </div>

              {/* Input and Button */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // Handle word submission
                }}
                className="space-y-4"
              >
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
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
