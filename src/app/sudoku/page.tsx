
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Brain, RotateCw, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

const initialPuzzle = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

const solution = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
];


export default function SudokuPage() {
  const [board, setBoard] = useState(JSON.parse(JSON.stringify(initialPuzzle)));
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const { toast } = useToast();

  const handleCellClick = (row: number, col: number) => {
    if (initialPuzzle[row][col] === 0) {
      setSelectedCell({ row, col });
    }
  };

  const handleNumberInput = useCallback((num: number) => {
    if (selectedCell) {
      const newBoard = [...board];
      newBoard[selectedCell.row][selectedCell.col] = num;
      setBoard(newBoard);
    }
  }, [selectedCell, board]);

  const checkSolution = () => {
    if (JSON.stringify(board) === JSON.stringify(solution)) {
       toast({
        title: "সঠিক!",
        description: "আপনি সফলভাবে সুডোকু সমাধান করেছেন।",
        className: "bg-green-500 text-white"
      });
    } else {
      toast({
        variant: "destructive",
        title: "ভুল!",
        description: "আপনার সমাধান সঠিক নয়। আবার চেষ্টা করুন।",
      });
    }
  };

  const resetBoard = () => {
    setBoard(JSON.parse(JSON.stringify(initialPuzzle)));
    setSelectedCell(null);
  };
  
  const clearSelection = useCallback(() => {
    if(selectedCell) {
        const newBoard = [...board];
        newBoard[selectedCell.row][selectedCell.col] = 0;
        setBoard(newBoard);
    }
  }, [selectedCell, board]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if (!selectedCell) return;

        const key = event.key;
        if (key >= '1' && key <= '9') {
            handleNumberInput(parseInt(key));
        } else if (key === 'Backspace' || key === 'Delete') {
            clearSelection();
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedCell, handleNumberInput, clearSelection]);

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="mb-4">
          <Button asChild variant="ghost" className="text-muted-foreground">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> প্রধান মেনু
            </Link>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-8">
            <Card>
            <CardHeader>
                <CardTitle className="text-center text-3xl font-bold flex items-center justify-center gap-2">
                <Brain /> সুডোকু
                </CardTitle>
            </CardHeader>
            <CardContent className="p-2 md:p-4">
                <div className="grid grid-cols-9 border-collapse">
                {board.map((row: number[], rowIndex: number) =>
                    row.map((cell: number, colIndex: number) => {
                    const isInitial = initialPuzzle[rowIndex][colIndex] !== 0;
                    const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
                    const isSameValue = selectedCell && board[selectedCell.row][selectedCell.col] !== 0 && cell === board[selectedCell.row][selectedCell.col];

                    return (
                        <button
                        key={`${rowIndex}-${colIndex}`}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        className={cn(
                            'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center border text-xl md:text-2xl font-bold',
                            'border-muted-foreground/50',
                            isInitial ? 'text-foreground' : 'text-primary',
                            !isInitial && 'cursor-pointer hover:bg-muted/50',
                            isSelected && 'bg-primary/20 ring-2 ring-primary',
                            isSameValue && !isInitial && !isSelected && 'bg-primary/10',
                            (colIndex + 1) % 3 === 0 && colIndex !== 8 && 'border-r-2 border-r-foreground',
                            (rowIndex + 1) % 3 === 0 && rowIndex !== 8 && 'border-b-2 border-b-foreground',
                            rowIndex === 0 && 'border-t-2 border-t-foreground',
                            colIndex === 0 && 'border-l-2 border-l-foreground',
                        )}
                        >
                        {cell !== 0 ? cell : ''}
                        </button>
                    );
                    })
                )}
                </div>
            </CardContent>
            </Card>

            <div className="flex flex-row md:flex-col gap-4 mt-4 md:mt-0">
                <Button onClick={checkSolution} className="w-full">
                    <CheckCircle className="mr-2 h-4 w-4" /> সমাধান যাচাই
                </Button>
                <Button onClick={resetBoard} variant="secondary" className="w-full">
                    <RotateCw className="mr-2 h-4 w-4" /> রিসেট
                </Button>
                <Button onClick={clearSelection} variant="destructive" className="w-full">
                    <XCircle className="mr-2 h-4 w-4" /> মুছুন
                </Button>
            </div>
        </div>
      </div>
    </main>
  );
}
