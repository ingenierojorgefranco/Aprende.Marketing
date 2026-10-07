import React, { useState, useEffect } from 'react';
import { 
    Users, Plus, Search, Filter, RefreshCw, Loader2, 
    TrendingUp, Award, Clock, ArrowRight, UserCheck, MessageSquare 
} from 'lucide-react';
import { StepHeaderCard } from '../../wizard/StepHeaderCard';
import { StepVideoContainer } from '../../wizard/StepVideoContainer';
import { CRMTable } from '../../crm/CRM_Table';
import { CRMContactDrawer } from '../../crm/CRM_ContactDrawer';
import { CRMContact, LandingPage } from '../../../../types';
import { api } from '../../../../services/api';

interface ProjectStrategy_LeadsProps {
    totalSteps: number;
    projectId: string;
}

export const ProjectStrategy_Leads: React.FC<ProjectStrategy_LeadsProps> = ({ totalSteps, projectId }) => {
    const [contacts, setContacts] = useState<CRMContact[]>([]);
    const [projectPages, setProjectPages] = useState<LandingPage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState<CRMContact | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        loadData();
    }, [projectId]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [contactsData, pagesData] = await Promise.all([
                api.getContacts(),
                api.getPages()
            ]);
            
            // Filtrar las páginas de este proyecto
            const filteredPages = pagesData.filter((p: any) => String(p.projectId) === String(projectId));
            setProjectPages(filteredPages);
            
            // Guardar todos los contactos
            setContacts(contactsData);
        } catch (error) {
            console.error("Error loading project leads CRM data", error);
        } finally {
            setLoading(false);
        }
    };

    // Obtener las IDs de las páginas de este proyecto para filtrar los contactos
    const projectPageIds = projectPages.map((p: any) => String(p.id));
    
    // Filtrar contactos que pertenecen a alguna página de este proyecto
    const projectContacts = contacts.filter((contact: CRMContact) => 
        contact.pageId && projectPageIds.includes(String(contact.pageId))
    );

    // Filtrar por término de búsqueda y por estado
    const filteredContacts = projectContacts.filter((contact: CRMContact) => {
        const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (contact.phone && contact.phone.includes(searchTerm));
        const matchesStatus = filterStatus === 'all' || contact.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleCreateNew = () => {
        const newContact: CRMContact = {
            id: 'new',
            name: '',
            email: '',
            phone: '',
            country: '',
            address: '',
            source: projectPages[0]?.name || 'Manual (Proyecto)',
            pageId: projectPages[0]?.id,
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
                    pageId: contact.pageId,
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

    // Estadísticas rápidas para las métricas
    const countByStatus = (status: string) => projectContacts.filter(c => c.status === status).length;
    const totalLeadsCount = projectContacts.length;

    return (
        <div className="space-y-6 text-left animate-in fade-in duration-500">
            
            {/* HEADER DEL PASO 4 */}
            <StepHeaderCard
                stepNumber={4}
                totalSteps={totalSteps}
                stageNumber={1}
                categoryTitle="Leads capturados"
                title="Gestor de Leads y Contactos (CRM)"
                description="Aquí puedes ver la base de datos completa de prospectos que se han registrado en tu página de captura de este proyecto en específico. Hazles seguimiento, cambia su estado y añade notas de venta."
            />

            {/* CONTENEDOR TUTORIAL Y CRM */}
            <div className="space-y-6">
                
                {/* VIDEO TUTORIAL BLOQUE */}
                <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
                    <StepVideoContainer 
                        stepNumber={4}
                        videoUrl="https://www.youtube.com/embed/vGfXD9VbfXo?rel=0&controls=1&showinfo=0"
                        title="Cómo Gestionar y Cerrar tus Leads"
                    />
                </div>

                {/* MÉTRICAS RÁPIDAS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#0B1120] border border-slate-800/80 p-4 sm:p-5 rounded-2xl text-left hover:border-[#FF5A1F]/30 transition-all shadow-md">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Leads</span>
                        <p className="text-xl sm:text-2xl font-black text-white mt-1">{totalLeadsCount}</p>
                    </div>
                    <div className="bg-[#0B1120] border border-emerald-950/40 p-4 sm:p-5 rounded-2xl text-left hover:border-emerald-500/30 transition-all shadow-md">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Clientes (Cerrados)</span>
                        <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">{countByStatus('closed')}</p>
                    </div>
                    <div className="bg-[#0B1120] border border-slate-800/80 p-4 sm:p-5 rounded-2xl text-left hover:border-blue-500/30 transition-all shadow-md">
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Nuevos</span>
                        <p className="text-xl sm:text-2xl font-black text-blue-400 mt-1">{countByStatus('new')}</p>
                    </div>
                    <div className="bg-[#0B1120] border border-slate-800/80 p-4 sm:p-5 rounded-2xl text-left hover:border-purple-500/30 transition-all shadow-md">
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">Interesados</span>
                        <p className="text-xl sm:text-2xl font-black text-purple-400 mt-1">{countByStatus('interested')}</p>
                    </div>
                </div>

                {/* CRM COMPACTO */}
                <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
                    
                    {/* Toolbar de acciones rápidas */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-between items-center pb-4 border-b border-slate-800/80">
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-1">
                            {/* Input de Búsqueda */}
                            <div className="relative flex-1 max-w-md w-full">
                                <Search className="absolute top-3 left-3.5 w-4 h-4 text-slate-500" />
                                <input 
                                    type="text" 
                                    placeholder="Buscar por nombre, email o teléfono..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-[#060913] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#FF5A1F] text-white transition-all placeholder:text-slate-600 font-medium"
                                />
                            </div>

                            {/* Filtro de Estado */}
                            <div className="relative w-full sm:w-44">
                                <select 
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="w-full bg-[#060913] border border-slate-700/80 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-[#FF5A1F] appearance-none cursor-pointer font-semibold"
                                >
                                    <option value="all">Todos los Estados</option>
                                    <option value="new">Nuevos</option>
                                    <option value="contacted">Contactados</option>
                                    <option value="interested">Interesados</option>
                                    <option value="closed">Clientes (Cerrados)</option>
                                    <option value="lost">Perdidos</option>
                                </select>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                            <button 
                                onClick={loadData}
                                title="Actualizar datos"
                                className="p-2.5 bg-slate-800/60 hover:bg-slate-800 text-slate-300 rounded-xl transition-all border border-slate-700/50"
                            >
                                <RefreshCw className="w-4.5 h-4.5" />
                            </button>
                            <button 
                                onClick={handleCreateNew}
                                className="bg-[#FF5A1F] hover:bg-[#E04D15] text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-[#FF5A1F]/15"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Añadir Lead</span>
                            </button>
                        </div>
                    </div>

                    {/* Tabla de Leads */}
                    <div className="bg-[#060913]/40 rounded-xl border border-slate-800/50 overflow-hidden min-h-[300px]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                                <Loader2 className="w-8 h-8 animate-spin text-[#FF5A1F]" />
                                <span className="text-sm font-semibold">Cargando base de datos del proyecto...</span>
                            </div>
                        ) : filteredContacts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-500 text-center px-4 max-w-md mx-auto space-y-4">
                                <Users className="w-12 h-12 text-slate-700" />
                                <div className="space-y-1">
                                    <h4 className="text-white font-extrabold text-base">Sin leads para este filtro</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        No hay prospectos que coincidan con la búsqueda, o aún no has recibido registros en las páginas de captura de este proyecto.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="custom-scrollbar overflow-x-auto">
                                <CRMTable 
                                    contacts={filteredContacts} 
                                    onSelectContact={handleEditContact} 
                                />
                            </div>
                        )}
                    </div>

                </div>

            </div>

            {/* CONTACT DETAILS DRAWER */}
            {selectedContact && (
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
