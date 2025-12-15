
import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Filter, RefreshCw, Loader2 } from 'lucide-react';
import { CRMTable } from './CRM_Table';
import { CRMContactDrawer } from './CRM_ContactDrawer';
import { CRMContact } from '../../../types';
import { api } from '../../../services/api';

export const CRM_Layout: React.FC = () => {
    const [contacts, setContacts] = useState<CRMContact[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState<CRMContact | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {
        setLoading(true);
        try {
            const data = await api.getContacts();
            setContacts(data);
        } catch (error) {
            console.error("Error loading CRM contacts", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNew = () => {
        // Prepare empty contact for creation
        const newContact: CRMContact = {
            id: 'new', // placeholder
            name: '',
            email: '',
            phone: '',
            country: '',
            address: '',
            source: 'Manual',
            status: 'new',
            interestLevel: 'cold',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        setSelectedContact(newContact);
        setIsDrawerOpen(true);
    };

    const handleEditContact = (contact: CRMContact) => {
        setSelectedContact(contact);
        setIsDrawerOpen(true);
    };

    const handleSaveContact = async (contact: CRMContact) => {
        try {
            if (contact.id === 'new') {
                const created = await api.createContact({
                    name: contact.name,
                    email: contact.email,
                    phone: contact.phone,
                    country: contact.country,
                    address: contact.address,
                    source: contact.source,
                    status: contact.status,
                    interestLevel: contact.interestLevel
                });
                setContacts(prev => [created, ...prev]);
            } else {
                await api.updateContact(contact);
                setContacts(prev => prev.map(c => c.id === contact.id ? contact : c));
            }
            setIsDrawerOpen(false);
        } catch (error) {
            alert("Error al guardar el contacto.");
        }
    };

    const filteredContacts = contacts.filter(contact => {
        const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              contact.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || contact.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6 animate-in fade-in h-full flex flex-col">
            <div className="flex justify-between items-center shrink-0">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Users className="w-6 h-6 text-primary" /> CRM de Clientes
                </h1>
                <button 
                    onClick={handleCreateNew} 
                    className="bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition shadow-lg shadow-primary/20"
                >
                    <Plus className="w-4 h-4" /> Nuevo Prospecto
                </button>
            </div>

            {/* Toolbar */}
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex flex-col md:flex-row gap-4 justify-between items-center shrink-0">
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative">
                        <Filter className="absolute top-2.5 left-3 w-4 h-4 text-gray-500" />
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-black border border-gray-700 text-white text-sm rounded-lg pl-9 pr-4 py-2 outline-none focus:border-primary appearance-none cursor-pointer w-full md:w-48"
                        >
                            <option value="all">Todos los Estados</option>
                            <option value="new">Nuevos</option>
                            <option value="contacted">Contactados</option>
                            <option value="interested">Interesados</option>
                            <option value="closed">Clientes (Cerrados)</option>
                            <option value="lost">Perdidos</option>
                        </select>
                    </div>
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute top-2.5 left-3 w-4 h-4 text-gray-500" />
                        <input 
                            type="text" 
                            placeholder="Buscar por nombre o email..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black border border-gray-700 text-white text-sm rounded-lg pl-9 pr-4 py-2 outline-none focus:border-primary"
                        />
                    </div>
                </div>
                <button 
                    onClick={loadContacts} 
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition"
                    title="Recargar"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-gray-900 rounded-xl border border-gray-800 overflow-hidden relative">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <CRMTable 
                        contacts={filteredContacts} 
                        onSelectContact={handleEditContact} 
                    />
                )}
            </div>

            {/* Drawer */}
            {isDrawerOpen && selectedContact && (
                <CRMContactDrawer 
                    contact={selectedContact} 
                    isOpen={isDrawerOpen} 
                    onClose={() => setIsDrawerOpen(false)}
                    onSave={handleSaveContact}
                />
            )}
        </div>
    );
};
