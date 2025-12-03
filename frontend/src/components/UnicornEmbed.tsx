'use client';

import { useEffect, useRef } from 'react';

interface UnicornEmbedProps {
  projectId?: string;
  className?: string;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    UnicornStudio?: {
      isInitialized: boolean;
      init: () => void;
    };
  }
}

export default function UnicornEmbed({ 
  projectId = 'TLTIDyOEm3yXGcrq7Y0a',
  className = '',
  style 
}: UnicornEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (scriptLoadedRef.current) return;

    if (!window.UnicornStudio) {
      window.UnicornStudio = { isInitialized: false, init: () => {} };
      
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.5.2/dist/unicornStudio.umd.js';
      script.onload = () => {
        if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
          window.UnicornStudio.init();
          window.UnicornStudio.isInitialized = true;
        }
      };
      document.head.appendChild(script);
      scriptLoadedRef.current = true;
    } else if (!window.UnicornStudio.isInitialized) {
      window.UnicornStudio.init();
      window.UnicornStudio.isInitialized = true;
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      data-us-project={projectId}
      className={className}
      style={{ width: '100%', height: '100%', ...style }}
    />
  );
}

