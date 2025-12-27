
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

export interface PlanFeatures {
  whatsappBot: boolean;
  blogGenerator: boolean;
  emailMarketing: boolean;
  removeBranding: boolean;
  emailStrategy: boolean; // Nueva feature: Secuencia 7 días
  evergreenStrategy: boolean; // Nueva feature: Secuencia 30 días
}

export interface PlanLimits {
  planName: 'free' | 'starter' | 'pro' | 'max' | 'custom' | string;
  maxProjects: number;
  maxLandings: number;
  maxDomains: number; // Nuevo límite de dominios
  maxArticles?: number; // Added optional
  features: PlanFeatures;
}

// NEW: Database Plan Structure
export interface Plan {
  id: string;
  name: string;
  slug: string; // e.g. 'starter', 'pro'
  description: string;
  priceMonthly: number;
  currency: string;
  stripePriceId?: string; // NEW: Dynamic ID for Stripe
  limitsConfig: PlanLimits;
  uiFeatures: string[]; // List of strings for the pricing card bullets
  isActive: boolean;
  isRecommended: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'admin' | 'user';
  planLimits?: PlanLimits;
  avatarUrl?: string; // New
  birthDate?: string; // New
  createdAt?: Date;   // New
  customRedirectUrl?: string; // New: User specific redirect
}

// NEW: System Log Type
export interface SystemLog {
    id: string;
    user_id: string | null;
    user_name: string;
    action_type: string;
    entity_type: string | null;
    entity_id: string | null;
    details: string | null; // JSON String
    created_at: string;
}

// NEW: User Usage Stats
export interface UserUsageStats {
    projects: number;
    landings: number;
    articles: number;
}

// --- CRM TYPES ---
export type CRMStatus = 'new' | 'contacted' | 'interested' | 'closed' | 'lost';
export type CRMInterest = 'cold' | 'warm' | 'hot';

