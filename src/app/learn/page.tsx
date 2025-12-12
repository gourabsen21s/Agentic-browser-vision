'use client';

import { BackgroundBeams } from '@/components/ui/background-beams';
import ScrapeNavbar from '@/components/ScrapeNavbar';
import TiltedCard from '@/components/TiltedCard';
import ArchitectureDiagram from '@/components/ArchitectureDiagram';
import { Github, Linkedin, Twitter } from 'lucide-react';

function ContributorOverlay({ name, role }: { name: string; role: string }) {
  return (
    <div className="w-full h-full flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-[15px]">
      <h4 className="text-white font-semibold text-lg">{name}</h4>
      <p className="text-white/70 text-sm">{role}</p>
      <div className="flex gap-3 mt-2">
        <a href="#" className="text-white/60 hover:text-accent transition-colors">
          <Github className="w-4 h-4" />
        </a>
        <a href="#" className="text-white/60 hover:text-accent transition-colors">
          <Linkedin className="w-4 h-4" />
        </a>
        <a href="#" className="text-white/60 hover:text-accent transition-colors">
          <Twitter className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

export default function LearnPage() {
  return (
    <main className="relative min-h-screen">
      <BackgroundBeams className="fixed inset-0 z-0" />
      
      <div className="relative z-10">
        <ScrapeNavbar />
        
        <div className="container mx-auto px-6 py-12">
          <section className="text-center mb-20">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              How VisionScrape Works
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              An AI-powered web scraper that uses computer vision and large language models 
              to understand and extract data from any webpage visually.
            </p>
          </section>

          <section className="mb-32">
            <h2 className="text-2xl font-semibold text-foreground text-center mb-12">
              System Architecture
            </h2>
            <ArchitectureDiagram />
          </section>

          <section className="mb-20">
            <h2 className="text-2xl font-semibold text-foreground text-center mb-12">
              Contributors
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <TiltedCard
                imageSrc="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
                altText="Contributor 1"
                captionText="Contributor"
                containerHeight="320px"
                containerWidth="280px"
                imageHeight="300px"
                imageWidth="280px"
                rotateAmplitude={12}
                scaleOnHover={1.05}
                showMobileWarning={false}
                showTooltip={false}
                displayOverlayContent={true}
                overlayContent={
                  <ContributorOverlay 
                    name="Your Name" 
                    role="Lead Developer" 
                  />
                }
              />
              <TiltedCard
                imageSrc="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
                altText="Gourab Sen"
                captionText="Contributor"
                containerHeight="320px"
                containerWidth="280px"
                imageHeight="300px"
                imageWidth="280px"
                rotateAmplitude={12}
                scaleOnHover={1.05}
                showMobileWarning={false}
                showTooltip={false}
                displayOverlayContent={true}
                overlayContent={
                  <ContributorOverlay 
                    name="Gourab Sen" 
                    role="Co-Developer" 
                  />
                }
              />
            </div>
          </section>

          <footer className="text-center py-8 border-t border-border/30">
            <p className="text-sm text-muted-foreground">
              Built with Next.js, Three.js, and AI
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}

