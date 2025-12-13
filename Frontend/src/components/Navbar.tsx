'use client';

import Link from 'next/link';
import { Scan } from 'lucide-react';
import GlassSurface from './GlassSurface';
import { AnimatedThemeToggler } from './ui/animated-theme-toggler';

export default function Navbar() {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-20">
      <GlassSurface
        width="auto"
        height={48}
        borderRadius={9999}
        className="pointer-events-auto px-6"
      >
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Scan className="w-5 h-5 text-accent" />
            <span className="font-semibold text-foreground">VisionScrape</span>
          </Link>
          <div className="flex items-center gap-6 text-sm text-foreground/80">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link href="/learn" className="hover:text-foreground transition-colors">Learn More</Link>
          </div>
          <AnimatedThemeToggler className="p-2 rounded-full hover:bg-foreground/10 transition-colors text-foreground" />
        </div>
      </GlassSurface>
    </nav>
  );
}
