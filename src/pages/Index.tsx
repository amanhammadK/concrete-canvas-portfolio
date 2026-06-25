import { useRef, useEffect, useState, Suspense } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ReactLenis } from '@studio-freight/react-lenis';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';

import MagnifyingCursor from '@/components/MagnifyingCursor';
import CinematicNodes from '@/components/CinematicNodes';
import BlackHoleScreen from '@/components/BlackHoleScreen';
import ProjectImmersiveModal from '@/components/ProjectImmersiveModal';

/* ── Typewriter Helper ── */
function TypewriterConsole({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState('');
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="flex items-center gap-2 font-mono text-sm text-white/70 px-4 py-2 border border-white/20 bg-black/40 backdrop-blur-md">
      <span className="text-white/50">{'>'}</span>
      <span>{displayedText}</span>
      <span className="inline-block w-2 h-4 bg-white/70 animate-pulse" />
    </div>
  );
}

/* ── Hero Parallax Wrapper ── */
function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  return (
    <section ref={ref} className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-transparent">
      <motion.div 
        style={{ y, opacity, scale }}
        className="relative z-10 flex flex-col items-center text-center px-4 pointer-events-none"
      >
        <div className="mb-6"><TypewriterConsole text="system.init('Aman Hammad');" /></div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85] mix-blend-difference">
          I build agentic systems<br />that <span className="text-transparent outline-text-white">actually ship.</span>
        </h1>
        <p className="mt-8 text-white/50 font-mono text-sm tracking-[0.2em] uppercase max-w-sm drop-shadow-[0_0_5px_rgba(0,0,0,0.8)]">
          Autonomous AI infrastructure. Raw. Effective. Production-ready.
        </p>
      </motion.div>
    </section>
  );
}

