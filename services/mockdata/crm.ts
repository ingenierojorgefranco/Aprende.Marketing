import { CRMContact, CRMActivity, Lead } from "../../types";

// --- MOCK CRM DATA ---
export const MOCK_CRM_CONTACTS: CRMContact[] = [
    {
        id: "crm-1",
        name: "María Garcia",
        email: "maria@example.com",
        phone: "+57 300 123 4567",
        country: "Colombia",
        address: "Calle 100 #15-20, Bogotá",
        source: "Landing Principal Microblading",
        status: "new",
        interestLevel: "warm",
        lastContactedAt: new Date(Date.now() - 86400000), // 1 day ago
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
        updatedAt: new Date()
    },
    {
        id: "crm-2",
        name: "Carlos Pérez",
        email: "carlos@example.com",
        phone: "+52 55 9876 5432",
        country: "México",
        address: "",
        source: "Webinar Registro",
        status: "contacted",
        interestLevel: "hot",
        lastContactedAt: new Date(),
        createdAt: new Date(Date.now() - 259200000), // 3 days ago
        updatedAt: new Date()
    },
    {
        id: "crm-3",
        name: "Ana López",
        email: "ana@example.com",
        phone: "+34 600 123 123",
        country: "España",
        source: "Manual",
        status: "closed",
        interestLevel: "hot",
        createdAt: new Date(Date.now() - 604800000), // 7 days ago
        updatedAt: new Date()
    },
    {
        id: "crm-4",
        name: "Laura Martínez",
        email: "laura.martinez@test.com",
        phone: "+1 305 123 4567",
        country: "USA",
        source: "Instagram Ads",
        status: "interested",
        interestLevel: "warm",
        createdAt: new Date(Date.now() - 432000000), // 5 days ago
        updatedAt: new Date()
    }
];

export const MOCK_CRM_ACTIVITIES: CRMActivity[] = [
    { id: "act-1", contactId: "crm-1", type: "lead_submission", content: "Se registró en la Landing Page 'Landing Principal Microblading'", createdAt: new Date(Date.now() - 172800000) },
    { id: "act-2", contactId: "crm-1", type: "note", content: "Nota: Dice que le interesa pagar en cuotas. Volver a contactar mañana.", createdAt: new Date(Date.now() - 86400000) },
    { id: "act-3", contactId: "crm-2", type: "lead_submission", content: "Se registró en Webinar", createdAt: new Date(Date.now() - 259200000) },
    { id: "act-4", contactId: "crm-2", type: "status_change", content: "Cambio de estado: Nuevo -> Contactado", createdAt: new Date() },
    { id: "act-5", contactId: "crm-2", type: "lead_submission", content: "Ingresado Manualmente", createdAt: new Date(Date.now() - 604800000) },
    { id: "act-6", contactId: "crm-3", type: "status_change", content: "Cambio de estado: Interesado -> Cliente", createdAt: new Date() },
    { id: "act-7", contactId: "crm-3", type: "note", content: "Cliente VIP. Compró el paquete completo.", createdAt: new Date() }
];

export const MOCK_LEADS: Lead[] = [
  { id: "lead-1", name: "Maria Garcia", email: "maria@test.com", sourcePage: "Landing Principal Microblading", date: "2024-03-15", synced: false },
  { id: "lead-2", name: "Laura Lopez", email: "laura@test.com", sourcePage: "Landing Principal Microblading", date: "2024-03-14", synced: true },
  { id: "lead-3", name: "Carlos Perez", email: "carlos@demo.com", sourcePage: "Landing Principal Microblading", date: "2024-03-13", synced: true }
];