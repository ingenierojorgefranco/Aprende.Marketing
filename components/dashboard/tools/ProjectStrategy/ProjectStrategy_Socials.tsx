import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Copy, Share2, Youtube, Instagram } from 'lucide-react';
import { useOutletContext, useParams } from 'react-router-dom';
import { StepHeaderCard } from '../../wizard/StepHeaderCard';
import { StepVideoContainer } from '../../wizard/StepVideoContainer';
import { api } from '../../../../services/api';

interface ProjectStrategy_SocialsProps {
  totalSteps?: number;
  strategyData?: any;
  overrideProjectId?: string;
  user?: any;
  isAdmin?: boolean;
}

export const ProjectStrategy_Socials: React.FC<ProjectStrategy_SocialsProps> = ({
  totalSteps = 15,
  strategyData,
  overrideProjectId,
  user: propUser,
  isAdmin: propIsAdmin
}) => {
  const { id: routeProjectId } = useParams() as { id: string };
  const projectId = overrideProjectId || routeProjectId;
  const context = useOutletContext() as any;
  const activeUser = propUser || context?.user;
  const isAdmin = propIsAdmin ?? (activeUser?.role === 'admin' || activeUser?.role === 'superuser');

  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [customPrompts, setCustomPrompts] = useState<Record<string, string>>({});
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [masterProject, setMasterProject] = useState<any>(null);

  useEffect(() => {
    if (!projectId) return;
    let isMounted = true;

    api.getProjectById(projectId).then(async (proj) => {
      if (!isMounted || !proj) return;
      setProjectDetails(proj);

      let mProj: any = null;
      if (proj.isMaster) {
        mProj = proj;
      } else if (proj.masterParentId) {
        try {
          mProj = await api.getProjectById(proj.masterParentId);
        } catch (e) {
          console.warn("Error cargando maestro:", e);
        }
      }

      if (!mProj) {
        try {
          const masterLib = await api.getMasterLibrary();
          mProj = masterLib.find((m: any) => 
            String(m.id) === String(proj.masterParentId) || 
            (m.name && proj.name && m.name.toLowerCase() === proj.name.toLowerCase()) ||
            (m.productName && proj.productName && m.productName.toLowerCase() === proj.productName.toLowerCase())
          );
        } catch (e) {
          console.warn("Error buscando en biblioteca maestra:", e);
        }
      }

      if (mProj && isMounted) {
        setMasterProject(mProj);
      }
    }).catch(err => {
      console.error("Error cargando datos del proyecto para redes sociales:", err);
    });

    return () => { isMounted = false; };
  }, [projectId]);

  const productName = 
    masterProject?.name ||
    masterProject?.productName ||
    masterProject?.strategy_json?.meta?.projectName ||
    projectDetails?.name ||
    projectDetails?.productName ||
    strategyData?.meta?.projectName ||
    strategyData?.meta?.insights?.overview?.items?.[0]?.value ||
    "nuestro producto digital";

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2500);
  };

  const promptsList = [
    {
      id: 'logo_youtube_image',
      tag: 'LOGOTIPO / FOTO DE PERFIL CON IA',
      title: '1. Generador de Logotipo y Foto de Perfil para Canal de YouTube y Redes',
      description: 'Copia y pega este prompt en cualquier IA de generación de imágenes (ChatGPT, Midjourney, DALL-E 3, Leonardo.ai) para crear el logotipo profesional de tu canal y perfiles de redes sociales.',
      highlightWord: productName,
      promptText: `Diseña un logotipo único, profesional, moderno y visualmente impactante para un canal de YouTube y perfiles de redes sociales sobre 

${productName}

Crea una identidad visual original, con tipografía grande y llamativa, colores armoniosos y elementos gráficos relacionados con la temática. Elige libremente el estilo, la composición y los colores para obtener un diseño diferente y creativo en cada generación. Formato cuadrado 1:1, optimizado para la foto de perfil circular de YouTube, Instagram y TikTok, con excelente legibilidad y calidad profesional.`
    },
    {
      id: 'banner_youtube_image',
      tag: 'PORTADA / BANNER DE YOUTUBE Y REDES (2560x1440)',
      title: '2. Generador de Portada / Banner para Canal de YouTube',
      description: 'Copia y pega este prompt en cualquier IA de generación de imágenes para crear la portada oficial optimizada para móviles, PC y TV.',
      highlightWord: productName,
      promptText: `Crea una portada premium para YouTube y redes sociales sobre 

${productName}

con fotografías hiperrealistas, iluminación cinematográfica y estética elegante. Lienzo exacto: 2560 × 1440 px. Zona segura: 1546 × 423 px centrada. Área máxima exclusiva del texto: 850 × 180 px, coordenadas X=855–1705, Y=630–810. Coloca el título «${productName}» centrado, con fuente máxima de 48 px; si no cabe, reduce la fuente o divídelo en dos líneas. Debajo coloca «Aprende paso a paso a dominar esta técnica profesional» con fuente máxima de 24 px. Ninguna letra, sombra, borde ni decoración puede salir del bloque de texto. Distribuye fotografías profesionales del proceso y resultados por el resto del lienzo. Prioriza que todo el texto sea visible en móviles, ordenadores y televisores. No amplíes ni desplaces el título.`
    },
    {
      id: 'channel_description_seo',
      tag: 'DESCRIPCIÓN Y BIOGRAFÍA DE REDES SOCIALES (SEO)',
      title: '3. Generador de Biografía y Descripción SEO para tus Redes Sociales',
      description: 'Copia y pega este prompt en ChatGPT o Gemini para redactar la descripción y biografía optimizada de tu canal de YouTube, Instagram y TikTok.',
      highlightWord: productName,
      promptText: `Actúa como un experto en SEO y redes sociales. Genera biografías y descripciones atractivas y optimizadas para cuentas de YouTube, Instagram y TikTok sobre 

${productName}

incorporando de forma natural palabras clave relevantes y búsquedas frecuentes. Incluye una introducción llamativa, los temas que aprenderán los espectadores, beneficios de seguir la cuenta, emojis, una llamada a suscribirse/seguir y 3-5 hashtags relacionados y reales que van a posicionar tus redes. Utiliza un tono profesional, cercano y orientado a principiantes y futuros clientes. Entrega: 1) Descripción para YouTube (máx 1.000 caracteres), 2) Biografía corta para Instagram (máx 150 caracteres), 3) Biografía corta para TikTok.`
    }
  ];

  return (
    <div className="space-y-8 text-left w-full mx-auto pb-12 animate-in fade-in duration-300">
      {/* Step Header */}
      <StepHeaderCard 
        stepNumber={7}
        totalSteps={totalSteps}
        stageNumber={2}
        categoryTitle="7. Creando tus Redes Sociales"
        title={<>Crea y Configura <span className="text-[#FF5A1F]">tus Redes Sociales</span></>}
        description="Sigue los tutoriales para crear tu canal de YouTube, perfil de Instagram, cuenta de TikTok y otras redes necesarias para tu ecosistema de ventas."
      />

      {/* Video Lección del Paso */}
      <div className="bg-[#0B1120] border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
        <StepVideoContainer 
          stepNumber={7}
          videoUrl="https://www.youtube.com/embed/x4NdPhJTXxM?rel=0&controls=1&showinfo=0"
          title="Creación y Configuración de Redes Sociales"
          user={activeUser}
          isAdmin={isAdmin}
        />
      </div>

      {/* Bloque de Prompts de Inteligencia Artificial para Personalizar tus Redes */}
      <div className="bg-[#0B1120] border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-6 shadow-xl">
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">Prompts de Inteligencia Artificial para Personalizar tus Redes</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Usa estos prompts en ChatGPT, Midjourney o DALL-E para crear la imagen y marca de tus cuentas de YouTube, Instagram y TikTok.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 pt-1">
          {promptsList.map((item) => {
            const isCopied = copiedPromptId === item.id;
            const currentVal = customPrompts[item.id] !== undefined ? customPrompts[item.id] : item.promptText;

            return (
              <div key={item.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3.5 text-left shadow-md">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black tracking-wider uppercase text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-md inline-block">
                      {item.tag}
                    </span>
                    <h4 className="text-base font-bold text-white">
                      {item.title}
                    </h4>
                  </div>

                  <button
                    onClick={() => handleCopyText(item.id, currentVal)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                      isCopied
                        ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                        : 'bg-[#FF5A1F] text-white hover:bg-[#ff6d38] shadow-orange-500/20'
                    }`}
                  >
                    {isCopied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{isCopied ? '¡Prompt Copiado!' : 'Copiar Prompt'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-400 font-normal leading-relaxed">
                  {item.description}
                </p>

                {/* Area de texto editable en vivo */}
                <div className="space-y-1">
                  {customPrompts[item.id] !== undefined && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => setCustomPrompts(prev => {
                          const next = { ...prev };
                          delete next[item.id];
                          return next;
                        })}
                        className="text-amber-400 hover:underline cursor-pointer text-xs font-semibold"
                      >
                        Restablecer prompt original
                      </button>
                    </div>
                  )}

                  <textarea
                    value={currentVal}
                    onChange={(e) => setCustomPrompts(prev => ({ ...prev, [item.id]: e.target.value }))}
                    rows={6}
                    className="w-full bg-[#060a12] border border-slate-800 focus:border-[#FF5A1F]/60 rounded-xl p-4 font-mono text-sm text-slate-200 leading-relaxed focus:outline-none resize-y select-text shadow-inner"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
