"use client";

import { useState, useRef, useEffect } from "react";
import { useSpreadsheetStore } from "@/store/spreadsheet-store";
import { Send, Sparkles, X, Loader2 } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function AIChat() {
  const { workbookId, sheets, activeSheetIndex, setSidebarPanel } = useSpreadsheetStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(crypto.randomUUID());

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load chat history
  useEffect(() => {
    if (workbookId) {
      fetch(`/api/ai/chat?workbookId=${workbookId}`)
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setMessages(data.map((m: { role: string; content: string }) => ({ role: m.role as "user" | "assistant", content: m.content })));
          }
        })
        .catch(() => {});
    }
  }, [workbookId]);

  const getContextCells = () => {
    const sheet = sheets[activeSheetIndex];
    if (!sheet) return {};
    const context: Record<string, string | number | boolean | null> = {};
    let count = 0;
    for (const [key, cell] of Object.entries(sheet.cells)) {
      if (count > 50) break; // Limit context size
      if (cell.value !== null && cell.value !== undefined) {
        context[key] = cell.value;
        count++;
      }
    }
    return context;
  };

  const sendMessage = async () => {
    if (!input.trim() || loading || !workbookId) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          workbookId,
          sessionId: sessionId.current,
          contextCells: getContextCells(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error. Please check your internet and try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span className="font-medium text-sm text-gray-900">AI Chat</span>
        </div>
        <button
          onClick={() => setSidebarPanel(null)}
          className="p-1 rounded hover:bg-gray-100"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <Sparkles className="w-8 h-8 text-purple-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700 mb-1">Ask me anything about your data</p>
            <p className="text-xs text-gray-400">
              I can help with formulas, analysis, and insights.
            </p>
            <div className="mt-4 space-y-2">
              {[
                "What formulas can I use to calculate growth rate?",
                "Summarize the data in this sheet",
                "Create a SUM formula for column B",
              ].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setInput(suggestion)}
                  className="block w-full text-left text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 hover:bg-gray-100 transition"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-gray-100 text-gray-800 rounded-tl-none"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-xl rounded-tl-none px-3 py-2">
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask about your data..."
            className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-1.5 text-center">
          Powered by Cerebras LLM (Llama 3.1 8B)
        </p>
      </div>
    </div>
  );
}
