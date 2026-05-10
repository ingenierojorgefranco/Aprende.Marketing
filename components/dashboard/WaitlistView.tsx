import React from 'react';
import { motion } from 'motion/react';
import { OnboardingSurvey } from './OnboardingSurvey';

interface WaitlistViewProps {
    onComplete?: () => void;
}

export const WaitlistView: React.FC<WaitlistViewProps> = ({ onComplete }) => {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="w-full max-w-4xl relative z-10">
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
                        className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight"
                    >
                        Estás a punto de acceder a la <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                            herramienta definitiva de ventas
                        </span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-lg max-w-2xl mx-auto"
                    >
                        Para habilitar tu acceso exclusivo, necesitamos conocer un poco más sobre tu perfil y necesidades.
                    </motion.p>
                </div>

                <OnboardingSurvey onComplete={onComplete || (() => window.location.reload())} />
            </div>
        </div>
    );
};
