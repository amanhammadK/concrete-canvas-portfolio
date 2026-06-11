import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Mock components to render based on terminal state
function FinanceGPTBento() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-white/20 p-6 bg-black/50 backdrop-blur-md glass-panel mt-4 w-full max-w-2xl"
        >
            <h3 className="text-mono-bold text-neon-cyan text-xl mb-2">FinanceGPT | Live Sandbox</h3>
            <p className="text-mono text-muted-foreground text-sm mb-4">
                AI-Powered Financial Intelligence Platform executing mock logic...
            </p>
            <div className="h-32 border border-white/10 w-full flex items-end gap-1 px-4 py-2">
                {/* Mock Chart */}
                {[40, 60, 45, 80, 50, 90, 70, 100].map((h, i) => (
                    <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className="w-full bg-neon-cyan/50 border-t-2 border-neon-cyan overflow-hidden"
                    >
                        <div className="w-full h-full bg-scanlines opacity-50" />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

function ExperienceTimeline() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border border-white/20 p-6 bg-black/50 backdrop-blur-md glass-panel mt-4 w-full max-w-2xl"
        >
            <h3 className="text-mono-bold text-neon-green text-xl mb-4">Experience Node Matrix</h3>
            <div className="flex flex-col gap-4 border-l-2 border-neon-green/30 pl-4">
                <div>
                    <h4 className="text-mono-bold text-white">Fullstack AI Developer @ TechSys AI LLC</h4>
                    <span className="text-mono text-xs text-neon-cyan">Oct 2024 - Present</span>
                    <p className="text-mono text-xs text-muted-foreground mt-1">
                        Engineered AI Financial Trading platform & embedded advisory agent. Python, FastAPI, LangGraph.
                    </p>
                </div>
                <div>
                    <h4 className="text-mono-bold text-white">AI Developer @ PIAIC</h4>
                    <span className="text-mono text-xs text-neon-cyan">Nov 2024 - Present</span>
                    <p className="text-mono text-xs text-muted-foreground mt-1">
                        Agentic workflows with n8n. Cross-platform automation & LLM reliability enhancement.
                    </p>
                </div>
                <div>
                    <h4 className="text-mono-bold text-white">AI App Developer @ Independent Practice</h4>
                    <span className="text-mono text-xs text-neon-cyan">May 2023 - Sep 2025</span>
                    <p className="text-mono text-xs text-muted-foreground mt-1">
                        6+ independent SaaS prototypes. ReactJS, LangChain, Streamlit, Docker.
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

type TerminalLog = {
    type: 'system' | 'user' | 'agent' | 'component';
    text?: string;
    component?: React.ReactNode;
};

export default function AgenticTerminal() {
    const [input, setInput] = useState('');
    const [logs, setLogs] = useState<TerminalLog[]>([
        { type: 'system', text: 'INITIALIZING 2026 AGENTIC PORTFOLIO_V1...' },
        { type: 'system', text: 'CONNECTION ESTABLISHED. AWAITING QUERY.' },
        { type: 'system', text: '> Try: "ls experience" or "run finance_demo"' },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const processCommand = async (cmd: string) => {
        const lowerCmd = cmd.toLowerCase().trim();

        // Fake agent processing delay
        setIsTyping(true);

        const thinkingSteps = [
            { type: 'agent' as const, text: '[Agent] Analyzing intent...' },
            { type: 'agent' as const, text: '[Agent] Fetching vector payload via RAG...' },
        ];

        for (const step of thinkingSteps) {
            await new Promise((r) => setTimeout(r, 600));
            setLogs((prev) => [...prev, step]);
        }

        await new Promise((r) => setTimeout(r, 800));

        if (lowerCmd.includes('experience') || lowerCmd.includes('work') || lowerCmd.includes('resume')) {
            setLogs((prev) => [
                ...prev,
                { type: 'agent', text: '[Agent] Synthesizing professional timeline.' },
                { type: 'component', component: <ExperienceTimeline /> }
            ]);
        } else if (lowerCmd.includes('finance') || lowerCmd.includes('demo') || lowerCmd.includes('project')) {
            setLogs((prev) => [
                ...prev,
                { type: 'agent', text: '[Agent] Mounting FinanceGPT Live Sandbox instance.' },
                { type: 'component', component: <FinanceGPTBento /> }
            ]);
        } else {
            setLogs((prev) => [
                ...prev,
                { type: 'agent', text: `[Agent] Command unparseable in current state node. Try "ls experience" or "run finance_demo".` }
            ]);
        }

        setIsTyping(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && input.trim()) {
            setLogs((prev) => [...prev, { type: 'user', text: `> ${input}` }]);
            const currentInput = input;
            setInput('');
            processCommand(currentInput);
        }
    };

    return (
        <div className="absolute inset-0 z-10 p-6 md:p-12 flex flex-col justify-end pointer-events-none mix-difference">

            {/* Top Bar Identity */}
            <div className="absolute top-6 left-6 md:top-12 md:left-12 pointer-events-auto">
                <h1 className="text-mono-bold text-white text-2xl tracking-widest">AMAN<span className="text-neon-cyan">_HAMMAD</span></h1>
                <p className="text-mono text-xs text-muted-foreground mt-1">AI SOLUTIONS DEVELOPER | RAG CORE v1.0.4</p>
            </div>

            {/* Terminal View */}
            <div className="w-full max-w-4xl max-h-[70vh] overflow-y-auto flex flex-col gap-2 pb-16 pointer-events-auto custom-scrollbar">
                {logs.map((log, i) => (
                    <div key={i} className="w-full">
                        {log.type === 'system' && <p className="text-mono text-xs text-white/50">{log.text}</p>}
                        {log.type === 'user' && <p className="text-mono text-sm text-neon-green">{log.text}</p>}
                        {log.type === 'agent' && <p className="text-mono text-xs text-neon-cyan/70 italic">{log.text}</p>}
                        {log.type === 'component' && log.component}
                    </div>
                ))}
                {isTyping && (
                    <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-4 bg-neon-cyan mt-1" />
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input Overlay */}
            <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 pointer-events-auto w-[calc(100%-3rem)] md:w-[calc(100%-6rem)] max-w-4xl flex items-center gap-4 bg-black/40 p-3 border border-white/20 glass-panel">
                <span className="text-neon-green text-mono font-bold">{'>'}</span>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent border-none outline-none text-white text-mono placeholder:text-white/20 caret-neon-cyan"
                    placeholder="Execute command or query agent naturally..."
                    spellCheck={false}
                    autoFocus
                    disabled={isTyping}
                />
            </div>
        </div>
    );
}
