
import React from 'react';
import { CRMContact } from '../../../types';
import { Mail, Phone, Calendar, User, ArrowRight, Trash2 } from 'lucide-react';

interface CRMTableProps {
    contacts: CRMContact[];
    onSelectContact: (contact: CRMContact) => void;
    onDeleteContact: (id: string) => void;
}

export const CRMTable: React.FC<CRMTableProps> = ({ contacts, onSelectContact, onDeleteContact }) => {
    
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
        switch (level) {
            case 'hot': return <span className="text-xs text-red-500 font-bold">🔥 Alto</span>;
            case 'warm': return <span className="text-xs text-orange-400 font-bold">☀️ Medio</span>;
            case 'cold': return <span className="text-xs text-blue-300 font-bold">❄️ Bajo</span>;
            default: return null;
        }
    };

    const handleDeleteClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm("¿Estás seguro de eliminar este contacto y todo su historial? Esta acción no se puede deshacer.")) {
            onDeleteContact(id);
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
                        <tr key={contact.id} className="hover:bg-gray-800/30 transition group cursor-pointer" onClick={() => onSelectContact(contact)}>
                            <td className="p-4">
                                <div className="font-bold text-white mb-0.5">{contact.name || 'Sin Nombre'}</div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Mail className="w-3 h-3" /> {contact.email}
                                </div>
                                {contact.phone && (
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                        <Phone className="w-3 h-3" /> {contact.phone}
                                    </div>
                                )}
                            </td>
                            <td className="p-4">{getStatusBadge(contact.status)}</td>
                            <td className="p-4">{getInterestBadge(contact.interestLevel)}</td>
                            <td className="p-4 text-gray-400 text-xs max-w-[150px] truncate" title={contact.source}>
                                {contact.source}
                            </td>
                            <td className="p-4 text-gray-500 text-xs">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(contact.createdAt).toLocaleDateString()}
                                </div>
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                                    <button 
                                        onClick={(e) => handleDeleteClick(e, contact.id)}
                                        className="p-2 rounded-lg bg-gray-800 hover:bg-red-900/30 text-gray-400 hover:text-red-400 transition"
                                        title="Eliminar"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <button 
                                        className="p-2 rounded-lg bg-gray-800 hover:bg-primary text-gray-400 hover:text-white transition"
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};