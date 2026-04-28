import React, { useState } from 'react';
import { GeneratedPageContent, Project } from '../../../../types';
import { XCircle, Sparkles, UserCheck, TrendingUp, CheckCircle2, Target, Zap, DollarSign, Award, ArrowRight } from 'lucide-react';
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
  const pains = strategy?.psychology?.pains || [];
  const learningModules = strategy?.psychology?.learningModules || [];

  const getPainsForAvatar = (index: number) => {
    const avatarPains = pains.filter((p: any) => p.avatarId === index + 1);
    if (avatarPains.length > 0) return avatarPains.map((p: any) => p.text);
    
    // Fallback logic
    const itemsPerAvatar = 3;
    const start = index * itemsPerAvatar;
    return pains.length > 0 ? pains.slice(start, start + itemsPerAvatar).map((p: any) => p.text) : [];
  };
  
  const avatarData = [
    { title: content.whatYouWillLearn.avatarTitles?.[0] || "Si buscas crear tu propio negocio y reinventarte profesionalmente", iconName: content.whatYouWillLearn.avatarIcons?.[0] || "Sparkles" },
    { title: content.whatYouWillLearn.avatarTitles?.[1] || "Si ya estás en el sector belleza y quieres dominar la técnica más top", iconName: content.whatYouWillLearn.avatarIcons?.[1] || "TrendingUp" },
    { title: content.whatYouWillLearn.avatarTitles?.[2] || "Si te da miedo fallar por falta de experiencia pero buscas respaldo", iconName: content.whatYouWillLearn.avatarIcons?.[2] || "UserCheck" }
  ];

  const avatars = avatarData.map((data, idx) => {
      const colors = getModuleColors(idx === 0 ? 'purple' : idx === 1 ? 'blue' : 'green');
      return {
          ...data,
          icon: getIconByName(data.iconName, idx === 0 ? <Sparkles className="w-10 h-10 text-purple-400" /> : idx === 1 ? <TrendingUp className="w-10 h-10 text-blue-400" /> : <UserCheck className="w-10 h-10 text-emerald-400" />),
          gradient: colors.bg,
          points: getPainsForAvatar(idx).length > 0 ? getPainsForAvatar(idx) : [
              idx === 0 ? "Construye algo propio desde cero." : idx === 1 ? "Domina la técnica natural." : "Recupera tu inversión pronto."
          ]
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
    <section id="dolores" className={`py-24 ${ds.features.sectionBg}`}>
        <div id="puntos-dolor-avatars" className="max-w-7xl mx-auto px-6 text-center mb-32">
            <h2 className="text-4xl md:text-6xl font-['Verdana'] font-extrabold mb-8 text-[#2d1b4d] leading-tight tracking-tight">
                {content.whatYouWillLearn.title || "Esta clase es para ti si..."}
            </h2>
            
            <div className="max-w-6xl mx-auto flex flex-col gap-16 text-left">
                {avatars.map((avatar, idx) => (
                    <div key={idx} className={`relative p-8 md:p-20 rounded-[3rem] md:rounded-[4rem] border border-white/20 bg-gradient-to-br ${avatar.gradient} shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] hover:shadow-purple-500/20 transition-all duration-700 hover:-translate-y-2 group overflow-hidden`}>
                        <div className="absolute top-0 right-0 p-16 opacity-[0.05] group-hover:opacity-[0.1] group-hover:scale-110 transition-all duration-700">
                           {React.cloneElement(avatar.icon as any, { size: 300 })}
                        </div>
                        
                        <div className="relative z-10 flex flex-col lg:flex-row gap-10 md:gap-16 lg:items-center">
                            <div className="space-y-6 md:space-y-10 flex-1">
                                <div className="w-20 h-20 md:w-28 md:h-28 rounded-3xl bg-white/10 border border-white/20 shadow-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-700">
                                    {avatar.icon}
                                </div>
                                <h3 className="text-3xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">{avatar.title}</h3>
                            </div>
                            
                            <div className="lg:w-[45%] space-y-6 md:space-y-8 lg:pl-16 lg:border-l border-white/20">
                                {avatar.points.map((point: string, pIdx: number) => (
                                    <div key={pIdx} className="flex gap-4 md:gap-6">
                                        <div className="mt-2 md:mt-3 shrink-0">
                                            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.8)]"></div>
                                        </div>
                                        <p className="text-gray-200 text-[1.4rem] leading-relaxed font-medium">{point}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* SECCIÓN DINÁMICA: LO QUE APRENDERÁS EN NUESTRA CLASE */}
        <div id="temario-exclusivo" className="max-w-7xl mx-auto px-6 text-center mt-32 mb-16">
            <div className="mb-20">
                <h2 id="beneficios" className="text-4xl md:text-6xl font-['Verdana'] font-extrabold mb-8 text-[#2d1b4d] leading-tight tracking-tight">
                    {content.benefits.title || "Lo que aprenderás en nuestra clase"}
                </h2>
                {content.benefits.subtitle && <p className="text-xl text-gray-600 mt-4 mb-8">{content.benefits.subtitle}</p>}
                <div className={`h-1.5 w-24 rounded-full mx-auto bg-gradient-to-r from-purple-600 to-pink-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]`}></div>
            </div>

            <div className="grid gap-6 md:grid-cols-3 text-left">
                {benefitsGrid.map((item: any, idx: number) => (
                    <div key={idx} className={`relative p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border bg-gradient-to-br ${item.bg} ${item.border} shadow-2xl transition-all duration-700 group overflow-hidden ${item.glow} hover:-translate-y-2`}>
                        <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:opacity-[0.1] group-hover:scale-125 transition-all duration-700 pointer-events-none">
                            {React.cloneElement(item.icon as any, { size: 180 })}
                        </div>
                        <div className="relative z-10 space-y-6">
                            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                                {React.cloneElement(item.icon as any, { size: 32 })}
                            </div>
                            <h3 className="text-[1.6rem] font-black text-white leading-tight uppercase tracking-tight">{item.title}</h3>
                            <p className="text-gray-300 text-[1.1rem] leading-relaxed font-medium">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-20">
                <button 
                    onClick={() => setShowModal(true)}
                    className="px-12 py-6 rounded-[2rem] bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-2xl shadow-[0_15px_40px_rgba(168,85,247,0.4)] hover:shadow-[0_20px_50px_rgba(168,85,247,0.6)] transition-all duration-500 hover:-translate-y-1 hover:scale-105 active:scale-95 group flex items-center gap-4 mx-auto"
                >
                    {content.hero.ctaText || "QUIERO ACCEDER A LA CLASE GRATIS"}
                    <CheckCircle2 className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                </button>
            </div>
        </div>
        {showModal && <RegistrationModal content={content} ds={ds} onClose={() => setShowModal(false)} pageId={pageId} basePath={basePath} />}
    </section>
  );
};
