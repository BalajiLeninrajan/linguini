"use client";
import { useState } from "react";
import { Card, CardContent, CardTitle } from "~/components/ui/card";
import Header from "../_components/header";
import Stack from "~/components/ui/stack";
import "~/styles/stack.css";

export default function AboutPage() {
  const images = [
    { id: 1, img: "/photos/IMG_5022.jpeg" },
    { id: 2, img: "/photos/q76m0v7mo7a11.png" },
    { id: 3, img: "/photos/B103C618-8613-4E90-A4F0-041FD79733BF.jpeg" },
    { id: 4, img: "/photos/IMG_1142.jpeg" },
    { id: 5, img: "/photos/IMG_4415.jpeg" },
    { id: 6, img: "/photos/IMG_4698.jpeg" },
    { id: 7, img: "/photos/IMG_0080.jpeg" },
    { id: 8, img: "/photos/IMG_6639.jpeg" },
  ];

  return (
    <>
      <Header />
      <div className="flex min-h-screen items-center justify-center bg-[#FFF1D4] px-4">
        <div className="mt-32 w-full max-w-7xl">
          <Card variant="yellow" className="relative w-full">
            <CardContent className="flex flex-col items-center justify-start p-16 pt-12">
              {/* Title Above */}
              <CardTitle className="mb-16 text-5xl text-amber-900">
                Thanks for playing!
              </CardTitle>

              {/* Centered Photo Stack */}
              <div className="mb-16 flex justify-center">
                <Stack
                  randomRotation={true}
                  sensitivity={180}
                  sendToBackOnClick={true}
                  cardDimensions={{ width: 600, height: 400 }}
                  cardsData={images}
                />
              </div>
            </CardContent>

            {/* Tag in bottom left */}
            <div className="absolute bottom-4 left-4 text-sm text-amber-900 opacity-70">
              made with <span className="line-through">caffeine</span> love at
              waterloo
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
