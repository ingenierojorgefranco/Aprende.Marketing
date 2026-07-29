import React from 'react';

interface StepHeaderCardProps {
  stepNumber: number;
  totalSteps?: number;
  stageNumber?: number;
  categoryTitle?: string;
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  completedSteps?: number;
}

export const StepHeaderCard: React.FC<StepHeaderCardProps> = ({
  stepNumber,
  totalSteps = 9,
  stageNumber,
  categoryTitle,
  title,
  description,
}) => {
  // Determinar la etapa según el número de paso si no se especifica
  const computedStage = stageNumber ?? (stepNumber <= 4 ? 1 : 2);

  return (
    <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl transition-all">
      <div className="space-y-2 text-left w-full max-w-4xl">
        <span className="text-xs sm:text-sm font-bold text-[#FF5A1F] uppercase tracking-wider block">
          {computedStage ? `ETAPA ${computedStage} · ` : ''}PASO {stepNumber} DE {totalSteps}
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {title}
        </h2>
        {description && (
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal pt-1 max-w-xl sm:max-w-2xl">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
