import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

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

function Keybind({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-block rounded-md border bg-muted px-3 py-1.5 text-sm font-semibold text-foreground">
      {children}
    </div>
  );
}

export default function OptionsPage() {
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
                <TabsTrigger value="graphics" disabled>গ্রাফিক্স</TabsTrigger>
                <TabsTrigger value="audio" disabled>অডিও</TabsTrigger>
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
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
