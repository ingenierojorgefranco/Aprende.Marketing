
import React from 'react';
import { CRMContact } from '../../../types';
import { Mail, Phone, Calendar, User, ArrowRight, ExternalLink } from 'lucide-react';

interface CRMTableProps {
    contacts: CRMContact[];
    onSelectContact: (contact: CRMContact) => void;
}

export const CRMTable: React.FC<CRMTableProps> = ({ contacts, onSelectContact }) => {
    
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'new': return <span className="px-2 py-1 rounded text-[10px] uppercase font-bold bg-blue-900/30 text-blue-400 border border-blue-900">Nuevo</span>;
            case 'contacted': return <span className="px-2 py-1 rounded text-[10px] uppercase font-bold bg-yellow-900/30 text-yellow-400 border border-yellow-900">Contactado</span>;
            case 'interested': return <span className="px-2 py-1 rounded text-[10px] uppercase font-bold bg-purple-900/30 text-purple-400 border border-purple-900">Interesado</span>;
            case 'closed': return <span className="px-2 py-1 rounded text-[10px] uppercase font-bold bg-green-900/30 text-green-400 border border-green-900">Cliente</span>;
            case 'lost': return <span className="px-2 py-1 rounded text-[10px] uppercase font-bold bg-red-900/30 text-red-400 border border-red-900">Perdido</span>;
            default: return <span className="px-2 py-1 rounded text-[10px] uppercase font-bold bg-gray-800 text-gray-400">Desconocido</span>;
        }
    };

    const getInterestBadge = (level: string) => {
        // Por defecto mostramos 'Medio' (warm) si no está definido o es 'warm'
        if (!level || level === 'warm') return <span className="text-xs text-orange-400 font-bold">☀️ Medio</span>;
        
        switch (level) {
            case 'hot': return <span className="text-xs text-red-500 font-bold">🔥 Alto</span>;
            case 'cold': return <span className="text-xs text-blue-300 font-bold">❄️ Bajo</span>;
            default: return <span className="text-xs text-orange-400 font-bold">☀️ Medio</span>;
        }
    };

    if (contacts.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <User className="w-12 h-12 mb-4 opacity-20" />
                <p>No se encontraron contactos.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto h-full">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-800/50 text-gray-400 text-xs uppercase tracking-wider sticky top-0 z-10 backdrop-blur-md">
                    <tr>
                        <th className="p-4 border-b border-gray-800">Nombre / Email</th>
                        <th className="p-4 border-b border-gray-800">Estado</th>
                        <th className="p-4 border-b border-gray-800">Interés</th>
                        <th className="p-4 border-b border-gray-800">Origen</th>
                        <th className="p-4 border-b border-gray-800">Fecha Registro</th>
                        <th className="p-4 border-b border-gray-800 text-right">Acción</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-sm">
                    {contacts.map(contact => (
                        <tr key={contact.id} className="hover:bg-gray-800/30 transition group">
                            <td className="p-4">
                                <div className="font-bold text-white mb-1 text-base">{contact.name || 'Sin Nombre'}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Mail className="w-3.5 h-3.5" /> {contact.email}
                                </div>
                                {contact.phone && (
                                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                                        <Phone className="w-3.5 h-3.5" /> {contact.phone}
                                    </div>
                                )}
                            </td>
                            <td className="p-4">{getStatusBadge(contact.status)}</td>
                            <td className="p-4">{getInterestBadge(contact.interestLevel)}</td>
                            <td className="p-4 text-gray-400 text-xs max-w-[150px] truncate" title={contact.source}>
                                {contact.pageId ? (
                                    <a 
                                        href={contact.pageSlug ? `/lp/${contact.pageSlug}` : `/admin/lp/${contact.pageId}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 transition-colors group/link"
                                    >
                                        <span className="truncate">{contact.source}</span>
                                        <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-70 group-hover/link:opacity-100" />
                                    </a>
                                ) : (
                                    contact.source
                                )}
                            </td>
                            <td className="p-4 text-gray-500 text-xs">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(contact.createdAt).toLocaleDateString()}
                                </div>
                            </td>
                            <td className="p-4 text-right">
                                <button 
                                    onClick={() => onSelectContact(contact)}
                                    className="p-2 rounded-lg bg-gray-800 hover:bg-primary text-gray-400 hover:text-white transition opacity-0 group-hover:opacity-100"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
