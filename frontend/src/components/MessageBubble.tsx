'use client';

import { memo } from 'react';

export type MessageType = 'user' | 'assistant' | 'status';

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  status?: 'pending' | 'processing' | 'success' | 'error';
}

interface MessageBubbleProps {
  message: Message;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.type === 'user';
  const isStatus = message.type === 'status';

  if (isStatus) {
    return (
      <div className="flex justify-center my-4">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
          {message.status === 'processing' && (
            <div className="w-2 h-2 rounded-full bg-cyan-400 pulse-glow" />
          )}
          {message.status === 'success' && (
            <div className="w-2 h-2 rounded-full bg-green-400" />
          )}
          {message.status === 'error' && (
            <div className="w-2 h-2 rounded-full bg-red-400" />
          )}
          <span className="text-sm text-white/60">{message.content}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-5 py-3 ${
          isUser
            ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30'
            : 'glass'
        }`}
      >
        <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        <span className="text-[10px] text-white/30 mt-2 block">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

export default memo(MessageBubble);

