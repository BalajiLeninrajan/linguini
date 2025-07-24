"use client";

import { useState } from "react";
import { api } from "~/trpc/react"; // adjust to your client path

// TODO: This was a vibe coded frontend Jane used to test the word-categories api. Delete before submitting
export function WordCategoryTester() {
  const [word, setWord] = useState("");
  const [category, setCategory] = useState("");
  const [seed, setSeed] = useState(0.5);

  const verifyQuery = api.wordCategories.verify.useQuery(
    { word, category },
    { enabled: false }
  );

  const generateQuery = api.wordCategories.generateCategoriesList.useQuery(
    { seed },
    { enabled: false }
  );

  const handleVerify = async () => {
    verifyQuery.refetch();
  };

  const handleGenerate = async () => {
    generateQuery.refetch();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Word Category API Tester</h1>

      {/* --- VERIFY --- */}
      <div className="border p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-2">Verify Word in Category</h2>
        <input
          type="text"
          placeholder="Word"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <button
          onClick={handleVerify}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Test Verify
        </button>
        {verifyQuery.isFetching && <p className="text-gray-500 mt-2">Loading...</p>}
        {verifyQuery.isSuccess && (
          <p className="mt-2">
            ✅ Result:{" "}
            <strong>
              {verifyQuery.data ? "True (Match found)" : "False (No match)"}
            </strong>
          </p>
        )}
        {verifyQuery.error && (
          <p className="text-red-500 mt-2">Error: {verifyQuery.error.message}</p>
        )}
      </div>

      {/* --- GENERATE --- */}
      <div className="border p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-2">Generate Category List</h2>
        <input
          type="number"
          step="0.01"
          min={0}
          max={0.99}
          value={seed}
          onChange={(e) => setSeed(Number(e.target.value))}
          className="border p-2 rounded w-full mb-4"
        />
        <button
          onClick={handleGenerate}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
        >
          Generate Categories
        </button>
        {generateQuery.isFetching && <p className="text-gray-500 mt-2">Loading...</p>}
        {generateQuery.isSuccess && (
          <ul className="mt-2 list-disc list-inside">
            {generateQuery.data.map((c, i) => (
              <li key={i}>{c.category}</li>
            ))}
          </ul>
        )}
        {generateQuery.error && (
          <p className="text-red-500 mt-2">Error: {generateQuery.error.message}</p>
        )}
      </div>
    </div>
  );
}
