import React from 'react';
import { motion } from 'motion/react';
import { OnboardingSurvey } from './OnboardingSurvey';
import { User } from '../../types';
import { getCurrentUser } from '../../services/auth';

interface WaitlistViewProps {
    user: User;
    onUpdateUser?: (updatedUser: User) => void;
    onComplete?: () => void;
}

export const WaitlistView: React.FC<WaitlistViewProps> = ({ user, onUpdateUser, onComplete }) => {
    return (
        <div id="survey-container" className="flex flex-col items-center justify-start pb-20 px-6 sm:px-12 relative z-10 w-full min-h-screen">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="w-full max-w-5xl relative">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6"
                    >
                        <span className="text-emerald-500 text-sm font-black uppercase tracking-widest">¡Felicidades por registrarte!</span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 uppercase px-2"
                        style={{ lineHeight: '1.2em' }}
                    >
                        Estás a punto de acceder a una plataforma diseñada para <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600">
                            ayudarte a construir y automatizar tu negocio digital con IA
                        </span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white text-xl md:text-2xl font-medium max-w-3xl mx-auto opacity-90"
                    >
                        Antes de comenzar, queremos entender tu perfil para personalizar tu experiencia dentro de la plataforma.
                    </motion.p>
                </div>

                <OnboardingSurvey 
                    user={user} 
                    onComplete={() => {
                        if (onUpdateUser) {
                            // Sincronizar silenciosamente y recargar
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
                    }} 
                />
            </div>
        </div>
    );
};
