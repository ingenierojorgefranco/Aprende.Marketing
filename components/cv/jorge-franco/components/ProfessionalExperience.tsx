import React from 'react';
import { MapPin, Briefcase, Clock, Calendar } from 'lucide-react';

export const ProfessionalExperience: React.FC = () => {
  const experiences = [
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
  ];

  return (
    <section id="experiencia" className="mb-24 relative z-10 text-left">
      {/* Title / Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-12 border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[#FF5A1F] rounded-full"></div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">
            EXPERIENCIA PROFESIONAL
          </h2>
        </div>
        <span className="text-xs font-black text-[#FFBF00] uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          Trayectoria Completa
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

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-400">
                    <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 text-gray-300">
                      <Calendar className="w-3.5 h-3.5 text-[#FFBF00]" />
                      <span>{exp.period}</span>
                    </span>
                    <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 text-gray-300">
                      <Clock className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{exp.duration}</span>
                    </span>
                  </div>
                </div>

                {/* Location & Summary */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span>{exp.location}</span>
                  </div>
                  <p className="text-base text-white/95 font-normal leading-relaxed">
                    {exp.desc}
                  </p>
                </div>

                {/* Bullet Highlights */}
                <ul className="space-y-2 text-sm text-white/90 pl-1 list-none">
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
                      className="px-2.5 py-1 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-lg text-[10px] font-semibold text-gray-400 hover:text-white transition-colors uppercase tracking-wider"
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
