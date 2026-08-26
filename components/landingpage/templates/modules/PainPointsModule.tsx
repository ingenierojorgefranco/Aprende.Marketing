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

  const benefitsGrid = (learningModules.length > 0 ? learningModules : (content.benefits?.items || []))
      .slice(0, 4)
      .map((m: any, idx: number) => {
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
    <section id="dolores" className={`py-24 ${ds.features?.sectionBg || ds.bg || 'bg-[#F8F9FB]'}`}>
        <div id="puntos-dolor-avatars" className="max-w-7xl mx-auto px-6 text-center mb-32">
            <h2 className={`text-4xl md:text-6xl font-['Inter'] font-extrabold mb-12 leading-tight tracking-tight ${ds.features?.titleColor || 'text-[#241544]'}`}>
                {content.whatYouWillLearn?.title || "Esta clase es para ti si..."}
            </h2>
            
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                {avatars.map((avatar, idx) => (
                    <div key={idx} className={`relative p-8 md:p-10 rounded-[2rem] ${ds.steps?.cardBg || 'bg-[#1C1239]'} shadow-2xl transition-all duration-500 hover:-translate-y-1 group overflow-hidden flex flex-col h-full border ${ds.steps?.cardBorder || 'border-white/5'}`}>
                        {/* Glow bottom effect */}
                        <div className={`absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t ${ds.blobColor ? ds.blobColor.replace('bg-', 'from-') + '/30' : 'from-purple-500/30'} to-transparent blur-3xl opacity-60`}></div>
                        
                        <div className="relative z-10 flex-1 flex flex-col">
                            <div className={`w-14 h-14 rounded-2xl ${ds.steps?.iconContainer || 'bg-white/5'} border ${ds.steps?.cardBorder || 'border-white/10'} shadow-inner flex items-center justify-center mb-6`}>
                                {React.cloneElement(avatar.icon as any, { size: 24, className: ds.decorations?.starColor || "text-purple-400" })}
                            </div>
                            
                            <h3 className={`text-2xl font-bold ${ds.steps?.titleColor || 'text-white'} leading-tight mb-3`}>
                                {avatar.title}
                            </h3>
                            
                            <p className={`${ds.steps?.textColor || 'text-gray-400'} text-[0.95rem] leading-relaxed mb-6`}>
                                {avatar.description}
                            </p>
                            
                            <div className="flex-1"></div>
                            
                            {avatar.points.length > 0 && (
                                <div className={`space-y-4 mt-auto pt-6 border-t ${ds.steps?.cardBorder || 'border-white/10'}`}>
                                    {avatar.points.map((point: string, pIdx: number) => (
                                        <div key={pIdx} className="flex gap-3 items-start">
                                            <div className={`mt-1 shrink-0 ${ds.blobColor || 'bg-purple-500'} rounded-full w-5 h-5 flex items-center justify-center text-white`}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            </div>
                                            <p className={`${ds.steps?.textColor || 'text-gray-300'} text-sm leading-snug`}>{point}</p>
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
                    className={`inline-flex items-center justify-center gap-3 px-12 py-5 rounded-[2rem] ${ds.buttons?.primary || 'bg-purple-600 text-white'} font-bold text-lg transition-all hover:scale-[1.02] active:scale-95`}
                >
                    {content.hero.ctaText || "QUIERO ACCEDER A LA CLASE GRATIS"}
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* SECCIÓN DINÁMICA: LO QUE APRENDERÁS EN NUESTRA CLASE */}
        <div id="temario-exclusivo" className="max-w-6xl mx-auto px-6 text-center mt-32 mb-16">
            <div className="mb-12">
                <h2 id="beneficios" className={`text-4xl md:text-5xl font-['Inter'] font-extrabold mb-4 leading-tight tracking-tight ${ds.features?.titleColor || 'text-[#241544]'}`}>
                    {content.benefits.title || "Lo que aprenderás en nuestra clase"}
                </h2>
                {content.benefits.subtitle && (
                    <p className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${ds.features?.descColor || 'text-gray-500'}`}>
                        {content.benefits.subtitle}
                    </p>
                )}
            </div>
            
            <div className={`${ds.steps?.cardBg || 'bg-[#1C1239]'} rounded-[2rem] shadow-2xl relative overflow-hidden border ${ds.steps?.cardBorder || 'border-white/5'}`}>
                {/* Subtle glow inside the container */}
                <div className={`absolute top-0 right-0 w-96 h-96 ${ds.blobColor ? ds.blobColor.replace('bg-', 'bg-') + '/20' : 'bg-purple-500/20'} rounded-full blur-[100px] pointer-events-none`}></div>
                <div className={`absolute bottom-0 left-0 w-96 h-96 ${ds.blobColor ? ds.blobColor.replace('bg-', 'bg-') + '/10' : 'bg-pink-500/10'} rounded-full blur-[100px] pointer-events-none`}></div>

                <div className="grid grid-cols-1 md:grid-cols-2 relative z-10 text-left">
                    {benefitsGrid.map((item: any, idx: number) => (
                        <div 
                            key={idx} 
                            className={`p-8 md:p-12 flex gap-6 md:gap-8 hover:bg-white/5 transition-colors duration-500
                                ${idx % 2 === 0 ? `md:border-r ${ds.steps?.cardBorder || 'border-white/10'}` : ''} 
                                ${idx < benefitsGrid.length - 2 ? `md:border-b ${ds.steps?.cardBorder || 'border-white/10'}` : ''} 
                                ${idx < benefitsGrid.length - 1 ? `border-b md:border-b-0 ${ds.steps?.cardBorder || 'border-white/10'}` : ''}
                            `}
                        >
                            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.2rem] border ${ds.steps?.cardBorder || 'border-white/10'} ${ds.steps?.iconContainer || 'bg-white/5'} flex items-center justify-center shrink-0 shadow-inner`}>
                                {React.cloneElement(item.icon as any, { size: 32, className: ds.decorations?.starColor || "text-[#FF00AA]" })}
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className={`text-3xl md:text-4xl font-black ${ds.steps?.numberColor || 'text-[#FF7A00]'}`}>
                                    0{idx + 1}
                                </div>
                                <h3 className={`text-xl md:text-2xl font-bold ${ds.steps?.titleColor || 'text-white'} leading-snug`}>{item.title}</h3>
                                <p className={`${ds.steps?.textColor || 'text-gray-400'} text-sm md:text-[0.95rem] leading-relaxed pt-1`}>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="mt-12 text-center relative z-10">
                <button 
                    onClick={() => setShowModal(true)}
                    className={`inline-flex items-center justify-center gap-3 px-12 py-5 rounded-[2rem] ${ds.buttons?.primary || 'bg-purple-600 text-white'} font-bold text-lg transition-all hover:scale-[1.02] active:scale-95`}
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
