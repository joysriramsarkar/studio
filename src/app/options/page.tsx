
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Palette, Music } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";

const controls = [
  { action: "সামনে এগোন", key: "W" },
  { action: "পিছনে যান", key: "S" },
  { action: "বামে যান", key: "A" },
  { action: "ডানে যান", key: "D" },
  { action: "লাফ দিন", key: "Spacebar" },
  { action: "দৌড়ান", key: "Shift" },
  { action: "গুলি করুন", key: "Left Mouse" },
  { action: "এইম ডাউন সাইটস", key: "Right Mouse" },
  { action: "রিলোড", key: "R" },
  { action: "অস্ত্র পরিবর্তন", key: "Q" },
  { action: "ইন্টারঅ্যাক্ট", key: "E" },
];

const themes = [
    { name: 'ডিফল্ট', className: 'theme-default', colors: { primary: 'hsl(217.2, 91.2%, 59.8%)', background: 'hsl(222.2, 84%, 4.9%)' } },
    { name: 'ফরেস্ট', className: 'theme-forest', colors: { primary: 'hsl(142.1, 76.2%, 36.3%)', background: 'hsl(222.2, 84%, 4.9%)' } },
    { name: 'রোজ', className: 'theme-rose', colors: { primary: 'hsl(346.8, 77.2%, 49.8%)', background: 'hsl(222.2, 84%, 4.9%)' } },
    { name: 'অরেঞ্জ', className: 'theme-orange', colors: { primary: 'hsl(24.6, 95%, 53.1%)', background: 'hsl(222.2, 84%, 4.9%)' } },
];

function Keybind({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-block rounded-md border bg-muted px-3 py-1.5 text-sm font-semibold text-foreground">
      {children}
    </div>
  );
}

export default function OptionsPage() {

  const [volume, setVolume] = useState(50);
  const [activeTheme, setActiveTheme] = useState('theme-default');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'theme-default';
    setActiveTheme(savedTheme);
    document.documentElement.className = 'dark';
    document.documentElement.classList.add(savedTheme);

    const savedVolume = localStorage.getItem('volume');
    if (savedVolume) {
        setVolume(Number(savedVolume));
    }
  }, []);

  const handleThemeChange = (themeClassName: string) => {
    document.documentElement.classList.remove(activeTheme);
    document.documentElement.classList.add(themeClassName);
    localStorage.setItem('theme', themeClassName);
    setActiveTheme(themeClassName);
  }

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0]);
    localStorage.setItem('volume', String(newVolume[0]));
  }


  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-4xl">
        <div className="mb-4">
          <Button asChild variant="ghost" className="text-muted-foreground">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> প্রধান মেনুতে ফিরে যান
            </Link>
          </Button>
        </div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">অপশনস</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="controls" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="controls">কন্ট্রোলস</TabsTrigger>
                <TabsTrigger value="graphics">গ্রাফিক্স</TabsTrigger>
                <TabsTrigger value="audio">অডিও</TabsTrigger>
              </TabsList>
              <TabsContent value="controls" className="pt-6">
                <h3 className="text-xl font-semibold mb-4">কী বাইন্ডিং</h3>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>অ্যাকশন</TableHead>
                        <TableHead className="text-right">কী</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {controls.map((control, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{control.action}</TableCell>
                          <TableCell className="text-right">
                            <Keybind>{control.key}</Keybind>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="graphics" className="pt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Palette/> থিম</CardTitle>
                    <CardDescription>আপনার পছন্দের রঙ নির্বাচন করুন।</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {themes.map(theme => (
                      <div key={theme.name} >
                        <Button
                          variant={activeTheme === theme.className ? 'default' : 'outline'}
                          onClick={() => handleThemeChange(theme.className)}
                          className="w-full"
                        >
                            <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: theme.colors.primary }} />
                          {theme.name}
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="audio" className="pt-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Music/> অডিও</CardTitle>
                        <CardDescription>গেমের সাউন্ড নিয়ন্ত্রণ করুন।</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="volume" className="block text-sm font-medium text-muted-foreground mb-2">মাস্টার ভলিউম</label>
                                <div className="flex items-center gap-4">
                                    <Slider
                                        id="volume"
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={[volume]}
                                        onValueChange={handleVolumeChange}
                                    />
                                    <span className="text-sm font-semibold w-12 text-right">{volume}%</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                 </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
