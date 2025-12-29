import React from 'react';
import { ArrowLeft, ClipboardList, Sparkles } from 'lucide-react';

interface ProjectStrategy_HeaderProps {
    projectName: string;
    onBack: () => void;
    onBuild?: () => void;
}

export const ProjectStrategy_Header: React.FC<ProjectStrategy_HeaderProps> = ({ projectName, onBack }) => {
    return (
        <div className="animate-in fade-in slide-in-from-top-4 duration-1000">
            {/* --- TOP BAR NAVIGATION --- */}
            <div id="psd-topbar-container" className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-gray-800 px-6 py-4">
                <div id="psd-topbar-content" className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <button id="psd-topbar-back-btn" onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-medium transition group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Volver a Proyectos
                    </button>
                </div>
            </div>

            {/* --- HERO HEADER: COMMAND CENTER AESTHETIC --- */}
            <div id="psd-hero-container" className="relative bg-[#020202] border-b border-white/5 py-24 lg:py-32 overflow-hidden">
                
                {/* Visual Background Layers */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Technical Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:45px_45px] opacity-[0.08]"></div>
                    
                    {/* Radial Deep Glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1e1e2e_0%,transparent_70%)] opacity-40"></div>
                    
                    {/* Focal Light Effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full"></div>
                </div>

                <div id="psd-hero-content" className="relative z-10 max-w-[1400px] mx-auto px-6 text-center space-y-10">
                    
                    {/* 1. STRATEGIC BADGE */}
                    <div id="psd-hero-badge-wrapper" className="flex justify-center">
                        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)] group">
                            <div className="relative">
                                <ClipboardList className="w-5 h-5 text-indigo-400" />
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_8px_#818cf8]"></div>
                            </div>
                            <span className="text-indigo-300 font-black text-sm uppercase tracking-[0.25em]">
                                Resumen del Sistema Estratégico
                            </span>
                        </div>
                    </div>
                    
                    {/* 2. PROJECT TITLE */}
                    <div className="space-y-4">
                        <h1 id="psd-hero-title" className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight tracking-tighter drop-shadow-2xl">
                            {projectName}
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-indigo-400/60">
                            <Sparkles className="w-4 h-4 fill-current" />
                            <span className="text-xs font-bold uppercase tracking-[0.3em]">IA Strategy Engine v4.0</span>
                            <Sparkles className="w-4 h-4 fill-current" />
                        </div>
                    </div>
                    
                    {/* 3. EXECUTIVE SUMMARY NARRATIVE */}
                    <p id="psd-hero-subtitle" className="text-gray-400 font-light max-w-4xl mx-auto leading-[1.9] text-[1.4rem] md:text-[1.6rem] border-t border-white/5 pt-10">
                        Nuestra inteligencia artificial ha analizado profundamente tu producto y el mercado actual para diseñar un <span className="text-white font-medium italic">ecosistema de ventas automatizado</span>. Este mapa de ingeniería inyecta psicología avanzada en cada punto de contacto para anular la resistencia del comprador y acelerar tu facturación.
                    </p>
                </div>
            </div>
        </div>
    );
};