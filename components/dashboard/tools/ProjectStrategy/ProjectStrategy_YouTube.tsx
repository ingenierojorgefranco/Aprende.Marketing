import React, { useState, useEffect } from 'react';
import { 
  Youtube, Sparkles, Check, Copy, CheckCircle2, ArrowRight, 
  FileText, Lightbulb, Zap, ExternalLink, Loader2, BookOpen, Link2
} from 'lucide-react';
import { useOutletContext, useParams, useNavigate } from 'react-router-dom';
import { StepHeaderCard } from '../../wizard/StepHeaderCard';
import { StepVideoContainer } from '../../wizard/StepVideoContainer';
import { api } from '../../../../services/api';

interface ProjectStrategy_YouTubeProps {
  totalSteps?: number;
  strategyData?: any;
  overrideProjectId?: string;
  onNavigateNext?: () => void;
}

const parseDateSafe = (dateVal: any): Date | null => {
  if (!dateVal) return null;
  if (dateVal instanceof Date) return isNaN(dateVal.getTime()) ? null : dateVal;
  if (typeof dateVal === 'object' && dateVal.seconds) {
    return new Date(dateVal.seconds * 1000);
  }
  const parsed = new Date(dateVal);
  return isNaN(parsed.getTime()) ? null : parsed;
};

const formatRelativeTime = (dateVal: any) => {
  const date = parseDateSafe(dateVal);
  if (!date) return 'hace un momento';
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'hace unos segundos';
  if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60);
    return `hace ${mins} ${mins === 1 ? 'minuto' : 'minutos'}`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  }
  const days = Math.floor(diffInSeconds / 86400);
  if (days < 30) return `hace ${days} ${days === 1 ? 'día' : 'días'}`;
  const months = Math.floor(days / 30);
  return `hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
};

export const ProjectStrategy_YouTube: React.FC<ProjectStrategy_YouTubeProps> = ({
  totalSteps = 13,
  strategyData,
  overrideProjectId,
  onNavigateNext
}) => {
  const navigate = useNavigate();
  const { id: routeProjectId } = useParams() as { id: string };
  const projectId = overrideProjectId || routeProjectId;
  const context = useOutletContext() as any;
  const user = context?.user;

  const [activeTab, setActiveTab] = useState<'articles' | 'prompts' | 'best_practices'>('articles');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [masterProject, setMasterProject] = useState<any>(null);

  // Estado para artículos de blog generados y la URL de publicación
  const [generatedArticles, setGeneratedArticles] = useState<any[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [selectedArticleIdx, setSelectedArticleIdx] = useState(0);
  const [subdomain, setSubdomain] = useState<string>('demo');
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Cargar artículos del proyecto, datos del proyecto maestro y subdominio
  useEffect(() => {
    if (!projectId) return;
    let isMounted = true;
    setLoadingArticles(true);

    Promise.all([
      api.getArticlesByProject(projectId),
      api.getPages(),
      api.getProjectById(projectId)
    ]).then(async ([articles, pages, proj]) => {
      if (!isMounted) return;
      
      setProjectDetails(proj);

      // Sincronización con Proyecto Maestro (Opción A): Buscar la plantilla maestra de origen
      if (proj) {
        let mProj: any = null;
        if (proj.isMaster) {
          mProj = proj;
        } else if (proj.masterParentId) {
          try {
            mProj = await api.getProjectById(proj.masterParentId);
          } catch (e) {
            console.warn("Error cargando maestro directo:", e);
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
      }

      const projectPages = (pages || []).filter((p: any) => String(p.projectId) === String(projectId));
      if (projectPages.length > 0 && projectPages[0].subdomain) {
        setSubdomain(projectPages[0].subdomain.split('.')[0]);
      }

      const gen = (articles || []).filter((a: any) => 
        a.isGenerated || (a.contentHtml && typeof a.contentHtml === 'string' && a.contentHtml.trim().length > 0)
      );
      setGeneratedArticles(gen);
    }).catch(err => {
      console.error("Error cargando artículos para YouTube:", err);
    }).finally(() => {
      if (isMounted) setLoadingArticles(false);
    });

    return () => { isMounted = false; };
  }, [projectId]);

  // Redirección a la sección de Artículos de Blog (paso 9)
  const goToBlogArticles = () => {
    if (window.location.pathname.includes('project-guide')) {
      navigate(`/dashboard/project-guide?id=${projectId}&section=content&step=9`);
    } else {
      navigate(`/dashboard/strategy/${projectId}?section=content`);
    }
  };

  const [customPrompts, setCustomPrompts] = useState<Record<string, string>>({});

  // Extraer información relevante del proyecto priorizando SIEMPRE el PROYECTO MAESTRO (Opción A)
  const productName = 
    masterProject?.name ||
    masterProject?.productName ||
    masterProject?.strategy_json?.meta?.projectName ||
    projectDetails?.name ||
    projectDetails?.productName ||
    strategyData?.meta?.projectName ||
    strategyData?.meta?.insights?.overview?.items?.[0]?.value ||
    "nuestro producto digital";

  const avatarNiche = 
    masterProject?.niche ||
    masterProject?.strategy_json?.avatars?.[0]?.niche ||
    masterProject?.strategy_json?.meta?.insights?.avatar?.title ||
    projectDetails?.niche ||
    strategyData?.avatars?.[0]?.niche ||
    strategyData?.meta?.insights?.avatar?.title ||
    productName;

  const mainPainPoint = 
    masterProject?.strategy_json?.avatars?.[0]?.frustrations?.[0] ||
    strategyData?.avatars?.[0]?.frustrations?.[0] ||
    "la falta de resultados rápidos y la confusión de información";

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2500);
  };

  const promptsList = [
    {
      id: 'logo_youtube_image',
      tag: 'LOGOTIPO / FOTO DE PERFIL CON IA',
      title: '1. Generador de Logotipo y Foto de Perfil para Canal de YouTube',
      description: 'Copia y pega este prompt en cualquier IA de generación de imágenes (ChatGPT, Midjourney, DALL-E 3, Leonardo.ai) para crear el logotipo profesional de tu canal.',
      highlightWord: productName,
      promptText: `Diseña un logotipo único, profesional, moderno y visualmente impactante para un canal de YouTube sobre 

