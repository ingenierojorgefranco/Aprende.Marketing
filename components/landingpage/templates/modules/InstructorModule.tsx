
import React from 'react';
import { GeneratedPageContent } from '../../../../types';
import { Award, Users, Star } from 'lucide-react';
import { renderRichText } from '../../utils';

interface InstructorModuleProps {
  content: GeneratedPageContent;
  ds: any;
  isMobilePreview: boolean;
}

export const InstructorModule: React.FC<InstructorModuleProps> = ({ content, ds, isMobilePreview }) => {
  return (
    <section id="instructor" className={`py-24 relative overflow-hidden ${ds.instructor.sectionBg}`}>
         <div className={`absolute top-1/2 left-0 md:left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] ${ds.blobOpacity} ${ds.blobColor}`}></div>
         <div className="w-full max-w-[75em] mx-auto px-6 relative z-10">
            <div className={`flex flex-col items-center gap-12 ${isMobilePreview ? '' : 'md:flex-row md:gap-20'}`}>
                <div className="relative group shrink-0">
                     <div className={`absolute inset-0 rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-500 ${ds.blobColor}`}></div>
                     <div className={`relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 shadow-2xl z-10 ${ds.instructor.badgeBorder}`}>
                        <img id="instructor-image" src={content.instructor.imageUrl || "https://ceslava.s3-accelerate.amazonaws.com/2016/04/mistery-man-gravatar-wordpress-avatar-persona-misteriosa-510x510.png"} alt="Instructor" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                     </div>
                     <div id="instructor-badge" className={`absolute bottom-4 right-4 z-20 backdrop-blur-md border p-3 rounded-2xl shadow-lg flex items-center gap-2 ${ds.instructor.badgeBg} ${ds.instructor.badgeBorder}`}>
                         <Award className={`w-6 h-6 ${ds.decorations.starColor}`} />
                         <div>
                             <p className={`text-[10px] uppercase font-bold tracking-wider ${ds.instructor.badgeText}`}>{content.instructor.badgeText || "Top Rated"}</p>
                             <p className={`text-xs opacity-80 ${ds.instructor.badgeText}`}>{content.instructor.badgeSubtext || "Mentor 2024"}</p>
                         </div>
                     </div>
                </div>
                <div className={`text-center flex-1 ${isMobilePreview ? '' : 'md:text-left'}`}>
                    <h4 id="instructor-subtitle" className={`font-bold uppercase tracking-widest text-sm mb-2 opacity-80 ${ds.instructor.textColor}`}>{content.instructor.title || "Conoce a tu Mentor"}</h4>
                    <h2 id="instructor-name" className={`text-4xl md:text-6xl font-black mb-6 ${ds.instructor.titleColor}`}>{content.instructor.name}</h2>
                    {renderRichText(content.instructor.bio, `text-lg leading-relaxed mb-8 max-w-2xl font-light ${ds.instructor.bioColor} ${isMobilePreview ? 'mx-auto' : 'mx-auto md:mx-0'}`)}
                    <div className={`flex flex-wrap justify-center gap-4 ${isMobilePreview ? '' : 'md:justify-start'}`}>
                        <div className={`border px-6 py-3 rounded-full flex items-center gap-3 ${ds.instructor.statBg} ${ds.instructor.statBorder}`}>
                            <Users className={`w-5 h-5 ${ds.instructor.statLabelColor}`} />
                            <span className={`font-bold ${ds.instructor.statValueColor}`}>{content.instructor.statsStudents || "5k+ Alumnos"}</span>
                        </div>
                        <div className={`border px-6 py-3 rounded-full flex items-center gap-3 ${ds.instructor.statBg} ${ds.instructor.statBorder}`}>
                            <Star className={`w-5 h-5 ${ds.decorations.starColor}`} />
                            <span className={`font-bold ${ds.instructor.statValueColor}`}>{content.instructor.statsRating || "4.9/5 Rating"}</span>
                        </div>
                    </div>
                </div>
            </div>
         </div>
    </section>
  );
};
