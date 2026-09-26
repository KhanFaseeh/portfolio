import React, { useState } from 'react';
import { CharacterCanvas, TelemetryData } from './components/CharacterCanvas';
import { HeaderNav } from './components/HeaderNav';
import { HeroTypography } from './components/HeroTypography';
import { CustomCursor } from './components/CustomCursor';
import { InfoModals } from './components/InfoModals';
import { Compass, Eye, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
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

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#774C2E] select-none">
      {/* 1. Full Screen Zero-Ghosting 60 FPS Character Canvas (100vw, 100vh, object-fit: cover) */}
      <CharacterCanvas
        onTelemetryUpdate={setTelemetry}
        showDeadzoneVisualizer={showVisualizer}
      />

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

      {/* 4. Minimalist Bottom-Right Live Kinematics Telemetry Pill (Non-Intrusive) */}
      <div className="fixed bottom-8 sm:bottom-12 right-6 sm:right-12 z-30 flex items-center space-x-3 pointer-events-auto">
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

      {/* 6. Frosted Glass Information Modals (Work, About, Contact, Resume) */}
      <InfoModals
        activeTab={activeModal}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
};

export default App;
