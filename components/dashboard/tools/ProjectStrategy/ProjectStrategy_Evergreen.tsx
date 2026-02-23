import React, { useState, useEffect } from 'react';
import { Calendar, Sparkles, Check, Info, Crown, Mail, ArrowRight, BookOpen, ChevronRight, PenTool, PlayCircle, X, Loader2, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PlanFeatures, PlanLimits, Plan, Article } from '../../../../types';
import { api } from '../../../../services/api';

interface ProjectStrategy_EvergreenProps {
    evergreenData: any[];
    avatars: any[];
    activeEvergreenEmail: number;
    setActiveEvergreenEmail: (idx: number) => void;
    onUpgrade: () => void;
    
    // Props de límites y datos vinculados
    features?: PlanFeatures;
    planLimits?: PlanLimits;
    nextPlan?: Plan | null;
    linkedArticles?: Article[];
}

export const ProjectStrategy_Evergreen: React.FC<ProjectStrategy_EvergreenProps> = ({
    evergreenData, avatars, activeEvergreenEmail, setActiveEvergreenEmail, onUpgrade, features, planLimits, nextPlan, linkedArticles = []
}) => {
    const navigate = useNavigate();
    const [generatingId, setGeneratingId] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState<string | null>(null);

    // Si no hay artículos, mostramos el estado vacío con invitación a generar contenido
    if (linkedArticles.length === 0) {
        return (
            <div id="psd-evergreen-empty" className="space-y-12 animate-in fade-in duration-500 pt-8">
                <div id="psd-evergreen-header" className="max-w-[70em] mx-auto text-left space-y-8 py-10">
                    <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-500/5">
                        <Sparkles className="w-4 h-4" /> Correos Electrónicos a largo plazo
                    </div>
                    <h3 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl">
                        Secuencia de Autoridad <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">(Evergreen)</span>
                    </h3>
                    
                    <div className="flex flex-col md:flex-row gap-10 items-center text-white text-[1.3rem] leading-[2.5rem] font-light">
                        <p className="flex-1 border-l-4 border-orange-500 pl-8 py-2">
                            Esta secuencia se construye automáticamente a partir de los artículos que generes en la sección "Contenido". Cada artículo se transforma en un punto de contacto para nutrir a tu audiencia.
                        </p>
                        <div className="hidden md:block w-px h-24 bg-blue-500/30"></div>
                        <div 
                            className="flex-1 w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black relative group"
                        >
                            <iframe 
                                className="w-full h-full rounded-2xl"
                                src="https://www.youtube.com/embed/5sntDvgSKUo?rel=0&controls=1&showinfo=0" 
                                title="Video Tutorial" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>

                <div className="bg-[#111] p-16 rounded-[3rem] border border-white/5 text-center space-y-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5">
                        <BookOpen className="w-32 h-32 text-orange-500" />
                    </div>
                    <div className="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center text-orange-500 mx-auto border border-orange-500/20 shadow-lg">
                        <Info className="w-10 h-10" />
                    </div>
                    <div className="max-w-md mx-auto">
                        <h4 className="text-2xl font-black text-white uppercase tracking-tight mb-4">Sin contenidos generados</h4>
                        <p className="text-gray-400 font-medium leading-relaxed">
                            Para activar la secuencia Evergreen, primero debes redactar al menos un artículo SEO en la pestaña "Generar Estrategia de Contenidos".
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate({ search: "?section=content" })}
                        className="px-10 py-4 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-900/20 flex items-center justify-center gap-3 mx-auto transform hover:scale-[1.03]"
                    >
                        Ir a Generar Contenidos <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        );
    }

    const handleGenerateEmail = async (article: Article) => {
        if (generatingId) return;
        setGeneratingId(article.id);

        try {
            const prompt = `
                Actúa como un experto en Email Marketing y Copywriting de Respuesta Directa.
                Tu objetivo es redactar un correo electrónico persuasivo para invitar a un prospecto a leer el siguiente artículo de blog:
                
                TÍTULO DEL ARTÍCULO: ${article.title}
                RESUMEN/DESCRIPCIÓN: ${article.description}
                CONTENIDO (HTML): ${article.contentHtml.substring(0, 2000)}
                
                INSTRUCCIONES:
                1. El asunto debe ser intrigante, corto y con un emoji (máximo 60 caracteres).
                2. El cuerpo del correo debe ser cercano, empático y generar curiosidad por el contenido del artículo.
                3. Usa un tono profesional pero amigable (Tú).
                4. No incluyas el enlace final, solo el texto del correo.
                5. El correo debe terminar con una transición natural hacia la lectura del artículo.
                
                Responde estrictamente en formato JSON:
                {
                    "subject": "Asunto del correo",
                    "body": "Cuerpo del correo en formato texto plano con saltos de línea \\n"
                }
            `;

            const response = await api.generateWithIA(prompt, { responseMimeType: 'application/json' });
            const result = JSON.parse(response.text);

            await api.updateArticle(article.id, {
                ...article,
                emailSubject: result.subject,
                emailBody: result.body
            });

            // Recargar la página o actualizar el estado local si fuera necesario
            // En este caso, como linkedArticles viene de arriba, lo ideal sería que el padre refresque
            window.location.reload(); 
        } catch (error) {
            console.error("Error generating email:", error);
            alert("Hubo un error al generar el correo. Por favor intenta de nuevo.");
        } finally {
            setGeneratingId(null);
        }
    };

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopySuccess(id);
        setTimeout(() => setCopySuccess(null), 2000);
    };

    // Mapeamos los artículos reales a una secuencia dinámica
    const dynamicSequence = linkedArticles.map((article, idx) => ({
        id: article.id,
        day: `Día ${8 + (idx * 7)}`,
        subject: article.emailSubject || `[LECTURA RECOMENDADA] ${article.title}`,
        body: article.emailBody,
        type: 'Evergreen / Valor',
        objective: 'Construir autoridad de marca enviando tráfico al blog de tu landing page.',
        articleSlug: article.slug,
        originalArticle: article
    }));

    const activeEmail = dynamicSequence[activeEvergreenEmail] || dynamicSequence[0];

    return (
        <div id="psd-evergreen-section" className="space-y-12 animate-in fade-in duration-500 pt-8">
            {/* ENCABEZADO ESTRATÉGICO */}
            <div id="psd-evergreen-header" className="max-w-[70em] mx-auto text-left space-y-8 py-10">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-500/5">
                    <Sparkles className="w-4 h-4" /> Secuencia dinámica activa
                </div>
                <h3 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl">
                    Tu Estrategia <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">Evergreen de 30 Días</span>
                </h3>
                
                <div className="flex flex-col md:flex-row gap-10 items-center text-white text-[1.3rem] leading-[2.5rem] font-light">
                    <p className="flex-1 border-l-4 border-blue-500 pl-8 py-2">
                        Tienes {linkedArticles.length} artículos vinculados. El sistema ha programado estos correos para enviarse a partir del Día 8, manteniendo tu oferta presente sin ser invasivo.
                    </p>
                    <div className="hidden md:block w-px h-24 bg-orange-500/30"></div>
                    <div 
                        className="flex-1 w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black relative group"
                    >
                        <iframe 
                            className="w-full h-full rounded-2xl"
                            src="https://www.youtube.com/embed/5sntDvgSKUo?rel=0&controls=1&showinfo=0" 
                            title="Video Tutorial" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>

            {/* CUADRÍCULA DE 12 COLUMNAS: LISTA + VISTA PREVIA */}
            <div id="psd-evergreen-grid" className="grid lg:grid-cols-12 gap-8 max-w-[85em] mx-auto">
                
                {/* COLUMNA IZQUIERDA: LISTADO DE CORREOS (Ocupa 5 de 12) */}
                <div id="psd-evergreen-list-col" className="lg:col-span-5 bg-[#111] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-orange-900/30 rounded-2xl text-orange-400 border border-orange-900/50">
                            <Mail className="w-7 h-7" />
                        </div>
                        <div>
                            <h4 className="text-2xl font-bold text-white tracking-tight">Cronograma de Autoridad</h4>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Sincronizado con tus Artículos</p>
                        </div>
                    </div>

                    <div className="space-y-4 overflow-y-auto max-h-[600px] custom-scrollbar pr-2">
                        {dynamicSequence.map((email, idx) => (
                            <div 
                                key={email.id} 
                                onClick={() => setActiveEvergreenEmail(idx)}
                                className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between gap-5 ${activeEvergreenEmail === idx ? 'bg-orange-900/10 border-orange-500/30 shadow-xl' : 'bg-black/40 border-white/5 hover:border-white/20'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-colors ${activeEvergreenEmail === idx ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                                        {email.day.split(' ')[1]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-[11px] font-black uppercase tracking-widest mb-1 ${activeEvergreenEmail === idx ? 'text-orange-400' : 'text-gray-600'}`}>
                                            {email.day}
                                        </p>
                                        <h5 className={`font-bold text-lg leading-tight whitespace-normal break-words ${activeEvergreenEmail === idx ? 'text-white' : 'text-gray-400'}`}>
                                            {email.subject}
                                        </h5>
                                    </div>
                                </div>
                                <div className="shrink-0">
                                    {email.body ? (
                                        <Check className={`w-5 h-5 ${activeEvergreenEmail === idx ? 'text-orange-500' : 'text-green-500/50'}`} />
                                    ) : (
                                        <div className="w-2 h-2 rounded-full bg-gray-700" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* COLUMNA DERECHA: VISTA PREVIA DEL CORREO (Ocupa 7 de 12) */}
                <div id="psd-evergreen-preview-col" className="lg:col-span-7 bg-[#0b0b0b] border border-gray-800 rounded-[3rem] p-10 flex flex-col relative overflow-hidden h-full min-h-[600px] shadow-2xl">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                        <Calendar className="w-40 h-40 text-orange-500" />
                    </div>

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="mb-10">
                            <div className="flex justify-between items-center mb-4">
                                <span className="bg-orange-900/20 text-orange-400 border border-orange-900/50 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    {activeEmail.type}
                                </span>
                                <span className="text-gray-600 font-mono text-xs font-bold">{activeEmail.day}</span>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black text-white leading-tight">{activeEmail.subject}</h3>
                        </div>

                        <div className="bg-orange-900/10 border border-orange-500/20 p-6 rounded-2xl mb-10 flex gap-4">
                            <Info className="w-6 h-6 text-orange-400 shrink-0" />
                            <p className="text-gray-300 text-base leading-relaxed">
                                <span className="font-bold text-orange-200 block mb-1">Estrategia Detrás:</span>
                                {activeEmail.objective}
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-2xl p-10 text-gray-900 font-serif leading-relaxed text-xl flex-1 border-2 border-gray-200 flex flex-col relative group">
                            <div className="border-b border-gray-100 pb-6 mb-8 text-sm text-gray-400 font-sans italic flex justify-between items-center">
                                <div>
                                    <p>De: Tu Marca Profesional</p>
                                    <p>Asunto: {activeEmail.subject}</p>
                                </div>
                                {activeEmail.body && (
                                    <button 
                                        onClick={() => handleCopy(`${activeEmail.subject}\n\n${activeEmail.body}`, activeEmail.id)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-orange-500"
                                        title="Copiar correo completo"
                                    >
                                        {copySuccess === activeEmail.id ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                                    </button>
                                )}
                            </div>

                            {activeEmail.body ? (
                                <div className="whitespace-pre-wrap">
                                    <p className="mb-6">Hola {avatars[0]?.name.split(' ')[0] || 'amiga'},</p>                            
                                    {activeEmail.body}
                                    
                                    <div className="my-10 text-center">
                                        <div className="inline-block px-10 py-5 bg-orange-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl pointer-events-none">
                                            Hacer clic para leer el artículo
                                        </div>
                                        <p className="text-gray-400 text-xs mt-4 font-sans italic">El enlace dirigirá automáticamente al blog de tu landing page.</p>
                                    </div>

                                    <div className="mt-auto pt-8 border-t border-gray-100 font-sans">
                                        <p className="text-base text-gray-500">Un abrazo,<br/><strong>Tu Equipo.</strong></p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-20">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                        <PenTool className="w-10 h-10" />
                                    </div>
                                    <div className="max-w-xs">
                                        <h4 className="text-xl font-bold text-gray-400">Correo no redactado</h4>
                                        <p className="text-sm text-gray-400 mt-2">Usa el botón de abajo para que la IA redacte este correo basado en el contenido de tu artículo.</p>
                                    </div>
                                    <button 
                                        onClick={() => handleGenerateEmail(activeEmail.originalArticle)}
                                        disabled={generatingId === activeEmail.id}
                                        className="px-8 py-3 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-xl transition-all shadow-lg flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {generatingId === activeEmail.id ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" /> Redactando...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-5 h-5" /> Redactar con IA
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="mt-10">
                            <button 
                                onClick={() => navigate('/dashboard/email')}
                                className="w-full py-5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-orange-900/20 flex items-center justify-center gap-3 transform active:scale-95"
                            >
                                <PenTool className="w-5 h-5" /> Configurar en Systeme.io
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* FOOTER INFORMATIVO */}
            <div className="max-w-[70em] mx-auto text-center pt-12 border-t border-white/5 opacity-40">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Sistema Evergreen Automatizado v2.9 — Motor de Autoridad Dinámico</p>
            </div>
        </div>
    );
};
