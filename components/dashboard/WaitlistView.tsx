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
        <div id="survey-container" className="flex flex-col items-center justify-center py-10 md:py-16 px-4 sm:px-6 relative z-10 w-full min-h-screen bg-black/40">
            <div className="w-full max-w-3xl relative">
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
