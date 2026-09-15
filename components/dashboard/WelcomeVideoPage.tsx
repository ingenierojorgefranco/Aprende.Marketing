import React from 'react';
import { User } from '../../types';
import { WaitlistView } from './WaitlistView';
import { api } from '../../services/api';
import { LogOut } from 'lucide-react';

interface WelcomeVideoPageProps {
    user: User;
    onLogout: () => void;
    onUpdateUser?: (updatedUser: User) => void;
}

export const WelcomeVideoPage: React.FC<WelcomeVideoPageProps> = ({ user, onLogout, onUpdateUser }) => {
    React.useEffect(() => {
        if (typeof window !== 'undefined' && localStorage.getItem(`welcome_video_seen_${user.id}`) === 'true') {
            window.location.href = '/dashboard';
        }
    }, [user.id]);

    return (
        <div className="min-h-screen bg-[#030712] text-[#FFFFFF] flex flex-col font-sans">
            {/* Header simple similar al de la imagen 1 */}
            <header className="h-20 bg-[#030712]/95 backdrop-blur-md border-b border-slate-800/60 flex items-center justify-between px-6 shrink-0 z-30">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-[#FF5A1F] rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-[#FF5A1F]/20 px-1">AM</div>
                    <h2 className="text-lg font-bold text-white tracking-tight">Aprende.<span className="text-[#FF5A1F]">Marketing</span></h2>
                </div>
                
                <div className="flex items-center gap-2.5 sm:gap-3">
                    {/* Información del Plan */}
                    <div className="flex items-center gap-2 bg-zinc-900/60 border border-white/10 rounded-full py-1.5 px-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-orange-600 to-[#FF5A1F] text-white font-black text-xs flex items-center justify-center">
                            {user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <span className="text-xs font-bold text-zinc-300">
                            {user.planLimits?.planName === 'starter' ? 'PLAN GRATUITO' : 'PLAN PRO'}
                        </span>
                    </div>

                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 py-2 px-3 sm:px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white border border-white/10 font-bold text-xs sm:text-sm transition-all duration-200 active:scale-[0.98] cursor-pointer whitespace-nowrap"
                        title="Cerrar sesión"
                    >
                        <LogOut className="w-4 h-4 shrink-0" />
                        <span>Cerrar sesión</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative">
                <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
                    <WaitlistView 
                        user={user} 
                        onUpdateUser={onUpdateUser}
                        forceSuccess={true}
                        onComplete={async () => {
                            if (typeof window !== 'undefined') {
                                localStorage.setItem(`welcome_video_seen_${user.id}`, 'true');
                            }
                            try {
                                const redirectUrl = await api.getLoginRedirect();
                                if (redirectUrl) {
                                    window.location.href = redirectUrl;
                                } else {
                                    window.location.href = "/dashboard";
                                }
                            } catch (e) {
                                window.location.href = "/dashboard";
                            }
                        }} 
                    />
                </div>
            </main>
        </div>
    );
};
