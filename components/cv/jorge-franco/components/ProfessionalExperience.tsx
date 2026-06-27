import React from 'react';
import { MapPin, Briefcase, Clock, Calendar } from 'lucide-react';

interface ProfessionalExperienceProps {
  lang: 'es' | 'en';
}

export const ProfessionalExperience: React.FC<ProfessionalExperienceProps> = ({ lang }) => {
  const experiences = lang === 'es' ? [
    {
      period: 'Jul. 2025 - Actualidad',
      duration: '1 año',
      company: 'Aprende.Marketing',
      role: 'Founder & Full-Stack Product Engineer',
      location: 'Málaga, España · Híbrido',
      desc: 'Diseño y desarrollo integral de Aprende.Marketing, una plataforma SaaS que automatiza la creación y gestión de activos de marketing mediante inteligencia artificial generativa.',
      highlights: [
        'Desarrollo completo del frontend (React + TypeScript) y backend (Node.js + Express).',
        'Diseño de arquitectura relacional y optimización de consultas en MySQL/Cloud SQL.',
        'Pipeline generativo multi-etapa con Gemini API para producir contenidos de venta.',
        'Arquitectura multi-tenant con resolución de dominios personalizados y aislamiento de datos.',
        'Integraciones de pago recurrentes con Stripe y Hotmart mediante webhooks.',
        'Contenerización con Docker y despliegue de servicios en Google Cloud Run.'
      ],
      stack: ['React', 'TypeScript', 'Node.js', 'Express', 'MySQL', 'Docker', 'Google Cloud Run', 'Gemini API', 'Stripe', 'Hotmart']
    },
    {
      period: 'Ago. 2019 - May. 2025',
      duration: '5 años 10 meses',
      company: 'Seminarios.Online®',
      role: 'Technical Mentor | Web Development & Marketing Automation',
      location: 'En remoto',
      desc: 'Formación y acompañamiento técnico a profesionales en la construcción de páginas web, embudos de conversión y sistemas de automatización de marketing.',
      highlights: [
        'Mentoría técnica a más de 250 participantes en desarrollo web, automatización y ecosistemas digitales.',
        'Formación en construcción de sitios orientados al rendimiento (Core Web Vitals), conversión y UX.',
        'Capacitación en diseño de embudos de venta, email marketing y automatización de procesos.'
      ],
      stack: ['Desarrollo Web', 'Automatización de Marketing', 'Gestión de Leads', 'Google Ads', 'Meta Ads']
    },
    {
      period: 'Abr. 2023 - Mar. 2025',
      duration: '2 años',
      company: 'GF Publicidad',
      role: 'Full-Stack Developer & Technical SEO Specialist',
      location: 'Sevilla, España · Presencial',
      desc: 'Desarrollo, optimización y mantenimiento técnico de soluciones web para una cartera de más de 40 cuentas corporativas.',
      highlights: [
        'Desarrollo de sitios web, funcionalidades y componentes personalizados en WordPress y PHP.',
        'Optimización exhaustiva de rendimiento, tiempos de carga y Core Web Vitals.',
        'Implementación de datos estructurados (JSON-LD) para optimizar el rastreo e indexación SEO.'
      ],
      stack: ['PHP', 'WordPress', 'SEO Técnico', 'Core Web Vitals', 'JSON-LD', 'Rendimiento']
    },
    {
      period: 'Nov. 2021 - Feb. 2023',
      duration: '1 año 4 meses',
      company: 'Viajero.Digital',
      role: 'Founder & Digital Business Instructor',
      location: 'En remoto',
      desc: 'Creación y dirección de un programa de formación orientado a ayudar a emprendedores a estructurar y comercializar negocios digitales.',
      highlights: [
        'Diseño e instrucción de sesiones prácticas sobre creación de sitios profesionales mediante WordPress.',
        'Formación en marketing de afiliación, email marketing y embudos de conversión.',
        'Estrategias de captación de leads mediante Google Ads, Meta Ads y canales orgánicos.'
      ],
      stack: ['WordPress', 'Marketing de Afiliación', 'Email Marketing', 'Google Ads', 'Meta Ads']
    },
    {
      period: 'Mar. 2017 - Jun. 2022',
      duration: '5 años 4 meses',
      company: 'Habitaci.com - Ingecolint.com',
      role: 'Technical Product Manager & Full-Stack Developer',
      location: 'Presencial',
      desc: 'Dirección técnica y evolución de una plataforma digital para la gestión y comercialización de alquileres de corta estancia.',
      highlights: [
        'Definición, priorización de backlog y seguimiento de funcionalidades de producto.',
        'Diseño y optimización de flujos operativos para propiedades, reservas, clientes y captación.',
        'Desarrollo de funcionalidades clave y automatización de flujos de trabajo comerciales.'
      ],
      stack: ['Gestión de Productos', 'Desarrollo Web', 'Automatizaciones', 'CRM']
    },
    {
      period: 'Ene. 2011 - Oct. 2021',
      duration: '10 años 10 meses',
      company: 'Aerorutas.com',
      role: 'Senior Web Developer & Technical SEO Lead',
      location: 'Presencial',
      desc: 'Desarrollo y evolución de la infraestructura tecnológica utilizada para comercializar tiquetes aéreos, reservas y planes turísticos.',
      highlights: [
        'Diseño y desarrollo de un CRM a medida para la gestión de clientes, cotizaciones y reservas.',
        'Integración con Amadeus GDS y Booking.com para automatizar reservas y consulta de inventarios.',
        'Estrategia SEO que incrementó el tráfico orgánico de 4,000 a más de 49,000 visitas mensuales.'
      ],
      stack: ['PHP', 'MySQL', 'Amadeus GDS', 'SEO Técnico', 'Joomla', 'WordPress']
    },
    {
      period: 'Ene. 2007 - Dic. 2011',
      duration: '5 años',
      company: 'Ingecol International',
      role: 'Founder & Technical Director',
      location: 'Presencial',
      desc: 'Fundación y dirección técnica de una agencia especializada en desarrollo web, productos digitales y transformación tecnológica para clientes internacionales.',
      highlights: [
        'Dirección del ciclo completo de proyectos de software, desde la concepción hasta la entrega y soporte.',
        'Coordinación de equipos de diseñadores, desarrolladores y colaboradores externos.',
        'Gestión de presupuestos, alcance técnico, cronogramas y estándares de calidad.'
      ],
      stack: ['Gestión de Proyectos', 'Desarrollo Web', 'Estrategia SEO', 'Relación con Clientes']
    },
    {
      period: 'Nov. 2004 - Sept. 2009',
      duration: '4 años 11 meses',
      company: 'Concesionarioenlinea.com',
      role: 'Founder & Web Product Developer',
      location: 'Presencial',
      desc: 'Diseño y desarrollo de un marketplace digital para la publicación y comercialización de vehículos nuevos y usados.',
      highlights: [
        'Desarrollo de plataforma centralizada con micrositios dedicados a concesionarios.',
        'Implementación de herramientas de administración de publicaciones, CRM e email marketing.',
        'Optimización técnica y SEO que impulsó el tráfico superando las 59,000 visitas mensuales.'
      ],
      stack: ['Marketplace', 'Product Development', 'SEO Técnico', 'Lead Generation']
    }
  ] : [
    {
      period: 'Jul. 2025 - Present',
      duration: '1 year',
      company: 'Aprende.Marketing',
      role: 'Founder & Full-Stack Product Engineer',
      location: 'Málaga, Spain · Hybrid',
      desc: 'Integral design and deployment of Aprende.Marketing, an AI-powered SaaS platform that automates the generation and deployment of marketing campaigns and assets.',
      highlights: [
        'Full-stack engineering of client dashboard (React + TypeScript) and backend services (Node.js + Express).',
        'Relational DB design and query optimization using MySQL and Google Cloud SQL.',
        'Multi-step GenAI pipelines powered by Google Gemini SDK to write high-converting copy.',
        'Multi-tenant infrastructure supporting custom domains SSL/TLS resolution and strict data isolation.',
        'Recurrent checkout subscription models integrating Stripe and Hotmart platforms via webhooks.',
        'Docker containerization and automated deployments on scalable Google Cloud Run environments.'
      ],
      stack: ['React', 'TypeScript', 'Node.js', 'Express', 'MySQL', 'Docker', 'Google Cloud Run', 'Gemini API', 'Stripe', 'Hotmart']
    },
    {
      period: 'Aug. 2019 - May 2025',
      duration: '5 years 10 months',
      company: 'Seminarios.Online®',
      role: 'Technical Mentor | Web Development & Marketing Automation',
      location: 'Remote',
      desc: 'Hands-on technical mentorship and training for digital marketing and development professionals on funnels design, landing pages, and systems automation.',
      highlights: [
        'Technical mentorship to over 250 students in web development, API integrations, and digital business infrastructure.',
        'Training on building performance-oriented websites with excellent Core Web Vitals, conversion rates, and UX.',
        'In-depth education on lead capturing pipelines, modern email marketing, and automated process orchestration.'
      ],
      stack: ['Web Development', 'Marketing Automation', 'Lead Management', 'Google Ads', 'Meta Ads']
    },
    {
      period: 'Apr. 2023 - Mar. 2025',
      duration: '2 years',
      company: 'GF Publicidad',
      role: 'Full-Stack Developer & Technical SEO Specialist',
      location: 'Seville, Spain · On-site',
      desc: 'Full-stack development, optimizations, and technical maintenance of robust web portals for a portfolio of over 40 corporate accounts.',
      highlights: [
        'Development of websites, custom functionalities, and bespoke plugin modules in PHP and WordPress ecosystems.',
        'Extensive performance optimization, web vitals boosting, page speed tuning, and code minification.',
        'Structured data implementation (JSON-LD schema) to maximize organic search engine crawler indexing.'
      ],
      stack: ['PHP', 'WordPress', 'Technical SEO', 'Core Web Vitals', 'JSON-LD', 'Performance']
    },
    {
      period: 'Nov. 2021 - Feb. 2023',
      duration: '1 year 4 months',
      company: 'Viajero.Digital',
      role: 'Founder & Digital Business Instructor',
      location: 'Remote',
      desc: 'Creation and instruction of a comprehensive training system enabling entrepreneurs to structure and scale digital operations.',
      highlights: [
        'Curating and instructing practical workshops on building professional business sites via WordPress.',
        'Comprehensive training in affiliate marketing models, lead nurture, email sequencing, and marketing funnels.',
        'Paid advertising tactics using Google Ads, Meta Ads, and search engine optimization (SEO).'
      ],
      stack: ['WordPress', 'Affiliate Marketing', 'Email Marketing', 'Google Ads', 'Meta Ads']
    },
    {
      period: 'Mar. 2017 - Jun. 2022',
      duration: '5 years 4 months',
      company: 'Habitaci.com - Ingecolint.com',
      role: 'Technical Product Manager & Full-Stack Developer',
      location: 'On-site',
      desc: 'Product roadmap ownership and full-stack development of a web system built to manage and list short-term rental listings.',
      highlights: [
        'Defining backlog, prioritizing features, and managing requirements for digital rental products.',
        'Designing and optimization of operational flows for listings, booking engines, secure reservations, and lead pipelines.',
        'Development of core system features and commercial automation of backend cronjobs.'
      ],
      stack: ['Product Management', 'Web Development', 'Automations', 'CRM']
    },
    {
      period: 'Jan. 2011 - Oct. 2021',
      duration: '10 years 10 months',
      company: 'Aerorutas.com',
      role: 'Senior Web Developer & Technical SEO Lead',
      location: 'On-site',
      desc: 'Development and evolution of the high-traffic e-commerce portal and custom CRM used to retail flight tickets, hotel reservations, and custom tours.',
      highlights: [
        'Design and end-to-end development of a custom, bespoke CRM to manage customers, quotations, and bookings.',
        'Deep Amadeus GDS and Booking.com API integrations to automate flight search queries and real-time inventory checks.',
        'Comprehensive SEO strategy driving organic search traffic from 4,000 to over 49,000 monthly unique visitors.'
      ],
      stack: ['PHP', 'MySQL', 'Amadeus GDS', 'Technical SEO', 'Joomla', 'WordPress']
    },
    {
      period: 'Jan. 2007 - Dec. 2011',
      duration: '5 years',
      company: 'Ingecol International',
      role: 'Founder & Technical Director',
      location: 'On-site',
      desc: 'Founding and leading a technology-focused creative agency specializing in web development, online products, and corporate digital transformations.',
      highlights: [
        'Supervising the full software lifecycle, from conceptual scoping and wireframes to final deployment and maintenance.',
        'Coordinating cross-functional squads of visual designers, software developers, and external suppliers.',
        'Managing engineering budgets, technical scopes, timelines, and rigorous quality assurance standards.'
      ],
      stack: ['Project Management', 'Web Development', 'SEO Strategy', 'Client Relations']
    },
    {
      period: 'Nov. 2004 - Sep. 2009',
      duration: '4 years 11 months',
      company: 'Concesionarioenlinea.com',
      role: 'Founder & Web Product Developer',
      location: 'On-site',
      desc: 'Conceptualized, designed, and engineered a multi-tenant car dealer marketplace for listings of new and used vehicles.',
      highlights: [
        'Building the multi-tenant marketplace dashboard featuring custom microsites for registered car dealerships.',
        'Implementing administration dashboards, catalog managers, custom lead CRM, and automated newsletters.',
        'Conducting SEO and web audits to drive web traffic, surpassing 59,000 monthly active users.'
      ],
      stack: ['Marketplace', 'Product Development', 'Technical SEO', 'Lead Generation']
    }
  ];

  return (
    <section id="experiencia" className="mb-24 relative z-10 text-left">
      {/* Title / Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-12 border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[#FF5A1F] rounded-full"></div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">
            {lang === 'es' ? 'EXPERIENCIA PROFESIONAL' : 'PROFESSIONAL EXPERIENCE'}
          </h2>
        </div>
        <span className="text-xs font-black text-[#FFBF00] uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          {lang === 'es' ? 'Trayectoria Completa' : 'Full Career Path'}
        </span>
      </div>

      {/* Experience Timeline */}
      <div className="max-w-3xl mx-auto w-full">
        <div className="relative border-l border-white/10 ml-4 pl-6 sm:pl-8 space-y-12 py-2">
          {experiences.map((exp, idx) => (
            <div key={idx} className="relative group text-left">
              {/* Timeline Dot Indicator */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#0B0B0B] border-2 border-[#FF5A1F] group-hover:border-[#FFBF00] group-hover:scale-125 transition-all duration-300 shadow-md shadow-[#FF5A1F]/20"></div>
              
              <div className="bg-[#111] border border-white/5 hover:border-white/10 p-6 sm:p-8 rounded-2xl transition-all duration-300 space-y-4 shadow-xl hover:shadow-white/[0.01]">
                
                {/* Header: Company and Date */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/5 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-white tracking-tight group-hover:text-[#FFBF00] transition-colors uppercase">
                        {exp.company}
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold text-[#FF5A1F] uppercase tracking-wider flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      {exp.role}
                    </h4>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-white">
                    <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 text-white">
                      <Calendar className="w-3.5 h-3.5 text-[#FFBF00]" />
                      <span>{exp.period}</span>
                    </span>
                    <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 text-white">
                      <Clock className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{exp.duration}</span>
                    </span>
                  </div>
                </div>

                {/* Location & Summary */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-xs text-white">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span>{exp.location}</span>
                  </div>
                  <p className="text-lg md:text-[1rem] text-white font-normal leading-relaxed max-w-2xl">
                    {exp.desc}
                  </p>
                </div>

                {/* Bullet Highlights */}
                <ul className="space-y-2 text-lg md:text-[1rem] text-white pl-1 list-none max-w-2xl">
                  {exp.highlights.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2">
                      <span className="text-[#FF5A1F] font-bold mt-0.5 select-none">•</span>
                      <span className="leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* Technology Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {exp.stack.map((tech, tIdx) => (
                    <span 
                      key={tIdx} 
                      className="px-2.5 py-1 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-lg text-[10px] font-semibold text-white transition-colors uppercase tracking-wider"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