${productName}

Crea una identidad visual original, con tipografía grande y llamativa, colores armoniosos y elementos gráficos relacionados con la temática. Elige libremente el estilo, la composición y los colores para obtener un diseño diferente y creativo en cada generación. Formato cuadrado 1:1, optimizado para la foto de perfil circular de YouTube, con excelente legibilidad y calidad profesional.`
    },
    {
      id: 'banner_youtube_image',
      tag: 'PORTADA / BANNER DE YOUTUBE (2560x1440)',
      title: '2. Generador de Portada / Banner para Canal de YouTube',
      description: 'Copia y pega este prompt en cualquier IA de generación de imágenes para crear la portada oficial optimizada para móviles, PC y TV.',
      highlightWord: productName,
      promptText: `Crea una portada premium para YouTube sobre 

${productName}

con fotografías hiperrealistas, iluminación cinematográfica y estética elegante. Lienzo exacto: 2560 × 1440 px. Zona segura: 1546 × 423 px centrada. Área máxima exclusiva del texto: 850 × 180 px, coordenadas X=855–1705, Y=630–810. Coloca el título «${productName}» centrado, con fuente máxima de 48 px; si no cabe, reduce la fuente o divídelo en dos líneas. Debajo coloca «Aprende paso a paso a dominar esta técnica profesional» con fuente máxima de 24 px. Ninguna letra, sombra, borde ni decoración puede salir del bloque de texto. Distribuye fotografías profesionales del proceso y resultados por el resto del lienzo. Prioriza que todo el texto sea visible en móviles, ordenadores y televisores. No amplíes ni desplaces el título.`
    },
    {
      id: 'channel_description_seo',
      tag: 'DESCRIPCIÓN DEL CANAL DE YOUTUBE (SEO)',
      title: '3. Generador de Descripción SEO del Canal de YouTube',
      description: 'Copia y pega este prompt en ChatGPT o Gemini para redactar la descripción oficial optimizada de tu canal de YouTube (sección "Acerca de").',
      highlightWord: productName,
      promptText: `Actúa como un experto en SEO para YouTube. Genera una descripción atractiva y optimizada para un canal sobre 

${productName}

