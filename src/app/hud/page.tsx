
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Play, RotateCw, Apple, Trophy } from 'lucide-react';
import Link from 'next/link';

const GRID_SIZE = 20;
const BOARD_SIZE = 600;

const getRandomCoordinate = () => {
  return {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  };
};

export default function SnakeGamePage() {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState(getRandomCoordinate());
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [speed, setSpeed] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const eatSoundRef = useRef<HTMLAudioElement>(null);
  const gameOverSoundRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        eatSoundRef.current = new Audio('/eat.mp3');
        gameOverSoundRef.current = new Audio('/game-over.mp3');

        const volume = localStorage.getItem('volume');
        if (volume) {
            const vol = Number(volume) / 100;
            eatSoundRef.current.volume = vol;
            gameOverSoundRef.current.volume = vol;
        }
    }
  }, []);

  const playEatSound = () => {
    eatSoundRef.current?.play().catch(e => console.error("Error playing eat sound:", e));
  };

  const playGameOverSound = () => {
    gameOverSoundRef.current?.play().catch(e => console.error("Error playing game over sound:", e));
  };


  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(getRandomCoordinate());
    setDirection('RIGHT');
    setSpeed(200);
    setGameOver(false);
    setScore(0);
  };

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    setSnake((prevSnake) => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        setSpeed(null);
        playGameOverSound();
        return prevSnake;
      }

      // Self collision
      for (const segment of newSnake) {
        if (segment.x === head.x && segment.y === head.y) {
          setGameOver(true);
          setSpeed(null);
          playGameOverSound();
          return prevSnake;
        }
      }

      newSnake.unshift(head);

      // Food collision
      if (head.x === food.x && head.y === food.y) {
        setScore((s) => s + 10);
        playEatSound();
        let newFoodPosition;
        let isFoodOnSnake;
        do {
            isFoodOnSnake = false;
            newFoodPosition = getRandomCoordinate();
            for (const segment of newSnake) {
                if (segment.x === newFoodPosition.x && segment.y === newFoodPosition.y) {
                    isFoodOnSnake = true;
                    break;
                }
            }
        } while (isFoodOnSnake);

        setFood(newFoodPosition);
        
        // Increase speed
        setSpeed(s => Math.max(50, (s || 200) * 0.95));

      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (speed !== null && !gameOver) {
      const gameInterval = setInterval(moveSnake, speed);
      return () => clearInterval(gameInterval);
    }
  }, [snake, speed, gameOver, moveSnake]);

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
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
            <CardContent className="p-4 flex items-center justify-center relative">
                <div
                    className="relative bg-muted/20 border-2 border-primary/20"
                    style={{ width: BOARD_SIZE, height: BOARD_SIZE }}
                >
                    {snake.map((segment, index) => (
                    <div
                        key={index}
                        className={`absolute ${index === 0 ? 'bg-primary' : 'bg-primary/70'} rounded-sm`}
                        style={{
                        left: segment.x * (BOARD_SIZE / GRID_SIZE),
                        top: segment.y * (BOARD_SIZE / GRID_SIZE),
                        width: BOARD_SIZE / GRID_SIZE,
                        height: BOARD_SIZE / GRID_SIZE,
                        }}
                    />
                    ))}
                    <div
                        className="absolute text-2xl"
                        style={{
                            left: food.x * (BOARD_SIZE / GRID_SIZE),
                            top: food.y * (BOARD_SIZE / GRID_SIZE),
                        }}
                        >
                        <Apple className="h-5 w-5 text-red-500" />
                    </div>

                    {speed === null && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/70">
                            <div className="text-center text-white">
                                <h2 className="text-4xl font-bold mb-4">
                                {gameOver ? "গেম ওভার!" : "সাপের গেম"}
                                </h2>
                                {gameOver && (
                                <p className="text-2xl mb-4">আপনার স্কোর: {score}</p>
                                )}
                                <Button onClick={startGame} size="lg">
                                    {gameOver ? <RotateCw className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                                    {gameOver ? "আবার খেলুন" : "খেলা শুরু করুন"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
        <p className="text-center text-muted-foreground mt-4">
            সরানোর জন্য অ্যারো কী ব্যবহার করুন।
        </p>
      </div>
    </main>
  );
}
