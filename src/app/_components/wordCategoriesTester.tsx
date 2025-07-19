"use client";

import { useState } from "react";
import { api } from "~/trpc/react"; // adjust to your client path

// TODO: This was a vibe coded frontend Jane used to test the word-categories api. Delete before submitting
export function WordCategoryTester() {
  const [word, setWord] = useState("");
  const [category, setCategory] = useState("");
  const [seed, setSeed] = useState(0.5);

  const [result, setResult] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  const createQuery = api.wordCategories.verify.useQuery(
    { word, category },
    { enabled: false } // disable auto-run
  );

  const generateMutation = api.wordCategories.generateCategoriesList.useMutation();

  const handleCheckMatch = async () => {
    try {
      const res = await createQuery.refetch();
      setResult(res.data ? "✅ Match found" : "❌ No match");
    } catch (err) {
      console.error(err);
      setResult("⚠️ Error occurred");
    }
  };

  const handleGenerateCategories = async () => {
    try {
      const res = await generateMutation.mutateAsync({ seed });
      setCategories(res.map((c) => c.category));
    } catch (err) {
      console.error(err);
      setCategories([]);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-semibold">Word Category Tester</h2>

      <div className="space-y-2">
        <input
          className="border p-2 w-full"
          type="text"
          placeholder="Enter word"
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          type="text"
          placeholder="Enter category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleCheckMatch}
        >
          Check Match
        </button>
        {result && <p className="text-lg mt-2">{result}</p>}
      </div>

      <hr />

      <div className="space-y-2">
        <label className="block font-medium">Seed (between 0 and 1)</label>
        <input
          className="border p-2 w-full"
          type="number"
          step="0.01"
          min="0.01"
          max="0.99"
          value={seed}
          onChange={(e) => setSeed(Number(e.target.value))}
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleGenerateCategories}
        >
          Generate Categories
        </button>
        <ul className="list-disc ml-6 mt-2">
          {categories.map((cat, idx) => (
            <li key={idx}>{cat}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
