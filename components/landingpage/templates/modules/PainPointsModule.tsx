import React, { useState } from 'react';
import { GeneratedPageContent, Project } from '../../../../types';
import { XCircle, Sparkles, UserCheck, TrendingUp, CheckCircle2, Target, Zap, DollarSign, Award, ArrowRight, ShieldAlert, Rocket } from 'lucide-react';
import { RegistrationModal } from '../../ui/LiveComponents';

interface PainPointsModuleProps {
  content: GeneratedPageContent;
  ds: any;
  project?: Project;
  pageId?: string;
  basePath?: string;
}

const iconMap: Record<string, any> = {
  Sparkles: <Sparkles className="w-10 h-10 text-purple-400" />,
  TrendingUp: <TrendingUp className="w-10 h-10 text-blue-400" />,
  UserCheck: <UserCheck className="w-10 h-10 text-emerald-400" />,
  Target: <Target className="w-10 h-10 text-blue-400" />,
  Zap: <Zap className="w-10 h-10 text-yellow-400" />,
  DollarSign: <DollarSign className="w-10 h-10 text-emerald-400" />,
  Award: <Award className="w-10 h-10 text-amber-400" />,
  CheckCircle2: <CheckCircle2 className="w-10 h-10 text-purple-400" />
};

const getIconByName = (name?: string, defaultIcon?: any) => {
    if (!name) return defaultIcon;
    return iconMap[name] || defaultIcon;
};

const getModuleColors = (color: string = 'purple') => {
    const map: Record<string, { bg: string, glow: string, border: string }> = {
        blue: { bg: "from-[#0f172a] via-[#1e293b] to-[#0f172a]", glow: "hover:shadow-blue-500/20", border: "border-blue-500/20" },
        purple: { bg: "from-[#1a0b2e] via-[#2d1b4d] to-[#1a0b2e]", glow: "hover:shadow-purple-500/20", border: "border-purple-500/20" },
        green: { bg: "from-[#061a14] via-[#064e3b] to-[#061a14]", glow: "hover:shadow-emerald-500/20", border: "border-emerald-500/20" },
        emerald: { bg: "from-[#061a14] via-[#064e3b] to-[#061a14]", glow: "hover:shadow-emerald-500/20", border: "border-emerald-500/20" },
        orange: { bg: "from-[#2d1205] via-[#7c2d12] to-[#2d1205]", glow: "hover:shadow-orange-500/20", border: "border-orange-500/20" },
        red: { bg: "from-[#2a0505] via-[#7f1d1d] to-[#2a0505]", glow: "hover:shadow-red-500/20", border: "border-red-500/20" },
        yellow: { bg: "from-[#2a2a05] via-[#71710a] to-[#2a2a05]", glow: "hover:shadow-yellow-500/20", border: "border-yellow-500/20" },
        teal: { bg: "from-[#052a2a] via-[#134e4a] to-[#052a2a]", glow: "hover:shadow-teal-500/20", border: "border-teal-500/20" }
    };
    return map[color] || map.purple;
};

