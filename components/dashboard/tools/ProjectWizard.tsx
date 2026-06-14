import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, Link as LinkIcon, Briefcase, Plus, Trash2, Loader2, Sparkles, DollarSign, Target, Globe, MessageSquare, Brain, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, Type, Palette, Code, X, AlertTriangle, Crown, CheckCircle2, Star, User as UserIcon, Rocket, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../../../services/api';
import { AffiliateLink, User, Project } from '../../../types';
import { UpgradeModal } from '../UpgradeModal';

// --- VISUAL EDITOR COMPONENT (LOCAL HELPER) ---
interface VisualEditorProps {
    value: string;
    onChange: (val: string) => void;
    className?: string;
    placeholder?: string;
}

const VisualEditor = ({ value, onChange, className, placeholder }: VisualEditorProps) => {
    const [isSourceMode, setIsSourceMode] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (contentRef.current && contentRef.current.innerHTML !== value && !isSourceMode) {
            contentRef.current.innerHTML = value;
        }
    }, [value, isSourceMode]);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        onChange(e.currentTarget.innerHTML);
    };

    const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    };

    const execCmd = (command: string, value: string | undefined = undefined) => {
        document.execCommand(command, false, value);
        if (contentRef.current) {
            onChange(contentRef.current.innerHTML);
            contentRef.current.focus();
        }
    };

    const ToolbarButton = ({ icon: Icon, cmd, arg, title, active }: any) => (
        <button 
            type="button"
            onClick={() => execCmd(cmd, arg)} 
            className={`p-1.5 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition ${active ? 'bg-gray-800 text-white' : ''}`} 
            title={title}
            disabled={isSourceMode}
        >
            <Icon className="w-3.5 h-3.5" />
        </button>
    );

    return (
        <div className={`border border-gray-700 rounded-lg overflow-hidden bg-black ${className}`}>
            <div className={`flex flex-wrap items-center gap-1 bg-gray-900 p-1.5 border-b border-gray-700 ${isSourceMode ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="flex gap-0.5 border-r border-gray-700 pr-2 mr-1">
                    <button type="button" onClick={() => execCmd('formatBlock', 'P')} className="p-1.5 rounded hover:bg-gray-800 text-gray-400 text-xs font-bold w-7" title="Párrafo">P</button>
                    <button type="button" onClick={() => execCmd('formatBlock', 'H3')} className="p-1.5 rounded hover:bg-gray-800 text-gray-400 text-xs font-bold w-7" title="Título H3">H3</button>
                </div>
                <ToolbarButton icon={Bold} cmd="bold" title="Negrita" />
                <ToolbarButton icon={Italic} cmd="italic" title="Cursiva" />
                <ToolbarButton icon={Underline} cmd="underline" title="Subrayado" />
                <div className="w-px h-4 bg-gray-700 mx-1"></div>
                <ToolbarButton icon={AlignLeft} cmd="justifyLeft" title="Izquierda" />
                <ToolbarButton icon={AlignCenter} cmd="justifyCenter" title="Centro" />
                <ToolbarButton icon={AlignRight} cmd="justifyRight" title="Derecha" />
                <div className="w-px h-4 bg-gray-700 mx-1"></div>
                <ToolbarButton icon={List} cmd="insertUnorderedList" title="Lista" />
                <div className="ml-auto">
                    <button 
                        type="button" 
                        onClick={() => setIsSourceMode(!isSourceMode)} 
                        className={`p-1.5 rounded flex items-center gap-1 text-[10px] font-bold uppercase ${isSourceMode ? 'bg-blue-900/50 text-blue-400 border border-blue-800 pointer-events-auto opacity-100' : 'text-gray-500 hover:text-white pointer-events-auto opacity-100 hover:bg-gray-800'}`}
                    >
                        <Code className="w-3 h-3" /> {isSourceMode ? 'Visual' : 'HTML'}
                    </button>
                </div>
            </div>
            <div className="relative min-h-[150px] bg-black">
                {isSourceMode ? (
                    <textarea 
                        ref={textareaRef}
                        className="w-full h-full min-h-[150px] p-3 bg-[#0d1117] text-gray-300 font-mono text-xs outline-none resize-y"
                        value={value}
                        onChange={handleSourceChange}
                    />
                ) : (
                    <div 
                        ref={contentRef}
                        className="prose prose-invert max-w-none p-3 outline-none min-h-[150px] text-gray-300 text-lg leading-loose"
                        contentEditable
                        onInput={handleInput}
                        suppressContentEditableWarning={true}
                        data-placeholder={placeholder}
                    />
                )}
            </div>
        </div>
    );
};

const DEFAULT_AVATARS_DATA = [
  {
    name: "María Fernanda",
    priority: "PRINCIPAL",
    priorityClass: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 border",
    audiencePct: "68% DE TU AUDIENCIA",
    audienceClass: "bg-[#FF5D1E]/10 border-[#FF5D1E]/30 text-[#FF5D1E] border",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300",
    age: "28 - 35 años",
    ageRange: "28 - 35 años",
    occupation: "Cosmetóloga independiente o Esteticista",
    archetype: "Cosmetóloga independiente o Esteticista",
    incomeRange: "Ingreso base inestable ($600 - $1,200 USD/mes)",
    income: "Ingreso base inestable ($600 - $1,200 USD/mes)",
    location: "Zonas semi-urbanas y urbanas",
    geographic: "Zonas semi-urbanas y urbanas",
    civilStatus: "Soltera o casada con hijos pequeños",
    marital_status: "Soltera o casada con hijos pequeños",
    devices: "Smartphone de gama media-alta, Instagram, WhatsApp",
    studies: "Universitario o Técnico Superior",
    education: "Universitario o Técnico Superior",
    // Resumen Tab
    dolores_principales: [
      "No tiene suficientes clientes estables.",
      "Siente que su trabajo no es valorado como debería.",
      "Le cuesta diferenciarse en un mercado saturado.",
      "Miedo a invertir en formación y no ver resultados."
    ],
    deseos_principales: [
      "Tener más clientes y agenda llena.",
      "Ser reconocida como experta en su área.",
      "Lograr independencia financiera.",
      "Tener flexibilidad de tiempo and ubicación."
    ],
    quote: "Aprende una técnica profesional, con acompañamiento real, para que consigas más clientes, mejores ingresos y la libertad que mereces.",
    // Dolores y miedos ocultos Tab
    dolores_ocultos: [
      { title: "CLIENTELA INESTABLE", text: "No tiene suficientes clientes estables, lo que le genera una alta incertidumbre mensual sobre la facturación de su negocio." },
      { title: "TRABAJO DESVALORADO", text: "Siente que su trabajo no es valorado como debería y que las clientas siempre buscan la opción más barata regateando precios." },
      { title: "MARKETING INVISIBLE", text: "Le cuesta diferenciarse en un mercado saturado de profesionales independientes ofreciendo lo mismo a precios muy bajos." },
      { title: "INVERSIÓN SIN RETORNO", text: "Miedo a invertir en formación y no ver resultados, perdiendo sus recursos en teoría aburrida que no puede aplicar en la práctica real." }
    ],
    // Deseos y motivaciones Tab
    deseos_motivaciones: [
      { title: "AGENDA LLENA", text: "Tener más clientes y la agenda completamente llena con meses de anticipación sin tener que regatear tarifas." },
      { title: "EXPERTA RECONOCIDA", text: "Ser reconocida formalmente como una de las mejores expertas referentes en su área y ciudad." },
      { title: "INDEPENDENCIA FINANCIERA", text: "Lograr verdadera estabilidad e independencia económica para tomar decisiones con libertad." },
      { title: "FLEXIBILIDAD ABSOLUTA", text: "Tener control total de sus propios horarios de atención y la flexibilidad de tiempo y ubicación que siempre soñó." }
    ],
    // Comportamientos Tab
    comportamientos: [
      "Sigue activamente cuentas de gurús de belleza y marketing estético en Instagram y TikTok.",
      "Paga pequeños talleres o webinars rápidos de $20 a $50 USD buscando secretos aplicables.",
      "Pregunta constantemente en grupos de Facebook qué marcas de pigmentos o inductores son mejores.",
      "Consume video tutoriales rápidos por las noches antes de dormir buscando perfeccionar trazo de cejas."
    ],
    behaviors: [
      "Sigue activamente cuentas de gurús de belleza y marketing estético en Instagram y TikTok.",
      "Paga pequeños talleres o webinars rápidos de $20 a $50 USD buscando secretos aplicables.",
      "Pregunta constantemente en grupos de Facebook qué marcas de pigmentos o inductores son mejores.",
      "Consume video tutoriales rápidos por las noches antes de dormir buscando perfeccionar trazo de cejas."
    ],
    motivations: {
      dinero: "Retorno de inversión garantizado con su primer set de clientas.",
      tiempo: "Establecer un flujo de trabajo optimizado para atender en menos de 90 minutos.",
      estatus: "Certificación oficial de alta gama para destacar de la competencia convencional.",
      seguridad: "Soporte uno a uno para resolver problemas reales en el inicio del negocio."
    }
  },
  {
    name: "Valeria Mendoza",
    priority: "SECUNDARIO",
    priorityClass: "bg-amber-500/10 border-amber-500/30 text-amber-400 border",
    audiencePct: "22% DE TU AUDIENCIA",
    audienceClass: "bg-amber-500/10 border-amber-500/30 text-amber-500 border",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300",
    age: "22 - 27 años",
    ageRange: "22 - 27 años",
    occupation: "Cosmetóloga Junior",
    archetype: "Cosmetóloga Junior",
    incomeRange: "Ingreso fijo bajo ($350 - $550 USD/mes)",
    income: "Ingreso fijo bajo ($350 - $550 USD/mes)",
    location: "Zonas urbanas y residenciales",
    geographic: "Zonas urbanas y residenciales",
    civilStatus: "Soltera, vive con sus padres",
    marital_status: "Soltera, vive con sus padres",
    devices: "Smartphone Android gama de entrada, TikTok, Instagram",
    studies: "Técnico medio o Curso comercial avanzado",
    education: "Técnico medio o Curso comercial avanzado",
    // Resumen Tab
    dolores_principales: [
      "Siente estancamiento profesional por falta de especialización.",
      "Su sueldo actual en un centro de estética no compensa su esfuerzo.",
      "Temor a estropear el rostro de un cliente con técnicas dudosas.",
      "Falta de contactos y red de clientes para iniciar sola."
    ],
    deseos_principales: [
      "Especializarse en la técnica más demandada del rubro.",
      "Abrir su propio centro o cabina privada el próximo año.",
      "Cobrar el dible o triple por hora de servicio certificado.",
      "Desarrollar un portafolio de cejas impactante."
    ],
    quote: "Especialízate con un método paso a paso garantizado para que dupliques tus tarifas actuales y obtengas la acreditación que tus clientes valoran.",
    // Dolores y miedos ocultos Tab
    dolores_ocultos: [
      { title: "El miedo al estancamiento profesional", text: "Teme trabajar como empleada toda su vida sin ver su propio crecimiento financiero." },
      { title: "Falta de credibilidad", text: "Le preocupa que las clientas no confíen en ella por verse muy joven o no tener certificación reconocida de alta gama." },
      { title: "Inestabilidad emocional", text: "La baja remuneración genera que dude de su propia pasión por la belleza y estética profesional." }
    ],
    // Deseos y motivaciones Tab
    deseos_motivaciones: [
      { title: "Reconocimiento y Estatus", text: "Ser la especialista de referencia a la que las clientas agendan con semanas de anticipación corporativa." },
      { title: "Aumentar Tarifas", text: "Pasar de cobrar servicios baratos de $15 a tratamientos premium de más de text de forma segura." },
      { title: "Estilo de Vida Independiente", text: "Crear una marca personal respetada con identidad visual propia en redes sociales." }
    ],
    // Comportamientos Tab
    comportamientos: [
      "Guarda tableros de fotos de cejas perfectas y estética minimalista en Pinterest.",
      "Sigue tendencias de micropigmentación internacionales de Europa y Brasil.",
      "Compara activamente los precios de academias en línea para decidir su inversión.",
      "Práctica exhaustivamente en látex para perfeccionar la precisión de sus trazos."
    ],
    behaviors: [
      "Guarda tableros de fotos de cejas perfectas y estética minimalista en Pinterest.",
      "Sigue tendencias de micropigmentación internacionales de Europa y Brasil.",
      "Compara activamente los precios de academias en línea para decidir su inversión.",
      "Práctica exhaustivamente en látex para perfeccionar la precisión de sus trazos."
    ],
    motivations: {
      dinero: "Garantía de reembolso o método blindado para proteger su capital y no desperdiciar ni un dólar más.",
      tiempo: "Ir al grano con un sistema probado sin rodeos teóricos innecesarios.",
      estatus: "Validación por expertos que la posiciona como una profesional seria ante sus clientes.",
      seguridad: "Acompañamiento cercano anticaídas para asegurar sus primeros pasos prácticos."
    }
  },
  {
    name: "Mónica Silva",
    priority: "COMPLEMENTARIO",
    priorityClass: "bg-violet-500/10 border-violet-500/30 text-violet-400 border",
    audiencePct: "10% DE TU AUDIENCIA",
    audienceClass: "bg-violet-500/10 border-violet-500/30 text-violet-500 border",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300",
    age: "36 - 45 años",
    ageRange: "36 - 45 años",
    occupation: "Emprendedora desde cero",
    archetype: "Emprendedora desde cero",
    incomeRange: "Sin ingresos estables (depende de comisiones)",
    income: "Sin ingresos estables (depende de comisiones)",
    location: "Zonas residenciales y capitales de provincia",
    geographic: "Zonas residenciales y capitales de provincia",
    civilStatus: "Casada con hijos adolescentes, jefa de hogar",
    marital_status: "Casada con hijos adolescentes, jefa de hogar",
    devices: "Computadora y Smartphone gama media, Facebook, WhatsApp",
    studies: "Educación técnica o administrativa",
    education: "Educación técnica o administrativa",
    // Resumen Tab
    dolores_principales: [
      "Miedo extremo a comenzar en un rubro totalmente desconocido.",
      "Creer que ya 'pasó su momento' o es muy mayor para aprender tecnologías de belleza.",
      "Dudas sobre su pulso y coordinación motora fina.",
      "Inseguridad al vender o hacer marketing en su nueva etapa."
    ],
    deseos_principales: [
      "Reinventarse profesionalmente con un negocio moderno.",
      "Generar una fuente confiable de ingresos para el hogar.",
      "Demostrar a su entorno que puede liderar su propio proyecto.",
      "Tener el control total de sus finanzas corporativas."
    ],
    quote: "No necesitas experiencia previa para triunfar. Nuestro programa te acompaña desde cero, cuidando tu técnica y enseñándote a vender sin esfuerzo.",
    // Dolores y miedos ocultos Tab
    dolores_ocultos: [
      { title: "La barrera del aprendizaje técnico", text: "Duda de su capacidad para asimilar conceptos modernos o dominar herramientas de alta precisión." },
      { title: "Miedo al rechazo comercial", text: "Le aterra el proceso de vender o hablar con clientas desconocidas sobre precios y retornos." },
      { title: "El síndrome de la impostora tardía", text: "Siente que el mercado es para jóvenes influencers de belleza y le cuesta encajar visualmente." }
    ],
    // Deseos y motivaciones Tab
    deseos_motivaciones: [
      { title: "Seguridad Financiera Post-Jubilación", text: "Construir un activo rentable y duradero que le dé tranquilidad a mediano-largo plazo." },
      { title: "Empoderamiento Familiar", text: "Aportar económicamente al hogar disminuyendo la presión financiera sobre su cónyuge." },
      { title: "Autorealización Personal", text: "Desarrollar un oficio creativo e inspirador que llene su tiempo de valor y orgullo propio." }
    ],
    // Comportamientos Tab
    comportamientos: [
      "Sigue grupos comunitarios locales de emprendedores locales y negocios pymes.",
      "Prefiere cursos con soporte personalizado, llamadas en vivo o grupos cerrados de ayuda.",
      "Busca recomendaciones de boca en boca para evaluar la seriedad de una propuesta.",
      "Toma notas escritas detalladas en cuadernos físicos durante las clases teóricas."
    ],
    behaviors: [
      "Sigue grupos comunitarios locales de emprendedores locales y negocios pymes.",
      "Prefiere cursos con soporte personalizado, llamadas en vivo o grupos cerrados de ayuda.",
      "Busca recomendaciones de boca en boca para evaluar la seriedad de una propuesta.",
      "Toma notas escritas detalladas en cuadernos físicos durante las clases teóricas."
    ],
    motivations: {
      dinero: "Generar ingresos estables desde casa para lograr libertad financiera real.",
      tiempo: "Flexibilidad horaria absoluta para pasar más tiempo con tus hijos o seres queridos.",
      estatus: "Sentir la satisfacción y el orgullo de transicionar hacia una profesión propia.",
      seguridad: "Guía paso a paso adaptada para principiantes absolutos sin experiencia previa."
    }
  }
];

const getBlankAvatar = (idx: number) => ({
    name: "",
    priority: idx === 0 ? "PRINCIPAL" : idx === 1 ? "SECUNDARIO" : "COMPLEMENTARIO",
    priorityClass: idx === 0 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 border" : idx === 1 ? "bg-amber-500/10 border-amber-500/30 text-amber-550 border" : "bg-violet-500/10 border-violet-500/30 text-violet-400 border",
    audiencePct: idx === 0 ? "46% DE TU AUDIENCIA" : idx === 1 ? "32% DE TU AUDIENCIA" : "22% DE TU AUDIENCIA",
    audienceClass: idx === 0 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 border" : idx === 1 ? "bg-amber-500/10 border-amber-500/30 text-amber-400 border" : "bg-violet-500/10 border-violet-500/30 text-violet-400 border",
    img: idx === 0 ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300" : idx === 1 ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300" : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300",
    image: idx === 0 ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300" : idx === 1 ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300" : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300",
    age: "",
    ageRange: "",
    studies: "",
    education: "",
    archetype: "",
    occupation: "",
    incomeRange: "",
    income: "",
    location: "",
    geographic: "",
    civilStatus: "",
    marital_status: "",
    devices: "",
    dolores_principales: ["", "", "", ""],
    deseos_principales: ["", "", "", ""],
    quote: "",
    dolores_ocultos: [
      { title: "", text: "" },
      { title: "", text: "" },
      { title: "", text: "" },
      { title: "", text: "" }
    ],
    deseos_motivaciones: [
      { title: "", text: "" },
      { title: "", text: "" },
      { title: "", text: "" },
      { title: "", text: "" }
    ],
    comportamientos: ["", "", "", ""],
    behaviors: ["", "", "", ""],
    motivations: { dinero: "", tiempo: "", estatus: "", seguridad: "" }
});

interface DashboardContext {
  user: User;
  projectCount: number;
  isSimulating: boolean;
}

export const ProjectWizard: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams() as { id: string };
    const { user, projectCount, isSimulating } = useOutletContext() as DashboardContext;
    
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    
    const [showAnalyzeConfirm, setShowAnalyzeConfirm] = useState(false);
    const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
    
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    
    const [name, setName] = useState('');
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [brandTone, setBrandTone] = useState('Amigable y Cercano');
    
    const [fullPrice, setFullPrice] = useState<number>(0);
    const [commissionValue, setCommissionValue] = useState<number>(0);
    const [leadMagnetType, setLeadMagnetType] = useState('');
    const [leadMagnetUrl, setLeadMagnetUrl] = useState('');
    const [digitalProductUrl, setDigitalProductUrl] = useState('');
    const [salesPageUrl, setSalesPageUrl] = useState('');
    const [isMaster, setIsMaster] = useState(false);
    const [masterParentId, setMasterParentId] = useState<string | undefined>(undefined);
    
    const [niche, setNiche] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [mainGoal, setMainGoal] = useState('Venta Directa');
    const [painPoints, setPainPoints] = useState<string[]>([]);
    const [keyBenefits, setKeyBenefits] = useState<string[]>([]);
    
    // Demographic Profile manually edited attributes (Modern Modal Setup)
    const [isOpenAvatarsModal, setIsOpenAvatarsModal] = useState(false);
    const [activeAvatarTab, setActiveAvatarTab] = useState(0);
    const [tempAvatars, setTempAvatars] = useState<any[]>(DEFAULT_AVATARS_DATA);
    const [expandedAvatarIdx, setExpandedAvatarIdx] = useState<number | null>(0);
    const [modalSubTab, setModalSubTab] = useState<string>('resumen');
    
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([
        { label: 'Hotlink Principal Precio Full', url: '' },
        { label: 'Hotlink con Descuento', url: '' }
    ]);
    const [originalStrategyJson, setOriginalStrategyJson] = useState<any>(null);
    const [multimedia, setMultimedia] = useState<{ heroImages: string[], videoUrls: string[], descriptiveImages: string[], instructorImage?: string }>({
        heroImages: [],
        videoUrls: [],
        descriptiveImages: [],
        instructorImage: ''
    });

    const commissionRate = fullPrice > 0 ? (commissionValue / fullPrice) * 100 : 0;

    const analysisMessages = [
        "Conectando con el servidor de IA...",
        "Analizando estructura del sitio web...",
        "Extrayendo ADN de marketing y copywriting...",
        "Detectando nicho y propuesta de valor..."
    ];

    useEffect(() => {
        let interval: any;
        if (analyzing) {
            interval = setInterval(() => {
                setLoadingMessageIndex((prev) => (prev + 1) % analysisMessages.length);
            }, 2500);
        } else {
            setLoadingMessageIndex(0);
        }
        return () => clearInterval(interval);
    }, [analyzing]);

    useEffect(() => {
        const isRealAdmin = user.role === 'admin' && !isSimulating;
        if (!id && !isRealAdmin && user.planLimits) {
            const max = user.planLimits.maxProjects;
            if (projectCount >= max) {
                setShowUpgradeModal(true);
            }
        }
        if (id) {
            loadProject(id);
        }
    }, [id, user, projectCount, isSimulating]);

    const loadProject = async (projectId: string) => {
        setLoading(true);
        try {
            const proj = await api.getProjectById(projectId);
            if (proj) {
                setName(proj.name);
                setProductName(proj.productName);
                setDescription(proj.description);
                setBrandTone(proj.brandTone || 'Amigable y Cercano');
                setFullPrice(proj.fullPrice || 0);
                if (proj.commissionRate && proj.fullPrice) {
                    setCommissionValue(proj.commissionRate * proj.fullPrice);
                }
                setLeadMagnetType(proj.leadMagnetType || '');
                setLeadMagnetUrl(proj.leadMagnetUrl || '');
                setDigitalProductUrl(proj.digitalProductUrl || '');
                setSalesPageUrl(proj.salesPageUrl || '');
                setNiche(proj.niche || '');
                setTargetAudience(proj.targetAudience || '');
                setMainGoal(proj.mainGoal || 'Venta Directa');
                setPainPoints(proj.painPoints || []);
                setKeyBenefits(proj.keyBenefits || []);
                setAffiliateLinks(proj.affiliateLinks && proj.affiliateLinks.length > 0 ? proj.affiliateLinks : [
                    { label: 'Hotlink Principal Precio Full', url: '' },
                    { label: 'Hotlink con Descuento', url: '' }
                ]);
                setIsMaster(!!proj.isMaster);
                setMasterParentId(proj.masterParentId);
                setOriginalStrategyJson(proj.strategy_json);
                const avatars = proj.strategy_json?.avatars || [];
                const hasSavedAvatars = avatars.length > 0;
                const initialized = [0, 1, 2].map((idx) => {
                    const masterAv = avatars[idx] || {};
                    const defAv = hasSavedAvatars ? getBlankAvatar(idx) : DEFAULT_AVATARS_DATA[idx];
                    
                    const defaultMotivations = defAv.motivations || {};
                    const rawMotivations = masterAv.motivations || {};
                    const healedMotivations = { ...defaultMotivations };
                    for (const k of ['dinero', 'tiempo', 'estatus', 'seguridad'] as const) {
                        const val = rawMotivations[k];
                        const isNumeric = val !== undefined && val !== null && val !== '' && (!isNaN(Number(val)) || typeof val === 'number');
                        if (val && !isNumeric) {
                            healedMotivations[k] = val;
                        }
                    }

                    return {
                        ...defAv,
                        ...masterAv,
                        name: masterAv.name || defAv.name || '',
                        education: masterAv.education || masterAv.studies || defAv.education || '',
                        studies: masterAv.studies || masterAv.education || defAv.studies || '',
                        archetype: masterAv.archetype || masterAv.occupation || defAv.archetype || '',
                        occupation: masterAv.occupation || masterAv.archetype || defAv.occupation || '',
                        incomeRange: masterAv.incomeRange || masterAv.income || defAv.incomeRange || '',
                        income: masterAv.income || masterAv.incomeRange || defAv.income || '',
                        location: masterAv.location || masterAv.geographic || defAv.location || '',
                        geographic: masterAv.geographic || masterAv.location || defAv.geographic || '',
                        civilStatus: masterAv.civilStatus || masterAv.marital_status || defAv.civilStatus || '',
                        marital_status: masterAv.marital_status || masterAv.civilStatus || defAv.marital_status || '',
                        devices: masterAv.devices || defAv.devices || '',
                        dolores_principales: masterAv.dolores_principales || [...defAv.dolores_principales],
                        deseos_principales: masterAv.deseos_principales || [...defAv.deseos_principales],
                        quote: masterAv.quote || defAv.quote || '',
                        dolores_ocultos: masterAv.dolores_ocultos || [...defAv.dolores_ocultos],
                        deseos_motivaciones: masterAv.deseos_motivaciones || [...defAv.deseos_motivaciones],
                        comportamientos: masterAv.comportamientos || [...defAv.comportamientos],
                        behaviors: masterAv.behaviors || [...defAv.behaviors],
                        motivations: healedMotivations
                    };
                });
                setTempAvatars(initialized);
                if (proj.multimedia_json) {
                    setMultimedia({
                        heroImages: proj.multimedia_json.heroImages || [],
                        videoUrls: proj.multimedia_json.videoUrls || ((proj.multimedia_json as any).videoUrl ? [(proj.multimedia_json as any).videoUrl] : []),
                        descriptiveImages: proj.multimedia_json.descriptiveImages || [],
                        instructorImage: proj.multimedia_json.instructorImage || ''
                    });
                }
            }
        } catch (error) {
            console.error("Error loading project", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLinkUpdate = (index: number, field: 'label' | 'url', value: string) => {
        const newLinks = [...affiliateLinks];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setAffiliateLinks(newLinks);
    };

    const handleAnalyzeSite = async () => {
        if (!salesPageUrl) return alert('Por favor ingresa una URL para analizar.');
        setAnalyzing(true);
        try {
            const data = await api.analyzeSite(salesPageUrl);
            if (data.productName) {
                setProductName(data.productName);
                setName(data.productName); // Sincronización automática de nombre de proyecto
            }
            if (data.description) setDescription(data.description);
            if (data.niche) setNiche(data.niche);
            setShowAnalyzeConfirm(false);
        } catch (error: any) {
            console.error("Analysis failure:", error);
            alert(error.message || 'No se pudo analizar el sitio. Es posible que el servidor de la web bloquee el acceso automático o que la URL no sea válida.');
            setShowAnalyzeConfirm(false);
        } finally {
            setAnalyzing(false);
        }
    };

    const nextStep = () => {
        if (step === 1) {
            const newErrors: Record<string, string> = {};
            if (!name.trim()) newErrors.name = "Este campo es obligatorio para que la IA genere tu estrategia";
            if (!productName.trim()) newErrors.productName = "Este campo es obligatorio para que la IA genere tu estrategia";
            if (!leadMagnetType) newErrors.leadMagnetType = "Este campo es obligatorio para que la IA genere tu estrategia";
            if (leadMagnetType && !(leadMagnetUrl || '').trim()) newErrors.leadMagnetUrl = "Este campo es obligatorio para que la IA genere tu estrategia";
            
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }
        }
        setErrors({});
        setStep(step + 1);
    };

    const saveProject = async () => {
        if (!name || !productName) return alert('Por favor completa el nombre del proyecto y del producto.');
        setLoading(true);

        const currentStrategy = originalStrategyJson ? JSON.parse(JSON.stringify(originalStrategyJson)) : {};
        currentStrategy.avatars = tempAvatars;
        
        const projectData: any = {
            name,
            productName,
            description,
            brandTone,
            fullPrice,
            commissionRate: fullPrice > 0 ? commissionValue / fullPrice : 0,
            leadMagnetType,
            leadMagnetUrl,
            salesPageUrl,
            digitalProductUrl: masterParentId ? undefined : digitalProductUrl,
            niche: niche || name, 
            targetAudience: targetAudience || '',
            mainGoal: mainGoal || 'Venta Directa',
            painPoints: painPoints,
            keyBenefits: keyBenefits,
            affiliateLinks: affiliateLinks.filter(l => (l.url || '').trim() !== ''),
            isMaster: (user.role === 'admin' && !isSimulating) ? isMaster : false,
            multimedia_json: (user.role === 'admin' && !isSimulating) ? multimedia : undefined,
            strategy_json: currentStrategy
        };

        if (!id) {
            projectData.planSlug = 'starter';
        }

        try {
            if (id) {
                setLoadingStatus('Actualizando proyecto...');
                await api.updateProject(id, projectData as any);
                navigate(`/dashboard/projects/${id}/strategy`);
            } else {
                setLoadingStatus('Fase 1/2: Guardando información en base de datos...');
                const saved = await api.createProject(projectData as any);
                const projectId = saved.id;
                
                setLoadingStatus('Fase 2/2: La IA está diseñando tu Estrategia Maestra (esto puede tardar unos 20 segundos)...');
                await api.generateProjectStrategyFull(projectId);
                navigate(`/dashboard/projects/${projectId}/strategy`);
            }
        } catch (error) {
            console.error(error);
            alert('Error al procesar el proyecto. Revisa tu conexión.');
            setLoading(false);
            setLoadingStatus('');
        }
    };

    if (loading && id && !loadingStatus) {
        return (
            <div className="flex items-center justify-center h-64 text-white">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-12 relative">
            <UpgradeModal 
                isOpen={showUpgradeModal} 
                onClose={() => navigate('/dashboard/projects')} 
                user={user}
                userId={user.id}
                reason={`Has alcanzado el límite de ${user.planLimits?.maxProjects} proyectos de tu plan ${user.planLimits?.planName}.`}
            />
            {loadingStatus && (
                <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
                    <div className="relative mb-10">
                        <div className="absolute -inset-10 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
                        <div className="w-24 h-24 bg-gray-900 border-4 border-primary/30 rounded-3xl flex items-center justify-center shadow-2xl relative">
                            <Brain className="w-12 h-12 text-primary animate-bounce" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-green-500 p-2 rounded-full shadow-lg border-2 border-black">
                            <Sparkles className="w-4 h-4 text-white animate-spin-slow" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-4 tracking-tight max-w-lg">Tu Estrategia está siendo diseñada...</h3>
                    <p className="text-blue-400 font-bold mb-8 uppercase tracking-widest text-sm animate-pulse">{loadingStatus}</p>
                    <div className="w-full max-w-sm bg-gray-800 h-2 rounded-full overflow-hidden border border-white/5 shadow-inner">
                        <div className="h-full bg-gradient-to-r from-primary to-indigo-600 w-full origin-left animate-loading-bar"></div>
                    </div>
                    <p className="text-gray-500 text-xs mt-10 max-w-xs leading-relaxed italic">"Estamos analizando tu nicho, redactando secuencias de email y configurando tu embudo psicológico de ventas."</p>
                </div>
            )}

            {/* Modal de Confirmación de Análisis y Estado de Carga */}
            {showAnalyzeConfirm && (
                <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in" onClick={() => !analyzing && setShowAnalyzeConfirm(false)}>
                    <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 p-8 text-center space-y-6" onClick={e => e.stopPropagation()}>
                        {analyzing ? (
                            <div className="py-10 flex flex-col items-center space-y-8 animate-in fade-in duration-300">
                                <div className="relative">
                                    <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                                    <Loader2 className="w-16 h-16 animate-spin text-primary relative z-10" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter italic animate-pulse">
                                        {analysisMessages[loadingMessageIndex]}
                                    </h3>
                                    <div className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl">
                                        <p className="text-red-400 text-xs font-black uppercase tracking-widest">
                                            ⚠️ No cierres esta página, el proceso está en curso...
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="w-16 h-16 bg-blue-900/30 text-blue-400 border border-blue-800/50 rounded-2xl flex items-center justify-center mx-auto">
                                    <AlertTriangle className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black text-white tracking-tight">¿Confirmar Análisis?</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    ¿Estás seguro de analizar este sitio? Antes de continuar, verifica que la página sea accesible y sea la página que desea analizar, ya que solo podrá verificarlo 1 vez cada hora.
                                </p>
                                <div className="flex flex-col gap-3 pt-4">
                                    <button onClick={handleAnalyzeSite} className="w-full py-4 bg-primary hover:bg-indigo-600 text-white font-black rounded-xl transition-all shadow-lg shadow-primary/20">Sí, analizar sitio ahora</button>
                                    <button onClick={() => setShowAnalyzeConfirm(false)} className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-gray-400 font-bold rounded-xl transition-all">Cancelar</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <button onClick={() => navigate('/dashboard/projects')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Volver a Proyectos
            </button>
            <div className={`bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden ${showUpgradeModal || loadingStatus ? 'opacity-30 pointer-events-none' : ''}`}>
                <div className="bg-gray-800/50 p-6 border-b border-gray-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" /> {id ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
                        </h2>
                        <p className="text-sm text-gray-400">Paso {step} de 3</p>
                    </div>
                    <div className="flex gap-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`h-2 w-12 rounded-full transition-all duration-300 ${i <= step ? 'bg-primary shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-gray-700'}`}></div>
                        ))}
                    </div>
                </div>
                <div className="p-8 min-h-[450px]">
                    {step === 1 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                            {/* CONFIGURACIÓN PROYECTO MAESTRO REDISEÑADA (SOLO ADMIN REAL) */}
                            {user.role === 'admin' && !isSimulating && (
                                <div className="bg-yellow-500/10 border border-yellow-500/30 p-10 rounded-[3rem] animate-in slide-in-from-top-2 shadow-[0_0_50px_rgba(234,179,8,0.15)] relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                                        <Star className="w-48 h-48 text-yellow-500" />
                                    </div>
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                                        <div className="flex items-center gap-6">
                                            <div className="p-5 bg-yellow-500/20 rounded-[2rem] text-yellow-500 shadow-xl border border-yellow-500/20 group-hover:scale-105 transition-transform duration-500">
                                                <Crown className="w-10 h-10 fill-current" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-black text-2xl uppercase tracking-tighter italic leading-none">Publicar en Biblioteca Maestra</h4>
                                                <p className="text-yellow-500/70 text-xs font-black uppercase tracking-[0.25em] mt-3">Visible para todos los usuarios de la plataforma</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 bg-black/40 p-2.5 rounded-[1.5rem] border border-white/5 shadow-inner">
                                            <button 
                                                type="button"
                                                onClick={() => setIsMaster(true)}
                                                className={`px-10 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isMaster ? 'bg-yellow-500 text-black shadow-xl shadow-yellow-900/40 transform scale-105' : 'text-gray-500 hover:text-white'}`}
                                            >
                                                SÍ, PÚBLICO
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => setIsMaster(false)}
                                                className={`px-10 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${!isMaster ? 'bg-gray-700 text-white shadow-xl transform scale-105' : 'text-gray-500 hover:text-white'}`}
                                            >
                                                NO, PRIVADO
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* GESTIÓN DE MULTIMEDIA (SOLO ADMIN REAL) */}
                            {user.role === 'admin' && !isSimulating && (
                                <div className="bg-blue-500/10 border border-blue-500/30 p-8 rounded-[3rem] space-y-8 shadow-[0_0_50px_rgba(59,130,246,0.1)]">
                                    <div className="flex items-center gap-4 border-b border-blue-500/20 pb-4">
                                        <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
                                            <Palette className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-black text-xl uppercase tracking-tighter italic">Recursos Multimedia del Proyecto</h4>
                                            <p className="text-blue-400/70 text-[10px] font-black uppercase tracking-widest">Configuración exclusiva para administradores</p>
                                        </div>
                                    </div>

                                    {/* HERO IMAGES */}
                                    <div className="space-y-4">
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Imágenes Hero (Parte Superior)</label>
                                        <div className="grid gap-3">
                                            {multimedia.heroImages.map((img, idx) => (
                                                <div key={idx} className="flex gap-2">
                                                    <input 
                                                        type="text" 
                                                        value={img} 
                                                        onChange={(e) => {
                                                            const newImgs = [...multimedia.heroImages];
                                                            newImgs[idx] = e.target.value;
                                                            setMultimedia({ ...multimedia, heroImages: newImgs });
                                                        }}
                                                        className="flex-1 bg-black border border-gray-800 rounded-xl px-4 py-2 text-xs text-blue-300 outline-none focus:border-blue-500"
                                                        placeholder="URL de imagen hero..."
                                                    />
                                                    <button 
                                                        onClick={() => {
                                                            const newImgs = multimedia.heroImages.filter((_, i) => i !== idx);
                                                            setMultimedia({ ...multimedia, heroImages: newImgs });
                                                        }}
                                                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button 
                                                onClick={() => setMultimedia({ ...multimedia, heroImages: [...multimedia.heroImages, ''] })}
                                                className="w-full py-2 border border-dashed border-gray-800 rounded-xl text-[10px] font-bold text-gray-500 hover:text-blue-400 hover:border-blue-500/30 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Plus className="w-3 h-3" /> Añadir Imagen Hero
                                            </button>
                                        </div>
                                    </div>

                                    {/* VIDEO URLS */}
                                    <div className="space-y-4">
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Videos Hero (YouTube / MP4)</label>
                                        <div className="grid gap-3">
                                            {multimedia.videoUrls.map((url, idx) => (
                                                <div key={idx} className="flex gap-2">
                                                    <input 
                                                        type="text" 
                                                        value={url} 
                                                        onChange={(e) => {
                                                            const newUrls = [...multimedia.videoUrls];
                                                            newUrls[idx] = e.target.value;
                                                            setMultimedia({ ...multimedia, videoUrls: newUrls });
                                                        }}
                                                        className="flex-1 bg-black border border-gray-800 rounded-xl px-4 py-2 text-xs text-blue-300 outline-none focus:border-blue-500"
                                                        placeholder="URL de video..."
                                                    />
                                                    <button 
                                                        onClick={() => {
                                                            const newUrls = multimedia.videoUrls.filter((_, i) => i !== idx);
                                                            setMultimedia({ ...multimedia, videoUrls: newUrls });
                                                        }}
                                                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button 
                                                onClick={() => setMultimedia({ ...multimedia, videoUrls: [...multimedia.videoUrls, ''] })}
                                                className="w-full py-2 border border-dashed border-gray-800 rounded-xl text-[10px] font-bold text-gray-500 hover:text-blue-400 hover:border-blue-500/30 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Plus className="w-3 h-3" /> Añadir Video Hero
                                            </button>
                                        </div>
                                    </div>

                                    {/* DESCRIPTIVE IMAGES */}
                                    <div className="space-y-4">
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Imágenes Descriptivas (Más Información)</label>
                                        <div className="grid gap-3">
                                            {multimedia.descriptiveImages.map((img, idx) => (
                                                <div key={idx} className="flex gap-2">
                                                    <input 
                                                        type="text" 
                                                        value={img} 
                                                        onChange={(e) => {
                                                            const newImgs = [...multimedia.descriptiveImages];
                                                            newImgs[idx] = e.target.value;
                                                            setMultimedia({ ...multimedia, descriptiveImages: newImgs });
                                                        }}
                                                        className="flex-1 bg-black border border-gray-800 rounded-xl px-4 py-2 text-xs text-blue-300 outline-none focus:border-blue-500"
                                                        placeholder="URL de imagen descriptiva..."
                                                    />
                                                    <button 
                                                        onClick={() => {
                                                            const newImgs = multimedia.descriptiveImages.filter((_, i) => i !== idx);
                                                            setMultimedia({ ...multimedia, descriptiveImages: newImgs });
                                                        }}
                                                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button 
                                                onClick={() => setMultimedia({ ...multimedia, descriptiveImages: [...multimedia.descriptiveImages, ''] })}
                                                className="w-full py-2 border border-dashed border-gray-800 rounded-xl text-[10px] font-bold text-gray-500 hover:text-blue-400 hover:border-blue-500/30 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Plus className="w-3 h-3" /> Añadir Imagen Descriptiva
                                            </button>
                                        </div>
                                    </div>

                                    {/* INSTRUCTOR IMAGE */}
                                    <div className="space-y-4 pt-4 border-t border-blue-500/10">
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Foto del Profesor / Tutor (Biblioteca)</label>
                                        <div className="flex gap-3 items-center">
                                            <div className="w-16 h-16 rounded-xl bg-black border border-gray-800 overflow-hidden flex-shrink-0">
                                                {multimedia.instructorImage ? (
                                                    <img src={multimedia.instructorImage} alt="Profesor" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-700">
                                                        <UserIcon className="w-8 h-8" />
                                                    </div>
                                                )}
                                            </div>
                                            <input 
                                                type="text" 
                                                value={multimedia.instructorImage || ''} 
                                                onChange={(e) => setMultimedia({ ...multimedia, instructorImage: e.target.value })}
                                                className="flex-1 bg-black border border-gray-800 rounded-xl px-4 py-3 text-xs text-blue-300 outline-none focus:border-blue-500"
                                                placeholder="URL de la foto del profesor..."
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-500 italic">Esta imagen aparecerá en la "Biblioteca" del editor web para que el usuario pueda seleccionarla fácilmente.</p>
                                    </div>

                                    {/* URL del Producto Digital (SOLO ADMIN) */}
                                    <div className="space-y-4 pt-4 border-t border-blue-500/10">
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <Rocket className="w-4 h-4 text-blue-400" /> URL del Producto Digital de Hotmart
                                        </label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                value={digitalProductUrl} 
                                                onChange={e => setDigitalProductUrl(e.target.value)} 
                                                placeholder="https://app-vlc.hotmart.com/affiliate-links/..."
                                                disabled={!!masterParentId}
                                                className={`w-full bg-black border ${masterParentId ? 'border-blue-500/30 opacity-70' : 'border-gray-800'} rounded-xl px-4 py-3 text-xs text-blue-300 outline-none focus:border-blue-500`}
                                            />
                                            {masterParentId && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[8px] font-black text-blue-400 uppercase bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20">
                                                    <CheckCircle2 className="w-2 h-2" /> Heredado del Maestro
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-gray-500 italic">
                                            {masterParentId 
                                                ? "Este proyecto es un duplicado. La URL se hereda automáticamente del proyecto maestro y no puede modificarse aquí."
                                                : "Enlace de reclutamiento de Hotmart para que los usuarios se afilien."}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="border-b border-gray-800 pb-4">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-blue-400" /> Identidad y Estilo
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">Define qué vendes y cómo debe comunicarse tu marca.</p>
                            </div>

                            <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl">
                                <label className="block text-sm font-bold text-primary mb-3 uppercase tracking-wider flex items-center gap-2">
                                    <Globe className="w-4 h-4" /> Analizador Inteligente (Opcional)
                                </label>
                                <div className="flex flex-col md:flex-row gap-3">
                                    <input type="text" value={salesPageUrl} onChange={e => setSalesPageUrl(e.target.value)} className="flex-1 bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-all placeholder:text-gray-600" placeholder="Pega la URL de tu página de ventas (ej: Hotmart)..." />
                                    <button onClick={() => setShowAnalyzeConfirm(true)} disabled={analyzing || !salesPageUrl} className="bg-primary hover:bg-indigo-600 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                                        {analyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                                        {analyzing ? 'Analizando...' : 'Analizar Sitio'}
                                    </button>
                                </div>
                                <p className="text-[11px] text-gray-500 mt-3 italic">* La IA leerá tu página actual para autocompletar el nombre y la descripción profesional de tu proyecto.</p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6 pt-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Nombre del Proyecto</label>
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} className={`w-full bg-black border ${errors.name ? 'border-red-500 animate-pulse' : 'border-gray-700'} rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-all placeholder:text-gray-700`} placeholder="Ej: Lanzamiento Uñas Pro" />
                                    {errors.name && <p className="text-red-500 text-xs mt-2 font-medium">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Nombre del Producto</label>
                                    <input type="text" value={productName} onChange={e => setProductName(e.target.value)} className={`w-full bg-black border ${errors.productName ? 'border-red-500 animate-pulse' : 'border-gray-700'} rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-all placeholder:text-gray-700`} placeholder="Ej: Masterclass Uñas Perfectas" />
                                    {errors.productName && <p className="text-red-500 text-xs mt-2 font-medium">{errors.productName}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Descripción del Producto (Editor Visual)</label>
                                <VisualEditor 
                                    value={description} 
                                    onChange={val => setDescription(val)} 
                                    placeholder="Describe brevemente de qué trata para que la IA genere el copy..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Lead Magnet (Regalo)</label>
                                <select value={leadMagnetType} onChange={e => setLeadMagnetType(e.target.value)} className={`w-full bg-black border ${errors.leadMagnetType ? 'border-red-500 animate-pulse' : 'border-gray-700'} rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-all appearance-none cursor-pointer mb-4`}>
                                    <option value="">Selecciona tu Lead Magnet</option>
                                    <option value="Ebook / Guía PDF">Ebook / Guía PDF</option>
                                    <option value="Clase Gratis / VSL">Clase Gratis / Carta de Ventas en Video</option>
                                    <option value="Masterclass en Vivo">Masterclass en Vivo</option>
                                    <option value="Plantilla / Checklist">Plantilla / Checklist</option>
                                </select>
                                {errors.leadMagnetType && <p className="text-red-500 text-xs mt-0 mb-4 font-medium">{errors.leadMagnetType}</p>}
                                {leadMagnetType && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wide">Enlace de la {leadMagnetType}</label>
                                        <input 
                                            type="text" 
                                            value={leadMagnetUrl} 
                                            onChange={(e) => setLeadMagnetUrl(e.target.value)} 
                                            className={`w-full bg-black border ${errors.leadMagnetUrl ? 'border-red-500 animate-pulse' : 'border-gray-700'} rounded-xl px-4 py-3 text-blue-400 focus:border-primary outline-none transition-all placeholder:text-gray-700`} 
                                            placeholder="https://..." 
                                        />
                                        {errors.leadMagnetUrl && <p className="text-red-500 text-xs mt-2 font-medium">{errors.leadMagnetUrl}</p>}
                                    </div>
                                )}
                            </div>

                            <div className="border border-gray-800 rounded-2xl p-6 bg-zinc-950/40 flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2 font-sans">
                                        <Users className="w-5 h-5 text-[#FF5D1E]" /> Estrategia de Avatares del Proyecto
                                    </h3>
                                    <p className="text-xs text-gray-400 font-sans">
                                        Administra y edita manualmente los datos sociodemográficos de los 3 avatares de tu biblioteca para personalizar su inteligencia.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const avatars = originalStrategyJson?.avatars || [];
                                        const hasSavedAvatars = avatars.length > 0;
                                        const initialized = [0, 1, 2].map((idx) => {
                                            const masterAv = avatars[idx] || {};
                                            const defAv = hasSavedAvatars ? getBlankAvatar(idx) : DEFAULT_AVATARS_DATA[idx];
                                            
                                            const defaultMotivations = defAv.motivations || {};
                                            const rawMotivations = masterAv.motivations || {};
                                            const healedMotivations = { ...defaultMotivations };
                                            for (const k of ['dinero', 'tiempo', 'estatus', 'seguridad'] as const) {
                                                const val = rawMotivations[k];
                                                const isNumeric = val !== undefined && val !== null && val !== '' && (!isNaN(Number(val)) || typeof val === 'number');
                                                if (val && !isNumeric) {
                                                    healedMotivations[k] = val;
                                                }
                                            }

                                            return {
                                                ...defAv,
                                                ...masterAv,
                                                name: masterAv.name || defAv.name || '',
                                                education: masterAv.education || masterAv.studies || defAv.education || '',
                                                studies: masterAv.studies || masterAv.education || defAv.studies || '',
                                                archetype: masterAv.archetype || masterAv.occupation || defAv.archetype || '',
                                                occupation: masterAv.occupation || masterAv.archetype || defAv.occupation || '',
                                                incomeRange: masterAv.incomeRange || masterAv.income || defAv.incomeRange || '',
                                                income: masterAv.income || masterAv.incomeRange || defAv.income || '',
                                                location: masterAv.location || masterAv.geographic || defAv.location || '',
                                                geographic: masterAv.geographic || masterAv.location || defAv.geographic || '',
                                                civilStatus: masterAv.civilStatus || masterAv.marital_status || defAv.civilStatus || '',
                                                marital_status: masterAv.marital_status || masterAv.civilStatus || defAv.marital_status || '',
                                                devices: masterAv.devices || defAv.devices || '',
                                                dolores_principales: masterAv.dolores_principales || [...defAv.dolores_principales],
                                                deseos_principales: masterAv.deseos_principales || [...defAv.deseos_principales],
                                                quote: masterAv.quote || defAv.quote || '',
                                                dolores_ocultos: masterAv.dolores_ocultos || [...defAv.dolores_ocultos],
                                                deseos_motivaciones: masterAv.deseos_motivaciones || [...defAv.deseos_motivaciones],
                                                comportamientos: masterAv.comportamientos || [...defAv.comportamientos],
                                                behaviors: masterAv.behaviors || [...defAv.behaviors],
                                                motivations: healedMotivations
                                            };
                                        });
                                        setTempAvatars(initialized);
                                        setIsOpenAvatarsModal(true);
                                    }}
                                    className="flex items-center gap-2 bg-gradient-to-r from-[#FF5D1E] to-amber-500 text-white font-bold px-5 py-3 rounded-xl transition-all hover:opacity-90 hover:scale-[1.02] shadow-lg shadow-orange-500/10 active:scale-[0.98] text-sm whitespace-nowrap cursor-pointer"
                                    id="btn-edit-avatars-wizard"
                                >
                                    <Users className="w-4 h-4" /> Editar Avatares del Proyecto
                                </button>
                            </div>

                            {/* AVATARS MODAL */}
                            {isOpenAvatarsModal && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
                                    <div className="bg-[#111115] border border-gray-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                                        
                                        {/* Header */}
                                        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 bg-orange-500/10 rounded-xl">
                                                    <Users className="w-6 h-6 text-[#FF5D1E]" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-white font-sans">Editar Avatares del Proyecto</h3>
                                                    <p className="text-xs text-gray-500 mt-0.5 font-sans">Personaliza de forma manual los datos, comportamientos y secretos psicológicos de los 3 avatares.</p>
                                                </div>
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => setIsOpenAvatarsModal(false)}
                                                className="text-gray-500 hover:text-white p-2 rounded-xl hover:bg-gray-800/50 transition-all cursor-pointer"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>

                                        {/* Avatar Cards Accordion Area */}
                                        <div className="p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
                                            {tempAvatars.map((av, idx) => {
                                                const isExpanded = expandedAvatarIdx === idx;
                                                const badgeText = av.priority || (idx === 0 ? "PRINCIPAL" : idx === 1 ? "SECUNDARIO" : "COMPLEMENTARIO");
                                                const priorityClass = av.priorityClass || (idx === 0 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 border" : idx === 1 ? "bg-amber-500/10 border-amber-500/30 text-amber-550 border" : "bg-violet-500/10 border-violet-500/30 text-violet-400 border");
                                                const avatarImg = av.img || av.image || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300";

                                                return (
                                                    <div key={idx} className={`bg-[#16161c] border rounded-3xl overflow-hidden transition-all duration-300 ${isExpanded ? 'border-orange-500/50 shadow-[0_0_25px_rgba(255,93,30,0.15)] bg-[#191922]' : 'border-zinc-800 hover:border-zinc-700 bg-[#121217]'}`}>
                                                        {/* Header Toggle Clickable Area */}
                                                        <div 
                                                            onClick={() => setExpandedAvatarIdx(isExpanded ? null : idx)}
                                                            className="p-6 cursor-pointer flex items-center justify-between gap-4 select-none"
                                                        >
                                                            <div className="flex items-center gap-5">
                                                                <div className="relative">
                                                                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full blur opacity-40 transition duration-300"></div>
                                                                    <img 
                                                                        src={avatarImg} 
                                                                        className="w-16 h-16 rounded-full object-cover border-2 border-orange-505 relative z-10 shadow-[0_0_12px_rgba(255,93,30,0.45)]"
                                                                        referrerPolicy="no-referrer"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-3 flex-wrap">
                                                                        <h4 className="text-lg font-black text-white font-sans leading-none">{av.name}</h4>
                                                                        <span className={`px-2.5 py-0.5 rounded text-[9px] font-black tracking-widest ${priorityClass}`}>
                                                                            {badgeText}
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-[13px] text-zinc-400 mt-2 flex items-center gap-2 flex-wrap font-sans">
                                                                        <span>📅 {av.age || av.ageRange || '28 - 35 años'}</span>
                                                                        <span className="text-zinc-600">•</span>
                                                                        <span>💼 {av.occupation || av.archetype || 'Cosmetóloga'}</span>
                                                                        <span className="text-zinc-600">•</span>
                                                                        <span>💰 {av.income || av.incomeRange || 'Ingresos variables'}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className={`p-2 bg-zinc-800/40 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-all transform ${isExpanded ? 'rotate-180 text-orange-500' : ''}`}>
                                                                <ChevronDown className="w-5 h-5" />
                                                            </div>
                                                        </div>

                                                        {/* Expanded Content Section */}
                                                        {isExpanded && (
                                                            <div className="border-t border-zinc-800/80 bg-black/40 p-6 space-y-6">
                                                                {/* Subtabs Header */}
                                                                <div className="flex flex-wrap gap-1.5 p-1 bg-zinc-950 rounded-2xl border border-zinc-900">
                                                                    {[
                                                                        { id: 'resumen', label: 'Resumen' },
                                                                        { id: 'demografico', label: 'Perfil Demográfico' },
                                                                        { id: 'dolores', label: 'Dolores y Miedos' },
                                                                        { id: 'deseos', label: 'Deseos y Motivaciones' },
                                                                        { id: 'comportamientos', label: 'Comportamientos' }
                                                                    ].map((tab) => {
                                                                        const isSubActive = modalSubTab === tab.id;
                                                                        return (
                                                                            <button
                                                                                key={tab.id}
                                                                                type="button"
                                                                                onClick={() => setModalSubTab(tab.id)}
                                                                                className={`flex-grow md:flex-1 min-w-[120px] text-center py-2.5 px-3 rounded-xl font-bold text-xs transition-all ${
                                                                                    isSubActive 
                                                                                        ? 'bg-[#FF5D1E] text-white shadow-md' 
                                                                                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/35'
                                                                                }`}
                                                                            >
                                                                                {tab.label}
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </div>

                                                                {/* Sub-tab rendering */}
                                                                <div className="space-y-6 animate-in fade-in duration-200">
                                                                    {/* SUBTAB: RESUMEN */}
                                                                    {modalSubTab === 'resumen' && (
                                                                        <div className="space-y-5">
                                                                            <div className="grid md:grid-cols-2 gap-4">
                                                                                <div className="space-y-1">
                                                                                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center justify-between">
                                                                                        <span>Dolor Crítico</span>
                                                                                        {!av.dolores_principales?.[0] && <span className="text-amber-500 lowercase italic text-[9px] font-normal">(vacío)</span>}
                                                                                    </label>
                                                                                    <textarea 
                                                                                        value={av.dolores_principales?.[0] || ''} 
                                                                                        onChange={e => {
                                                                                            const copy = [...tempAvatars];
                                                                                            const currentDol = [...(copy[idx].dolores_principales || [])];
                                                                                            while (currentDol.length < 1) currentDol.push('');
                                                                                            currentDol[0] = e.target.value;
                                                                                            copy[idx] = { ...copy[idx], dolores_principales: currentDol };
                                                                                            setTempAvatars(copy);
                                                                                        }}
                                                                                        className={`w-full bg-zinc-950 border ${!av.dolores_principales?.[0] ? 'border-amber-500/20 bg-amber-500/5' : 'border-zinc-800'} rounded-xl px-4 py-2.5 text-white focus:border-orange-500 outline-none text-xs font-sans`}
                                                                                        rows={2}
                                                                                        placeholder="El dolor más crítico e inmediato del cliente..."
                                                                                    />
                                                                                </div>
                                                                                <div className="space-y-1">
                                                                                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center justify-between">
                                                                                        <span>Transformación Deseada</span>
                                                                                        {!av.deseos_principales?.[0] && <span className="text-amber-500 lowercase italic text-[9px] font-normal">(vacío)</span>}
                                                                                    </label>
                                                                                    <textarea 
                                                                                        value={av.deseos_principales?.[0] || ''} 
                                                                                        onChange={e => {
                                                                                            const copy = [...tempAvatars];
                                                                                            const currentDes = [...(copy[idx].deseos_principales || [])];
                                                                                            while (currentDes.length < 1) currentDes.push('');
                                                                                            currentDes[0] = e.target.value;
                                                                                            copy[idx] = { ...copy[idx], deseos_principales: currentDes };
                                                                                            setTempAvatars(copy);
                                                                                        }}
                                                                                        className={`w-full bg-zinc-950 border ${!av.deseos_principales?.[0] ? 'border-amber-500/20 bg-amber-500/5' : 'border-zinc-800'} rounded-xl px-4 py-2.5 text-white focus:border-orange-500 outline-none text-xs font-sans`}
                                                                                        rows={2}
                                                                                        placeholder="Consolidar un negocio o la meta máxima del cliente..."
                                                                                    />
                                                                                </div>
                                                                                <div className="space-y-1">
                                                                                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center justify-between">
                                                                                        <span>Barrera de Venta</span>
                                                                                        {!av.dolores_principales?.[1] && <span className="text-amber-500 lowercase italic text-[9px] font-normal">(vacío)</span>}
                                                                                    </label>
                                                                                    <textarea 
                                                                                        value={av.dolores_principales?.[1] || ''} 
                                                                                        onChange={e => {
                                                                                            const copy = [...tempAvatars];
                                                                                            const currentDol = [...(copy[idx].dolores_principales || [])];
                                                                                            while (currentDol.length < 2) currentDol.push('');
                                                                                            currentDol[1] = e.target.value;
                                                                                            copy[idx] = { ...copy[idx], dolores_principales: currentDol };
                                                                                            setTempAvatars(copy);
                                                                                        }}
                                                                                        className={`w-full bg-zinc-950 border ${!av.dolores_principales?.[1] ? 'border-amber-500/20 bg-amber-500/5' : 'border-zinc-800'} rounded-xl px-4 py-2.5 text-white focus:border-orange-500 outline-none text-xs font-sans`}
                                                                                        rows={2}
                                                                                        placeholder="Por qué no compra actualmente..."
                                                                                    />
                                                                                </div>
                                                                                <div className="space-y-1">
                                                                                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center justify-between">
                                                                                        <span>Para qué Emocional</span>
                                                                                        {!av.deseos_principales?.[1] && <span className="text-amber-500 lowercase italic text-[9px] font-normal">(vacío)</span>}
                                                                                    </label>
                                                                                    <textarea 
                                                                                        value={av.deseos_principales?.[1] || ''} 
                                                                                        onChange={e => {
                                                                                            const copy = [...tempAvatars];
                                                                                            const currentDes = [...(copy[idx].deseos_principales || [])];
                                                                                            while (currentDes.length < 2) currentDes.push('');
                                                                                            currentDes[1] = e.target.value;
                                                                                            copy[idx] = { ...copy[idx], deseos_principales: currentDes };
                                                                                            setTempAvatars(copy);
                                                                                        }}
                                                                                        className={`w-full bg-zinc-950 border ${!av.deseos_principales?.[1] ? 'border-amber-500/20 bg-amber-500/5' : 'border-zinc-800'} rounded-xl px-4 py-2.5 text-white focus:border-orange-500 outline-none text-xs font-sans`}
                                                                                        rows={2}
                                                                                        placeholder="La razón subyacente o emocional de su transformación..."
                                                                                    />
                                                                                </div>
                                                                            </div>

                                                                            <div className="space-y-1">
                                                                                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center justify-between">
                                                                                    <span>Frase de Conexión (Quote)</span>
                                                                                    {!av.quote && <span className="text-amber-500 lowercase italic text-[9px] font-normal">(vacío)</span>}
                                                                                </label>
                                                                                <textarea 
                                                                                    value={av.quote || ''} 
                                                                                    onChange={e => {
                                                                                        const copy = [...tempAvatars];
                                                                                        copy[idx] = { ...copy[idx], quote: e.target.value };
                                                                                        setTempAvatars(copy);
                                                                                    }}
                                                                                    className={`w-full bg-zinc-950 border ${!av.quote ? 'border-amber-500/20 bg-amber-500/5' : 'border-zinc-800'} rounded-xl px-4 py-2.5 text-white focus:border-orange-500 outline-none text-xs font-sans`}
                                                                                    rows={2}
                                                                                    placeholder="Quote o frase estelar con la que este cliente conecta de inmediato..."
                                                                                />
                                                                            </div>

                                                                            {/* drivers column */}
                                                                            <div className="space-y-2 mt-4">
                                                                                <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">Tarjetas de Decisión (Drivers)</label>
                                                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                                                                    <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-900/60">
                                                                                        <label className="block text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                                                                                            <span>💸 Dinero</span>
                                                                                            {!av.motivations?.dinero && <span className="text-amber-550 lowercase italic text-[8px] font-normal">(vacío)</span>}
                                                                                        </label>
                                                                                        <textarea 
                                                                                            rows={3}
                                                                                            value={av.motivations?.dinero || ''} 
                                                                                            onChange={e => {
                                                                                                const copy = [...tempAvatars];
                                                                                                copy[idx] = {
                                                                                                    ...copy[idx],
                                                                                                    motivations: { ...(copy[idx].motivations || {}), dinero: e.target.value }
                                                                                                };
                                                                                                setTempAvatars(copy);
                                                                                            }}
                                                                                            className={`w-full bg-black/60 border ${!av.motivations?.dinero ? 'border-amber-500/20 bg-amber-500/5' : 'border-zinc-800'} rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-orange-500 outline-none resize-none font-sans leading-relaxed`}
                                                                                            placeholder="Beneficios de dinero o retorno..."
                                                                                        />
                                                                                    </div>
                                                                                    <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-900/60">
                                                                                        <label className="block text-[10px] font-extrabold text-sky-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                                                                                            <span>⏱️ Tiempo</span>
                                                                                            {!av.motivations?.tiempo && <span className="text-amber-550 lowercase italic text-[8px] font-normal">(vacío)</span>}
                                                                                        </label>
                                                                                        <textarea 
                                                                                            rows={3}
                                                                                            value={av.motivations?.tiempo || ''} 
                                                                                            onChange={e => {
                                                                                                const copy = [...tempAvatars];
                                                                                                copy[idx] = {
                                                                                                    ...copy[idx],
                                                                                                    motivations: { ...(copy[idx].motivations || {}), tiempo: e.target.value }
                                                                                                };
                                                                                                setTempAvatars(copy);
                                                                                            }}
                                                                                            className={`w-full bg-black/60 border ${!av.motivations?.tiempo ? 'border-amber-500/20 bg-amber-500/5' : 'border-zinc-800'} rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-orange-500 outline-none resize-none font-sans leading-relaxed`}
                                                                                            placeholder="Valor del ahorro de tiempo..."
                                                                                        />
                                                                                    </div>
                                                                                    <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-900/60">
                                                                                        <label className="block text-[10px] font-extrabold text-yellow-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                                                                                            <span>👑 Estatus</span>
                                                                                            {!av.motivations?.estatus && <span className="text-amber-550 lowercase italic text-[8px] font-normal">(vacío)</span>}
                                                                                        </label>
                                                                                        <textarea 
                                                                                            rows={3}
                                                                                            value={av.motivations?.estatus || ''} 
                                                                                            onChange={e => {
                                                                                                const copy = [...tempAvatars];
                                                                                                copy[idx] = {
                                                                                                    ...copy[idx],
                                                                                                    motivations: { ...(copy[idx].motivations || {}), estatus: e.target.value }
                                                                                                };
                                                                                                setTempAvatars(copy);
                                                                                            }}
                                                                                            className={`w-full bg-black/60 border ${!av.motivations?.estatus ? 'border-amber-500/20 bg-amber-500/5' : 'border-zinc-800'} rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-orange-500 outline-none resize-none font-sans leading-relaxed`}
                                                                                            placeholder="Prestigio, autoridad o reconocimiento..."
                                                                                        />
                                                                                    </div>
                                                                                    <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-900/60">
                                                                                        <label className="block text-[10px] font-extrabold text-purple-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                                                                                            <span>🛡️ Seguridad</span>
                                                                                            {!av.motivations?.seguridad && <span className="text-amber-550 lowercase italic text-[8px] font-normal">(vacío)</span>}
                                                                                        </label>
                                                                                        <textarea 
                                                                                            rows={3}
                                                                                            value={av.motivations?.seguridad || ''} 
                                                                                            onChange={e => {
                                                                                                const copy = [...tempAvatars];
                                                                                                copy[idx] = {
                                                                                                    ...copy[idx],
                                                                                                    motivations: { ...(copy[idx].motivations || {}), seguridad: e.target.value }
                                                                                                };
                                                                                                setTempAvatars(copy);
                                                                                            }}
                                                                                            className={`w-full bg-black/60 border ${!av.motivations?.seguridad ? 'border-amber-500/20 bg-amber-500/5' : 'border-zinc-800'} rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-orange-500 outline-none resize-none font-sans leading-relaxed`}
                                                                                            placeholder="Garantías, soporte de confianza..."
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {/* SUBTAB: PERFIL DEMOGRAFICO */}
                                                                    {modalSubTab === 'demografico' && (
                                                                        <div className="grid md:grid-cols-2 gap-4">
                                                                            <div>
                                                                                <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1.5 font-sans flex items-center justify-between">
                                                                                    <span>Nombre del Avatar</span>
                                                                                    {!av.name && <span className="text-amber-500 lowercase italic text-[9px] font-normal">(vacío)</span>}
                                                                                </label>
                                                                                <input 
                                                                                    type="text" 
                                                                                    value={av.name || ''} 
                                                                                    onChange={e => {
                                                                                        const copy = [...tempAvatars];
                                                                                        copy[idx] = { ...copy[idx], name: e.target.value };
                                                                                        setTempAvatars(copy);
                                                                                    }}
                                                                                    className={`w-full bg-zinc-950 border ${!av.name ? 'border-amber-500/20 bg-amber-500/5' : 'border-zinc-800'} rounded-xl px-4 py-2.5 text-white focus:border-orange-500 outline-none transition-all text-xs font-sans`} 
                                                                                    placeholder="Ej: María Fernanda" 
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1.5 font-sans flex items-center justify-between">
                                                                                    <span>Rango de Edad</span>
                                                                                    {!(av.age || av.ageRange) && <span className="text-amber-500 lowercase italic text-[9px] font-normal">(vacío)</span>}
                                                                                </label>
                                                                                <input 
                                                                                    type="text" 
                                                                                    value={av.age || av.ageRange || ''} 
                                                                                    onChange={e => {
                                                                                        const copy = [...tempAvatars];
                                                                                        copy[idx] = { ...copy[idx], age: e.target.value, ageRange: e.target.value };
                                                                                        setTempAvatars(copy);
                                                                                    }}
                                                                                    className={`w-full bg-zinc-950 border ${!(av.age || av.ageRange) ? 'border-amber-500/20 bg-amber-500/5' : 'border-zinc-800'} rounded-xl px-4 py-2.5 text-white focus:border-orange-500 outline-none transition-all text-xs font-sans`} 
                                                                                    placeholder="Ej: 28 - 35 años" 
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1.5 font-sans flex items-center justify-between">
                                                                                    <span>Nivel de Estudios / Educación</span>
                                                                                    {!(av.education || av.studies) && <span className="text-amber-500 lowercase italic text-[9px] font-normal">(vacío)</span>}
                                                                                </label>
                                                                                <input 
                                                                                    type="text" 
                                                                                    value={av.education || av.studies || ''} 
                                                                                    onChange={e => {
                                                                                        const copy = [...tempAvatars];
                                                                                        copy[idx] = { ...copy[idx], education: e.target.value, studies: e.target.value };
                                                                                        setTempAvatars(copy);
                                                                                    }}
                                                                                    className={`w-full bg-zinc-950 border ${!(av.education || av.studies) ? 'border-amber-500/20 bg-amber-500/5' : 'border-zinc-800'} rounded-xl px-4 py-2.5 text-white focus:border-orange-500 outline-none transition-all text-xs font-sans`} 
                                                                                    placeholder="Ej: Universitario o Técnico Superior" 
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1.5 font-sans flex items-center justify-between">
                                                                                    <span>Ocupación / Arquetipo</span>
                                                                                    {!(av.occupation || av.archetype) && <span className="text-amber-500 lowercase italic text-[9px] font-normal">(vacío)</span>}
                                                                                </label>
                                                                                <input 
                                                                                    type="text" 
                                                                                    value={av.occupation || av.archetype || ''} 
                                                                                    onChange={e => {
                                                                                        const copy = [...tempAvatars];
                                                                                        copy[idx] = { ...copy[idx], occupation: e.target.value, archetype: e.target.value };
                                                                                        setTempAvatars(copy);
                                                                                    }}
                                                                                    className={`w-full bg-zinc-950 border ${!(av.occupation || av.archetype) ? 'border-amber-500/20 bg-amber-500/5' : 'border-zinc-800'} rounded-xl px-4 py-2.5 text-white focus:border-orange-500 outline-none transition-all text-xs font-sans`} 
                                                                                    placeholder="Ej: Cosmetóloga independiente o Esteticista" 
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1.5 font-sans flex items-center justify-between">
                                                                                    <span>Ingresos Mensuales</span>
                                                                                    {!(av.income || av.incomeRange) && <span className="text-amber-500 lowercase italic text-[9px] font-normal">(vacío)</span>}
                                                                                </label>
                                                                                <input 
                                                                                    type="text" 
                                                                                    value={av.income || av.incomeRange || ''} 
                                                                                    onChange={e => {
                                                                                        const copy = [...tempAvatars];
                                                                                        copy[idx] = { ...copy[idx], income: e.target.value, incomeRange: e.target.value };
                                                                                        setTempAvatars(copy);
                                                                                    }}
                                                                                    className={`w-full bg-zinc-950 border ${!(av.income || av.incomeRange) ? 'border-amber-500/20 bg-amber-500/5' : 'border-zinc-800'} rounded-xl px-4 py-2.5 text-white focus:border-orange-500 outline-none transition-all text-xs font-sans`} 
                                                                                    placeholder="Ej: Ingreso base inestable ($600 - $1,200 USD/mes)" 
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1.5 font-sans flex items-center justify-between">
                                                                                    <span>Ubicación Geográfica</span>
                                                                                    {!(av.location || av.geographic) && <span className="text-amber-500 lowercase italic text-[9px] font-normal">(vacío)</span>}
                                                                                </label>
                                                                                <input 
                                                                                    type="text" 
                                                                                    value={av.location || av.geographic || ''} 
                                                                                    onChange={e => {
                                                                                        const copy = [...tempAvatars];
                                                                                        copy[idx] = { ...copy[idx], location: e.target.value, geographic: e.target.value };
                                                                                        setTempAvatars(copy);
                                                                                    }}
                                                                                    className={`w-full bg-zinc-950 border ${!(av.location || av.geographic) ? 'border-amber-500/20 bg-amber-500/5' : 'border-zinc-800'} rounded-xl px-4 py-2.5 text-white focus:border-orange-500 outline-none transition-all text-xs font-sans`} 
                                                                                    placeholder="Ej: Zonas semi-urbanas y urbanas" 
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1.5 font-sans flex items-center justify-between">
                                                                                    <span>Estado Civil / Familia</span>
                                                                                    {!(av.civilStatus || av.marital_status) && <span className="text-amber-500 lowercase italic text-[9px] font-normal">(vacío)</span>}
                                                                                </label>
                                                                                <input 
                                                                                    type="text" 
                                                                                    value={av.civilStatus || av.marital_status || ''} 
                                                                                    onChange={e => {
                                                                                        const copy = [...tempAvatars];
                                                                                        copy[idx] = { ...copy[idx], civilStatus: e.target.value, marital_status: e.target.value };
                                                                                        setTempAvatars(copy);
                                                                                    }}
                                                                                    className={`w-full bg-zinc-950 border ${!(av.civilStatus || av.marital_status) ? 'border-amber-500/20 bg-amber-500/5' : 'border-zinc-800'} rounded-xl px-4 py-2.5 text-white focus:border-orange-500 outline-none transition-all text-xs font-sans`} 
                                                                                    placeholder="Ej: Soltera o casada con hijos pequeños" 
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1.5 font-sans flex items-center justify-between">
                                                                                    <span>Dispositivos y Redes</span>
                                                                                    {!av.devices && <span className="text-amber-500 lowercase italic text-[9px] font-normal">(vacío)</span>}
                                                                                </label>
                                                                                <input 
                                                                                    type="text" 
                                                                                    value={av.devices || ''} 
                                                                                    onChange={e => {
                                                                                        const copy = [...tempAvatars];
                                                                                        copy[idx] = { ...copy[idx], devices: e.target.value };
                                                                                        setTempAvatars(copy);
                                                                                    }}
                                                                                    className={`w-full bg-zinc-950 border ${!av.devices ? 'border-amber-500/20 bg-amber-500/5' : 'border-zinc-800'} rounded-xl px-4 py-2.5 text-white focus:border-orange-500 outline-none transition-all text-xs font-sans`} 
                                                                                    placeholder="Ej: Instagram, WhatsApp, Smartphone gama media-alta" 
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {/* SUBTAB: DOLORES Y MIEDOS */}
                                                                    {modalSubTab === 'dolores' && (
                                                                        <div className="grid gap-4">
                                                                            {Array.from({ length: 4 }).map((_, di) => {
                                                                                const dolor = av.dolores_ocultos?.[di] || { title: '', text: '' };
                                                                                return (
                                                                                    <div key={di} className="bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800/60 space-y-3">
                                                                                        <span className="text-[9px] font-black tracking-widest text-[#FF5D1E] bg-[#FF5D1E]/10 px-2.5 py-0.5 rounded">FRUSTRACIÓN OCULTA {di + 1}</span>
                                                                                        <div className="grid md:grid-cols-3 gap-3">
                                                                                            <div className="md:col-span-1">
                                                                                                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Título resumido</label>
                                                                                                <input 
                                                                                                    type="text" 
                                                                                                    value={dolor.title || ''} 
                                                                                                    onChange={e => {
                                                                                                        const copy = [...tempAvatars];
                                                                                                        const currentDolores = [...(copy[idx].dolores_ocultos || [])];
                                                                                                        while (currentDolores.length <= di) currentDolores.push({ title: '', text: '' });
                                                                                                        currentDolores[di] = { ...currentDolores[di], title: e.target.value };
                                                                                                        copy[idx] = { ...copy[idx], dolores_ocultos: currentDolores };
                                                                                                        setTempAvatars(copy);
                                                                                                    }}
                                                                                                    className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-orange-500 outline-none text-xs"
                                                                                                    placeholder="Ej: CLIENTELA INESTABLE"
                                                                                                />
                                                                                            </div>
                                                                                            <div className="md:col-span-2">
                                                                                                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Explicación a profundidad</label>
                                                                                                <textarea 
                                                                                                    value={dolor.text || ''} 
                                                                                                    onChange={e => {
                                                                                                        const copy = [...tempAvatars];
                                                                                                        const currentDolores = [...(copy[idx].dolores_ocultos || [])];
                                                                                                        while (currentDolores.length <= di) currentDolores.push({ title: '', text: '' });
                                                                                                        currentDolores[di] = { ...currentDolores[di], text: e.target.value };
                                                                                                        copy[idx] = { ...copy[idx], dolores_ocultos: currentDolores };
                                                                                                        setTempAvatars(copy);
                                                                                                    }}
                                                                                                    className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-orange-500 outline-none text-xs"
                                                                                                    rows={2}
                                                                                                    placeholder="Explica qué miedos o dolores ocultos experimenta con esto..."
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    )}

                                                                    {/* SUBTAB: DESEOS Y MOTIVACIONES */}
                                                                    {modalSubTab === 'deseos' && (
                                                                        <div className="grid gap-4">
                                                                            {Array.from({ length: 4 }).map((_, di) => {
                                                                                const deseo = av.deseos_motivaciones?.[di] || { title: '', text: '' };
                                                                                return (
                                                                                    <div key={di} className="bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800/60 space-y-3">
                                                                                        <span className="text-[9px] font-black tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded">ANHELO PROFUNDO {di + 1}</span>
                                                                                        <div className="grid md:grid-cols-3 gap-3">
                                                                                            <div className="md:col-span-1">
                                                                                                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Título resumido</label>
                                                                                                <input 
                                                                                                    type="text" 
                                                                                                    value={deseo.title || ''} 
                                                                                                    onChange={e => {
                                                                                                        const copy = [...tempAvatars];
                                                                                                        const currentDeseos = [...(copy[idx].deseos_motivaciones || [])];
                                                                                                        while (currentDeseos.length <= di) currentDeseos.push({ title: '', text: '' });
                                                                                                        currentDeseos[di] = { ...currentDeseos[di], title: e.target.value };
                                                                                                        copy[idx] = { ...copy[idx], deseos_motivaciones: currentDeseos };
                                                                                                        setTempAvatars(copy);
                                                                                                    }}
                                                                                                    className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-orange-500 outline-none text-xs"
                                                                                                    placeholder="Ej: AGENDA LLENA"
                                                                                                />
                                                                                            </div>
                                                                                            <div className="md:col-span-2">
                                                                                                <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Explicación a profundidad</label>
                                                                                                <textarea 
                                                                                                    value={deseo.text || ''} 
                                                                                                    onChange={e => {
                                                                                                        const copy = [...tempAvatars];
                                                                                                        const currentDeseos = [...(copy[idx].deseos_motivaciones || [])];
                                                                                                        while (currentDeseos.length <= di) currentDeseos.push({ title: '', text: '' });
                                                                                                        currentDeseos[di] = { ...currentDeseos[di], text: e.target.value };
                                                                                                        copy[idx] = { ...copy[idx], deseos_motivaciones: currentDeseos };
                                                                                                        setTempAvatars(copy);
                                                                                                    }}
                                                                                                    className="w-full bg-black/60 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-orange-500 outline-none text-xs"
                                                                                                    rows={2}
                                                                                                    placeholder="Explica qué sueña alcanzar con esto..."
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    )}

                                                                    {/* SUBTAB: COMPORTAMIENTOS */}
                                                                    {modalSubTab === 'comportamientos' && (
                                                                        <div className="grid gap-4">
                                                                            {Array.from({ length: 4 }).map((_, ci) => {
                                                                                const comp = av.comportamientos?.[ci] || '';
                                                                                return (
                                                                                    <div key={ci} className="space-y-1">
                                                                                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">HÁBITO O COMPORTAMIENTO {ci + 1}</label>
                                                                                        <textarea 
                                                                                            value={comp} 
                                                                                            onChange={e => {
                                                                                                const copy = [...tempAvatars];
                                                                                                const currentComp = [...(copy[idx].comportamientos || [])];
                                                                                                while (currentComp.length <= ci) currentComp.push('');
                                                                                                currentComp[ci] = e.target.value;
                                                                                                
                                                                                                const currentBehaviors = [...(copy[idx].behaviors || [])];
                                                                                                while (currentBehaviors.length <= ci) currentBehaviors.push('');
                                                                                                currentBehaviors[ci] = e.target.value;
                                                                                                
                                                                                                copy[idx] = { ...copy[idx], comportamientos: currentComp, behaviors: currentBehaviors };
                                                                                                setTempAvatars(copy);
                                                                                            }}
                                                                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:border-orange-500 outline-none text-xs font-sans"
                                                                                            rows={2}
                                                                                            placeholder="Ej: Sigue activamente referentes de belleza en Instagram..."
                                                                                        />
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Footer Actions */}
                                        <div className="p-6 bg-black/40 border-t border-gray-800 flex items-center justify-end gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setIsOpenAvatarsModal(false)}
                                                className="text-gray-400 hover:text-white font-bold text-xs px-5 py-3 rounded-xl transition-all hover:bg-gray-800/40 cursor-pointer font-sans"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const currentStrategy = originalStrategyJson ? JSON.parse(JSON.stringify(originalStrategyJson)) : {};
                                                    currentStrategy.avatars = tempAvatars;
                                                    setOriginalStrategyJson(currentStrategy);
                                                    setIsOpenAvatarsModal(false);
                                                }}
                                                className="bg-[#FF5D1E] hover:bg-orange-600 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer font-sans"
                                            >
                                                Guardar Avatares
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {step === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                            <div className="border-b border-gray-800 pb-4">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2"><DollarSign className="w-5 h-5 text-emerald-400" /> Modelo de Negocio</h3>
                                <p className="text-xs text-gray-500 mt-1">Configura las finanzas y el gancho de atracción de tu embudo.</p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Precio de Venta (USD)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input type="number" value={fullPrice} onChange={e => setFullPrice(parseFloat(e.target.value) || 0)} className="w-full bg-black border border-gray-700 rounded-xl px-10 py-3 text-white focus:border-emerald-500 outline-none transition-all" placeholder="0.00" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Tu Comisión (USD)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input type="number" value={commissionValue} onChange={e => setCommissionValue(parseFloat(e.target.value) || 0)} className="w-full bg-black border border-gray-700 rounded-xl px-10 py-3 text-white focus:border-emerald-500 outline-none transition-all" placeholder="0.00" />
                                        {fullPrice > 0 && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">{Math.round(commissionRate)}% Comisión</div>}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Tono de Comunicación</label>
                                <select value={brandTone} onChange={e => setBrandTone(e.target.value)} className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-all appearance-none cursor-pointer">
                                    <option value="Amigable y Cercano">Amigable y Cercano</option>
                                    <option value="Profesional y Serio">Profesional y Serio</option>
                                    <option value="Agresivo y Urgente">Agresivo y Urgente</option>
                                    <option value="Inspirador y Aspiracional">Inspirador y Aspiracional</option>
                                </select>
                            </div>
                        </div>
                    )}
                    {step === 3 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                            <div className="border-b border-gray-800 pb-4">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2"><LinkIcon className="w-5 h-5 text-indigo-400" /> Hotlinks de Afiliado</h3>
                                <p className="text-xs text-gray-500 mt-1">Configura tus enlaces de Hotmart para los botones de tu web.</p>
                            </div>
                            <div className="space-y-4">
                                {leadMagnetUrl && (
                                    <div className="flex gap-3 p-4 bg-emerald-950/20 rounded-2xl border border-emerald-500/30 group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-2 opacity-20"><Crown className="w-12 h-12 text-emerald-500" /></div>
                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <label className="block text-[10px] font-black text-emerald-500 uppercase mb-1 tracking-widest">LeadMagnet (Configurado en Paso 1)</label>
                                                <p className="text-white font-bold text-sm uppercase">{leadMagnetType}</p>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">URL del Regalo</label>
                                                <p className="text-emerald-400 text-xs font-mono truncate">{leadMagnetUrl}</p>
                                            </div>
                                        </div>
                                        <div className="self-center p-2 bg-emerald-500/10 rounded-xl"><CheckCircle2 className="w-5 h-5 text-emerald-500" /></div>
                                    </div>
                                )}
                                {affiliateLinks.map((link, idx) => (
                                    <div key={idx} className="flex gap-3 p-4 bg-black rounded-2xl border border-gray-800 group hover:border-gray-700 transition-colors">
                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Etiqueta del Botón</label>
                                                <input type="text" value={link.label} onChange={e => handleLinkUpdate(idx, 'label', e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-white text-xs focus:border-primary outline-none" placeholder="Ej: Inscribirme Ahora" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">URL de Afiliado</label>
                                                <input type="text" value={link.url} onChange={e => handleLinkUpdate(idx, 'url', e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-indigo-400 text-xs font-mono focus:border-primary outline-none" placeholder="https://go.hotmart.com/..." />
                                            </div>
                                        </div>
                                        <button onClick={() => setAffiliateLinks(affiliateLinks.filter((_, i) => i !== idx))} className="text-gray-600 hover:text-red-500 p-2 self-center bg-gray-900 rounded-xl transition-colors"><Trash2 className="w-5 h-5"/></button>
                                    </div>
                                ))}
                                <button onClick={() => setAffiliateLinks([...affiliateLinks, { label: 'Nuevo Enlace', url: '' }])} className="w-full py-4 border-2 border-dashed border-gray-800 text-gray-500 hover:text-white hover:border-gray-600 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all"><Plus className="w-4 h-4" /> Agregar Otro Hotlink</button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="bg-gray-800/30 p-6 border-t border-gray-800 flex justify-between items-center">
                    {step > 1 ? <button onClick={() => setStep(step - 1)} className="px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold transition flex items-center gap-2 shadow-md"><ArrowLeft className="w-4 h-4" /> Anterior</button> : <div />}
                    {step < 3 ? <button onClick={nextStep} className="px-8 py-3 rounded-xl bg-primary hover:bg-indigo-600 text-white font-bold transition flex items-center gap-2 shadow-lg shadow-primary/20">Siguiente <ArrowRight className="w-4 h-4" /></button> : <button onClick={saveProject} disabled={loading} className="px-10 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold transition flex items-center gap-2 shadow-lg shadow-green-900/20 transform hover:scale-[1.02] active:scale-95">{loading ? <Loader2 className="w-5 h-5 animate-spin"/> : <Save className="w-5 h-5"/>}{id ? 'Actualizar Proyecto' : 'Finalizar y Generar con IA'}</button>}
                </div>
            </div>
        </div>
    );
};