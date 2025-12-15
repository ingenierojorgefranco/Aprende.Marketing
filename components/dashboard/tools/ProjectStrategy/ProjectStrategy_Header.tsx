
import React from 'react';
import { ArrowLeft, Rocket, Download } from 'lucide-react';

interface ProjectStrategy_HeaderProps {
    projectName: string;
    onBack: () => void;
    onBuild: () => void;
}

export const ProjectStrategy_Header: React.FC<ProjectStrategy_HeaderProps> = ({ projectName, onBack, onBuild }) => {
    return (
        <>
            {/* --- TOP BAR NAVIGATION --- */}
            <div id="psd-topbar-container" className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-gray-800 px-6 py-4">
                <div id="psd-topbar-content" className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <button id="psd-topbar-back-btn" onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-medium transition">
                        <ArrowLeft className="w-4 h-4" /> Volver a Proyectos
                    </button>
                    <div id="psd-topbar-actions" className="flex gap-3">
                        <button id="psd-topbar-build-btn" onClick={onBuild} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-indigo-600 text-white rounded-lg text-xs font-bold transition shadow-lg shadow-primary/20 animate-pulse">
                            <Rocket className="w-4 h-4" /> Construir Todo
                        </button>
                        <button id="psd-topbar-pdf-btn" className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg text-xs font-bold transition">
                            <Download className="w-4 h-4" /> PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* --- HERO HEADER --- */}
            <div id="psd-hero-container" className="bg-[#0a0a0a] border-b border-gray-800 py-12 md:py-16">
                <div id="psd-hero-content" className="max-w-[1400px] mx-auto px-6 text-center">
                    <div id="psd-hero-badge" className="mb-4">
                        <span className="text-blue-400 font-medium text-lg tracking-wide">
                            He creado la estrategia profesional para que vendas el curso de:
                        </span>
                    </div>
                    
                    <h1 id="psd-hero-title" className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                        {projectName}
                    </h1>
                    
                    <p id="psd-hero-subtitle" className="text-gray-300 font-light max-w-2xl mx-auto leading-[2rem] text-[1.3rem]">
                        Tu sistema de ventas desglosado paso a paso.
                    </p>
                </div>
            </div>
        </>
    );
};
