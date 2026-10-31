import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { OnboardingSurvey } from './OnboardingSurvey';
import { User } from '../../types';
import { getCurrentUser } from '../../services/auth';
import { CheckCircle2, ArrowRight, MessageCircle, ExternalLink, Youtube } from 'lucide-react';

interface WaitlistViewProps {
    user: User;
    onUpdateUser?: (updatedUser: User) => void;
    onComplete?: () => void;
    forceSuccess?: boolean;
}

export const WaitlistView: React.FC<WaitlistViewProps> = ({ user, onUpdateUser, onComplete, forceSuccess }) => {
    const [showSuccess, setShowSuccess] = useState(forceSuccess || false);

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
            <div className="flex flex-col items-center justify-start min-h-screen px-4 py-6 md:py-10 relative z-10 w-full bg-[#030712]">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="w-full max-w-[50rem] relative flex flex-col items-center text-center"
                >
                    
                    <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-2">
                        YA ESTAMOS LISTOS <span className="text-[#FF5A1F]">PARA EMPEZAR</span>
                    </h1>
                    
                    <p className="text-gray-400 text-sm md:text-base mb-6 max-w-xl mx-auto">
                        Antes de continuar te invitamos a ver este breve video.
                    </p>
 
                    <div className="w-full aspect-video rounded-2xl overflow-hidden border border-gray-800 shadow-2xl mb-6 relative bg-black">
                        {/* Aquí puedes reemplazar la URL del video de YouTube por la que desees */}
                        <iframe 
                            className="w-full h-full absolute inset-0"
                            src="https://www.youtube.com/embed/EQC_Hnqcq-o?rel=0&modestbranding=1&iv_load_policy=3&fs=0&cc_load_policy=0" 
                            title="Video de Bienvenida" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowFullScreen
                        ></iframe>
                    </div>
 
                    <div className="flex flex-col items-center gap-3.5 w-full max-w-md">
                        <button 
                            onClick={handleContinue}
                            className="w-full group relative inline-flex items-center justify-center px-6 py-4 font-bold text-white transition-all duration-200 bg-[#FF5A1F] rounded-xl hover:bg-[#E04814] hover:scale-105 hover:shadow-lg hover:shadow-[#FF5A1F]/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5A1F] focus:ring-offset-[#030712] text-base cursor-pointer"
                        >
                            CREAR MI PROYECTO DIGITAL
                            <ArrowRight className="ml-2.5 w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </button>

                        <a 
                            href="https://chat.whatsapp.com/Kbi49MLX7Nt5nrcnhGUia1?s=cl&p=a&mlu=4&ilr=4"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full group relative inline-flex items-center justify-center px-6 py-3.5 font-bold text-emerald-400 hover:text-white transition-all duration-200 bg-emerald-500/15 hover:bg-emerald-600 border border-emerald-500/30 hover:border-emerald-500 rounded-xl hover:scale-105 hover:shadow-lg hover:shadow-emerald-600/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 text-sm sm:text-base cursor-pointer"
                        >
                            <MessageCircle className="mr-2.5 w-5 h-5 text-emerald-400 group-hover:text-white transition-colors" />
                            Únete a nuestro grupo de WhatsApp
                            <ExternalLink className="ml-2 w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                        </a>

                        <a 
                            href="https://www.youtube.com/@Jorgefranpuntoco?sub_confirmation=1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full group relative inline-flex items-center justify-center px-6 py-3.5 font-bold text-blue-400 hover:text-white transition-all duration-200 bg-blue-600/20 hover:bg-blue-600 border border-blue-500/40 hover:border-blue-500 rounded-xl hover:scale-105 hover:shadow-lg hover:shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm sm:text-base cursor-pointer"
                        >
                            <Youtube className="mr-2.5 w-5 h-5 text-blue-400 group-hover:text-white transition-colors" />
                            Suscríbete a YouTube para clases gratuitas
                            <ExternalLink className="ml-2 w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                        </a>
                    </div>
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
