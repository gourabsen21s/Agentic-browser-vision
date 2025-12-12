'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import GlassSurface from './GlassSurface';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function ScrapeChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
    };

    setMessages(prev => [...prev, assistantMessage]);

    const mockResponse = generateMockResponse(userMessage.content);
    const words = mockResponse.split(' ');

    for (let i = 0; i < words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 40));
      const word = words[i] + (i < words.length - 1 ? ' ' : '');
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessage.id
            ? { ...msg, content: msg.content + word }
            : msg
        )
      );
    }

    setIsStreaming(false);
    inputRef.current?.focus();
  }, [input, isStreaming]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className={cn(
      "relative z-10 w-full max-w-3xl mx-auto px-4 flex flex-col transition-all duration-500 ease-out",
      hasMessages ? "h-[calc(100vh-120px)] mt-[100px] justify-end pb-8" : "h-screen justify-center"
    )}>
      {hasMessages && (
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 scrollbar-thin">
          {messages.map((message, index) => {
            const isLast = index === messages.length - 1;
            const isAssistant = message.role === 'assistant';
            const showCursor = isStreaming && isLast && isAssistant;

            return (
              <div
                key={message.id}
                className={cn(
                  "flex animate-in slide-in-from-bottom-4 duration-300",
                  isAssistant ? "justify-start" : "justify-end"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <GlassSurface
                  width="auto"
                  height="auto"
                  borderRadius={16}
                  className={cn(
                    "max-w-[80%] px-4 py-3",
                    isAssistant ? "" : "bg-white/10"
                  )}
                //   style={{ boxShadow: 'none' }}
                >
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {message.content}
                    {showCursor && (
                      <span className="inline-block w-2 h-4 ml-0.5 bg-purple-400 animate-pulse align-middle" />
                    )}
                  </p>
                </GlassSurface>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      )}

      <GlassSurface
        width="100%"
        height={56}
        borderRadius={9999}
        className="pointer-events-auto"
        // style={{ boxShadow: 'none' }}
      >
        <div className="flex items-center w-full gap-3 px-4">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a URL or describe what to scrape..."
            disabled={isStreaming}
            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-foreground/50 text-sm"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isStreaming}
            className="p-2 rounded-full hover:bg-foreground/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </GlassSurface>

      {!hasMessages && (
        <p className="text-center text-foreground/50 text-sm mt-4">
          Press Enter to send
        </p>
      )}
    </div>
  );
}

function generateMockResponse(input: string): string {
  const lower = input.toLowerCase();

  if (lower.includes('http') || lower.includes('www') || lower.includes('.com')) {
    return `Analyzing the webpage... I've detected the following elements:\n\n• Navigation menu with 5 links\n• Hero section with heading and CTA\n• 3 feature cards with icons\n• Footer with social links\n\nWould you like me to extract specific data from any of these elements?`;
  }

  if (lower.includes('table') || lower.includes('data') || lower.includes('extract')) {
    return `I can extract structured data from tables. Please provide the URL of the page containing the table, and I'll identify all table elements and their contents. I can export the data in JSON, CSV, or structured text format.`;
  }

  if (lower.includes('image') || lower.includes('photo') || lower.includes('picture')) {
    return `For image extraction, I can:\n\n• Detect all images on a page\n• Extract image URLs and alt text\n• Identify image dimensions\n• Download images in bulk\n\nShare the URL you'd like me to analyze.`;
  }

  return `I understand you want to scrape web content. To help you best, please provide:\n\n1. The URL of the target webpage\n2. What specific data you're looking for\n3. Your preferred output format\n\nI'll analyze the page structure and extract the data you need.`;
}

