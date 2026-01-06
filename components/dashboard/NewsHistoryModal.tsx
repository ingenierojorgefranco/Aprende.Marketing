
import React, { useEffect, useState } from 'react';
import { DashboardNews } from '../../types';
import { api } from '../../services/api';
import { 
    X, Newspaper, Calendar, ChevronRight, 
    Rocket, Bot, Sparkles, Loader2, Filter, 
    ChevronLeft, Archive
} from 'lucide-react';

////////// Creación de la modal de histórico de novedades por meses - 07/06/2025 10:30 //////////

interface NewsHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NewsHistoryModal: React.FC<NewsHistoryModalProps> = ({ isOpen, onClose }) => {
    const [news, setNews] = useState<DashboardNews[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    useEffect(() => {
        if (isOpen) {
            loadHistory();
        }
    }, [isOpen, selectedYear, selectedMonth]);

    const loadHistory = async () => {
        setLoading(true);
        try {
            const data = await api.getNewsHistory(selectedMonth || undefined, selectedYear);
            setNews(data);
        } catch (e) {
            console.error("Error cargando histórico");
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'ia': return <Bot className="w-5 h-5" />;
            case 'update': return <Rocket className="w-5 h-5" />;
            default: return <Sparkles className="w-5 h-5" />;
        }
    };

    const getIconColor = (type: string) => {
        switch (type) {
            case 'ia': return 'bg-purple-900/30 text-purple-400 border-purple-900/50';
            case 'update': return 'bg-blue-900/30 text-blue-400 border-blue-900/50';
            default: return 'bg-[#FF5A1F]/30 text-[#FF5A1F] border-[#FF5A1F]/50';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={onClose}>
            <div className="bg-[#0b0b0b] border border-white/10 rounded-[3rem] w-full max-w-5xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                
                {/* Header Neon */}
                <div className="p-8 md:p-12 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 bg-gradient-to-r from-[#FF5A1F]/5 to-transparent shrink-0">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-[#FF5A1F] border border-white/10 shadow-lg">
                            <Archive className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-white tracking-tight">Archivo del Sistema</h3>
                            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">Histórico completo de Novedades y TIPS</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                            <button 
                                onClick={() => setSelectedYear(selectedYear - 1)}
                                className="p-2 hover:bg-white/5 rounded-lg text-gray-500 transition"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 font-black text-white text-sm">{selectedYear}</span>
                            <button 
                                onClick={() => setSelectedYear(selectedYear + 1)}
                                className="p-2 hover:bg-white/5 rounded-lg text-gray-500 transition"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        <button onClick={onClose} className="p-3 bg-gray-900 hover:bg-gray-800 text-gray-400 rounded-full transition ml-4">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar de Meses */}
                    <aside className="w-64 border-r border-white/5 bg-[#080808] overflow-y-auto hidden md:block custom-scrollbar">
                        <div className="p-4 space-y-1">
                            <button 
                                onClick={() => setSelectedMonth(null)}
                                className={`w-full text-left px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition ${selectedMonth === null ? 'bg-[#FF5A1F] text-white shadow-lg shadow-[#FF5A1F]/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                            >
                                Todos los meses
                            </button>
                            {months.map((m, idx) => (
                                <button 
                                    key={m}
                                    onClick={() => setSelectedMonth(idx + 1)}
                                    className={`w-full text-left px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition ${selectedMonth === idx + 1 ? 'bg-[#FF5A1F] text-white shadow-lg shadow-[#FF5A1F]/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* Feed de Noticias */}
                    <main className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar bg-black/30">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full text-[#FF5A1F]">
                                <Loader2 className="w-12 h-12 animate-spin" />
                                <p className="mt-4 font-black uppercase tracking-widest text-xs">Consultando Archivo...</p>
                            </div>
                        ) : news.length > 0 ? (
                            <div className="space-y-12">
                                {news.map((item) => (
                                    <div key={item.id} className="group relative animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex items-start gap-8">
                                            <div className="flex flex-col items-center shrink-0">
                                                <div className={`p-4 rounded-2xl border ${getIconColor(item.iconType)} shadow-xl shadow-black group-hover:scale-110 transition-transform`}>
                                                    {getIcon(item.iconType)}
                                                </div>
                                                <div className="w-px h-full bg-white/5 mt-4 group-last:hidden"></div>
                                            </div>
                                            <div className="flex-1 space-y-3 pb-8">
                                                <div className="flex justify-between items-center">
                                                    <h4 className="text-2xl font-black text-white group-hover:text-[#FF5A1F] transition-colors">{item.title}</h4>
                                                    <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 bg-white/5 px-3 py-1 rounded-full">
                                                        <Calendar className="w-3 h-3" /> {item.date}
                                                    </span>
                                                </div>
                                                <p className="text-lg text-gray-400 font-light leading-relaxed max-w-3xl">{item.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30 grayscale">
                                <Sparkles className="w-20 h-20 text-gray-500" />
                                <h4 className="text-xl font-bold text-white">Sin registros</h4>
                                <p className="text-gray-500 max-w-xs">No se encontraron noticias para el periodo seleccionado en el archivo maestro.</p>
                            </div>
                        )}
                    </main>
                </div>
                
                <div className="p-8 border-t border-white/5 bg-[#080808] text-center flex justify-between items-center">
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.4em]">Bitácora de Evolución del Sistema Aprende.Marketing</p>
                    <button onClick={onClose} className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-sm transition-all border border-white/10">Cerrar Archivo</button>
                </div>
            </div>
        </div>
    );
};
////////// Fin de actualización - 07/06/2025 10:30 //////////
