
import React from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, Clock, Award } from 'lucide-react';

const MODULES_DATA: Record<string, any> = {
  'digital-products': {
    title: 'Productos Digitales',
    subtitle: 'Curso Intensivo • 2h 15m',
    description: 'Aprende a crear, validar y vender tu primer infoproducto desde cero. Descubre las estrategias que usan los grandes productores para facturar miles de dólares en Hotmart.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0', // Placeholder
    learningPoints: [
      'Identificación de nichos rentables y validación de oferta',
      'Creación de la oferta irresistible y stack de valor',
      'Estructura de ventas ganadora para Landing Pages',
      'Estrategias de lanzamiento paso a paso'
    ]
  },
  'ai': {
    title: 'Inteligencia Artificial',
    subtitle: 'Masterclass • 1h 45m',
    description: 'Domina las herramientas de IA que están revolucionando el marketing. Aprende a usar ChatGPT y Gemini para automatizar la creación de contenido y soporte.',
    videoUrl: 'https://www.youtube.com/embed/SChXl9k5r6E?rel=0', // Placeholder
    learningPoints: [
      'Prompt Engineering avanzado para marketing',
      'Creación de contenido masivo para redes sociales',
      'Automatización de soporte al cliente con Bots',
      'Análisis de datos y tendencias con IA'
    ]
  }
};

export const TrainingViewer: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const data = moduleId ? MODULES_DATA[moduleId] : null;

  if (!data) {
    return (
        <div className="flex flex-col items-center justify-center h-96 text-gray-400">
            <p className="text-xl">Módulo no encontrado.</p>
            <p className="text-sm">Selecciona un tema del menú de entrenamiento.</p>
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 p-2 md:p-0">
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Info */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
               <span className="bg-primary/20 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                 <Award className="w-3 h-3" /> Certificado
               </span>
               <span className="bg-gray-800 text-gray-300 border border-gray-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                 <Clock className="w-3 h-3" /> {data.subtitle}
               </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                {data.title}
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed border-l-4 border-gray-700 pl-4">
                {data.description}
            </p>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 md:p-8">
            <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-lg">
              <CheckCircle className="w-5 h-5 text-green-500" /> Lo que aprenderás
            </h3>
            <ul className="space-y-4">
              {data.learningPoints.map((point: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-gray-300 text-sm md:text-base">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Video */}
        <div className="lg:col-span-7">
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800 ring-1 ring-white/10 group">
             {/* Decorative gradient behind video */}
             <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 opacity-20 blur-lg group-hover:opacity-30 transition duration-1000"></div>
             
             <iframe 
               src={data.videoUrl} 
               className="absolute inset-0 w-full h-full z-10"
               title={data.title}
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
               allowFullScreen 
             ></iframe>
          </div>
          
          <div className="mt-6 flex justify-between items-center text-sm text-gray-500 px-2">
              <span>Lección 1 de 4</span>
              <button className="text-primary hover:text-white transition font-medium flex items-center gap-1">
                  Siguiente Lección →
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};
