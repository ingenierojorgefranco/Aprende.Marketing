import React from 'react';

interface TechItem {
  name: string;
  icon: React.ReactNode;
}

interface MainTechnologiesProps {
  lang: 'es' | 'en';
}

export const MainTechnologies: React.FC<MainTechnologiesProps> = ({ lang }) => {
  const techs: TechItem[] = [
    {
      name: 'React',
      icon: (
        <svg viewBox="0 0 100 100" className="w-8 h-8 text-[#61DAFB] fill-none stroke-current stroke-2" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="50" rx="8" ry="20" transform="rotate(0 50 50)" />
          <ellipse cx="50" cy="50" rx="8" ry="20" transform="rotate(60 50 50)" />
          <ellipse cx="50" cy="50" rx="8" ry="20" transform="rotate(120 50 50)" />
          <circle cx="50" cy="50" r="4" className="fill-current" />
        </svg>
      )
    },
    {
      name: 'TypeScript',
      icon: (
        <svg viewBox="0 0 100 100" className="w-8 h-8 text-[#3178C6] fill-current" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="80" height="80" rx="8" />
          <text x="85" y="80" textAnchor="end" fontSize="32" fontWeight="bold" fill="white" fontFamily="sans-serif">TS</text>
        </svg>
      )
    },
    {
      name: 'Node.js',
      icon: (
        <svg viewBox="0 0 100 100" className="w-8 h-8 text-[#339933] fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 15L80 32.5V67.5L50 85L20 67.5V32.5L50 15Z" className="stroke-[#339933] stroke-[6] fill-none" />
          <path d="M50 25L71 37V63L50 75L29 63V37L50 25Z" />
        </svg>
      )
    },
    {
      name: 'MySQL',
      icon: (
        <svg viewBox="0 0 100 100" className="w-8 h-8 text-[#00758F]" xmlns="http://www.w3.org/2000/svg">
          {/* Stylized MySQL Dolphin silhouette / waves */}
          <path d="M15 50 C25 25, 60 15, 80 35 C65 30, 50 35, 45 45 C40 55, 55 60, 40 75 C30 85, 20 70, 15 50" fill="#00758F" />
          <path d="M80 35 C70 45, 65 60, 75 75 C60 70, 50 75, 40 75" stroke="#F29111" strokeWidth="4" fill="none" />
        </svg>
      )
    },
    {
      name: 'Google Cloud',
      icon: (
        <svg viewBox="0 0 100 100" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
          {/* Beautiful layered GCP hexagon/cloud path */}
          <path d="M50 12 L83 31 L83 69 L50 88 L17 69 L17 31 Z" fill="none" stroke="#4285F4" strokeWidth="6" />
          <path d="M50 25 L72 38 L72 62 L50 75 L28 62 L28 38 Z" fill="#4285F4" opacity="0.15" />
          <circle cx="50" cy="50" r="12" fill="#EA4335" />
          <circle cx="35" cy="58" r="8" fill="#FBBC05" />
          <circle cx="65" cy="58" r="8" fill="#34A853" />
        </svg>
      )
    },
    {
      name: 'Docker',
      icon: (
        <svg viewBox="0 0 100 100" className="w-8 h-8 text-[#2496ED] fill-current" xmlns="http://www.w3.org/2000/svg">
          {/* Docker whale and containers */}
          <rect x="25" y="25" width="10" height="10" rx="1" />
          <rect x="38" y="25" width="10" height="10" rx="1" />
          <rect x="51" y="25" width="10" height="10" rx="1" />
          <rect x="38" y="12" width="10" height="10" rx="1" />
          <path d="M10 50 C20 45, 30 55, 45 55 C65 55, 75 40, 85 45 C90 47, 92 52, 90 58 C85 68, 65 68, 45 68 C25 68, 12 60, 10 50 Z" />
          <path d="M85 45 C87 40, 92 38, 95 42" stroke="#2496ED" strokeWidth="3" fill="none" />
        </svg>
      )
    },
    {
      name: 'Git',
      icon: (
        <svg viewBox="0 0 100 100" className="w-8 h-8 text-[#F05032] fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M89 45 L55 11 C51 7, 45 7, 41 11 L11 41 C7 45, 7 51, 11 55 L45 89 C49 93, 55 93, 59 89 L89 59 C93 55, 93 49, 89 45 Z" />
          <circle cx="50" cy="50" r="8" fill="white" />
          <circle cx="35" cy="65" r="8" fill="white" />
          <circle cx="50" cy="30" r="8" fill="white" />
          <line x1="35" y1="65" x2="50" y2="50" stroke="white" strokeWidth="6" />
          <line x1="50" y1="50" x2="50" y2="30" stroke="white" strokeWidth="6" />
        </svg>
      )
    },
    {
      name: 'Gemini API',
      icon: (
        <svg viewBox="0 0 100 100" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gemini-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9BC5FF" />
              <stop offset="50%" stopColor="#2B66FF" />
              <stop offset="100%" stopColor="#FF85A7" />
            </linearGradient>
          </defs>
          <path d="M50 10 C50 35, 65 50, 90 50 C65 50, 50 65, 50 90 C50 65, 35 50, 10 50 C35 50, 50 35, 50 10 Z" fill="url(#gemini-grad)" />
          <path d="M75 25 C75 33, 80 37, 88 37 C80 37, 75 41, 75 49 C75 41, 70 37, 62 37 C70 37, 75 33, 75 25 Z" fill="#9BC5FF" />
        </svg>
      )
    },
    {
      name: 'Stripe',
      icon: (
        <svg viewBox="0 0 100 100" className="w-8 h-8 text-[#635BFF] fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M45 15 C30 15, 20 22, 20 34 C20 50, 45 46, 45 56 C45 61, 38 64, 30 64 C20 64, 15 58, 15 52 L15 51 C15 48, 11 48, 11 51 L11 53 C11 65, 22 70, 31 70 C48 70, 58 63, 58 50 C58 34, 32 38, 32 28 C32 24, 38 21, 45 21 C52 21, 58 25, 58 30 L58 31 C58 34, 62 34, 62 31 L62 29 C62 19, 52 15, 45 15 Z" />
          <rect x="75" y="15" width="10" height="55" rx="3" />
        </svg>
      )
    },
    {
      name: 'Tailwind CSS',
      icon: (
        <svg viewBox="0 0 100 100" className="w-8 h-8 text-[#38BDF8] fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M25 50 C25 35, 45 30, 55 45 C60 52, 65 55, 75 55 C75 70, 55 75, 45 60 C40 53, 35 50, 25 50 Z" />
          <path d="M10 35 C10 20, 30 15, 40 30 C45 37, 50 40, 60 40 C60 55, 40 60, 30 45 C25 38, 20 35, 10 35 Z" opacity="0.6" />
        </svg>
      )
    }
  ];

  return (
    <section className="mb-24 relative z-10 text-left">
      {/* Title with orange vertical bar accent */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-6 bg-[#FF5A1F] rounded-full"></div>
        <h2 className="text-2xl font-black text-white tracking-tight uppercase">
          {lang === 'es' ? 'TECNOLOGÍAS PRINCIPALES' : 'MAIN TECHNOLOGIES'}
        </h2>
      </div>

      {/* Grid of 10 Technologies with logos - 2 rows of 5 on md+ screens */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {techs.map((tech, idx) => (
          <div 
            key={idx} 
            className="bg-[#111111] border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 hover:border-white/10 hover:bg-white/[0.02] transition-all duration-300 group hover:-translate-y-1 shadow-lg shadow-black/20"
          >
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
              {tech.icon}
            </div>
            <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
