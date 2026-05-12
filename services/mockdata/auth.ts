
import { User } from "../../types";

export const MOCK_CREDENTIALS = {
  email: "admin@plataformadeventa.com",
  password: "MiPasswordSuperSegura123"
};

export const MOCK_USER: User = {
  id: "mock-user-id",
  name: "Admin Microblading",
  email: MOCK_CREDENTIALS.email,
  role: 'user', // Changed from 'admin' to 'user' to allow Wizard testing in local
  survey_json: { 
    niche: 'Microblading', 
    goal: 'Vender servicios', 
    target_audience: 'Mujeres 25-45 años' 
  },
  planLimits: {
      planName: 'pro',
      maxProjects: 10,
      maxLandings: 50,
      maxDomains: 5,
      maxArticles: 20,
      maxEmailSequences: 5,
      maxEmailSequencesNurturing: 20,
      maxWhatsAppLaunches: 5,
      maxHooks: 50, // Añadido límite de ganchos
      features: {
          whatsappBot: true,
          blogGenerator: true,
          emailMarketing: true,
          removeBranding: true,
          emailStrategy: true,
          evergreenStrategy: true
      }
  }
};
