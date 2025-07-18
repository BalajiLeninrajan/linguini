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
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto">
          <Card variant="yellow" className="w-full relative">
            {/* Header Bar */}
            <div className="bg-amber-800 rounded-t-xl px-4 py-3 flex justify-between items-center">
              <div className="text-amber-100 text-2xl font-bold italic">linguini</div>
              <div className="flex gap-2">
                {/* Placeholder for icons - not adding actual icons as requested */}
                <div className="w-6 h-6 bg-amber-700 rounded"></div>
                <div className="w-6 h-6 bg-amber-700 rounded"></div>
                <div className="w-6 h-6 bg-amber-700 rounded"></div>
                <div className="w-6 h-6 bg-amber-700 rounded"></div>
              </div>
            </div>

            {/* Main Game Content */}
            <CardContent className="p-6 space-y-6">
              {/* Timer */}
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-amber-900">{timer}</div>
              </div>

              {/* Statistics */}
              <div className="flex justify-between items-center">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-amber-900">{characterCount}/100</div>
                  <div className="text-sm text-gray-600">character count</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-amber-900">{categoryCount}</div>
                  <div className="text-sm text-gray-600">category count</div>
                </div>
              </div>

              {/* Category */}
              <div className="text-center">
                <span className="text-amber-700">Category: </span>
                <span className="text-amber-900 font-bold">{currentCategory}</span>
              </div>

              {/* Input and Button */}
              <form onSubmit={(e) => {
                e.preventDefault();
                // Handle word submission
              }} className="space-y-4">
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