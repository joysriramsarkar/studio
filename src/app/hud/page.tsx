
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Play, RotateCw, Pause } from 'lucide-react';
import Link from 'next/link';

const GRID_SIZE = 30;
const BOARD_SIZE = 600;
const CELL_SIZE = BOARD_SIZE / GRID_SIZE;
const LEVEL_UP_SCORE = 100;

const FoodTypes = {
  APPLE: {
    emoji: '🍎',
    points: 10,
    color: 'text-red-500',
  },
  BANANA: {
    emoji: '🍌',
    points: 20,
    color: 'text-yellow-500',
  },
};

type FoodType = keyof typeof FoodTypes;

interface Food {
  x: number;
  y: number;
  type: FoodType;
}

interface Obstacle {
  x: number;
  y: number;
}

const getRandomCoordinate = (exclude: ({ x: number; y: number } | undefined)[] = []) => {
  let coordinate;
  do {
    coordinate = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (exclude.some(ex => ex && ex.x === coordinate.x && ex.y === coordinate.y));
  return coordinate;
};

const generateObstacles = (level: number): Obstacle[] => {
    if (level <= 1) return [];
    const obstacles: Obstacle[] = [];
    const numObstacles = (level - 1) * 4;

    for (let i = 0; i < numObstacles; i++) {
        obstacles.push(getRandomCoordinate(obstacles));
    }
    return obstacles;
}

export default function SnakeGamePage() {
  const [snake, setSnake] = useState([{ x: 15, y: 15 }]);
  const [food, setFood] = useState<Food>(() => ({ ...getRandomCoordinate(), type: 'APPLE' }));
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [speed, setSpeed] = useState<number | null>(200);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);

  const eatSoundRef = useRef<HTMLAudioElement>(null);
  const gameOverSoundRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const storedHighScore = localStorage.getItem('snakeHighScore');
        if (storedHighScore) {
            setHighScore(parseInt(storedHighScore, 10));
        }

        eatSoundRef.current = new Audio('/eat.mp3');
        gameOverSoundRef.current = new Audio('/game-over.mp3');

        const volume = localStorage.getItem('volume');
        if (volume) {
            const vol = Number(volume) / 100;
            if(eatSoundRef.current) eatSoundRef.current.volume = vol;
            if(gameOverSoundRef.current) gameOverSoundRef.current.volume = vol;
        }
    }
  }, []);

  const playSound = (sound: 'eat' | 'gameOver') => {
    const ref = sound === 'eat' ? eatSoundRef : gameOverSoundRef;
    ref.current?.play().catch(e => console.error(`Error playing ${sound} sound:`, e));
  };

  const handleGameOver = useCallback(() => {
    playSound('gameOver');
    setSpeed(null);
    setGameOver(true);
    if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('snakeHighScore', score.toString());
    }
  }, [score, highScore]);

  const startGame = () => {
    setSnake([{ x: 15, y: 15 }]);
    setDirection('RIGHT');
    setSpeed(200);
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
    setLevel(1);
    setObstacles([]);
    setFood({ ...getRandomCoordinate(), type: 'APPLE' });
  };

  const spawnFood = (currentSnake: {x:number, y:number}[]) => {
      const type: FoodType = Math.random() > 0.7 ? 'BANANA' : 'APPLE';
      let newFoodPosition;
      do {
          newFoodPosition = getRandomCoordinate([...currentSnake, ...obstacles]);
      } while (
          currentSnake.some(seg => seg.x === newFoodPosition.x && seg.y === newFoodPosition.y) ||
          obstacles.some(obs => obs.x === newFoodPosition.x && obs.y === newFoodPosition.y)
      );
      setFood({ ...newFoodPosition, type });
  }

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake((prevSnake) => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      if (
        head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE ||
        newSnake.some(segment => segment.x === head.x && segment.y === head.y) ||
        obstacles.some(obs => obs.x === head.x && obs.y === head.y)
      ) {
        handleGameOver();
        return prevSnake;
      }

      newSnake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        const foodType = FoodTypes[food.type];
        const newScore = score + foodType.points;
        setScore(newScore);
        
        const newLevel = Math.floor(newScore / LEVEL_UP_SCORE) + 1;
        if (newLevel > level) {
            setLevel(newLevel);
            setObstacles(generateObstacles(newLevel));
            setSpeed(s => Math.max(50, (s || 200) * 0.9));
        }

        playSound('eat');
        spawnFood(newSnake);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, obstacles, score, level, handleGameOver]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (gameOver) return;
        
        if (e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            setIsPaused(p => !p);
            return;
        }

        if (isPaused) return;

        switch (e.key) {
            case 'ArrowUp': case 'w': if (direction !== 'DOWN') setDirection('UP'); break;
            case 'ArrowDown': case 's': if (direction !== 'UP') setDirection('DOWN'); break;
            case 'ArrowLeft': case 'a': if (direction !== 'RIGHT') setDirection('LEFT'); break;
            case 'ArrowRight': case 'd': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver, isPaused]);

  useEffect(() => {
    if (speed !== null && !gameOver && !isPaused) {
      const gameInterval = setInterval(moveSnake, speed);
      return () => clearInterval(gameInterval);
    }
  }, [snake, speed, gameOver, isPaused, moveSnake]);

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl">
         <div className="mb-2">
          <Button asChild variant="ghost" className="text-muted-foreground">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> প্রধান মেনু
            </Link>
          </Button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-grow flex items-center justify-center">
                <Card className="shadow-2xl">
                    <CardContent className="p-1 sm:p-2">
                        <div
                            className="relative bg-muted/20 border-2 border-primary/20 aspect-square"
                            style={{ width: '100%', maxWidth: BOARD_SIZE, maxHeight: BOARD_SIZE }}
                        >
                             <div
                                className="absolute inset-0 grid grid-cols-30 grid-rows-30"
                                style={{
                                    backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
                                    backgroundImage: 'linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)',
                                    opacity: 0.1
                                }}
                            />
                            {snake.map((segment, index) => (
                            <div
                                key={index}
                                className={`absolute ${index === 0 ? 'bg-primary' : 'bg-primary/70'} rounded-sm`}
                                style={{
                                    left: `${segment.x / GRID_SIZE * 100}%`,
                                    top: `${segment.y / GRID_SIZE * 100}%`,
                                    width: `${100 / GRID_SIZE}%`,
                                    height: `${100 / GRID_SIZE}%`,
                                }}
                            />
                            ))}
                            <div
                                className="absolute text-xl flex items-center justify-center"
                                style={{
                                    left: `${food.x / GRID_SIZE * 100}%`,
                                    top: `${food.y / GRID_SIZE * 100}%`,
                                    width: `${100 / GRID_SIZE}%`,
                                    height: `${100 / GRID_SIZE}%`,
                                }}
                                >
                                {FoodTypes[food.type].emoji}
                            </div>
                            {obstacles.map((obs, index) => (
                                <div
                                    key={index}
                                    className="absolute bg-foreground/50 rounded-sm"
                                    style={{
                                        left: `${obs.x / GRID_SIZE * 100}%`,
                                        top: `${obs.y / GRID_SIZE * 100}%`,
                                        width: `${100 / GRID_SIZE}%`,
                                        height: `${100 / GRID_SIZE}%`,
                                    }}
                                />
                            ))}

                            {(gameOver || isPaused) && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/70">
                                    <div className="text-center text-white">
                                        <h2 className="text-4xl font-bold mb-4">
                                        {gameOver ? "গেম ওভার!" : "পজড"}
                                        </h2>
                                        {gameOver && (
                                        <p className="text-2xl mb-4">আপনার স্কোর: {score}</p>
                                        )}
                                        <Button onClick={gameOver ? startGame : () => setIsPaused(false)} size="lg">
                                            {gameOver ? <RotateCw className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                                            {gameOver ? "আবার খেলুন" : "চালিয়ে যান"}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="lg:w-[280px] shrink-0 space-y-4">
                <Card>
                    <CardHeader className="p-4">
                        <CardTitle className="text-lg">খেলার পরিসংখ্যান</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">স্কোর</span>
                            <span className="font-bold">{score}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">সর্বোচ্চ স্কোর</span>
                            <span className="font-bold">{highScore}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">লেভেল</span>
                            <span className="font-bold">{level}</span>
                        </div>
                         <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">গতি</span>
                            <span className="font-bold">{speed ? (200 / speed * 10).toFixed(1) : 0}</span>
                        </div>
                        <div>
                             <span className="text-muted-foreground text-xs">লেভেল আপ: {LEVEL_UP_SCORE - (score % LEVEL_UP_SCORE)} পয়েন্ট বাকি</span>
                             <Progress value={(score % LEVEL_UP_SCORE) / LEVEL_UP_SCORE * 100} className="mt-1 h-2" />
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="p-4">
                        <CardTitle className="text-lg">নিয়ন্ত্রণ</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 text-xs text-muted-foreground space-y-1">
                        <p><span className="font-mono bg-muted p-1 rounded">↑ W</span> - উপরে যান</p>
                        <p><span className="font-mono bg-muted p-1 rounded">↓ S</span> - নিচে যান</p>
                        <p><span className="font-mono bg-muted p-1 rounded">← A</span> - বামে যান</p>
                        <p><span className="font-mono bg-muted p-1 rounded">→ D</span> - ডানে যান</p>
                        <p><span className="font-mono bg-muted p-1 rounded">Space</span> - পজ/চালু</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="p-4">
                        <CardTitle className="text-lg">ফলের পয়েন্ট</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 text-xs space-y-2">
                       {Object.values(FoodTypes).map(ft => (
                           <div key={ft.emoji} className="flex items-center gap-2">
                               <span className="text-xl">{ft.emoji}</span>
                               <span className="text-muted-foreground">{ft.points} পয়েন্ট</span>
                           </div>
                       ))}
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </main>
  );
}
