import React from 'react';
import { GeneratedPageContent } from '../../../../types';
import { XCircle, Sparkles, UserCheck, TrendingUp, CheckCircle2 } from 'lucide-react';

interface PainPointsModuleProps {
  content: GeneratedPageContent;
  ds: any;
}

export const PainPointsModule: React.FC<PainPointsModuleProps> = ({ content, ds }) => {
  const avatars = [
    {
      title: "Si buscas crear tu propio negocio y reinventarte profesionalmente",
      icon: <Sparkles className="w-10 h-10 text-purple-400" />,
      gradient: "from-[#1a0b2e] via-[#12061d] to-[#0f041d]",
      points: [
        "Sientes que es el momento de dejar de trabajar para otros y construir algo propio.",
        "Buscas una habilidad rentable que puedas iniciar desde cero sin complicaciones.",
        "Deseas libertad de tiempo para disfrutar con tu familia mientras generas ingresos altos."
      ]
    },
    {
      title: "Si ya estás en el sector belleza y quieres dominar la técnica más top",
      icon: <TrendingUp className="w-10 h-10 text-blue-400" />,
      gradient: "from-[#0f172a] via-[#0b1120] to-[#090e1a]",
      points: [
        "Quieres diferenciarte de la competencia ofreciendo resultados ultra-naturales.",
        "Buscas aumentar el ticket promedio de tus servicios con procedimientos de alto valor.",
        "Necesitas perfeccionar tu técnica para ganar la confianza total de tus clientes."
      ]
    },
    {
      title: "Si te da miedo fallar por falta de experiencia pero buscas respaldo",
      icon: <UserCheck className="w-10 h-10 text-emerald-400" />,
      gradient: "from-[#061a14] via-[#04120e] to-[#030d0a]",
      points: [
        "Te preocupa no tener 'talento' artístico, pero buscas un método paso a paso probado.",
        "Tienes miedo a realizar una inversión y no recuperar el dinero rápidamente.",
        "Buscas una certificación que realmente te abra puertas en el mercado profesional."
      ]
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
                                {avatar.points.map((point, pIdx) => (
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
                {(content.whatYouWillLearn.items || []).slice(0, 6).map((item, idx) => (
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
    </section>
  );
};