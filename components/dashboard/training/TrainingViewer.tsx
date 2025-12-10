
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, Clock, Award, PlayCircle, ChevronDown, ChevronUp, Play } from 'lucide-react';

// Types definition
type Lesson = {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  isLocked?: boolean;
};

type Module = {
  id: string;
  title: string;
  lessons: Lesson[];
};

type CourseData = {
  title: string;
  subtitle: string;
  description: string;
  learningPoints: string[];
  modules: Module[];
};

const MODULES_DATA: Record<string, CourseData> = {
  'digital-products': {
    title: 'Productos Digitales',
    subtitle: 'Curso Intensivo',
    description: 'Aprende a crear, validar y vender tu primer infoproducto desde cero. Descubre las estrategias que usan los grandes productores para facturar miles de dólares en Hotmart.',
    learningPoints: [
      'Identificación de nichos rentables y validación de oferta',
      'Creación de la oferta irresistible y stack de valor',
      'Estructura de ventas ganadora para Landing Pages',
      'Estrategias de lanzamiento paso a paso'
    ],
    modules: [
        {
            id: 'm1',
            title: 'Módulo 1: Fundamentos y Mentalidad',
            lessons: [
                { id: 'l1', title: 'Bienvenida al Curso', duration: '5:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&autoplay=1' },
                { id: 'l2', title: 'Mentalidad de Productor vs Afiliado', duration: '12:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&autoplay=1' },
                { id: 'l3', title: 'El Mapa del Tesoro: Nichos Rentables', duration: '15:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&autoplay=1' }
            ]
        },
        {
            id: 'm2',
            title: 'Módulo 2: Creación del Producto',
            lessons: [
                { id: 'l4', title: 'Estructura de un Curso Ganador', duration: '20:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&autoplay=1' },
                { id: 'l5', title: 'Grabación y Edición Básica', duration: '18:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&autoplay=1' },
                { id: 'l6', title: 'Creando Materiales de Apoyo (PDFs)', duration: '10:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&autoplay=1' }
            ]
        },
        {
            id: 'm3',
            title: 'Módulo 3: Configuración en Hotmart',
            lessons: [
                { id: 'l7', title: 'Registro y Configuración de Cuenta', duration: '08:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&autoplay=1' },
                { id: 'l8', title: 'Subiendo tu Producto Paso a Paso', duration: '25:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&autoplay=1' },
                { id: 'l9', title: 'Creación de Checkout y Ofertas', duration: '15:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&autoplay=1' }
            ]
        }
    ]
  },
  'ai': {
    title: 'Inteligencia Artificial',
    subtitle: 'Masterclass',
    description: 'Domina las herramientas de IA que están revolucionando el marketing. Aprende a usar ChatGPT y Gemini para automatizar la creación de contenido y soporte.',
    learningPoints: [
      'Prompt Engineering avanzado para marketing',
      'Creación de contenido masivo para redes sociales',
      'Automatización de soporte al cliente con Bots',
      'Análisis de datos y tendencias con IA'
    ],
    modules: [
        {
            id: 'aim1',
            title: 'Introducción a la IA Generativa',
            lessons: [
                { id: 'ail1', title: 'Qué es Gemini y ChatGPT', duration: '10:00', videoUrl: 'https://www.youtube.com/embed/SChXl9k5r6E?rel=0&autoplay=1' },
                { id: 'ail2', title: 'Ingeniería de Prompts Básica', duration: '15:00', videoUrl: 'https://www.youtube.com/embed/SChXl9k5r6E?rel=0&autoplay=1' }
            ]
        },
        {
            id: 'aim2',
            title: 'Creación de Contenido',
            lessons: [
                { id: 'ail3', title: 'Escribiendo Artículos de Blog', duration: '20:00', videoUrl: 'https://www.youtube.com/embed/SChXl9k5r6E?rel=0&autoplay=1' },
                { id: 'ail4', title: 'Guiones para Video y Redes', duration: '12:00', videoUrl: 'https://www.youtube.com/embed/SChXl9k5r6E?rel=0&autoplay=1' }
            ]
        }
    ]
  }
};

