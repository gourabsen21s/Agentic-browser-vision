'use client';

import dynamic from 'next/dynamic';
import { ChatInterface } from '@/components';

const ColorBends = dynamic(() => import('@/components/ColorBends'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black" />
});

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <ColorBends
          colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
          rotation={30}
          speed={0.3}
          scale={1.2}
          frequency={1.4}
          warpStrength={1.2}
          mouseInfluence={0.8}
          parallax={0.6}
          noise={0.08}
          transparent={false}
        />
      </div>

      {/* Dark overlay for better readability */}
      <div className="fixed inset-0 z-10 bg-black/40" />

      {/* Main Content */}
      <div className="relative z-20 flex flex-col h-screen">
        <ChatInterface />
      </div>
    </main>
  );
}
