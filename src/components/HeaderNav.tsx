import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Briefcase, User, Mail } from 'lucide-react';
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
    <>
      {/* 1. DESKTOP FLOATING PILL NAVBAR (Hidden on mobile < 768px, visible on md+) */}
      <header className="hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-40 items-center space-x-3">
        {/* Floating Frosted Glass Navigation Pill with blur(20px) */}
        <nav
          className="px-6 py-2.5 rounded-full border border-white/25 bg-black/25 shadow-2xl flex items-center space-x-6 sm:space-x-8 text-xs sm:text-sm font-sans tracking-[0.2em] uppercase transition-all duration-300"
          style={{
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <motion.button
            layoutId="nav-item-work"
            onClick={() => onOpenModal('work')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{
              type: 'spring',
              stiffness: 450,
              damping: 35,
              mass: 0.4,
            }}
            className={`transition-colors duration-200 hover:text-white ${
              activeTab === 'work' ? 'text-white font-semibold drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-white/70'
            }`}
          >
            [WORK]
          </motion.button>

          <motion.button
            layoutId="nav-item-about"
            onClick={() => onOpenModal('about')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{
              type: 'spring',
              stiffness: 450,
              damping: 35,
              mass: 0.4,
            }}
            className={`transition-colors duration-200 hover:text-white ${
              activeTab === 'about' ? 'text-white font-semibold drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-white/70'
            }`}
          >
            [ABOUT]
          </motion.button>

          <motion.button
            layoutId="nav-item-contact"
            onClick={() => onOpenModal('contact')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{
              type: 'spring',
              stiffness: 450,
              damping: 35,
              mass: 0.4,
            }}
            className={`transition-colors duration-200 hover:text-white ${
              activeTab === 'contact' ? 'text-white font-semibold drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-white/70'
            }`}
          >
            [CONTACT]
          </motion.button>
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

      {/* 2. MOBILE TOP BAR: Minimal brand + sound toggle (Visible only on < 768px) */}
      <div className="flex md:hidden fixed top-0 left-0 right-0 z-40 px-5 pt-4 pb-3 justify-between items-center pointer-events-auto bg-gradient-to-b from-black/50 via-black/25 to-transparent">
        <span className="text-[11px] font-mono-code uppercase tracking-[0.2em] text-white/80 font-medium">
          Mian Faseeh Ur Rehman
        </span>
        <button
          onClick={toggleSound}
          className="w-11 h-11 flex items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-white/80 active:bg-white/20 transition-colors"
          aria-label="Toggle audio feedback"
        >
          {soundOn ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 opacity-60" />}
        </button>
      </div>

      {/* 3. MOBILE NATIVE-STYLE FLOATING BOTTOM BAR (Visible only on < 768px) */}
      <nav
        className="flex md:hidden fixed bottom-4 inset-x-4 max-w-sm mx-auto z-40 px-3 py-2 rounded-full bg-[#120D0A]/85 border border-white/20 backdrop-blur-[24px] justify-between items-center shadow-2xl pointer-events-auto"
        style={{
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        }}
      >
        <button
          onClick={() => onOpenModal('work')}
          className={`flex-1 min-h-[44px] flex flex-col items-center justify-center space-y-0.5 active:scale-95 transition-transform ${
            activeTab === 'work' ? 'text-white' : 'text-white/60'
          }`}
        >
          <div className={`p-1.5 rounded-full ${activeTab === 'work' ? 'bg-white/15 text-white' : ''}`}>
            <Briefcase className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono-code tracking-wider uppercase font-medium">Work</span>
        </button>

        <button
          onClick={() => onOpenModal('about')}
          className={`flex-1 min-h-[44px] flex flex-col items-center justify-center space-y-0.5 active:scale-95 transition-transform ${
            activeTab === 'about' ? 'text-white' : 'text-white/60'
          }`}
        >
          <div className={`p-1.5 rounded-full ${activeTab === 'about' ? 'bg-white/15 text-white' : ''}`}>
            <User className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono-code tracking-wider uppercase font-medium">About</span>
        </button>

        <button
          onClick={() => onOpenModal('contact')}
          className={`flex-1 min-h-[44px] flex flex-col items-center justify-center space-y-0.5 active:scale-95 transition-transform ${
            activeTab === 'contact' ? 'text-white' : 'text-white/60'
          }`}
        >
          <div className={`p-1.5 rounded-full ${activeTab === 'contact' ? 'bg-white/15 text-white' : ''}`}>
            <Mail className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono-code tracking-wider uppercase font-medium">Contact</span>
        </button>
      </nav>
    </>
  );
};
