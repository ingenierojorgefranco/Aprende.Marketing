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
  completedSteps,
}) => {
  // Determinar la etapa según el número de paso si no se especifica
  const computedStage = stageNumber ?? (stepNumber <= 4 ? 1 : 2);
  const currentCompleted = completedSteps ?? stepNumber;
  const percentage = Math.min(100, Math.max(0, Math.round((currentCompleted / totalSteps) * 100)));

  return (
    <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 text-left w-full">
        {/* Información del paso */}
        <div className="space-y-2 text-left flex-1 max-w-3xl">
          <span className="text-xs sm:text-sm font-bold text-[#FF5A1F] uppercase tracking-wider block">
            {computedStage ? `ETAPA ${computedStage} · ` : ''}PASO {stepNumber} DE {totalSteps}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {title}
          </h2>
          {description && (
            <p className="text-slate-200 text-base sm:text-lg leading-relaxed font-normal pt-1 max-w-2xl sm:max-w-3xl">
              {description}
            </p>
          )}
        </div>

        {/* Tarjeta compacta de progreso */}
        <div className="bg-[#070C18]/90 border border-slate-800/80 rounded-2xl p-4 sm:p-5 w-full md:w-64 shrink-0 shadow-inner space-y-2 text-left">
          <div className="text-xs sm:text-sm font-medium text-slate-200">
            {currentCompleted} de {totalSteps} pasos completados
          </div>

          <div className="w-full h-2 bg-slate-800/90 rounded-full overflow-hidden my-2">
            <div 
              className="h-full bg-[#FF5A1F] rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="text-xs text-slate-400 font-medium">
            {percentage}% completado
          </div>
        </div>
      </div>
    </div>
  );
};
