
import React, { useState, useEffect, useRef } from 'react';
import { CRMContact, CRMActivity } from '../../../types';
import { api } from '../../../services/api';
import { X, Save, User, Mail, Phone, MapPin, Globe, Calendar, Clock, MessageSquare, Send, Activity, Flag, Trash2 } from 'lucide-react';

interface CRMContactDrawerProps {
    contact: CRMContact;
    isOpen: boolean;
    onClose: () => void;
    onSave: (contact: CRMContact) => Promise<void>;
    onDelete?: (id: string) => Promise<void>;
}

export const CRMContactDrawer: React.FC<CRMContactDrawerProps> = ({ contact, isOpen, onClose, onSave, onDelete }) => {
    const [activeTab, setActiveTab] = useState<'info' | 'history'>('info');
    const [formData, setFormData] = useState<CRMContact>(contact);
    const [activities, setActivities] = useState<CRMActivity[]>([]);
    const [newNote, setNewNote] = useState('');
    const [loadingActivities, setLoadingActivities] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Reset form when contact changes
    useEffect(() => {
        setFormData(contact);
        if (contact.id !== 'new') {
            loadActivities();
        } else {
            setActivities([]);
        }
    }, [contact]);

    const loadActivities = async () => {
        setLoadingActivities(true);
        try {
            const data = await api.getContactHistory(contact.id);
            setActivities(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingActivities(false);
        }
    };

    const handleSave = () => {
        onSave(formData);
    };

    const handleDelete = async () => {
        if (contact.id === 'new' || !onDelete) return;
        
        if (window.confirm("¿Estás seguro de que quieres eliminar este contacto? Esta acción no se puede deshacer.")) {
            await onDelete(contact.id);
        }
    };

    const handleAddNote = async () => {
        if (!newNote.trim() || contact.id === 'new') return;
        try {
            await api.addContactNote(contact.id, newNote);
            setNewNote('');
            loadActivities(); // Refresh
        } catch (e) {
            alert("Error al guardar la nota.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-[#0f1115] border-l border-gray-800 shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300">
                
                {/* Header */}
                <div className="p-6 border-b border-gray-800 bg-gray-900/50 flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-1">{formData.id === 'new' ? 'Nuevo Prospecto' : formData.name || 'Sin Nombre'}</h2>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Registrado: {new Date(formData.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white p-1 rounded hover:bg-gray-800 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Quick Status Bar */}
                <div className="px-6 py-4 bg-gray-800/30 border-b border-gray-800 flex gap-4">
                    <div className="flex-1">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Estado</label>
                        <select 
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                            className="w-full bg-black border border-gray-700 text-white text-xs rounded px-2 py-1.5 outline-none focus:border-primary"
                        >
                            <option value="new">Nuevo</option>
                            <option value="contacted">Contactado</option>
                            <option value="interested">Interesado</option>
                            <option value="closed">Cliente (Cerrado)</option>
                            <option value="lost">Perdido</option>
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nivel de Interés</label>
                        <select 
                            value={formData.interestLevel}
                            onChange={(e) => setFormData({...formData, interestLevel: e.target.value as any})}
                            className="w-full bg-black border border-gray-700 text-white text-xs rounded px-2 py-1.5 outline-none focus:border-primary"
                        >
                            <option value="cold">❄️ Bajo (Frío)</option>
                            <option value="warm">☀️ Medio (Tibio)</option>
                            <option value="hot">🔥 Alto (Caliente)</option>
                        </select>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-800">
                    <button 
                        onClick={() => setActiveTab('info')}
                        className={`flex-1 py-3 text-sm font-bold border-b-2 transition ${activeTab === 'info' ? 'border-primary text-white bg-gray-800/20' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                    >
                        Información
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')}
                        disabled={formData.id === 'new'}
                        className={`flex-1 py-3 text-sm font-bold border-b-2 transition ${activeTab === 'history' ? 'border-primary text-white bg-gray-800/20' : 'border-transparent text-gray-500 hover:text-gray-300 disabled:opacity-50'}`}
                    >
                        Historial & Notas
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar" ref={scrollRef}>
                    
                    {activeTab === 'info' && (
                        <div className="space-y-4 animate-in fade-in">
                            <div className="space-y-1">
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase"><User className="w-3 h-3"/> Nombre Completo</label>
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-primary outline-none"
                                    placeholder="Ej: Juan Pérez"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase"><Mail className="w-3 h-3"/> Correo Electrónico</label>
                                <input 
                                    type="email" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-primary outline-none"
                                    placeholder="juan@ejemplo.com"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase"><Phone className="w-3 h-3"/> Teléfono / WhatsApp</label>
                                <input 
                                    type="tel" 
                                    value={formData.phone || ''}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-primary outline-none"
                                    placeholder="+57 300 123 4567"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase"><Globe className="w-3 h-3"/> País</label>
                                    <input 
                                        type="text" 
                                        value={formData.country || ''}
                                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                                        className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-primary outline-none"
                                        placeholder="Ej: México"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase"><Flag className="w-3 h-3"/> Origen</label>
                                    <input 
                                        type="text" 
                                        value={formData.source}
                                        disabled
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-400 text-sm cursor-not-allowed"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase"><MapPin className="w-3 h-3"/> Dirección (Opcional)</label>
                                <textarea 
                                    value={formData.address || ''}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-primary outline-none h-20 resize-none"
                                    placeholder="Dirección física..."
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="space-y-6 animate-in fade-in h-full flex flex-col">
                            {/* Notes Input */}
                            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 shrink-0">
                                <label className="block text-xs font-bold text-gray-400 mb-2">Añadir Nota de Seguimiento</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                                        className="flex-1 bg-black border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-primary outline-none"
                                        placeholder="Escribe una nota..."
                                    />
                                    <button 
                                        onClick={handleAddNote}
                                        disabled={!newNote.trim()}
                                        className="bg-primary hover:bg-indigo-600 disabled:opacity-50 text-white p-2 rounded-lg transition"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="space-y-4 flex-1 overflow-y-auto">
                                {loadingActivities ? (
                                    <div className="text-center py-4"><span className="animate-spin">⌛</span></div>
                                ) : activities.length === 0 ? (
                                    <p className="text-center text-gray-500 text-sm">No hay actividad registrada.</p>
                                ) : (
                                    activities.map(act => (
                                        <div key={act.id} className="flex gap-3 relative">
                                            {/* Line */}
                                            <div className="absolute top-8 left-3 bottom-[-20px] w-px bg-gray-800 last:hidden"></div>
                                            
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 
                                                ${act.type === 'note' ? 'bg-blue-900 text-blue-400' : 
                                                  act.type === 'status_change' ? 'bg-orange-900 text-orange-400' : 
                                                  'bg-green-900 text-green-400'}`}
                                            >
                                                {act.type === 'note' ? <MessageSquare className="w-3 h-3" /> : 
                                                 act.type === 'status_change' ? <Activity className="w-3 h-3" /> : 
                                                 <User className="w-3 h-3" />}
                                            </div>
                                            <div className="flex-1 pb-4">
                                                <div className="flex justify-between items-start">
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                                                        {act.type === 'lead_submission' ? 'Registro' : 
                                                         act.type === 'status_change' ? 'Cambio de Estado' : 'Nota'}
                                                    </p>
                                                    <span className="text-[10px] text-gray-600">{new Date(act.createdAt).toLocaleString()}</span>
                                                </div>
                                                <div className="mt-1 p-3 bg-gray-900 border border-gray-800 rounded-lg text-sm text-gray-300">
                                                    {act.content}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-800 bg-gray-900 flex justify-between items-center gap-3">
                    {onDelete && formData.id !== 'new' ? (
                        <button 
                            onClick={handleDelete}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-900/20 hover:text-red-400 transition"
                            title="Eliminar Contacto"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    ) : <div></div>}
                    
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition text-sm">Cancelar</button>
                        <button 
                            onClick={handleSave} 
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition text-sm shadow-lg shadow-green-900/20"
                        >
                            <Save className="w-4 h-4" /> {formData.id === 'new' ? 'Crear Prospecto' : 'Guardar Cambios'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