export interface CRMContact {
    id: string;
    pageId?: string; // ID de la landing page de origen (opcional)
    pageSlug?: string; // Slug de la landing page para enlaces públicos
    name: string;
    email: string;
    phone?: string;
    country?: string;
    address?: string;
    source: string; // Landing Page Name or 'Manual'
    status: CRMStatus;
    interestLevel: CRMInterest;
    lastContactedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface CRMActivity {
    id: string;
    contactId: string;
    type: 'note' | 'status_change' | 'system' | 'lead_submission';
    content: string;
    createdAt: Date;
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

export interface ThankYouPageConfig {
  // General
  showSocials: boolean;
  ctaLink: string;

  // Hero
  progressBarText?: string;
  greenBadgeText?: string;
  headline: string;
  subheadline: string;

  // Step 1
  step1Title?: string;
  step1Desc?: string;
  step1Warning?: string;
  step1Subject?: string;

  // Step 2
  step2Title?: string;
  step2Desc?: string;
  step2Badge?: string;
  step2BonusTitle?: string;
  step2BonusValue?: string;

  // Offer / Book
  offerTopTitle?: string;
  offerHeadline?: string;
  offerDescription?: string;
  bookTitle?: string;
  bookSubtitle?: string;
  bookFooter?: string;
  offerPriceRegular?: string;
  offerPriceFree?: string;
  offerBadge?: string;
  
  // Lists & CTA
  offerBullets?: string[];
  ctaButtonText?: string;

  // Extra Sections
  learningTitle?: string;
  learningSubtitle?: string;
  learningItems?: Array<{ title: string; description: string }>;
  
  socialTitle?: string;
  socialSubtitle?: string;
  socialCountText?: string;
  socialItems?: Array<{ name: string; location: string; text: string }>;
  
  faqTitle?: string;
  faqItems?: Array<{ question: string; answer: string }>;
  
  // Legacy fields fallback
  ctaText?: string; 
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
  topTagline?: string; // e.g. "🔥 Clase Gratuita Online - Uñas"
  navCta?: string; // Short CTA for navbar e.g. "Reservar Cupo"
  navLinks?: Array<{ label: string; href: string }>; // Editable menu items
  testimonialTitle?: string; // e.g. "Ellas ya cambiaron su historia:"
  testimonialSubtitle?: string; // e.g. "Ellas ya dieron el paso..."
  closingOfferText?: string; // New: Text above the final CTA e.g. "Quedan pocos cupos..."
  logoSvg?: string; // AI Generated SVG Logo string

  hero: {
    headline: string;
    subheadline: string;
    ctaText: string;
    heroImage?: string; // URL for the hero image/video cover
    videoUrl?: string; // New: Actual video URL (YouTube, Vimeo, MP4)
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
    image?: string; // New: Custom photo URL
  }>;
  intro: {
    title: string;
    description: string;
    imageCardText?: string; // New: Text floating over the intro image
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
    title?: string; // New: "Conoce a tu Mentor"
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
  
  // NEW: Configuration for the Thank You Page
  thankYouPage?: ThankYouPageConfig;
}

export interface LandingPage {
  id: string;
  name: string;
  niche: string;
  goal: string;
  isPublished: boolean;
  subdomain: string;
  customDomain?: string; // New: Supports custom domains
  projectId?: string; // NEW: Linked Project ID
  projectName?: string; // NEW: Project Name for UI
  content: GeneratedPageContent;
  createdAt: Date;
  visits: number;
  conversions: number;
  user_id?: string;
}

export interface Article {
  id: string;
  pageId?: string; // Link to a landing page
  pageName?: string; // Name of linked page
  pageSubdomain?: string; // Subdomain/Slug of the linked page for URL construction
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

// NEW: Strategy JSON Structure (Legacy/Simple AI Gen)
export interface StrategyJSON {
  avatar: {
    name: string;
    age: string;
    occupation: string;
    story: string;
    frustrations: string[];
    desires: string[];
  };
  psychology: {
    emotionalTriggers: string[];
    objections: string[];
    falseBeliefs: string[];
  };
  funnel: {
    leadMagnetIdea: string;
    tripwireIdea: string;
    coreOfferPitch: string;
    funnelSteps: string[];
  };
  assets: {
    emailSequence: Array<{ subject: string; body: string; delay: string }>;
    whatsappScripts: Array<{ scenario: string; script: string }>;
    adCopies: Array<{ platform: string; headline: string; body: string }>;
  };
}

export interface Project {
  id: string;
  name: string; // e.g. "Curso de Uñas Pro"
  niche: string; // e.g. "Belleza / Manicure"
  description: string; // Internal description
  targetAudience: string; // "Mujeres de 25-40 años que quieren emprender"
  brandTone: string; // "Amigable, Profesional, Urgente"
  productName: string; // "Masterclass Uñas Premium"
  
  // New fields for conversational AI and financial tracking
  salesPageUrl?: string;
  fullPrice?: number;
  commissionRate?: number;
  leadMagnetType?: string;

  // Strategy Assets
  mainGoal: string; // "Venta Directa"
  painPoints: string[]; // ["No tienen tiempo", "Cursos caros", "Miedo a empezar"]
  keyBenefits: string[]; // ["Certificado Incluido", "Acceso de por vida", "Baja inversión"]
  
  affiliateLinks: AffiliateLink[]; // Centralized links
  
  strategy_json?: StrategyJSON | any; // Updated to accept both types
  
  createdAt: Date;
}

// --- COURSE SYSTEM TYPES (LMS) ---

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  video_url: string;
  description: string;
  learning_points: string[];
  is_published?: boolean;
  order_index: number;
}

export interface CourseModule {
  id: string;
  title: string;
  order_index: number;
  lessons: CourseLesson[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  badge_text?: string;
  description: string;
  slug: string;
  thumbnail: string;
  modules: CourseModule[];
  createdAt: Date;
  is_active?: boolean;
}

export interface Comment {
  id: string;
  lessonId: string;
  lessonTitle?: string;
  courseTitle?: string;
  courseSlug?: string;
  user: string;
  userId: string;
  date: string;
  text: string;
  isApproved: boolean;
  replies?: Comment[];
  parentId?: string;
  likes?: number;
}
