import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface HeroTypographyProps {
  onOpenResume: () => void;
  onOpenContact: () => void;
}

export const HeroTypography: React.FC<HeroTypographyProps> = ({ onOpenResume, onOpenContact }) => {
  return (
    <div className="fixed bottom-24 md:bottom-8 sm:md:bottom-12 left-4 sm:left-12 lg:left-16 right-4 sm:right-auto z-30 max-w-full sm:max-w-[420px] pointer-events-auto select-none">
      {/* Mobile Card Wrap: subtle frosted glass styling on mobile screens to separate from background */}
      <div className="p-5 sm:p-0 rounded-3xl sm:rounded-none bg-[#120D0A]/75 sm:bg-transparent backdrop-blur-[20px] sm:backdrop-blur-none border border-white/15 sm:border-0 shadow-2xl sm:shadow-none">
        {/* "Hi, I'm" in clean, spaced modern sans-serif */}
        <span className="block text-xs sm:text-sm font-sans tracking-[0.3em] uppercase text-white/90 font-medium mb-1 drop-shadow-md">
          Hi, I'm
        </span>

        {/* Name in large, elegant cursive script with prominent glowing soft blurred shadow */}
        <h1
          className="font-script text-3xl sm:text-6xl lg:text-7xl text-white font-normal leading-[1.15] sm:leading-[1.1] mb-1.5 sm:mb-2"
          style={{
            textShadow: '0px 4px 24px rgba(255, 255, 255, 0.45), 0px 8px 32px rgba(0, 0, 0, 0.7)',
          }}
        >
          Mian Faseeh Ur Rehman
        </h1>

        {/* Tagline */}
        <span className="block text-[11px] sm:text-xs font-mono-code uppercase tracking-wider text-[#C5A059] sm:text-white/80 mb-2.5 sm:mb-3 drop-shadow-md font-medium">
          Quality Assurance Engineer & Project Manager
        </span>

        {/* Compact bio that does not crowd the character */}
        <p className="text-xs sm:text-[13px] text-white/90 font-light leading-relaxed max-w-full sm:max-w-[390px] mb-4 sm:mb-6 line-clamp-3 sm:line-clamp-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
          I specialize in driving software excellence through rigorous quality assurance and strategic project management. By bridging the gap between technical execution and project delivery, I ensure complex applications are released flawlessly, on time, and aligned with core business objectives.
        </p>

        {/* Two stylish pill buttons with minimum 44px touch targets on mobile */}
        <div className="flex items-center space-x-3">
          {/* Resume: Solid white pill with arrow icon */}
          <motion.button
            layoutId="action-resume"
            onClick={onOpenResume}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{
              type: 'spring',
              stiffness: 450,
              damping: 35,
              mass: 0.4,
            }}
            className="group min-h-[44px] flex-1 sm:flex-initial px-5 sm:px-6 py-2.5 rounded-full bg-white text-[#0C0907] font-semibold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-xl shadow-black/30 hover:bg-white/95"
          >
            <span>Resume</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>

          {/* Let's Talk: Frosted glass / white border pill */}
          <motion.button
            layoutId="nav-item-contact"
            onClick={onOpenContact}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{
              type: 'spring',
              stiffness: 450,
              damping: 35,
              mass: 0.4,
            }}
            className="min-h-[44px] flex-1 sm:flex-initial px-5 sm:px-6 py-2.5 rounded-full border border-white/70 bg-white/10 text-white font-medium text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-black/20 hover:bg-white/20 hover:border-white"
            style={{
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            <span>Let's Talk</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

