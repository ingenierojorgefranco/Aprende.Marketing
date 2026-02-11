import React, { useState, useEffect } from 'react';
import { WhatsAppLaunch, User } from '../../../types';
import { Smartphone, Plus, Loader2, Trash2, Calendar, Edit3, Smartphone as WaIcon, CheckCircle2, PlayCircle, Layers, Crown, X } from 'lucide-react';
import { api } from '../../../services/api';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { UpgradeModal } from '../UpgradeModal';
import { DeletionRestrictionModal } from '../DeletionRestrictionModal';

export const WhatsAppLaunchManager: React.FC = () => {
    const navigate = useNavigate();
    const { user, isSimulating } = useOutletContext() as { user: User, isSimulating: boolean };
    const [launches, setLeads] = useState<WhatsAppLaunch[]>([]);
    const [loading, setLoading] = useState(true);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);

    // --- Nuevo Estado para Restricción de Eliminación ---
    const [showRestrictionModal, setShowRestrictionModal] = useState(false);
    const [launchToRestrict, setLaunchToRestrict] = useState<WhatsAppLaunch | null>(null);
    // ----------------------------------------------------

    useEffect(() => {
        loadLaunches();
    }, []);

    const loadLaunches = async () => {
        setLoading(true);
        try {
            const data = await api.getWhatsAppLaunches();
            setLeads(data);
        } catch (e) {
            console.error("Error cargando lanzamientos", e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (launch: WhatsAppLaunch, e: React.MouseEvent) => {
        e.stopPropagation();

        if (user.role !== 'admin') {
            setLaunchToRestrict(launch);
            setShowRestrictionModal(true);
            return;
        }

        if (!window.confirm("¿Estás seguro de eliminar este lanzamiento?")) return;
        try {
            await api.deleteWhatsAppLaunch(launch.id);
            setLeads(prev => prev.filter(l => l.id !== launch.id));
        } catch (e) {
            alert("Error al eliminar");
        }
    };

    // Lógica de límites respetando simulación
    const isRealAdmin = user.role === 'admin' && !isSimulating;
    const maxLaunches = user.planLimits?.maxWhatsAppLaunches || 1;
    const currentCount = launches.length;
    const isAtLimit = !isRealAdmin && currentCount >= maxLaunches;
    const usagePercent = Math.min(100, (currentCount / maxLaunches) * 100);

    const handleCreateNew = () => {
        if (isAtLimit) {
            setShowUpgradeModal(true);
            return;
        }
        navigate('/dashboard/whatsapp-launch/create');
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-20">
            <UpgradeModal 
                isOpen={showUpgradeModal} 
                onClose={() => setShowUpgradeModal(false)} 
                currentPlan={user.planLimits?.planName}
                reason={`Has alcanzado el límite de ${maxLaunches} lanzamientos de tu plan.`}
            />

            {/* HEADER */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-white/5 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] shadow-sm">
                            <Smartphone className="w-3 h-3" /> WhatsApp: Lanzamientos Meteóricos
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                            Genera Picos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400">Ventas Masivas</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl font-medium leading-relaxed">
                            Crea la secuencia perfecta de 14 mensajes estratégicos para grupos de WhatsApp. Activa los gatillos de comunidad, escasez y urgencia en tiempo real.
                        </p>
                        
                        <div className="pt-4 max-w-md mx-auto md:mx-0">
                            <div className="bg-black/30 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-inner">
                                <div className="flex justify-between items-center mb-3 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                                    <span>Lanzamientos Activos</span>
                                    <span className="text-white">{currentCount} / {isRealAdmin ? '∞' : maxLaunches}</span>
                                </div>
                                <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
                                    <div 
                                        className={`h-full bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.6)] transition-all duration-[1500ms] ease-out`} 
                                        style={{ width: `${isRealAdmin ? (currentCount > 0 ? 100 : 0) : usagePercent}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0 flex flex-col gap-6 w-full md:w-[400px]">
                        {/* Contenedor de Video Interactivo */}
                        <div 
                            onClick={() => setShowVideoModal(true)}
                            className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black relative group cursor-pointer"
                        >
                            <img 
                                src="https://img.youtube.com/vi/A_dcakdMBow/maxresdefault.jpg" 
                                alt="Video Tutorial"
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 group-hover:scale-110 transition-transform">
                                    <PlayCircle className="w-10 h-10 text-emerald-400" />
                                </div>
                            </div>
                        </div>

                        {/* Botones centrados debajo del video */}
                        <div className="flex flex-col gap-3">
                            {isAtLimit ? (
                                <button 
                                    onClick={() => setShowUpgradeModal(true)}
                                    className="w-full px-8 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 transform active:scale-[0.98]"
                                >
                                    <Crown className="w-5 h-5 fill-current" /> Límite Alcanzado: Subir a PRO
                                </button>
                            ) : (
                                <button 
                                    onClick={handleCreateNew}
                                    className="w-full px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-3 transform active:scale-[0.98]"
                                >
                                    <Plus className="w-4 h-4" /> Nuevo Lanzamiento
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* GRID DE LANZAMIENTOS */}
            <div className="space-y-8">
                {loading ? (
                    <div className="flex justify-center p-20 text-emerald-400"><Loader2 className="w-12 h-12 animate-spin" /></div>
                ) : launches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {launches.map(launch => (
                            <div key={launch.id} className="bg-[#111] rounded-[2.5rem] border border-white/5 p-8 hover:border-emerald-500/30 transition-all duration-300 group flex flex-col shadow-2xl relative overflow-hidden">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors leading-tight mb-2">
                                            {launch.projectName}
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${launch.status === 'activa' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                                                {launch.status}
                                            </span>
                                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Creado {launch.createdAt.toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={(e) => handleDelete(launch, e)}
                                            className="p-3 rounded-2xl bg-red-900/20 text-red-500 border border-red-900/30 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                        <div className="bg-white/5 p-3 rounded-2xl border border-white/10 group-hover:bg-emerald-500 group-hover:text-black transition-all shadow-lg">
                                            <WaIcon className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 flex-1">
                                    <div className="bg-black/40 p-6 rounded-3xl border border-white/5">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Secuencia de 14 Momentos (Progreso)</p>
                                        <div className="grid grid-cols-7 gap-2">
                                            {launch.messages.map((msg, i) => (
                                                <div 
                                                    key={i} 
                                                    className={`h-2 rounded-full transition-all duration-500 ${msg.isGenerated ? 'bg-emerald-500' : 'bg-gray-800'}`}
                                                    title={`${msg.name}: ${msg.isGenerated ? 'Generado' : 'Pendiente'}`}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 mt-10">
                                    <button 
                                        onClick={() => navigate(`/dashboard/whatsapp-launch/editor/${launch.id}`)}
                                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg"
                                    >
                                        <Edit3 className="w-5 h-5" /> Gestionar Mensajes
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-[#111] p-20 rounded-[3rem] border border-white/5 text-center space-y-8 animate-in zoom-in-95 duration-700">
                        <div className="w-24 h-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center text-emerald-400 mx-auto border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                            <Smartphone className="w-12 h-12" />
                        </div>
                        <div className="max-w-xl mx-auto">
                            <h3 className="text-3xl font-black text-white uppercase tracking-tight">Lanzamiento de WhatsApp Vacío</h3>
                            <p className="text-gray-400 font-medium text-lg mt-4 leading-relaxed">
                                Aún no has configurado ninguna secuencia de lanzamiento. La IA puede redactar los 14 momentos críticos para llenar tus grupos y cerrar ventas masivas.
                            </p>
                        </div>
                        <button 
                            onClick={handleCreateNew}
                            className="px-12 py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg uppercase tracking-widest rounded-2xl transition-all shadow-2xl shadow-emerald-900/20 transform hover:scale-105 active:scale-95"
                        >
                            Crear mi primer lanzamiento
                        </button>
                    </div>
                )}
            </div>

            {showVideoModal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-850">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <PlayCircle className="w-5 h-5 text-emerald-500" /> Tutorial: WhatsApp Lanzamientos
                            </h3>
                            <button onClick={() => setShowVideoModal(false)} className="text-gray-500 hover:text-white p-1 hover:bg-gray-800 rounded-full transition">
                                <X className="w-5 h-5"/>
                            </button>
                        </div>
                        <div className="aspect-video w-full">
                            <iframe 
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                                title="Tutorial WhatsApp Lanzamientos" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                        <div className="p-6 bg-gray-900">
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Descubre cómo ejecutar lanzamientos masivos en grupos de WhatsApp utilizando nuestra secuencia probada de 14 momentos estratégicos.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL RESTRICCIÓN DE ELIMINACIÓN */}
            <DeletionRestrictionModal 
                isOpen={showRestrictionModal} 
                onClose={() => setShowRestrictionModal(false)}
                itemName={launchToRestrict ? `WhatsApp Launch: ${launchToRestrict.projectName}` : ''}
                userEmail={user.email}
                userName={user.name}
            />
        </div>
    );
};