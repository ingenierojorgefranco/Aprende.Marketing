import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OnboardingSurvey } from './OnboardingSurvey';
import { User } from '../../types';
import { ArrowLeft } from 'lucide-react';

interface SurveyPageProps {
    user: User;
    onUpdateUser: (updatedUser: User) => void;
}

export const SurveyPage: React.FC<SurveyPageProps> = ({ user, onUpdateUser }) => {
    const { stepParam } = useParams() as { stepParam?: string };
    const navigate = useNavigate();

    // Redirect /survey to /survey/1 automatically for URL consistency
    useEffect(() => {
        if (!stepParam) {
            navigate('/survey/1', { replace: true });
        }
    }, [stepParam, navigate]);

    const handleSurveyComplete = () => {
        // Redirigir al dashboard
        navigate('/dashboard', { replace: true });
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
                    <OnboardingSurvey 
                        user={user} 
                        onComplete={handleSurveyComplete} 
                    />
                </div>
            </main>
        </div>
    );
};
