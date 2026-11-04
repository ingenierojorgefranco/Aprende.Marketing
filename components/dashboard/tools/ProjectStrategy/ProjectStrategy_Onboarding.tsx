import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  ExternalLink, 
  MessageCircle, 
  HelpCircle, 
  BookOpen, 
  ArrowRight, 
  Sparkles, 
  Compass, 
  ShieldCheck, 
  Globe, 
  DollarSign, 
  Zap, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { StepVideoContainer } from '../../wizard/StepVideoContainer';

interface ProjectStrategy_OnboardingProps {
  user?: any;
  isAdmin?: boolean;
  onNextStep?: () => void;
}

export const ProjectStrategy_Onboarding: React.FC<ProjectStrategy_OnboardingProps> = ({
  user,
  isAdmin,
  onNextStep
}) => {
  // Estado para el checklist de primeros pasos
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('am_onboarding_checklist');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Estado para preguntas frecuentes (FAQ)
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Estado para modal del glosario
  const [showGlosarioModal, setShowGlosarioModal] = useState(false);

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('am_onboarding_checklist', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const checklistItems = [
    { id: 'item_1', label: 'Crear o verificar tu cuenta gratuita en Hotmart', sub: 'Necesaria para afiliarte a los productos y recibir comisiones bancarias.' },
    { id: 'item_2', label: 'Unirte al canal/grupo privado de WhatsApp o Telegram', sub: 'Donde compartimos actualizaciones, tips de ventas y soporte directo.' },
    { id: 'item_3', label: 'Guardar Aprende.Marketing en los marcadores de tu navegador', sub: 'Acceso rápido a tu panel de control desde tu computadora o celular.' },
    { id: 'item_4', label: 'Ver los videos de bienvenida completos', sub: 'Te explicarán cómo funciona el sistema automático antes de lanzar tu primer producto.' }
  ];

  const faqs = [
    {
      q: '¿Necesito pagar alguna membresía en Hotmart para afiliarme a los productos?',
      a: 'No. El registro y la afiliación a los productos en Hotmart es 100% gratuita. Solo recibes una comisión cada vez que generas una venta con tu enlace de afiliado.'
    },
    {
      q: '¿Cómo y cuándo recibo las ganancias de mis ventas?',
      a: 'Las ventas se acreditan en tu saldo de Hotmart. Una vez transcurrido el periodo de garantía del producto (por lo general de 7 días), puedes retirar el dinero directamente a tu cuenta bancaria o cuenta Payoneer.'
    },
    {
      q: '¿Puedo manejar todo mi sistema desde un teléfono móvil?',
      a: 'Sí. El panel de Aprende.Marketing y la plataforma de Hotmart son 100% adaptables a celulares. Puedes revisar tus leads, copiar tus reels y enviar tus enlaces desde tu smartphone sin problemas.'
    },
    {
      q: '¿Qué ocurre si una persona ingresa a mi página pero no compra hoy?',
      a: 'Tu página de captura solicita su correo o WhatsApp. El sistema les entrega una guía gratuita y activa secuencias automáticas de seguimiento que continuarán invitándolos a comprar durante los siguientes días.'
    }
  ];

  const glosarioTerms = [
    { term: 'Hotlink', def: 'Es tu enlace único de afiliado generado por Hotmart. Cuando alguien hace clic en él, la plataforma rastrea que la venta viene de tu parte.' },
    { term: 'Lead Magnet', def: 'Un regalo digital gratuito (guía PDF, e-book, masterclass) que le entregas a tu prospecto a cambio de su correo o WhatsApp.' },
    { term: 'VSL (Video Sales Letter)', def: 'Video de ventas diseñado estratégicamente para presentar el producto, generar deseo y cerrar la venta.' },
    { term: 'Página de Captura (Landing Page)', def: 'Página web diseñada con el único objetivo de conseguir los datos de contacto de tu cliente ideal.' },
    { term: 'Comisión Neta', def: 'Monto exacto en dólares que ingresa a tu cuenta por cada cliente que compra el producto digital a través de tu enlace.' }
  ];

  const totalChecklist = checklistItems.length;
  const completedChecklist = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="space-y-6 text-left">
      
      {/* 1. Módulo de Videos Introductorios */}
      <div className="bg-[#0B1120] border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
        <StepVideoContainer 
          posterImage="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200&h=675"
          videoUrl="https://www.youtube.com/embed/vGfXD9VbfXo?rel=0&controls=1&showinfo=0"
          title="Bienvenida e Introducción al Sistema"
          stepNumber={1}
          user={user}
          isAdmin={isAdmin}
        />
      </div>

      {/* 2. Checklist de Primeros Pasos */}
      <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF5A1F]/15 border border-[#FF5A1F]/30 text-[#FF5A1F] flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white tracking-wide">
                Checklist de Primeros Pasos
              </h3>
              <p className="text-xs text-slate-400">
                Completa estas acciones iniciales antes de lanzar tu primer producto digital
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-slate-800 self-start sm:self-auto">
            <span className="text-xs font-bold text-slate-300">Progreso:</span>
            <span className="text-xs font-extrabold text-[#FF5A1F]">
              {completedChecklist} de {totalChecklist} ({Math.round((completedChecklist / totalChecklist) * 100)}%)
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {checklistItems.map((item) => {
            const isChecked = !!checkedItems[item.id];
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleCheck(item.id)}
                className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 cursor-pointer ${
                  isChecked 
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200' 
                    : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isChecked ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/10" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500 hover:text-slate-300 transition-colors" />
                  )}
                </div>
                <div className="space-y-0.5 min-w-0 flex-1">
                  <p className={`text-sm font-bold leading-snug ${isChecked ? 'line-through text-slate-400' : 'text-white'}`}>
                    {item.label}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.sub}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Tarjetas de Enlaces Rápidos y Recursos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Tarjeta 1: Registro en Hotmart */}
        <div className="bg-[#0B1120] border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-orange-500/30 transition-all shadow-lg">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <h4 className="text-base font-extrabold text-white">Plataforma Hotmart</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Crea tu cuenta gratuita de afiliado en Hotmart para afiliarte a los productos y cobrar tus comisiones.
            </p>
          </div>
          <a 
            href="https://hotmart.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-extrabold uppercase tracking-wider transition-all"
          >
            <span>Ir a Hotmart</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Tarjeta 2: Comunidad Privada */}
        <div className="bg-[#0B1120] border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-emerald-500/30 transition-all shadow-lg">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h4 className="text-base font-extrabold text-white">Comunidad VIP</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Únete a nuestro grupo exclusivo de alumnos para recibir asesoría, actualizaciones y estrategias semanales.
            </p>
          </div>
          <button 
            type="button"
            onClick={() => alert("Próximamente enlace directo al canal de soporte.")}
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer"
          >
            <span>Unirme a la Comunidad</span>
            <MessageCircle className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tarjeta 3: Glosario de Marketing */}
        <div className="bg-[#0B1120] border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:border-sky-500/30 transition-all shadow-lg">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-base font-extrabold text-white">Glosario de Marketing</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Aprende los términos más importantes (Hotlinks, Lead Magnets, VSL) para dominar tu vocabulario comercial.
            </p>
          </div>
          <button 
            type="button"
            onClick={() => setShowGlosarioModal(true)}
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer"
          >
            <span>Ver Glosario</span>
            <BookOpen className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* 4. Preguntas Frecuentes de Principiantes */}
      <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white tracking-wide">
              Preguntas Frecuentes de Principiantes
            </h3>
            <p className="text-xs text-slate-400">
              Aclara tus dudas antes de iniciar tu estrategia comercial
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx}
                className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/30 transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-white hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#FF5A1F] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/50 bg-slate-950/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Banner de Próximo Paso */}
      <div className="bg-gradient-to-r from-[#FF5A1F]/15 via-orange-950/30 to-[#0B1120] border border-[#FF5A1F]/30 p-6 sm:p-8 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5A1F]/20 text-[#FF5A1F] text-[10px] font-black uppercase tracking-wider border border-[#FF5A1F]/30">
            <Sparkles className="w-3.5 h-3.5" /> Siguiente Paso Recomendado
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
            ¿Listo para explorar la estrategia de tu producto?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Avanza al <strong className="text-white font-bold">Paso 2: Tu Estrategia Digital</strong> para conocer el producto a promocionar, la ganancia por venta y el funcionamiento de tu sistema de ventas.
          </p>
        </div>

        {onNextStep && (
          <button
            type="button"
            onClick={onNextStep}
            className="px-6 py-4 rounded-xl bg-[#FF5A1F] hover:bg-[#e04e17] text-white font-black text-sm uppercase tracking-wider flex items-center gap-2 shrink-0 shadow-lg shadow-[#FF5A1F]/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span>Ir al Paso 2</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Modal del Glosario */}
      {showGlosarioModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-sky-400">
                <BookOpen className="w-5 h-5" />
                <h3 className="font-extrabold text-white text-base">Glosario de Conceptos Clave</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGlosarioModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
              {glosarioTerms.map((g, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                  <span className="text-xs font-black text-[#FF5A1F] uppercase tracking-wider block">
                    {g.term}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {g.def}
                  </p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowGlosarioModal(false)}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Entendido / Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
