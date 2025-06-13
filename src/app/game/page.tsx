'use client';

import { useState } from 'react';
import { LinguiniStyles } from '~/styles/styles';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';

export default function GamePage() {
  const [timeLeft, setTimeLeft] = useState({ minutes: 2, seconds: 34 });
  const [characterCount, setCharacterCount] = useState(13);
  const [categoryCount, setCategoryCount] = useState(2);
  const [inputWord, setInputWord] = useState('');

  const handleSkipCategory = () => {
    // todo: insert skip category code here later!!
  };

  return (
    <div className={LinguiniStyles.layout.pageContainer}>
      {/* Timer */}
      <div className={LinguiniStyles.game.timer}>
        <span className="font-bold">2</span> min <span className="font-bold">34</span> s
      </div>

      {/* Counts */}
      <div className={LinguiniStyles.layout.countsContainer}>
        <div className={LinguiniStyles.layout.countBox}>
          <div className={LinguiniStyles.game.count}>13/100</div>
          <div className={`${LinguiniStyles.game.label} text-lg`}>character count</div>
        </div>
        <div className={LinguiniStyles.layout.countBox}>
          <div className={LinguiniStyles.game.count}>2</div>
          <div className={`${LinguiniStyles.game.label} text-lg`}>category count</div>
        </div>
      </div>

      {/* Category */}
      <div className={LinguiniStyles.game.category}>
        <h2>
          <span className={LinguiniStyles.game.categoryText}>Category: </span>
          <span className={LinguiniStyles.game.categoryText}>Actor</span>
        </h2>
      </div>

      {/* Input */}
      <div className={LinguiniStyles.layout.inputContainer}>
        <Input
          type="text"
          value={inputWord}
          onChange={(e) => setInputWord(e.target.value)}
          placeholder="Enter your word here..."
        />
        <Button onClick={handleSkipCategory}>
            Skip Category
        </Button>
      </div>
    </div>
  );
} 