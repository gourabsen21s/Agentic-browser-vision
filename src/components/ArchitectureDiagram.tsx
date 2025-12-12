'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  Target,
  Play,
  Eye,
  Brain,
  Zap,
  Monitor,
  Database,
  ScanLine,
  FileText,
  MessageSquare,
  Cpu,
  ArrowDown
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface LayerCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

function LayerCard({ title, icon, children, className = '' }: LayerCardProps) {
  return (
    <div className={`arch-layer rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-accent/20 text-accent">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}

interface ComponentBoxProps {
  label: string;
  icon: React.ReactNode;
  sublabel?: string;
}

function ComponentBox({ label, icon, sublabel }: ComponentBoxProps) {
  return (
    <div className="arch-component flex items-center gap-2 px-4 py-3 rounded-lg border border-border/30 bg-background/50 hover:border-accent/50 transition-colors">
      <div className="text-muted-foreground">{icon}</div>
      <div>
        <span className="text-sm font-medium text-foreground">{label}</span>
        {sublabel && <p className="text-xs text-muted-foreground">{sublabel}</p>}
      </div>
    </div>
  );
}

function ConnectionArrow({ label }: { label?: string }) {
  return (
    <div className="connection-arrow flex flex-col items-center gap-1 py-4">
      <ArrowDown className="w-5 h-5 text-accent" />
      {label && (
        <span className="text-xs text-muted-foreground font-mono">{label}</span>
      )}
    </div>
  );
}

export default function ArchitectureDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const layers = gsap.utils.toArray<HTMLElement>('.arch-layer');
    const arrows = gsap.utils.toArray<HTMLElement>('.connection-arrow');
    const components = gsap.utils.toArray<HTMLElement>('.arch-component');

    layers.forEach((layer, i) => {
      gsap.from(layer, {
        scrollTrigger: {
          trigger: layer,
          start: 'top 85%',
          end: 'top 50%',
          scrub: 1,
        },
        y: 60,
        opacity: 0,
        duration: 1
      });
    });

    arrows.forEach((arrow) => {
      gsap.from(arrow, {
        scrollTrigger: {
          trigger: arrow,
          start: 'top 90%',
          end: 'top 70%',
          scrub: 1,
        },
        scale: 0,
        opacity: 0,
      });
    });

    components.forEach((comp, i) => {
      gsap.from(comp, {
        scrollTrigger: {
          trigger: comp,
          start: 'top 90%',
          end: 'top 75%',
          scrub: 0.5,
        },
        x: i % 2 === 0 ? -30 : 30,
        opacity: 0,
      });
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="architecture-section w-full max-w-3xl mx-auto">
      <LayerCard
        title="User Goal"
        icon={<Target className="w-5 h-5" />}
        className="border-accent/30"
      >
        <p className="text-sm text-muted-foreground">
          The entry point where users define their scraping objective
        </p>
      </LayerCard>

      <ConnectionArrow />

      <LayerCard
        title="Browser Runner"
        icon={<Play className="w-5 h-5" />}
      >
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground mb-4">
            Orchestrates browser automation and session management
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ComponentBox
              label="Agent Runner"
              icon={<Cpu className="w-4 h-4" />}
            />
            <ComponentBox
              label="Session Manager"
              icon={<Database className="w-4 h-4" />}
            />
            <ComponentBox
              label="Playwright"
              icon={<Monitor className="w-4 h-4" />}
              sublabel="Browser Engine"
            />
          </div>
        </div>
      </LayerCard>

      <ConnectionArrow label="Screenshot" />

      <LayerCard
        title="Perception Layer"
        icon={<Eye className="w-5 h-5" />}
      >
        <p className="text-sm text-muted-foreground mb-4">
          Computer vision analysis of webpage screenshots
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ComponentBox
            label="YOLO Perception"
            icon={<ScanLine className="w-4 h-4" />}
            sublabel="YOLOv8 Model"
          />
          <ComponentBox
            label="Tesseract OCR"
            icon={<FileText className="w-4 h-4" />}
            sublabel="Text Extraction"
          />
        </div>
      </LayerCard>

      <ConnectionArrow label="UI Elements" />

      <LayerCard
        title="Reasoning Layer"
        icon={<Brain className="w-5 h-5" />}
      >
        <p className="text-sm text-muted-foreground mb-4">
          LLM-powered decision making and action planning
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ComponentBox
            label="Prompt Builder"
            icon={<MessageSquare className="w-4 h-4" />}
          />
          <ComponentBox
            label="Azure OpenAI"
            icon={<Brain className="w-4 h-4" />}
            sublabel="GPT-4"
          />
        </div>
      </LayerCard>

      <ConnectionArrow label="Action Plan (JSON)" />

      <LayerCard
        title="Execution Layer"
        icon={<Zap className="w-5 h-5" />}
        className="border-accent/30"
      >
        <p className="text-sm text-muted-foreground mb-4">
          Executes planned actions on the browser
        </p>
        <div className="flex justify-center">
          <ComponentBox
            label="Action Executor"
            icon={<Zap className="w-4 h-4" />}
            sublabel="Browser Control"
          />
        </div>
        <div className="mt-4 pt-4 border-t border-border/30">
          <p className="text-xs text-center text-muted-foreground">
            Loops back to Browser Runner for continuous operation
          </p>
        </div>
      </LayerCard>
    </div>
  );
}

