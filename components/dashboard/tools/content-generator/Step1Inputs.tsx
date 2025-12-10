
import React from 'react';
import { Project, LandingPage } from '../../../../types';
import { Briefcase, Globe, BookOpen, Wand2, Search, RefreshCw, Sparkles } from 'lucide-react';

interface Step1InputsProps {
  userProjects: Project[];
  selectedProject: string;
  onSelectProject: (id: string) => void;
  userPages: LandingPage[];
  selectedPageId: string;
  onSelectPage: (id: string) => void;
  topic: string;
  setTopic: (val: string) => void;
  objective: string;
  setObjective: (val: string) => void;
  keyword: string;
  setKeyword: (val: string) => void;
  onGenerate: () => void;
  loading: boolean;
}

export const Step1Inputs: React.FC<Step1InputsProps> = ({
  userProjects, selectedProject, onSelectProject,
  userPages, selectedPageId, onSelectPage,
  topic, setTopic,
  objective, setObjective,
  keyword, setKeyword,
  onGenerate, loading
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">Generador de Artículos IA</h2>
        <p className="text-gray-400">Crea contenido optimizado para tu blog en segundos.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 border-dashed">
          <label className="block text-xs font-bold text-white mb-2 flex items-center gap-2">
            <Briefcase className="w-3 h-3 text-primary" /> Contexto (Proyecto)
          </label>
          <select
            value={selectedProject}
            onChange={(e) => onSelectProject(e.target.value)}
            className="w-full bg-black border border-gray-600 rounded-lg px-3 py-2 text-white outline-none focus:border-primary text-sm"
          >
            <option value="">-- Ninguno --</option>
            {userProjects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 border-dashed">
          <label className="block text-xs font-bold text-white mb-2 flex items-center gap-2">
            <Globe className="w-3 h-3 text-green-400" /> Publicar en (Landing Page)
          </label>
          <select
            value={selectedPageId}
            onChange={(e) => onSelectPage(e.target.value)}
            className="w-full bg-black border border-gray-600 rounded-lg px-3 py-2 text-white outline-none focus:border-green-500 text-sm"
          >
            <option value="">-- Sin vincular --</option>
            {userPages.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Tema o Título Tentativo</label>
          <div className="relative">
            <BookOpen className="absolute top-3.5 left-4 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-black border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 outline-none transition"
              placeholder="Ej: Tendencias de Microblading 2024"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Objetivo del Artículo</label>
          <div className="relative">
            <Wand2 className="absolute top-3.5 left-4 w-5 h-5 text-gray-500" />
            <select
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full bg-black border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 outline-none transition appearance-none cursor-pointer"
            >
              <option value="" disabled>-- Selecciona un objetivo --</option>
              <option value="Atraer Tráfico (SEO Informativo)">Atraer Tráfico (SEO Informativo)</option>
              <option value="Venta Directa (Copy Persuasivo)">Venta Directa (Copy Persuasivo)</option>
              <option value="Captación de Leads (Lead Magnet)">Captación de Leads (Lead Magnet)</option>
              <option value="Redirigir a Landing Page (Página Puente)">Redirigir a Landing Page (Página Puente)</option>
              <option value="Romper Objeciones (FAQ)">Romper Objeciones (FAQ)</option>
              <option value="Autoridad / Branding">Autoridad / Branding</option>
              <option value="Storytelling / Caso de Éxito">Storytelling / Caso de Éxito</option>
              <option value="Review / Reseña de Producto">Review / Reseña de Producto</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Palabra Clave Objetivo (SEO)</label>
          <div className="relative">
            <Search className="absolute top-3.5 left-4 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-black border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 outline-none transition"
              placeholder="Ej: curso de microblading online"
            />
          </div>
        </div>

        <button
          onClick={onGenerate}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
        >
          {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          Generar Ideas de Títulos
        </button>
      </div>
    </div>
  );
};
