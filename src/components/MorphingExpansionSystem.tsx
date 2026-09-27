import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, Mail, ShieldCheck, Layers, Sparkles, CheckCircle2 } from 'lucide-react';
import { PROJECTS_DATA, ProjectItem } from '../data/portfolioData';

export type ExpansionType = 'work' | 'about' | 'contact' | 'resume' | string | null;

interface MorphingExpansionSystemProps {
  expandedId: ExpansionType;
  onClose: () => void;
  onSelectProject?: (projectId: string) => void;
}

// Snappy, luxurious Apple iOS spring parameters with fast settling to prevent reverse animation lag
export const SPRING_TRANSITION = {
  type: 'spring' as const,
  stiffness: 450,
  damping: 35,
  mass: 0.4,
};

// Staggered internal content sequencing variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.1, ease: 'easeOut' },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 450,
      damping: 35,
    },
  },
  exit: { opacity: 0, transition: { duration: 0.08 } },
};

export const MorphingExpansionSystem: React.FC<MorphingExpansionSystemProps> = ({
  expandedId,
  onClose,
  onSelectProject,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedProjectId) {
          setSelectedProjectId(null);
        } else {
          onClose();
        }
      }
    };
    if (expandedId) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expandedId, selectedProjectId, onClose]);

  // Touch Performance & Scroll Lock: prevent background scrolling when sheet/card is expanded
  useEffect(() => {
    if (expandedId) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [expandedId]);

  if (!isMounted) return null;

  // Determine active view mode
  const isWork = expandedId === 'work';
  const isAbout = expandedId === 'about';
  const isContact = expandedId === 'contact';
  const isResume = expandedId === 'resume';

  // Check if a specific project is selected from within or directly
  const activeProject = selectedProjectId
    ? PROJECTS_DATA.find((p) => p.id === selectedProjectId)
    : PROJECTS_DATA.find((p) => p.id === expandedId);

  // If a specific project was clicked directly or selected, show its deep detail panel
  const isProjectDetail = Boolean(activeProject);

  // LayoutId to match source navigation link or project card
  const layoutId = isProjectDetail
    ? `project-card-${activeProject?.id}`
    : expandedId === 'work'
    ? 'nav-item-work'
    : expandedId === 'about'
    ? 'nav-item-about'
    : expandedId === 'contact'
    ? 'nav-item-contact'
    : expandedId === 'resume'
    ? 'action-resume'
    : undefined;

  return createPortal(
    <AnimatePresence>
      {expandedId && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-6 md:p-8 pointer-events-auto"
          style={{
            zIndex: 900000, // Elevated layer, below CustomCursor (999999)
          }}
        >
          {/* Blurred Backdrop area that dismisses on click */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-[16px]"
            onClick={() => {
              if (selectedProjectId) {
                setSelectedProjectId(null);
              } else {
                onClose();
              }
            }}
          />

          {/* Morphing Detailed View Panel sharing layoutId & iOS Bottom Sheet styling on mobile */}
          <motion.div
            layoutId={layoutId}
            layout
            transition={SPRING_TRANSITION}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              // If dragged down by > 120px or with downward velocity > 300, dismiss
              if (info.offset.y > 120 || info.velocity.y > 300) {
                if (selectedProjectId) {
                  setSelectedProjectId(null);
                } else {
                  onClose();
                }
              }
            }}
            className="relative w-full max-w-full md:max-w-4xl h-[88vh] sm:h-auto max-h-[88vh] rounded-t-[28px] sm:rounded-[32px] text-white overflow-hidden flex flex-col shadow-2xl border-t sm:border border-white/20 sm:border-white/12"
            style={{
              background: 'rgba(18, 18, 24, 0.88)',
              backdropFilter: 'blur(28px) saturate(190%) contrast(108%)',
              WebkitBackdropFilter: 'blur(28px) saturate(190%) contrast(108%)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* iOS Bottom Sheet Drag Grab Handle Indicator (Mobile visible) */}
            <div className="sm:hidden pt-3 pb-1 flex justify-center w-full touch-none cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 rounded-full bg-white/25 active:bg-white/40 transition-colors" />
            </div>

            {/* Top Navigation & Dismiss Bar */}
            <div className="flex items-center justify-between px-5 sm:px-8 pt-3 sm:pt-6 pb-4 border-b border-white/10 shrink-0">
              <div className="flex items-center space-x-3">
                {selectedProjectId && (
                  <button
                    onClick={() => setSelectedProjectId(null)}
                    className="min-h-[44px] text-xs font-mono-code text-[#C5A059] hover:text-white transition-colors flex items-center space-x-1"
                  >
                    <span>← All Projects</span>
                  </button>
                )}
                <span className="text-xs font-mono-code uppercase tracking-widest text-[#C5A059]">
                  {isProjectDetail
                    ? `Project Dossier · ${activeProject?.category || 'Software'}`
                    : isWork
                    ? 'Verified Portfolio · Projects'
                    : isAbout
                    ? 'Executive Profile · QA & PM'
                    : isContact
                    ? 'Direct Line · Communication'
                    : 'Professional Dossier'}
                </span>
              </div>

              {/* Frosted Glass Dismiss Button (✕) */}
              <button
                onClick={() => {
                  if (selectedProjectId) {
                    setSelectedProjectId(null);
                  } else {
                    onClose();
                  }
                }}
                className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-full border border-white/20 bg-white/10 hover:bg-white/20 active:scale-90 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                aria-label="Close panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Staggered Content Area */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="overflow-y-auto p-6 sm:p-8 md:p-10 space-y-6 overscroll-contain"
            >
              {/* 1. PROJECT DETAIL VIEW */}
              {isProjectDetail && activeProject && (
                <div className="space-y-6">
                  <motion.div variants={itemVariants} className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h2 className="font-editorial text-3xl sm:text-4xl text-white">
                        {activeProject.title}
                      </h2>
                      <span className="text-xs font-mono-code text-[#C5A059] px-3.5 py-1 rounded-full border border-[#C5A059]/40 bg-[#C5A059]/10">
                        {activeProject.role}
                      </span>
                    </div>
                    <p className="text-xs font-mono-code uppercase tracking-wider text-white/60">
                      Core Validation & Delivery Scope
                    </p>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="p-6 rounded-2xl border border-white/12 bg-white/5 space-y-4"
                  >
                    <h4 className="text-xs font-mono-code uppercase tracking-widest text-[#C5A059]">
                      Architectural Analysis & QA Execution
                    </h4>
                    <p className="text-sm sm:text-base text-white/90 font-light leading-relaxed">
                      {activeProject.highlights}
                    </p>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-3">
                    <span className="text-xs font-mono-code uppercase tracking-wider text-white/70 block">
                      Technology & Protocol Stack
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {activeProject.techStack.map((tech, tidx) => (
                        <span
                          key={tidx}
                          className="text-xs font-mono-code px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-white/90"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="pt-2 flex items-center space-x-4">
                    <button
                      onClick={() => setSelectedProjectId(null)}
                      className="px-5 py-2.5 rounded-full border border-white/30 hover:border-white text-xs font-mono-code text-white/80 hover:text-white transition-all"
                    >
                      ← Back to Overview
                    </button>
                    <a
                      href="mailto:faseeh.khan456@gmail.com?subject=Inquiry%20regarding%20project:%20"
                      className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs flex items-center space-x-2 hover:bg-white/95 active:scale-95 transition-all"
                    >
                      <span>Inquire About Architecture</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </motion.div>
                </div>
              )}

              {/* 2. WORK (PROJECTS SHOWCASE) VIEW */}
              {isWork && !isProjectDetail && (
                <div className="space-y-6">
                  <motion.div variants={itemVariants}>
                    <h2 className="font-editorial text-3xl sm:text-4xl text-white">
                      Featured Projects
                    </h2>
                    <p className="text-xs sm:text-sm text-white/70 font-light mt-1">
                      Click any project card to morph into its full technical dossier and defect analysis.
                    </p>
                  </motion.div>

                  <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {PROJECTS_DATA.map((proj) => (
                      <motion.div
                        key={proj.id}
                        layoutId={`project-card-${proj.id}`}
                        onClick={() => setSelectedProjectId(proj.id)}
                        className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-white/40 hover:bg-white/8 active:scale-[0.98] transition-all cursor-pointer space-y-3 group"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-base sm:text-lg text-white group-hover:text-[#C5A059] transition-colors">
                            {proj.title}
                          </h3>
                          <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>

                        <span className="text-[10px] font-mono-code text-[#C5A059] px-2 py-0.5 rounded border border-[#C5A059]/30 bg-[#C5A059]/10 inline-block">
                          {proj.role}
                        </span>

                        <p className="text-xs text-white/75 font-light leading-relaxed line-clamp-3">
                          {proj.highlights}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {proj.techStack.slice(0, 3).map((tech, tidx) => (
                            <span
                              key={tidx}
                              className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60"
                            >
                              {tech}
                            </span>
                          ))}
                          {proj.techStack.length > 3 && (
                            <span className="text-[10px] font-mono-code px-2 py-0.5 text-white/40">
                              +{proj.techStack.length - 3} more
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )}

              {/* 3. ABOUT TAB (QA & PM FOCUS) */}
              {isAbout && !isProjectDetail && (
                <div className="space-y-6">
                  <motion.div variants={itemVariants}>
                    <h2 className="font-editorial text-3xl sm:text-4xl text-white">
                      Mian Faseeh Ur Rehman
                    </h2>
                    <span className="text-xs font-mono-code text-[#C5A059] block mt-1">
                      Quality Assurance Engineer & Project Manager
                    </span>
                  </motion.div>

                  <motion.p
                    variants={itemVariants}
                    className="text-sm sm:text-base text-white/90 font-light leading-relaxed"
                  >
                    I specialize in driving software excellence through rigorous quality assurance and strategic project management. By bridging the gap between technical execution and project delivery, I ensure complex applications are released flawlessly, on time, and aligned with core business objectives.
                  </motion.p>

                  <motion.div variants={itemVariants} className="space-y-4 pt-1">
                    {/* QA & Testing Section */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
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

                    {/* PM Section */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
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
                  </motion.div>
                </div>
              )}

              {/* 4. CONTACT TAB */}
              {isContact && !isProjectDetail && (
                <div className="space-y-6">
                  <motion.div variants={itemVariants}>
                    <h2 className="font-editorial text-3xl sm:text-4xl text-white">
                      Let's Connect
                    </h2>
                    <p className="text-xs sm:text-sm text-white/70 font-light mt-1">
                      Direct inquiries for QA leadership, project coordination, and architecture validation.
                    </p>
                  </motion.div>

                  <motion.p
                    variants={itemVariants}
                    className="text-sm sm:text-base text-white/85 font-light leading-relaxed"
                  >
                    Ready to discuss complex technical QA architectures, project management, or full-stack software optimization. Reach out directly via email or connect on LinkedIn.
                  </motion.p>

                  <motion.div variants={itemVariants} className="space-y-3 pt-2">
                    <a
                      href="mailto:faseeh.khan456@gmail.com"
                      className="flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 active:scale-[0.99] transition-all text-sm group"
                    >
                      <div className="flex items-center space-x-3.5">
                        <Mail className="w-5 h-5 text-[#C5A059] shrink-0" />
                        <span className="font-mono-code text-xs sm:text-sm text-white/90 break-all">
                          faseeh.khan456@gmail.com
                        </span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors shrink-0" />
                    </a>

                    <a
                      href="https://www.linkedin.com/in/mian-faseeh-ur-rehman-097077299"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 active:scale-[0.99] transition-all text-sm group"
                    >
                      <div className="flex items-center space-x-3.5">
                        <svg className="w-5 h-5 fill-[#C5A059] shrink-0" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                        <span className="font-mono-code text-xs sm:text-sm text-white/90">
                          linkedin.com/in/mian-faseeh-ur-rehman
                        </span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors shrink-0" />
                    </a>
                  </motion.div>
                </div>
              )}

              {/* 5. RESUME TAB */}
              {isResume && !isProjectDetail && (
                <div className="space-y-6">
                  <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="font-editorial text-3xl sm:text-4xl text-white">
                        Mian Faseeh Ur Rehman
                      </h2>
                      <span className="text-xs font-mono-code text-white/60">
                        QA Engineer & Project Manager
                      </span>
                    </div>
                    <a
                      href="mailto:faseeh.khan456@gmail.com?subject=Request%20for%20Resume%20-%20Mian%20Faseeh%20Ur%20Rehman"
                      className="min-h-[44px] px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs flex items-center space-x-2 hover:bg-white/90 active:scale-95 transition-all cursor-pointer shadow-lg"
                    >
                      <span>Request Resume</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-3.5 pt-2">
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
                  </motion.div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
