import React from 'react';
import { ArrowUp, Mail, Github, Linkedin, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="py-20 px-6 lg:px-12 border-t border-white/10 bg-[#090705] relative">
      <div className="max-w-7xl mx-auto flex flex-col justify-between">
        {/* Top Call to Action */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-mono-code uppercase tracking-[0.25em] text-[#C5A059] block">
              Inquire About Collaborations
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl text-[#F5F0EB]">
              Let’s build something <br />
              <span className="italic gold-text-gradient">unforgettable together.</span>
            </h2>
            <p className="text-sm text-white/60 font-light max-w-lg">
              Available for select principal architecture consulting, bespoke interactive hero sections, and luxury frontier web applications.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
            <a
              href="mailto:contact@julianvance.design"
              className="inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#0C0907] font-semibold text-xs tracking-wider uppercase hover:scale-[1.02] transition-all shadow-xl shadow-[#C5A059]/15"
            >
              <Mail className="w-4 h-4" />
              <span>contact@julianvance.design</span>
            </a>

            <button
              onClick={scrollToTop}
              className="inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-full border border-white/15 bg-white/5 text-white/80 hover:text-white hover:border-[#C5A059] text-xs font-mono-code uppercase tracking-wider transition-all"
            >
              <ArrowUp className="w-4 h-4" />
              <span>Return to Top</span>
            </button>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-code text-white/40">
          <div className="flex items-center space-x-3">
            <span className="font-cinzel text-white/80 font-bold">JV</span>
            <span>© MMXXVI Julian Vance · All Rights Reserved.</span>
          </div>

          <div className="flex items-center space-x-6">
            <span className="text-[#C5A059]">60 FPS Kinematics Engine</span>
            <span>RGB #774C2E</span>
            <span>Awwwards Best Practice</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
