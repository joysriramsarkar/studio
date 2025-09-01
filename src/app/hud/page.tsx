'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Crosshair, Heart, Target, Play, Clock, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

interface TargetProps {
  id: number;
  x: number;
  y: number;
}

interface HitEffectProps {
  id: number;
  x: number;
  y: number;
}

function BulletHole({ x, y }: { x: number, y: number }) {
  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-ping"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div className="w-3 h-3 bg-yellow-400 rounded-full opacity-75"></div>
    </div>
  )
}

export default function HUDPage() {
  const [score, setScore] = useState(0);
  const [targets, setTargets] = useState<TargetProps[]>([]);
  const [hitEffects, setHitEffects] = useState<HitEffectProps[]>([]);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const startGame = () => {
    setScore(0);
    setTargets([]);
    setHitEffects([]);
    setTimeLeft(30);
    setGameActive(true);
  };

  const handleTargetClick = (target: TargetProps) => {
    if (!gameActive) return;
    setScore((prevScore) => prevScore + 10);
    setTargets((prevTargets) => prevTargets.filter((t) => t.id !== target.id));
    
    const newHit: HitEffectProps = { id: Date.now(), x: target.x, y: target.y };
    setHitEffects(prev => [...prev, newHit]);

    setTimeout(() => {
      setHitEffects(prev => prev.filter(h => h.id !== newHit.id));
    }, 300);
  };

  const createTarget = useCallback(() => {
    const newTarget: TargetProps = {
      id: Date.now(),
      x: Math.random() * 85, 
      y: Math.random() * 70, 
    };
    setTargets((prevTargets) => [...prevTargets, newTarget]);
  }, []);

  useEffect(() => {
    if (gameActive) {
      const gameTimer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(gameTimer);
            clearInterval(targetInterval);
            setGameActive(false);
            setTargets([]);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const targetInterval = setInterval(() => {
        createTarget();
      }, 1200);

      return () => {
        clearInterval(gameTimer);
        clearInterval(targetInterval);
      };
    }
  }, [gameActive, createTarget]);
  
  useEffect(() => {
    const cleanupTargets = () => {
      const now = Date.now();
      setTargets(prevTargets => prevTargets.filter(t => (now - t.id) < 2000));
    };

    if(gameActive) {
        const interval = setInterval(cleanupTargets, 500);
        return () => clearInterval(interval);
    }
  }, [gameActive]);


  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <Image
        src="https://picsum.photos/1920/1080"
        alt="In-game view"
        data-ai-hint="first person shooter game"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/10" />

      {/* Hit Effects */}
      {hitEffects.map((hit) => (
         <BulletHole key={hit.id} x={hit.x} y={hit.y} />
      ))}


      {/* Targets */}
      {targets.map((target) => (
        <div
          key={target.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          style={{ left: `${target.x}%`, top: `${target.y}%` }}
          onClick={() => handleTargetClick(target)}
        >
          <Target className="h-10 w-10 text-red-500 animate-pulse" />
        </div>
      ))}

      {/* Back Button */}
      <div className="absolute top-4 left-4 z-10">
        <Button asChild variant="secondary">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> প্রধান মেনু
          </Link>
        </Button>
      </div>
      
      {/* Customize Weapon Button */}
       <div className="absolute top-4 right-4 z-10">
        <Button asChild>
          <Link href="/customization">
            <Target className="mr-2 h-4 w-4" /> অস্ত্র কাস্টমাইজ করুন
          </Link>
        </Button>
      </div>

      {/* Game UI */}
      {!gameActive && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/50">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">
              {timeLeft === 0 ? "গেম ওভার!" : "টার্গেট প্র্যাকটিস"}
            </h2>
            {timeLeft === 0 && (
              <p className="text-2xl mb-4">আপনার স্কোর: {score}</p>
            )}
            <Button onClick={startGame} size="lg">
              <Play className="mr-2 h-5 w-5" />
              {timeLeft === 0 ? "আবার খেলুন" : "খেলা শুরু করুন"}
            </Button>
          </div>
        </div>
      )}

      {/* HUD Elements */}
      <div className="absolute bottom-6 left-6 z-10 grid gap-4">
        <Card className="bg-card/80 backdrop-blur-sm w-64">
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-primary" />
                <div className="flex-grow">
                    <p className="text-xs text-muted-foreground">বাকি সময়</p>
                    <div className="text-2xl font-bold">{timeLeft}s</div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-muted-foreground">স্কোর</p>
                    <div className="text-2xl font-bold">{score}</div>
                </div>
                </div>
            </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm w-64">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-primary" />
              <div className="flex-grow">
                <p className="text-xs text-muted-foreground">স্বাস্থ্য</p>
                <Progress value={85} className="h-3" />
              </div>
              <span className="text-xl font-bold">৮৫</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="absolute bottom-6 right-6 z-10">
        <Card className="bg-card/80 backdrop-blur-sm w-64">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="text-right flex-grow">
                <p className="text-xs text-muted-foreground">অ্যামো</p>
                <div className="text-4xl font-black tracking-tighter">
                  <span className="text-primary">২৮</span>
                  <span className="text-2xl text-muted-foreground">/ ১২০</span>
                </div>
              </div>
              <Crosshair className="h-10 w-10 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
