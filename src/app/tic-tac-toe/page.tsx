'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, RotateCw, X, Circle, Trophy } from 'lucide-react';
import Link from 'next/link';

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const calculateWinner = (squares: (string | null)[]) => {
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  if (squares.every(square => square !== null)) {
    return 'Draw';
  }
  return null;
};

export default function TicTacToePage() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [scores, setScores] = useState({ X: 0, O: 0 });

  const handleClick = (index: number) => {
    if (board[index] || winner || !isXNext) {
      return;
    }

    const newBoard = board.slice();
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsXNext(false);
  };

  const findBestMove = (squares: (string | null)[]) => {
    // 1. Check if bot can win
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        const newBoard = squares.slice();
        newBoard[i] = 'O';
        if (calculateWinner(newBoard) === 'O') {
          return i;
        }
      }
    }

    // 2. Check if player can win and block
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        const newBoard = squares.slice();
        newBoard[i] = 'X';
        if (calculateWinner(newBoard) === 'X') {
          return i;
        }
      }
    }
    
    // 3. Take center if available
    if (!squares[4]) return 4;

    // 4. Pick a random available square
    const availableMoves = squares
        .map((val, index) => (val === null ? index : null))
        .filter(val => val !== null);
    
    return availableMoves[Math.floor(Math.random() * availableMoves.length)] as number;
  }

  const resetGame = (isNewRound: boolean = false) => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    if (!isNewRound) {
        setScores({ X: 0, O: 0 });
    }
  };

  useEffect(() => {
    const gameWinner = calculateWinner(board);
    if (gameWinner) {
      setWinner(gameWinner);
      if (gameWinner === 'X') {
        setScores(prev => ({ ...prev, X: prev.X + 1 }));
      } else if (gameWinner === 'O') {
        setScores(prev => ({ ...prev, O: prev.O + 1 }));
      }
    } else if (!isXNext) {
        // Bot's turn
        const timeout = setTimeout(() => {
            const bestMove = findBestMove(board);
            if(bestMove !== undefined) {
                const newBoard = board.slice();
                newBoard[bestMove] = 'O';
                setBoard(newBoard);
                setIsXNext(true);
            }
        }, 500); // Add a small delay for better user experience
        return () => clearTimeout(timeout);
    }
  }, [board, isXNext]);

  const renderSquare = (index: number) => {
    return (
      <button
        key={index}
        className="w-24 h-24 bg-muted/50 rounded-lg flex items-center justify-center text-6xl font-bold transition-colors hover:bg-muted disabled:cursor-not-allowed"
        onClick={() => handleClick(index)}
        disabled={!isXNext || !!board[index]}
      >
        {board[index] === 'X' && <X className="w-16 h-16 text-primary" />}
        {board[index] === 'O' && <Circle className="w-16 h-16 text-red-500" />}
      </button>
    );
  };
  
  const getStatusMessage = () => {
    if (winner) {
      return winner === 'Draw' ? 'ড্র!' : `বিজয়ী: ${winner}`;
    } else {
      return `পরবর্তী চাল: ${isXNext ? 'X' : 'O'}`;
    }
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <Button asChild variant="ghost" className="text-muted-foreground">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> প্রধান মেনু
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold">টিক-ট্যাক-টো</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <div className="flex justify-around w-full">
                <div className="text-center">
                    <p className="text-lg font-semibold">প্লেয়ার X (আপনি)</p>
                    <p className="text-3xl font-bold text-primary">{scores.X}</p>
                </div>
                <div className="text-center">
                    <p className="text-lg font-semibold">প্লেয়ার O (বট)</p>
                    <p className="text-3xl font-bold text-red-500">{scores.O}</p>
                </div>
            </div>
          
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 9 }).map((_, i) => renderSquare(i))}
            </div>

            <div className="text-2xl font-semibold h-8">
              {getStatusMessage()}
            </div>

            <div className="flex gap-4">
                <Button onClick={() => resetGame(true)} disabled={!winner}>
                    <RotateCw className="mr-2 h-4 w-4" /> পরবর্তী রাউন্ড
                </Button>
                <Button onClick={() => resetGame(false)} variant="secondary">
                    রিসেট
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
