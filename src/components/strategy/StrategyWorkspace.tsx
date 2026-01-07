import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  RefreshCw,
  Send,
  Sparkles,
  User,
  Loader2,
  Zap,
} from "lucide-react";
import { useStrategy } from "@/contexts/StrategyContext";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";

const quickPrompts = [
  { label: "Shorten to <15s plan", message: "Create a plan to shorten my videos to under 15 seconds" },
  { label: "Improve repost rate", message: "How can I improve my repost/share rate?" },
  { label: "TikTok hook variants", message: "Generate TikTok-optimized hooks for my niche based on the strategy" },
  { label: "Content cadence plan", message: "Create a detailed content cadence and posting schedule" },
  { label: "Daily checklist", message: "Turn the action plan into a daily checklist I can follow" },
  { label: "Generate 10 scripts", message: "Generate 10 short-form script variants based on my strategy" },
];

const actionButtons = [
  { label: "🎬 Generate TikTok-Optimized Hooks", message: "Generate TikTok-optimized hooks for my niche based on the strategy" },
  { label: "💡 Create Question Hook Variants", message: "Create question hook variants based on competitor success patterns" },
  { label: "📝 Regenerate 5 Short-Form Scripts", message: "Regenerate 5 short-form script variants optimized for under 15 seconds" },
  { label: "🧪 Generate A/B Test Variants", message: "Generate A/B test variants for my content strategy" },
];

export function StrategyWorkspace() {
  const {
    getActiveSession,
    activeSessionId,
    isStreaming,
    regenerateStrategy,
    sendUserMessage,
    createSession,
  } = useStrategy();

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const activeSession = getActiveSession();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages]);

  const handleSend = () => {
    if (!inputValue.trim() || !activeSessionId || isStreaming) return;
    sendUserMessage(activeSessionId, inputValue.trim());
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickPrompt = (message: string) => {
    if (!activeSessionId || isStreaming) return;
    sendUserMessage(activeSessionId, message);
  };

  const handleExportPDF = () => {
    // In a real implementation, this would call an API to generate PDF
    window.print();
  };

  // Empty state - no session selected
  if (!activeSession) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background">
        <div className="max-w-md text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Marketing Strategy Workspace
            </h2>
            <p className="text-muted-foreground">
              Generate personalized marketing strategies based on your account analytics and competitor data. Get actionable insights, SWOT analysis, and 90-day action plans.
            </p>
          </div>
          <Button size="lg" className="gap-2" onClick={createSession}>
            <Sparkles className="w-5 h-5" />
            Generate Your First Strategy
          </Button>
          <p className="text-xs text-muted-foreground">
            Or select an existing session from the sidebar
          </p>
        </div>
      </div>
    );
  }

  // Check if no accounts connected (mock check)
  const hasConnectedAccounts = true; // In real app, check from context/API

  if (!hasConnectedAccounts) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-background">
        <div className="max-w-md text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Connect an Account First
            </h2>
            <p className="text-muted-foreground">
              To generate a marketing strategy, you need to connect at least one social media account.
            </p>
          </div>
          <Button size="lg" asChild>
            <Link to="/my-accounts">Connect an Account</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{activeSession.title}</h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Version {activeSession.currentVersion}</span>
              <span>•</span>
              <span>{activeSession.platformScope.join(", ")}</span>
              <span>•</span>
              <span>{activeSession.dateRange}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => regenerateStrategy(activeSession.id)}
            disabled={isStreaming}
          >
            <RefreshCw className={cn("w-4 h-4", isStreaming && "animate-spin")} />
            Regenerate
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleExportPDF}
          >
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="max-w-4xl mx-auto space-y-6">
          {activeSession.messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
              )}

              <div
                className={cn(
                  "rounded-2xl max-w-[85%]",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground px-4 py-3"
                    : "bg-card border border-border px-5 py-4"
                )}
              >
                {message.metadata?.versionNumber && (
                  <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary">
                    Strategy v{message.metadata.versionNumber}
                  </Badge>
                )}

                {message.role === "assistant" ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown
                      components={{
                        h2: ({ children }) => (
                          <h2 className="text-lg font-semibold mt-4 mb-2 first:mt-0">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-base font-semibold mt-3 mb-2">
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p className="text-sm text-foreground mb-2 last:mb-0">
                            {children}
                          </p>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-foreground">
                            {children}
                          </strong>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside space-y-1 text-sm mb-2">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal list-inside space-y-1 text-sm mb-2">
                            {children}
                          </ol>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-primary/30 pl-4 py-2 my-3 bg-primary/5 rounded-r-lg text-sm">
                            {children}
                          </blockquote>
                        ),
                        hr: () => <hr className="my-4 border-border" />,
                        table: ({ children }) => (
                          <div className="overflow-x-auto my-3">
                            <table className="w-full text-sm border-collapse">
                              {children}
                            </table>
                          </div>
                        ),
                        th: ({ children }) => (
                          <th className="border border-border bg-muted px-3 py-2 text-left font-medium">
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td className="border border-border px-3 py-2">
                            {children}
                          </td>
                        ),
                        code: ({ children, className }) => {
                          const isInline = !className;
                          return isInline ? (
                            <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
                              {children}
                            </code>
                          ) : (
                            <code className="block bg-muted p-3 rounded-lg text-xs font-mono overflow-x-auto">
                              {children}
                            </code>
                          );
                        },
                        pre: ({ children }) => (
                          <pre className="bg-muted rounded-lg my-2 overflow-x-auto">
                            {children}
                          </pre>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>

                    {/* Action buttons after strategy messages */}
                    {message.metadata?.versionNumber && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-xs text-muted-foreground mb-3">
                          Quick actions based on this strategy:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {actionButtons.map((action) => (
                            <Button
                              key={action.label}
                              variant="outline"
                              size="sm"
                              className="text-xs hover:bg-primary/10 hover:border-primary/30"
                              onClick={() => handleQuickPrompt(action.message)}
                              disabled={isStreaming}
                            >
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
              </div>

              {message.role === "user" && (
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}

          {isStreaming && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-card border border-border rounded-2xl px-5 py-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing your data and generating insights...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Composer */}
      <div className="p-4 border-t border-border bg-card">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* Quick prompts */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Zap className="w-4 h-4 text-primary flex-shrink-0" />
            {quickPrompts.map((prompt) => (
              <Button
                key={prompt.label}
                variant="outline"
                size="sm"
                className="text-xs whitespace-nowrap hover:bg-primary/10 hover:border-primary/30"
                onClick={() => handleQuickPrompt(prompt.message)}
                disabled={isStreaming}
              >
                {prompt.label}
              </Button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-3">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a follow-up question or request refinements..."
              className="min-h-[52px] max-h-32 resize-none"
              disabled={isStreaming}
            />
            <Button
              size="icon"
              className="h-[52px] w-[52px]"
              onClick={handleSend}
              disabled={!inputValue.trim() || isStreaming}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
