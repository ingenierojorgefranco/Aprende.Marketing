import React from 'react';
import { GeneratedPageContent, Project } from '../../../../types';
import { XCircle, Sparkles, UserCheck, TrendingUp, CheckCircle2, Target, Zap, DollarSign, Award } from 'lucide-react';

interface PainPointsModuleProps {
  content: GeneratedPageContent;
  ds: any;
  project?: Project;
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

export const PainPointsModule: React.FC<PainPointsModuleProps> = ({ content, ds, project }) => {
  const strategy = project?.strategy_json;
  const pains = strategy?.psychology?.pains || [];
  const learningModules = strategy?.psychology?.learningModules || [];

  const getPainsForAvatar = (index: number) => {
    // Si hay dolores asignados por avatarId en el proyecto, los usamos
    // El avatarId suele empezar en 0 o 1. Asumimos que corresponde al índice + 1
    const avatarPains = pains.filter((p: any) => p.avatarId === index + 1 || p.avatarId === index);
    if (avatarPains.length > 0) return avatarPains.map((p: any) => p.text);
    
    // Si no hay por avatarId, repartimos proporcionalmente
    const itemsPerAvatar = 3;
    const start = index * itemsPerAvatar;
    return pains.slice(start, start + itemsPerAvatar).map((p: any) => p.text);
  };
  
  const avatars = [
    {
      title: "Si buscas crear tu propio negocio y reinventarte profesionalmente",
      icon: <Sparkles className="w-10 h-10 text-purple-400" />,
      gradient: "from-[#1a0b2e] via-[#12061d] to-[#0f041d]",
      points: getPainsForAvatar(0).length > 0 ? getPainsForAvatar(0) : [
        "Sientes que es el momento de dejar de trabajar para otros y construir algo propio.",
        "Buscas una habilidad rentable que puedas iniciar desde cero sin complicaciones.",
        "Deseas libertad de tiempo para disfrutar con tu familia mientras generas ingresos altos."
      ]
    },
    {
      title: "Si ya estás en el sector belleza y quieres dominar la técnica más top",
      icon: <TrendingUp className="w-10 h-10 text-blue-400" />,
      gradient: "from-[#0f172a] via-[#0b1120] to-[#090e1a]",
      points: getPainsForAvatar(1).length > 0 ? getPainsForAvatar(1) : [
        "Quieres diferenciarte de la competencia ofreciendo resultados ultra-naturales.",
        "Buscas aumentar el ticket promedio de tus servicios con procedimientos de alto valor.",
        "Necesitas perfeccionar tu técnica para ganar la confianza total de tus clientes."
      ]
    },
    {
      title: "Si te da miedo fallar por falta de experiencia pero buscas respaldo",
      icon: <UserCheck className="w-10 h-10 text-emerald-400" />,
      gradient: "from-[#061a14] via-[#04120e] to-[#030d0a]",
      points: getPainsForAvatar(2).length > 0 ? getPainsForAvatar(2) : [
        "Te preocupa no tener 'talento' artístico, pero buscas un método paso a paso probado.",
        "Tienes miedo a realizar una inversión y no recuperar el dinero rápidamente.",
        "Buscas una certificación que realmente te abra puertas en el mercado profesional."
      ]
    }
  ];

  const benefitsGrid = learningModules.length > 0 
    ? learningModules.map((m: any) => ({
        title: m.title,
        desc: m.description,
        icon: iconMap[m.icon] || <Sparkles className="w-10 h-10 text-purple-400" />,
        bg: m.bg || "from-[#1a0b2e] via-[#12061d] to-[#0f041d]",
        border: m.border || "border-white/10",
        glow: m.glow || "hover:shadow-purple-500/20"
      }))
    : (content.benefits.items && content.benefits.items.length > 0) 
    ? content.benefits.items.slice(0, 9).map(b => ({
        title: b.title,
        desc: b.description || "Descubre el camino exacto para dominar esta habilidad y transformar tu carrera profesional.",
        icon: b.icon === 'Target' ? <Target className="w-10 h-10 text-blue-400" /> : 
              b.icon === 'TrendingUp' ? <TrendingUp className="w-10 h-10 text-emerald-400" /> : 
              b.icon === 'UserCheck' ? <UserCheck className="w-10 h-10 text-blue-400" /> :
              b.icon === 'CheckCircle2' ? <CheckCircle2 className="w-10 h-10 text-purple-400" /> :
              <Sparkles className="w-10 h-10 text-purple-400" />,
        bg: b.color === 'blue' ? "from-[#0f172a] via-[#0b1120] to-[#090e1a]" :
            b.color === 'emerald' || b.color === 'green' ? "from-[#061a14] via-[#04120e] to-[#030d0a]" :
            "from-[#1a0b2e] via-[#12061d] to-[#0f041d]",
        border: "border-white/10",
        glow: b.color === 'blue' ? "hover:shadow-blue-500/20" :
              b.color === 'emerald' || b.color === 'green' ? "hover:shadow-emerald-500/20" :
              "hover:shadow-purple-500/20"
      }))
    : [
        {
            title: "Habilidad desde Cero",
            desc: "Descubre cómo dominar la técnica de microblading sin necesidad de talento artístico previo, siguiendo un mapa paso a paso.",
            icon: <Sparkles className="w-10 h-10 text-purple-400" />,
            bg: "from-[#1a0b2e] via-[#12061d] to-[#0f041d]",
            border: "border-white/10",
            glow: "hover:shadow-purple-500/20"
        }
    ];

  return (
    <section id="dolores" className={`py-24 ${ds.features.sectionBg}`}>
        <div className="max-w-7xl mx-auto px-6 text-center mb-32">
            <h2 className="text-4xl md:text-6xl font-['Verdana'] font-extrabold mb-8 text-[#2d1b4d] leading-tight tracking-tight">Esta clase es para ti si...</h2>
            
            <div className="max-w-6xl mx-auto flex flex-col gap-16 text-left">
                {avatars.map((avatar, idx) => (
                    <div key={idx} className={`relative p-12 md:p-20 rounded-[4rem] border border-white/10 bg-gradient-to-br ${avatar.gradient} shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] hover:shadow-purple-500/10 transition-all duration-700 hover:-translate-y-2 group overflow-hidden backdrop-blur-sm`}>
                        <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:opacity-[0.06] group-hover:scale-110 transition-all duration-700">
                           {React.cloneElement(avatar.icon as any, { size: 300 })}
                        </div>
                        
                        <div className="relative z-10 flex flex-col lg:flex-row gap-16 lg:items-center">
                            <div className="space-y-10 flex-1">
                                <div className="w-28 h-28 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/20 shadow-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-700">
                                    {avatar.icon}
                                </div>
                                <h3 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">{avatar.title}</h3>
                            </div>
                            
                            <div className="lg:w-[45%] space-y-8 lg:pl-16 lg:border-l border-white/10">
                                {avatar.points.map((point: string, pIdx: number) => (
                                    <div key={pIdx} className="flex gap-6">
                                        <div className="mt-3 shrink-0">
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

        <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className={`text-3xl md:text-4xl font-black mb-4 ${ds.features.titleColor}`}>{content.whatYouWillLearn.title || "¿Es para ti esta clase?"}</h2>
            <p className={`text-xl font-medium mb-12 ${ds.features.descColor}`}>Si te pasa que…</p>
            <div className="grid md:grid-cols-2 gap-8 text-left">
                {(pains.length > 0 ? pains.slice(0, 6).map((p: any) => p.text) : (content.whatYouWillLearn.items || [])).map((item: string, idx: number) => (
                    <div key={idx} className={`group relative flex items-center gap-5 p-8 rounded-[2rem] border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden ${ds.features.cardBorder} bg-gradient-to-br from-white via-white to-gray-50/50`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner bg-red-50 border border-red-100/50`}>
                            <XCircle className="w-6 h-6 text-red-500" />
                        </div>
                        <p className={`relative z-10 text-[1.1rem] md:text-[1.2rem] leading-relaxed font-semibold tracking-tight ${ds.features.descColor}`}>{item}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* NUEVA SECCIÓN QUEMADA: LO QUE APRENDERÁS EN NUESTRA CLASE */}
        <div className="max-w-7xl mx-auto px-6 text-center mt-32 mb-16">
            <div className="mb-20">
                <h2 className="text-4xl md:text-6xl font-['Verdana'] font-extrabold mb-8 text-[#2d1b4d] leading-tight tracking-tight">Lo que aprenderás en nuestra clase</h2>
                <div className={`h-1.5 w-24 rounded-full mx-auto bg-gradient-to-r from-purple-600 to-pink-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]`}></div>
            </div>

            <div className="grid gap-8 md:grid-cols-3 text-left">
                {benefitsGrid.map((item: any, idx: number) => (
                    <div key={idx} className={`relative p-10 rounded-[3.5rem] border bg-gradient-to-br ${item.bg} ${item.border} shadow-2xl transition-all duration-700 group overflow-hidden ${item.glow} backdrop-blur-sm hover:-translate-y-2`}>
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.07] group-hover:scale-125 transition-all duration-700 pointer-events-none">
                            {React.cloneElement(item.icon as any, { size: 180 })}
                        </div>
                        <div className="relative z-10 space-y-6">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                                {React.cloneElement(item.icon as any, { size: 32 })}
                            </div>
                            <h3 className="text-[1.6rem] font-black text-white leading-tight uppercase tracking-tight">{item.title}</h3>
                            <p className="text-gray-300 text-[1.1rem] leading-relaxed font-medium">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-20">
                <button className="px-12 py-6 rounded-[2rem] bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-2xl shadow-[0_15px_40px_rgba(168,85,247,0.4)] hover:shadow-[0_20px_50px_rgba(168,85,247,0.6)] transition-all duration-500 hover:-translate-y-1 hover:scale-105 active:scale-95 group flex items-center gap-4 mx-auto">
                    QUIERO ACCEDER A LA CLASE GRATIS
                    <CheckCircle2 className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                </button>
            </div>
        </div>
    </section>
  );
};