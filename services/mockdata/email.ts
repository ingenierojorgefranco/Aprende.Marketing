import { EmailSequence, EmailMessage } from "../../types";

/* */ /* Actualización: Configuración profesional de la secuencia de Email Marketing para Microblading de Cejas, estableciendo los pilares de Lanzamiento (Día 4), Escasez (Día 5) y Cierre (Día 6) con copywriting de alta gama - 24/06/2024 19:30 */
export const MOCK_EMAIL_SEQUENCES: EmailSequence[] = [
  {
    id: "mock-seq-1",
    userId: "mock-user-id",
    projectId: "proj-microblading-01",
    projectName: "Certificación Expert Microblading",
    name: "Secuencia de Ventas: Microblading Pro",
    status: "activa",
    tagName: "Lead Microblading",
    createdAt: new Date("2024-06-20"),
    generatedDays: [0]
  }
];

export const MOCK_EMAIL_MESSAGES: EmailMessage[] = [
  {
    id: "m1",
    sequenceId: "mock-seq-1",
    dayIndex: 1,
    subject: "🎁 Tu regalo: El Mapa para triplicar tus ingresos con Cejas",
    pilarType: "Entrega de Valor",
    purpose: "Cumplir la promesa del lead magnet, establecer autoridad inmediata y conectar con el deseo de independencia financiera del avatar.",
    contentHtml: `
      <div style="font-family: sans-serif; color: #333; line-height: 1.8; max-width: 800px; margin: auto; padding: 10px;">
        <p>Hola futura artista,</p>
        
        <p>¡Qué alegría que estés aquí! Tal como te lo prometí, aquí tienes la llave para empezar tu transformación en el mundo de la belleza.</p>
        
        <p>He preparado este material pensando exclusivamente en resolver ese sentimiento de estancamiento que muchas emprendedoras sienten al inicio. No se trata solo de aprender una técnica, sino de <strong>dominar un negocio</strong> que te brinde la libertad que mereces.</p>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="https://aprende.marketing/guia-microblading" style="background-color: #FF5A1F; color: white; padding: 18px 30px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 20px; box-shadow: 0 4px 15px rgba(255,90,31,0.3); display: inline-block;">👉 DESCARGAR MI GUÍA GRATUITA</a>
        </div>
        
        <p>En esta guía descubrirás por qué el <span style="color: #FF5A1F; font-weight: bold;">Microblading Pro</span> es la técnica más rentable de este año y cómo puedes empezar incluso si no tienes experiencia previa.</p>
        
        <p>Mañana te enviaré algo muy importante: hablaremos del error #1 que cometen las esteticistas novatas y que las mantiene trabajando 10 horas al día sin ver resultados reales.</p>
        
        <p style="margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px;">
          Atentamente,<br>
          <strong>Valentina Ross</strong><br>
          Master Artist & Fundadora de MicroBrows Academy
        </p>
        
        <p style="font-size: 14px; color: #999; margin-top: 20px;">
          Este correo es parte de tu suscripción a MicroBrows Academy. Si no deseas recibir más consejos, puedes darte de baja en el link inferior.
        </p>
      </div>
    `,
    isGenerated: true,
    type: 'conversion'
  },
  {
    id: "m2",
    sequenceId: "mock-seq-1",
    dayIndex: 2,
    subject: "¿Te has sentido frustrada con tus ingresos actuales? 😫",
    pilarType: "Agitación del Dolor",
    purpose: "Conectar emocionalmente con el cansancio de trabajar mucho por poco dinero y presentar el producto como la salida al 'techo de cristal' de ingresos en estética.",
    contentHtml: "",
    isGenerated: false,
    type: 'conversion'
  },
  {
    id: "m3",
    sequenceId: "mock-seq-1",
    dayIndex: 3,
    subject: "Mira lo que Carla logró en su primer mes... 📈",
    pilarType: "Prueba Social",
    purpose: "Demostrar factibilidad mediante un caso de éxito real de microblading que genere deseo y credibilidad en el método.",
    contentHtml: "",
    isGenerated: false,
    type: 'conversion'
  },
  {
    id: "m4",
    sequenceId: "mock-seq-1",
    dayIndex: 4,
    subject: "El secreto del Visajismo 3D (No necesitas ser dibujante) 💎",
    pilarType: "Mecanismo Único",
    purpose: "Eliminar la objeción de 'falta de talento artístico' explicando el método técnico simplificado que hace el diseño perfecto por la alumna.",
    contentHtml: "",
    isGenerated: false,
    type: 'conversion'
  },
  {
    id: "m5",
    sequenceId: "mock-seq-1",
    dayIndex: 5,
    subject: "🚀 INSCRIPCIONES ABIERTAS: Tu Certificación Experta en Microblading",
    pilarType: "Lanzamiento",
    purpose: "Presentar oficialmente el programa completo, desglosar los módulos y realizar el primer llamado a la acción directo de venta.",
    contentHtml: "",
    isGenerated: false,
    type: 'conversion'
  },
  {
    id: "m6",
    sequenceId: "mock-seq-1",
    dayIndex: 6,
    subject: "Tus 3 Bonos Exclusivos expiran en pocas horas... ⏳",
    pilarType: "Escasez",
    purpose: "Generar urgencia mediante la pérdida inminente de los regalos adicionales (Kit de pigmentos, Asesoría VIP) para cerrar ventas rezagadas.",
    contentHtml: "",
    isGenerated: false,
    type: 'conversion'
  },
  {
    id: "m7",
    sequenceId: "mock-seq-1",
    dayIndex: 7,
    subject: "ÚLTIMA LLAMADA: ¿Eliges independencia o sigues igual?",
    pilarType: "Cierre",
    purpose: "Llamado final a la acción confrontando al lead con su situación actual vs su potencial futuro antes de cerrar el carrito definitivamente.",
    contentHtml: "",
    isGenerated: false,
    type: 'conversion'
  }
];