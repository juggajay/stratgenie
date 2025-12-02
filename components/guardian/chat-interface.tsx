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
    <Card className="flex flex-col h-[600px] border border-slate-200 rounded-xl bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-white">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Shield className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="font-medium text-slate-900">Ask the Guardian</h3>
          <p className="text-xs text-slate-500">AI-powered bylaw Q&A</p>
        </div>
      </div>

      {/* Disclaimer Banner */}
      <div className="px-4 py-2 bg-amber-50 border-b border-amber-100 flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">
          This is not legal advice. Answers are based on your uploaded bylaws.
          Consult a lawyer for legal matters.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
            <Shield className="h-12 w-12 mb-3 text-slate-300" />
            <p className="font-medium text-slate-500">Welcome to the Guardian</p>
            <p className="text-sm mt-1">Ask me anything about your scheme&apos;s bylaws</p>
            <div className="mt-4 space-y-2 text-sm">
              <p className="text-slate-400">Try asking:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {["Can I have a pet?", "What are the parking rules?", "Can I renovate?"].map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors"
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
                  ? "bg-indigo-600 text-white rounded-2xl rounded-br-md"
                  : "bg-slate-100 text-slate-900 rounded-2xl rounded-bl-md"
              }`}
            >
              {/* Message header */}
              <div className={`flex items-center gap-2 px-4 pt-3 pb-1 ${
                message.role === "user" ? "justify-end" : ""
              }`}>
                {message.role === "guardian" && (
                  <Shield className="h-4 w-4 text-indigo-600" />
                )}
                <span className={`text-xs font-medium ${
                  message.role === "user" ? "text-indigo-200" : "text-slate-500"
                }`}>
                  {message.role === "user" ? "You" : "Guardian"}
                </span>
                {message.role === "user" && (
                  <User className="h-4 w-4 text-indigo-200" />
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
                    className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
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
                          className="bg-white border border-slate-200 rounded-lg p-3"
                        >
                          {citation.sectionHeader && (
                            <p className="text-xs font-medium text-indigo-600 mb-1">
                              {citation.sectionHeader}
                            </p>
                          )}
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {citation.text}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
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
            <div className="bg-slate-100 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-indigo-600" />
                <span className="text-xs font-medium text-slate-500">Guardian</span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                <span>Researching your bylaws...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your bylaws..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed text-sm"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Card>
  );
}
