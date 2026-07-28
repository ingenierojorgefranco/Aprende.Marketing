import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

interface ProjectStrategy_HeaderProps {
    projectName: string;
    onBack: () => void;
    onBuild?: () => void;
}

export const ProjectStrategy_Header: React.FC<ProjectStrategy_HeaderProps> = ({ projectName, onBack }) => {
    const navigate = useNavigate();
    return (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            {/* --- TOP BAR BREADCRUMB NAVIGATION --- */}
            <div id="psd-topbar-container" className="border-b border-slate-800/80 px-4 md:px-8 py-3.5">
                <div id="psd-topbar-content" className="max-w-[1760px] mx-auto flex items-center justify-between gap-4">
                    
                    {/* Breadcrumbs Left */}
                    <nav className="flex items-center gap-2 text-sm font-medium text-slate-400 flex-wrap min-w-0">
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="hover:text-white text-slate-300 transition-colors flex items-center gap-1.5 shrink-0"
                            title="Principal"
                        >
                            <Home className="w-4 h-4 text-slate-400 hover:text-white" />
                            <span>Principal</span>
                        </button>

                        <span className="text-slate-600 select-none">/</span>

                        <button 
                            onClick={onBack || (() => navigate('/dashboard/projects'))}
                            className="hover:text-white text-slate-300 transition-colors shrink-0"
                        >
                            Mis proyectos
                        </button>

                        <span className="text-slate-600 select-none">/</span>

                        <span className="text-[#FF5A1F] font-semibold tracking-wide truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                            {projectName || "Proyecto"}
                        </span>
                    </nav>

                </div>
            </div>
        </div>
    );
};
