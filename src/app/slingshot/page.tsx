
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Crosshair, RefreshCw, Trophy } from 'lucide-react';
import Link from 'next/link';

interface Target {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface BulletHole {
  id: number;
  x: number;
  y: number;
}

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

const ShootingGalleryPage = () => {
  const [targets, setTargets] = useState<Target[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [bulletHoles, setBulletHoles] = useState<BulletHole[]>([]);

  const hitSoundRef = useRef<HTMLAudioElement | null>(null);
  const missSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
      if(typeof window !== 'undefined') {
        hitSoundRef.current = new Audio('/hit.mp3');
        missSoundRef.current = new Audio('/miss.mp3');

        const volume = localStorage.getItem('volume');
        if (volume) {
            const vol = Number(volume) / 100;
            if (hitSoundRef.current) hitSoundRef.current.volume = vol;
            if (missSoundRef.current) missSoundRef.current.volume = vol;
        }
      }
  }, []);

  const playHitSound = () => hitSoundRef.current?.play().catch(e => console.error(e));
  const playMissSound = () => missSoundRef.current?.play().catch(e => console.error(e));

  const addTarget = useCallback(() => {
    setTargets(prevTargets => {
      if (prevTargets.length >= 10) return prevTargets;
      const newTarget: Target = {
        id: Date.now() + Math.random(),
        x: Math.random() * (GAME_WIDTH - 60) + 30,
        y: Math.random() * (GAME_HEIGHT - 60) + 30,
        size: Math.random() * 30 + 30, // size between 30 and 60
      };
      return [...prevTargets, newTarget];
    });
  }, []);

  const startGame = useCallback(() => {
    setScore(0);
    setGameOver(false);
    setTimeLeft(30);
    setTargets([]);
    setBulletHoles([]);
    for(let i=0; i<5; i++) {
        setTimeout(addTarget, i * 500);
    }
  }, [addTarget]);

  useEffect(() => {
    startGame();
  }, [startGame]);

  useEffect(() => {
    if (!gameOver) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setGameOver(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      const targetInterval = setInterval(addTarget, 1200);

      return () => {
        clearInterval(timer);
        clearInterval(targetInterval);
      };
    }
  }, [gameOver, addTarget]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (gameOver) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let hit = false;
    setTargets(prevTargets =>
      prevTargets.filter(target => {
        const distance = Math.sqrt(Math.pow(x - target.x, 2) + Math.pow(y - target.y, 2));
        if (distance < target.size / 2) {
          hit = true;
          setScore(prevScore => prevScore + 10);
          return false; // Remove target
        }
        return true;
      })
    );
    
    setBulletHoles(prev => [...prev, { id: Date.now(), x, y }]);
    setTimeout(() => {
        setBulletHoles(prev => prev.slice(1));
    }, 1000);

    if (hit) {
      playHitSound();
      addTarget();
    } else {
      playMissSound();
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="mb-4 flex justify-between items-center">
          <Button asChild variant="ghost" className="text-muted-foreground">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> প্রধান মেনু
            </Link>
          </Button>
          <div className="flex gap-4">
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
            <Card className="bg-card/80 backdrop-blur-sm">
                 <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                        <Trophy className="h-6 w-6 text-primary" />
                        <div>
                            <p className="text-xs text-muted-foreground">সময় বাকি</p>
                            <div className="text-xl font-bold">{timeLeft}s</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-2">
            <div
              className="relative bg-muted/20 border-2 border-primary/20 overflow-hidden cursor-crosshair"
              style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
              onClick={handleCanvasClick}
            >
              {targets.map(target => (
                <div
                  key={target.id}
                  className="absolute bg-red-500 rounded-full border-4 border-white flex items-center justify-center"
                  style={{
                    left: target.x - target.size / 2,
                    top: target.y - target.size / 2,
                    width: target.size,
                    height: target.size,
                  }}
                >
                    <div className="w-1/3 h-1/3 bg-white rounded-full" />
                </div>
              ))}
               {bulletHoles.map(hole => (
                <div key={hole.id} className="absolute w-4 h-4 bg-black/50 rounded-full -translate-x-1/2 -translate-y-1/2" style={{ left: hole.x, top: hole.y}}/>
              ))}

              {gameOver && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/70">
                  <div className="text-center text-white">
                    <h2 className="text-4xl font-bold mb-4">গেম ওভার!</h2>
                    <p className="text-2xl mb-4">আপনার চূড়ান্ত স্কোর: {score}</p>
                    <Button onClick={startGame} size="lg">
                      <RefreshCw className="mr-2 h-5 w-5" />
                      আবার খেলুন
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <p className="text-center text-muted-foreground mt-4">
          টার্গেটে ক্লিক করে পয়েন্ট অর্জন করুন।
        </p>
      </div>
    </main>
  );
};

export default ShootingGalleryPage;
