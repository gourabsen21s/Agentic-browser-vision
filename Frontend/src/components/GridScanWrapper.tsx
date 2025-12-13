'use client';

import dynamic from 'next/dynamic';

const GridScan = dynamic(() => import('./GridScan').then(m => m.GridScan), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-[#0a0a0f]" />
});

export default function GridScanWrapper() {
  return (
    <div className="fixed inset-0 z-0">
      <GridScan
        sensitivity={0.55}
        lineThickness={1}
        linesColor="#392e4e"
        gridScale={0.1}
        scanColor="#FF9FFC"
        scanOpacity={0.4}
        enablePost
        bloomIntensity={0.6}
        chromaticAberration={0.002}
        noiseIntensity={0.01}
        scanDuration={3.0}
      />
    </div>
  );
}

