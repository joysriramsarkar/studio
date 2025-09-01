'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getSuggestions } from './actions';
import type { WeaponCustomizationOutput } from '@/ai/flows/weapon-customization-suggestions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, Aperture, GitMerge, Pointer, Search, SlidersHorizontal, Target } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  weaponType: z.string().min(1, 'Please select a weapon type.'),
  playStyle: z.string().min(1, 'Please select a play style.'),
});

type FormData = z.infer<typeof formSchema>;

const weaponTypes = ['অ্যাসল্ট রাইফেল', 'এসএমজি', 'স্নাইপার রাইফেল', 'শটগান', 'এলএমজি', 'পিস্তল'];
const playStyles = ['আগ্রাসী', 'স্টিলথি', 'লং রেঞ্জ', 'রান অ্যান্ড গান', 'সাপোর্ট', 'ডিফেন্সিভ'];

const attachmentIcons: { [key: string]: React.ElementType } = {
  optic: Aperture,
  barrel: SlidersHorizontal,
  muzzle: Pointer,
  underbarrel: GitMerge,
  magazine: SlidersHorizontal,
  stock: SlidersHorizontal,
  grip: GitMerge,
  laser: Pointer,
  default: Search,
};

const getAttachmentIcon = (attachmentName: string) => {
  const lowerCaseName = attachmentName.toLowerCase();
  for (const key in attachmentIcons) {
    if (lowerCaseName.includes(key)) {
      return attachmentIcons[key];
    }
  }
  return attachmentIcons.default;
};

export default function WeaponCustomizationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<WeaponCustomizationOutput['suggestions']>([]);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weaponType: '',
      playStyle: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setSuggestions([]);
    try {
      const result = await getSuggestions(data);
      if (result.error) {
        throw new Error(result.error);
      }
      setSuggestions(result.suggestions || []);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error generating suggestions',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen container mx-auto p-4 sm:p-8">
       <div className="mb-4">
        <Button asChild variant="ghost" className="text-muted-foreground">
          <Link href="/hud">
            <ArrowLeft className="mr-2 h-4 w-4" /> গেমে ফিরে যান
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>অস্ত্র লোডআউট এআই</CardTitle>
            <CardDescription>আপনার খেলার স্টাইলের জন্য AI-চালিত অ্যাটাচমেন্ট সাজেশন পান।</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="weaponType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>অস্ত্রের প্রকার</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="একটি অস্ত্র নির্বাচন করুন" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {weaponTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="playStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>খেলার স্টাইল</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="আপনার স্টাইল নির্বাচন করুন" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {playStyles.map((style) => (
                            <SelectItem key={style} value={style}>
                              {style}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                  সাজেশন তৈরি করুন
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 w-1/2 bg-muted rounded-md" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 w-full bg-muted rounded-md mb-2" />
                    <div className="h-4 w-3/4 bg-muted rounded-md" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && suggestions.length > 0 && (
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">প্রস্তাবিত লোডআউট</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.map((suggestion, index) => {
                    const Icon = getAttachmentIcon(suggestion.attachment);
                    return (
                    <Card key={index} className="flex flex-col">
                        <CardHeader>
                        <div className="flex items-center gap-3">
                            <Icon className="h-6 w-6 text-primary" />
                            <CardTitle>{suggestion.attachment}</CardTitle>
                        </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                        <p className="text-muted-foreground">{suggestion.reason}</p>
                        </CardContent>
                    </Card>
                    );
                })}
                </div>
            </div>
          )}

          {!isLoading && suggestions.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-full">
              <Target className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">আপনার সাজেশন এখানে দেখা যাবে</h3>
              <p className="text-muted-foreground">শুরু করার জন্য আপনার অস্ত্র এবং খেলার স্টাইল নির্বাচন করুন।</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
