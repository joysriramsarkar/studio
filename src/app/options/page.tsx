import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const controls = [
  { action: "Move Forward", key: "W" },
  { action: "Move Backward", key: "S" },
  { action: "Strafe Left", key: "A" },
  { action: "Strafe Right", key: "D" },
  { action: "Jump", key: "Spacebar" },
  { action: "Sprint", key: "Shift" },
  { action: "Fire", key: "Left Mouse" },
  { action: "Aim Down Sights", key: "Right Mouse" },
  { action: "Reload", key: "R" },
  { action: "Switch Weapon", key: "Q" },
  { action: "Interact", key: "E" },
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
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Main Menu
            </Link>
          </Button>
        </div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Options</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="controls" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="controls">Controls</TabsTrigger>
                <TabsTrigger value="graphics" disabled>Graphics</TabsTrigger>
                <TabsTrigger value="audio" disabled>Audio</TabsTrigger>
              </TabsList>
              <TabsContent value="controls" className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Key Bindings</h3>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Action</TableHead>
                        <TableHead className="text-right">Key</TableHead>
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
