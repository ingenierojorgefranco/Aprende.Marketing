import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Mail, Briefcase, ChevronRight, ArrowLeft, 
    Zap, Loader2, Info, Sparkles, Plus, 
    Check, Calendar, LayoutTemplate, X
} from 'lucide-react';
import { api } from '../../../services/api';
import { Project } from '../../../types';
import { ProjectMasterStrategy } from '../../../services/strategySchema';

export const EmailSequenceWizard: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0); // 0: Select Project, 1: Visualization
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [strategy, setStrategy] = useState<ProjectMasterStrategy | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeEmailIdx, setActiveEmailIdx] = useState(0);

    /* */ /* Actualización: Carga inicial de proyectos disponibles para el Paso 0 - 24/06/2024 16:30 */
    useEffect(() => {
        const loadProjects = async () => {
            setLoading(true);
            try {
                const data = await api.getProjects();
                setProjects(data);
            } catch (e) {
                console.error("Error cargando proyectos", e);
            } finally {
                setLoading(false);
            }
        };
        loadProjects();
    }, []);

    /* */ /* Actualización: Lógica para cargar la estrategia maestra al seleccionar un proyecto - 24/06/2024 16:30 */
    const handleProjectSelect = async (project: Project) => {
        setSelectedProject(project);
        setLoading(true);
        try {
            const strategyData = await api.getProjectStrategy(project.id);
            if (strategyData) {
                setStrategy(strategyData);
                setStep(1);
            } else {
                alert("Este proyecto aún no tiene una estrategia generada. Por favor, genérala primero en la sección Proyectos.");
            }
        } catch (e) {
            console.error("Error cargando estrategia", e);
        } finally {
            setLoading(false);
        }
    };

    if (loading && step === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-[#FF5A1F]">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p className="font-black uppercase tracking-[0.2em] text-sm">Cargando tus proyectos...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto bg-gray-900 rounded-2xl shadow-lg border border-gray-800 overflow-hidden min-h-[600px] flex flex-col relative animate-in fade-in duration-500">
            
            {/* */ /* Actualización: Header Premium y Barra de Progreso unificada para el Asistente de Secuencias - 24/06/2024 16:30 */ }
            <div className="bg-[#FF5A1F]/10 p-8 text-center border-b border-[#FF5A1F]/10">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-700">
                    <Mail className="w-8 h-8 text-[#FF5A1F]" />
                </div>
                <h2 className="text-2xl font-bold text-white">Asistente de Secuencias de Email</h2>
                <div className="flex items-center justify-center gap-2 mt-4 text-sm">
                   <span className={`px-3 py-1 rounded-full ${step === 0 ? 'bg-[#FF5A1F] text-white font-bold' : 'bg-gray-800 text-gray-500'}`}>0. Proyecto</span>
                   <div className="w-4 h-px bg-gray-700"></div>
                   <span className={`px-3 py-1 rounded-full ${step === 1 ? 'bg-[#FF5A1F] text-white font-bold' : 'bg-gray-800 text-gray-500'}`}>1. Secuencia</span>
                </div>
            </div>

            <div className="p-8 flex-1">
                {/* */ /* PASO 0: SELECCIÓN DE PROYECTO (Diseño unificado con ContentGenerator) - 24/06/2024 16:30 */ }
                {step === 0 && (
                    <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500 text-center flex flex-col items-center">
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A1F] to-amber-500">
                                    Selecciona tu Proyecto
                                </span>
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed font-medium">
                                Para redactar correos que cierren ventas, nuestra IA necesita leer tu estrategia maestra. Selecciona un proyecto para visualizar su secuencia de 7 días.
                            </p>
                        </div>

                        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {projects.length > 0 ? (
                                projects.map((project) => (
                                    <button 
                                        key={project.id}
                                        onClick={() => handleProjectSelect(project)}
                                        className="p-8 bg-[#0B0B0B] border border-white/5 rounded-[2rem] hover:border-[#FF5A1F]/50 hover:bg-[#FF5A1F]/5 transition-all text-left group flex flex-col shadow-2xl relative overflow-hidden h-full"
                                    >
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5A1F] to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-3 bg-gray-800 rounded-2xl group-hover:bg-[#FF5A1F]/10 group-hover:text-[#FF5A1F] transition-colors">
                                                <Briefcase className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-white font-bold text-lg group-hover:text-[#FF5A1F] transition-colors truncate">{project.name}</h4>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mt-1">{project.niche}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-400 line-clamp-2 mb-6 flex-1">{project.description}</p>
                                        <div className="flex items-center justify-end">
                                            <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-[#FF5A1F] transition-all group-hover:translate-x-1" />
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="md:col-span-3 py-20 bg-black/20 border border-dashed border-gray-800 rounded-[2rem] text-center">
                                    <p className="text-gray-500 mb-6">Aún no tienes proyectos creados con estrategia.</p>
                                    <button 
                                        onClick={() => navigate('/dashboard/projects/create')}
                                        className="px-8 py-3 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white rounded-xl font-bold transition-all shadow-lg shadow-[#FF5A1F]/20"
                                    >
                                        Crear mi primer proyecto
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="p-8 bg-[#FF5A1F]/5 border border-[#FF5A1F]/20 rounded-[2.5rem] flex items-start gap-6 max-w-2xl text-left shadow-xl">
                            <div className="p-3 bg-[#FF5A1F]/20 rounded-2xl">
                                <Info className="w-6 h-6 text-[#FF5A1F] shrink-0" />
                            </div>
                            <div>
                                <h5 className="text-white font-bold mb-1 text-lg">Importancia Estratégica</h5>
                                <p className="text-sm text-gray-400 leading-relaxed font-medium">
                                    Al seleccionar un proyecto, la IA sincronizará los dolores y beneficios detectados en la <b>Estrategia Maestra</b> para redactar asuntos y cuerpos de correo de alta tasa de apertura.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* */ /* PASO 1: VISUALIZACIÓN DE SECUENCIA (Unificada con el diseño de ProjectStrategy_Email) - 24/06/2024 16:30 */ }
                {step === 1 && strategy && (
                    <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                        <div className="flex flex-col lg:flex-row justify-between items-start md:items-center gap-6">
                            <button onClick={() => setStep(0)} className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-bold transition">
                                <ArrowLeft className="w-4 h-4" /> Cambiar Proyecto
                            </button>
                            <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                                <span className="text-xs font-bold text-white uppercase tracking-widest">{selectedProject?.name}</span>
                                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black uppercase border border-blue-500/20">7 Días de Estrategia</span>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-12 gap-8 items-start">
                            {/* LISTADO DE EMAILS (IZQUIERDA) */}
                            <div className="lg:col-span-5 space-y-4">
                                <div className="bg-[#111] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl">
                                    <h4 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-[#FF5A1F]" /> Cronograma de Envío
                                    </h4>
                                    
                                    <div className="space-y-3">
                                        {strategy.modules.emails.nurture.map((email: any, idx: number) => (
                                            <div 
                                                key={idx}
                                                onClick={() => setActiveEmailIdx(idx)}
                                                className={`group relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center gap-5 ${activeEmailIdx === idx ? 'bg-blue-600 border-blue-500 shadow-xl shadow-blue-900/20' : 'bg-black/40 border-white/5 hover:border-white/10 hover:bg-black/60'}`}
                                            >
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black shrink-0 transition-colors ${activeEmailIdx === idx ? 'bg-white text-blue-600' : 'bg-gray-800 text-gray-500'}`}>
                                                    D{idx}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${activeEmailIdx === idx ? 'text-blue-100' : 'text-gray-500'}`}>
                                                        {email.type || 'Contenido Estratégico'}
                                                    </p>
                                                    <h5 className={`font-bold truncate text-base ${activeEmailIdx === idx ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                                        {email.subject}
                                                    </h5>
                                                </div>
                                                <div className={`w-2 h-2 rounded-full transition-all ${activeEmailIdx === idx ? 'bg-white shadow-[0_0_10px_#fff]' : 'bg-gray-800'}`}></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-8 bg-indigo-900/10 border border-indigo-500/20 rounded-[2.5rem] flex items-start gap-4">
                                    <Sparkles className="w-6 h-6 text-indigo-400 shrink-0" />
                                    <p className="text-gray-400 text-sm leading-relaxed italic">
                                        "Cada correo de esta secuencia utiliza el sesgo de reciprocidad y autoridad para preparar la venta final."
                                    </p>
                                </div>
                            </div>

                            {/* DETALLE DEL EMAIL (DERECHA) - Chrome Browser Clean */}
                            <div className="lg:col-span-7">
                                <div className="bg-white rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col border border-gray-200">
                                    <div className="h-10 bg-gray-100 border-b border-gray-200 flex items-center px-6 justify-between shrink-0">
                                        <div className="flex gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                                        </div>
                                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Vista Previa Estratégica</div>
                                        <div className="w-10"></div>
                                    </div>

                                    <div className="p-10 md:p-14 overflow-y-auto max-h-[700px] custom-scrollbar bg-white">
                                        <div className="space-y-10">
                                            <div className="space-y-4 border-b border-gray-100 pb-8">
                                                <div className="flex justify-between items-center">
                                                    <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                                                        Email #{activeEmailIdx + 1}
                                                    </span>
                                                    <span className="text-xs text-gray-400 font-bold font-mono">Envío: Día {activeEmailIdx}</span>
                                                </div>
                                                <h4 className="text-3xl font-black text-gray-900 leading-tight">
                                                    {strategy.modules.emails.nurture[activeEmailIdx].subject}
                                                </h4>
                                            </div>

                                            <div className="bg-blue-50 border border-blue-100 rounded-[2rem] p-8 relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                                                    <LayoutTemplate className="w-20 h-20 text-blue-600" />
                                                </div>
                                                <div className="flex gap-4 items-start relative z-10">
                                                    <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg"><Info className="w-6 h-6" /></div>
                                                    <div>
                                                        <h5 className="text-blue-900 font-black uppercase text-xs tracking-widest mb-2">Misión Estratégica</h5>
                                                        <p className="text-blue-800 text-lg leading-relaxed font-medium italic">
                                                            {strategy.modules.emails.nurture[activeEmailIdx].objective}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-6 pt-6">
                                                <p className="text-gray-500 text-sm font-medium border-b border-gray-100 pb-4 mb-10 flex items-center gap-4">
                                                    <span className="font-black text-gray-800 uppercase tracking-widest">Para:</span> {strategy.avatars[0].name} (Lead)
                                                </p>

                                                <div className="prose prose-lg text-gray-700 leading-[1.8] font-serif italic">
                                                    <p className="font-bold text-gray-900 text-2xl mb-8">Hola {strategy.avatars[0].name.split(' ')[0]},</p>
                                                    <p className="text-xl">
                                                        {strategy.modules.emails.nurture[activeEmailIdx].bodyPreview}
                                                    </p>
                                                    <div className="my-10 p-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl text-center">
                                                        <p className="text-gray-400 text-base font-sans non-italic">
                                                            [ La IA generará el cuerpo completo persuasivo basado en los dolores y el mecanismo único del proyecto al activar la secuencia ]
                                                        </p>
                                                    </div>
                                                    <p className="text-xl">Hablamos pronto,<br/><span className="font-bold text-gray-900">Tu Equipo de Estrategia</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <button 
                                        onClick={() => navigate('/dashboard/email')}
                                        className="w-full py-5 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-xl uppercase tracking-widest rounded-2xl transition-all shadow-2xl shadow-[#FF5A1F]/20 transform hover:scale-[1.02] flex items-center justify-center gap-3"
                                    >
                                        <Zap className="w-6 h-6 fill-current" /> Activar esta Secuencia
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};