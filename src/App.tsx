import React, { useState } from 'react';
import { CharacterCanvas, TelemetryData } from './components/CharacterCanvas';
import { HeaderNav } from './components/HeaderNav';
import { HeroTypography } from './components/HeroTypography';
import { CustomCursor } from './components/CustomCursor';
import { MorphingExpansionSystem } from './components/MorphingExpansionSystem';
import { Compass, Eye, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

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

  const [activeModal, setActiveModal] = useState<'work' | 'about' | 'contact' | 'resume' | null>(null);
  const [showVisualizer, setShowVisualizer] = useState<boolean>(false);

  // Sync mobile screen status on viewport resize
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#774C2E] select-none">
      {/* 1. Interactive 60 FPS Character Canvas on Desktop vs Full-Bleed Centered Character Background on Mobile */}
      {!isMobile ? (
        <CharacterCanvas
          onTelemetryUpdate={setTelemetry}
          showDeadzoneVisualizer={showVisualizer}
          isPaused={Boolean(activeModal)}
        />
      ) : (
        <div
          className="fixed inset-0 pointer-events-none overflow-hidden select-none bg-[#774C2E]"
          style={{
            width: '100vw',
            height: '100dvh',
            zIndex: 0,
          }}
        >
          {/* Full-Bleed Dead-Center Front-Facing Character Image */}
          <img
            src="/frames/center.webp"
            alt="Mian Faseeh Ur Rehman"
            className="w-full h-full object-cover object-center select-none"
            loading="eager"
            decoding="async"
          />

          {/* Vignette & Radial Dark Gradient Overlay for optimal content readability */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(circle at 50% 32%, transparent 20%, rgba(12, 9, 7, 0.45) 70%, rgba(12, 9, 7, 0.85) 100%),
                linear-gradient(180deg, rgba(12, 9, 7, 0.45) 0%, transparent 25%, rgba(12, 9, 7, 0.6) 65%, rgba(12, 9, 7, 0.95) 100%)
              `,
            }}
          />
        </div>
      )}

      {/* 2. Floating Frosted-Glass Navigation Pill Centered at Very Top */}
      <HeaderNav
        onOpenModal={(tab) => setActiveModal(tab)}
        activeTab={activeModal === 'resume' ? null : activeModal}
      />

      {/* 3. Hero Typography (Bottom-Left) */}
      <HeroTypography
        onOpenResume={() => setActiveModal('resume')}
        onOpenContact={() => setActiveModal('contact')}
      />

      {/* 4. Minimalist Bottom-Right Live Kinematics Telemetry Pill (Hidden on mobile < 640px) */}
      <div className="hidden sm:flex fixed bottom-8 sm:bottom-12 right-6 sm:right-12 z-30 items-center space-x-3 pointer-events-auto">
        <button
          onClick={() => setShowVisualizer((prev) => !prev)}
          title="Toggle Eye Contact Deadzone Reticle"
          className="px-3.5 py-2 rounded-full border border-white/20 bg-black/30 backdrop-blur-[20px] text-white/70 hover:text-white hover:border-white/40 text-[11px] font-mono-code flex items-center space-x-2 transition-all shadow-xl"
        >
          {telemetry.isEyeContact ? (
            <>
              <Eye className="w-3.5 h-3.5 text-white animate-pulse" />
              <span>Eye Contact</span>
            </>
          ) : (
            <>
              <Compass className="w-3.5 h-3.5 text-white/80" />
              <span>{telemetry.compass.name}</span>
            </>
          )}
          <span className="text-white/40">·</span>
          <span className="text-white/80">{telemetry.fps} fps</span>
        </button>
      </div>

      {/* 5. Custom Magnetic Glowing White Cursor with Trailing Aura Ring */}
      <CustomCursor isEyeContact={telemetry.isEyeContact} />

      {/* 6. Apple iOS Shared-Element Morphing Card Expansion System (Work, About, Contact, Resume) */}
      <MorphingExpansionSystem
        expandedId={activeModal}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
};

export default App;