incorporando de forma natural palabras clave relevantes y búsquedas frecuentes. Incluye una introducción llamativa, los temas que aprenderán los espectadores, beneficios del canal, emojis, una llamada a suscribirse y 3 hashtags relacionados y reales que van a posicionar el canal de youtube. Utiliza un tono profesional, cercano y orientado a principiantes y futuros profesionales de este nicho. Máximo 1.000 caracteres.`
    }
  ];

  const currentSelectedArticle = generatedArticles[selectedArticleIdx] || generatedArticles[0];
  const currentArticleUrl = currentSelectedArticle 
    ? `${window.location.origin}/lp/${subdomain}/blog/${currentSelectedArticle.slug || 'articulo'}`
    : '';

  return (
    <div className="space-y-8 text-left w-full mx-auto pb-12">
      {/* Step Header */}
      <StepHeaderCard 
        stepNumber={7}
        totalSteps={totalSteps}
        categoryTitle="7. Estrategias de Atracción en YouTube"
        title={<>Estrategia de <span className="text-[#FF5A1F]">Atracción en YouTube</span></>}
        description="Aprovecha los artículos que ya has generado en tu blog para introducirlos en NotebookLM y crear guiones de video profesionales de manera automatizada. Además, utiliza nuestros Prompts optimizados para YouTube."
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
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'articles'
                ? 'bg-[#FF5A1F] text-white shadow-lg shadow-orange-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>1. Artículos para YouTube</span>
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
            <span>2. Prompts de Personalizar tu Canal</span>
          </button>
        </div>
      </div>

      {/* CONTENIDO PESTAÑA 1: ARTÍCULOS GENERADOS PARA NOTEBOOKLM */}
      {activeTab === 'articles' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {loadingArticles ? (
            <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-[#FF5A1F] animate-spin" />
              <p className="text-sm text-slate-400 font-medium">Cargando tus artículos generados...</p>
            </div>
          ) : generatedArticles.length === 0 ? (
            /* Estado cuando NO TIENE artículos generados */
            <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 text-[#FF5A1F] flex items-center justify-center shadow-lg">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="space-y-2 max-w-lg">
                <h3 className="text-xl font-extrabold text-white">No tienes artículos de blog generados</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Para utilizar tus artículos en NotebookLM y crear guiones o videos de YouTube automatizados, primero debes redactar al menos un artículo en la sección de <strong>Artículos de Blog</strong>.
                </p>
              </div>
              <button
                onClick={goToBlogArticles}
                className="mt-2 px-6 py-3.5 rounded-xl bg-[#FF5A1F] hover:bg-[#ff6d38] text-white font-bold text-sm transition-all shadow-lg shadow-orange-500/20 inline-flex items-center gap-2 cursor-pointer hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ir a Crear Artículos de Blog</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Estado cuando SÍ TIENE artículos generados */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Columna Izquierda: Tarjeta Independiente con Lista de Artículos */}
              <div className="lg:col-span-5 bg-[#0B1120] border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl">
                <div className="border-b border-slate-800/80 pb-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Artículos de Blog</h3>
                      <p className="text-xs text-slate-400">Selecciona un artículo para YouTube</p>
                    </div>
                  </div>

                  <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{generatedArticles.length} disponibles</span>
                  </div>
                </div>

                {/* Lista de Artículos */}
                <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                  {generatedArticles.map((art, idx) => {
                    const isSelected = selectedArticleIdx === idx;
                    const timeAgo = formatRelativeTime(art.publishedAt || art.updatedAt || art.createdAt);
                    return (
                      <div
                        key={art.id || idx}
                        onClick={() => setSelectedArticleIdx(idx)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-left ${
                          isSelected
                            ? 'bg-[#041d1a]/80 border-emerald-500 shadow-lg shadow-emerald-500/10'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <h4 className={`text-sm sm:text-base font-bold leading-snug ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                            {art.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 font-normal">
                            Redactado: {timeAgo}
                          </p>
                        </div>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-600'
                        }`}>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Columna Derecha: Tarjeta Independiente de Detalle del Artículo */}
              <div className="lg:col-span-7 bg-[#0B1120] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl flex flex-col justify-between">
                <div className="space-y-5">
                  {/* Badge & Título Principal */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                      <Check className="w-3 h-3 stroke-[3]" /> ARTÍCULO GENERADO
                    </span>

                    <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                      {currentSelectedArticle?.title}
                    </h3>
                  </div>

                  {/* Campo con la URL del Artículo */}
                  <div className="space-y-2 pt-1">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-[#FF5A1F]" />
                      <span>URL del Artículo</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={currentArticleUrl}
                      className="w-full bg-[#060a12] border border-slate-800/90 rounded-xl px-4 py-3.5 text-xs sm:text-sm font-mono text-emerald-400 focus:outline-none select-all"
                    />
                  </div>

                  {/* Botones de Acción */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                    <button
                      onClick={() => {
                        if (currentArticleUrl) {
                          navigator.clipboard.writeText(currentArticleUrl);
                          setCopiedUrl(true);
                          setTimeout(() => setCopiedUrl(false), 2500);
                        }
                      }}
                      className={`w-full sm:flex-1 py-3.5 px-5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                        copiedUrl
                          ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                          : 'bg-[#FF5A1F] hover:bg-[#ff6d38] text-white shadow-orange-500/20'
                      }`}
                    >
                      {copiedUrl ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedUrl ? '¡URL Copiada!' : 'Copiar URL'}</span>
                    </button>

                    <a
                      href={`/lp/${subdomain}/blog/${currentSelectedArticle?.slug || 'articulo'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:flex-1 py-3.5 px-5 rounded-xl font-bold text-sm bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700/80 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Ver artículo</span>
                    </a>
                  </div>
                </div>

                {/* PROMPTS PERSONALIZADOS PARA EL ARTÍCULO SELECCIONADO */}
                <div className="pt-6 border-t border-slate-800/80 space-y-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Prompts de IA Personalizados para este Artículo</h4>
                    </div>
                  </div>

                  {/* Renderizado de Prompts en orden: 1. Video Largo, 2. Miniaturas, 3. Títulos, 4. Descripción */}
                  {(() => {
                    const artTitle = currentSelectedArticle?.title || "Nuestro Artículo de Blog";
                    
                    const longVideoText = `amplia el contenido y busca referencias interesantes y añádelas al video que tiene como título 


${artTitle}


Recuerda que en el contenido que generes debes mantener exactamente este titulo y añadirlo en la primer diapositiva
Empieza la persona diciendo el titulo del video, no digas nada sobre que esta es una investigación, ni análisis ni nada similar, empieza con el titulo del video
Empieza con un diseño altamente llamativo en la primer diapositiva para llamar la atención del usuario según el siguiente titulo:


${artTitle}


Para que tenga mejor contexto y se brinde la mejor información posible para aumentar al máximo el ctr. haz un contenido en video 100% informativo tipo podcast superando los 15 minutos en donde te enfoques con base en el contenido en resolver el tema del video (amplia el contenido para que supere los 15 minutos) según el titulo:


${artTitle}


Antes de la mitad del video añade un cta invitando a nuestra clase gratuita de 


${productName}


Con nuestro profesor experto donde aprenderas todos los beneficios, dile al usuario si no ingresa a la clase que puede suceder negativo con base en su dolor (Haz bullet points de los puntos negativos si no aprende) y luego habla de los beneficios (enfocándote en 5 temas positivos y beneficios de aprender ${productName}) y Al finalizar Invita al usuario a nuestra clase gratuita donde aprendera las bases, la aplicacion, los materiales y todo lo necesario para convertir la tecnica en una gran oportunidad de negocio que le permita vivir una mejor calidad de vida

no hables sobre lo que la persona aprendera en la clase, sino en el beneficio de aprender según el contenido del articulo

Contexto del Video:

${productName}`;

                    const thumbText = `Tengo un video de YouTube que busca atraer el mayor numero de audiencia cualificada con contenidos de alto valor, quiero que actúes como un experto en diseño, Photoshop y canva con más de 10 años de experiencia haciendo miniaturas de YouTube para Mr Beast, en el que te enfocas en crear contenidos que generan efecto wow, cumple con las políticas y generan interés inmediato en la audiencia con colores que impactan e imágenes de alto realismo que gustan a las personas, generan curiosidad y atraen el máximo de clics elevando el CTR como ningún otra imagen.

Vas a generar tres imágenes altamente persuasivas para el video, usando los diseños que has creado para Mr Beast pero sin aparecer Mr Beast

Analiza el título y el contenido del vídeo e identifica su ángulo más impactante: error, mito, advertencia, secreto, comparación, revelación o resultado (Siempre negativa para llamar mas la atencion)
Genera una frase persuasiva de 2 a 4 palabras que complemente el título, despierte curiosidad y sea específica y fiel al contenido (Siempre negativa para llamar mas la atencion)
Puede transmitir sorpresa, urgencia, controversia o advertencia, según corresponda.
Colócala en un bloque rojo llamativo, con letras blancas o amarillas, grandes y en negrita. Resalta visualmente la palabra más importante.
Varía las expresiones entre vídeos, evita repetir el título y nunca inventes engaños, riesgos o afirmaciones para generar clics.


los contenidos que vas a generar tienen que estar enfocados en un video que tiene como titulo:

${artTitle}

Contexto

${productName}`;

                    const titlesText = `tengo este título de un articulo de blog, dime que titulo podríamos usar optimizado para Youtube, analiza muy bien y dame variantes para el titulo que tenga contexto, debe estar enfocado en personas que quieran aprender sobre el video, y debes darme la mejor opción según tu recomendación, califica los resultados, intenta resaltar las palabras mas importantes en Mayúscula para hacerlo altamente optimizado para Youtube

Titulo del Video:

${artTitle}

Contexto

${productName}`;

                    const capturePageUrl = `${window.location.origin}/lp/${subdomain}`;

                    const descText = `He creado un video de Youtube con este contenido que tiene como titulo:

${artTitle}

que tiene como contexto

${productName}

Ayúdame a generar una descripción para el video de YouTube optimizado 100% al máximo para posicionar este contenido en el buscador, el objetivo de esta descripción es que añadas palabras claves al interior del contenido que podrían posicionarlo y que estén relacionadas con el objetivo del video, la idea es que esta descripción le de contexto al video y posicione el contenido en YouTube

al final del video añade el siguiente cta exacto

¡REGÍSTRATE AHORA A NUESTRA CLASE GRATUITA DE ${productName.toUpperCase()}!📌
👉 ${capturePageUrl}

También dame los Hahstags relacionados con este video que añadiremos en la sección de etiquetas del video de Youtube, el objetivo es que estas etiquetas estén relacionadas con el contenido 

sigue las siguientes instrucciones:

- Dame el texto en una caja para copiar y pegar
- Dame máximo 5 palabras claves que serán usadas en las etiquetas
- La longitud de la descripción no debe ser demasiado largo
- No me des referencias en el texto, lo que quiero con el contenido es copiar y pegar
- No lo hagas demasiado extenso
- Dame 3 hahstags elacionados dentro del texto`;

                    const pLongVal = customPrompts['p_long'] !== undefined ? customPrompts['p_long'] : longVideoText;
                    const pThumbVal = customPrompts['p_thumb'] !== undefined ? customPrompts['p_thumb'] : thumbText;
                    const pTitlesVal = customPrompts['p_titles'] !== undefined ? customPrompts['p_titles'] : titlesText;
                    const pDescVal = customPrompts['p_desc'] !== undefined ? customPrompts['p_desc'] : descText;

                    return (
                      <div className="space-y-5">
                        {/* Prompt 1: Video Largo (APARECE PRIMERO) */}
                        <div className="bg-[#060a12] border border-slate-800 rounded-xl p-4 space-y-3">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <h5 className="text-sm sm:text-base font-bold text-white">
                              1. Guión Estructurado para Video Largo (+15 Mins Podcast)
                            </h5>
                            <button
                              onClick={() => handleCopyText('p_long', pLongVal)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                copiedPromptId === 'p_long'
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-[#FF5A1F] hover:bg-[#ff6d38] text-white'
                              }`}
                            >
                              {copiedPromptId === 'p_long' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedPromptId === 'p_long' ? '¡Copiado!' : 'Copiar Prompt'}</span>
                            </button>
                          </div>

                          <div className="space-y-1">
                            <textarea
                              value={pLongVal}
                              onChange={(e) => setCustomPrompts(prev => ({ ...prev, p_long: e.target.value }))}
                              rows={6}
                              className="w-full bg-slate-900/90 border border-slate-800/80 focus:border-[#FF5A1F]/60 rounded-lg p-3 font-mono text-sm text-slate-200 leading-relaxed focus:outline-none resize-y select-text"
                            />
                          </div>
                        </div>

                        {/* Prompt 2: Miniaturas */}
                        <div className="bg-[#060a12] border border-slate-800 rounded-xl p-4 space-y-3">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <h5 className="text-sm sm:text-base font-bold text-white">
                              2. Generador de Miniaturas / Portadas (CTR Viral)
                            </h5>
                            <button
                              onClick={() => handleCopyText('p_thumb', pThumbVal)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                copiedPromptId === 'p_thumb'
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-[#FF5A1F] hover:bg-[#ff6d38] text-white'
                              }`}
                            >
                              {copiedPromptId === 'p_thumb' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedPromptId === 'p_thumb' ? '¡Copiado!' : 'Copiar Prompt'}</span>
                            </button>
                          </div>

                          <div className="space-y-1">
                            <textarea
                              value={pThumbVal}
                              onChange={(e) => setCustomPrompts(prev => ({ ...prev, p_thumb: e.target.value }))}
                              rows={6}
                              className="w-full bg-slate-900/90 border border-slate-800/80 focus:border-[#FF5A1F]/60 rounded-lg p-3 font-mono text-sm text-slate-200 leading-relaxed focus:outline-none resize-y select-text"
                            />
                          </div>
                        </div>

                        {/* Prompt 3: Títulos Magnéticos */}
                        <div className="bg-[#060a12] border border-slate-800 rounded-xl p-4 space-y-3">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <h5 className="text-sm sm:text-base font-bold text-white">
                              3. Generador de Títulos Magnéticos para YouTube
                            </h5>
                            <button
                              onClick={() => handleCopyText('p_titles', pTitlesVal)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                copiedPromptId === 'p_titles'
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-[#FF5A1F] hover:bg-[#ff6d38] text-white'
                              }`}
                            >
                              {copiedPromptId === 'p_titles' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedPromptId === 'p_titles' ? '¡Copiado!' : 'Copiar Prompt'}</span>
                            </button>
                          </div>

                          <div className="space-y-1">
                            <textarea
                              value={pTitlesVal}
                              onChange={(e) => setCustomPrompts(prev => ({ ...prev, p_titles: e.target.value }))}
                              rows={5}
                              className="w-full bg-slate-900/90 border border-slate-800/80 focus:border-[#FF5A1F]/60 rounded-lg p-3 font-mono text-sm text-slate-200 leading-relaxed focus:outline-none resize-y select-text"
                            />
                          </div>
                        </div>

                        {/* Prompt 4: Descripción Magnética */}
                        <div className="bg-[#060a12] border border-slate-800 rounded-xl p-4 space-y-3">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <h5 className="text-sm sm:text-base font-bold text-white">
                              4. Generador de Descripción Magnética para YouTube
                            </h5>
                            <button
                              onClick={() => handleCopyText('p_desc', pDescVal)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                copiedPromptId === 'p_desc'
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-[#FF5A1F] hover:bg-[#ff6d38] text-white'
                              }`}
                            >
                              {copiedPromptId === 'p_desc' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedPromptId === 'p_desc' ? '¡Copiado!' : 'Copiar Prompt'}</span>
                            </button>
                          </div>

                          <div className="space-y-1">
                            <textarea
                              value={pDescVal}
                              onChange={(e) => setCustomPrompts(prev => ({ ...prev, p_desc: e.target.value }))}
                              rows={6}
                              className="w-full bg-slate-900/90 border border-slate-800/80 focus:border-[#FF5A1F]/60 rounded-lg p-3 font-mono text-sm text-slate-200 leading-relaxed focus:outline-none resize-y select-text"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
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
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-2">
              {promptsList.map((item) => {
                const isCopied = copiedPromptId === item.id;
                const currentVal = customPrompts[item.id] !== undefined ? customPrompts[item.id] : item.promptText;

                return (
                  <div key={item.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3.5 text-left shadow-md">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h4 className="text-base font-bold text-white">
                        {item.title}
                      </h4>

                      <button
                        onClick={() => handleCopyText(item.id, currentVal)}
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
                        rows={7}
                        className="w-full bg-[#060a12] border border-slate-800 focus:border-[#FF5A1F]/60 rounded-xl p-4 font-mono text-sm text-slate-200 leading-relaxed focus:outline-none resize-y select-text shadow-inner"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
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
