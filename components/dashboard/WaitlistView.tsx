import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { OnboardingSurvey } from './OnboardingSurvey';
import { User } from '../../types';
import { getCurrentUser } from '../../services/auth';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface WaitlistViewProps {
    user: User;
    onUpdateUser?: (updatedUser: User) => void;
    onComplete?: () => void;
}

export const WaitlistView: React.FC<WaitlistViewProps> = ({ user, onUpdateUser, onComplete }) => {
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (showSuccess) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            document.getElementById('dashboard-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [showSuccess]);

    const handleSurveyComplete = () => {
        // Just show success, delay user state update so the component doesn't unmount
        setShowSuccess(true);
    };

    const handleContinue = () => {
        if (onUpdateUser) {
            // Sincronizar silenciosamente antes de continuar
            getCurrentUser().then(updated => {
                if (updated) {
                    const formatted: User = {
                        ...user,
                        id: updated.id.toString(),
                        survey_json: (updated as any).survey_json
                    };
                    onUpdateUser(formatted);
                }
                if (onComplete) onComplete();
                else window.location.reload();
            });
        } else {
            if (onComplete) onComplete();
            else window.location.reload();
        }
    };

    if (showSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 relative z-10 w-full bg-[#030712]">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="w-full max-w-4xl relative flex flex-col items-center text-center"
                >
                    
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
                        ¡Perfecto! Ya tenemos todo para <span className="text-[#FF5A1F]">empezar</span>
                    </h1>
                    
                    <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                        Hemos configurado tu perfil con éxito. Antes de ingresar a la academia, te invitamos a ver este breve video.
                    </p>

                    <div className="w-full aspect-video rounded-2xl overflow-hidden border border-gray-800 shadow-2xl mb-10 relative bg-black">
                        {/* Aquí puedes reemplazar la URL del video de YouTube por la que desees */}
                        <iframe 
                            className="w-full h-full absolute inset-0"
                            src="https://www.youtube.com/embed/EQC_Hnqcq-o?rel=0" 
                            title="Video de Bienvenida" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowFullScreen
                        ></iframe>
                    </div>

                    <button 
                        onClick={handleContinue}
                        className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-[#FF5A1F] rounded-xl hover:bg-[#E04814] hover:scale-105 hover:shadow-lg hover:shadow-[#FF5A1F]/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5A1F] focus:ring-offset-[#030712] text-lg"
                    >
                        Comenzar mi Ruta de Aprendizaje
                        <ArrowRight className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-1" />
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div id="survey-container" className="flex flex-col items-center justify-center pb-10 md:pb-16 px-4 sm:px-6 relative z-10 w-full min-h-screen" style={{ paddingTop: '0rem' }}>
            <div className="w-full max-w-3xl relative">
                <OnboardingSurvey 
                    user={user} 
                    onComplete={handleSurveyComplete} 
                />
            </div>
        </div>
    );
};
