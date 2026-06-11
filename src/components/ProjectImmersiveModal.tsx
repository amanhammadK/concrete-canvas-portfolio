import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectImmersiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    title: string;
    system: string;
    impact: string;
    link?: string;
  } | null;
}

export default function ProjectImmersiveModal({ isOpen, onClose, project }: ProjectImmersiveModalProps) {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 bg-[#030303] overflow-hidden flex"
        >
          {/* Noise Background Overlay */}
          <div 
            className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} 
          />

          {/* HTML Overlay HUD */}
          <div className="relative z-10 w-full h-full flex flex-col justify-between p-6 md:p-12 pointer-events-auto">
            
            <header className="flex justify-between items-start mb-6 shrink-0">
              <div className="flex flex-col gap-2">
                <span className="text-[#b2f5ea] font-mono text-xs tracking-[0.3em] uppercase">
                  Secure Connection Established
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
                  {project.title}
                </h2>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors shrink-0"
              >
                [X]
              </button>
            </header>

            <div className={`flex-grow flex flex-col lg:flex-row gap-6 min-h-0 ${!project.link ? 'items-center justify-center' : ''}`}>
              
              {/* Project Details Panel */}
              <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col gap-6 bg-[#080808] p-6 md:p-8 border border-white/10 shrink-0 overflow-y-auto">
                <div>
                  <h3 className="text-white/40 font-mono text-xs tracking-widest uppercase mb-3">System Architecture</h3>
                  <p className="text-white/80 text-sm md:text-base font-sans leading-relaxed">{project.system}</p>
                </div>
                <div className="w-full h-px bg-white/5" />
                <div>
                  <h3 className="text-[#b2f5ea]/50 font-mono text-xs tracking-widest uppercase mb-3">Measured Impact</h3>
                  <p className="text-[#b2f5ea] text-sm md:text-base font-sans leading-relaxed">{project.impact}</p>
                </div>
              </div>

              {/* Live Simulator Iframe (if link exists) */}
              {project.link && (
                <div className="flex-grow flex flex-col border border-[#b2f5ea]/30 bg-[#020202] relative shadow-[0_0_50px_rgba(178,245,234,0.08)] overflow-hidden min-h-[50vh]">
                  
                  {/* Brutalist AI Terminal Header */}
                  <div className="h-10 border-b border-[#b2f5ea]/20 flex justify-between items-center px-4 shrink-0 bg-[#050505]">
                    
                    {/* Left: Status & Target */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#b2f5ea] shadow-[0_0_8px_#b2f5ea] animate-pulse" />
                        <span className="text-[#b2f5ea] font-mono text-[10px] uppercase tracking-[0.2em] font-bold">Node_Active</span>
                      </div>
                      <span className="text-white/20">/</span>
                      <span className="text-white/40 font-mono text-[10px] uppercase tracking-widest hidden sm:block">
                        Target // [{project.link}]
                      </span>
                    </div>
                    
                    {/* Right: Technical Deco Elements */}
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-[2px] bg-white/20" />
                      <div className="w-4 h-[2px] bg-white/20" />
                      <div className="w-8 h-[2px] bg-[#b2f5ea]/60" />
                    </div>
                  </div>

                  {/* Iframe Wrapper */}
                  <div className="flex-grow relative bg-black">
                    <iframe 
                      src={project.link} 
                      className="absolute inset-0 w-full h-full border-none opacity-90 hover:opacity-100 transition-opacity duration-500"
                      title={`${project.title} Live Simulator`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    />
                  </div>
                </div>
              )}
            </div>

            <footer className="flex justify-between items-end mt-6 shrink-0">
              <div className="flex gap-6 items-center">
                <div className="text-white/30 font-mono text-xs uppercase tracking-widest">
                  Data Node // Status: {project.link ? 'Active Simulation' : 'Offline Documentation'}
                </div>
                {project.link && (
                  <a 
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white/50 hover:text-white font-mono text-xs uppercase tracking-[0.2em] transition-colors"
                  >
                    [ Open Externally ]
                  </a>
                )}
              </div>
              <div className="w-32 h-px bg-gradient-to-r from-transparent to-[#b2f5ea]/50 hidden md:block" />
            </footer>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
