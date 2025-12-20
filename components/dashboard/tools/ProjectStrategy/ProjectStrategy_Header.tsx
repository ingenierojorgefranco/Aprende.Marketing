import React from 'react';
import { ArrowLeft, ClipboardList } from 'lucide-react';

interface ProjectStrategy_HeaderProps {
    projectName: string;
    onBack: () => void;
    onBuild?: () => void;
}

export const ProjectStrategy_Header: React.FC<ProjectStrategy_HeaderProps> = ({ projectName, onBack }) => {
    return (
        <>
            {/* --- TOP BAR NAVIGATION --- */}
            <div id="psd-topbar-container" className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-gray-800 px-6 py-4">
                <div id="psd-topbar-content" className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <button id="psd-topbar-back-btn" onClick={onBack} className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-medium transition">
                        <ArrowLeft className="w-4 h-4" /> Volver a Proyectos
                    </button>
                </div>
            </div>

            {/* --- HERO HEADER --- */}
            <div id="psd-hero-container" className="bg-[#0a0a0a] border-b border-gray-800 py-12 md:py-16">
                <div id="psd-hero-content" className="max-w-[1400px] mx-auto px-6 text-center">
                    <div id="psd-hero-badge" className="mb-4 flex items-center justify-center gap-2">
                        <ClipboardList className="w-5 h-5 text-blue-400" />
                        <span className="text-blue-400 font-medium text-lg tracking-wide">
                            Resumen del Sistema Estratégico
                        </span>
                    </div>
                    
                    <h1 id="psd-hero-title" className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                        {projectName}
                    </h1>
                    
                    <p id="psd-hero-subtitle" className="text-gray-300 font-light max-w-4xl mx-auto leading-[1.8] text-[1.3rem]">
                        Nuestro sistema de inteligencia artificial ha analizado tu producto y el mercado actual para diseñar un ecosistema de ventas automatizado. Aquí tienes los pilares de tu nueva estrategia de marketing.
                    </p>
                </div>
            </div>
        </>
    );
};