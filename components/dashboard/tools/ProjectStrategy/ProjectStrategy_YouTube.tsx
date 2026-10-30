import React, { useState } from 'react';
import { 
  Youtube, Sparkles, Check, Copy, CheckCircle2, ArrowRight, 
  Settings, FileText, Lightbulb, Zap, PlayCircle, Layers, 
  ExternalLink, Info, CheckSquare, ShieldCheck, Target
} from 'lucide-react';
import { useOutletContext, useParams } from 'react-router-dom';
import { StepHeaderCard } from '../../wizard/StepHeaderCard';
import { StepVideoContainer } from '../../wizard/StepVideoContainer';

interface ProjectStrategy_YouTubeProps {
  totalSteps?: number;
  strategyData?: any;
  overrideProjectId?: string;
  onNavigateNext?: () => void;
}

export const ProjectStrategy_YouTube: React.FC<ProjectStrategy_YouTubeProps> = ({
  totalSteps = 13,
  strategyData,
  overrideProjectId,
  onNavigateNext
}) => {
  const { id: routeProjectId } = useParams() as { id: string };
  const projectId = overrideProjectId || routeProjectId;
  const context = useOutletContext() as any;
  const user = context?.user;

  const [activeTab, setActiveTab] = useState<'checklist' | 'prompts' | 'best_practices'>('checklist');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  // Estado del checklist de configuración del canal
  const [checklistItems, setChecklistItems] = useState<Record<string, boolean>>({
    brand_account: false,
    channel_branding: false,
    banner_links: false,
    upload_defaults: false,
    subscribe_watermark: false,
  });

  const toggleChecklistItem = (key: string) => {
    setChecklistItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const completedChecklistCount = Object.values(checklistItems).filter(Boolean).length;
  const totalChecklistCount = Object.keys(checklistItems).length;

  // Extraer información relevante del proyecto para personalizar los Prompts
  const productName = strategyData?.meta?.projectName || strategyData?.meta?.insights?.overview?.items?.[0]?.value || "nuestro producto digital";
  const avatarNiche = strategyData?.avatars?.[0]?.niche || strategyData?.meta?.insights?.avatar?.title || "personas interesadas en superarse y aprender";
  const mainPainPoint = strategyData?.avatars?.[0]?.frustrations?.[0] || "la falta de resultados rápidos y la confusión de información";

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2500);
  };

  const promptsList = [
    {
      id: 'titles_ctr',
      tag: 'TÍTULOS & IDEAS VIRALES',
      title: '1. Generador de Títulos Virales con Alto CTR para YouTube',
      description: 'Genera 10 títulos altamente clickeables y optimizados para búsquedas (SEO) y algoritmo de sugeridos.',
      promptText: `Actúa como un estratega experto en contenido para YouTube con millones de reproducciones. Necesito 10 ideas de títulos altamente atractivos y clickeables para mi canal enfocado en promover ${productName}.

Audiencia Objetivo: ${avatarNiche}.
Problema principal que resuelven mis videos: ${mainPainPoint}.

Requisitos para los títulos:
1. Usar desencadenantes psicológicos (curiosidad, urgencia, descubrimiento, errores comunes).
2. Mantenerlos en menos de 65 caracteres para que no se corten en móviles.
3. Incluir palabras clave con alto volumen de búsqueda en YouTube relacionadas con el nicho.
4. Generar 5 títulos para videos largos de YouTube (8 a 15 mins) y 5 para YouTube Shorts (menos de 60s).`
    },
    {
      id: 'long_video_script',
      tag: 'GUIÓN VIDEO LARGO (8-15 MINS)',
      title: '2. Guión Estructurado para Video de YouTube de Alta Conversión',
      description: 'Estructura paso a paso para un video educativo largo que enganche desde el segundo 1 y convierta espectadores en leads.',
      promptText: `Escribe un guión completo para un video de YouTube de 10 minutos promocionando ${productName}.

Público objetivo: ${avatarNiche}.
Problema a solucionar: ${mainPainPoint}.

Estructura requerida para el guión:
- HOOK DE ENTRADA (0:00 - 0:15): Gancho visual y verbal irresistible. Por qué deben ver este video HOY.
- INTRODUCCIÓN RÁPIDA (0:15 - 0:45): Breve presentación de la promesa y llamado a suscribirse.
- CUERPO DEL VIDEO (Puntos 1, 2 y 3): Explicación paso a paso educativa sin rodeos. En cada punto añade una recomendación práctica.
- LANCE / PITCH SUTIL: Cómo ${productName} ahorra tiempo y acelera este proceso.
- CALL TO ACTION FINAL (Últimos 45s): Indicación clara para hacer clic en el enlace de la descripción o del primer comentario fijado.`
    },
    {
      id: 'shorts_script',
      tag: 'YOUTUBE SHORTS (30-60S)',
      title: '3. Guión Rápido para YouTube Shorts (Formato Vertical)',
      description: 'Aprovecha el formato vertical para capturar audiencia masiva en YouTube Shorts y dirigirla a tu embudo.',
      promptText: `Crea 3 guiones de YouTube Shorts de 45 segundos cada uno para promocionar ${productName}.

Audiencia: ${avatarNiche}.
Formato:
- 00:00 a 00:03 -> Hook impactante de apertura (pregunta reto o afirmación contundente).
- 00:03 a 00:35 -> 3 tips rápidos sin pausas muertas.
- 00:35 a 00:45 -> Llamado a la acción directo: "Haz clic en el enlace del primer comentario fijado para acceder a nuestra clase/guía completa".`
    },
    {
      id: 'seo_description',
      tag: 'DESCRIPCIÓN Y COMENTARIO FIJADO',
      title: '4. Descripción SEO y Primer Comentario Fijado con Enlace',
      description: 'Optimización SEO de la caja de descripción y primer comentario para posicionar en búsquedas y convertir visitas.',
      promptText: `Escribe una descripción optimizada para SEO en YouTube y un primer comentario fijado para un video sobre ${productName}.

Requisitos:
1. Párrafo inicial de 3 líneas con palabras clave principales sobre ${productName} y ${avatarNiche}.
2. Sección de ENLACES CLAVE:
   - "👉 Accede aquí a tu sistema completo: [INSERTAR TU LINK DE AFILIADO / LANDING]"
   - "💬 Chatea con nosotros por WhatsApp: [INSERTAR LINK DE WHATSAPP]"
3. Lista de Marcas de Tiempo (Timestamps / Capítulos del video).
4. 5 Hashtags relevantes para YouTube (#YouTubeShorts, #${productName.replace(/\s+/g, '')}, etc.).
5. Redacta también el texto exacto para el PRIMER COMENTARIO FIJADO con emojis atractivos y llamado al enlace.`
    }
  ];

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto pb-12">
      {/* Step Header */}
      <StepHeaderCard 
        stepNumber={7}
        totalSteps={totalSteps}
        categoryTitle="7. Estrategias de Atracción en YouTube"
        title={<>Estrategia de <span className="text-[#FF5A1F]">Atracción en YouTube</span></>}
        description="Aprende a configurar tu canal de YouTube de manera profesional y utiliza los Prompts optimizados con IA para crear videos largos y Shorts de alta conversión que atraigan prospectos calificados las 24 horas del día."
      />

      {/* Video Lección del Paso */}
      <div className="bg-[#0B1120] border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
        <StepVideoContainer 
          stepNumber={7}
          title="Estrategia de Atracción con YouTube"
          user={user}
        />
      </div>

      {/* Navegación por Pestañas principales */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'checklist'
                ? 'bg-[#FF5A1F] text-white shadow-lg shadow-orange-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>1. Configuración del Canal ({completedChecklistCount}/{totalChecklistCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('prompts')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'prompts'
                ? 'bg-[#FF5A1F] text-white shadow-lg shadow-orange-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>2. Prompts de IA para YouTube</span>
          </button>

          <button
            onClick={() => setActiveTab('best_practices')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'best_practices'
                ? 'bg-[#FF5A1F] text-white shadow-lg shadow-orange-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            <span>3. Estrategia & Conversión</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 font-medium hidden md:block">
          Estrategia Evergreen • Posicionamiento SEO en Google & YouTube
        </div>
      </div>

      {/* CONTENIDO PESTAÑA 1: CHECKLIST DE CONFIGURACIÓN */}
      {activeTab === 'checklist' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center shrink-0">
                  <Youtube className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Checklist de Configuración del Canal</h3>
                  <p className="text-xs text-slate-400">Sigue estos 5 pasos para tener un canal profesional enfocado en ventas</p>
                </div>
              </div>

              {/* Barra de Progreso del Checklist */}
              <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300">
                  Progreso: <strong className="text-emerald-400">{Math.round((completedChecklistCount / totalChecklistCount) * 100)}%</strong>
                </span>
                <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${(completedChecklistCount / totalChecklistCount) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Lista de Tareas */}
            <div className="space-y-3.5">
              {[
                {
                  key: 'brand_account',
                  title: '1. Crea tu Cuenta de Marca en YouTube',
                  desc: 'Ingresa a YouTube con tu cuenta de Google y crea un canal de marca relacionado con tu nicho (ej. "Aprende Microblading", "Emprende Digital"). Usar una cuenta de marca te permite administrarla mejor y delegar en el futuro.',
                  tag: 'Fundamento'
                },
                {
                  key: 'channel_branding',
                  title: '2. Diseña un Banner e Imagen de Perfil Atractivos',
                  desc: 'Agrega un logo o foto limpia y profesional en tu perfil. En el banner de la portada, coloca una frase clara indicando el valor que entregas (ej. "Aprende a montar tu propio negocio digital paso a paso").',
                  tag: 'Diseño & Marca'
                },
                {
                  key: 'banner_links',
                  title: '3. Enlaza tu Página de Captura en el Banner',
                  desc: 'Dirígete a YouTube Studio > Personalización > Información básica > Enlaces. Añade el enlace de tu Página de Captura o WhatsApp para que aparezca visible directamente en la portada de tu canal.',
                  tag: 'Captación de Leads'
                },
                {
                  key: 'upload_defaults',
                  title: '4. Configura Valores Predeterminados de Subida',
                  desc: 'Ve a YouTube Studio > Configuración > Valores predeterminados de subida. Deja guardado un texto de descripción maestro que incluya tus links de afiliado y llamado a la acción para no tener que escribirlo cada vez.',
                  tag: 'Ahorro de Tiempo'
                },
                {
                  key: 'subscribe_watermark',
                  title: '5. Marca de Agua de Suscripción en Videos',
                  desc: 'En Personalización > Marca, sube un botón pequeño de "Suscribirse" (150x150 px) para que aparezca en la esquina inferior derecha de todos tus videos y aumente tus suscriptores automáticamente.',
                  tag: 'Crecimiento Orgánico'
                }
              ].map((item) => {
                const isDone = checklistItems[item.key];
                return (
                  <div
                    key={item.key}
                    onClick={() => toggleChecklistItem(item.key)}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 text-left select-none ${
                      isDone
                        ? 'bg-emerald-500/5 border-emerald-500/40 hover:bg-emerald-500/10'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      isDone
                        ? 'bg-emerald-500 text-white'
                        : 'border-2 border-slate-700 bg-slate-800 text-transparent'
                    }`}>
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`text-sm sm:text-base font-bold ${isDone ? 'text-emerald-300 line-through opacity-90' : 'text-white'}`}>
                          {item.title}
                        </h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-400 font-normal leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO PESTAÑA 2: PROMPTS DE IA */}
      {activeTab === 'prompts' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Prompts de Inteligencia Artificial para YouTube</h3>
                  <p className="text-xs text-slate-400">Copia estos prompts personalizados y pégalos en ChatGPT o Gemini para generar tus títulos, guiones y descripciones en segundos.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-2">
              {promptsList.map((item) => {
                const isCopied = copiedPromptId === item.id;
                return (
                  <div key={item.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3.5 text-left shadow-md">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 text-[#FF5A1F]">
                          {item.tag}
                        </span>
                        <h4 className="text-base font-bold text-white">
                          {item.title}
                        </h4>
                      </div>

                      <button
                        onClick={() => handleCopyText(item.id, item.promptText)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                          isCopied
                            ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                            : 'bg-[#FF5A1F] text-white hover:bg-[#ff6d38] shadow-orange-500/20'
                        }`}
                      >
                        {isCopied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? '¡Prompt Copiado!' : 'Copiar Prompt'}</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-400 font-normal">
                      {item.description}
                    </p>

                    <div className="relative bg-[#060a12] border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap select-all">
                      {item.promptText}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO PESTAÑA 3: ESTRATEGIA & CONVERSIÓN */}
      {activeTab === 'best_practices' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Pilar 1 */}
            <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 space-y-3 text-left shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-base">
                1
              </div>
              <h4 className="text-base font-bold text-white">Miniaturas (Thumbnails) de Alto Impacto</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                La miniatura es responsable del 80% de los clics. Usa rostros expresivos, textos cortos de máximo 3 o 4 palabras y alto contraste de colores (amarillo, rojo, blanco sobre fondos oscuros).
              </p>
            </div>

            {/* Pilar 2 */}
            <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 space-y-3 text-left shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-base">
                2
              </div>
              <h4 className="text-base font-bold text-white">Retención en los primeros 30 segundos</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                No pierdas tiempo con intros largas ni animaciones pesadas. Inicia directamente confirmando la promesa del título para que el espectador no cierre el video.
              </p>
            </div>

            {/* Pilar 3 */}
            <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 space-y-3 text-left shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-base">
                3
              </div>
              <h4 className="text-base font-bold text-white">Llamados a la Acción Claros</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Menciona tu enlace verbalmente hacia el minuto 3 y al final. Recuerda decirles siempre: "Encuentra el enlace directo en el primer comentario fijado de este video".
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500/10 via-amber-500/10 to-[#FF5A1F]/10 border border-[#FF5A1F]/30 rounded-2xl p-6 space-y-3 text-left shadow-xl">
            <div className="flex items-center gap-2 text-[#FF5A1F] font-bold text-sm uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              <span>Estrategia de Sinergia: Shorts + Videos Largos</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              Sube entre 3 y 5 <strong>YouTube Shorts</strong> a la semana utilizando los mismos Hooks de Atracción de la Sección 6. Utiliza el Short para captar atención rápida y redirigir a tu audiencia hacia tus videos largos o directamente a tu <strong>Página de Captura de Leads</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Botón Siguiente Paso */}
      <div className="pt-6 border-t border-slate-800 flex items-center justify-end">
        <button
          onClick={onNavigateNext}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#FF5A1F] hover:bg-[#ff6d38] text-white font-bold text-base transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
        >
          <span>Siguiente Paso: Carruseles Magnéticos (Paso 8)</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
