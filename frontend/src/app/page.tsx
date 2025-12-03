'use client';

import dynamic from 'next/dynamic';
import { ChatInterface } from '@/components';

const PixelBlast = dynamic(() => import('@/components/PixelBlast'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black" />
});

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* Animated Background */}
      <div className="fixed top-0 left-0 w-screen h-screen z-0">
        <PixelBlast
          variant="circle"
          pixelSize={6}
          color="#B19EEF"
          patternScale={3}
          patternDensity={1.2}
          pixelSizeJitter={0.5}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.6}
          edgeFade={0}
          transparent
        />
      </div>

      {/* Main Content */}
      <div className="relative z-20 min-h-screen overflow-y-auto">
        <ChatInterface />
      </div>
    </main>
  );
}
