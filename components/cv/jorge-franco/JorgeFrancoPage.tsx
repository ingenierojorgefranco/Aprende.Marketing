import React from 'react';

// New designed modular components
import { JFHeader } from './components/JFHeader';
import { HeroSection } from './components/HeroSection';
import { MetricsBar } from './components/MetricsBar';
import { MainCaseStudy } from './components/MainCaseStudy';
import { TechnologyStack } from './components/TechnologyStack';
import { HighLevelArchitecture } from './components/HighLevelArchitecture';
import { EngineeringPractices } from './components/EngineeringPractices';
import { ProfessionalExperience } from './components/ProfessionalExperience';
import { AboutAndAvailability } from './components/AboutAndAvailability';
import { CTABanner } from './components/CTABanner';
import { JFFooter } from './components/JFFooter';

export const JorgeFrancoPage: React.FC = () => {
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
      <JFHeader onScrollTo={handleScrollTo} />

      {/* Main Content Area */}
      <main className="pt-28 pb-16 flex-1">
        <div className="container mx-auto px-6 max-w-7xl">
          
          {/* High Fidelity Designed Sections */}
          <HeroSection onScrollTo={handleScrollTo} />
          
          <MetricsBar />
          
          <AboutAndAvailability />
          
          <MainCaseStudy />
          
          <TechnologyStack />
          
          <HighLevelArchitecture />
          
          <EngineeringPractices />
          
          <ProfessionalExperience />
          
          <CTABanner />

        </div>
      </main>

      {/* Footer */}
      <JFFooter />
    </div>
  );
};
