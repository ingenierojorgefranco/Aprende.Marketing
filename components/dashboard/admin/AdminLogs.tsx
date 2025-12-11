
import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { SystemLog } from '../../../types';
import { Loader2, Search, Filter, Clock, User, Activity, RefreshCw } from 'lucide-react';

export const AdminLogs: React.FC = () => {
    const [logs, setLogs] = useState<SystemLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [filterAction, setFilterAction] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [hasMore, setHasMore] = useState(true);

    const loadLogs = async (isReset = false) => {
        setLoading(true);
        const targetPage = isReset ? 1 : page;
        try {
            const newLogs = await api.getSystemLogs(targetPage, {
                action: filterAction !== 'all' ? filterAction : undefined,
                search: searchTerm || undefined
            });
            
            if (isReset) {
                setLogs(newLogs);
                setPage(2);
            } else {
                setLogs(prev => [...prev, ...newLogs]);
                setPage(prev => prev + 1);
            }
            
            // If we got fewer than 20 items (limit), there are no more
            if (newLogs.length < 20) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Initial load and filter change
    useEffect(() => {
        // Debounce search
        const timeoutId = setTimeout(() => {
            loadLogs(true);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [filterAction, searchTerm]);

    const getActionColor = (action: string) => {
        if (action.includes('DELETE')) return 'text-red-400 bg-red-900/20 border-red-900/50';
        if (action.includes('CREATE')) return 'text-green-400 bg-green-900/20 border-green-900/50';
        if (action.includes('LOGIN')) return 'text-blue-400 bg-blue-900/20 border-blue-900/50';
        if (action.includes('REGISTER')) return 'text-purple-400 bg-purple-900/20 border-purple-900/50';
        return 'text-gray-400 bg-gray-800 border-gray-700';
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Activity className="w-6 h-6 text-primary" /> Logs del Sistema
            </h1>

            {/* Toolbar */}
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative">
                        <Filter className="absolute top-2.5 left-3 w-4 h-4 text-gray-500" />
                        <select 
                            value={filterAction}
                            onChange={(e) => setFilterAction(e.target.value)}
                            className="bg-black border border-gray-700 text-white text-sm rounded-lg pl-9 pr-4 py-2 outline-none focus:border-primary appearance-none cursor-pointer"
                        >
                            <option value="all">Todas las Acciones</option>
                            <option value="LOGIN">Logins</option>
                            <option value="REGISTER">Registros</option>
                            <option value="CREATE_PAGE">Páginas Creadas</option>
                            <option value="DELETE_PAGE">Páginas Eliminadas</option>
                            <option value="CREATE_PROJECT">Proyectos Creados</option>
                            <option value="DELETE_PROJECT">Proyectos Eliminados</option>
                            <option value="CREATE_ARTICLE">Artículos Creados</option>
                        </select>
                    </div>
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute top-2.5 left-3 w-4 h-4 text-gray-500" />
                        <input 
                            type="text" 
                            placeholder="Buscar usuario o detalle..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black border border-gray-700 text-white text-sm rounded-lg pl-9 pr-4 py-2 outline-none focus:border-primary"
                        />
                    </div>
                </div>
                <button onClick={() => loadLogs(true)} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition">
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Logs List */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4">Fecha / Hora</th>
                            <th className="p-4">Usuario</th>
                            <th className="p-4">Acción</th>
                            <th className="p-4">Detalle</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-sm">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-800/50 transition">
                                <td className="p-4 text-gray-400 whitespace-nowrap font-mono text-xs">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-3 h-3" />
                                        {new Date(log.created_at).toLocaleString()}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-500" />
                                        <span className="text-white font-medium">{log.user_name || 'Desconocido'}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold border ${getActionColor(log.action_type)}`}>
                                        {log.action_type}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-300 max-w-md truncate" title={log.details || ''}>
                                    {log.details ? (
                                        <span className="font-mono text-xs">{log.details}</span>
                                    ) : (
                                        <span className="text-gray-600 italic">-</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {logs.length === 0 && !loading && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">No hay registros que coincidan con los filtros.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                
                {/* Load More Trigger */}
                {hasMore && (
                    <div className="p-4 border-t border-gray-800 flex justify-center">
                        <button 
                            onClick={() => loadLogs(false)} 
                            disabled={loading}
                            className="text-sm text-primary hover:text-white transition font-bold disabled:opacity-50"
                        >
                            {loading ? 'Cargando más...' : 'Cargar más antiguos'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
