import { Sidebar } from "@/components/Sidebar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Wrench,
  FileText,
  MessageSquare,
  Lightbulb,
  Captions,
  BarChart3,
  Loader2,
  Copy,
  Download,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VideoInWork {
  id: string;
  coverUrl: string;
  username: string;
  virality: number;
  views: number;
  likes: number;
}

interface AIModal {
  type: "script" | "caption" | "hooks" | "subtitles" | "variants" | null;
  videoId: string | null;
  data?: any;
}

const InWork = () => {
  const { toast } = useToast();
  const [videos] = useState<VideoInWork[]>([
    {
      id: "1",
      coverUrl: "/placeholder.svg",
      username: "creator_pro",
      virality: 87,
      views: 245000,
      likes: 18500,
    },
    {
      id: "2",
      coverUrl: "/placeholder.svg",
      username: "viral_maker",
      virality: 92,
      views: 512000,
      likes: 42300,
    },
  ]);

  const [aiModal, setAiModal] = useState<AIModal>({ type: null, videoId: null });
  const [loading, setLoading] = useState(false);

  const handleAIAction = (
    type: "script" | "caption" | "hooks" | "subtitles" | "variants",
    videoId: string
  ) => {
    setLoading(true);
    setAiModal({ type, videoId });

    // Simulate AI generation
    setTimeout(() => {
      let data: any = {};
      
      switch (type) {
        case "script":
          data = {
            variants: [
              {
                length: "Short (15-30s)",
                text: "HOOK: Stop scrolling if you want to grow faster.\n\nPROBLEM: Most creators waste months creating content that doesn't convert.\n\nSOLUTION: I'll show you the exact 3-step framework I used to go from 0 to 100K in 90 days.\n\nCTA: Follow for more viral growth strategies.",
              },
              {
                length: "Medium (30-60s)",
                text: "HOOK: I wish someone told me this when I started.\n\nSTORY: Two years ago, I was posting 5 times a day with zero results. Then I discovered this pattern in viral content.\n\nBREAKDOWN: Every viral video has these 3 elements: Pattern interruption in the first 3 seconds, emotional storytelling in the middle, and a curiosity gap that makes people watch till the end.\n\nRESULTS: After applying this, my engagement went up 400%.\n\nCTA: Save this for later and follow for more.",
              },
              {
                length: "Long (60-90s)",
                text: "HOOK: The algorithm doesn't want you to see this.\n\nCONTEXT: I analyzed 500 viral videos from top creators in your niche. Here's what they all have in common.\n\nPOINT 1: They use pattern interruption - something unexpected in the first frame.\n\nPOINT 2: They build curiosity loops throughout the video.\n\nPOINT 3: They end with a strong hook to the next video.\n\nEXAMPLES: Let me break down 3 real examples...\n\nAPPLICATION: Here's how you can use this today.\n\nCTA: Drop a 🔥 if you want part 2.",
              },
            ],
          };
          break;
        case "caption":
          data = {
            variants: [
              "🚀 Stop wasting time on content that doesn't convert.\n\nI analyzed 100+ viral videos and found the ONE pattern that works every time.\n\nHere's what most creators miss (thread 🧵)\n\n#contentcreator #viral #marketingstrategy",
              "The algorithm changed everything last week.\n\nBut 99% of creators still don't know about it.\n\nSave this before it gets taken down 👇\n\n#socialmedia #growth #contentmarketing",
              "I spent $10K learning this so you don't have to.\n\nThe 3-step viral content formula:\n\n1. Hook in 3 seconds\n2. Value in the middle\n3. CTA that converts\n\nFollow for more 💡\n\n#creator #viralgrowth #contentstrategy",
            ],
          };
          break;
        case "hooks":
          data = {
            hooks: [
              "Stop scrolling if you want to grow faster",
              "This one mistake is killing your engagement",
              "I wish I knew this 2 years ago",
              "The algorithm doesn't want you to see this",
              "99% of creators get this wrong",
            ],
          };
          break;
        case "subtitles":
          data = {
            srt: "1\n00:00:00,000 --> 00:00:03,000\nHey everyone, welcome back\n\n2\n00:00:03,000 --> 00:00:07,000\nToday I'm sharing the strategy that changed everything\n\n3\n00:00:07,000 --> 00:00:11,000\nMost people get this completely wrong\n\n4\n00:00:11,000 --> 00:00:15,000\nHere's what you need to know\n\n5\n00:00:15,000 --> 00:00:19,000\nFirst, focus on your hook\n\n6\n00:00:19,000 --> 00:00:23,000\nThen build curiosity throughout\n\n7\n00:00:23,000 --> 00:00:27,000\nAnd finish with a strong call to action",
          };
          break;
        case "variants":
          data = {
            variants: [
              "Version A: Start with a shocking stat that stops the scroll. Build tension through the middle by showing the problem. End with your unique solution.",
              "Version B: Open with a relatable pain point. Share your personal transformation story. Give 3 actionable steps they can implement today.",
              "Version C: Use pattern interruption with an unexpected question. Create multiple curiosity gaps. Finish with a cliffhanger to the next video.",
              "Version D: Begin with social proof (testimonial or result). Break down your framework step-by-step. Close with a clear next action.",
              "Version E: Hook with contrarian opinion. Challenge common beliefs in your niche. Provide evidence and call-to-action.",
            ],
          };
          break;
      }

      setAiModal({ type, videoId, data });
      setLoading(false);
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
    });
  };

  const downloadSRT = (srt: string) => {
    const blob = new Blob([srt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subtitles.srt";
    a.click();
    toast({
      title: "Downloaded",
      description: "Subtitles file has been downloaded",
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-[1600px] mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Wrench className="h-8 w-8 text-primary" />
              In Work
            </h1>
            <p className="text-lg text-muted-foreground">
              AI-powered creative workspace for content regeneration
            </p>
          </div>

          {/* Table */}
          <Card className="border-border shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cover</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="text-right">Virality</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                    <TableHead className="text-right">Likes</TableHead>
                    <TableHead className="text-center">AI Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {videos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center">
                        <p className="text-muted-foreground">
                          No videos in workspace. Add videos from Video Analysis.
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    videos.map((video) => (
                      <TableRow key={video.id}>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {video.id}
                        </TableCell>
                        <TableCell>
                          <img
                            src={video.coverUrl}
                            alt="Cover"
                            className="w-20 h-20 object-cover rounded"
                          />
                        </TableCell>
                        <TableCell className="font-semibold">
                          @{video.username}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            {video.virality}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {formatNumber(video.views)}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {formatNumber(video.likes)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2 flex-wrap">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover:border-primary/40"
                              onClick={() => handleAIAction("script", video.id)}
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              Script
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover:border-primary/40"
                              onClick={() => handleAIAction("caption", video.id)}
                            >
                              <MessageSquare className="h-3 w-3 mr-1" />
                              Caption
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover:border-primary/40"
                              onClick={() => handleAIAction("hooks", video.id)}
                            >
                              <Lightbulb className="h-3 w-3 mr-1" />
                              Hooks
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover:border-primary/40"
                              onClick={() => handleAIAction("subtitles", video.id)}
                            >
                              <Captions className="h-3 w-3 mr-1" />
                              Subtitles
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover:border-primary/40"
                              onClick={() => handleAIAction("variants", video.id)}
                            >
                              <BarChart3 className="h-3 w-3 mr-1" />
                              A/B
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </main>

      {/* AI Modals */}
      <Dialog
        open={!!aiModal.type}
        onOpenChange={() => setAiModal({ type: null, videoId: null })}
      >
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {aiModal.type === "script" && <FileText className="h-5 w-5 text-primary" />}
              {aiModal.type === "caption" && <MessageSquare className="h-5 w-5 text-primary" />}
              {aiModal.type === "hooks" && <Lightbulb className="h-5 w-5 text-primary" />}
              {aiModal.type === "subtitles" && <Captions className="h-5 w-5 text-primary" />}
              {aiModal.type === "variants" && <BarChart3 className="h-5 w-5 text-primary" />}
              {aiModal.type === "script" && "Regenerate Script"}
              {aiModal.type === "caption" && "Regenerate Caption"}
              {aiModal.type === "hooks" && "Generate Hooks"}
              {aiModal.type === "subtitles" && "Generate Subtitles"}
              {aiModal.type === "variants" && "A/B Variants"}
            </DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">
                AI is generating content...
              </span>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Script Variants */}
              {aiModal.type === "script" && aiModal.data?.variants && (
                <Tabs defaultValue="0" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    {aiModal.data.variants.map((variant: any, idx: number) => (
                      <TabsTrigger key={idx} value={idx.toString()}>
                        {variant.length}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {aiModal.data.variants.map((variant: any, idx: number) => (
                    <TabsContent key={idx} value={idx.toString()} className="space-y-3">
                      <Textarea
                        value={variant.text}
                        readOnly
                        className="min-h-[300px] font-mono text-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => copyToClipboard(variant.text)}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                        <Button size="sm" variant="outline">
                          Use This Script
                        </Button>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              )}

              {/* Caption Variants */}
              {aiModal.type === "caption" && aiModal.data?.variants && (
                <div className="space-y-3">
                  {aiModal.data.variants.map((caption: string, idx: number) => (
                    <Card key={idx} className="p-4 border-border">
                      <p className="text-sm mb-3 whitespace-pre-wrap">{caption}</p>
                      <Button
                        size="sm"
                        onClick={() => copyToClipboard(caption)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </Card>
                  ))}
                </div>
              )}

              {/* Hooks */}
              {aiModal.type === "hooks" && aiModal.data?.hooks && (
                <div className="space-y-2">
                  {aiModal.data.hooks.map((hook: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border"
                    >
                      <span className="text-sm font-medium">{hook}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(hook)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Subtitles */}
              {aiModal.type === "subtitles" && aiModal.data?.srt && (
                <div className="space-y-3">
                  <Textarea
                    value={aiModal.data.srt}
                    readOnly
                    className="min-h-[300px] font-mono text-xs"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => downloadSRT(aiModal.data.srt)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download .srt
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(aiModal.data.srt)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
              )}

              {/* A/B Variants */}
              {aiModal.type === "variants" && aiModal.data?.variants && (
                <div className="space-y-3">
                  {aiModal.data.variants.map((variant: string, idx: number) => (
                    <Card key={idx} className="p-4 border-border">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="secondary">Variant {String.fromCharCode(65 + idx)}</Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(variant)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm">{variant}</p>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InWork;
