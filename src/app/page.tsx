
import { Button } from "@/components/ui/button";
import { LogOut, Settings, Swords, Puzzle, Gem, X, Brain } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center text-foreground overflow-hidden">
      <Image
        src="https://picsum.photos/id/1015/1920/1080"
        alt="Light abstract background"
        data-ai-hint="light abstract"
        fill
        className="object-cover z-0"
      />
      <div className="absolute inset-0 bg-background/80 z-10" />
      <div className="z-20 flex flex-col items-center gap-8 text-center px-4">
        <h1 className="text-7xl md:text-9xl font-headline tracking-tighter uppercase drop-shadow-lg" style={{ WebkitTextStroke: '2px hsl(var(--primary))', color: 'transparent' }}>
          আয়রনক্ল্যাড
        </h1>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <Button asChild size="lg" className="text-lg py-8">
            <Link href="/hud">
              <Swords className="mr-2 h-6 w-6" /> সাপের গেম
            </Link>
          </Button>
           <Button asChild size="lg" className="text-lg py-8">
            <Link href="/puzzle">
              <Puzzle className="mr-2 h-6 w-6" /> মেমরি গেম
            </Link>
          </Button>
          <Button asChild size="lg" className="text-lg py-8">
            <Link href="/match-three">
              <Gem className="mr-2 h-6 w-6" /> ম্যাচ-থ্রি গেম
            </Link>
          </Button>
          <Button asChild size="lg" className="text-lg py-8">
            <Link href="/tic-tac-toe">
              <X className="mr-2 h-6 w-6" /> টিক-ট্যাক-টো
            </Link>
          </Button>
          <Button asChild size="lg" className="text-lg py-8">
            <Link href="/sudoku">
              <Brain className="mr-2 h-6 w-6" /> সুডোকু
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="text-lg py-8">
            <Link href="/options">
              <Settings className="mr-2 h-6 w-6" /> অপশনস
            </Link>
          </Button>
          <Button variant="secondary" size="lg" className="text-lg py-8" disabled>
            <LogOut className="mr-2 h-6 w-6" /> প্রস্থান
          </Button>
        </div>
      </div>
    </main>
  );
}