export const PainPointsModule: React.FC<PainPointsModuleProps> = ({ content, ds, project, pageId, basePath }) => {
  const [showModal, setShowModal] = useState(false);
  const strategy = project?.strategy_json;
  const learningModules = strategy?.psychology?.learningModules || [];

  const rawItems = content.whatYouWillLearn?.items || [];
  
  const avatars = rawItems.map((item: any, idx: number) => {
      const colors = getModuleColors(idx === 0 ? 'purple' : idx === 1 ? 'blue' : 'green');
      const isString = typeof item === 'string';
      return {
          title: isString ? item : (item?.title || `Perfil ${idx + 1}`),
          description: isString ? '' : (item?.description || ''),
          icon: getIconByName(item?.icon, idx === 0 ? <Sparkles className="w-10 h-10 text-purple-400" /> : idx === 1 ? <TrendingUp className="w-10 h-10 text-blue-400" /> : <UserCheck className="w-10 h-10 text-emerald-400" />),
          gradient: colors.bg,
          points: isString ? [] : (Array.isArray(item?.points) ? item.points : (typeof item?.points === 'string' ? [item.points] : []))
      };
  });

  const benefitsGrid = (learningModules.length > 0 ? learningModules : (content.benefits?.items || [])).map((m: any, idx: number) => {
      const color = m?.color || 'purple';
      const colors = getModuleColors(color);
      return {
          title: m?.title || `Módulo ${idx + 1}`,
          desc: m?.description || m?.desc || "Aprende de los mejores expertos del sector.",
          icon: getIconByName(m?.icon, <Sparkles className="w-10 h-10 text-purple-400" />),
          bg: colors.bg,
          border: colors.border,
          glow: colors.glow
      };
  });

  return (
    <section id="dolores" className="py-24 bg-[#F8F9FB]">
        <div id="puntos-dolor-avatars" className="max-w-7xl mx-auto px-6 text-center mb-32">
            <h2 className="text-4xl md:text-6xl font-['Inter'] font-extrabold mb-12 text-[#241544] leading-tight tracking-tight">
                {content.whatYouWillLearn?.title || "Esta clase es para ti si..."}
            </h2>
            
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                {avatars.map((avatar, idx) => (
                    <div key={idx} className="relative p-8 md:p-10 rounded-[2rem] bg-gradient-to-b from-[#1C1239] to-[#251547] shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-1 group overflow-hidden flex flex-col h-full border-t border-white/5">
                        {/* Glow bottom effect like in the image */}
                        <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-purple-500/30 to-transparent blur-3xl opacity-60"></div>
                        
                        <div className="relative z-10 flex-1 flex flex-col">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 shadow-inner flex items-center justify-center mb-6">
                                {React.cloneElement(avatar.icon as any, { size: 24, className: idx === 0 ? "text-pink-400" : "text-[#FF7A00]" })}
                            </div>
                            
                            <h3 className="text-2xl font-bold text-white leading-tight mb-3">
                                {avatar.title}
                            </h3>
                            
                            <p className="text-gray-400 text-[0.95rem] leading-relaxed mb-6">
                                {avatar.description}
                            </p>
                            
                            <div className="flex-1"></div>
                            
                            {avatar.points.length > 0 && (
                                <div className="space-y-4 mt-auto pt-6 border-t border-white/10">
                                    {avatar.points.map((point: string, pIdx: number) => (
                                        <div key={pIdx} className="flex gap-3 items-start">
                                            <div className="mt-1 shrink-0 bg-[#FF5A5F] rounded-full w-5 h-5 flex items-center justify-center text-white">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            </div>
                                            <p className="text-gray-300 text-sm leading-snug">{point}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-12 text-center relative z-10">
                <button 
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center justify-center gap-3 px-12 py-5 rounded-[2rem] bg-gradient-to-r from-[#FF7A00] via-[#FF0055] to-[#FF00AA] text-white font-bold text-lg shadow-[0_10px_30px_rgba(255,0,85,0.3)] hover:shadow-[0_15px_40px_rgba(255,0,85,0.5)] hover:scale-[1.02] active:scale-95 transition-all"
                >
                    {content.hero.ctaText || "QUIERO ACCEDER A LA CLASE GRATIS"}
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* SECCIÓN DINÁMICA: LO QUE APRENDERÁS EN NUESTRA CLASE */}
        <div id="temario-exclusivo" className="max-w-6xl mx-auto px-6 text-center mt-32 mb-16">
            <div className="mb-12">
                <h2 id="beneficios" className="text-4xl md:text-5xl font-['Inter'] font-extrabold mb-4 text-[#241544] leading-tight tracking-tight">
                    {content.benefits.title || "Lo que aprenderás en nuestra clase"}
                </h2>
                {content.benefits.subtitle && (
                    <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        {content.benefits.subtitle}
                    </p>
                )}
            </div>
            
            <div className="bg-gradient-to-b from-[#1C1239] to-[#251547] rounded-[2rem] shadow-2xl relative overflow-hidden border border-white/5">
                {/* Subtle glow inside the container */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 relative z-10 text-left">
                    {benefitsGrid.map((item: any, idx: number) => (
                        <div 
                            key={idx} 
                            className={`p-8 md:p-12 flex gap-6 md:gap-8 hover:bg-white/5 transition-colors duration-500
                                ${idx % 2 === 0 ? 'md:border-r border-white/10' : ''} 
                                ${idx < benefitsGrid.length - 2 ? 'md:border-b border-white/10' : ''} 
                                ${idx < benefitsGrid.length - 1 ? 'border-b md:border-b-0 border-white/10' : ''}
                            `}
                        >
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.2rem] border border-white/10 bg-white/5 flex items-center justify-center shrink-0 shadow-inner">
                                {React.cloneElement(item.icon as any, { size: 32, className: "text-[#FF00AA]" })}
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A00] to-[#FF0055]">
                                    0{idx + 1}
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-white leading-snug">{item.title}</h3>
                                <p className="text-gray-400 text-sm md:text-[0.95rem] leading-relaxed pt-1">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="mt-12 text-center relative z-10">
                <button 
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center justify-center gap-3 px-12 py-5 rounded-[2rem] bg-gradient-to-r from-[#FF7A00] via-[#FF0055] to-[#FF00AA] text-white font-bold text-lg shadow-[0_10px_30px_rgba(255,0,85,0.3)] hover:shadow-[0_15px_40px_rgba(255,0,85,0.5)] hover:scale-[1.02] active:scale-95 transition-all"
                >
                    {content.hero.ctaText || "QUIERO ACCEDER A LA CLASE GRATIS"}
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
        {/* DISEÑO QUEMADO DE PRUEBA: Lo que aprenderás en nuestra clase */}
        <div className="max-w-6xl mx-auto px-6 text-center mt-32 mb-16">
            <div className="mb-12">
                <h2 className="text-4xl md:text-5xl font-['Inter'] font-extrabold mb-4 text-[#241544] leading-tight tracking-tight">
                    Lo que aprenderás en nuestra clase
                </h2>
                <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                    Aprende las bases esenciales para realizar una aplicación de resina epóxica con mayor seguridad.
                </p>
            </div>
            
            <div className="bg-gradient-to-br from-[#1C1239] to-[#2B1B54] rounded-[2rem] shadow-2xl relative overflow-hidden border border-white/5">
                {/* Subtle glow inside the container */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 relative z-10 text-left">
                    {/* Item 1 */}
                    <div className="p-8 md:p-12 flex gap-6 md:gap-8 hover:bg-white/5 transition-colors duration-500 md:border-r border-b border-white/10">
                        <div className="w-20 h-20 rounded-3xl border border-white/10 bg-white/5 flex items-center justify-center shrink-0 shadow-inner">
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A00] to-[#FF0055]">
                                01
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-white leading-snug">Preparación del suelo</h3>
                            <p className="text-gray-400 text-sm md:text-[0.95rem] leading-relaxed pt-1">Aprende cómo preparar correctamente la superficie antes de comenzar una aplicación.</p>
                        </div>
                    </div>
                    {/* Item 2 */}
                    <div className="p-8 md:p-12 flex gap-6 md:gap-8 hover:bg-white/5 transition-colors duration-500 border-b border-white/10">
                        <div className="w-20 h-20 rounded-3xl border border-white/10 bg-white/5 flex items-center justify-center shrink-0 shadow-inner">
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 3h15"/><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3"/><path d="M6 14h12"/></svg>
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A00] to-[#FF0055]">
                                02
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-white leading-snug">Mezcla correcta</h3>
                            <p className="text-gray-400 text-sm md:text-[0.95rem] leading-relaxed pt-1">Entiende las proporciones, tiempos y puntos clave para preparar la resina correctamente.</p>
                        </div>
                    </div>
                    {/* Item 3 */}
                    <div className="p-8 md:p-12 flex gap-6 md:gap-8 hover:bg-white/5 transition-colors duration-500 md:border-r border-white/10 border-b md:border-b-0">
                        <div className="w-20 h-20 rounded-3xl border border-white/10 bg-white/5 flex items-center justify-center shrink-0 shadow-inner">
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><path d="M12 10v6"/><path d="M9 16h6"/></svg>
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A00] to-[#FF0055]">
                                03
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-white leading-snug">Aplicación y acabado</h3>
                            <p className="text-gray-400 text-sm md:text-[0.95rem] leading-relaxed pt-1">Descubre cómo extender el material y conseguir un acabado uniforme y profesional.</p>
                        </div>
                    </div>
                    {/* Item 4 */}
                    <div className="p-8 md:p-12 flex gap-6 md:gap-8 hover:bg-white/5 transition-colors duration-500">
                        <div className="w-20 h-20 rounded-3xl border border-white/10 bg-white/5 flex items-center justify-center shrink-0 shadow-inner">
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A00] to-[#FF0055]">
                                04
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-white leading-snug">Errores que debes evitar</h3>
                            <p className="text-gray-400 text-sm md:text-[0.95rem] leading-relaxed pt-1">Identifica los fallos más comunes que pueden hacerte perder material, tiempo y dinero.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-12 text-center relative z-10">
                <button 
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center justify-center gap-3 px-12 py-5 rounded-[2rem] bg-gradient-to-r from-[#FF7A00] via-[#FF0055] to-[#FF00AA] text-white font-bold text-lg shadow-[0_10px_30px_rgba(255,0,85,0.3)] hover:shadow-[0_15px_40px_rgba(255,0,85,0.5)] hover:scale-[1.02] active:scale-95 transition-all"
                >
                    QUIERO ACCEDER A LA CLASE GRATIS
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>

        <svg style={{ width: 0, height: 0, position: 'absolute' }} aria-hidden="true" focusable="false">
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF7A00" />
            <stop offset="100%" stopColor="#FF00AA" />
          </linearGradient>
        </svg>

        {showModal && <RegistrationModal content={content} ds={ds} onClose={() => setShowModal(false)} pageId={pageId} basePath={basePath} />}
    </section>
  );
};
