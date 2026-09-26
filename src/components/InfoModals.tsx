import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, Mail, ShieldCheck, Layers } from 'lucide-react';

interface InfoModalsProps {
  activeTab: 'work' | 'about' | 'contact' | 'resume' | null;
  onClose: () => void;
}

const PROJECTS_DATA = [
  {
    title: "Let's Play (MVP)",
    role: "Lead Project Manager & QA Specialist",
    techStack: ["Expo", "React Native", "Supabase", "Stripe API", "Branch.io"],
    highlights:
      "Directed Agile delivery and full-stack feature ownership. Architected secure MVP financial workflows using Stripe Connect, defining strict escrow periods and automated withdrawals. Designed core matchmaking logic utilizing a swipe-based grammar and 3-list hierarchy, while enforcing strict anti-spam messaging gates at the database level.",
  },
  {
    title: "ChedMed (Multi-Vendor Marketplace)",
    role: "QA Analyst",
    techStack: ["Flutter", "React/Next.js", "Node.js", "PostgreSQL"],
    highlights:
      "Conducted deep technical root-cause analysis for complex defects, diagnosing React rendering cycle issues and Flutter widget state conflicts. Escalated and resolved critical production blockers including Next.js client-bundle leaks, database schema desynchronization, and authentication API vulnerabilities.",
  },
  {
    title: "ThinkLawn",
    role: "QA Lead / QA Engineer",
    techStack: ["Android OS", "AI/Computer Vision"],
    highlights:
      "Validated AI-powered computer vision models for agronomic health detection, ensuring accurate multi-label classification. Uncovered critical map rendering blockers and data integrity bugs in complex geospatial polygon plotting. Proposed critical business logic changes to decouple API queries, unblocking weather-aware features across 50+ countries.",
  },
  {
    title: "Blueprint (Fintech Mobile MVP)",
    role: "Lead QA Engineer",
    techStack: ["iOS", "Android (Smartphones & Tablets)", "Plaid API"],
    highlights:
      "Engineered core validation architecture for a financial MVP mapping full user journeys to backend data flows. Uncovered critical P1 security flaws including OTP bypasses and session management leaks. Diagnosed complex frontend issues such as infinite API fetch loops caused by unmemoized values and faulty dependency arrays in React hooks.",
  },
];

