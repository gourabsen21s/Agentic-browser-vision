'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import GlassSurface from './GlassSurface';

export default function Hero() {
  return (
    <section className="flex-1 flex flex-col items-center justify-center px-6">
      <GlassSurface
        width="auto"
        height={40}
        borderRadius={9999}
        className="pointer-events-auto px-4 mb-8"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm text-white/80">Computer Vision Scraper</span>
        </div>
      </GlassSurface>
      
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white text-center max-w-4xl leading-tight mb-10">
        Extract data from any webpage visually.
      </h1>
      
      <div className="flex items-center gap-4 pointer-events-auto">
        <Link href="/scrape">
          <GlassSurface
            width="auto"
            height={52}
            borderRadius={9999}
            className="px-8 cursor-pointer hover:scale-105 transition-transform"
            brightness={90}
            opacity={0.95}
          >
            <span className="text-base font-medium text-white">Get Started</span>
          </GlassSurface>
        </Link>
        <Link href="/learn">
          <GlassSurface
            width="auto"
            height={52}
            borderRadius={9999}
            className="px-8 cursor-pointer hover:scale-105 transition-transform"
          >
            <span className="text-base font-medium text-white">Learn More</span>
          </GlassSurface>
        </Link>
      </div>
    </section>
  );
}
