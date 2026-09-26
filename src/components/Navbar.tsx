import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, ArrowUpRight } from 'lucide-react';
import { sounds } from '../utils/audio';

export const Navbar: React.FC = () => {
  const [audioEnabled, setAudioEnabled] = useState(false);

  const toggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    sounds.enabled = next;
    if (next) {
      sounds.playEyeContact();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-5 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Monogram */}
        <a href="#hero" className="group flex items-center space-x-3 text-left">
          <div className="w-10 h-10 rounded-full border border-[#C5A059]/40 bg-[#16110E]/80 backdrop-blur-md flex items-center justify-center text-[#F3E5AB] font-cinzel font-bold text-sm tracking-widest group-hover:border-[#C5A059] group-hover:scale-105 transition-all duration-300">
            JV
          </div>
          <div className="flex flex-col">
            <span className="font-cinzel text-xs font-semibold tracking-[0.25em] text-[#F5F0EB] uppercase">
              Julian Vance
            </span>
            <span className="text-[10px] font-mono-code text-[#C5A059]/80 uppercase tracking-widest">
              Principal Technologist
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 px-6 py-2.5 rounded-full border border-white/10 bg-[#120E0B]/70 backdrop-blur-xl">
          <a
            href="#hero"
            className="text-xs font-mono-code uppercase tracking-widest text-[#F5F0EB] hover:text-[#C5A059] transition-colors"
          >
            Overview
          </a>
          <a
            href="#works"
            className="text-xs font-mono-code uppercase tracking-widest text-white/60 hover:text-[#C5A059] transition-colors"
          >
            Works <span className="text-[9px] text-[#C5A059]">(14)</span>
          </a>
          <a
            href="#architecture"
            className="text-xs font-mono-code uppercase tracking-widest text-white/60 hover:text-[#C5A059] transition-colors"
          >
            Architecture
          </a>
          <a
            href="#accolades"
            className="text-xs font-mono-code uppercase tracking-widest text-white/60 hover:text-[#C5A059] transition-colors"
          >
            Accolades
          </a>
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center space-x-4">
          {/* Subtle Audio Feedback Toggle */}
          <button
            onClick={toggleAudio}
            title={audioEnabled ? 'Mute haptic audio' : 'Enable haptic audio feedback'}
            className="relative p-2.5 rounded-full border border-white/10 bg-[#140F0C]/80 hover:border-[#C5A059]/50 text-white/70 hover:text-[#C5A059] transition-all"
          >
            {audioEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-[#C5A059]" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A059] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C5A059]" />
                </span>
              </>
            ) : (
              <VolumeX className="w-4 h-4 opacity-50" />
            )}
          </button>

          {/* Status Badge */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
            <span className="text-[10px] font-mono-code text-[#F3E5AB] tracking-widest uppercase">
              Available Q4
            </span>
          </div>

          {/* CTA Button */}
          <a
            href="#contact"
            className="group relative inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#0C0907] font-semibold text-xs tracking-wider uppercase shadow-lg shadow-[#C5A059]/15 hover:shadow-[#C5A059]/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Initiate Contact</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </header>
  );
};
