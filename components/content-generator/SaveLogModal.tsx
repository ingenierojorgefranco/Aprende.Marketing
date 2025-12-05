import React from 'react';
import { RefreshCw, Check, AlertTriangle } from 'lucide-react';

interface SaveLogModalProps {
  isOpen: boolean;
  saveStatus: 'idle' | 'saving' | 'success' | 'error';
  saveLogs: string[];
  onClose: () => void;
  onRetry: () => void;
}

export const SaveLogModal: React.FC<SaveLogModalProps> = ({
  isOpen, saveStatus, saveLogs, onClose, onRetry
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
          <h3 className="font-bold text-white flex items-center gap-2">
            {saveStatus === 'saving' && <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />}
            {saveStatus === 'success' && <Check className="w-4 h-4 text-green-500" />}
            {saveStatus === 'error' && <AlertTriangle className="w-4 h-4 text-red-500" />}
            {saveStatus === 'saving' ? 'Guardando Artículo...' : saveStatus === 'success' ? '¡Guardado Exitoso!' : 'Error al Guardar'}
          </h3>
        </div>

        <div className="p-4 bg-black font-mono text-xs h-64 overflow-y-auto space-y-1">
          {saveLogs.map((log, i) => (
            <div key={i} className={`${log.includes('ERROR') ? 'text-red-400' : log.includes('Éxito') ? 'text-green-400' : 'text-gray-400'} break-all whitespace-pre-wrap`}>
              {log}
            </div>
          ))}
          {/* Auto-scroll helper can be added here if needed */}
        </div>

        <div className="p-4 bg-gray-800 border-t border-gray-700 flex justify-end gap-3">
          {saveStatus === 'error' && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={onRetry}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition text-sm flex items-center gap-2"
              >
                <RefreshCw className="w-3 h-3" /> Reintentar
              </button>
            </>
          )}
          {saveStatus === 'success' && (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-bold transition text-sm"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};