export const TrainingViewer: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const data = moduleId ? MODULES_DATA[moduleId] : null;

  // State
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);

  useEffect(() => {
      if (data && data.modules.length > 0) {
          // Default to first module open if none selected
          if (!activeModuleId) setActiveModuleId(data.modules[0].id);
          // Default to first lesson playing if none selected
          if (!currentLesson && data.modules[0].lessons.length > 0) {
              setCurrentLesson(data.modules[0].lessons[0]);
          }
      }
  }, [data]);

  const toggleModule = (id: string) => {
      setActiveModuleId(activeModuleId === id ? null : id);
  };

  if (!data) {
    return (
        <div className="flex flex-col items-center justify-center h-96 text-gray-400">
            <p className="text-xl">Módulo no encontrado.</p>
            <p className="text-sm">Selecciona un tema del menú de entrenamiento.</p>
        </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 p-4 lg:p-8">
      
      {/* Header Course Info */}
      <div className="mb-10 border-b border-gray-800 pb-10">
         <div className="flex items-center gap-3 mb-4">
            <span className="bg-primary/20 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Award className="w-3 h-3" /> Certificado
            </span>
            <span className="bg-gray-800 text-gray-300 border border-gray-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" /> {data.subtitle}
            </span>
         </div>
         <h1 className="text-4xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            {data.title}
         </h1>
         <p className="text-lg lg:text-xl text-gray-400 max-w-4xl leading-relaxed">
            {data.description}
         </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* LEFT COLUMN: MENU (Sticky & Scrollable) - WIDER (5 cols) */}
        <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="sticky top-6">
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden flex flex-col max-h-[calc(100vh-100px)]">
                    <div className="p-5 border-b border-gray-800 bg-gray-900 sticky top-0 z-10">
                        <h3 className="text-white font-bold text-lg flex items-center gap-2">
                            <PlayCircle className="w-5 h-5 text-primary" /> Temario del Curso
                        </h3>
                    </div>
                    
                    <div className="overflow-y-auto p-3 space-y-3 custom-scrollbar">
                        {data.modules.map((module) => (
                            <div key={module.id} className="border border-gray-800 rounded-xl overflow-hidden bg-gray-900 shadow-sm">
                                <button 
                                    onClick={() => toggleModule(module.id)}
                                    className={`w-full flex items-center justify-between p-5 hover:bg-gray-800 transition text-left ${activeModuleId === module.id ? 'bg-gray-800' : ''}`}
                                >
                                    <span className="font-bold text-gray-200 text-lg">{module.title}</span>
                                    {activeModuleId === module.id ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                                </button>
                                
                                {activeModuleId === module.id && (
                                    <div className="bg-black/40 border-t border-gray-800">
                                        {module.lessons.map((lesson) => (
                                            <button 
                                                key={lesson.id}
                                                onClick={() => setCurrentLesson(lesson)}
                                                className={`w-full flex items-center gap-4 p-5 text-base transition text-left border-l-4 group ${currentLesson?.id === lesson.id ? 'bg-primary/10 border-primary text-white' : 'border-transparent text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
                                            >
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition ${currentLesson?.id === lesson.id ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30' : 'bg-gray-800 text-gray-500 group-hover:bg-gray-700'}`}>
                                                    <Play className="w-4 h-4 ml-0.5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`font-medium line-clamp-2 leading-snug ${currentLesson?.id === lesson.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{lesson.title}</p>
                                                    <span className="text-sm opacity-60 font-mono mt-1.5 block">{lesson.duration}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: VIDEO PLAYER & CONTENT - NARROWER (7 cols) */}
        <div className="lg:col-span-7 order-1 lg:order-2 space-y-10">
          
          {/* Video Player */}
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800 ring-1 ring-white/10 group">
             {/* Decorative gradient behind video */}
             <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 opacity-20 blur-3xl group-hover:opacity-30 transition duration-1000"></div>
             
             {currentLesson ? (
                 <iframe 
                   key={currentLesson.id} // Key forces reload on change
                   src={currentLesson.videoUrl} 
                   className="absolute inset-0 w-full h-full z-10"
                   title={currentLesson.title}
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                   allowFullScreen 
                 ></iframe>
             ) : (
                 <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-900">
                     <div className="text-center">
                        <PlayCircle className="w-20 h-20 mx-auto mb-4 opacity-30" />
                        <p className="text-lg font-medium opacity-60">Selecciona una lección para comenzar</p>
                     </div>
                 </div>
             )}
          </div>

          {/* Current Lesson Info */}
          {currentLesson && (
              <div className="animate-in fade-in slide-in-from-top-4">
                  <h2 className="text-3xl font-bold text-white mb-3">{currentLesson.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                      <span className="flex items-center gap-1.5 bg-gray-800 px-3 py-1 rounded-full"><Clock className="w-4 h-4" /> {currentLesson.duration}</span>
                      <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500" /> Disponible</span>
                  </div>
                  <div className="h-px bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 w-full"></div>
              </div>
          )}

          {/* "Lo que aprenderás" Box */}
          <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-8 backdrop-blur-sm">
            <h3 className="text-white font-bold mb-8 flex items-center gap-3 text-xl">
              <div className="bg-green-500/20 p-2 rounded-lg"><CheckCircle className="w-6 h-6 text-green-500" /></div>
              Lo que aprenderás en este curso
            </h3>
            <ul className="grid grid-cols-1 gap-y-4">
              {data.learningPoints.map((point: string, i: number) => (
                <li key={i} className="flex items-start gap-4 text-gray-300 text-lg group">
                  <div className="mt-2 w-2 h-2 rounded-full bg-primary flex-shrink-0 shadow-[0_0_10px_rgba(99,102,241,0.5)] group-hover:scale-125 transition-transform"></div>
                  <span className="leading-relaxed group-hover:text-white transition-colors">{point}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};