/* ── Timeline & Certs Wrapper ── */
function Timeline() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });
  
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const experience = [
    { period: "2024 — 2026", company: "TechSys AI LLC", role: "Full-Stack AI Developer" },
    { period: "2024 — PRES", company: "PIAIC", role: "AI Developer" }
  ];

  const certifications = [
    { title: "Artificial Intelligence Diploma (Agentic AI)", issuer: "PIAIC" },
    { title: "Google AI Professional Specialization", issuer: "Google" },
    { title: "Agentic AI Professional & Prompt Engineering", issuer: "PIAIC" },
    { title: "Machine Learning & AI with Python", issuer: "Harvard" },
    { title: "RAG and Agentic AI Professional", issuer: "IBM" },
    { title: "Machine Learning", issuer: "MIT" },
    { title: "CS50: Intro to Computer Science", issuer: "Harvard" }
  ];

  return (
    <section ref={containerRef} className="py-32 relative bg-[#030303]">
      <div className="max-w-4xl mx-auto px-6 relative">
        <div className="flex flex-col mb-24 items-center text-center">
          <span className="text-white/30 text-xs font-mono tracking-[0.3em] uppercase mb-4 drop-shadow-md">04 // Vector Grid</span>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter drop-shadow-lg">Trajectory</h2>
        </div>

        {/* The Animated Line */}
        <div className="absolute left-6 md:left-1/2 top-48 bottom-[30%] w-px bg-white/10 origin-top">
          <motion.div 
            className="w-full h-full bg-[#b2f5ea] shadow-[0_0_10px_#b2f5ea]"
            style={{ scaleY, originY: 0 }}
          />
        </div>

        <div className="flex flex-col gap-24 relative z-10 mb-32">
          {experience.map((exp, i) => {
            const isEven = i % 2 === 0;
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`flex flex-col md:w-1/2 ${isEven ? 'md:ml-auto md:pl-12' : 'md:mr-auto md:pr-12 md:items-end md:text-right'} pl-8`}
              >
                <span className="text-[#b2f5ea] font-mono text-xs tracking-widest uppercase mb-2 drop-shadow-md">{exp.period}</span>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-1 drop-shadow-lg">{exp.company}</h3>
                <span className="text-white/50 font-mono text-sm tracking-widest uppercase drop-shadow-md">{exp.role}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Brutalist Certifications Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto mt-24 border-t border-white/10 pt-16"
        >
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-white/20 font-mono text-xs tracking-[0.3em] uppercase mb-4 drop-shadow-md">Verified Credentials</span>
            <h3 className="text-2xl md:text-3xl font-black text-white/90 uppercase tracking-tight">Certifications</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.map((cert, i) => (
              <div key={i} className="group relative border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] p-6 transition-all duration-300 overflow-hidden cursor-default">
                <div className="absolute top-0 left-0 w-1 h-0 bg-[#b2f5ea] group-hover:h-full transition-all duration-300" />
                <div className="flex flex-col gap-2">
                  <div className="text-[#b2f5ea] font-mono text-[10px] tracking-widest uppercase">
                    {cert.issuer}
                  </div>
                  <div className="text-white/80 font-sans text-sm md:text-base leading-tight font-medium group-hover:text-white transition-colors">
                    {cert.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════════════════════════ */
export default function Index() {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('amanhammadk@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const TECH_STACK = [
    { 
      category: "AI & Agents", 
      techs: ["LangGraph", "LiteLLM", "OpenAI", "DeepSeek", "Advanced RAG", "Agentic Workflows"] 
    },
    { 
      category: "Backend & APIs", 
      techs: ["Python", "FastAPI", "Node.js", "REST Architecture", "Serverless", "Webhooks"] 
    },
    { 
      category: "Frontend & Full-Stack", 
      techs: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vite", "Three.js"] 
    },
    { 
      category: "Databases & DevOps", 
      techs: ["PostgreSQL", "Supabase", "Docker", "Vercel", "n8n", "Semantic Caching"] 
    }
  ];

  const COMMERCIAL_PROJECTS = [
    {
      title: "N×M",
      system: "A model-agnostic marketplace where developers can publish AI tools, prompts, and workflows, allowing autonomous agents to discover and transact them directly.",
      impact: "Solves the distribution problem for AI tooling by providing interactive sandboxes, automated payout splits, and custom rate limiting for secure, scalable agent interactions.",
      link: "https://nx-m.vercel.app/"
    },
    {
      title: "FinanceGPT",
      system: "A production-ready conversational web application scaffold designed to accelerate development cycles through AI-powered coding assistance and intelligent project generation.",
      impact: "Eliminates the boilerplate of building enterprise AI apps by providing a fully integrated foundation with pre-configured authentication, state management, and real-time data handling.",
      link: "https://financegptwebsite.vercel.app"
    },
    {
      title: "BlurBox",
      system: "A privacy-first email triage platform that analyzes inbound communication tone to provide emotional-regulation guardrails for users dealing with high-stress inboxes.",
      impact: "Reduces workplace anxiety through a stateless 'Panic Mode' that intercepts aggressive language, applies dynamic visual blurring, and generates neutral, clinical safety summaries.",
      link: "https://blurbox-ftqnwbid1-nobodyy-3s-projects.vercel.app"
    },
    {
      title: "Car Marketplace (Aramco)",
      system: "A comprehensive digital platform for automotive enthusiasts that unifies a high-end marketing experience, a peer-to-peer car marketplace, and an inventory admin dashboard.",
      impact: "Streamlines the automotive buying experience by seamlessly managing certified 200+ point vehicle inspections alongside an integrated e-commerce auto parts storefront.",
    },
    {
      title: "Burn-My-Portfolio",
      system: "A gamified consumer web app that uses an aggressive hedge fund AI persona to ruthlessly analyze and roast users' financial holdings for entertainment.",
      impact: "Transforms dry financial analytics into a highly engaging, interactive experience that quickly delivers cynical market insights with fluid, responsive feedback.",
      link: "https://burn-my-portfolio.vercel.app"
    }
  ];

  const OPEN_SOURCE = [
    {
      title: "AI-Slop Linter",
      system: "A tool that uses the OpenAI API to automatically detect AI-generated hallucinations and lazy coding patterns in source code."
    },
    {
      title: "Prompt-Improver",
      system: "A framework for A/B testing AI prompts, allowing developers to mathematically benchmark which prompt performs better."
    },
    {
      title: "Code Review Agent",
      system: "An automated system that uses LLMs to perform intelligent code reviews and identify bugs or anti-patterns before merging."
    },
    {
      title: "Commit Message AI",
      system: "A developer utility that automatically analyzes Git diffs and generates semantic, conventional commit messages using AI."
    },
    {
      title: "Model Hop",
      system: "A unified interface to seamlessly route prompts across different LLM providers (OpenAI, Anthropic, DeepSeek) for comparative testing."
    },
    {
      title: "JSON to Schema",
      system: "A fast utility to automatically generate fully typed JSON schemas and TypeScript interfaces from raw JSON payloads."
    }
  ];

  return (
    <ReactLenis root options={{ lerp: 0.05, syncTouch: true }}>
      <div className="bg-[#030303] min-h-screen font-mono selection:bg-[#b2f5ea] selection:text-black">
        <MagnifyingCursor />

        {/* ── GLOBAL 3D CANVAS (Optimized Fixed Layer) ── */}
        <div className="fixed inset-0 z-0 opacity-60 pointer-events-none">
          <Suspense fallback={null}>
            <Canvas camera={{ position: [0, 0, 15], fov: 60 }} dpr={[1, 1]}>
              <color attach="background" args={['#030303']} />
              <ambientLight intensity={0.5} />
              <CinematicNodes count={2500} />
              <EffectComposer>
                <Bloom luminanceThreshold={0.4} luminanceSmoothing={0.9} height={200} intensity={0.5} />
              </EffectComposer>
            </Canvas>
          </Suspense>
        </div>

        {/* ── MAIN CONTENT WRAPPER ── */}
        <main className="relative z-10 shadow-[0_20px_50px_rgba(0,0,0,1)] bg-transparent">
          
          <HeroSection />

          {/* ── ABOUT SECTION ── */}
          <section className="py-32 px-6 border-b border-white/5 flex flex-col items-center text-center bg-[#030303] relative overflow-hidden z-10">
            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#b2f5ea]/[0.03] rounded-full blur-[120px] pointer-events-none" />
            
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl relative z-10"
            >
              <span className="text-white/30 text-xs font-mono tracking-[0.3em] uppercase mb-8 block drop-shadow-md">00 // Operations</span>
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-tight drop-shadow-lg">
                I engineer autonomous infrastructure that scales.
              </h2>
              <p className="mt-8 text-white/70 text-lg font-sans drop-shadow-md leading-relaxed">
                Analytical and project-driven AI Developer with 2 years of intensive, hands-on experience building autonomous agentic workflows and LLM-driven applications. Expert in LLM orchestration, custom data retrieval pipelines, and deploying full-stack systems—from resilient FastAPI backends to dynamic React frontends.
              </p>
            </motion.div>
          </section>

          {/* ── TECH STACK AREA (Prominent Mint Section) ── */}
          <section className="py-32 px-6 border-y border-[#b2f5ea]/20 bg-[#050505] relative shadow-[inset_0_0_100px_rgba(178,245,234,0.1)] z-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20 pointer-events-none mix-blend-overlay" />
            
            {/* Massive breathing mint glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#b2f5ea]/10 rounded-full blur-[200px] pointer-events-none animate-pulse" />
            
            <div className="max-w-6xl mx-auto relative z-10">
              <div className="flex flex-col mb-24 items-center text-center">
                <span className="text-[#b2f5ea] text-xs font-mono tracking-[0.3em] uppercase mb-4 drop-shadow-[0_0_10px_rgba(178,245,234,0.8)]">01 // Architecture</span>
                <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter drop-shadow-lg">
                  <span className="text-[#b2f5ea] drop-shadow-[0_0_20px_rgba(178,245,234,0.5)]">Tech</span> Stack
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {TECH_STACK.map((stack, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="p-8 border border-[#b2f5ea]/20 bg-black/40 backdrop-blur-xl hover:bg-[#b2f5ea]/10 transition-all duration-500 group relative overflow-hidden rounded-2xl shadow-[0_0_30px_rgba(178,245,234,0.05)]"
                  >
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#b2f5ea] to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute -inset-24 bg-[#b2f5ea]/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    
                    <h3 className="text-white font-black uppercase tracking-tighter text-2xl mb-8 group-hover:text-[#b2f5ea] transition-colors relative z-10 drop-shadow-md">{stack.category}</h3>
                    
                    <div className="flex flex-wrap gap-3 relative z-10">
                      {stack.techs.map((tech, j) => (
                        <span 
                          key={j} 
                          className="px-4 py-2 border border-[#b2f5ea]/30 bg-[#b2f5ea]/[0.05] hover:bg-[#b2f5ea]/20 hover:border-[#b2f5ea] hover:text-white text-[#b2f5ea] transition-all duration-300 rounded-full text-xs font-mono uppercase tracking-widest cursor-default shadow-[0_0_15px_rgba(178,245,234,0.1)]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── PROPRIETARY PROJECTS (Sticky Stacking + Blackhole Grid Window) ── */}
          <section className="py-32 px-6 relative overflow-hidden z-10">
            
            {/* Animated WebGL Black Hole Shader Background */}
            <BlackHoleScreen />

            {/* Dark overlay so the text and cards remain pristine and readable against the background image */}
            <div className="absolute inset-0 bg-black/80 z-0 pointer-events-none mix-blend-multiply" />
            
            <div className="absolute -left-[20%] top-[10%] w-[50%] h-[50%] bg-[#b2f5ea]/[0.02] blur-[150px] rounded-full pointer-events-none z-0" />
            <div className="absolute -right-[20%] bottom-[10%] w-[50%] h-[50%] bg-[#b2f5ea]/[0.01] blur-[150px] rounded-full pointer-events-none z-0" />
            
            <div className="max-w-5xl mx-auto relative z-10">
              <div className="flex flex-col mb-24 items-center text-center py-12 border border-transparent rounded-3xl backdrop-blur-sm bg-black/20">
                <span className="text-white/40 text-xs font-mono tracking-[0.3em] uppercase mb-4 drop-shadow-md">02 // Commercial</span>
                <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter drop-shadow-[0_0_30px_rgba(0,0,0,1)]">Proprietary Builds</h2>
              </div>
              
              <div className="relative">
                {COMMERCIAL_PROJECTS.map((project, i) => (
                  <div 
                    key={i}
                    className="sticky w-full mb-24 shadow-[0_-15px_40px_rgba(0,0,0,0.9)]"
                    style={{ top: `calc(10vh + ${i * 40}px)` }}
                  >
                    <div className="bg-[#050505]/90 backdrop-blur-2xl border border-white/10 p-8 md:p-12 flex flex-col justify-between min-h-[50vh] hover:border-[#b2f5ea]/30 transition-all duration-500 overflow-hidden relative group">
                      
                      {/* Subtle hover glow inside the card */}
                      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#b2f5ea]/10 blur-[100px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-10">
                          <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter drop-shadow-lg group-hover:text-[#b2f5ea] transition-colors duration-500">{project.title}</h3>
                          <span className="text-white/30 font-mono text-xs tracking-widest uppercase">0{i+1}</span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-12 text-white/80 font-sans text-sm md:text-base leading-relaxed">
                          <div className="border-l border-white/5 pl-6">
                            <strong className="text-white/40 font-mono text-xs uppercase tracking-widest block mb-3">System</strong>
                            <p className="drop-shadow-md text-white/70">{project.system}</p>
                          </div>
                          <div className="border-l border-[#b2f5ea]/20 pl-6 bg-gradient-to-r from-[#b2f5ea]/[0.02] to-transparent">
                            <strong className="text-[#b2f5ea] font-mono text-xs uppercase tracking-widest block mb-3">Impact</strong>
                            <p className="drop-shadow-md text-white/90">{project.impact}</p>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => setSelectedProject(project)}
                        className="mt-16 self-start text-xs font-mono text-white/90 uppercase tracking-[0.2em] border border-white/20 bg-white/5 hover:bg-[#b2f5ea]/20 hover:border-[#b2f5ea] hover:text-[#b2f5ea] transition-all duration-300 px-6 py-3 rounded-full flex items-center gap-3 relative z-10 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                      >
                        Launch Simulation <span className="text-white/50 transition-colors">→</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── OPEN SOURCE TOOLS (Terminal Grid) ── */}
          <section className="py-32 px-6 border-y border-white/10 bg-[#080808] relative shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-transparent pointer-events-none" />
            <div className="max-w-6xl mx-auto relative z-10">
              <div className="flex flex-col mb-24 items-center text-center">
                <span className="text-white/30 text-xs font-mono tracking-[0.3em] uppercase mb-4 drop-shadow-md">03 // Community</span>
                <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter drop-shadow-lg">Developer Tools</h2>
                <p className="text-white/50 mt-4 font-mono text-xs uppercase tracking-widest drop-shadow-md">Open Source Initiatives</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {OPEN_SOURCE.map((project, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="p-8 border border-white/5 bg-white/[0.01] backdrop-blur-lg flex flex-col group hover:border-[#b2f5ea]/30 transition-all duration-500 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#b2f5ea]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="flex items-center gap-2 mb-8 pb-4 border-b border-white/5 group-hover:border-white/10 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-red-500/50" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                      <div className="w-2 h-2 rounded-full bg-green-500/50" />
                      <span className="ml-auto text-[10px] text-white/30 font-mono tracking-widest uppercase">bash</span>
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 group-hover:text-[#b2f5ea] transition-colors">{project.title}</h3>
                    <p className="text-white/50 font-sans text-sm leading-relaxed mb-8 flex-1">{project.system}</p>
                    <a href="https://github.com/amanhammadK" target="_blank" rel="noreferrer" className="text-xs font-mono text-white/40 hover:text-[#b2f5ea] uppercase tracking-widest flex items-center gap-2 transition-colors mt-auto">
                      View Source <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <Timeline />

          {/* ── FOOTER ── */}
          <footer className="relative w-full min-h-[50vh] flex flex-col justify-center items-center text-center bg-[#010101] border-t border-white/5 z-10 py-32 px-6">
            <div className="w-16 h-16 border border-white/10 flex items-center justify-center rounded-full mb-8">
              <div className="w-2 h-2 bg-[#b2f5ea] rounded-full animate-pulse" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-lg">
              Let's Connect
            </h2>
            <p className="text-white/50 font-mono text-sm uppercase tracking-widest mb-16 drop-shadow-md">Open to new opportunities</p>
            
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 pointer-events-auto">
              <a href="mailto:amanhammadk@gmail.com" className="group flex flex-col items-center gap-3">
                <span className="text-white/30 text-[10px] font-mono tracking-widest uppercase group-hover:text-[#b2f5ea] transition-colors">Email</span>
                <span className="text-white/80 font-sans text-sm md:text-base hover:text-white transition-colors">amanhammadk@gmail.com</span>
              </a>
              <div className="hidden md:block w-px h-12 bg-white/10" />
              <a href="tel:+923264991959" className="group flex flex-col items-center gap-3">
                <span className="text-white/30 text-[10px] font-mono tracking-widest uppercase group-hover:text-[#b2f5ea] transition-colors">Phone</span>
                <span className="text-white/80 font-sans text-sm md:text-base hover:text-white transition-colors">+92 326 499 1959</span>
              </a>
              <div className="hidden md:block w-px h-12 bg-white/10" />
              <div className="flex gap-8 items-center">
                <a href="https://github.com/amanhammadK" target="_blank" rel="noreferrer" className="group flex flex-col items-center gap-3">
                  <span className="text-white/30 text-[10px] font-mono tracking-widest uppercase group-hover:text-[#b2f5ea] transition-colors">GitHub</span>
                  <span className="text-white/80 font-sans text-sm md:text-base hover:text-white transition-colors">amanhammadK</span>
                </a>
                <a href="https://linkedin.com/in/aman-hammad-509445380" target="_blank" rel="noreferrer" className="group flex flex-col items-center gap-3">
                  <span className="text-white/30 text-[10px] font-mono tracking-widest uppercase group-hover:text-[#b2f5ea] transition-colors">LinkedIn</span>
                  <span className="text-white/80 font-sans text-sm md:text-base hover:text-white transition-colors">Connect</span>
                </a>
              </div>
            </div>

            <div className="absolute bottom-8 text-white/30 text-xs font-mono uppercase tracking-widest flex w-full justify-center px-12 pointer-events-auto">
              <span>© 2026 Aman Hammad</span>
            </div>
          </footer>

        </main>
      </div>

      <ProjectImmersiveModal 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
        project={selectedProject} 
      />
    </ReactLenis>
  );
}
