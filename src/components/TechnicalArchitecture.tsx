import React from 'react';
import { Cpu, Eye, RotateCw, VideoOff, Layers, CheckCircle2, Sliders } from 'lucide-react';

const ARCHITECTURE_PILLARS = [
  {
    icon: VideoOff,
    title: 'Zero Runtime Video Seeking',
    badge: '100% Deterministic',
    description:
      'Browser video.currentTime seeking freezes on single-keyframe generated MP4s. Pre-extracting 64 lossless WebP frames entirely eliminates decode stalls and uncontrolled playback.',
    specs: ['64 WebP frames (~105 KB each)', '0ms seek latency', 'Offline-capable memory cache'],
  },
  {
    icon: RotateCw,
    title: 'Shortest-Path Circular Lerp',
    badge: 'k = 0.26 (~35ms)',
    description:
      'Calculates atan2(dy, dx) relative to the face centroid. Implements circular shortest-path interpolation (modulo 2π) to eliminate 360° flip jitter and achieve silky-smooth 60 FPS tracking.',
    specs: ['Shortest-path angular diff', 'Sub-40ms perceived response', 'Continuous clockwise loop'],
  },
  {
    icon: Layers,
    title: 'Zero-Ghosting Single Frame Draw',
    badge: '100% Opacity',
    description:
      'Alpha-blending consecutive frames causes severe double-face ghosting. Our renderer guarantees exactly one crisp frame is drawn per render pass with zero opacity blending.',
    specs: ['100% crisp frame guarantee', 'Zero ghosting artifacts', 'High-DPI Retina scaling'],
  },
  {
    icon: Eye,
    title: 'Center Eye Contact Deadzone',
    badge: '12% Screen Radius',
    description:
      'When the cursor penetrates the 12% circular deadzone surrounding the character’s eyes, the engine smoothly transitions to center.webp for direct, intimate eye contact.',
    specs: ['12% responsive screen radius', 'Frame #225 neutral lock', 'Synthetic Web Audio feedback'],
  },
  {
    icon: Cpu,
    title: 'Rock-Solid Motionless Body',
    badge: 'No CSS 3D',
    description:
      'Zero CSS perspective, rotateX, or rotateY transformations. The frame, canvas, and character body remain 100% motionless; only the head rotates along the 360° trajectory.',
    specs: ['Zero 3D perspective distortion', 'Pixel-stable shoulders', 'Sub-4.0 pixel frame variance'],
  },
  {
    icon: Sliders,
    title: 'Seamless Background Chroma Match',
    badge: 'RGB #774C2E',
    description:
      'OpenCV-sampled edge and corner RGB values seamlessly align canvas backdrop, container borders, and page gradients into one unified, uninterrupted visual canvas.',
    specs: ['Corner RGB [119, 76, 46]', 'Seamless radial vignette', 'Dark obsidian contrast'],
  },
];

export const TechnicalArchitecture: React.FC = () => {
  return (
    <section id="architecture" className="py-24 px-6 lg:px-12 relative border-t border-white/10 bg-[#0C0907]/60">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-mono-code uppercase tracking-[0.25em] text-[#C5A059] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
              <span>Technical Specification</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal text-[#F5F0EB]">
              Engineered for <br />
              <span className="italic gold-text-gradient">Zero-Compromise Performance.</span>
            </h2>
          </div>
          <p className="text-sm font-light text-white/60 max-w-md leading-relaxed">
            By rejecting brute-force browser video seeking and 3D CSS hacks, our architecture achieves 60 FPS silky smoothness with zero ghosting.
          </p>
        </div>

        {/* 6 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARCHITECTURE_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="glass-panel rounded-3xl p-8 border border-white/10 hover:border-[#C5A059]/40 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#1A1410] border border-white/10 flex items-center justify-center text-[#C5A059] group-hover:scale-110 group-hover:border-[#C5A059] transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono-code uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/10 text-[#F3E5AB]">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="font-editorial text-xl text-[#F5F0EB] mb-3 group-hover:text-[#F3E5AB] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-light mb-6">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-2">
                  {pillar.specs.map((spec, sidx) => (
                    <div key={sidx} className="flex items-center space-x-2 text-[11px] font-mono-code text-white/40">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]/80 shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
