import React, { useState } from 'react';
import { ArrowLeft, GripVertical, Trash2, Link as LinkIcon, RefreshCw, Type } from 'lucide-react';

interface Step3OutlineProps {
  outline: string[];
  setOutline: (newOutline: string[]) => void;
  ctaLink: string;
  setCtaLink: (val: string) => void;
  onGenerate: () => void;
  onBack: () => void;
  loading: boolean;
}

export const Step3Outline: React.FC<Step3OutlineProps> = ({
  outline, setOutline, ctaLink, setCtaLink, onGenerate, onBack, loading
}) => {
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // --- HIERARCHY HELPERS ---
  const getHeadingInfo = (text: string) => {
    if (!text || typeof text !== 'string') return { level: 2, content: "Sección sin título", tag: 'H2' };
    const match = text.match(/^(H[1-6]):\s*(.*)/i);
    if (match) {
      return {
        level: parseInt(match[1].replace('H', '')),
        content: match[2],
        tag: match[1].toUpperCase()
      };
    }
    return { level: 2, content: text, tag: 'H2' };
  };

  const getBlockSize = (startIndex: number, items: string[]): number => {
    const parentInfo = getHeadingInfo(items[startIndex]);
    let size = 1;
    for (let i = startIndex + 1; i < items.length; i++) {
      const childInfo = getHeadingInfo(items[i]);
      if (childInfo.level > parentInfo.level) {
        size++;
      } else {
        break;
      }
    }
    return size;
  };

  // --- DRAG & DROP HANDLERS ---
  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (index === 0) { e.preventDefault(); return; }
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (index === 0) {
      e.dataTransfer.dropEffect = "none";
      setDragOverIndex(null);
      return;
    }
    setDragOverIndex(index);
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    if (draggedItemIndex === null || draggedItemIndex === targetIndex) return;
    if (targetIndex === 0) return;

    const newOutline = [...outline];
    const blockSize = getBlockSize(draggedItemIndex, outline);
    const itemsToMove = newOutline.splice(draggedItemIndex, blockSize);
    
    let adjustedTargetIndex = targetIndex;
    if (draggedItemIndex < targetIndex) {
      adjustedTargetIndex -= blockSize;
    }

    newOutline.splice(adjustedTargetIndex, 0, ...itemsToMove);
    setOutline(newOutline);
    setDraggedItemIndex(null);
  };

  const handleDeleteItem = (index: number) => {
    if (index === 0) return alert("No puedes eliminar el Título Principal (H1).");
    const parentInfo = getHeadingInfo(outline[index]);
    let childrenCount = 0;
    
    for (let i = index + 1; i < outline.length; i++) {
      const childInfo = getHeadingInfo(outline[i]);
      if (childInfo.level > parentInfo.level) childrenCount++;
      else break;
    }

    if (childrenCount > 0) {
      const confirmDelete = window.confirm(
        `Este bloque contiene ${childrenCount} sub-secciones. ¿Eliminar TODO el bloque?`
      );
      if (!confirmDelete) return;
    }

    const newOutline = [...outline];
    newOutline.splice(index, 1 + childrenCount);
    setOutline(newOutline);
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
      <button onClick={onBack} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 text-sm">
        <ArrowLeft className="w-4 h-4" /> Volver
      </button>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-800 bg-gray-800/50">
          <h2 className="text-xl font-bold text-white mb-1">Estructura del Artículo</h2>
          <p className="text-sm text-gray-400">Arrastra para reordenar bloques completos.</p>
        </div>

        <div className="p-6 space-y-1">
          {outline.map((item, idx) => {
            const { level, tag } = getHeadingInfo(item);
            const indentClass = level === 1 ? '' : level === 2 ? 'ml-4' : level === 3 ? 'ml-10' : 'ml-16';
            const isDragOver = dragOverIndex === idx;
            const headingStyle = level === 1 ? 'border-l-4 border-blue-500 bg-blue-900/20' :
              level === 2 ? 'border-l-2 border-gray-600 bg-gray-800/50' :
                'border-l border-gray-700 bg-black/20';

            return (
              <div
                key={idx}
                draggable={level !== 1}
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragLeave={() => setDragOverIndex(null)}
                onDrop={(e) => handleDrop(e, idx)}
                className={`
                  relative flex items-center gap-3 p-3 rounded transition-all
                  ${indentClass} ${headingStyle}
                  ${draggedItemIndex === idx ? 'opacity-30' : ''}
                  ${isDragOver ? 'border-t-2 border-t-primary mt-1 pt-3' : 'border-gray-800 border-t border-b-0'}
                `}
              >
                <div className={`cursor-grab active:cursor-grabbing text-gray-600 hover:text-gray-300 ${level === 1 ? 'invisible' : ''}`}>
                  <GripVertical className="w-4 h-4" />
                </div>

                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider min-w-[30px] text-center
                  ${level === 1 ? 'bg-blue-600 text-white' :
                    level === 2 ? 'bg-gray-700 text-gray-200' :
                      level === 3 ? 'bg-gray-800 text-gray-400' : 'bg-transparent text-gray-500 border border-gray-700'}
                `}>
                  {tag}
                </div>

                <input
                  value={item}
                  onChange={(e) => {
                    const newOutline = [...outline];
                    newOutline[idx] = e.target.value;
                    setOutline(newOutline);
                  }}
                  className={`flex-1 bg-transparent outline-none ${level === 1 ? 'text-lg font-bold text-white' : 'text-sm text-gray-300'}`}
                />

                <button
                  onClick={() => handleDeleteItem(idx)}
                  className={`text-gray-600 hover:text-red-500 p-1 rounded transition ${level === 1 ? 'invisible' : ''}`}
                  title="Eliminar sección"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => setOutline([...outline, "H2: Nueva Sección"])}
              className="text-xs bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg flex items-center gap-1 transition"
            >
              + H2
            </button>
            <button
              onClick={() => setOutline([...outline, "H3: Nuevo Subtítulo"])}
              className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded-lg flex items-center gap-1 transition"
            >
              + H3
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-800">
            <label className="block text-sm font-medium text-gray-300 mb-2">Enlace de Llamado a la Acción (CTA)</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute top-3 left-3 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={ctaLink}
                  onChange={(e) => setCtaLink(e.target.value)}
                  className="w-full bg-black border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:border-blue-500 outline-none"
                  placeholder="https://tu-curso.com/oferta"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">La IA insertará este enlace de forma natural en el contenido.</p>
          </div>
        </div>

        <div className="p-6 bg-gray-800/30 border-t border-gray-800 flex justify-end">
          <button
            onClick={onGenerate}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition flex items-center gap-2 shadow-lg shadow-blue-900/30"
          >
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Type className="w-5 h-5" />}
            Redactar Artículo Completo
          </button>
        </div>
      </div>
    </div>
  );
};