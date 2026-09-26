import React, { useState } from 'react';
import { CharacterCanvas, TelemetryData } from './CharacterCanvas';
import { CompassControls } from './CompassControls';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Layers, Award } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    fps: 60,
    angleDeg: 0,
    angleRad: 0,
    frameIndex: 0,
    isEyeContact: true,
    compass: { code: 'CENTER', name: 'Direct Eye Contact' },
    isLoaded: false,
    loadProgress: 0,
  });

  const [activeCompassTarget, setActiveCompassTarget] = useState<number | null>(null);
  const [showDeadzoneVisualizer, setShowDeadzoneVisualizer] = useState<boolean>(false);

  return (
    <section id="hero" className="relative min-h-screen pt-28 pb-16 px-6 lg:px-12 flex flex-col justify-center">
      {/* Ambient Luxury Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#774C2E]/20 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-[#C5A059]/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto w-full">
        {/* Top Editorial Eyebrow */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="inline-flex items-center space-x-3 px-4 py-1.5 rounded-full border border-[#C5A059]/30 bg-[#16110E]/80 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-ping" />
            <span className="text-xs font-mono-code uppercase tracking-[0.2em] text-[#F3E5AB]">
              Autonomous 60 FPS Kinematics · Edition MMXXVI
            </span>
          </div>

          <div className="hidden sm:flex items-center space-x-6 text-xs font-mono-code text-white/50">
            <span>[LATENCY: ~35MS]</span>
            <span>[64 PRE-EXTRACTED WEBP FRAMES]</span>
            <span>[ZERO RUNTIME MP4 SEEKING]</span>
          </div>
        </div>

        {/* Main Hero Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Haute Typography & Editorial Statement (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-mono-code tracking-[0.3em] uppercase text-[#C5A059] block">
                Principal Creative Technologist
              </span>
              <h1 className="font-editorial text-4xl sm:text-5xl xl:text-6xl font-normal leading-[1.08] text-[#F5F0EB]">
                Engineering <br />
                <span className="italic font-normal gold-text-gradient">
                  Digital Elegance.
                </span>
              </h1>
            </div>

            <p className="text-sm sm:text-base text-white/70 font-light leading-relaxed max-w-lg">
              Crafting bespoke interactive experiences where autonomous mathematical precision converges with luxury haute design. Featuring zero-lag, zero-ghosting kinematic tracking calibrated to your cursor with instant eye contact.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#works"
                className="inline-flex items-center space-x-3 px-6 py-3.5 rounded-full bg-[#F5F0EB] text-[#0C0907] font-semibold text-xs tracking-wider uppercase hover:bg-[#F3E5AB] transition-all hover:scale-105 shadow-xl shadow-white/5"
              >
                <span>Explore Works (14)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="#architecture"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-full border border-white/15 bg-white/5 text-white/90 hover:border-[#C5A059] hover:text-[#C5A059] text-xs font-mono-code uppercase tracking-wider transition-all"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>View Architecture</span>
              </a>
            </div>

            {/* Accolades Micro-Strip */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4">
              <div>
                <div className="text-xl font-editorial font-bold text-[#F3E5AB]">4×</div>
                <div className="text-[10px] font-mono-code uppercase tracking-wider text-white/50">
                  Awwwards SOTD
                </div>
              </div>
              <div>
                <div className="text-xl font-editorial font-bold text-[#F3E5AB]">60 FPS</div>
                <div className="text-[10px] font-mono-code uppercase tracking-wider text-white/50">
                  Zero Ghosting
                </div>
              </div>
              <div>
                <div className="text-xl font-editorial font-bold text-[#F3E5AB]">35ms</div>
                <div className="text-[10px] font-mono-code uppercase tracking-wider text-white/50">
                  Angular Lerp
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Character Stage & Real-time Telemetry (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            {/* The Character Canvas Frame: Perfectly Rock-Solid, Seamless Video Background */}
            <div className="relative rounded-3xl overflow-hidden border border-[#C5A059]/25 bg-[#774C2E] shadow-2xl shadow-black/80 aspect-[16/10] sm:aspect-[16/9]">
              {/* Top Luxury Header Over Canvas */}
              <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
                <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0C0907]/80 backdrop-blur-md border border-white/10">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      telemetry.isEyeContact ? 'bg-[#F3E5AB] animate-pulse' : 'bg-[#C5A059]'
                    }`}
                  />
                  <span className="text-[10px] font-mono-code tracking-wider uppercase text-white/80">
                    {telemetry.isEyeContact ? 'Eye Contact (Deadzone)' : `Tracking · ${telemetry.compass.name}`}
                  </span>
                </div>

                <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0C0907]/80 backdrop-blur-md border border-white/10">
                  <Zap className="w-3 h-3 text-[#C5A059]" />
                  <span className="text-[10px] font-mono-code text-white/80 uppercase">
                    Canvas 60 FPS
                  </span>
                </div>
              </div>

              {/* The Zero-Ghosting Canvas Component */}
              <CharacterCanvas
                onTelemetryUpdate={setTelemetry}
                showDeadzoneVisualizer={showDeadzoneVisualizer}
                activeCompassTarget={activeCompassTarget}
                onClearCompassTarget={() => setActiveCompassTarget(null)}
              />

              {/* Bottom Interactive Prompt Overlay */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
                <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#F3E5AB]/90 bg-[#0C0907]/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  Move cursor around face to track 360° · Hover center for eye contact
                </span>
                <span className="text-[10px] font-mono-code text-white/50 bg-[#0C0907]/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 hidden sm:inline">
                  RGB #774C2E
                </span>
              </div>
            </div>

            {/* Interactive Telemetry & 8-Compass Controls */}
            <CompassControls
              telemetry={telemetry}
              activeTarget={activeCompassTarget}
              onSelectTarget={(frameIndex) => setActiveCompassTarget(frameIndex)}
              showDeadzoneVisualizer={showDeadzoneVisualizer}
              onToggleDeadzone={() => setShowDeadzoneVisualizer((prev) => !prev)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