export const InfoModals: React.FC<InfoModalsProps> = ({ activeTab, onClose }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Keyboard accessibility: ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (activeTab) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, onClose]);

  if (!isMounted) return null;

  // Spring animation variants for Desktop Center Modal vs Mobile Bottom Sheet
  const modalVariants = {
    hidden: isMobile
      ? { y: '100%', opacity: 0.8, scale: 1 }
      : { opacity: 0, scale: 0.95, y: 15 },
    visible: isMobile
      ? {
          y: '0%',
          opacity: 1,
          scale: 1,
          transition: {
            type: 'spring',
            damping: 28,
            stiffness: 300,
          },
        }
      : {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: {
            type: 'spring',
            damping: 24,
            stiffness: 280,
          },
        },
    exit: isMobile
      ? {
          y: '100%',
          opacity: 0.5,
          transition: { duration: 0.22, ease: 'easeIn' },
        }
      : {
          opacity: 0,
          scale: 0.95,
          y: 10,
          transition: { duration: 0.18, ease: 'easeOut' },
        },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  return createPortal(
    <AnimatePresence>
      {activeTab && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 flex md:items-center items-end justify-center pointer-events-auto"
          style={{
            zIndex: 900000, // Very high z-index, lower only than CustomCursor (999999)
          }}
        >
          {/* Backdrop with frosted blur and darkened background */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-black/75 backdrop-blur-[6px]"
            onClick={onClose}
          />

          {/* Modal Card / Mobile Bottom Sheet */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`relative w-full text-white shadow-2xl overflow-hidden flex flex-col ${
              isMobile
                ? 'max-h-[88vh] rounded-t-[32px] border-t border-x border-white/20 bg-[#140E0B]/98 pb-safe'
                : 'max-w-2xl max-h-[85vh] rounded-3xl border border-white/20 bg-[#16110E]/95 m-4 sm:m-6'
            }`}
            style={{
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 0, 0, 0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Drag Indicator Handle */}
            {isMobile && (
              <div className="w-full flex items-center justify-center pt-3 pb-1 cursor-grab">
                <div className="w-10 h-1.5 rounded-full bg-white/30" />
              </div>
            )}

            {/* Modal Header Bar with Close Button */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-white/10 shrink-0">
              <span className="text-xs font-mono-code uppercase tracking-widest text-[#C5A059]">
                {activeTab === 'work' && 'Verified Portfolio'}
                {activeTab === 'about' && 'Professional Profile'}
                {activeTab === 'contact' && 'Communication Channel'}
                {activeTab === 'resume' && 'Professional Dossier'}
              </span>

              <button
                onClick={onClose}
                className="min-w-[44px] min-h-[44px] -mr-2 flex items-center justify-center rounded-full border border-white/20 bg-white/10 hover:bg-white/20 active:scale-90 text-white/80 hover:text-white transition-all cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-6 overscroll-contain">
              {/* WORK TAB */}
              {activeTab === 'work' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-editorial text-2xl sm:text-3xl text-white">
                      Featured Projects
                    </h2>
                    <p className="text-xs sm:text-sm text-white/70 font-light mt-1">
                      Production software delivery, mobile architectures, and automated verification.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {PROJECTS_DATA.map((proj, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 hover:border-white/30 transition-all space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-semibold text-base sm:text-lg text-white">{proj.title}</h3>
                          <span className="text-[10px] font-mono-code text-[#C5A059] px-2.5 py-0.5 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/10">
                            {proj.role}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed">
                          {proj.highlights}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {proj.techStack.map((tech, tidx) => (
                            <span
                              key={tidx}
                              className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ABOUT TAB */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-editorial text-2xl sm:text-3xl text-white">
                      About Mian Faseeh Ur Rehman
                    </h2>
                    <span className="text-xs font-mono-code text-[#C5A059] block mt-1">
                      Quality Assurance Engineer & Project Manager
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-white/90 font-light leading-relaxed">
                    I specialize in driving software excellence through rigorous quality assurance and strategic project management. By bridging the gap between technical execution and project delivery, I ensure complex applications are released flawlessly, on time, and aligned with core business objectives.
                  </p>

                  {/* Skills / Expertise Sections */}
                  <div className="space-y-4 pt-1">
                    {/* Quality Assurance & Testing */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 space-y-3">
                      <div className="flex items-center space-x-2 text-[#C5A059]">
                        <ShieldCheck className="w-4 h-4" />
                        <h4 className="font-semibold text-xs sm:text-sm tracking-wide uppercase font-mono-code text-white">
                          Quality Assurance & Testing
                        </h4>
                      </div>
                      <div className="space-y-2.5 text-xs text-white/80 font-light leading-relaxed">
                        <div>
                          <span className="font-medium text-white/95">End-to-End Testing:</span>{' '}
                          Expertise in designing comprehensive test plans and executing manual and automated testing protocols across web and mobile platforms.
                        </div>
                        <div>
                          <span className="font-medium text-white/95">Cross-Platform QA:</span>{' '}
                          Proficient in utilizing tools like Expo Dev for rigorous testing of mobile applications across diverse device environments.
                        </div>
                        <div>
                          <span className="font-medium text-white/95">Release Management:</span>{' '}
                          Experienced in orchestrating deployment pipelines, managing release cycles, and overseeing production rollouts via platforms like the Google Play Console.
                        </div>
                        <div>
                          <span className="font-medium text-white/95">Defect Lifecycle Management:</span>{' '}
                          Skilled at identifying, isolating, and tracking system vulnerabilities to ensure zero-downtime deployments and optimal software performance.
                        </div>
                      </div>
                    </div>

                    {/* Project Management */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 space-y-3">
                      <div className="flex items-center space-x-2 text-[#C5A059]">
                        <Layers className="w-4 h-4" />
                        <h4 className="font-semibold text-xs sm:text-sm tracking-wide uppercase font-mono-code text-white">
                          Project Management
                        </h4>
                      </div>
                      <div className="space-y-2.5 text-xs text-white/80 font-light leading-relaxed">
                        <div>
                          <span className="font-medium text-white/95">Lifecycle Management:</span>{' '}
                          Trained in formal Project Management Professional (PMP) methodologies, overseeing projects from initiation and planning through execution and successful closure.
                        </div>
                        <div>
                          <span className="font-medium text-white/95">Workflow Optimization:</span>{' '}
                          Focused on streamlining development cycles, optimizing resource allocation, and maintaining strict adherence to quality standards and timelines.
                        </div>
                        <div>
                          <span className="font-medium text-white/95">Cross-Functional Coordination:</span>{' '}
                          Adept at bridging communication between development, QA, and stakeholder teams to maintain project alignment and velocity.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CONTACT TAB */}
              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-editorial text-2xl sm:text-3xl text-white">
                      Let's Connect
                    </h2>
                    <p className="text-xs sm:text-sm text-white/70 font-light mt-1">
                      Direct inquiries for QA leadership, project coordination, and architecture validation.
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed">
                    Ready to discuss complex technical QA architectures, project management, or full-stack software optimization. Reach out directly via email or connect on LinkedIn.
                  </p>

                  <div className="space-y-3 pt-2">
                    {/* Email */}
                    <a
                      href="mailto:faseeh.khan456@gmail.com"
                      className="flex items-center justify-between p-4 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 active:scale-[0.98] transition-all text-sm group min-h-[48px]"
                    >
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-[#C5A059] shrink-0" />
                        <span className="font-mono-code text-xs sm:text-sm text-white/90 break-all">
                          faseeh.khan456@gmail.com
                        </span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors shrink-0" />
                    </a>

                    {/* LinkedIn */}
                    <a
                      href="https://www.linkedin.com/in/mian-faseeh-ur-rehman-097077299"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-4 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 active:scale-[0.98] transition-all text-sm group min-h-[48px]"
                    >
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 fill-[#C5A059] shrink-0" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                        <span className="font-mono-code text-xs sm:text-sm text-white/90">
                          linkedin.com/in/mian-faseeh-ur-rehman
                        </span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors shrink-0" />
                    </a>
                  </div>
                </div>
              )}

              {/* RESUME TAB */}
              {activeTab === 'resume' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="font-editorial text-2xl sm:text-3xl text-white">
                        Mian Faseeh Ur Rehman
                      </h2>
                      <span className="text-xs font-mono-code text-white/60">
                        QA Engineer & Project Manager
                      </span>
                    </div>
                    <a
                      href="mailto:faseeh.khan456@gmail.com?subject=Request%20for%20Resume%20-%20Mian%20Faseeh%20Ur%20Rehman"
                      className="min-h-[44px] px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs flex items-center space-x-2 hover:bg-white/90 active:scale-95 transition-all cursor-pointer shadow-lg"
                    >
                      <span>Request Resume</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="space-y-3.5 pt-2">
                    <div className="border-l-2 border-[#C5A059] pl-4 space-y-1">
                      <span className="text-[10px] font-mono-code text-[#C5A059] uppercase tracking-wider">
                        Lead Project Manager & QA Specialist
                      </span>
                      <h4 className="font-semibold text-sm">Let's Play (MVP)</h4>
                      <p className="text-xs text-white/70 font-light">
                        Full-stack feature ownership, Stripe Connect financial architecture, escrow logic, and anti-spam gates.
                      </p>
                    </div>

                    <div className="border-l-2 border-white/20 pl-4 space-y-1">
                      <span className="text-[10px] font-mono-code text-white/50 uppercase tracking-wider">
                        QA Analyst
                      </span>
                      <h4 className="font-semibold text-sm">ChedMed (Multi-Vendor Marketplace)</h4>
                      <p className="text-xs text-white/70 font-light">
                        Root-cause defect analysis, React render loop fixes, Flutter widget state conflicts, and authentication security.
                      </p>
                    </div>

                    <div className="border-l-2 border-white/20 pl-4 space-y-1">
                      <span className="text-[10px] font-mono-code text-white/50 uppercase tracking-wider">
                        QA Lead / QA Engineer
                      </span>
                      <h4 className="font-semibold text-sm">ThinkLawn</h4>
                      <p className="text-xs text-white/70 font-light">
                        Computer vision model validation, geospatial map rendering bug isolation, and weather-aware decoupling across 50+ countries.
                      </p>
                    </div>

                    <div className="border-l-2 border-white/20 pl-4 space-y-1">
                      <span className="text-[10px] font-mono-code text-white/50 uppercase tracking-wider">
                        Lead QA Engineer
                      </span>
                      <h4 className="font-semibold text-sm">Blueprint (Fintech Mobile MVP)</h4>
                      <p className="text-xs text-white/70 font-light">
                        Core validation architecture, Plaid integration, OTP bypass resolution, and React hook memoization fixes.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
