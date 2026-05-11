import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Target, Zap, Rocket, ChevronRight, Loader2, CheckCircle, ShieldCheck } from 'lucide-react';

interface StepProps {
    onNext: (data?: any) => void;
    data?: any;
    userData: any;
}

// 1. BIENVENIDA
export const WelcomeStep: React.FC<StepProps> = ({ onNext, userData }) => {
    const userName = userData.name?.split(' ')[0] || 'Emprendedor';
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8 py-10"
        >
            <div className="relative inline-block">
                <div className="absolute inset-0 bg-[#FF5A1F] blur-3xl opacity-20 animate-pulse"></div>
                <div className="w-24 h-24 bg-[#FF5A1F] rounded-3xl flex items-center justify-center mx-auto mb-6 relative border border-white/20 shadow-2xl">
                    <Sparkles className="w-12 h-12 text-white" />
                </div>
            </div>
            
            <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase">
                    ¡HOLA, {userName}!
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed italic">
                    "Tu camino hacia las ventas masivas en Hotmart comienza aquí."
                </p>
            </div>

            <div className="bg-[#111] border border-white/5 p-8 rounded-[2.5rem] max-w-xl mx-auto shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Rocket className="w-24 h-24 text-white" />
                </div>
                <p className="text-lg text-gray-300 relative z-10 font-medium">
                    Hemos analizado tu perfil y estamos listos para configurar tu primer 
                    <span className="text-[#FF5A1F] font-bold"> Negocio Digital Automatizado</span>.
                </p>
            </div>

            <button 
                onClick={() => onNext()}
                className="group flex items-center gap-4 px-10 py-6 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white rounded-3xl font-black text-xl transition-all shadow-[0_20px_50px_-10px_rgba(255,90,31,0.5)] transform hover:-translate-y-2 active:scale-95 mx-auto"
            >
                VAMOS A EMPEZAR
                <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
        </motion.div>
    );
};

// 2. SELECCIÓN DE PROYECTO
export const ProjectSelectionStep: React.FC<StepProps & { projects: any[], loading: boolean }> = ({ projects, loading, onNext }) => {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-[#FF5A1F]">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p className="font-black uppercase tracking-[0.2em]">Cargando Vehículos de Venta...</p>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-10"
        >
            <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">
                    ELIGE TU <span className="text-[#FF5A1F]">VEHÍCULO</span>
                </h2>
                <p className="text-gray-400 text-lg font-medium">Selecciona el nicho en el que deseas empezar a vender hoy mismo.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <motion.div 
                        key={project.id}
                        whileHover={{ y: -10 }}
                        className="bg-[#111] border border-white/5 rounded-[2.5rem] overflow-hidden group cursor-pointer hover:border-[#FF5A1F]/50 transition-all flex flex-col h-full shadow-xl"
                        onClick={() => onNext(project)}
                    >
                        <div className="h-48 bg-gray-800 relative overflow-hidden">
                            {project.multimedia_json?.heroImages?.[0] ? (
                                <img src={project.multimedia_json.heroImages[0]} alt={project.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[#FF5A1F]/10">
                                    <Target className="w-12 h-12 text-[#FF5A1F] opacity-20" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent opacity-60"></div>
                            <div className="absolute bottom-4 left-6">
                                <span className="px-3 py-1 bg-[#FF5A1F] text-white text-[10px] font-black uppercase rounded-full shadow-lg">
                                    {project.niche || 'Digital'}
                                </span>
                            </div>
                        </div>
                        <div className="p-8 flex flex-col flex-1">
                            <h3 className="text-2xl font-black text-white mb-3 group-hover:text-[#FF5A1F] transition-colors">
                                {project.name}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                                {project.shortDescription || project.description}
                            </p>
                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                <div className="text-emerald-500 font-black text-lg">
                                    80% COMISIÓN
                                </div>
                                <div className="w-10 h-10 bg-[#FF5A1F]/10 text-[#FF5A1F] rounded-full flex items-center justify-center group-hover:bg-[#FF5A1F] group-hover:text-white transition-all shadow-lg shadow-[#FF5A1F]/10">
                                    <Zap className="w-5 h-5 fill-current" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

// 3. GENERACIÓN (LOADING STATE)
export const GenerationStep: React.FC<{ progress: number, status: string }> = ({ progress, status }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 space-y-12 text-center max-w-2xl mx-auto">
            <div className="relative">
                <div className="absolute inset-0 bg-[#FF5A1F] blur-3xl opacity-20 animate-pulse"></div>
                <div className="w-32 h-32 rounded-[2.5rem] bg-[#111] border border-white/10 flex items-center justify-center relative shadow-2xl">
                    <Loader2 className="w-16 h-16 text-[#FF5A1F] animate-spin" />
                </div>
            </div>

            <div className="space-y-6 w-full">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">{status}</h2>
                    <p className="text-gray-400 font-medium italic">"Nuestra IA está diseñando tu embudo de ventas de alto impacto..."</p>
                </div>
                
                <div className="w-full bg-[#111] h-4 rounded-full overflow-hidden border border-white/5 p-1 shadow-inner">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-[#FF5A1F] to-[#FF8C00] rounded-full shadow-[0_0_20px_rgba(255,90,31,0.5)]"
                    />
                </div>
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em]">
                    PROCESANDO ESTRATEGIA PSICOLÓGICA... {progress}%
                </div>
            </div>
        </div>
    );
};

// 4. ÉXITO FINAL
export const SuccessStep: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-10 py-10"
        >
            <div className="relative inline-block">
                <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20"></div>
                <div className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 relative border border-white/20 shadow-2xl">
                    <ShieldCheck className="w-12 h-12 text-white" />
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase">
                    ¡TODO <span className="text-emerald-500">LISTO</span>!
                </h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
                    Tu primer negocio ha sido configurado. 
                    Ya tienes tu proyecto desbloqueado, tu página de captura generada y tus hooks listos para usarse.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <div className="bg-[#111] p-6 rounded-[2rem] border border-emerald-500/10 flex flex-col items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                    <span className="text-xs font-black uppercase text-gray-400">Proyecto Activo</span>
                </div>
                <div className="bg-[#111] p-6 rounded-[2rem] border border-emerald-500/10 flex flex-col items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                    <span className="text-xs font-black uppercase text-gray-400">Web Generada</span>
                </div>
                <div className="bg-[#111] p-6 rounded-[2rem] border border-emerald-500/10 flex flex-col items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                    <span className="text-xs font-black uppercase text-gray-400">Hooks Listos</span>
                </div>
            </div>

            <button 
                onClick={onFinish}
                className="px-12 py-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-3xl font-black text-xl transition-all shadow-[0_20px_50px_-10px_rgba(16,185,129,0.5)] transform hover:-translate-y-2 active:scale-95 inline-flex items-center gap-4"
            >
                ENTRAR AL DASHBOARD
                <Rocket className="w-6 h-6" />
            </button>
        </motion.div>
    );
};
