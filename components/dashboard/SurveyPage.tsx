import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OnboardingSurvey } from './OnboardingSurvey';
import { User } from '../../types';
import { ArrowLeft, CheckCircle2, LayoutDashboard } from 'lucide-react';
import { motion } from 'motion/react';

interface SurveyPageProps {
    user: User;
    onUpdateUser: (updatedUser: User) => void;
}

export const SurveyPage: React.FC<SurveyPageProps> = ({ user, onUpdateUser }) => {
    const { stepParam } = useParams() as { stepParam?: string };
    const navigate = useNavigate();
    const [completed, setCompleted] = useState(false);

    // Redirect /survey to /survey/1 automatically for URL consistency
    useEffect(() => {
        if (!stepParam && !completed) {
            navigate('/survey/1', { replace: true });
        }
    }, [stepParam, navigate, completed]);

    const handleSurveyComplete = () => {
        setCompleted(true);
    };

    return (
        <div className="min-h-screen bg-[#030712] text-white flex flex-col">
            {/* Header minimalista */}
            <header className="h-20 border-b border-slate-800/60 flex items-center justify-between px-6 bg-[#030712]/80 backdrop-blur-md sticky top-0 z-30 select-none">
                <button 
                    onClick={() => navigate('/dashboard')} 
                    className="flex items-center gap-2 text-zinc-400 hover:text-white font-medium transition"
                    id="survey-back-to-panel"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Volver al Panel
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-[#FF5A1F] rounded-xl flex items-center justify-center font-black text-white text-sm shrink-0">AM</div>
                    <span className="font-extrabold text-sm uppercase tracking-wider text-zinc-300">Aprende.<span className="text-[#FF5A1F]">Marketing</span></span>
                </div>
                <div className="w-24"></div> {/* Spacer for balancing layout */}
            </header>

            {/* Contenido principal */}
            <main className="flex-1 flex flex-col items-center justify-center py-10 px-4">
                <div className="w-full max-w-3xl relative">
                    {completed ? (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 md:p-12 text-center flex flex-col items-center max-w-2xl mx-auto shadow-2xl"
                        >
                            <div className="w-16 h-16 bg-[#FF5A1F]/10 text-[#FF5A1F] rounded-full flex items-center justify-center mb-6 shadow-[0_4px_20px_rgba(255,90,31,0.15)]">
                                <CheckCircle2 className="w-9 h-9" />
                            </div>

                            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4 uppercase">
                                ¡Muchísimas gracias por completar la encuesta!
                            </h1>

                            <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                                Tus respuestas han sido guardadas de forma segura. Nos servirán para personalizar todo tu itinerario académico y adecuar las recomendaciones para que puedas lograr tus metas con la mayor velocidad posible.
                            </p>

                            <button
                                onClick={() => navigate('/dashboard', { replace: true })}
                                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-250 bg-[#FF5A1F] rounded-xl hover:bg-[#E04814] hover:scale-[1.03] hover:shadow-lg hover:shadow-[#FF5A1F]/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5A1F] focus:ring-offset-[#030712] text-lg w-full sm:w-auto"
                            >
                                <LayoutDashboard className="mr-3 w-5 h-5" />
                                Ir al Panel Principal
                            </button>
                        </motion.div>
                    ) : (
                        <OnboardingSurvey 
                            user={user} 
                            onComplete={handleSurveyComplete} 
                        />
                    )}
                </div>
            </main>
        </div>
    );
};
