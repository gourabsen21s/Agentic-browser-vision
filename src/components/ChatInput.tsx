'use client';

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Square } from 'lucide-react';

type ChatInputProps = {
  onSend: (message: string) => void;
  onStop: () => void;
  isStreaming: boolean;
};

export default function ChatInput({ onSend, onStop, isStreaming }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = useCallback(() => {
    if (input.trim() && !isStreaming) {
      onSend(input);
      setInput('');
    }
  }, [input, isStreaming, onSend]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  return (
    <div className="p-4 border-t border-white/5">
      <div className="max-w-3xl mx-auto flex gap-3">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe what you want to analyze or scrape..."
          disabled={isStreaming}
          className="flex-1 bg-white/5 border-white/10 focus:border-accent/50 focus:ring-accent/20 placeholder:text-muted-foreground/50"
        />
        
        {isStreaming ? (
          <Button
            onClick={onStop}
            variant="outline"
            size="icon"
            className="border-white/10 hover:bg-white/10 hover:border-accent/50"
          >
            <Square className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="bg-accent hover:bg-accent/80 text-accent-foreground"
          >
            <Send className="w-4 h-4 mr-2" />
            Send
          </Button>
        )}
      </div>
    </div>
  );
}

