
import React from 'react';
import { Flame, AlertTriangle, Rocket, ArrowRight, Brain, Check } from 'lucide-react';

interface ProjectStrategy_PsychologyProps {
    psychology: {
        pains: string[];
        solutions: string[];
    };
}

export const ProjectStrategy_Psychology: React.FC<ProjectStrategy_PsychologyProps> = ({ psychology }) => {
    return (
        <div id="psd-psychology-section" className="space-y-8">
            <div className="w-[80%] mx-auto py-6">
                <h3 id="psd-psychology-header" className="text-3xl font-bold text-white flex items-center gap-2 mb-6">
                    <Flame className="w-8 h-8 text-orange-500"/> “Cómo el sistema va a convencer a tus clientes”
                </h3>
                <div id="psd-psychology-desc" className="text-gray-300 text-[1.3rem] leading-[1.8] font-light mb-8 space-y-4">
                    <p>La venta no es un acto de suerte, es la consecuencia lógica de una secuencia psicológica bien ejecutada. Esta sección desglosa los gatillos mentales que usaremos para mover al prospecto desde la indiferencia hasta la acción de compra.</p>
                    <p>Conectamos cada punto de dolor específico con una solución tangible, eliminando la fricción emocional. Al verbalizar sus miedos mejor que ellos mismos y presentar una salida clara, generamos autoridad y confianza instantánea, haciendo que la tarjeta de crédito salga de la billetera casi por instinto.</p>
                </div>
            </div>
            
            <div id="psd-psychology-card" className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6 uppercase text-xs font-bold tracking-widest text-gray-500 border-b border-gray-800 pb-4">
                    <div className="flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> ❗ Los principales bloqueos de tu cliente</div>
                    <div className="hidden md:flex items-center gap-2 text-green-500"><Rocket className="w-4 h-4"/> 🚀 Los argumentos que usaremos para vender</div>
                </div>

                <div className="space-y-6 relative">
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-800 -translate-x-1/2"></div>

                    {psychology.pains.map((pain, i) => (
                        <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative group">
                            <div className="bg-red-900/10 border border-red-900/30 p-6 rounded-xl text-red-200 text-lg relative">
                                <div className="absolute top-1/2 -right-3 w-6 h-6 bg-gray-900 border border-red-900/30 rounded-full flex items-center justify-center text-xs font-bold text-red-500 z-10 md:hidden">
                                    ↓
                                </div>
                                {pain}
                            </div>

                            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gray-900 border border-gray-700 rounded-full items-center justify-center z-10 text-gray-500 group-hover:text-green-400 group-hover:border-green-500/50 transition">
                                <ArrowRight className="w-4 h-4" />
                            </div>

                            <div className="bg-green-900/10 border border-green-900/30 p-6 rounded-xl text-green-200 text-lg">
                                {psychology.solutions[i] || "Solución específica no definida"}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 bg-gray-950 rounded-2xl p-6 border border-gray-800">
                    <h4 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-500"/> 🧠 ¿En dónde usaremos estos argumentos?
                    </h4>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                        <span className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-lg border border-gray-800"><Check className="w-4 h-4 text-blue-500"/> Headline de la landing</span>
                        <span className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-lg border border-gray-800"><Check className="w-4 h-4 text-blue-500"/> Bullets principales</span>
                        <span className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-lg border border-gray-800"><Check className="w-4 h-4 text-blue-500"/> Emails de objeciones</span>
                        <span className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-lg border border-gray-800"><Check className="w-4 h-4 text-blue-500"/> Mensajes de WhatsApp</span>
                        <span className="flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-lg border border-gray-800"><Check className="w-4 h-4 text-blue-500"/> Artículos de blog</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
