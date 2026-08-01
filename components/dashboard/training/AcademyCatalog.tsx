import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, PlayCircle, BookOpen, Clock, Award, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { api } from '../../../services/api';

export const AcademyCatalog: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        const data = await api.getCoursesList();
        setCourses(data || []);
      } catch (e) {
        console.error("Error loading academy courses:", e);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  return (
    <div className="min-h-full bg-[#030712] text-white p-6 md:p-10 space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900/90 to-[#FF5A1F]/10 border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <GraduationCap className="w-64 h-64 text-[#FF5A1F]" />
        </div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#FF5A1F] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academia de Entrenamiento</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Cursos y Masterclasses
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed font-normal">
            Aprende paso a paso las estrategias comprobadas de marketing digital, creación de productos e inteligencia artificial para escalar tu negocio digital.
          </p>
        </div>
      </div>

      {/* Course Cards Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
          <Loader2 className="w-10 h-10 text-[#FF5A1F] animate-spin" />
          <p className="text-sm font-medium">Cargando catálogo de la academia...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-slate-500">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">No hay cursos disponibles aún</h3>
          <p className="text-slate-400 text-sm">Próximamente agregaremos nuevos módulos de entrenamiento a la academia.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {courses.map((course) => {
            const thumbnail = course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80";
            return (
              <div
                key={course.id || course.slug}
                onClick={() => navigate(`/dashboard/training/${course.slug}`)}
                className="group relative bg-slate-900/80 border border-slate-800 hover:border-[#FF5A1F]/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-[#FF5A1F]/10 transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
              >
                {/* Image & Badge Header */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                  <img
                    src={thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[11px] font-bold text-[#FF5A1F] flex items-center gap-1.5 uppercase tracking-wider">
                    <Award className="w-3.5 h-3.5" />
                    <span>{course.badge_text || course.subtitle || "Curso"}</span>
                  </div>

                  {/* Play Overlay Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs">
                    <div className="w-14 h-14 bg-[#FF5A1F] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#FF5A1F]/40 transform group-hover:scale-110 transition-transform">
                      <PlayCircle className="w-8 h-8 ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#FF5A1F]" />
                      <span>{course.subtitle || "Entrenamiento Paso a Paso"}</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-white group-hover:text-[#FF5A1F] transition-colors leading-snug">
                      {course.title}
                    </h2>
                    {course.description && (
                      <p className="text-slate-400 text-xs md:text-sm line-clamp-3 leading-relaxed font-normal">
                        {course.description}
                      </p>
                    )}
                  </div>

                  {/* Footer Action */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-[#FF5A1F] group-hover:text-white transition-colors">
                    <span className="flex items-center gap-1.5">
                      <PlayCircle className="w-4 h-4 text-[#FF5A1F]" /> Acceder al Curso
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
