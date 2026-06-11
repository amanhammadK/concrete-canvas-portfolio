import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const experiences = [
  {
    id: "01",
    title: "TECHSYS AI LLC",
    description: "AI Financial Trading Platform & Embedded Advisory Agent.",
    tags: ["PYTHON", "LANGCHAIN", "FASTAPI"],
    span: "col-span-2 row-span-2",
  },
  {
    id: "02",
    title: "FINANCEGPT",
    description: "Proprietary trading analysis SaaS with a conversational agent.",
    tags: ["REACT", "LLM", "DOCKER"],
    span: "col-span-1 row-span-2",
  },
  {
    id: "03",
    title: "PIAIC",
    description: "Advanced AI Implementation, Agentic workflows using n8n and LangGraph.",
    tags: ["N8N", "LANGGRAPH", "AI"],
    span: "col-span-1 row-span-1",
  },
  {
    id: "04",
    title: "[PLACEHOLDER]",
    description: "Coming soon.",
    tags: [],
    span: "col-span-1 row-span-1",
  },
  {
    id: "05",
    title: "[PLACEHOLDER]",
    description: "Coming soon.",
    tags: [],
    span: "col-span-1 row-span-1",
  },
  {
    id: "06",
    title: "[PLACEHOLDER]",
    description: "Coming soon.",
    tags: [],
    span: "col-span-2 row-span-1",
  },
];

