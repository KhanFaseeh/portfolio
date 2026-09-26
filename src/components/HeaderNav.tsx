import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sounds } from '../utils/audio';

interface HeaderNavProps {
  onOpenModal: (tab: 'work' | 'about' | 'contact') => void;
  activeTab: 'work' | 'about' | 'contact' | null;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ onOpenModal, activeTab }) => {
  const [soundOn, setSoundOn] = React.useState(false);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    sounds.enabled = next;
    if (next) sounds.playEyeContact();
  };

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-40 flex items-center space-x-3">
      {/* Floating Frosted Glass Navigation Pill with blur(20px) */}
      <nav
        className="px-6 py-2.5 rounded-full border border-white/25 bg-black/25 shadow-2xl flex items-center space-x-6 sm:space-x-8 text-xs sm:text-sm font-sans tracking-[0.2em] uppercase transition-all duration-300"
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <button
          onClick={() => onOpenModal('work')}
          className={`transition-all duration-200 hover:text-white hover:scale-105 active:scale-95 ${
            activeTab === 'work' ? 'text-white font-semibold drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-white/70'
          }`}
        >
          [WORK]
        </button>

        <button
          onClick={() => onOpenModal('about')}
          className={`transition-all duration-200 hover:text-white hover:scale-105 active:scale-95 ${
            activeTab === 'about' ? 'text-white font-semibold drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-white/70'
          }`}
        >
          [ABOUT]
        </button>

        <button
          onClick={() => onOpenModal('contact')}
          className={`transition-all duration-200 hover:text-white hover:scale-105 active:scale-95 ${
            activeTab === 'contact' ? 'text-white font-semibold drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-white/70'
          }`}
        >
          [CONTACT]
        </button>
      </nav>

      {/* Subtle Haptic Audio Toggle Button */}
      <button
        onClick={toggleSound}
        title={soundOn ? 'Mute audio' : 'Enable audio feedback'}
        className="p-2.5 rounded-full border border-white/25 bg-black/25 text-white/70 hover:text-white transition-all shadow-xl"
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {soundOn ? (
          <Volume2 className="w-4 h-4 text-white" />
        ) : (
          <VolumeX className="w-4 h-4 opacity-50" />
        )}
      </button>
    </header>
  );
};
