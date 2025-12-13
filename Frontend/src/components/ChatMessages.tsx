'use client';

import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { Message } from '@/hooks/useChat';
import { User, Bot } from 'lucide-react';

type ChatMessagesProps = {
  messages: Message[];
  isStreaming: boolean;
};

export default function ChatMessages({ messages, isStreaming }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center text-muted-foreground/50">
          <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">Start a conversation</p>
          <p className="text-sm mt-1">Ask me to analyze any webpage or describe what you want to scrape</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
      <div className="space-y-4 max-w-3xl mx-auto">
        {messages.map((message, index) => {
          const isLast = index === messages.length - 1;
          const isAssistant = message.role === 'assistant';
          const showCursor = isStreaming && isLast && isAssistant;

          return (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                isAssistant ? 'justify-start' : 'justify-end'
              )}
            >
              {isAssistant && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-accent" />
                </div>
              )}
              
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-3',
                  isAssistant 
                    ? 'glass-message-assistant text-foreground' 
                    : 'bg-accent text-accent-foreground'
                )}
              >
                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                  {message.content}
                  {showCursor && (
                    <span className="inline-block w-2 h-4 ml-0.5 bg-accent animate-blink align-middle" />
                  )}
                </p>
              </div>

              {!isAssistant && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <User className="w-4 h-4 text-accent-foreground" />
                </div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}

