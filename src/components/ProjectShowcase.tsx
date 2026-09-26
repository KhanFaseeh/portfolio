import React from 'react';
import { ArrowUpRight, Sparkles, ExternalLink } from 'lucide-react';

const PROJECTS = [
  {
    title: 'Aethelgard Haute Horlogerie',
    category: 'Interactive Real-Time 3D & Micro-Kinematics',
    year: '2026',
    description:
      'A bespoke digital boutique featuring real-time mechanical gear assembly, micro-haptics, and 120 FPS cursor-responsive reflections for high-complication Swiss tourbillons.',
    awards: ['Awwwards SOTD', 'FWA of the Day'],
    tags: ['WebGL', 'WebAudio API', 'Three.js', 'Sub-millisecond Lerp'],
    color: 'from-[#774C2E]/40 to-[#120E0B]',
  },
  {
    title: 'Vesper Sovereign Atelier',
    category: 'Haute Couture Digital Concierge',
    year: '2025',
    description:
      'Immersive digital flagship for private luxury collectors. Integrates deterministic multi-angle garment draping with zero-ghosting canvas rendering and ultra-fine tactile interactions.',
    awards: ['Red Dot Best of the Best', 'W3 Gold Award'],
    tags: ['Next-Gen Canvas', 'Lossless WebP', 'Tailwind CSS', 'TypeScript'],
    color: 'from-[#C5A059]/20 to-[#120E0B]',
  },
  {
    title: 'Kalyx Spatial Architecture',
    category: 'Autonomous Generative Interface',
    year: '2025',
    description:
      'Architectural visualizer for luxury pavilion structures in Zurich and Milan, utilizing physics-based camera dynamics, real-time sun angle tracking, and ambient acoustic resonance.',
    awards: ['CSSDA Site of the Month'],
    tags: ['Kinematics', 'GLSL Shaders', 'Framer Motion', 'Web Workers'],
    color: 'from-[#3A2A1E]/40 to-[#120E0B]',
  },
];

export const ProjectShowcase: React.FC = () => {
  return (
    <section id="works" className="py-24 px-6 lg:px-12 relative border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-mono-code uppercase tracking-[0.25em] text-[#C5A059] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Selected Works & Commissions</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-[#F5F0EB]">
              Curated <span className="italic gold-text-gradient">Portfolio Artifacts.</span>
            </h2>
          </div>
          <span className="text-xs font-mono-code text-white/50 uppercase tracking-widest">
            MMXXIV — MMXXVI
          </span>
        </div>

        {/* Project Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {PROJECTS.map((proj, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-3xl p-8 border border-white/10 hover:border-[#C5A059]/50 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Background Ambient Glow */}
              <div
                className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${proj.color} rounded-full blur-3xl pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity`}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between text-xs font-mono-code text-white/40 mb-6">
                  <span>0{idx + 1} / 03</span>
                  <div className="flex items-center space-x-2">
                    {proj.awards.map((a, aidx) => (
                      <span
                        key={aidx}
                        className="px-2 py-0.5 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/10 text-[9px] text-[#F3E5AB]"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>

                <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#C5A059] block mb-2">
                  {proj.category}
                </span>

                <h3 className="font-editorial text-2xl text-[#F5F0EB] mb-4 group-hover:text-[#F3E5AB] transition-colors flex items-center justify-between">
                  <span>{proj.title}</span>
                  <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-[#C5A059] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </h3>

                <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-light mb-8">
                  {proj.description}
                </p>
              </div>

              <div className="relative z-10 pt-6 border-t border-white/5 flex flex-wrap gap-2">
                {proj.tags.map((tag, tidx) => (
                  <span
                    key={tidx}
                    className="text-[10px] font-mono-code px-2.5 py-1 rounded-md bg-white/5 text-white/60 border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
