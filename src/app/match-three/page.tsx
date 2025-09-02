'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Gem, Trophy } from 'lucide-react';
import Link from 'next/link';

const WIDTH = 8;
const candyColors = ['🍓', '🍊', '🍋', '🍇', '🍏', '🍒'];

const MatchThreePage = () => {
  const [grid, setGrid] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [replacedItem, setReplacedItem] = useState<number | null>(null);

  const createBoard = useCallback(() => {
    const newBoard = [];
    for (let i = 0; i < WIDTH * WIDTH; i++) {
      newBoard.push(candyColors[Math.floor(Math.random() * candyColors.length)]);
    }
    setGrid(newBoard);
  }, []);

  const checkForMatches = (currentGrid: string[], setScore: React.Dispatch<React.SetStateAction<number>>) => {
    let newGrid = [...currentGrid];
    let changed = false;
  
    // Check for column of four
    for (let i = 0; i <= 39; i++) {
      const columnOfFour = [i, i + WIDTH, i + WIDTH * 2, i + WIDTH * 3];
      const decidedColor = newGrid[i];
      const isBlank = newGrid[i] === '';
      if (!isBlank && columnOfFour.every(square => newGrid[square] === decidedColor)) {
        columnOfFour.forEach(square => newGrid[square] = '');
        setScore(prev => prev + 40);
        changed = true;
      }
    }
  
    // Check for row of four
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const decidedColor = newGrid[i];
      const isBlank = newGrid[i] === '';
      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 61, 62, 63];
      if (notValid.includes(i)) continue;
      if (!isBlank && rowOfFour.every(square => newGrid[square] === decidedColor)) {
        rowOfFour.forEach(square => newGrid[square] = '');
        setScore(prev => prev + 40);
        changed = true;
      }
    }
  
    // Check for column of three
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + WIDTH, i + WIDTH * 2];
      const decidedColor = newGrid[i];
      const isBlank = newGrid[i] === '';
      if (!isBlank && columnOfThree.every(square => newGrid[square] === decidedColor)) {
        columnOfThree.forEach(square => newGrid[square] = '');
        setScore(prev => prev + 30);
        changed = true;
      }
    }
  
    // Check for row of three
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = newGrid[i];
      const isBlank = newGrid[i] === '';
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
      if (notValid.includes(i)) continue;
      if (!isBlank && rowOfThree.every(square => newGrid[square] === decidedColor)) {
        rowOfThree.forEach(square => newGrid[square] = '');
        setScore(prev => prev + 30);
        changed = true;
      }
    }
  
    return { newGrid, changed };
  };

  const moveIntoSquareBelow = useCallback(() => {
    let changed = false;
    const newGrid = [...grid];
    for (let i = 0; i <= 55; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i);

      if (isFirstRow && newGrid[i] === '') {
        newGrid[i] = candyColors[Math.floor(Math.random() * candyColors.length)];
        changed = true;
      }

      if (newGrid[i + WIDTH] === '') {
        newGrid[i + WIDTH] = newGrid[i];
        newGrid[i] = '';
        changed = true;
      }
    }
    if (changed) {
      setGrid(newGrid);
    }
  }, [grid]);

  const dragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setDraggedItem(parseInt(e.currentTarget.dataset.id || ''));
  };

  const dragDrop = (e: React.DragEvent<HTMLDivElement>) => {
    setReplacedItem(parseInt(e.currentTarget.dataset.id || ''));
  };

  const dragEnd = () => {
    if (draggedItem === null || replacedItem === null) return;

    const newGrid = [...grid];
    const draggedItemColor = newGrid[draggedItem];
    
    const validMoves = [
        draggedItem - 1,
        draggedItem - WIDTH,
        draggedItem + 1,
        draggedItem + WIDTH
    ];

    const validMove = validMoves.includes(replacedItem);

    if (validMove) {
        newGrid[replacedItem] = draggedItemColor;
        newGrid[draggedItem] = grid[replacedItem];

        const { newGrid: gridAfterMatch, changed } = checkForMatches(newGrid, setScore);

        if (changed) {
            setGrid(gridAfterMatch);
        } else {
             // Revert if no match
             const revertedGrid = [...grid];
             setGrid(revertedGrid);
        }
    }
    
    setDraggedItem(null);
    setReplacedItem(null);
  };

  useEffect(() => {
    createBoard();
  }, [createBoard]);
  
  useEffect(() => {
    const timer = setInterval(() => {
        const { newGrid, changed } = checkForMatches(grid, setScore);
        if(changed) {
            setGrid(newGrid);
        }
        moveIntoSquareBelow();
    }, 100);
    return () => clearInterval(timer);
  }, [grid, moveIntoSquareBelow]);

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
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
                  <p className="text-xs text-muted-foreground">স্কোর</p>
                  <div className="text-xl font-bold">{score}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-8 gap-1">
              {grid.map((candy, index) => (
                <div
                  key={index}
                  data-id={index}
                  draggable
                  onDragStart={dragStart}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={(e) => e.preventDefault()}
                  onDragLeave={(e) => e.preventDefault()}
                  onDrop={dragDrop}
                  onDragEnd={dragEnd}
                  className="w-12 h-12 flex justify-center items-center text-3xl rounded-md cursor-pointer bg-muted/30"
                >
                  {candy}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <p className="text-center text-muted-foreground mt-4">
          একটি ফলকে টেনে এনে তার পাশের ফলের ওপর ছেড়ে দিয়ে জায়গা বদল করুন।
        </p>
      </div>
    </main>
  );
};

export default MatchThreePage;
