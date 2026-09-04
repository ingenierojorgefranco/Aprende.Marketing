const fs = require('fs');
let content = fs.readFileSync('components/dashboard/DashboardHome.tsx', 'utf8');

const jsxPattern = /\{academyCourses\.map\(course => \([\s\S]*?\)\)\}/;
const jsxReplacement = `{academyCourses.map((course) => {
                          const thumbnail = course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80";
                          return (
                              <div
                                  key={course.id || course.slug}
                                  onClick={() => navigate(\`/dashboard/training/\${course.slug}\`)}
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
                      })}`;

content = content.replace(jsxPattern, jsxReplacement);

const gridPattern = /<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">/;
const gridReplacement = `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">`;
content = content.replace(gridPattern, gridReplacement);

fs.writeFileSync('components/dashboard/DashboardHome.tsx', content);
console.log("Replaced grid and jsx!");