const techStack = [
  "PYTHON",
  "REACT",
  "N8N",
  "LANGGRAPH",
  "THREE.JS",
  "DOCKER",
  "FASTAPI",
  "LANGCHAIN",
  "TYPESCRIPT",
  "NEXT.JS",
  "SUPABASE",
  "OPENAI",
];

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function BentoCard({ item, index }: { item: typeof experiences[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9, y: 40 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
      className={`${item.span} border border-foreground/10 p-6 md:p-8 group cursor-pointer relative overflow-hidden`}
    >
      {/* Hover fill effect */}
      <motion.div
        className="absolute inset-0 bg-foreground/5"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "left" }}
      />

      <div className="relative z-10 h-full flex flex-col justify-between">
        <div>
          <span className="text-brutalist-light text-muted-foreground text-xs block mb-4">
            {item.id}
          </span>
          <h3 className="text-brutalist text-foreground text-xl md:text-2xl lg:text-3xl mb-3">
            {item.title}
          </h3>
          <p className="text-brutalist-light text-muted-foreground text-xs leading-relaxed max-w-md">
            {item.description}
          </p>
        </div>

        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-brutalist-light text-foreground/40 text-[10px] border border-foreground/10 px-2 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Marquee() {
  return (
    <div className="overflow-hidden border-t border-b border-foreground/10 py-5">
      <motion.div
        className="flex whitespace-nowrap gap-8"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity }}
      >
        {[...techStack, ...techStack].map((tech, i) => (
          <span
            key={i}
            className="text-brutalist text-foreground/20 text-4xl md:text-6xl lg:text-8xl"
          >
            {tech}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function MagneticLink({ children, href = "#" }: { children: React.ReactNode; href?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);

  return (
    <motion.a
      ref={ref}
      href={href}
      className="text-brutalist-light text-foreground text-xs tracking-[0.3em] relative"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
      <motion.span
        className="absolute bottom-0 left-0 w-full h-px bg-foreground"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
        style={{ transformOrigin: "left" }}
      />
    </motion.a>
  );
}

export default function BrutalistOverlay() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  return (
    <div className="relative min-h-screen select-none">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-start p-6 md:p-10 mix-difference">
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-brutalist-light text-foreground text-xs tracking-[0.3em]"
        >
          AH.
        </motion.span>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex gap-8 md:gap-12"
        >
          {["WORK", "ABOUT", "CONTACT"].map((item) => (
            <MagneticLink key={item} href={`#${item.toLowerCase()}`}>
              {item}
            </MagneticLink>
          ))}
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="flex flex-col justify-center min-h-screen px-6 md:px-10 mix-difference">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="mt-20"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.5 }}
          >
            <motion.h1
              className="text-brutalist text-foreground text-[12vw] md:text-[11vw] leading-[0.85]"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              AMAN
            </motion.h1>
            <motion.h1
              className="text-brutalist text-foreground text-[12vw] md:text-[11vw] leading-[0.85]"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              HAMMAD
            </motion.h1>
          </motion.div>

          <motion.div
            className="mt-8 md:mt-12 flex items-end justify-between"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div>
              <p className="text-brutalist-light text-muted-foreground text-xs md:text-sm tracking-[0.2em]">
                AI SOLUTIONS DEVELOPER
              </p>
            </div>
            <span className="text-brutalist-light text-muted-foreground text-xs">
              SCROLL ↓
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="px-6 md:px-10 py-32 mix-difference">
        <AnimatedSection>
          <div className="border-t border-foreground/10 pt-8 mb-16">
            <span className="text-brutalist-light text-muted-foreground text-xs tracking-[0.3em]">
              ABOUT
            </span>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          <AnimatedSection>
            <p className="text-brutalist text-foreground text-2xl md:text-4xl lg:text-5xl leading-[1.1]">
              3+ YEARS OF FULL-STACK DEVELOPMENT.
            </p>
          </AnimatedSection>
          <AnimatedSection>
            <p className="text-brutalist-light text-muted-foreground text-sm md:text-base leading-relaxed max-w-lg">
              SPECIALIZING IN AUTONOMOUS AI AGENTS, LLM INTEGRATIONS, AND INTELLIGENT SYSTEMS. 
              BUILDING THE INFRASTRUCTURE THAT BRIDGES HUMAN INTENT WITH MACHINE CAPABILITY.
            </p>
            <div className="mt-12 flex gap-12">
              <div>
                <span className="text-brutalist text-foreground text-4xl md:text-6xl">3+</span>
                <p className="text-brutalist-light text-muted-foreground text-xs mt-2">YEARS EXP</p>
              </div>
              <div>
                <span className="text-brutalist text-foreground text-4xl md:text-6xl">15+</span>
                <p className="text-brutalist-light text-muted-foreground text-xs mt-2">PROJECTS</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Marquee */}
      <Marquee />

      {/* Bento Grid Experience Section */}
      <section id="work" className="px-6 md:px-10 py-32 mix-difference">
        <AnimatedSection>
          <div className="border-t border-foreground/10 pt-8 mb-16">
            <span className="text-brutalist-light text-muted-foreground text-xs tracking-[0.3em]">
              SELECTED WORKS
            </span>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[200px] md:auto-rows-[220px] gap-[1px]">
          {experiences.map((item, index) => (
            <BentoCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </section>

      {/* Second Marquee */}
      <Marquee />

      {/* Contact / Footer */}
      <footer id="contact" className="px-6 md:px-10 py-32 mix-difference">
        <AnimatedSection>
          <div className="border-t border-foreground/10 pt-8 mb-16">
            <span className="text-brutalist-light text-muted-foreground text-xs tracking-[0.3em]">
              CONTACT
            </span>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
            <div>
              <motion.p
                className="text-brutalist text-foreground text-5xl md:text-7xl lg:text-9xl leading-[0.85]"
                whileHover={{ x: 20 }}
                transition={{ duration: 0.4 }}
              >
                LET'S
              </motion.p>
              <motion.p
                className="text-brutalist text-foreground text-5xl md:text-7xl lg:text-9xl leading-[0.85]"
                whileHover={{ x: 20 }}
                transition={{ duration: 0.4 }}
              >
                BUILD.
              </motion.p>
            </div>
            <div className="text-right">
              <p className="text-brutalist-light text-muted-foreground text-xs leading-loose">
                <MagneticLink href="mailto:hello@amanhammad.dev">HELLO@AMANHAMMAD.DEV</MagneticLink>
              </p>
              <div className="flex flex-col gap-2 mt-4 items-end">
                <MagneticLink href="#">GITHUB</MagneticLink>
                <MagneticLink href="#">LINKEDIN</MagneticLink>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <div className="mt-32 border-t border-foreground/10 pt-6 flex justify-between">
          <span className="text-brutalist-light text-muted-foreground text-[10px]">
            ©2025 AMAN HAMMAD
          </span>
          <span className="text-brutalist-light text-muted-foreground text-[10px]">
            ALL RIGHTS RESERVED
          </span>
        </div>
      </footer>
    </div>
  );
}
