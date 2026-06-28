import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// New designed modular components
import { JFHeader } from './components/JFHeader';
import { HeroSection } from './components/HeroSection';
import { MetricsBar } from './components/MetricsBar';
import { MainCaseStudy } from './components/MainCaseStudy';
import { TechnologyStack } from './components/TechnologyStack';
import { Certifications } from './components/Certifications';
import { EngineeringPractices } from './components/EngineeringPractices';
import { ProfessionalExperience } from './components/ProfessionalExperience';
import { AboutAndAvailability } from './components/AboutAndAvailability';
import { CTABanner } from './components/CTABanner';
import { JFFooter } from './components/JFFooter';

export const JorgeFrancoPage: React.FC = () => {
  const { lang: urlLang } = useParams() as { lang?: string };
  const navigate = useNavigate();

  // Determine language based on URL parameter, defaulting to Spanish ('es')
  const lang: 'es' | 'en' = urlLang === 'en' ? 'en' : 'es';

  // Ensure url matches language precisely
  React.useEffect(() => {
    if (urlLang !== 'es' && urlLang !== 'en') {
      navigate('/jorge-franco/es', { replace: true });
    }
  }, [urlLang, navigate]);

  const setLang = (newLang: 'es' | 'en') => {
    navigate(`/jorge-franco/${newLang}`);
  };

  // Scroll handler for smooth navigation
  const handleScrollTo = (elementId: string) => {
    const targetId = elementId === 'proyectos' ? 'aprende-marketing-case-study' : elementId;
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white font-sans selection:bg-[#FF5A1F] selection:text-white flex flex-col relative overflow-x-hidden">
      
      {/* Background ambient glows */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-[#FF5A1F]/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-[#FFBF00]/5 rounded-full blur-[180px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[10%] w-[600px] h-[600px] bg-[#FF5A1F]/5 rounded-full blur-[200px] pointer-events-none"></div>

      {/* Header / Navigation */}
      <JFHeader onScrollTo={handleScrollTo} lang={lang} setLang={setLang} />

      {/* Main Content Area */}
      <main className="pt-16 pb-16 flex-1">
        <div className="container mx-auto px-6 max-w-7xl">
          
          {/* High Fidelity Designed Sections */}
          <HeroSection onScrollTo={handleScrollTo} lang={lang} />
          
          <MetricsBar lang={lang} />
          
          <AboutAndAvailability lang={lang} />
          
          <MainCaseStudy lang={lang} />
          
          <TechnologyStack lang={lang} />
          
          <Certifications lang={lang} />
          
          <EngineeringPractices lang={lang} />
          
          <ProfessionalExperience lang={lang} />
          
          <CTABanner lang={lang} />

        </div>
      </main>

      {/* Footer */}
      <JFFooter lang={lang} />
    </div>
  );
};
