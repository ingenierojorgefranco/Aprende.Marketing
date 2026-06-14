import React from 'react';
import { Users, AlertTriangle, Target, Shield, Layers, Lock, DollarSign, Brain, MessageCircle } from 'lucide-react';

interface ProjectStrategy_MarketProps {
    avatars: any[];
}

export const ProjectStrategy_Market: React.FC<ProjectStrategy_MarketProps> = ({ avatars }) => {
    return (
        <div id="psd-market-section" className="grid grid-cols-1 gap-8 mt-12 pt-12">
            <div className="space-y-6">
                <div className="w-[80%] mx-auto py-6">
                    <h3 id="psd-avatars-header" className="text-3xl font-bold text-white flex items-center gap-2 mb-6">
                        <Users className="w-8 h-8 text-pink-500"/> ¿Quiénes serán tus clientes?
                    </h3>
                    <div id="psd-avatars-desc" className="text-gray-300 text-[1.3rem] leading-[1.8] font-light space-y-4">
                        <p>Un Avatar no es solo un dato demográfico. Es una representación viva de los miedos, deseos y comportamientos de tu comprador ideal. Definirlos con precisión es la diferencia entre un anuncio que se ignora y uno que detiene el scroll.</p>
                        <p>Al entender sus motivaciones profundas, podemos redactar mensajes que resuenen a nivel subconsciente, haciendo que sientan que les hablas directamente a ellos. Estos perfiles son la base para segmentar tus campañas en Facebook e Instagram Ads, asegurando que tu presupuesto se invierta solo en personas con alta probabilidad de compra.</p>
                    </div>
                </div>

                {/* LISTA VERTICAL DE AVATARES */}
                <div id="psd-avatars-list" className="space-y-6">
                    {avatars.map((avatar: any, idx: number) => (
                        <div key={avatar.id} id={`psd-avatar-card-${idx}`} className="bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-gray-700 transition flex flex-col md:flex-row gap-8 relative overflow-hidden group">
                            <div className={`absolute top-0 left-0 h-full w-1 ${idx === 0 ? 'bg-pink-500' : idx === 1 ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                            
                            <div className="md:w-1/3 flex flex-col">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center text-3xl shadow-xl">
                                        {idx === 0 ? '👩‍🎨' : idx === 1 ? '👩‍💼' : '👩‍👧'}
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-bold text-white leading-tight">{avatar.name}</h4>
                                        <span className="text-base text-gray-500 font-mono block mt-1">{avatar.age} • {avatar.archetype}</span>
                                    </div>
                                </div>
                                <p className="text-gray-300 italic text-xl border-l-4 border-gray-700 pl-4 mb-6 font-serif">"{avatar.quote}"</p>
                                
                                <div className="mt-auto">
                                    {(() => {
                                        const motivations = avatar.motivations || {};
                                        const isTextMotivations = Object.values(motivations).some(val => typeof val === 'string');
                                        
                                        if (isTextMotivations) {
                                            return (
                                                <div className="space-y-3 mt-4">
                                                    <p className="text-xs text-amber-500 font-bold uppercase tracking-wider">⚡ Drivers de Decisión</p>
                                                    <div className="space-y-2">
                                                        {Object.entries(motivations).map(([key, value]: any) => (
                                                            <div key={key} className="bg-black/30 border border-gray-800/80 rounded-xl p-3 hover:border-gray-700/80 transition-all flex flex-col">
                                                                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1 font-mono">
                                                                    <span className="text-amber-400 text-xs">✦</span> {key}
                                                                </span>
                                                                <p className="text-xs text-gray-300 mt-1 leading-relaxed font-sans font-light">
                                                                    {value}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return (
                                            <>
                                                <p className="text-xs text-gray-500 font-bold uppercase mb-3 tracking-wider">Impulsores de Compra (Scores)</p>
                                                <div className="space-y-3">
                                                    {Object.entries(motivations)
                                                        .sort(([,a]: any, [,b]: any) => b - a) 
                                                        .slice(0, 3) 
                                                        .map(([key, value]: any) => (
                                                        <div key={key} className="flex items-center gap-3">
                                                            <span className="text-sm text-gray-400 w-16 capitalize font-medium">{key}</span>
                                                            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                                                                <div 
                                                                    className={`h-full rounded-full ${idx === 0 ? 'bg-pink-500' : idx === 1 ? 'bg-purple-500' : 'bg-blue-500'}`} 
                                                                    style={{width: `${value}%`}}
                                                                ></div>
                                                            </div>
                                                            <span className="text-sm text-white font-bold">{value}%</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>

                            <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-black/20 p-6 rounded-xl border border-gray-800/50 hover:border-gray-700/50 transition">
                                    <p className="text-sm text-red-400 font-bold uppercase mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> Dolor Principal</p>
                                    <p className="text-gray-200 text-lg leading-relaxed">{avatar.pain}</p>
                                </div>
                                <div className="bg-black/20 p-6 rounded-xl border border-gray-800/50 hover:border-gray-700/50 transition">
                                    <p className="text-sm text-green-400 font-bold uppercase mb-2 flex items-center gap-2"><Target className="w-4 h-4"/> Deseo Profundo</p>
                                    <p className="text-gray-200 text-lg leading-relaxed">{avatar.desire}</p>
                                </div>
                                <div className="bg-black/20 p-6 rounded-xl border border-gray-800/50 hover:border-gray-700/50 transition md:col-span-2">
                                    <p className="text-sm text-orange-400 font-bold uppercase mb-2 flex items-center gap-2"><Shield className="w-4 h-4"/> Objeción Clave</p>
                                    <p className="text-gray-200 text-lg leading-relaxed">{avatar.objection}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-12">
                    <div className="w-[80%] mx-auto py-6">
                        <h3 className="text-3xl font-bold text-white flex items-center gap-2 mb-6">
                            <Layers className="w-8 h-8 text-yellow-500"/> Estrategia del Sistema: ¿Cómo usamos estos perfiles?
                        </h3>
                        <p className="text-gray-300 text-[1.3rem] leading-[1.8] font-light mb-8">
                            No usamos estos perfiles al azar. Cada avatar tiene un rol específico dentro de tu embudo de ventas para maximizar la conversión en cada etapa del proceso.
                        </p>
                    </div>

                    <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-700 rounded-2xl p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <h5 className="text-lg font-bold text-gray-400 uppercase tracking-wider mb-4">Distribución en el Embudo</h5>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-5 rounded-xl bg-gray-800/50 border border-gray-700">
                                        <div className="w-10 h-10 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-sm">1</div>
                                        <div>
                                            <p className="text-white text-lg font-bold">Landing Page & Anuncios</p>
                                            <p className="text-gray-400 text-base">Atacamos al <span className="text-pink-400 font-bold">Avatar Principal (Laura)</span> apelando a su deseo de libertad.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-5 rounded-xl bg-gray-800/50 border border-gray-700">
                                        <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">2</div>
                                        <div>
                                            <p className="text-white text-lg font-bold">Secuencia de Email Marketing</p>
                                            <p className="text-gray-400 text-base">Derribamos objeciones lógicas del <span className="text-purple-400 font-bold">Avatar Escéptico (Mónica)</span> con datos y garantías.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-5 rounded-xl bg-gray-800/50 border border-gray-700">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">3</div>
                                        <div>
                                            <p className="text-white text-lg font-bold">Cierre por WhatsApp</p>
                                            <p className="text-gray-400 text-base">Damos seguridad y opciones de pago al <span className="text-blue-400 font-bold">Avatar Aspiracional (Ana)</span>.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h5 className="text-lg font-bold text-gray-400 uppercase tracking-wider mb-4">Aplicación Táctica</h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-black/30 p-6 rounded-xl border border-gray-800">
                                        <Lock className="w-8 h-8 text-green-500 mb-3" />
                                        <p className="text-white text-lg font-bold mb-2">Seguridad</p>
                                        <p className="text-gray-400 text-base">Usaremos garantías fuertes en el checkout para calmar el miedo a perder dinero.</p>
                                    </div>
                                    <div className="bg-black/30 p-6 rounded-xl border border-gray-800">
                                        <DollarSign className="w-8 h-8 text-yellow-500 mb-3" />
                                        <p className="text-white text-lg font-bold mb-2">Resultados</p>
                                        <p className="text-gray-400 text-base">El Headline de la landing prometerá un resultado tangible ("Triplica tus ingresos").</p>
                                    </div>
                                    <div className="bg-black/30 p-6 rounded-xl border border-gray-800">
                                        <Brain className="w-8 h-8 text-purple-500 mb-3" />
                                        <p className="text-white text-lg font-bold mb-2">Educación</p>
                                        <p className="text-gray-400 text-base">Contenido previo a la venta para posicionarte como autoridad ante los escépticos.</p>
                                    </div>
                                    <div className="bg-black/30 p-6 rounded-xl border border-gray-800">
                                        <MessageCircle className="w-8 h-8 text-blue-500 mb-3" />
                                        <p className="text-white text-lg font-bold mb-2">Confianza</p>
                                        <p className="text-gray-400 text-base">Mensajes de WhatsApp personalizados que reducen la ansiedad de compra.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};