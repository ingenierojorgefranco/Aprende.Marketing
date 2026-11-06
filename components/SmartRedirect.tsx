import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { getCurrentUser } from '../services/auth';

export const SmartRedirect: React.FC = () => {
    const { destination } = useParams() as { destination?: string };
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [statusMessage, setStatusMessage] = useState('Resolviendo tu proyecto...');

    useEffect(() => {
        const resolveRedirect = async () => {
            const rawDest = (destination || searchParams.get('to') || 'reels').toLowerCase().trim();
            const currentUser = getCurrentUser();

            // 1. Si no hay usuario en sesión, guardar el destino y redirigir a Login
            if (!currentUser) {
                const targetGoUrl = `/go/${rawDest}`;
                if (typeof window !== 'undefined') {
                    localStorage.setItem('pre_login_redirect', targetGoUrl);
                }
                navigate(`/login?redirect=${encodeURIComponent(targetGoUrl)}`, { replace: true });
                return;
            }

            // Caso Especial: Redirección a Modal de Precios / Suscripción
            if (['subscription', 'suscription', 'suscripcion', 'upgrade', 'planes', 'precios', 'pricing', 'plan', 'pro'].includes(rawDest)) {
                setStatusMessage('Cargando planes de suscripción...');
                navigate('/dashboard?upgrade=true', { replace: true });
                return;
            }

            try {
                setStatusMessage('Cargando tus proyectos...');
                const projects = await api.getProjects();

                // 2. Si el usuario no tiene proyectos creados todavía
                if (!projects || projects.length === 0) {
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('post_onboarding_redirect', `/go/${rawDest}`);
                    }
                    setStatusMessage('Redirigiendo al asistente inicial...');
                    navigate('/welcome', { replace: true });
                    return;
                }

                // 3. Seleccionar el proyecto activo (el más reciente o el primero disponible)
                const activeProject = projects[0];
                const projectId = activeProject.id;

                // 4. Mapeo inteligente de secciones según el alias en la URL
                let targetSection = 'hooks';
                switch (rawDest) {
                    case 'reels':
                    case 'reel':
                    case 'hooks':
                    case 'hook':
                    case 'videos':
                        targetSection = 'hooks';
                        break;
                    case 'carousels':
                    case 'carousel':
                    case 'carruseles':
                        targetSection = 'carousels';
                        break;
                    case 'landing':
                    case 'funnel':
                    case 'captura':
                    case 'web':
                    case 'pagina':
                    case 'paginas':
                        targetSection = 'web';
                        break;
                    case 'youtube':
                    case 'yt':
                        targetSection = 'youtube';
                        break;
                    case 'blog':
                    case 'articles':
                    case 'articulos':
                    case 'content':
                    case 'contenido':
                        targetSection = 'content';
                        break;
                    case 'avatar':
                    case 'buyer':
                    case 'comprador':
                    case 'cliente':
                        targetSection = 'avatar';
                        break;
                    case 'hotlinks':
                    case 'enlaces':
                    case 'afiliados':
                        targetSection = 'hotlinks';
                        break;
                    case 'leads':
                    case 'prospectos':
                        targetSection = 'leads';
                        break;
                    case 'email':
                    case 'emails':
                    case 'correos':
                    case 'conversion':
                    case 'secuencia':
                        targetSection = 'email';
                        break;
                    case 'evergreen':
                    case 'nutricion':
                        targetSection = 'evergreen';
                        break;
                    case 'whatsapp':
                    case 'lanzamiento':
                    case 'lanzamientos':
                        targetSection = 'whatsapp';
                        break;
                    case 'summary':
                    case 'estrategia':
                    case 'resumen':
                        targetSection = 'summary';
                        break;
                    case 'leadmagnet':
                    case 'iman':
                        targetSection = 'leadmagnet';
                        break;
                    case 'onboarding':
                    case 'bienvenida':
                    case 'introduccion':
                    case 'inicio':
                    case 'guia':
                        targetSection = 'onboarding';
                        break;
                    default:
                        targetSection = rawDest; // Si se pasa una sección exacta directamente
                        break;
                }

                const finalUrl = `/dashboard/projects/${projectId}/strategy?section=${targetSection}`;
                setStatusMessage('Redirigiendo a tu herramienta...');
                navigate(finalUrl, { replace: true });
            } catch (err) {
                console.error('[SmartRedirect Error]', err);
                navigate('/dashboard', { replace: true });
            }
        };

        resolveRedirect();
    }, [destination, searchParams, navigate]);

    return (
        <div className="min-h-screen bg-[#0B0B0B] flex flex-col items-center justify-center p-6 text-white text-center animate-in fade-in">
            <div className="w-16 h-16 bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 text-[#FF5A1F] rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-[#FF5A1F]/10">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h2 className="text-2xl font-black mb-2 text-white">Redirigiendo a tu proyecto...</h2>
            <p className="text-gray-400 text-sm max-w-sm">{statusMessage}</p>
        </div>
    );
};
