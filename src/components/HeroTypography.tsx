import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface HeroTypographyProps {
  onOpenResume: () => void;
  onOpenContact: () => void;
}

export const HeroTypography: React.FC<HeroTypographyProps> = ({ onOpenResume, onOpenContact }) => {
  return (
    <div className="fixed bottom-8 sm:bottom-12 left-6 sm:left-12 lg:left-16 z-30 max-w-[360px] pointer-events-auto select-none">
      {/* "Hi, I'm" in clean, spaced modern sans-serif */}
      <span className="block text-xs sm:text-sm font-sans tracking-[0.3em] uppercase text-white/90 font-medium mb-1 drop-shadow-md">
        Hi, I'm
      </span>

      {/* Name in large, elegant cursive script with subtle soft drop shadow */}
      <h1 className="font-script text-4xl sm:text-5xl lg:text-6xl text-white font-normal leading-[1.1] drop-shadow-[0_8px_24px_rgba(0,0,0,0.7)] mb-1">
        Mian Faseeh Ur Rehman
      </h1>

      {/* Tagline */}
      <span className="block text-[11px] sm:text-xs font-mono-code uppercase tracking-wider text-white/70 mb-3 drop-shadow-md">
        QA Engineer & Project Manager
      </span>

      {/* Compact bio (max-width ~340px) that does not crowd the character */}
      <p className="text-xs text-white/85 font-light leading-relaxed max-w-[340px] mb-6 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
        A highly technical QA Engineer and Project Manager specializing in end-to-end validation, state management diagnostics, and complex system architecture. Proven expertise in leading cross-functional teams, securing financial APIs, and troubleshooting React/React Native rendering cycles for scalable applications.
      </p>

      {/* Two stylish white pill buttons */}
      <div className="flex items-center space-x-3.5">
        {/* Resume: Solid white pill with arrow icon */}
        <button
          onClick={onOpenResume}
          className="group px-5 sm:px-6 py-2.5 rounded-full bg-white text-[#0C0907] font-semibold text-xs sm:text-sm flex items-center space-x-2 shadow-xl shadow-black/30 hover:bg-white/95 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <span>Resume</span>
          <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>

        {/* Let's Talk: Frosted glass / white border pill */}
        <button
          onClick={onOpenContact}
          className="px-5 sm:px-6 py-2.5 rounded-full border border-white/70 bg-white/10 text-white font-medium text-xs sm:text-sm flex items-center space-x-2 shadow-lg shadow-black/20 hover:bg-white/20 hover:border-white hover:scale-105 active:scale-95 transition-all duration-200"
          style={{
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          <span>Let's Talk</span>
        </button>
      </div>
    </div>
  );
};
