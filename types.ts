

export enum ViewState {
  PUBLIC_HOME = 'PUBLIC_HOME',
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  GENERATOR = 'GENERATOR',
  EDITOR = 'EDITOR',
  PREVIEW_PAGE = 'PREVIEW_PAGE',
  WHATSAPP = 'WHATSAPP',
  EMAIL_MARKETING = 'EMAIL_MARKETING',
  MY_PAGES = 'MY_PAGES',
  COPY_PRO = 'COPY_PRO',
  ARTICLE_CREATOR = 'ARTICLE_CREATOR',
  ARTICLES_LIST = 'ARTICLES_LIST'
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export type ColorPalette = 
  | 'modern-blue' 
  | 'elegant-purple' 
  | 'energetic-orange' 
  | 'nature-green' 
  | 'dark-luxury'
  | 'ocean-teal'
  | 'crimson-red'
  | 'corporate-slate'
  | 'gold-prestige'
  | 'minimal-mono';

export type StructureType = 
  | 'classic-sales'       // Estilo clásico: Hero -> Beneficios -> Contenido
  | 'vsl-focused'         // Video Sales Letter: Headline -> Video grande -> CTA
  | 'webinar-funnel'      // Registro Webinar: 2 Columnas (Info izq, Form der)
  | 'minimal-capture';    // Captura minimalista: Centrado, poco texto, foco en form

export type DestinationType = 'form' | 'whatsapp' | 'external_url';

export interface DestinationConfig {
  type: DestinationType;
  url?: string;
  whatsappPhone?: string;
  whatsappMessage?: string;
}

// Structure for the AI generated landing page
export interface GeneratedPageContent {
  palette: ColorPalette;
  structure: StructureType;
  destination: DestinationConfig; // Configuration for where the button leads
  targetAudience?: string;
  
  // New specific fields for better UX
  brandName?: string; // Visible name next to logo
  brandIcon?: string; // Icon name for the brand/logo
  topTagline?: string; // e.g., "🔥 Clase Gratuita Online - Uñas"
  navCta?: string; // Short CTA for navbar e.g., "Reservar Cupo"
  navLinks?: Array<{ label: string; href: string }>; // Editable menu items
  testimonialTitle?: string; // e.g., "Ellas ya cambiaron su historia:"
  testimonialSubtitle?: string; // e.g. "Ellas ya dieron el paso..."
  logoSvg?: string; // AI Generated SVG Logo string

  hero: {
    headline: string;
    subheadline: string;
    ctaText: string;
    heroImage?: string; // URL for the hero image/video cover
    videoTitle?: string; // Title inside the image card e.g. "Clase Gratuita: Estrategia Exclusiva"
    videoDuration?: string; // e.g. "Duración: 45 Minutos"
    spotsLeft?: string; // e.g. "¡Quedan 7 cupos!"
    socialProofCount?: string; // e.g. "2,458"
  };
  testimonials: Array<{
    name: string;
    location?: string; // New: City/Country
    text: string;
    rating: number;
  }>;
  intro: {
    title: string;
    description: string;
    items?: Array<{ title: string; description: string }>; // For the bullet points like Visajismo etc.
  };
  benefits: {
    title: string;
    subtitle?: string; // e.g. "Recibe el arsenal completo..."
    items: Array<{ 
      title: string; 
      description: string;
      icon?: string; // Icon name e.g. 'DollarSign'
      color?: string; // Color name e.g. 'blue', 'green'
    }>;
  };
  whatYouWillLearn: {
    title: string;
    icon?: string; // Icon for the title
    items: string[];
  };
  faq: Array<{
    question: string;
    answer: string;
  }>;
  instructor: {
    name: string;
    bio: string;
    imageUrl?: string;
    // New editable fields for badges
    badgeText?: string; // "Top Rated"
    badgeSubtext?: string; // "Mentor 2024"
    statsStudents?: string; // "5k+ Alumnos"
    statsRating?: string; // "4.9/5 Rating"
  };
  footer: {
    copyright: string;
    contact: string;
    socials?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
    }
  };
  thankYouMessage: string;
  redirectUrl: string;
}

export interface LandingPage {
  id: string;
  name: string;
  niche: string;
  goal: string;
  isPublished: boolean;
  subdomain: string;
  content: GeneratedPageContent;
  createdAt: Date;
  visits: number;
  conversions: number;
  user_id?: string;
}

export interface Article {
  id: string;
  pageId?: string; // Link to a landing page
  title: string;
  slug: string;
  description: string;
  contentHtml: string;
  featuredImage?: string;
  keyword: string;
  seoScore: number;
  metaTitle?: string;
  metaDescription?: string;
  status: 'published' | 'draft' | 'scheduled';
  publishedAt: Date;
  createdAt: Date;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  sourcePage: string;
  date: string;
  synced: boolean;
}

export interface WhatsAppMessage {
  id: string;
  sender: 'user' | 'agent' | 'bot';
  text: string;
  timestamp: Date;
}

export interface WhatsAppContact {
  id: string;
  name: string;
  phone: string;
  messages: WhatsAppMessage[];
  botEnabled: boolean;
  lastMessage: string;
  unreadCount: number;
}

// --- PROJECT SYSTEM TYPES ---

export interface AffiliateLink {
  label: string; // e.g. "Checkout Principal", "Webinar"
  url: string;
}

export interface Project {
  id: string;
  name: string; // e.g. "Curso de Uñas Pro"
  niche: string; // e.g. "Belleza / Manicure"
  description: string; // Internal description
  targetAudience: string; // "Mujeres de 25-40 años que quieren emprender"
  brandTone: string; // "Amigable, Profesional, Urgente"
  productName: string; // "Masterclass Uñas Premium"
  
  // Strategy Assets
  mainGoal: string; // "Venta Directa"
  painPoints: string[]; // ["No tienen tiempo", "Cursos caros", "Miedo a empezar"]
  keyBenefits: string[]; // ["Certificado Incluido", "Acceso de por vida", "Baja inversión"]
  
  affiliateLinks: AffiliateLink[]; // Centralized links
  
  createdAt: Date;
}