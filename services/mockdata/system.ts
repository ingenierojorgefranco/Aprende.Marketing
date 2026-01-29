import { DashboardNews, LandingPage } from "../../types";

////////// Actualización: Datos mock para el Centro de Mando del Dashboard - 24/05/2024 16:45 //////////
export const MOCK_NEWS: DashboardNews[] = [
    {
        id: 'n1',
        title: 'Nueva Estructura VSL Optimizada',
        content: 'Hemos actualizado el motor de IA para generar guiones de video más persuasivos basados en la estructura de Jim Edwards.',
        date: 'Hoy, 10:45 AM',
        iconType: 'update'
    },
    {
        id: 'n2',
        title: 'Tip de la IA: Tasa de Rebote',
        content: 'Tu landing de "Uñas Pro" tiene una carga lenta. Optimiza las imágenes para mejorar el posicionamiento SEO.',
        date: 'Ayer, 4:20 PM',
        iconType: 'ia'
    },
    {
        id: 'n3',
        title: 'Masterclass: Cierre por WhatsApp',
        content: 'Ya disponible en la Academia la nueva lección sobre cómo usar el CRM para recuperar carritos abandonados.',
        date: '20 May',
        iconType: 'tip'
    }
];

export const MOCK_TOP_PAGES: Partial<LandingPage>[] = [
    { id: 'p1', name: 'Masterclass Microblading Pro', visits: 1250, conversions: 85 },
    { id: 'p2', name: 'Ebook: 5 Errores Fatales', visits: 840, conversions: 120 },
    { id: 'p3', name: 'Webinar Lanzamiento Noviembre', visits: 450, conversions: 32 }
];
////////// Fin de actualización - 24/05/2024 16:45 /////////