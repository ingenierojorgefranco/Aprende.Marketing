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

  const getPainsForAvatar = (index: number) => {
    // Consulta directa a los dolores reales sincronizados de la estrategia maestra
    const painsArray = strategy?.psychology?.pains;
    if (Array.isArray(painsArray) && painsArray.length > 0) {
      const avatarId = index + 1; // index 0->avatarId 1, index 1->avatarId 2, index 2->avatarId 3
      
      // Filtramos consecutivamente según el avatar correspondiente de la estrategia
      const objectPains = painsArray.filter((p: any) => 
        p && typeof p === 'object' && p.text &&
        (Number(p.avatarId) === Number(avatarId))
      );
      
      if (objectPains.length > 0) {
        return objectPains.map((p: any) => p.text);
      } else {
        // Distribución lineal automatizada como reaseguro si no tienen avatarId
        const stringPains = painsArray.map((p: any) => p && typeof p === 'object' ? (p.text || p.title || "") : String(p)).filter(Boolean);
        if (stringPains.length > 0) {
          const itemsPerAvatar = Math.max(1, Math.ceil(stringPains.length / 3));
          const start = index * itemsPerAvatar;
          const end = start + itemsPerAvatar;
          return stringPains.slice(start, end);
        }
      }
    }

    // Fallback del content autogenerado original únicamente en caso de que no existiera la estrategia
    const rawItems = content.whatYouWillLearn?.items || [];
    const start = index * 3;
    const end = start + 3;
    const slice = rawItems.slice(start, end);
    if (slice.length > 0) {
      return slice;
    }
    return ["No se encontraron dolores de transformación en la base de datos."];
  };
  
  const getAvatarTitle = (index: number) => {
    // Consulta directa al dolor/transformación de avatar de la estrategia del proyecto
    const realAv = strategy?.avatars?.[index];
    if (realAv) {
      const transTitle = realAv.transformation_title || realAv.pain || realAv.learning_hook;
      if (transTitle) return transTitle;
    }

    if (content.whatYouWillLearn?.avatarTitles?.[index]) {
      return content.whatYouWillLearn.avatarTitles[index];
    }
    return "No existe título para este perfil registrado en la base de datos.";
  };

  const avatarData = [
    { title: getAvatarTitle(0), iconName: content.whatYouWillLearn?.avatarIcons?.[0] || "Sparkles" },
    { title: getAvatarTitle(1), iconName: content.whatYouWillLearn?.avatarIcons?.[1] || "TrendingUp" },
    { title: getAvatarTitle(2), iconName: content.whatYouWillLearn?.avatarIcons?.[2] || "UserCheck" }
  ];

  const avatars = avatarData.map((data, idx) => {
      const colors = getModuleColors(idx === 0 ? 'purple' : idx === 1 ? 'blue' : 'green');
      return {
          ...data,
          icon: getIconByName(data.iconName, idx === 0 ? <Sparkles className="w-10 h-10 text-purple-400" /> : idx === 1 ? <TrendingUp className="w-10 h-10 text-blue-400" /> : <UserCheck className="w-10 h-10 text-emerald-400" />),
          gradient: colors.bg,
          points: getPainsForAvatar(idx)
      };
  });

  const benefitsGrid = (learningModules.length > 0 ? learningModules : (content.benefits.items || [])).map((m: any, idx: number) => {
      const color = m.color || 'purple';
      const colors = getModuleColors(color);
      return {
          title: m.title,
          desc: m.description || m.desc || "Aprende de los mejores expertos del sector.",
          icon: getIconByName(m.icon, <Sparkles className="w-10 h-10 text-purple-400" />),
          bg: colors.bg,
          border: colors.border,
          glow: colors.glow
      };
  });

  return (
    <section id="dolores" className="py-24 bg-[#F8F9FB]">
        <div id="puntos-dolor-avatars" className="max-w-7xl mx-auto px-6 text-center mb-32">
            <h2 className="text-4xl md:text-6xl font-['Inter'] font-extrabold mb-12 text-[#241544] leading-tight tracking-tight">
                Esta clase es para ti si<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF00AA] to-[#FF0055]">...</span>
            </h2>
            
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                {avatars.map((avatar, idx) => (
                    <div key={idx} className="relative p-8 md:p-10 rounded-[2rem] bg-gradient-to-b from-[#1C1239] to-[#251547] shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-1 group overflow-hidden flex flex-col h-full border-t border-white/5">
                        {/* Glow bottom effect like in the image */}
                        <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-purple-500/30 to-transparent blur-3xl opacity-60"></div>
                        
                        <div className="relative z-10 flex-1 flex flex-col">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 shadow-inner flex items-center justify-center mb-6">
                                {idx === 0 && <Sparkles className="w-6 h-6 text-pink-400" />}
                                {idx === 1 && <ShieldAlert className="w-6 h-6 text-[#FF7A00]" />}
                                {idx === 2 && <Rocket className="w-6 h-6 text-[#FF7A00]" />}
                            </div>
                            
                            <h3 className="text-2xl font-bold text-white leading-tight mb-3">
                                {idx === 0 && "Quieres diferenciarte"}
                                {idx === 1 && "Temes perder dinero"}
                                {idx === 2 && "Buscas una nueva oportunidad"}
                            </h3>
                            
                            <p className="text-gray-400 text-[0.95rem] leading-relaxed mb-6">
                                {idx === 0 && "Aprende un acabado que te permita ofrecer algo distinto y de mayor valor dentro del sector."}
                                {idx === 1 && "Aprende correctamente antes de arriesgar material, tiempo o el suelo de un cliente."}
                                {idx === 2 && "Descubre una técnica que puedes incorporar a tus servicios o usar para empezar desde cero."}
                            </p>
                            
                            <div className="flex-1"></div>
                            
                            <div className="space-y-4 mt-auto pt-6 border-t border-white/10">
                                {idx === 0 && (
                                    <>
                                        <div className="flex gap-3 items-start">
                                            <div className="mt-1 shrink-0 bg-[#FF5A5F] rounded-full w-5 h-5 flex items-center justify-center text-white">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            </div>
                                            <p className="text-gray-300 text-sm leading-snug">Mayor valor percibido</p>
                                        </div>
                                        <div className="flex gap-3 items-start">
                                            <div className="mt-1 shrink-0 bg-[#FF5A5F] rounded-full w-5 h-5 flex items-center justify-center text-white">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            </div>
                                            <p className="text-gray-300 text-sm leading-snug">Acabados modernos y profesionales</p>
                                        </div>
                                    </>
                                )}
                                {idx === 1 && (
                                    <>
                                        <div className="flex gap-3 items-start">
                                            <div className="mt-1 shrink-0 bg-[#FF5A5F] rounded-full w-5 h-5 flex items-center justify-center text-white">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            </div>
                                            <p className="text-gray-300 text-sm leading-snug">Reduce errores de aplicación</p>
                                        </div>
                                        <div className="flex gap-3 items-start">
                                            <div className="mt-1 shrink-0 bg-[#FF5A5F] rounded-full w-5 h-5 flex items-center justify-center text-white">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            </div>
                                            <p className="text-gray-300 text-sm leading-snug">Trabaja con mayor seguridad</p>
                                        </div>
                                    </>
                                )}
                                {idx === 2 && (
                                    <>
                                        <div className="flex gap-3 items-start">
                                            <div className="mt-1 shrink-0 bg-[#FF5A5F] rounded-full w-5 h-5 flex items-center justify-center text-white">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            </div>
                                            <p className="text-gray-300 text-sm leading-snug">Sin experiencia previa</p>
                                        </div>
                                        <div className="flex gap-3 items-start">
                                            <div className="mt-1 shrink-0 bg-[#FF5A5F] rounded-full w-5 h-5 flex items-center justify-center text-white">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            </div>
                                            <p className="text-gray-300 text-sm leading-snug">Paso a paso</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
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
        {showModal && <RegistrationModal content={content} ds={ds} onClose={() => setShowModal(false)} pageId={pageId} basePath={basePath} />}
    </section>
  );
};
