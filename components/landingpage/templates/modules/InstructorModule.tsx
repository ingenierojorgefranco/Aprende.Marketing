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
            <div className="flex flex-col items-center text-center">
                <div className="text-center max-w-3xl mx-auto">
                    <h4 id="instructor-subtitle" className={`font-bold uppercase tracking-widest text-sm mb-2 opacity-80 ${ds.instructor.textColor}`}>{content.instructor.title || "Conoce a tu Mentor"}</h4>
                    <h2 id="instructor-name" className={`text-4xl md:text-5xl font-black mb-6 ${ds.instructor.titleColor}`}>{content.instructor.name}</h2>
                    {renderRichText(content.instructor.bio, `text-lg leading-relaxed mb-8 max-w-2xl font-light ${ds.instructor.bioColor} mx-auto`)}
                    <div className="flex flex-wrap justify-center gap-4">
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
