'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import StarBorder from './StarBorder';
import ShinyText from './ShinyText';
import MessageBubble, { Message } from './MessageBubble';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const addMessage = useCallback((type: Message['type'], content: string, status?: Message['status']) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      type,
      content,
      timestamp: new Date(),
      status
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  }, []);

  const updateMessage = useCallback((id: string, updates: Partial<Message>) => {
    setMessages(prev => 
      prev.map(msg => msg.id === id ? { ...msg, ...updates } : msg)
    );
  }, []);

  const simulateScraping = useCallback(async (url: string) => {
    setIsProcessing(true);
    setConnectionStatus('connecting');

    addMessage('user', `Scrape: ${url}`);

    await new Promise(r => setTimeout(r, 500));
    setConnectionStatus('connected');

    const statusId = addMessage('status', 'Initializing browser session...', 'processing');
    await new Promise(r => setTimeout(r, 1200));

    updateMessage(statusId, { content: 'Navigating to target URL...', status: 'processing' });
    await new Promise(r => setTimeout(r, 1500));

    updateMessage(statusId, { content: 'Analyzing page structure...', status: 'processing' });
    await new Promise(r => setTimeout(r, 1800));

    updateMessage(statusId, { content: 'Extracting data with AI...', status: 'processing' });
    await new Promise(r => setTimeout(r, 2000));

    updateMessage(statusId, { content: 'Scraping completed successfully!', status: 'success' });

    const mockResult = {
      url,
      title: 'Sample Product Page',
      products: [
        { name: 'Product A', price: '$29.99', rating: '4.5/5' },
        { name: 'Product B', price: '$49.99', rating: '4.8/5' },
        { name: 'Product C', price: '$19.99', rating: '4.2/5' }
      ],
      scrapedAt: new Date().toISOString()
    };

    addMessage('assistant', '```json\n' + JSON.stringify(mockResult, null, 2) + '\n```');

    setIsProcessing(false);
    setConnectionStatus('disconnected');
  }, [addMessage, updateMessage]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    const url = inputValue.trim();
    if (!url || isProcessing) return;

    try {
      new URL(url);
    } catch {
      addMessage('status', 'Please enter a valid URL (e.g., https://example.com)', 'error');
      return;
    }

    setInputValue('');
    simulateScraping(url);
  }, [inputValue, isProcessing, addMessage, simulateScraping]);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-400';
      case 'connecting': return 'bg-yellow-400 pulse-glow';
      case 'error': return 'bg-red-400';
      default: return 'bg-white/30';
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">BrowserAgent</h1>
            <p className="text-xs text-white/50">AI-Powered Web Scraper</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
          <span className="text-xs text-white/50 capitalize">{connectionStatus}</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <ShinyText 
              text="Paste a URL to start scraping" 
              speed={3} 
              className="text-xl font-medium mb-2"
            />
            <p className="text-white/40 text-sm max-w-md">
              Enter any website URL and watch as AI navigates, understands, and extracts structured data in real-time.
            </p>
          </div>
        ) : (
          <>
            {messages.map(message => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="px-6 py-4 border-t border-white/10">
        <form onSubmit={handleSubmit}>
          <StarBorder
            as="div"
            color="cyan"
            speed="5s"
            thickness={2}
            className="w-full"
          >
            <div className="flex items-center gap-3 bg-black/60 rounded-[18px] px-4">
              <svg className="w-5 h-5 text-white/40 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter URL to scrape (e.g., https://example.com)"
                disabled={isProcessing}
                className="flex-1 bg-transparent py-4 text-white placeholder-white/30 focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isProcessing || !inputValue.trim()}
                className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                {isProcessing ? (
                  <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                )}
              </button>
            </div>
          </StarBorder>
        </form>
        <p className="text-center text-xs text-white/30 mt-3">
          Press Enter to send • Results appear in real-time
        </p>
      </div>
    </div>
  );
}

