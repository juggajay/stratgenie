"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSelectedScheme } from "@/hooks/use-selected-scheme";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Shield,
  Send,
  Loader2,
  ChevronDown,
  ChevronUp,
  User,
  X,
  ExternalLink,
  AlertTriangle,
  FileText,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "guardian";
  content: string;
  citations?: {
    text: string;
    sectionHeader?: string;
    score: number;
  }[];
  timestamp: Date;
}

export function GuardianFab() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCitations, setExpandedCitations] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { selectedSchemeId } = useSelectedScheme();

  // Check if bylaws are uploaded for the selected scheme
  const bylaw = useQuery(
    api.guardian.getActiveBylaw,
    selectedSchemeId ? { schemeId: selectedSchemeId } : "skip"
  );

  const askGuardian = useAction(api.actions.guardian.askGuardian);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !selectedSchemeId) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await askGuardian({
        schemeId: selectedSchemeId,
        question: userMessage.content,
      });

      const guardianMessage: Message = {
        id: `guardian-${Date.now()}`,
        role: "guardian",
        content: result.success
          ? (result.answer ?? "No answer provided.")
          : (result.message || "I encountered an error processing your question."),
        citations: result.success ? result.citations : undefined,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, guardianMessage]);
    } catch {
      const errorMessage: Message = {
        id: `guardian-${Date.now()}`,
        role: "guardian",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCitations = (messageId: string) => {
    setExpandedCitations((prev) => {
      const next = new Set(prev);
      if (next.has(messageId)) {
        next.delete(messageId);
      } else {
        next.add(messageId);
      }
      return next;
    });
  };

  const hasBylaws = bylaw && bylaw.status === "ready";

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 bg-[#D97706] hover:bg-[#B45309] text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
        aria-label="Open Guardian assistant"
      >
        <Shield className="h-6 w-6" />
      </button>

      {/* Chat Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md p-0 flex flex-col bg-card"
        >
          {/* Header */}
          <SheetHeader className="px-4 py-3 border-b border-border bg-gradient-to-r from-[#D97706]/10 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#D97706]/10 rounded-lg border border-[#D97706]/30">
                  <Shield className="h-5 w-5 text-[#D97706]" />
                </div>
                <div>
                  <SheetTitle className="font-display font-bold text-foreground text-left">
                    Guardian
                  </SheetTitle>
                  <SheetDescription className="text-xs text-left">
                    AI-powered bylaw Q&A
                  </SheetDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/dashboard/guardian">
                  <Button variant="ghost" size="sm" className="text-xs">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Full Page
                  </Button>
                </Link>
              </div>
            </div>
          </SheetHeader>

          {/* Disclaimer Banner */}
          <div className="px-4 py-2 bg-[#FF6B35]/10 border-b border-[#FF6B35]/20 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-[#FF6B35] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#FF6B35]">
              This is not legal advice. Answers are based on your uploaded bylaws.
            </p>
          </div>

          {/* Content */}
          {!selectedSchemeId ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-[#D97706]/10 flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-[#D97706]/60" />
              </div>
              <p className="font-medium text-foreground mb-2">No scheme selected</p>
              <p className="text-sm text-muted-foreground mb-4">
                Select a scheme from the dashboard to use the Guardian.
              </p>
              <Link href="/dashboard">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          ) : !hasBylaws ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-[#D97706]/10 flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-[#D97706]/60" />
              </div>
              <p className="font-medium text-foreground mb-2">No bylaws uploaded</p>
              <p className="text-sm text-muted-foreground mb-4">
                Upload your bylaws to enable the Guardian assistant.
              </p>
              <Link href="/dashboard/guardian">
                <Button onClick={() => setIsOpen(false)}>
                  Upload Bylaws
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/30">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-12 h-12 rounded-full bg-[#D97706]/10 flex items-center justify-center mb-3">
                      <Shield className="h-6 w-6 text-[#D97706]/60" />
                    </div>
                    <p className="font-medium text-foreground text-sm">Ask the Guardian</p>
                    <p className="text-xs mt-1 text-muted-foreground max-w-[200px]">
                      Ask me anything about your scheme&apos;s bylaws
                    </p>
                    <div className="mt-4 space-y-2 text-xs">
                      <p className="text-muted-foreground">Try asking:</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {["Can I have a pet?", "Parking rules?"].map((q) => (
                          <button
                            key={q}
                            onClick={() => setInput(q)}
                            className="px-2 py-1 bg-card hover:bg-secondary rounded-full text-foreground transition-colors border border-border text-xs"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md"
                          : "bg-card text-foreground rounded-2xl rounded-bl-md border border-[#D97706]/30"
                      }`}
                    >
                      {/* Message header */}
                      <div className={`flex items-center gap-2 px-3 pt-2 pb-1 ${
                        message.role === "user" ? "justify-end" : ""
                      }`}>
                        {message.role === "guardian" && (
                          <Shield className="h-3 w-3 text-[#D97706]" />
                        )}
                        <span className={`text-xs font-medium ${
                          message.role === "user" ? "text-primary-foreground/70" : "text-[#D97706]"
                        }`}>
                          {message.role === "user" ? "You" : "Guardian"}
                        </span>
                        {message.role === "user" && (
                          <User className="h-3 w-3 text-primary-foreground/70" />
                        )}
                      </div>

                      {/* Message content */}
                      <div className="px-3 pb-2">
                        <p className="whitespace-pre-wrap text-xs leading-relaxed">
                          {message.content}
                        </p>
                      </div>

                      {/* Citations */}
                      {message.role === "guardian" && message.citations && message.citations.length > 0 && (
                        <div className="px-3 pb-2">
                          <button
                            onClick={() => toggleCitations(message.id)}
                            className="flex items-center gap-1 text-xs text-[#D97706] hover:text-[#D97706]/80 font-medium"
                          >
                            {expandedCitations.has(message.id) ? (
                              <>
                                <ChevronUp className="h-3 w-3" />
                                Hide ({message.citations.length})
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-3 w-3" />
                                Sources ({message.citations.length})
                              </>
                            )}
                          </button>

                          {expandedCitations.has(message.id) && (
                            <div className="mt-2 space-y-2">
                              {message.citations.map((citation, idx) => (
                                <div
                                  key={idx}
                                  className="bg-secondary border border-[#D97706]/20 rounded-lg p-2"
                                >
                                  {citation.sectionHeader && (
                                    <p className="text-xs font-medium text-[#D97706] mb-1">
                                      {citation.sectionHeader}
                                    </p>
                                  )}
                                  <p className="text-xs text-foreground leading-relaxed line-clamp-3">
                                    {citation.text}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-card rounded-2xl rounded-bl-md px-3 py-2 border border-[#D97706]/30">
                      <div className="flex items-center gap-2">
                        <Shield className="h-3 w-3 text-[#D97706]" />
                        <span className="text-xs font-medium text-[#D97706]">Guardian</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-foreground">
                        <Loader2 className="h-3 w-3 animate-spin text-[#D97706]" />
                        <span>Researching bylaws...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="p-3 border-t border-border bg-card">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about your bylaws..."
                    disabled={isLoading}
                    className="flex-1 px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D97706]/50 focus:border-[#D97706] disabled:bg-secondary/50 disabled:cursor-not-allowed text-sm text-foreground placeholder:text-muted-foreground"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!input.trim() || isLoading}
                    className="bg-[#D97706] hover:bg-[#B45309]"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
