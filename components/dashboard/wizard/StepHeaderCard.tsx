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
  totalSteps = 13,
  stageNumber,
  categoryTitle,
  title,
  description,
  completedSteps,
}) => {
  const currentCompleted = completedSteps !== undefined ? completedSteps : stepNumber;
  const percentage = Math.round((currentCompleted / totalSteps) * 100);

  // Determinar la etapa según el número de paso si no se especifica
  const computedStage = stageNumber ?? (stepNumber <= 4 ? 1 : stepNumber <= 7 ? 2 : 3);

  return (
    <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Izquierda: Título y descripción */}
        <div className="space-y-1.5 text-left flex-1 min-w-0">
          <span className="text-xs sm:text-sm font-bold text-[#FF5A1F] uppercase tracking-wider block">
            {computedStage ? `ETAPA ${computedStage} · ` : ''}PASO {stepNumber} DE {totalSteps}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {title}
          </h2>
          {description && (
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal pt-1 max-w-2xl">
              {description}
            </p>
          )}
        </div>

        {/* Derecha: Barra de Progreso (Idéntica a la Imagen 2) */}
        <div className="w-full md:w-80 shrink-0 space-y-2.5 bg-slate-900/40 p-4 sm:p-5 rounded-2xl border border-slate-800/80">
          <div className="text-sm sm:text-base font-bold text-white tracking-tight">
            Progreso general
          </div>
          <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
            <span className="text-slate-300 font-sans">
              {currentCompleted} de {totalSteps} pasos completados
            </span>
            <span className="font-bold text-[#FF5A1F]">
              {percentage}%
            </span>
          </div>
          <div className="w-full bg-[#111827] h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="bg-[#FF5A1F] h-full rounded-full transition-all duration-500 shadow-[0_0_10px_#FF5A1F]"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
