
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Users, Plus, Search, Filter, RefreshCw, Loader2, X, Globe } from 'lucide-react';
import { CRMTable } from './CRM_Table';
import { CRMContactDrawer } from './CRM_ContactDrawer';
import { CRMContact, LandingPage } from '../../../types';
import { api } from '../../../services/api';

export const CRM_Layout: React.FC = () => {
    const [contacts, setContacts] = useState<CRMContact[]>([]);
    const [allPages, setAllPages] = useState<LandingPage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState<CRMContact | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    
    // --- FILTRADO POR URL ---
    const [searchParams, setSearchParams] = useSearchParams();
    const filterPageId = searchParams.get('pageId') || 'all';
    const filterPageName = searchParams.get('pageName');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [contactsData, pagesData] = await Promise.all([
                api.getContacts(),
                api.getPages()
            ]);
            setContacts(contactsData);
            setAllPages(pagesData);
        } catch (error) {
            console.error("Error loading CRM data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNew = () => {
        const newContact: CRMContact = {
            id: 'new',
            name: '',
            email: '',
            phone: '',
            country: '',
            address: '',
            source: 'Manual',
            status: 'new',
            interestLevel: 'warm',
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

    const handleDeleteContact = async (id: string) => {
        try {
            await api.deleteContact(id);
            setContacts(prev => prev.filter(c => c.id !== id));
            setIsDrawerOpen(false);
        } catch (error) {
            alert("Error al eliminar el contacto.");
        }
    };

    const handlePageFilterChange = (pageId: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (pageId === 'all') {
            newParams.delete('pageId');
            newParams.delete('pageName');
        } else {
            const page = allPages.find(p => p.id === pageId);
            newParams.set('pageId', pageId);
            if (page) newParams.set('pageName', page.name);
        }
        setSearchParams(newParams);
    };

    const clearPageFilter = () => {
        handlePageFilterChange('all');
    };

    const filteredContacts = contacts.filter(contact => {
        const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              contact.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || contact.status === filterStatus;
        const matchesPage = filterPageId === 'all' || String(contact.pageId) === String(filterPageId);
        
        return matchesSearch && matchesStatus && matchesPage;
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
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex flex-col xl:flex-row gap-4 justify-between items-center shrink-0">
                <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto flex-1">
                    {/* Filtro por Estado */}
                    <div className="relative">
                        <Filter className="absolute top-2.5 left-3 w-4 h-4 text-gray-500" />
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-black border border-gray-700 text-white text-sm rounded-lg pl-9 pr-4 py-2 outline-none focus:border-primary appearance-none cursor-pointer w-full md:w-44"
                        >
                            <option value="all">Todos los Estados</option>
                            <option value="new">Nuevos</option>
                            <option value="contacted">Contactados</option>
                            <option value="interested">Interesados</option>
                            <option value="closed">Clientes (Cerrados)</option>
                            <option value="lost">Perdidos</option>
                        </select>
                    </div>

                    {/* Filtro por Página */}
                    <div className="relative">
                        <Globe className="absolute top-2.5 left-3 w-4 h-4 text-gray-500" />
                        <select 
                            value={filterPageId}
                            onChange={(e) => handlePageFilterChange(e.target.value)}
                            className="bg-black border border-gray-700 text-white text-sm rounded-lg pl-9 pr-4 py-2 outline-none focus:border-primary appearance-none cursor-pointer w-full md:w-56"
                        >
                            <option value="all">Todas las Páginas</option>
                            {allPages.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Buscador */}
                    <div className="relative flex-1">
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

                <div className="flex items-center gap-2">
                    {filterPageId !== 'all' && (
                        <button 
                            onClick={clearPageFilter}
                            className="flex items-center gap-2 px-3 py-2 bg-red-900/20 text-red-400 border border-red-900/30 rounded-lg text-xs font-bold hover:bg-red-900/40 transition"
                        >
                            <X className="w-3 h-3" /> Limpiar Filtro Pág.
                        </button>
                    )}
                    <button 
                        onClick={loadData} 
                        className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition"
                        title="Recargar"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    </button>
                </div>
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
                    onDelete={handleDeleteContact}
                />
            )}
        </div>
    );
};
