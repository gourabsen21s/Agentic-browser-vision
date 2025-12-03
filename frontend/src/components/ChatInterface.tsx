'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import StarBorder from './StarBorder';
import ShinyText from './ShinyText';

const ScrambledText = dynamic(() => import('./ScrambledText'), {
  ssr: false,
  loading: () => <div className="opacity-0">Loading...</div>
});

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface StatusUpdate {
  id: string;
  content: string;
  status: 'processing' | 'success' | 'error';
  timestamp: Date;
}

interface ScrapingResult {
  url: string;
  title: string;
  products: { name: string; price: string; rating: string }[];
  scrapedAt: string;
}

export default function ChatInterface() {
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([]);
  const [results, setResults] = useState<ScrapingResult[]>([]);
  const [currentUrl, setCurrentUrl] = useState('');
  const statusEndRef = useRef<HTMLDivElement>(null);
  const resultsEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    statusEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [statusUpdates]);

  useEffect(() => {
    resultsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [results]);

  const addStatus = useCallback((content: string, status: StatusUpdate['status'] = 'processing') => {
    const newStatus: StatusUpdate = {
      id: crypto.randomUUID(),
      content,
      status,
      timestamp: new Date()
    };
    setStatusUpdates(prev => [...prev, newStatus]);
    return newStatus.id;
  }, []);

  const simulateScraping = useCallback(async (url: string) => {
    setIsProcessing(true);
    setConnectionStatus('connecting');
    setCurrentUrl(url);
    setStatusUpdates([]);

    await new Promise(r => setTimeout(r, 500));
    setConnectionStatus('connected');

    addStatus('Initializing browser session...');
    await new Promise(r => setTimeout(r, 1200));

    addStatus('Navigating to target URL...');
    await new Promise(r => setTimeout(r, 1500));

    addStatus('Analyzing page structure...');
    await new Promise(r => setTimeout(r, 1800));

    addStatus('Extracting data with AI...');
    await new Promise(r => setTimeout(r, 2000));

    addStatus('Scraping completed successfully!', 'success');

    const mockResult: ScrapingResult = {
      url,
      title: 'Sample Product Page',
      products: [
        { name: 'Product A', price: '$29.99', rating: '4.5/5' },
        { name: 'Product B', price: '$49.99', rating: '4.8/5' },
        { name: 'Product C', price: '$19.99', rating: '4.2/5' }
      ],
      scrapedAt: new Date().toISOString()
    };

    setResults(prev => [...prev, mockResult]);
    setIsProcessing(false);
    setConnectionStatus('disconnected');
  }, [addStatus]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    const url = inputValue.trim();
    if (!url || isProcessing) return;

    try {
      new URL(url);
    } catch {
      addStatus('Please enter a valid URL (e.g., https://example.com)', 'error');
      return;
    }

    setInputValue('');
    simulateScraping(url);
  }, [inputValue, isProcessing, addStatus, simulateScraping]);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-400';
      case 'connecting': return 'bg-yellow-400 pulse-glow';
      case 'error': return 'bg-red-400';
      default: return 'bg-white/30';
    }
  };

  const getStatusIcon = (status: StatusUpdate['status']) => {
    switch (status) {
      case 'processing':
        return (
          <svg className="w-4 h-4 animate-spin text-cyan-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        );
      case 'success':
        return (
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl acrylic flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full acrylic mb-6">
          <ShinyText text="AI Web Scraper" speed={3} className="text-sm font-medium" />
        </div>

        <ScrambledText
          radius={120}
          duration={1.0}
          speed={0.6}
          scrambleChars=".:"
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight text-center"
        >
          Extract data from any website
        </ScrambledText>
        <ScrambledText
          radius={80}
          duration={0.8}
          speed={0.5}
          scrambleChars="._"
          className="text-white font-semibold text-lg max-w-md mb-2 text-shadow-strong text-center"
        >
          Paste a URL and let AI navigate, understand, and extract structured data in real-time.
        </ScrambledText>

        <div className="flex items-center gap-2 mt-4">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
          <span className="text-xs text-white font-bold capitalize text-shadow-strong">{connectionStatus}</span>
        </div>
      </div>

      {/* Input Area */}
      <div className="w-full mb-8">
        <form onSubmit={handleSubmit}>
          <StarBorder
            as="div"
            color="cyan"
            speed="5s"
            thickness={1}
            className="w-full"
          >
            <div className="flex items-center gap-3 px-5">
              <svg className="w-5 h-5 text-white shrink-0 drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter URL to scrape (e.g., https://example.com)"
                disabled={isProcessing}
                className="flex-1 bg-transparent py-4 font-semibold shiny-white-input focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isProcessing || !inputValue.trim()}
                className="shrink-0 w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:bg-white/20 disabled:text-white/50"
              >
                {isProcessing ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                )}
              </button>
            </div>
          </StarBorder>
        </form>
        <p className="text-center text-sm text-white font-bold mt-4 text-glow-subtle">
          Press Enter to start scraping
        </p>
      </div>

      {/* Real-time Status Updates */}
      {(statusUpdates.length > 0 || isProcessing) && (
        <div className="w-full mb-8">
          <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2 text-glow-subtle">
            <svg className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Real-time Updates
            {currentUrl && <span className="text-white/70 text-sm font-normal ml-2 truncate max-w-xs">({currentUrl})</span>}
          </h2>
          <div className="acrylic rounded-2xl p-6 w-full">
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {statusUpdates.map((update) => (
                <div 
                  key={update.id} 
                  className="flex items-center gap-3 text-white"
                >
                  {getStatusIcon(update.status)}
                  <span className={`font-semibold text-shadow-strong ${update.status === 'success' ? 'text-green-400' : update.status === 'error' ? 'text-red-400' : 'text-white'}`}>
                    {update.content}
                  </span>
                  <span className="text-white/60 text-xs ml-auto font-medium">
                    {update.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
              <div ref={statusEndRef} />
            </div>
          </div>
        </div>
      )}

      {/* Results Area */}
      {results.length > 0 && (
        <div className="w-full">
          <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2 text-glow-subtle">
            <svg className="w-5 h-5 text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Extracted Results
          </h2>
          <div className="space-y-6">
            {results.map((result, index) => (
              <div key={index} className="acrylic rounded-2xl p-6 w-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold text-lg text-glow-subtle">{result.title}</h3>
                  <span className="text-white/70 text-xs font-medium">{new Date(result.scrapedAt).toLocaleString()}</span>
                </div>
                <p className="text-cyan-400 text-sm mb-4 break-all font-medium drop-shadow-[0_0_6px_rgba(34,211,238,0.4)]">{result.url}</p>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-white font-bold pb-3 pr-4 text-shadow-strong">Product</th>
                        <th className="text-white font-bold pb-3 pr-4 text-shadow-strong">Price</th>
                        <th className="text-white font-bold pb-3 text-shadow-strong">Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.products.map((product, pIndex) => (
                        <tr key={pIndex} className="border-b border-white/10 last:border-0">
                          <td className="text-white font-semibold py-3 pr-4 text-shadow-strong">{product.name}</td>
                          <td className="text-green-400 font-bold py-3 pr-4 drop-shadow-[0_0_6px_rgba(74,222,128,0.5)]">{product.price}</td>
                          <td className="text-yellow-400 font-semibold py-3 drop-shadow-[0_0_6px_rgba(250,204,21,0.5)]">{product.rating}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <details className="mt-4">
                  <summary className="text-white/50 text-sm cursor-pointer hover:text-white transition-colors">
                    View Raw JSON
                  </summary>
                  <pre className="mt-3 p-4 bg-black/30 rounded-xl text-sm text-white/80 overflow-x-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </details>
              </div>
            ))}
            <div ref={resultsEndRef} />
          </div>
        </div>
      )}
    </div>
  );
}

