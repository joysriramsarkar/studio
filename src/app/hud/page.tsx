import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Crosshair, Heart, Target } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HUDPage() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <Image
        src="https://picsum.photos/1920/1081"
        alt="In-game view"
        data-ai-hint="first person shooter"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/10" />

      {/* Back Button */}
      <div className="absolute top-4 left-4 z-10">
        <Button asChild variant="secondary">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Main Menu
          </Link>
        </Button>
      </div>
      
      {/* Customize Weapon Button */}
       <div className="absolute top-4 right-4 z-10">
        <Button asChild>
          <Link href="/customization">
            <Target className="mr-2 h-4 w-4" /> Customize Weapon
          </Link>
        </Button>
      </div>

      {/* HUD Elements */}
      <div className="absolute bottom-6 left-6 z-10">
        <Card className="bg-card/80 backdrop-blur-sm w-64">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-primary" />
              <div className="flex-grow">
                <p className="text-xs text-muted-foreground">Health</p>
                <Progress value={85} className="h-3" />
              </div>
              <span className="text-xl font-bold">85</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="absolute bottom-6 right-6 z-10">
        <Card className="bg-card/80 backdrop-blur-sm w-64">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="text-right flex-grow">
                <p className="text-xs text-muted-foreground">Ammo</p>
                <div className="text-4xl font-black tracking-tighter">
                  <span className="text-primary">28</span>
                  <span className="text-2xl text-muted-foreground">/ 120</span>
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
