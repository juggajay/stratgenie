"use client";

import { useState, useRef, useEffect } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, Shield, User, Loader2, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";

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

interface ChatInterfaceProps {
  schemeId: Id<"schemes">;
}

export function ChatInterface({ schemeId }: ChatInterfaceProps) {
  // ALL LOGIC PRESERVED - only styling changes
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCitations, setExpandedCitations] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const askGuardian = useAction(api.actions.guardian.askGuardian);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

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
        schemeId,
        question: userMessage.content,
      });

      const guardianMessage: Message = {
        id: `guardian-${Date.now()}`,
        role: "guardian",
        content: result.success
          ? result.answer
          : result.message || "I encountered an error processing your question.",
        citations: result.success ? result.citations : undefined,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, guardianMessage]);
    } catch (error) {
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

  return (
    <Card className="flex flex-col h-[600px] agent-guardian">
      {/* Header - Guardian terracotta theme */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-gradient-to-r from-guardian/10 to-transparent">
        <div className="p-2 bg-guardian/10 rounded-lg border border-guardian/30">
          <Shield className="h-5 w-5 text-guardian" />
        </div>
        <div>
          <h3 className="font-display font-bold text-foreground">Ask the Guardian</h3>
          <p className="text-xs text-muted-foreground">AI-powered bylaw Q&A</p>
        </div>
      </div>

      {/* Disclaimer Banner */}
      <div className="px-4 py-2 bg-persimmon/10 border-b border-persimmon/20 flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 text-persimmon flex-shrink-0 mt-0.5" />
        <p className="text-xs text-persimmon">
          This is not legal advice. Answers are based on your uploaded bylaws.
          Consult a lawyer for legal matters.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/30">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-guardian/10 flex items-center justify-center mb-3">
              <Shield className="h-8 w-8 text-guardian/60" />
            </div>
            <p className="font-display font-bold text-foreground">Welcome to the Guardian</p>
            <p className="text-sm mt-1 text-muted-foreground">Ask me anything about your scheme&apos;s bylaws</p>
            <div className="mt-4 space-y-2 text-sm">
              <p className="text-muted-foreground">Try asking:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {["Can I have a pet?", "What are the parking rules?", "Can I renovate?"].map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="px-3 py-1.5 bg-card hover:bg-secondary rounded-full text-foreground transition-colors border border-border text-sm"
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
                  : "bg-card text-foreground rounded-2xl rounded-bl-md border border-guardian/30"
              }`}
            >
              {/* Message header */}
              <div className={`flex items-center gap-2 px-4 pt-3 pb-1 ${
                message.role === "user" ? "justify-end" : ""
              }`}>
                {message.role === "guardian" && (
                  <Shield className="h-4 w-4 text-guardian" />
                )}
                <span className={`text-xs font-medium ${
                  message.role === "user" ? "text-primary-foreground/70" : "text-guardian"
                }`}>
                  {message.role === "user" ? "You" : "Guardian"}
                </span>
                {message.role === "user" && (
                  <User className="h-4 w-4 text-primary-foreground/70" />
                )}
              </div>

              {/* Message content */}
              <div className="px-4 pb-3">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </p>
              </div>

              {/* Citations (for guardian messages) */}
              {message.role === "guardian" && message.citations && message.citations.length > 0 && (
                <div className="px-4 pb-3">
                  <button
                    onClick={() => toggleCitations(message.id)}
                    className="flex items-center gap-1 text-xs text-guardian hover:text-guardian/80 font-medium"
                  >
                    {expandedCitations.has(message.id) ? (
                      <>
                        <ChevronUp className="h-3 w-3" />
                        Hide Sources ({message.citations.length})
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3" />
                        View Sources ({message.citations.length})
                      </>
                    )}
                  </button>

                  {expandedCitations.has(message.id) && (
                    <div className="mt-2 space-y-2">
                      {message.citations.map((citation, idx) => (
                        <div
                          key={idx}
                          className="bg-secondary border border-guardian/20 rounded-lg p-3"
                        >
                          {citation.sectionHeader && (
                            <p className="text-xs font-medium text-guardian mb-1">
                              {citation.sectionHeader}
                            </p>
                          )}
                          <p className="text-xs text-foreground leading-relaxed">
                            {citation.text}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Relevance: {Math.round(citation.score * 100)}%
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
            <div className="bg-card rounded-2xl rounded-bl-md px-4 py-3 border border-guardian/30">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-guardian" />
                <span className="text-xs font-medium text-guardian">Guardian</span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-guardian" />
                <span>Researching your bylaws...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-card">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your bylaws..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-guardian/50 focus:border-guardian disabled:bg-secondary/50 disabled:cursor-not-allowed text-sm text-foreground placeholder:text-muted-foreground"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Card>
  );
}
