import React, { useState, useEffect } from 'react';
// Added PenTool to the imports from lucide-react
import { Phone, MoreVertical, Send, Smile, Star, MessageSquare, Zap, Save, X, Loader2, Sparkles, AlertTriangle, ArrowRight, Wand2, Check, PenTool, Globe } from 'lucide-react';
import { useOutletContext, useParams } from 'react-router-dom';
import { api } from '../../../../services/api';
import { callGeminiBackend, Type } from '../../../../services/geminiService';
import { LandingPage } from '../../../../types';

interface TestimonialsProps {
  strategyData?: any;
}

export const ProjectStrategy_Testimonials: React.FC<TestimonialsProps> = ({ strategyData: propStrategyData }) => {
  const context = useOutletContext() as any;
  const strategyData = propStrategyData || context.strategyData;
  const { id: projectId } = useParams() as { id: string };

  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [tempText, setTempText] = useState("");
  const [saving, setSaving] = useState(false);
  const [isGeneratingIA, setIsGeneratingIA] = useState(false);
  const [linkedLanding, setLinkedLanding] = useState<LandingPage | null>(null);

  // Nuevo estado para la selección manual de avatares
  const [customAvatars, setCustomAvatars] = useState<Record<number, string>>({});
  const [selectorOpenIdx, setSelectorOpenIdx] = useState<number | null>(null);

  // Mensajes de respuesta del experto (Fijos)
  const expertReplies = [
    "¡Qué increíble resultado! 🎉 Ese es el poder de la IA cuando tiene la estrategia correcta detrás. ¡A seguir escalando ese proyecto! 🚀",
    "Exacto, la velocidad es la clave en Hotmart. Me alegra mucho que te esté ahorrando tanto tiempo. ¡A por más ventas! 💰",
    "¡Esa es la meta! El tráfico gratis es el más rentable de todos. Sigue así, el sistema seguirá trabajando para ti. 💎"
  ];

  // Bibliotecas de imágenes por género (Definidas por el ingeniero)
  const maleAvatars = [
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
  ];

  const femaleAvatars = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop"
  ];

  const allAvatarOptions = [...femaleAvatars, ...maleAvatars];

  useEffect(() => {
    const checkLanding = async () => {
        if (!projectId) return;
        try {
            const pages = await api.getPages();
            const found = pages.find(p => String(p.projectId) === String(projectId));
            setLinkedLanding(found || null);
        } catch (e) {
            console.error("Error checking landing", e);
        }
    };
    checkLanding();
  }, [projectId]);

  // Función inteligente de detección de género basada en el nombre
  const detectGender = (name: string): 'male' | 'female' => {
    const n = name.toLowerCase().trim();
    // Patrones comunes de nombres femeninos en español/inglés
    if (n.endsWith('a') || n.endsWith('ia') || n.endsWith('ita') || n.endsWith('na') || n.endsWith('ra') || n.endsWith('sa') || n.endsWith('th') || n.endsWith('ly')) {
      return 'female';
    }
    return 'male';
  };

  // Verificación de existencia de testimonios estratégicos
  const hasTestimonials = strategyData?.modules?.testimonials && strategyData.modules.testimonials.length >= 3;

  // Lógica de asignación dinámica de imágenes por género
  let maleIdx = 0;
  let femaleIdx = 0;

  const dynamicTestimonials = hasTestimonials
    ? strategyData.modules.testimonials.slice(0, 3).map((t: any, i: number) => {
        // Si el usuario seleccionó uno manualmente, lo usamos. Si no, detección automática.
        if (customAvatars[i]) {
            return {
                name: t.name,
                img: customAvatars[i],
                msg: t.text,
                reply: expertReplies[i]
            };
        }

        // Si ya hay una imagen persistida en el objeto de la estrategia, la usamos
        if (t.image) {
            return {
                name: t.name,
                img: t.image,
                msg: t.text,
                reply: expertReplies[i]
            };
        }

        const gender = detectGender(t.name);
        let img = "";
        if (gender === 'female') {
          img = femaleAvatars[femaleIdx % femaleAvatars.length];
          femaleIdx++;
        } else {
          img = maleAvatars[maleIdx % maleAvatars.length];
          maleIdx++;
        }
        return {
          name: t.name,
          img,
          msg: t.text,
          reply: expertReplies[i]
        };
      })
    : [];

  const handleStartEdit = (idx: number, text: string) => {
    setEditingIdx(idx);
    setTempText(text);
  };

  const handleSave = async () => {
    if (editingIdx === null || !projectId) return;
    setSaving(true);
    try {
        const updatedTestimonials = [...dynamicTestimonials];
        updatedTestimonials[editingIdx].msg = tempText;
        
        // Mapeamos los datos finales a guardar, asegurando que la imagen persista
        const testimonialsToSave = updatedTestimonials.map((t, idx) => ({
            name: t.name,
            text: t.msg,
            image: t.img // Persistimos la imagen actual que puede ser la detectada o la elegida
        }));

        await api.updateProjectTestimonials(projectId, testimonialsToSave);
        
        if (strategyData?.modules) {
            strategyData.modules.testimonials = testimonialsToSave;
        }

        setEditingIdx(null);
    } catch (e) {
        alert("Error al guardar el testimonio.");
    } finally {
        setSaving(false);
    }
  };

  const handleGenerateWithIA = async () => {
    if (!projectId || !strategyData?.avatars) return;
    setIsGeneratingIA(true);
    try {
        const avatars = strategyData.avatars.slice(0, 3);
        const avatarInfo = avatars.map((a: any) => `- Nombre: ${a.name}, Dolor: ${a.pain}`).join('\n');
        
        const prompt = `Actúa como un experto en Copywriting y Prueba Social Estratégica. 
        Tengo un proyecto de venta de un producto digital y necesito generar exactamente 3 testimonios cortos para mi Landing Page.
        
        BASADO EN ESTOS 3 AVATARES DE MI PROYECTO:
        ${avatarInfo}
        
        REGLAS PARA LOS TESTIMONIOS:
        1. Deben usar los nombres exactos de los avatares.
        2. El texto debe narrar en primera persona cómo el producto resolvió su dolor específico.
        3. El tono debe ser de un mensaje de WhatsApp de agradecimiento natural y entusiasta.
        4. Máximo 25 palabras por testimonio.
        5. Devuelve EXCLUSIVAMENTE un array JSON con esta estructura: [{"name": "string", "text": "string"}]`;

        const response = await callGeminiBackend(prompt, null, true, "gemini-3-flash-preview");
        if (response.text) {
            const generated = JSON.parse(response.text.trim());
            if (Array.isArray(generated) && generated.length >= 3) {
                await api.updateProjectTestimonials(projectId, generated.slice(0, 3));
                // Forzar recarga ligera para ver los nuevos datos
                window.location.reload();
            }
        }
    } catch (e) {
        console.error("IA Generation error", e);
        alert("Error al generar testimonios con IA. Intenta de nuevo.");
    } finally {
        setIsGeneratingIA(false);
    }
  };

  const selectAvatar = async (testimonialIdx: number, imgUrl: string) => {
      setCustomAvatars(prev => ({ ...prev, [testimonialIdx]: imgUrl }));
      setSelectorOpenIdx(null);
      
      // PERSISTENCIA INMEDIATA: Guardamos la elección de imagen en la base de datos
      if (!projectId || !strategyData?.modules?.testimonials) return;
      try {
          const currentData = [...strategyData.modules.testimonials];
          const testimonialsToSave = currentData.map((t: any, i: number) => {
              const baseImg = customAvatars[i] || t.image || "";
              if (i === testimonialIdx) {
                  return { ...t, image: imgUrl };
              }
              return { ...t, image: baseImg };
          });

          await api.updateProjectTestimonials(projectId, testimonialsToSave);
          
          if (strategyData?.modules) {
              strategyData.modules.testimonials = testimonialsToSave;
          }
      } catch (e) {
          console.error("Error al persistir la selección del avatar:", e);
      }
  };

  return (
    <div className="space-y-16">
      {/* CABECERA ESTRATÉGICA */}
      <div className="max-w-[70em] mx-auto text-left space-y-8 py-10">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/5">
          <MessageSquare className="w-5 h-5 fill-current" /> Prueba Social Validada
        </div>
        <h3 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 leading-tight tracking-tight max-w-4xl">
          Testimonios de Éxito
        </h3>
        
        <div className="flex flex-col md:flex-row gap-10 items-center text-white text-[1.3rem] leading-[2.5rem] font-light">
          <p className="flex-1 border-l-4 border-emerald-500 pl-8 py-2">
            La prueba social es el gatillo mental más potente para cerrar ventas. Cuando tus prospectos ven que otros ya están logrando resultados, su miedo al fracaso desaparece.
          </p>
          <div className="hidden md:block w-px h-24 bg-emerald-500/30"></div>
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

      {/* GRID DE WHATSAPP CHATS O ESTADO VACÍO */}
      <div className="max-w-[85em] mx-auto px-6 relative z-10">
        {!hasTestimonials ? (
            <div className="bg-[#111] p-16 rounded-[3rem] border border-dashed border-emerald-500/30 text-center space-y-8 animate-in zoom-in-95 duration-700 shadow-2xl">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500 mx-auto border border-emerald-500/20 shadow-lg">
                    <AlertTriangle className="w-10 h-10" />
                </div>
                <div className="max-w-xl mx-auto">
                    <h4 className="text-3xl font-black text-white uppercase tracking-tight mb-4">No se generaron testimonios</h4>
                    <p className="text-gray-400 text-lg font-medium leading-relaxed">
                        Los testimonios estratégicos no se crearon correctamente durante la fase inicial. Necesitamos generarlos ahora basados en los avatares de tu proyecto para que tu Landing Page sea persuasiva.
                    </p>
                </div>
                <button 
                    onClick={handleGenerateWithIA}
                    disabled={isGeneratingIA}
                    className="px-12 py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xl uppercase tracking-widest rounded-2xl transition-all shadow-2xl shadow-emerald-900/20 flex items-center justify-center gap-4 mx-auto transform hover:scale-[1.05] active:scale-95 disabled:opacity-50 disabled:grayscale"
                >
                    {isGeneratingIA ? <Loader2 className="w-6 h-6 animate-spin" /> : <Wand2 className="w-6 h-6" />}
                    {isGeneratingIA ? "Redactando Testimonios..." : "Regenerar Testimonios con IA"}
                </button>
            </div>
        ) : (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-4">
                {dynamicTestimonials.map((chat: any, i: number) => (
                    <div key={i} className="bg-[#E5DDD5] rounded-[2.5rem] md:rounded-[3.5rem] border-[8px] md:border-[12px] border-[#0B0B0B] overflow-visible shadow-2xl relative h-auto min-h-[600px] flex flex-col group transition-all duration-500 shadow-[0_30px_60px_rgba(0,0,0,0.3)]">
                    {/* WhatsApp Header */}
                    <div className="bg-[#075E54] p-4 md:p-6 flex items-center justify-between text-white shrink-0 relative z-30">
                        <div className="flex items-center gap-3 md:gap-4">
                        <div className="relative">
                            <div 
                                onClick={() => setSelectorOpenIdx(selectorOpenIdx === i ? null : i)}
                                className="w-10 md:w-14 h-10 md:h-14 rounded-full border-2 border-white/20 overflow-hidden shadow-md cursor-pointer hover:border-emerald-300 transition-all relative group/avatar"
                            >
                                <img src={chat.img} alt={chat.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                                    <PenTool className="w-4 h-4 text-white" />
                                </div>
                            </div>

                            {/* PANEL SELECTOR DE AVATAR (Fuera del círculo para evitar recorte por overflow-hidden) */}
                            {selectorOpenIdx === i && (
                                <div 
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute top-full left-0 mt-4 bg-[#111] border border-white/10 rounded-[2rem] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[100] animate-in zoom-in-95 duration-200 min-w-[180px]"
                                >
                                    <div className="flex justify-between items-center mb-3 px-2">
                                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Elegir Avatar</span>
                                        <X className="w-3 h-3 text-gray-500 cursor-pointer" onClick={() => setSelectorOpenIdx(null)} />
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        {allAvatarOptions.map((opt, optIdx) => (
                                            <button 
                                                key={optIdx} 
                                                onClick={() => selectAvatar(i, opt)}
                                                className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 overflow-hidden ${chat.img === opt ? 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'border-white/10 hover:border-white/30'}`}
                                            >
                                                <img src={opt} className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div>
                            <h4 className="font-black text-base md:text-lg leading-tight">{chat.name}</h4>
                            <p className="text-[10px] md:text-xs opacity-80 font-medium">En línea</p>
                        </div>
                        </div>
                        <div className="flex gap-3 md:gap-4 opacity-70">
                        <Phone className="w-5 md:w-6 h-5 md:h-6" />
                        <MoreVertical className="w-5 md:w-6 h-5 md:h-6" />
                        </div>
                    </div>

                    {/* Chat Body */}
                    <div className="flex-1 p-4 md:p-6 space-y-6 md:space-y-8 overflow-visible bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-opacity-10">
                        <div className="flex justify-start animate-in slide-in-from-left-6 duration-700">
                        <div 
                            onClick={() => editingIdx === null && handleStartEdit(i, chat.msg)}
                            className={`bg-white p-3 md:p-5 rounded-2xl md:rounded-3xl rounded-tl-none shadow-sm max-w-[90%] relative border border-gray-100 ${editingIdx === null ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''}`}
                        >
                            {editingIdx === i ? (
                                <div className="space-y-3">
                                    <textarea 
                                        autoFocus
                                        value={tempText}
                                        onChange={(e) => setTempText(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-sm md:text-[1.1rem] text-[#0B0B0B] outline-none focus:ring-2 focus:ring-[#075E54]/20 min-h-[100px] resize-none"
                                    />
                                    <div className="flex gap-2 justify-end">
                                        <button onClick={() => setEditingIdx(null)} disabled={saving} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"><X className="w-4 h-4" /></button>
                                        <button onClick={handleSave} disabled={saving} className="bg-[#075E54] text-white px-4 py-1 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-[#054d44] transition">
                                            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Guardar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-sm md:text-[1.1rem] text-[#0B0B0B] leading-relaxed font-medium">{chat.msg}</p>
                                    <span className="text-[8px] md:text-[10px] text-gray-400 block text-right mt-2 md:mt-3 font-bold uppercase">10:45 AM</span>
                                    <div className="absolute -top-6 left-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[#075E54] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded">Clic para editar testimonio</div>
                                </>
                            )}
                        </div>
                        </div>

                        <div className="flex justify-end animate-in slide-in-from-right-6 duration-1000 delay-500">
                        <div className="bg-[#DCF8C6] p-3 md:p-5 rounded-2xl md:rounded-3xl rounded-tr-none shadow-md max-w-[90%] relative border border-green-200">
                            <p className="text-sm md:text-[1.1rem] text-[#0B0B0B] leading-relaxed font-medium">{chat.reply}</p>
                            <span className="text-[8px] md:text-[10px] text-green-700 block text-right mt-2 md:mt-3 font-bold uppercase tracking-wider">10:46 AM ✓✓</span>
                        </div>
                        </div>
                    </div>

                    {/* Input Bar */}
                    <div className="bg-[#F0F0F0] p-4 md:p-5 flex items-center gap-2 md:gap-3 border-t border-gray-300 shrink-0">
                        <Smile className="w-6 md:w-7 h-6 md:h-7 text-gray-500" />
                        <div className="flex-1 bg-white h-10 md:h-12 rounded-full border border-gray-200 px-4 md:px-6 flex items-center text-xs md:text-sm text-gray-400 italic">Escribe...</div>
                        <div className="w-10 md:w-12 h-10 md:h-12 bg-[#075E54] rounded-full flex items-center justify-center text-white shadow-lg"><Send className="w-5 md:w-6 h-5 md:h-6 fill-current ml-1" /></div>
                    </div>
                    </div>
                ))}
                </div>

                {linkedLanding && (
                    <div className="flex justify-center mt-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <a 
                            href={`/admin/lp/${linkedLanding.subdomain.split('.')[0]}#testimonios`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-10 py-5 bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-black text-xl uppercase tracking-widest rounded-2xl transition-all shadow-2xl shadow-[#FF5A1F]/20 flex items-center justify-center gap-4 transform hover:scale-[1.05] active:scale-95"
                        >
                            <Globe className="w-5 h-5" /> Ver Testimonios en tu Pagina de Captura <ArrowRight className="w-6 h-6" />
                        </a>
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
};