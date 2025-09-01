'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, BrainCircuit, RotateCw, Trophy } from 'lucide-react';
import Link from 'next/link';

const icons = ['🐱', '🐶', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
const cardValues = [...icons, ...icons].sort(() => Math.random() - 0.5);

export default function PuzzlePage() {
  const [cards, setCards] = useState(cardValues.map((value, index) => ({ id: index, value, isFlipped: false, isMatched: false })));
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || cards[index].isFlipped) {
      return;
    }

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    setFlippedCards([...flippedCards, index]);
  };

  const checkMatch = () => {
    if (flippedCards.length === 2) {
      setMoves(moves + 1);
      const [firstIndex, secondIndex] = flippedCards;
      if (cards[firstIndex].value === cards[secondIndex].value) {
        const newCards = [...cards];
        newCards[firstIndex].isMatched = true;
        newCards[secondIndex].isMatched = true;
        setCards(newCards);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          const newCards = [...cards];
          newCards[firstIndex].isFlipped = false;
          newCards[secondIndex].isFlipped = false;
          setCards(newCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    const newCardValues = [...icons, ...icons].sort(() => Math.random() - 0.5);
    setCards(newCardValues.map((value, index) => ({ id: index, value, isFlipped: false, isMatched: false })));
    setFlippedCards([]);
    setMoves(0);
    setGameOver(false);
  };

  useEffect(() => {
    checkMatch();
  }, [flippedCards]);

  useEffect(() => {
    if (cards.every(card => card.isMatched)) {
      setGameOver(true);
    }
  }, [cards]);

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="mb-4 flex justify-between items-center">
          <Button asChild variant="ghost" className="text-muted-foreground">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> প্রধান মেনু
            </Link>
          </Button>
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <Trophy className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">চাল</p>
                  <div className="text-xl font-bold">{moves}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-4 relative">
            <div className="grid grid-cols-4 gap-4">
              {cards.map((card, index) => (
                <div
                  key={index}
                  className={`aspect-square rounded-lg flex items-center justify-center text-4xl cursor-pointer transition-transform duration-300 ${card.isFlipped ? 'bg-primary/20' : 'bg-muted'}`}
                  style={{ transform: card.isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                  onClick={() => handleCardClick(index)}
                >
                  <div style={{ transform: card.isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                    {card.isFlipped || card.isMatched ? card.value : <BrainCircuit className="text-muted-foreground"/>}
                  </div>
                </div>
              ))}
            </div>
             {gameOver && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/70 rounded-lg">
                    <div className="text-center text-white">
                        <h2 className="text-4xl font-bold mb-4">দারুণ!</h2>
                        <p className="text-2xl mb-4">{moves} চালে সম্পন্ন।</p>
                        <Button onClick={resetGame} size="lg">
                            <RotateCw className="mr-2 h-5 w-5" /> আবার খেলুন
                        </Button>
                    </div>
                </div>
            )}
          </CardContent>
        </Card>
         <p className="text-center text-muted-foreground mt-4">
            একই রকম দুটি কার্ড মেলান।
        </p>
      </div>
    </main>
  );
}
