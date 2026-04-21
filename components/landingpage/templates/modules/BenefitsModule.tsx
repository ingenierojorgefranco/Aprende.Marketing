import { GeneratedPageContent, Project } from '../../../../types';
import { FeatureCard } from '../../ui/LiveComponents';

interface BenefitsModuleProps {
  content: GeneratedPageContent;
  ds: any;
  project?: Project; // Nuevo
  isMobilePreview: boolean;
  showSeparator?: boolean;
  sectionId?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  fallbackSubtitle?: string;
}

export const BenefitsModule: React.FC<BenefitsModuleProps> = ({ 
  content, 
  ds, 
  project,
  isMobilePreview, 
  showSeparator = false,
  sectionId = "beneficios",
  className = "",
  titleClassName = "",
  subtitleClassName = "",
  fallbackSubtitle = "Recibe el arsenal completo de recursos que han llevado a nuestras alumnas a facturar desde su primer mes."
}) => {
  const learningModules = project?.strategy_json?.psychology?.learningModules;
  
  // Si hay módulos en el proyecto, los usamos como beneficios
  const items = (learningModules && learningModules.length > 0)
    ? learningModules.map((m: any) => {
        const color = m.color || 'purple';
        return {
            title: m.title,
            description: m.description,
            icon: m.icon,
            color: color,
            bg: m.bg || (
                color === 'blue' ? "from-[#0f172a] via-[#0b1120] to-[#090e1a]" :
                (color === 'emerald' || color === 'green') ? "from-[#061a14] via-[#04120e] to-[#030d0a]" :
                "from-[#1a0b2e] via-[#12061d] to-[#0f041d]"
            ),
            glow: m.glow || (
                color === 'blue' ? "hover:shadow-blue-500/20" :
                (color === 'emerald' || color === 'green') ? "hover:shadow-emerald-500/20" :
                "hover:shadow-purple-500/20"
            ),
            border: m.border || "border-white/10"
        };
    })
    : content?.benefits?.items || [];

  if (items.length === 0) return null;
  const benefitsTitle = content?.benefits?.title || "Beneficios";
  const benefitsSubtitle = content?.benefits?.subtitle || fallbackSubtitle;

  return (
    <section id={sectionId} className={`py-24 ${className || ds.features.sectionBg}`}>
      <div className="w-full max-w-[75em] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 id="benefits-title" className={`text-3xl md:text-4xl font-bold mb-4 ${titleClassName || ds.features.titleColor}`}>
            {benefitsTitle}
          </h2>
          <p id="benefits-subtitle" className={`text-lg max-w-2xl mx-auto mt-4 leading-relaxed ${subtitleClassName || ds.features.descColor}`}>
            {benefitsSubtitle}
          </p>
          {showSeparator && (
            <div className={`h-1.5 w-24 rounded-full mx-auto mt-6 ${ds.blobColor}`}></div>
          )}
        </div>
        <div id="benefits-grid" className={`grid gap-8 ${isMobilePreview ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
          {items.map((item: any, idx: number) => (
            <FeatureCard key={idx} item={item} idx={idx} ds={ds} content={content} />
          ))}
        </div>
      </div>
    </section>
  );
};
