
import React from 'react';
import { ClipboardList, Sparkles, Target, Zap, MousePointerClick, Info, Rocket } from 'lucide-react';

interface ProjectStrategy_SummaryProps {
    strategyData: any;
    activeHeaderItem: string | null;
    setActiveHeaderItem: (item: string | null) => void;
}

export const ProjectStrategy_Summary: React.FC<ProjectStrategy_SummaryProps> = ({ strategyData, activeHeaderItem, setActiveHeaderItem }) => {
    return (
        <>
            <div id="psd-summary-container" className="w-[80%] mx-auto py-6">
                <h2 id="psd-summary-title" className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
                    <ClipboardList className="w-8 h-8 text-indigo-500" /> Resumen del Proyecto
                </h2>
                <p id="psd-summary-desc-1" className="text-gray-300 text-[1.3rem] leading-[1.8] font-light mb-8">
                    A continuación, descubrirás los pilares fundamentales de tu estrategia. Nuestro sistema de inteligencia artificial te guiará para crear la mejor estrategia de marketing adaptada al producto digital de Hotmart que has elegido.
                </p>
                <p id="psd-summary-desc-2" className="text-gray-300 text-[1.3rem] leading-[1.8] font-light mt-4">
                    Pasa el cursor sobre las tarjetas de la izquierda para explorar detalles completos de cada pilar.
                </p>
            </div>

            <div id="psd-grid-container" className="grid lg:grid-cols-12 gap-8 items-stretch">
                
                {/* Left Column: Interactive Menu */}
                <div id="psd-menu-container" className="flex flex-col gap-4 lg:col-span-5">
                    <div 
                        id="psd-menu-card-overview"
                        onMouseEnter={() => setActiveHeaderItem('overview')}
                        className={`p-6 rounded-xl border transition-all duration-300 cursor-pointer group relative overflow-hidden ${activeHeaderItem === 'overview' ? 'bg-gray-800 border-indigo-500/50 shadow-lg shadow-indigo-500/10' : 'bg-gray-900 border-gray-800 hover:bg-gray-800'}`}
                    >
                        <div className="flex items-center gap-5 relative z-10">
                            <div className={`p-4 rounded-xl ${activeHeaderItem === 'overview' ? 'bg-indigo-500 text-white' : 'bg-gray-800 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-300'} transition-colors`}>
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-1">Visión General</p>
                                <p className={`font-bold text-2xl ${activeHeaderItem === 'overview' ? 'text-white' : 'text-gray-300'}`}>Tu Estrategia Ganadora</p>
                            </div>
                        </div>
                    </div>

                    <div 
                        id="psd-menu-card-niche"
                        onMouseEnter={() => setActiveHeaderItem('niche')}
                        className={`p-6 rounded-xl border transition-all duration-300 cursor-pointer group relative overflow-hidden ${activeHeaderItem === 'niche' ? 'bg-gray-800 border-purple-500/50 shadow-lg shadow-purple-500/10' : 'bg-gray-900 border-gray-800 hover:bg-gray-800'}`}
                    >
                        <div className="flex items-center gap-5 relative z-10">
                            <div className={`p-4 rounded-xl ${activeHeaderItem === 'niche' ? 'bg-purple-500 text-white' : 'bg-gray-800 text-purple-400 group-hover:bg-purple-500/20 group-hover:text-purple-300'} transition-colors`}>
                                <Target className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-1">Nicho</p>
                                <p className={`font-bold text-2xl ${activeHeaderItem === 'niche' ? 'text-white' : 'text-gray-300'}`}>{strategyData.meta.niche}</p>
                            </div>
                        </div>
                    </div>

                    <div 
                        id="psd-menu-card-product"
                        onMouseEnter={() => setActiveHeaderItem('product')}
                        className={`p-6 rounded-xl border transition-all duration-300 cursor-pointer group relative overflow-hidden ${activeHeaderItem === 'product' ? 'bg-gray-800 border-yellow-500/50 shadow-lg shadow-yellow-500/10' : 'bg-gray-900 border-gray-800 hover:bg-gray-800'}`}
                    >
                        <div className="flex items-center gap-5 relative z-10">
                            <div className={`p-4 rounded-xl ${activeHeaderItem === 'product' ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-yellow-400 group-hover:bg-yellow-500/20 group-hover:text-yellow-300'} transition-colors`}>
                                <Zap className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-1">Producto</p>
                                <p className={`font-bold text-2xl ${activeHeaderItem === 'product' ? 'text-white' : 'text-gray-300'}`}>¿Cuánto vas a ganar?</p>
                            </div>
                        </div>
                    </div>

                    <div 
                        id="psd-menu-card-objective"
                        onMouseEnter={() => setActiveHeaderItem('objective')}
                        className={`p-6 rounded-xl border transition-all duration-300 cursor-pointer group relative overflow-hidden ${activeHeaderItem === 'objective' ? 'bg-gray-800 border-blue-500/50 shadow-lg shadow-blue-500/10' : 'bg-gray-900 border-gray-800 hover:bg-gray-800'}`}
                    >
                        <div className="flex items-center gap-5 relative z-10">
                            <div className={`p-4 rounded-xl ${activeHeaderItem === 'objective' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-blue-400 group-hover:bg-blue-500/20 group-hover:text-blue-300'} transition-colors`}>
                                <MousePointerClick className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-1">Objetivo</p>
                                <p className={`font-bold text-2xl ${activeHeaderItem === 'objective' ? 'text-white' : 'text-gray-300'}`}>¿Cómo vas a ganar?</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Dynamic Context Panel */}
                <div id="psd-panel-container" className="lg:col-span-7 bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-black p-8 md:p-12 rounded-3xl border border-indigo-500/30 relative overflow-hidden flex flex-col justify-center min-h-[500px]">
                    <div id="psd-panel-decorator" className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                        <Rocket className="w-40 h-40 text-indigo-400" />
                    </div>
                    
                    <div id="psd-panel-content" className="relative z-10 transition-all duration-500 ease-in-out">
                        {!activeHeaderItem ? (
                            <div id="psd-panel-default" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h2 className="text-4xl font-bold text-white mb-6">
                                    Hola Admin, aquí tienes tu estrategia de venta para vender el producto digital.
                                </h2>
                                <p className="text-gray-300 mb-8 text-[1.3rem] leading-[1.8]">
                                    Hemos analizado tu producto y el mercado actual. En este informe interactivo, no solo verás datos, sino que te explicaremos paso a paso la estrategia exacta que necesitas ejecutar para convertir desconocidos en clientes. Prepárate para dominar tu nicho.
                                </p>
                                <div className="flex items-center gap-3 text-lg text-indigo-300 font-medium">
                                    <Info className="w-6 h-6" /> Pasa el cursor sobre las tarjetas de la izquierda para ver detalles estratégicos.
                                </div>
                            </div>
                        ) : activeHeaderItem === 'overview' ? (
                            <div id="psd-panel-overview" className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                                    <Sparkles className="w-8 h-8 text-indigo-400" /> {strategyData.meta.insights.overview.title}
                                </h2>
                                <div className="space-y-4">
                                    {strategyData.meta.insights.overview.items.map((item: any, i: number) => (
                                        <div key={i} className={`flex items-start gap-4 p-4 rounded-xl border backdrop-blur-sm ${item.bg} ${item.border}`}>
                                            <div className={`p-2.5 rounded-lg bg-black/40 ${item.color} flex-shrink-0`}>
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className={`text-sm font-bold uppercase mb-1 opacity-70 ${item.color}`}>{item.label}</p>
                                                <p className="text-white font-medium text-xl leading-snug">{item.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : activeHeaderItem === 'niche' ? (
                            <div id="psd-panel-niche" className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                                    <Target className="w-8 h-8 text-purple-500" /> {strategyData.meta.insights.niche.title}
                                </h2>
                                <div className="text-gray-300 border-l-4 border-purple-500 pl-6 text-[1.3rem] leading-[1.8] space-y-4">
                                    <p>El nicho de belleza es un mercado 'Evergreen' (siempre verde), resistente a crisis. Específicamente, el microblading tiene una barrera de entrada técnica que justifica precios altos.</p>
                                    <p>La demanda de servicios estéticos semi-permanentes ha crecido un 40% anual. Tu oportunidad está en enseñar 'negocio' además de 'técnica', algo que la competencia ignora.</p>
                                </div>
                            </div>
                        ) : activeHeaderItem === 'product' ? (
                            <div id="psd-panel-product" className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                                    <Zap className="w-8 h-8 text-yellow-500" /> ¿Cuánto vas a ganar?
                                </h2>
                                <div className="text-gray-300 border-l-4 border-yellow-500 pl-6 text-[1.3rem] leading-[2rem] space-y-4">
                                    <p>Este es un producto de $200 USD. Tu ganancia por venta a precio full es de $116.81 (65% de comisión). Eso significa que con solo 10 ventas al mes, ya estás superando los $1,000 USD de ingreso neto.</p>
                                    <p>Nuestra estrategia principal es vender a este precio para maximizar tu margen. No buscamos competir por precio bajo, sino por alto valor percibido.</p>
                                    <p>Usaremos los descuentos (donde tu ganancia baja a $47) únicamente como una herramienta de rescate esporádica para recuperar carritos abandonados, pero tu objetivo principal siempre será facturar en grande.</p>
                                </div>
                            </div>
                        ) : (
                            <div id="psd-panel-objective" className="animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col justify-center">
                                <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                                    <MousePointerClick className="w-8 h-8 text-blue-500" /> ¿Cómo vas a ganar?
                                </h2>
                                <div className="text-gray-300 border-l-4 border-blue-500 pl-6 mb-6 text-[1.3rem] leading-[2rem] space-y-4">
                                    <p>Vas a ganar implementando un ecosistema de venta directa matemáticamente probado. No dependerás de la suerte ni de perseguir clientes, sino de una estructura lógica donde atraemos tráfico cualificado del nicho de belleza y lo convertimos mediante una oferta irresistible de alto valor percibido, diseñada específicamente para resolver los dolores urgentes de tu avatar.</p>
                                    <p>Al vender un producto High Ticket en un mercado 'Evergreen' como la estética, tu margen de maniobra es amplio. Utilizaremos la autoridad del curso y la promesa de rentabilidad rápida para derribar la barrera del precio. El sistema se encargará de elevar la consciencia del cliente para que vea el costo no como un gasto, sino como la inversión que cambiará su carrera.</p>
                                    <p>Finalmente, tu victoria reside en la automatización y la escala. Una vez validado el embudo con las primeras ventas, tu único trabajo será supervisar el flujo constante de interesados que el sistema genera. Pasarás de ser un vendedor manual a ser el gestor de un negocio digital que factura de manera predecible, permitiéndote recuperar tu tiempo y libertad financiera.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
