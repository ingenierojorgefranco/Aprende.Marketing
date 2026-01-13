import React from 'react';
import { ArrowLeft } from 'lucide-react';

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
        </div>
    );
};