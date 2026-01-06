
import React, { useState, useEffect } from 'react';
import { User, UserUsageStats } from '../../types';
import { api } from '../../services/api';
////////// Adición de iconos para el nuevo panel multitab - 27/05/2025 13:00 //////////
import { 
    X, Save, Upload, User as UserIcon, Mail, Calendar, 
    ShieldCheck, Crown, Clock, Loader2, Sparkles, 
    CreditCard, BarChart, RefreshCw, ExternalLink, Zap, Info
} from 'lucide-react';
import { UpgradeModal } from './UpgradeModal';

interface UserProfileModalProps {
    user: User;
    onClose: () => void;
    onUpdateUser: (user: User) => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose, onUpdateUser }) => {
    ////////// Estado de pestañas y edición - 27/05/2025 13:00 //////////
    const [activeTab, setActiveTab] = useState<'profile' | 'plan' | 'usage' | 'payments'>('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showUpgrade, setShowUpgrade] = useState(false);
    
    // Form State
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
    const [birthDate, setBirthDate] = useState(user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '');

    // Lazy Data States
    const [usageStats, setUsageStats] = useState<UserUsageStats | null>(null);
    const [loadingStats, setLoadingStats] = useState(false);
    const [payments, setPayments] = useState<any[]>([]);
    const [loadingPayments, setLoadingPayments] = useState(false);

    ////////// Fin de actualización - 27/05/2025 13:00 /////////

    const memberDays = user.createdAt 
        ? Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 3600 * 24))
        : 0;

    ////////// Lógica de carga de datos bajo demanda según pestaña - 27/05/2025 13:10 //////////
    const handleTabChange = async (tab: 'profile' | 'plan' | 'usage' | 'payments') => {
        setActiveTab(tab);
        if (tab === 'usage' && !usageStats) {
            setLoadingStats(true);
            try {
                const stats = await api.getUserUsageStats(user.id);
                setUsageStats(stats);
            } catch (e) {
                console.error("Error cargando estadísticas", e);
            } finally {
                setLoadingStats(false);
            }
        } else if (tab === 'payments' && payments.length === 0) {
            setLoadingPayments(true);
            try {
                const history = await api.getUserPayments(user.id);
                setPayments(history);
            } catch (e) {
                console.error("Error cargando pagos", e);
            } finally {
                setLoadingPayments(false);
            }
        }
    };
    ////////// Fin de actualización - 27/05/2025 13:10 /////////

    const handleSave = async () => {
        if (!name || !email) return alert("Nombre y Email son obligatorios.");
        setLoading(true);
        try {
            const updatedUser = await api.updateProfile({
                name,
                email,
                avatarUrl,
                birthDate
            });
            onUpdateUser(updatedUser);
            setIsEditing(false);
        } catch (error) {
            alert("Error al actualizar perfil. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    ////////// Componente interno de Barra de Consumo - 27/05/2025 13:15 //////////
    const UsageBar = ({ label, current, max }: { label: string, current: number, max: number }) => {
        const percent = max > 0 ? Math.min(100, (current / max) * 100) : 0;
        let color = 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]';
        if (percent > 60) color = 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]';
        if (percent >= 90) color = 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]';

        return (
            <div className="mb-6 animate-in slide-in-from-left-4 duration-500">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                    <span>{label}</span>
                    <span className="text-white font-mono">{current} / {max}</span>
                </div>
                <div className="w-full h-3 bg-black border border-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
                    <div className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${percent}%` }}></div>
                </div>
            </div>
        );
    };
    ////////// Fin de actualización - 27/05/2025 13:15 /////////

    return (
        <div 
            onClick={() => onClose()}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        >
            <div 
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0f1115] border border-gray-800 rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                
                {/* Header with Cover */}
                <div className="h-32 bg-gradient-to-r from-gray-900 via-[#111] to-[#0a0a0a] relative">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition backdrop-blur-md">
                        <X className="w-5 h-5" />
                    </button>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:20px_20px] opacity-10 pointer-events-none"></div>
                </div>

                <div className="px-8 pb-8 -mt-12 flex flex-col flex-1 overflow-hidden relative z-10">
                    
                    {/* User Hero Section */}
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8">
                        <div className="w-24 h-24 rounded-[2rem] border-4 border-[#0f1115] bg-gray-800 flex items-center justify-center shadow-xl overflow-hidden relative group">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon className="w-10 h-10 text-gray-500" />
                            )}
                            {isEditing && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                                    <Upload className="w-6 h-6 text-white" />
                                </div>
                            )}
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <h2 className="text-3xl font-black text-white tracking-tight">{user.name}</h2>
                            <p className="text-gray-400 text-sm font-medium">{user.email}</p>
                            <div className="flex items-center justify-center md:justify-start gap-4 mt-3 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                <span className="flex items-center gap-1.5 bg-[#FF5A1F]/10 text-[#FF5A1F] px-3 py-1 rounded-full border border-[#FF5A1F]/20">
                                    <ShieldCheck className="w-3 h-3" /> {user.role === 'admin' ? 'Administrador' : 'Estratega'}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-3 h-3" /> Miembro hace {memberDays} días
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ////////// SISTEMA DE PESTAÑAS PARA AUTOGESTIÓN - 27/05/2025 13:20 ////////// */}
                    <div className="flex border-b border-white/5 bg-black/20 rounded-xl mb-8 p-1">
                        <button onClick={() => handleTabChange('profile')} className={`flex-1 py-3 text-[11px] font-black uppercase tracking-[0.2em] rounded-lg transition-all ${activeTab === 'profile' ? 'bg-[#FF5A1F] text-white shadow-lg shadow-[#FF5A1F]/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>Perfil</button>
                        <button onClick={() => handleTabChange('plan')} className={`flex-1 py-3 text-[11px] font-black uppercase tracking-[0.2em] rounded-lg transition-all ${activeTab === 'plan' ? 'bg-[#FF5A1F] text-white shadow-lg shadow-[#FF5A1F]/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>Suscripción</button>
                        <button onClick={() => handleTabChange('usage')} className={`flex-1 py-3 text-[11px] font-black uppercase tracking-[0.2em] rounded-lg transition-all ${activeTab === 'usage' ? 'bg-[#FF5A1F] text-white shadow-lg shadow-[#FF5A1F]/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>Consumo</button>
                        <button onClick={() => handleTabChange('payments')} className={`flex-1 py-3 text-[11px] font-black uppercase tracking-[0.2em] rounded-lg transition-all ${activeTab === 'payments' ? 'bg-[#FF5A1F] text-white shadow-lg shadow-[#FF5A1F]/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>Facturación</button>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-[400px]">
                        
                        {/* TAB: PROFILE */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-sm font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><UserIcon className="w-4 h-4" /> Datos de Perfil</h4>
                                    <button 
                                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                        className={`px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition flex items-center gap-2 ${isEditing ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-white/10 text-white border border-white/10 hover:bg-[#FF5A1F] hover:border-[#FF5A1F]'}`}
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isEditing ? <Save className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                                        {isEditing ? 'Guardar' : 'Editar Datos'}
                                    </button>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nombre</label>
                                        <input 
                                            type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={!isEditing}
                                            className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FF5A1F] transition disabled:opacity-50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email</label>
                                        <input 
                                            type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!isEditing}
                                            className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FF5A1F] transition disabled:opacity-50"
                                        />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Fecha de Nacimiento</label>
                                        <input 
                                            type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} disabled={!isEditing}
                                            className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FF5A1F] transition disabled:opacity-50"
                                            style={{ colorScheme: 'dark' }} 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Avatar URL</label>
                                        <input 
                                            type="text" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} disabled={!isEditing}
                                            className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FF5A1F] transition disabled:opacity-50 placeholder:text-gray-700"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: PLAN (READ ONLY) */}
                        {activeTab === 'plan' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-gradient-to-br from-[#FF5A1F]/10 to-indigo-900/10 p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden group shadow-2xl">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                                        <Crown className="w-32 h-32 text-white" />
                                    </div>
                                    <div className="relative z-10">
                                        <span className="text-[10px] font-black text-[#FF5A1F] uppercase tracking-[0.3em] mb-2 block">Tu Suscripción</span>
                                        <h3 className="text-5xl font-black text-white capitalize leading-none mb-6">Plan {user.planLimits?.planName || 'Starter'}</h3>
                                        
                                        <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-white/5 rounded-2xl text-blue-400 border border-white/5">
                                                    <Calendar className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Renovación</p>
                                                    <p className="text-xl font-bold text-white">Automática</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-white/5 rounded-2xl text-emerald-400 border border-white/5">
                                                    <CreditCard className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Estado</p>
                                                    <p className="text-xl font-bold text-emerald-400">Activa</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-blue-900/10 border border-blue-500/20 rounded-2xl flex items-start gap-4">
                                    <Info className="w-5 h-5 text-blue-400 shrink-0 mt-1" />
                                    <p className="text-sm text-gray-400 leading-relaxed font-medium">
                                        Para cambiar tu método de pago o cancelar la suscripción, por favor utiliza la pasarela de pagos correspondiente (Stripe o Hotmart) vinculada a tu correo electrónico.
                                    </p>
                                </div>

                                {user.planLimits?.planName !== 'max' && (
                                    <button 
                                        onClick={() => setShowUpgrade(true)}
                                        className="w-full py-5 rounded-2xl bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-lg shadow-xl shadow-[#FF5A1F]/20 transition-all flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-95"
                                    >
                                        <Sparkles className="w-6 h-6 fill-current" /> Subir de Plan ahora
                                    </button>
                                )}
                            </div>
                        )}

                        {/* TAB: USAGE STATS */}
                        {activeTab === 'usage' && (
                            <div className="space-y-8 animate-in fade-in duration-500">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-sm font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><BarChart className="w-4 h-4 text-primary" /> Uso de Recursos del Plan</h4>
                                    <button onClick={() => handleTabChange('usage')} className="p-2 hover:bg-white/5 text-gray-500 hover:text-white rounded-lg transition-colors">
                                        <RefreshCw className={`w-4 h-4 ${loadingStats ? 'animate-spin' : ''}`} />
                                    </button>
                                </div>

                                {loadingStats ? (
                                    <div className="flex justify-center py-20 text-[#FF5A1F]"><Loader2 className="w-12 h-12 animate-spin" /></div>
                                ) : usageStats ? (
                                    <div className="space-y-2 bg-black/30 border border-white/5 p-8 rounded-[2.5rem] shadow-inner">
                                        <UsageBar label="Proyectos" current={usageStats.projects} max={user.planLimits?.maxProjects || 1} />
                                        <UsageBar label="Landing Pages" current={usageStats.landings} max={user.planLimits?.maxLandings || 3} />
                                        <UsageBar label="Artículos SEO" current={usageStats.articles} max={user.planLimits?.maxArticles || 2} />
                                        
                                        <div className="mt-8 pt-8 border-t border-white/5 text-center">
                                            <p className="text-xs text-gray-500 font-medium italic">
                                                Los límites se reinician automáticamente cada mes en tu fecha de facturación.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-20 text-gray-500 italic font-medium">Error al cargar estadísticas. Reintenta.</div>
                                )}
                            </div>
                        )}

                        {/* TAB: PAYMENTS */}
                        {activeTab === 'payments' && (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <h4 className="text-sm font-black text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-4"><RefreshCw className="w-4 h-4 text-emerald-400" /> Historial de Transacciones</h4>
                                
                                {loadingPayments ? (
                                    <div className="flex justify-center py-20 text-[#FF5A1F]"><Loader2 className="w-12 h-12 animate-spin" /></div>
                                ) : payments.length > 0 ? (
                                    <div className="space-y-4">
                                        {payments.map((payment, i) => (
                                            <div key={payment.id} className="bg-white/5 border border-white/5 p-6 rounded-2xl flex items-center justify-between group hover:border-[#FF5A1F]/30 transition-all">
                                                <div className="flex items-center gap-5">
                                                    <div className="p-3 bg-black/40 rounded-xl text-gray-400 group-hover:text-[#FF5A1F] transition-colors border border-white/5">
                                                        <CreditCard className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <span className={`text-sm font-black uppercase tracking-widest ${payment.status === 'succeeded' ? 'text-emerald-400' : 'text-red-400'}`}>
                                                                {payment.status === 'succeeded' ? 'Éxito' : 'Fallido'}
                                                            </span>
                                                            <span className="text-[10px] text-gray-600 font-black uppercase">• {new Date(payment.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 font-mono tracking-tighter opacity-50">ID: {payment.stripe_id}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xl font-black text-white leading-none">${payment.amount} <span className="text-xs text-gray-500 font-bold">{payment.currency?.toUpperCase()}</span></p>
                                                    <p className="text-[9px] text-gray-600 font-black uppercase mt-1.5 tracking-tighter">{payment.payment_method}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-black/20 rounded-[2.5rem] border border-white/5 border-dashed">
                                        <p className="text-gray-600 text-sm font-medium italic">No hay registros de facturación asociados a tu cuenta.</p>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>

            <UpgradeModal 
                isOpen={showUpgrade} 
                onClose={() => setShowUpgrade(false)} 
                currentPlan={user.planLimits?.planName}
            />
        </div>
    );
};

export default UserProfileModal;
