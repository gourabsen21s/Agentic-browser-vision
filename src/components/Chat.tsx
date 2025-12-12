'use client';

import { useChat } from '@/hooks/useChat';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

export default function Chat() {
  const { messages, isStreaming, sendMessage, stopStreaming } = useChat();

  return (
    <section className="flex-1 flex flex-col min-h-0 px-4 pb-4">
      <div className="glass-card flex-1 flex flex-col min-h-0 overflow-hidden pointer-events-auto">
        <ChatMessages messages={messages} isStreaming={isStreaming} />
        <ChatInput 
          onSend={sendMessage} 
          onStop={stopStreaming} 
          isStreaming={isStreaming} 
        />
      </div>
    </section>
  );
}

