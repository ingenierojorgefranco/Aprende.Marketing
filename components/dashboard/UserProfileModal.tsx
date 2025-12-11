import React, { useState } from 'react';
import { User } from '../../types';
import { api } from '../../services/api';
import { X, Save, Upload, User as UserIcon, Mail, Calendar, ShieldCheck, Crown, Clock, Loader2, Sparkles } from 'lucide-react';
import { UpgradeModal } from './UpgradeModal';

interface UserProfileModalProps {
    user: User;
    onClose: () => void;
    onUpdateUser: (user: User) => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose, onUpdateUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showUpgrade, setShowUpgrade] = useState(false);
    
    // Form State
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
    const [birthDate, setBirthDate] = useState(user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '');

    // Calculate "Member Since"
    const memberDays = user.createdAt 
        ? Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 3600 * 24))
        : 0;

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

    const PlanCard = () => {
        const planName = user.planLimits?.planName || 'starter';
        const isPro = planName === 'pro' || planName === 'max';
        
        return (
            <div className={`p-6 rounded-2xl border relative overflow-hidden group ${isPro ? 'bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border-purple-500/30' : 'bg-gray-800 border-gray-700'}`}>
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-white/10 transition"></div>
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">Tu Plan Actual</p>
                        <h3 className="text-2xl font-black text-white capitalize flex items-center gap-2">
                            {planName} 
                            {isPro && <Crown className="w-5 h-5 text-yellow-400 fill-current" />}
                        </h3>
                    </div>
                    {planName !== 'max' && (
                        <button 
                            onClick={() => setShowUpgrade(true)}
                            className="text-xs bg-white text-black px-3 py-1.5 rounded-full font-bold hover:scale-105 transition shadow-lg flex items-center gap-1"
                        >
                            <Sparkles className="w-3 h-3 text-purple-600" /> Mejorar Plan
                        </button>
                    )}
                </div>

                <div className="space-y-3 text-sm text-gray-300 relative z-10">
                    <div className="flex justify-between">
                        <span>Proyectos Activos</span>
                        <span className="font-bold text-white">{user.planLimits?.maxProjects}</span>
                    </div>
                    <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary h-full w-1/3"></div>
                    </div>
                    <div className="flex justify-between">
                        <span>Landing Pages</span>
                        <span className="font-bold text-white">{user.planLimits?.maxLandings}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#0f1115] border border-gray-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header with Cover */}
                <div className="h-32 bg-gradient-to-r from-gray-800 to-gray-900 relative">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition backdrop-blur-md">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-8 pb-8 -mt-12 flex flex-col flex-1 overflow-hidden">
                    
                    {/* Avatar & Basic Info */}
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8 relative z-10">
                        <div className="w-24 h-24 rounded-full border-4 border-[#0f1115] bg-gray-800 flex items-center justify-center shadow-xl overflow-hidden relative group">
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
                            <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                            <p className="text-gray-400 text-sm">{user.email}</p>
                            <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-xs font-medium text-gray-500">
                                <span className="flex items-center gap-1 bg-gray-800/50 px-2 py-1 rounded border border-gray-700">
                                    <ShieldCheck className="w-3 h-3" /> {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> Miembro hace {memberDays} días
                                </span>
                            </div>
                        </div>
                        <button 
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 ${isEditing ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-white text-black hover:bg-gray-200'}`}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isEditing ? <Save className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                            {isEditing ? 'Guardar Cambios' : 'Editar Perfil'}
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                        
                        {/* Plan Section */}
                        <PlanCard />

                        {/* Edit Form */}
                        <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Nombre Completo</label>
                                    <div className={`flex items-center gap-3 p-3 rounded-xl border transition ${isEditing ? 'bg-black border-gray-700' : 'bg-gray-900 border-transparent'}`}>
                                        <UserIcon className="w-5 h-5 text-gray-500" />
                                        <input 
                                            type="text" 
                                            value={name} 
                                            onChange={(e) => setName(e.target.value)} 
                                            disabled={!isEditing}
                                            className="bg-transparent w-full text-white outline-none disabled:text-gray-400"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Correo Electrónico</label>
                                    <div className={`flex items-center gap-3 p-3 rounded-xl border transition ${isEditing ? 'bg-black border-gray-700' : 'bg-gray-900 border-transparent'}`}>
                                        <Mail className="w-5 h-5 text-gray-500" />
                                        <input 
                                            type="email" 
                                            value={email} 
                                            onChange={(e) => setEmail(e.target.value)} 
                                            disabled={!isEditing}
                                            className="bg-transparent w-full text-white outline-none disabled:text-gray-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Fecha de Nacimiento</label>
                                    <div className={`flex items-center gap-3 p-3 rounded-xl border transition ${isEditing ? 'bg-black border-gray-700' : 'bg-gray-900 border-transparent'}`}>
                                        <Calendar className="w-5 h-5 text-gray-500" />
                                        <input 
                                            type="date" 
                                            value={birthDate} 
                                            onChange={(e) => setBirthDate(e.target.value)} 
                                            disabled={!isEditing}
                                            className="bg-transparent w-full text-white outline-none disabled:text-gray-400"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">URL Foto de Perfil</label>
                                    <div className={`flex items-center gap-3 p-3 rounded-xl border transition ${isEditing ? 'bg-black border-gray-700' : 'bg-gray-900 border-transparent'}`}>
                                        <Upload className="w-5 h-5 text-gray-500" />
                                        <input 
                                            type="text" 
                                            value={avatarUrl} 
                                            onChange={(e) => setAvatarUrl(e.target.value)} 
                                            disabled={!isEditing}
                                            placeholder="https://..."
                                            className="bg-transparent w-full text-white outline-none disabled:text-gray-400 placeholder-gray-600 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

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