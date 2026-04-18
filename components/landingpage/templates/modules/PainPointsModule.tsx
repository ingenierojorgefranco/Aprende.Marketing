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
      title: "La Emprendedora",
      subtitle: "Buscando su primer negocio",
      icon: <Sparkles className="w-6 h-6 text-purple-500" />,
      gradient: "from-purple-50 to-white",
      points: [
        "Sientes que estás estancada en un trabajo que no te apasiona.",
        "Tienes miedo de emprender por no tener experiencia previa.",
        "Buscas una oportunidad real para ser tu propia jefa."
      ]
    },
    {
      title: "La Especialista",
      subtitle: "Buscando subir de nivel",
      icon: <UserCheck className="w-6 h-6 text-blue-500" />,
      gradient: "from-blue-50 to-white",
      points: [
        "Ya estás en el mundo de la belleza pero tus ingresos son bajos.",
        "Sientes que te faltan técnicas modernas para cobrar más.",
        "Quieres certificarte para generar más confianza en tus clientes."
      ]
    },
    {
      title: "La Visionaria",
      subtitle: "Buscando libertad financiera",
      icon: <TrendingUp className="w-6 h-6 text-emerald-500" />,
      gradient: "from-emerald-50 to-white",
      points: [
        "Buscas un servicio de alta demanda con alto margen de ganancia.",
        "Quieres manejar tu propio tiempo sin depender de un horario.",
        "Deseas construir un negocio escalable con clientes recurrentes."
      ]
    }
  ];

  return (
    <section id="dolores" className={`py-16 ${ds.features.sectionBg}`}>
        <div className="max-w-6xl mx-auto px-6 text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-['Verdana'] font-extrabold mb-4 text-[#2d1b4d]">Esta clase es para ti si...</h2>
            <p className="text-xl text-gray-600 mb-16 max-w-2xl mx-auto">Identifica tu perfil y descubre cómo esta formación transformará tu futuro profesional.</p>
            
            <div className="grid lg:grid-cols-3 gap-8 text-left">
                {avatars.map((avatar, idx) => (
                    <div key={idx} className={`relative p-10 rounded-[2.5rem] border border-gray-100 bg-gradient-to-br ${avatar.gradient} shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group overflow-hidden`}>
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                           {React.cloneElement(avatar.icon as any, { size: 96 })}
                        </div>
                        
                        <div className="relative z-10 space-y-6">
                            <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center">
                                {avatar.icon}
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-[#2d1b4d]">{avatar.title}</h3>
                                <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mt-1">{avatar.subtitle}</p>
                            </div>
                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                {avatar.points.map((point, pIdx) => (
                                    <div key={pIdx} className="flex gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                                        <p className="text-gray-600 leading-relaxed font-medium">{point}</p>
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