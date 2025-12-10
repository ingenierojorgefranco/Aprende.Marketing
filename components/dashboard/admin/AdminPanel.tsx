
import React, { useEffect, useState } from 'react';
import { User, PlanLimits } from '../../../types';
import { api } from '../../../services/api';
import { Loader2, Shield, Users, Edit, Trash2, Check, X, Save, AlertTriangle, Eye, ChevronDown, ChevronUp, Folder, FileText, Globe } from 'lucide-react';

// --- Sub-component for viewing user resources (Lazy Loaded) ---
const UserContentModal: React.FC<{ user: User, onClose: () => void }> = ({ user, onClose }) => {
    const [loadedData, setLoadedData] = useState<{
        projects: any[] | null;
        pages: any[] | null;
        articles: any[] | null;
    }>({ projects: null, pages: null, articles: null });

    const [expandedSection, setExpandedSection] = useState<'projects' | 'pages' | 'articles' | null>(null);
    const [loadingSection, setLoadingSection] = useState<string | null>(null);

    const toggleSection = async (section: 'projects' | 'pages' | 'articles') => {
        if (expandedSection === section) {
            setExpandedSection(null);
            return;
        }

        setExpandedSection(section);

        // Lazy Load if data is null
        if (loadedData[section] === null) {
            setLoadingSection(section);
            try {
                const data = await api.getAdminUserResources(user.id, section);
                setLoadedData(prev => ({ ...prev, [section]: data }));
            } catch (error) {
                console.error(`Error loading ${section}`, error);
            } finally {
                setLoadingSection(null);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-3xl shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[80vh]">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Eye className="w-5 h-5 text-blue-400" /> Contenido de {user.name}
                        </h3>
                        <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition"><X className="w-6 h-6" /></button>
                </div>

                <div className="p-6 overflow-y-auto space-y-4 flex-1">
                    
                    {/* Projects Section */}
                    <div className="border border-gray-700 rounded-xl overflow-hidden">
                        <button 
                            onClick={() => toggleSection('projects')}
                            className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 transition text-left"
                        >
                            <div className="flex items-center gap-3 font-bold text-white">
                                <Folder className="w-5 h-5 text-yellow-500" /> Proyectos
                            </div>
                            {expandedSection === 'projects' ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </button>
                        
                        {expandedSection === 'projects' && (
                            <div className="bg-black/50 p-4 border-t border-gray-700 animate-in slide-in-from-top-2">
                                {loadingSection === 'projects' ? (
                                    <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
                                ) : loadedData.projects && loadedData.projects.length > 0 ? (
                                    <table className="w-full text-xs text-left">
                                        <thead className="text-gray-500 uppercase">
                                            <tr>
                                                <th className="pb-2">Nombre</th>
                                                <th className="pb-2">Nicho</th>
                                                <th className="pb-2">Objetivo</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-300 divide-y divide-gray-800">
                                            {loadedData.projects.map((p: any) => (
                                                <tr key={p.id}>
                                                    <td className="py-2 font-medium">{p.name}</td>
                                                    <td className="py-2">{p.niche}</td>
                                                    <td className="py-2 text-blue-400">{p.main_goal}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-sm text-gray-500 italic text-center">No hay proyectos creados.</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Landing Pages Section */}
                    <div className="border border-gray-700 rounded-xl overflow-hidden">
                        <button 
                            onClick={() => toggleSection('pages')}
                            className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 transition text-left"
                        >
                            <div className="flex items-center gap-3 font-bold text-white">
                                <Globe className="w-5 h-5 text-green-500" /> Landing Pages
                            </div>
                            {expandedSection === 'pages' ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </button>
                        
                        {expandedSection === 'pages' && (
                            <div className="bg-black/50 p-4 border-t border-gray-700 animate-in slide-in-from-top-2">
                                {loadingSection === 'pages' ? (
                                    <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
                                ) : loadedData.pages && loadedData.pages.length > 0 ? (
                                    <table className="w-full text-xs text-left">
                                        <thead className="text-gray-500 uppercase">
                                            <tr>
                                                <th className="pb-2">Nombre</th>
                                                <th className="pb-2">Subdominio</th>
                                                <th className="pb-2 text-right">Visitas</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-300 divide-y divide-gray-800">
                                            {loadedData.pages.map((p: any) => (
                                                <tr key={p.id}>
                                                    <td className="py-2 font-medium">{p.name}</td>
                                                    <td className="py-2 text-gray-400">{p.subdomain}</td>
                                                    <td className="py-2 text-right font-mono">{p.visits}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-sm text-gray-500 italic text-center">No hay páginas creadas.</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Articles Section */}
                    <div className="border border-gray-700 rounded-xl overflow-hidden">
                        <button 
                            onClick={() => toggleSection('articles')}
                            className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 transition text-left"
                        >
                            <div className="flex items-center gap-3 font-bold text-white">
                                <FileText className="w-5 h-5 text-purple-500" /> Artículos
                            </div>
                            {expandedSection === 'articles' ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </button>
                        
                        {expandedSection === 'articles' && (
                            <div className="bg-black/50 p-4 border-t border-gray-700 animate-in slide-in-from-top-2">
                                {loadingSection === 'articles' ? (
                                    <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
                                ) : loadedData.articles && loadedData.articles.length > 0 ? (
                                    <table className="w-full text-xs text-left">
                                        <thead className="text-gray-500 uppercase">
                                            <tr>
                                                <th className="pb-2">Título</th>
                                                <th className="pb-2">Estado</th>
                                                <th className="pb-2 text-right">SEO</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-300 divide-y divide-gray-800">
                                            {loadedData.articles.map((a: any) => (
                                                <tr key={a.id}>
                                                    <td className="py-2 font-medium truncate max-w-[200px]">{a.title}</td>
                                                    <td className="py-2">
                                                        <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${a.status === 'published' ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                                                            {a.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-2 text-right font-mono">{a.seo_score}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-sm text-gray-500 italic text-center">No hay artículos creados.</p>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export const AdminPanel: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [viewingUser, setViewingUser] = useState<User | null>(null); // For Content Viewer
    const [tempPlanLimits, setTempPlanLimits] = useState<PlanLimits | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await api.getUsers();
            setUsers(data);
        } catch (error) {
            console.error("Error loading users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (user: User) => {
        setEditingUser(user);
        // Deep copy to avoid mutating state directly
        setTempPlanLimits(JSON.parse(JSON.stringify(user.planLimits || {
            planName: 'starter',
            maxProjects: 1,
            maxLandings: 3,
            features: {
                whatsappBot: false,
                blogGenerator: false,
                emailMarketing: false,
                removeBranding: false
            }
        })));
    };

    const handleSaveUser = async () => {
        if (!editingUser || !tempPlanLimits) return;

        try {
            await api.updateUser(editingUser.id, {
                role: editingUser.role || 'user',
                planLimits: tempPlanLimits,
                isActive: true // Assuming active for now, can add toggle
            });
            // Refresh list
            setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...editingUser, planLimits: tempPlanLimits } : u));
            setEditingUser(null);
            setTempPlanLimits(null);
        } catch (error) {
            alert("Error al guardar cambios");
        }
    };

    const handleDeleteUser = async (id: string) => {
        try {
            await api.deleteUser(id);
            setUsers(prev => prev.filter(u => u.id !== id));
            setShowDeleteConfirm(null);
        } catch (error) {
            alert("Error eliminando usuario");
        }
    };

    const applyTemplate = (template: 'starter' | 'pro') => {
        if (!tempPlanLimits) return;
        
        if (template === 'starter') {
            setTempPlanLimits({
                planName: 'starter',
                maxProjects: 1,
                maxLandings: 3,
                features: { whatsappBot: false, blogGenerator: false, emailMarketing: false, removeBranding: false }
            });
        } else {
            setTempPlanLimits({
                planName: 'pro',
                maxProjects: 10,
                maxLandings: 50,
                features: { whatsappBot: true, blogGenerator: true, emailMarketing: true, removeBranding: true }
            });
        }
    };

    if (loading) {
        return <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Shield className="w-8 h-8 text-red-500" /> Panel de Administración
                </h1>
                <div className="text-sm text-gray-400">
                    Total Usuarios: <span className="font-bold text-white">{users.length}</span>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
                <table className="w-full text-left">
                    <thead className="bg-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4">Usuario</th>
                            <th className="p-4">Rol</th>
                            <th className="p-4">Plan Actual</th>
                            <th className="p-4">Límites (Proy / Landings)</th>
                            <th className="p-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-sm">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-800/50 transition">
                                <td className="p-4">
                                    <div className="font-bold text-white">{user.name}</div>
                                    <div className="text-gray-500">{user.email}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'admin' ? 'bg-red-900/30 text-red-400 border border-red-900' : 'bg-blue-900/30 text-blue-400 border border-blue-900'}`}>
                                        {user.role?.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className="text-gray-300 capitalize">{user.planLimits?.planName || 'N/A'}</span>
                                </td>
                                <td className="p-4 text-gray-400">
                                    {user.planLimits?.maxProjects} / {user.planLimits?.maxLandings}
                                </td>
                                <td className="p-4 text-right flex justify-end gap-2">
                                    <button 
                                        onClick={() => setViewingUser(user)}
                                        className="p-2 hover:bg-purple-900/30 text-purple-400 rounded transition" title="Ver Contenido Generado"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleEditClick(user)}
                                        className="p-2 hover:bg-blue-900/30 text-blue-400 rounded transition" title="Editar Plan"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => setShowDeleteConfirm(user.id)}
                                        className="p-2 hover:bg-red-900/30 text-red-400 rounded transition" title="Eliminar Usuario"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Content Viewer Modal */}
            {viewingUser && (
                <UserContentModal user={viewingUser} onClose={() => setViewingUser(null)} />
            )}

            {/* Edit User Modal */}
            {editingUser && tempPlanLimits && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 overflow-hidden">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Editar Usuario: {editingUser.name}</h3>
                            <button onClick={() => setEditingUser(null)} className="text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
                        </div>
                        
                        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                            {/* Role Selection */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Rol del Sistema</label>
                                <select 
                                    value={editingUser.role} 
                                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value as any})}
                                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white"
                                >
                                    <option value="user">Usuario Normal</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>

                            {/* Plan Template Buttons */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Plantillas Rápidas</label>
                                <div className="flex gap-4">
                                    <button onClick={() => applyTemplate('starter')} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded border border-gray-600 text-xs">Aplicar Starter</button>
                                    <button onClick={() => applyTemplate('pro')} className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded border border-blue-700 text-xs">Aplicar Pro</button>
                                </div>
                            </div>

                            {/* Limits Config */}
                            <div className="grid grid-cols-2 gap-4 bg-gray-800/30 p-4 rounded-xl border border-gray-800">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Máx Proyectos</label>
                                    <input 
                                        type="number" 
                                        value={tempPlanLimits.maxProjects}
                                        onChange={(e) => setTempPlanLimits({...tempPlanLimits, maxProjects: parseInt(e.target.value)})}
                                        className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Máx Landing Pages</label>
                                    <input 
                                        type="number" 
                                        value={tempPlanLimits.maxLandings}
                                        onChange={(e) => setTempPlanLimits({...tempPlanLimits, maxLandings: parseInt(e.target.value)})}
                                        className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white"
                                    />
                                </div>
                            </div>

                            {/* Features Toggles */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Funcionalidades Habilitadas</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {Object.entries(tempPlanLimits.features).map(([key, value]) => (
                                        <label key={key} className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-10 h-5 rounded-full relative transition-colors ${value ? 'bg-green-600' : 'bg-gray-700'}`}>
                                                <input 
                                                    type="checkbox" 
                                                    className="hidden"
                                                    checked={value}
                                                    onChange={(e) => setTempPlanLimits({
                                                        ...tempPlanLimits, 
                                                        features: { ...tempPlanLimits.features, [key]: e.target.checked }
                                                    })}
                                                />
                                                <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform ${value ? 'left-6' : 'left-1'}`}></div>
                                            </div>
                                            <span className="text-sm text-gray-300 group-hover:text-white capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-800 border-t border-gray-700 flex justify-end gap-3">
                            <button onClick={() => setEditingUser(null)} className="px-4 py-2 text-gray-400 hover:text-white">Cancelar</button>
                            <button onClick={handleSaveUser} className="px-6 py-2 bg-primary hover:bg-indigo-600 text-white rounded-lg font-bold flex items-center gap-2">
                                <Save className="w-4 h-4" /> Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-red-900/50 p-6 rounded-xl max-w-sm w-full text-center">
                        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">¿Eliminar Usuario?</h3>
                        <p className="text-gray-400 text-sm mb-6">Esta acción borrará permanentemente al usuario y todos sus datos.</p>
                        <div className="flex justify-center gap-3">
                            <button onClick={() => setShowDeleteConfirm(null)} className="px-4 py-2 border border-gray-700 rounded text-gray-300">Cancelar</button>
                            <button onClick={() => handleDeleteUser(showDeleteConfirm)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold">Sí, Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
