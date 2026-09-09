import React, { useState, useRef, useEffect } from 'react';
import { LandingPage, GeneratedPageContent, ColorPalette, StructureType, DestinationConfig, DestinationType, ThankYouPageConfig, Project } from '../../../types';
import { Save, Globe, ArrowLeft, CheckCircle, LayoutTemplate, Palette, Type, Settings, Smartphone, Monitor, Sparkles, FileText, Maximize, Minimize2, MessageCircle, Link as LinkIcon, Target, Plus, Trash2, ChevronDown, ChevronUp, Image, HelpCircle, User, Award, Anchor, Menu, MousePointerClick, Facebook, Instagram, Twitter, Bold, Italic, List, AlignCenter, AlignLeft, Star, DollarSign, Briefcase, Users, Zap, BookOpen, ScanFace, Feather, Rocket, Grid, ExternalLink, PlayCircle, Gift, AlertTriangle, Book, ShoppingBag, XCircle, Library, X, Search, Video, GraduationCap } from 'lucide-react';
import { LivePage } from '../../LivePage';
import { useLocation } from 'react-router-dom';
import { api } from '../../../services/api';

// --- UI COMPONENTS EXTRACTED ---

const SectionHeader = ({ id, title, icon: Icon, openSection, toggleSection }: { id: string, title: string, icon: any, openSection: string | null, toggleSection: (id: string) => void }) => (
    <button 
      onClick={() => toggleSection(id)}
      className={`w-full flex items-center justify-between p-4 bg-gray-900 border border-gray-800 ${openSection === id ? 'rounded-t-xl border-b-0' : 'rounded-xl hover:bg-gray-800 transition'}`}
    >
        <div className="flex items-center gap-3 font-bold text-white">
            <Icon className="w-5 h-5 text-primary" /> {title}
        </div>
        {openSection === id ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
    </button>
);

const SectionContent = ({ id, openSection, children }: { id: string, openSection: string | null, children?: React.ReactNode }) => {
    if (openSection !== id) return null;
    return (
        <div className="bg-black border border-t-0 border-gray-800 p-4 rounded-b-xl mb-4 space-y-4 animate-in slide-in-from-top-1">
            {children}
        </div>
    );
};

const Label = ({ children }: { children?: React.ReactNode }) => (
    <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">{children}</label>
);

const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input className={`w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:border-primary outline-none transition ${className || ''}`} {...props} />
);

// --- PICKERS ---

const AVAILABLE_ICONS = [
    { name: 'DollarSign', icon: DollarSign },
    { name: 'FileText', icon: FileText },
    { name: 'Briefcase', icon: Briefcase },
    { name: 'Award', icon: Award },
    { name: 'Sparkles', icon: Sparkles },
    { name: 'Users', icon: Users },
    { name: 'Zap', icon: Zap },
    { name: 'BookOpen', icon: BookOpen },
    { name: 'ScanFace', icon: ScanFace },
    { name: 'Palette', icon: Palette },
    { name: 'Feather', icon: Feather },
    { name: 'Rocket', icon: Rocket },
    { name: 'MessageCircle', icon: MessageCircle },
    { name: 'Globe', icon: Globe },
    { name: 'Target', icon: Target },
    { name: 'Anchor', icon: Anchor },
    { name: 'LayoutTemplate', icon: LayoutTemplate },
    { name: 'Star', icon: Star },
    { name: 'AlertTriangle', icon: AlertTriangle },
    { name: 'XCircle', icon: XCircle }
];

const AVAILABLE_COLORS = [
    { name: 'blue', bg: 'bg-blue-500' },
    { name: 'purple', bg: 'bg-purple-500' },
    { name: 'green', bg: 'bg-emerald-500' },
    { name: 'orange', bg: 'bg-orange-500' },
    { name: 'red', bg: 'bg-red-500' },
    { name: 'teal', bg: 'bg-teal-500' },
    { name: 'yellow', bg: 'bg-yellow-500' },
];

const IconPicker = ({ selected, onChange }: { selected?: string, onChange: (iconName: string) => void }) => {
    const [open, setOpen] = useState(false);
    
    return (
        <div className="relative">
            <button 
                onClick={() => setOpen(!open)}
                className="w-10 h-10 bg-gray-800 border border-gray-700 rounded flex items-center justify-center hover:bg-gray-700"
            >
                {selected ? React.createElement(AVAILABLE_ICONS.find(i => i.name === selected)?.icon || Sparkles, { className: "w-5 h-5 text-gray-300" }) : <Grid className="w-5 h-5 text-gray-500" />}
            </button>
            
            {open && (
                <>
                <div className="fixed inset-0 z-10" onClick={() => setOpen(false)}></div>
                <div className="absolute top-12 left-0 z-20 w-64 bg-gray-900 border border-gray-700 shadow-xl rounded-lg p-2 grid grid-cols-5 gap-1 max-h-48 overflow-y-auto">
                    {AVAILABLE_ICONS.map((item) => (
                        <button 
                            key={item.name}
                            onClick={() => { onChange(item.name); setOpen(false); }}
                            className={`p-2 rounded hover:bg-gray-800 flex items-center justify-center ${selected === item.name ? 'bg-primary/20 text-primary' : 'text-gray-400'}`}
                            title={item.name}
                        >
                            <item.icon className="w-5 h-5" />
                        </button>
                    ))}
                </div>
                </>
            )}
        </div>
    );
};

const ColorPicker = ({ selected, onChange }: { selected?: string, onChange: (colorName: string) => void }) => {
    return (
        <div className="flex gap-1.5 flex-wrap">
            {AVAILABLE_COLORS.map(c => (
                <button
                    key={c.name}
                    onClick={() => onChange(c.name)}
                    className={`w-5 h-5 rounded-full ${c.bg} ${selected === c.name ? 'ring-2 ring-white scale-110' : 'opacity-50 hover:opacity-100'} transition`}
                    title={c.name}
                />
            ))}
        </div>
    );
};

// --- RICH TEXT COMPONENT ---
interface RichTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    className?: string;
}

const RichTextArea = ({ value, onChange, className, ...props }: RichTextAreaProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const insertTag = (tagOpen: string, tagClose: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const before = text.substring(0, start);
        const selected = text.substring(start, end);
        const after = text.substring(end);

        const newValue = `${before}${tagOpen}${selected}${tagClose}${after}`;
        
        // Synthetic event
        const event = {
            target: { value: newValue },
            currentTarget: { value: newValue }
        } as React.ChangeEvent<HTMLTextAreaElement>;
        
        onChange(event);

        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(start + tagOpen.length, end + tagOpen.length);
            }
        }, 0);
    };

    return (
        <div className="space-y-1">
            <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-t-lg p-1">
                <button onClick={() => insertTag('<b>', '</b>')} className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white" title="Negrita"><Bold className="w-3 h-3"/></button>
                <button onClick={() => insertTag('<i>', '</i>')} className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white" title="Cursiva"><Italic className="w-3 h-3"/></button>
                <button onClick={() => insertTag('<ul><li>', '</li></ul>')} className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white" title="Lista"><List className="w-3 h-3"/></button>
                <button onClick={() => insertTag('<br/>', '')} className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white text-xs font-mono">BR</button>
            </div>
            <textarea 
                ref={textareaRef}
                className={`w-full bg-gray-900 border border-gray-800 rounded-b-lg px-3 py-2 text-white text-sm focus:border-primary outline-none transition resize-none min-h-[80px] ${className}`} 
                value={value}
                onChange={onChange}
                {...props} 
            />
        </div>
    );
};

// --- MULTIMEDIA SELECTOR ---
const MultimediaSelector = ({ 
    resources, 
    onSelect, 
    type = 'image' 
}: { 
    resources: string[], 
    onSelect: (url: string) => void,
    type?: 'image' | 'video'
}) => {
    // Filtrar recursos vacíos
    const validResources = resources.filter(r => r && r.trim() !== '');
    if (validResources.length === 0) return null;
    
    return (
        <div className="mt-3 space-y-2 animate-in fade-in duration-500">
            <label className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Recursos del Proyecto
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {validResources.map((url, i) => {
                    const isVideo = url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com') || url.match(/\.(mp4|webm|ogg)$/i);
                    return (
                        <button
                            key={i}
                            type="button"
                            onClick={() => onSelect(url)}
                            className="relative min-w-[70px] h-[70px] rounded-xl border border-gray-800 overflow-hidden hover:border-primary transition-all group shrink-0 bg-black shadow-lg"
                            title="Haz clic para usar este recurso"
                        >
                            {isVideo ? (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-primary/10 gap-1">
                                    <PlayCircle className="w-6 h-6 text-primary group-hover:scale-110 transition" />
                                    <span className="text-[8px] font-black text-primary uppercase">Video</span>
                                </div>
                            ) : (
                                <img src={url} alt={`Resource ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition" referrerPolicy="no-referrer" />
                            )}
                            <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                <Plus className="w-5 h-5 text-white drop-shadow-md" />
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

interface EditorProps {
  page: LandingPage;
  onSave: (updatedPage: LandingPage) => Promise<void>;
  onBack: () => void;
}

// --- LIBRARY MODAL ---
const LibraryModal = ({ 
    isOpen, 
    onClose, 
    images = [], 
    videos = [], 
    onSelect 
}: { 
    isOpen: boolean, 
    onClose: () => void, 
    images?: string[], 
    videos?: string[], 
    onSelect: (url: string) => void 
}) => {
    if (!isOpen) return null;
    
    const validImages = images.filter(r => r && r.trim() !== '');
    const validVideos = videos.filter(r => r && r.trim() !== '');
    const hasAny = validImages.length > 0 || validVideos.length > 0;

    return (
        <div className="fixed inset-0 z-[500] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in" onClick={onClose}>
            <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-800/50">
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter italic flex items-center gap-2">
                        <Library className="w-5 h-5 text-primary" /> Biblioteca del Proyecto
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full text-gray-400 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
                    {!hasAny ? (
                        <div className="py-20 text-center space-y-4">
                            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto text-gray-600">
                                <Search className="w-8 h-8" />
                            </div>
                            <p className="text-gray-500 font-medium">No hay recursos multimedia guardados en este proyecto.</p>
                        </div>
                    ) : (
                        <>
                            {/* Bloque de Imágenes */}
                            {validImages.length > 0 && (
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Image className="w-4 h-4" /> Imágenes Disponibles
                                    </h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {validImages.map((url, i) => (
                                            <button
                                                key={`img-${i}`}
                                                type="button"
                                                onClick={() => {
                                                    onSelect(url);
                                                    onClose();
                                                }}
                                                className="relative aspect-square rounded-2xl border border-gray-800 overflow-hidden hover:border-primary transition-all group bg-black shadow-lg"
                                            >
                                                <img src={url} alt={`Resource ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition" referrerPolicy="no-referrer" />
                                                <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                                    <Plus className="w-8 h-8 text-white drop-shadow-md" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Bloque de Videos */}
                            {validVideos.length > 0 && (
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                        <PlayCircle className="w-4 h-4" /> Videos Disponibles
                                    </h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {validVideos.map((url, i) => (
                                            <button
                                                key={`vid-${i}`}
                                                type="button"
                                                onClick={() => {
                                                    onSelect(url);
                                                    onClose();
                                                }}
                                                className="relative aspect-square rounded-2xl border border-gray-800 overflow-hidden hover:border-primary transition-all group bg-black shadow-lg"
                                            >
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-primary/10 gap-2">
                                                    <PlayCircle className="w-10 h-10 text-primary group-hover:scale-110 transition" />
                                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Video</span>
                                                </div>
                                                <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                                    <Plus className="w-8 h-8 text-white drop-shadow-md" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
                <div className="p-4 bg-gray-800/30 border-t border-gray-800 text-center">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Selecciona un recurso para usarlo en tu página</p>
                </div>
            </div>
        </div>
    );
};

export const Editor: React.FC<EditorProps> = ({ page, onSave, onBack }) => {
  // Ensure capture and thankYouPage structure exists
  const initialContent = {
      ...page.content,
      capture: page.content.capture || {
          timerLabel: "La sesión expira en:",
          timerDuration: 15,
          cardTitle: "",
          cardDesc: "",
          helpText: "",
          guaranteeText: "",
          socialProofLabel: "Alumnos registrados",
          securityText: "Acceso Inmediato & Garantizado"
      },
      thankYouPage: page.content.thankYouPage || {
          headline: "Perfecto, hemos enviado el acceso a la clase gratuita a tu correo electrónico",
          subheadline: "Únete a nuestro grupo privado de Whatsapp para acceder a nuestras mentorías y recibir tu material de preparación gratuito.",
          ctaLink: "#",
          showSocials: true
      }
  };

  const [content, setContent] = useState<GeneratedPageContent>(initialContent);
  const [pageName, setPageName] = useState(page.name);
  const [niche, setNiche] = useState(page.niche);
  const [subdomain, setSubdomain] = useState(page.subdomain);
  const [linkedProjectId, setLinkedProjectId] = useState(page.projectId || '');
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [masterLibrary, setMasterLibrary] = useState<Project[]>([]);
  
  const location = useLocation();
  const getInitialTab = () => {
      const searchParams = new URLSearchParams(location.search);
      return searchParams.get('tab') === 'thankyou' ? 'thankyou' : 'content';
  };
  const [activeTab, setActiveTab] = useState<'content' | 'thankyou' | 'design' | 'settings'>(getInitialTab());

  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [fullScreenPreview, setFullScreenPreview] = useState(false);
  const [isPublished, setIsPublished] = useState(page.isPublished);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [openSection, setOpenSection] = useState<string | null>('header');

  // --- INITIALIZATION SYNC FROM PROJECT ---
  // Sincronización agresiva eliminada para no sobrescribir el contenido detallado (título, descripción, bullets) generado por la IA.

  const linkedProject = userProjects.find(p => String(p.id) === String(linkedProjectId));
  const masterProject = masterLibrary.find(p => String(p.id) === String(linkedProject?.masterParentId)) || (linkedProject?.isMaster ? linkedProject : null);

  const [libraryModal, setLibraryModal] = useState<{ isOpen: boolean, images: string[], videos: string[], onSelect: (url: string) => void }>({
      isOpen: false,
      images: [],
      videos: [],
      onSelect: () => {}
  });

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Carga de proyectos disponibles
  useEffect(() => {
    api.getProjects().then(setUserProjects).catch(err => console.error("Error cargando proyectos", err));
    api.getMasterLibrary().then(setMasterLibrary).catch(err => console.error("Error cargando biblioteca maestra", err));
  }, []);

  // URL calculation
  const baseSlug = page.subdomain ? page.subdomain.split('.')[0] : page.id;
  const publicUrl = `/admin/lp/${baseSlug}`;

  // --- HELPER FUNCTIONS ---
  const updateNestedField = (section: keyof GeneratedPageContent, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section] as any,
        [field]: value
      }
    }));
  };

  const updateCaptureField = (field: keyof NonNullable<GeneratedPageContent['capture']>, value: any) => {
    setContent(prev => ({
      ...prev,
      capture: {
        ...prev.capture!,
        [field]: value
      }
    }));
  };

  const updateArrayItem = (section: keyof GeneratedPageContent, index: number, field: string, value: any) => {
    setContent(prev => {
      const newArray = [...(prev[section] as any)]; 
      if (section === 'benefits' || section === 'whatYouWillLearn' || section === 'intro') {
         return prev; 
      }
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [section]: newArray };
    });
  };

  const updateBenefitItem = (index: number, field: 'title' | 'description' | 'icon' | 'color', value: string) => {
    setContent(prev => {
        const newItems = [...prev.benefits.items];
        newItems[index] = { ...newItems[index], [field]: value };
        return { ...prev, benefits: { ...prev.benefits, items: newItems } };
    });
  };

  const updateLearnItem = (index: number, value: any) => {
    setContent(prev => {
        const newItems = [...prev.whatYouWillLearn.items];
        newItems[index] = value;
        return { ...prev, whatYouWillLearn: { ...prev.whatYouWillLearn, items: newItems } };
    });
  };
  
  const updateSocials = (platform: 'facebook' | 'instagram' | 'twitter', value: string) => {
    setContent(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        socials: {
          ...prev.footer.socials,
          [platform]: value
        }
      }
    }));
  };

  const addItem = (section: 'benefits' | 'whatYouWillLearn' | 'testimonials' | 'faq' | 'navLinks') => {
      setContent(prev => {
          if (section === 'benefits') {
              return { ...prev, benefits: { ...prev.benefits, items: [...prev.benefits.items, { title: 'Nuevo Beneficio', description: 'Descripción corta aquí.' }] } };
          }
          if (section === 'whatYouWillLearn') {
              return { ...prev, whatYouWillLearn: { ...prev.whatYouWillLearn, items: [...prev.whatYouWillLearn.items, { title: 'Nuevo perfil', description: 'Descripción de la situación.', points: ['Dolor 1', 'Dolor 2'], icon: 'Target' }] } };
          }
          if (section === 'testimonials') {
              return { ...prev, testimonials: [...(prev.testimonials || []), { name: 'Nuevo Cliente', text: 'Excelente servicio.', rating: 5 }] };
          }
          if (section === 'faq') {
              return { ...prev, faq: [...(prev.faq || []), { question: '¿Nueva Pregunta?', answer: 'Respuesta aquí.' }] };
          }
          if (section === 'navLinks') {
              return { ...prev, navLinks: [...(prev.navLinks || []), { label: 'Nuevo Enlace', href: '#' }] };
          }
          return prev;
      });
  };

  const removeItem = (section: 'benefits' | 'whatYouWillLearn' | 'testimonials' | 'faq' | 'navLinks', index: number) => {
      setContent(prev => {
          if (section === 'benefits') {
              const newItems = [...prev.benefits.items];
              newItems.splice(index, 1);
              return { ...prev, benefits: { ...prev.benefits, items: newItems } };
          }
          if (section === 'whatYouWillLearn') {
              const newItems = [...prev.whatYouWillLearn.items];
              newItems.splice(index, 1);
              return { ...prev, whatYouWillLearn: { ...prev.whatYouWillLearn, items: newItems } };
          }
          if (section === 'testimonials') {
              const newItems = [...(prev.testimonials || [])];
              newItems.splice(index, 1);
              return { ...prev, testimonials: newItems };
          }
          if (section === 'faq') {
              const newItems = [...(prev.faq || [])];
              newItems.splice(index, 1);
              return { ...prev, faq: newItems };
          }
          if (section === 'navLinks') {
              const newItems = [...(prev.navLinks || [])];
              newItems.splice(index, 1);
              return { ...prev, navLinks: newItems };
          }
          return prev;
      });
  };

  const updateThankYouConfig = (field: keyof ThankYouPageConfig, value: any) => {
      setContent(prev => ({
          ...prev,
          thankYouPage: {
              ...prev.thankYouPage!,
              [field]: value
          }
      }));
  };

  const updateTyArray = (
      arrayName: 'learningItems' | 'socialItems' | 'faqItems',
      index: number,
      field: string,
      value: string
  ) => {
      setContent(prev => {
          const tyConfig = { ...prev.thankYouPage! };
          const items = [...(tyConfig[arrayName] as any[] || [])];
          items[index] = { ...items[index], [field]: value };
          return {
              ...prev,
              thankYouPage: {
                  ...tyConfig,
                  [arrayName]: items
              }
          };
      });
  };

  const updateTyBullet = (index: number, value: string) => {
      setContent(prev => {
          const items = [...(prev.thankYouPage?.offerBullets || [])];
          items[index] = value;
          return {
              ...prev,
              thankYouPage: { ...prev.thankYouPage!, offerBullets: items }
          };
      });
  };

  const addTyItem = (arrayName: 'learningItems' | 'socialItems' | 'faqItems' | 'offerBullets') => {
      setContent(prev => {
          const tyConfig = { ...prev.thankYouPage! };
          let newItem;
          if (arrayName === 'learningItems') newItem = { title: 'Nuevo Título', description: 'Descripción' };
          else if (arrayName === 'socialItems') newItem = { name: 'Cliente', location: 'Ciudad', text: 'Testimonio' };
          else if (arrayName === 'faqItems') newItem = { question: 'Pregunta', answer: 'Respuesta' };
          else if (arrayName === 'offerBullets') newItem = "Nuevo beneficio";

          const items = [...(tyConfig[arrayName] as any[] || []), newItem];
          return { ...prev, thankYouPage: { ...tyConfig, [arrayName]: items } };
      });
  };

  const removeTyItem = (arrayName: 'learningItems' | 'socialItems' | 'faqItems' | 'offerBullets', index: number) => {
      setContent(prev => {
          const tyConfig = { ...prev.thankYouPage! };
          const items = [...(tyConfig[arrayName] as any[] || [])];
          items.splice(index, 1);
          return { ...prev, thankYouPage: { ...tyConfig, [arrayName]: items } };
      });
  };

  // --- SYNC LOGIC: whatYouWillLearn <-> Project Strategy ---
  useEffect(() => {
    if (linkedProjectId && content.whatYouWillLearn.items) {
      setUserProjects(prev => {
        const proj = prev.find(p => String(p.id) === String(linkedProjectId));
        if (!proj || !proj.strategy_json) return prev;

        const currentPains = proj.strategy_json.psychology?.pains || [];
        
        // Verificamos si realmente han cambiado para evitar bucles infinitos
        const currentPainsText = currentPains.map((p: any) => p.text);
        const mappedPainsText = (content.whatYouWillLearn?.items || []).map((i: any) => (i?.description || '') || (i?.title || ''));
        const isPainsDifferent = JSON.stringify(currentPainsText) !== JSON.stringify(mappedPainsText);

        if (isPainsDifferent) {
          const updatedPains = mappedPainsText.map((text: string, idx: number) => {
            const existing = currentPains[idx];
            return {
              id: existing?.id || `pain-${Date.now()}-${idx}`,
              text: text,
              avatarId: existing?.avatarId || (idx % 3) + 1
            };
          });

          return prev.map((p: Project) => {
             if (String(p.id) === String(linkedProjectId)) {
                 return {
                    ...p,
                    strategy_json: {
                      ...p.strategy_json,
                      psychology: {
                        ...p.strategy_json.psychology,
                        pains: updatedPains
                      }
                    }
                 };
             }
             return p;
          });
        }
        return prev;
      });
    }
  }, [content.whatYouWillLearn.items, linkedProjectId]);

  // --- SYNC LOGIC: benefits <-> Project LearningModules ---
  useEffect(() => {
    if (linkedProjectId && content.benefits.items) {
      setUserProjects(prev => {
        const proj = prev.find(p => String(p.id) === String(linkedProjectId));
        if (!proj || !proj.strategy_json) return prev;

        const currentModules = proj.strategy_json.psychology?.learningModules || [];
        const newModules = content.benefits.items;
        
        const isModulesDifferent = JSON.stringify(currentModules.map((m: any) => (m?.title || '') + (m?.description || ''))) !== JSON.stringify(newModules.map(m => (m?.title || '') + (m?.description || '')));

        if (isModulesDifferent) {
          const updatedModules = newModules.map((m, idx) => {
            if (!m) return null;
            const existing = currentModules[idx];
            const color = m?.color || existing?.color || 'purple';
            return {
              title: m?.title || '',
              description: m?.description || '',
              icon: m?.icon || existing?.icon || 'Sparkles',
              color: color,
              glow: existing?.glow || (color === 'blue' ? 'hover:shadow-blue-500/20' : (color === 'emerald' || color === 'green') ? 'hover:shadow-emerald-500/40' : 'hover:shadow-purple-500/20'),
              bg: existing?.bg || (
                color === 'blue' ? 'from-[#0f172a] via-[#0b1120] to-[#090e1a]' : 
                (color === 'emerald' || color === 'green') ? 'from-[#065f46] via-[#047857] to-[#064e3b]' : 
                'from-[#1a0b2e] via-[#12061d] to-[#0f041d]'
              ),
              border: existing?.border || 'border-white/20'
            };
          }).filter(Boolean);

          return prev.map(p => {
             if (String(p.id) === String(linkedProjectId)) {
                 return {
                    ...p,
                    strategy_json: {
                      ...p.strategy_json,
                      psychology: {
                        ...p.strategy_json.psychology,
                        learningModules: updatedModules
                      }
                    }
                 };
             }
             return p;
          });
        }
        return prev;
      });
    }
  }, [content.benefits.items, linkedProjectId]);

  const handleSave = async (publishState: boolean) => {
    setSaving(true);
    setIsPublished(publishState);

    // 1. Guardar Proyecto si está vinculado - Sync Inversa
    if (linkedProject) {
        try {
            await api.updateProject(linkedProject.id, {
                ...linkedProject,
                strategy_json: linkedProject.strategy_json
            });
        } catch (err) {
            console.error("Error actualizando estrategia del proyecto:", err);
        }
    }
    
    const cleanContent = {
        ...content
    };

    await onSave({
      ...page,
      name: pageName,
      niche: niche,
      content: cleanContent,
      isPublished: publishState,
      subdomain: subdomain,
      projectId: linkedProjectId || undefined
    });
    
    setSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const updateDestination = (key: string, value: any) => {
      setContent({
          ...content,
          destination: {
              ...content.destination,
              [key]: value
          }
      });
  };

  const isVideoUrl = (url: string) => {
      return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com') || url.match(/\.(mp4|webm|ogg)$/i);
  };

  const handleHeroMediaChange = (val: string) => {
      const isVideo = isVideoUrl(val);
      setContent(prev => ({
          ...prev,
          hero: {
              ...prev.hero,
              videoUrl: isVideo ? val : '',
              heroImage: isVideo ? prev.hero.heroImage : val
          }
      }));
  };

  const palettes: { id: ColorPalette; name: string; colors: string }[] = [
    { id: 'modern-blue', name: 'Azul Tech', colors: 'bg-blue-500' },
    { id: 'elegant-purple', name: 'Púrpura', colors: 'bg-purple-600' },
    { id: 'energetic-orange', name: 'Naranja', colors: 'bg-orange-500' },
    { id: 'nature-green', name: 'Naturaleza', colors: 'bg-green-500' },
    { id: 'dark-luxury', name: 'Lujo Dark', colors: 'bg-gray-800' },
    { id: 'ocean-teal', name: 'Océano', colors: 'bg-teal-400' },
    { id: 'crimson-red', name: 'Carmesí', colors: 'bg-red-600' },
    { id: 'corporate-slate', name: 'Corporativo', colors: 'bg-slate-500' },
    { id: 'gold-prestige', name: 'Prestigio', colors: 'bg-yellow-600' },
    { id: 'minimal-mono', name: 'Monocromo', colors: 'bg-white border border-gray-400' },
  ];

  const structures: { id: StructureType; name: string; wireframe: React.ReactNode }[] = [
    { 
      id: 'webinar-funnel', 
      name: 'Webinar', 
      wireframe: <div className="w-full h-16 bg-gray-800 rounded flex gap-1 p-1 opacity-70"><div className="w-1/2 flex flex-col gap-1"><div className="w-full h-2 bg-gray-600 rounded-sm"></div><div className="w-full h-2 bg-gray-600 rounded-sm"></div></div><div className="w-1/2 bg-gray-700 rounded-sm"></div></div>
    },
    { 
      id: 'classic-sales', 
      name: 'Carta Clásica', 
      wireframe: <div className="w-full h-16 bg-gray-800 rounded flex flex-col gap-1 p-1 opacity-70"><div className="w-full h-2 bg-gray-600 rounded-sm"></div><div className="w-2/3 h-2 bg-gray-600 rounded-sm"></div><div className="flex-1 bg-gray-700 rounded-sm"></div></div>
    },
    { 
      id: 'vsl-focused', 
      name: 'VSL (Video)', 
      wireframe: <div className="w-full h-16 bg-gray-800 rounded flex flex-col gap-1 p-1 opacity-70"><div className="w-full h-8 bg-red-900/40 border border-red-900 rounded-sm flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-red-500"></div></div><div className="w-1/2 mx-auto h-2 bg-primary rounded-sm"></div></div>
    },
    { 
      id: 'minimal-capture', 
      name: 'Minimalista', 
      wireframe: <div className="w-full h-16 bg-gray-800 rounded flex flex-col items-center justify-center gap-1 p-1 opacity-70"><div className="w-3/4 h-2 bg-gray-600 rounded-sm mb-1"></div><div className="w-2/3 h-6 bg-gray-700 rounded-sm border border-dashed border-gray-600"></div></div>
    }
  ];

  return (
    <div className="fixed inset-0 bg-black flex flex-col z-50">
      {/* Modal de Biblioteca Multimedia */}
      <LibraryModal 
          isOpen={libraryModal.isOpen}
          onClose={() => setLibraryModal({ ...libraryModal, isOpen: false })}
          images={libraryModal.images}
          videos={libraryModal.videos}
          onSelect={libraryModal.onSelect}
      />
      {/* Top Bar */}
      <div className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 shadow-md z-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full text-gray-400 transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-8 w-px bg-gray-800"></div>
          <input 
            type="text" 
            value={pageName}
            onChange={(e) => setPageName(e.target.value)}
            className="bg-transparent border-none text-white font-bold text-lg focus:ring-0 px-0 w-64"
            placeholder="Nombre de la página"
          />
        </div>

        <div className="flex items-center gap-2 bg-black rounded-lg p-1 border border-gray-800">
            <button onClick={() => setPreviewMode('desktop')} className={`p-2 rounded ${previewMode === 'desktop' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300'}`}><Monitor className="w-4 h-4" /></button>
            <button onClick={() => setPreviewMode('mobile')} className={`p-2 rounded ${previewMode === 'mobile' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300'}`}><Smartphone className="w-4 h-4" /></button>
            <div className="w-px h-4 bg-gray-700 mx-1"></div>
            <button onClick={() => setFullScreenPreview(!fullScreenPreview)} className={`p-2 rounded transition-colors ${fullScreenPreview ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-white hover:bg-gray-800'}`}>
                {fullScreenPreview ? <Minimize2 className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
        </div>

        <div className="flex items-center gap-3">
          {showSuccess && <span className="text-green-500 flex items-center gap-1 text-sm animate-pulse mr-2"><CheckCircle className="w-4 h-4" /> Guardado</span>}
          <a 
            href={publicUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-gray-300 text-sm font-medium hover:text-white transition"
          >
            <ExternalLink className="w-4 h-4" /> Ver Sitio
          </a>
          <button onClick={() => handleSave(true)} disabled={saving} className={`px-6 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${isPublished ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-primary hover:bg-indigo-600 text-white'}`}>
            {saving ? <span className="animate-spin">⌛</span> : <Globe className="w-4 h-4" />}
            {isPublished ? 'Actualizar Sitio' : 'Publicar Ahora'}
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Sidebar: Controls */}
        {!fullScreenPreview && (
          <div className="w-[420px] bg-gray-900 border-r border-gray-800 flex flex-col">
              {/* Tabs */}
              <div className="flex border-b border-gray-800 shrink-0">
                  <button onClick={() => setActiveTab('content')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition ${activeTab === 'content' ? 'text-white border-b-2 border-primary bg-gray-800/50' : 'text-gray-500 hover:text-gray-300'}`}><Type className="w-4 h-4" /> Contenido</button>
                  <button onClick={() => setActiveTab('design')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition ${activeTab === 'design' ? 'text-white border-b-2 border-primary bg-gray-800/50' : 'text-gray-500 hover:text-gray-300'}`}><Palette className="w-4 h-4" /> Diseño</button>
                  <button onClick={() => setActiveTab('thankyou')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition ${activeTab === 'thankyou' ? 'text-white border-b-2 border-green-500 bg-gray-800/50' : 'text-gray-500 hover:text-gray-300'}`}><CheckCircle className="w-4 h-4" /> Gracias</button>
                  <button onClick={() => setActiveTab('settings')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition ${activeTab === 'settings' ? 'text-white border-b-2 border-primary bg-gray-800/50' : 'text-gray-500 hover:text-gray-300'}`}><Settings className="w-4 h-4" /> Ajustes</button>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  
                  {/* === TAB: CONTENT === */}
                  {activeTab === 'content' && (
                      <>
                        {/* 1. Encabezado */}
                        <SectionHeader id="header" title="Encabezado" icon={LayoutTemplate} openSection={openSection} toggleSection={toggleSection} />
                        <SectionContent id="header" openSection={openSection}>
                            {/* 1. Logo */}
                            <div>
                                <Label>1. Logo / Icono Marca</Label>
                                <div className="flex gap-2 mb-2">
                                     <div className="flex-1">
                                        <Label>Seleccionar Icono</Label>
                                        <IconPicker selected={content.brandIcon} onChange={(icon) => setContent({...content, brandIcon: icon})} />
                                     </div>
                                </div>
                            </div>
                            
                            {/* 2. Brand Name */}
                            <div>
                                <Label>2. Nombre de la Marca (Usa &lt;b&gt; para resaltar)</Label>
                                <Input value={content.brandName || ''} onChange={(e) => setContent({ ...content, brandName: e.target.value })} placeholder="Ej: Beauty Pro" />
                            </div>

                            {/* 3. Menus */}
                            <div className="pt-4 border-t border-gray-800">
                                <Label>3. Enlaces del Menú</Label>
                                <div className="space-y-3 mt-2">
                                    {(content.navLinks || []).map((link, i) => (
                                        <div key={i} className="flex gap-2 items-center bg-gray-900 p-2 rounded border border-gray-700">
                                            <div className="flex-1 space-y-1">
                                                <input className="w-full bg-black border border-gray-800 rounded px-2 py-1 text-xs text-white" value={link.label} onChange={(e) => updateArrayItem('navLinks', i, 'label', e.target.value)} placeholder="Nombre" />
                                                <input className="w-full bg-black border border-gray-800 rounded px-2 py-1 text-xs text-blue-400" value={link.href} onChange={(e) => updateArrayItem('navLinks', i, 'href', e.target.value)} placeholder="#seccion" />
                                            </div>
                                            <button onClick={() => removeItem('navLinks', i)} className="p-2 text-red-500 hover:bg-red-900/20 rounded"><Trash2 className="w-4 h-4"/></button>
                                        </div>
                                    ))}
                                    <button onClick={() => addItem('navLinks')} className="w-full py-2 border border-dashed border-gray-700 text-gray-400 hover:text-white rounded text-xs flex items-center justify-center gap-1"><Plus className="w-3 h-3" /> Añadir Enlace</button>
                                </div>
                            </div>

                            {/* 4. CTA Button */}
                            <div className="pt-4 border-t border-gray-800">
                                <Label>4. Texto Botón CTA (Abre Registro)</Label>
                                <div className="flex gap-2">
                                    <Input value={content.navCta || ''} onChange={(e) => setContent({...content, navCta: e.target.value})} placeholder="Ej: Regístrate Gratis" />
                                    <div className="p-2 bg-gray-800 border border-gray-700 rounded text-gray-400" title="Este botón abre una ventana modal con formulario"><MousePointerClick className="w-5 h-5"/></div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-800 space-y-4">
                                <div>
                                    <Label>Etiqueta de barra de urgencia</Label>
                                    <Input value={content.capture?.timerLabel || ''} onChange={(e) => updateCaptureField('timerLabel', e.target.value)} placeholder="Ej: La sesión expira en:" />
                                </div>
                            </div>
                        </SectionContent>

                        {/* 2. Hero Section */}
                        <SectionHeader id="hero" title="Sección Hero" icon={Sparkles} openSection={openSection} toggleSection={toggleSection} />
                        <SectionContent id="hero" openSection={openSection}>
                            {/* 1. Tagline Superior */}
                            <div>
                                <Label>1. Tagline Superior (Opcional)</Label>
                                <Input value={content.topTagline || ''} onChange={(e) => setContent({ ...content, topTagline: e.target.value })} placeholder="Ej: 🔥 Oferta Limitada" />
                            </div>

                            {/* 2. Headline */}
                            <div>
                                <Label>2. Título Principal (Usa &lt;b&gt; para resaltar)</Label>
                                <RichTextArea value={content.hero.headline} onChange={(e) => updateNestedField('hero', 'headline', e.target.value)} />
                            </div>

                            {/* 3. Subtítulo Persuasivo */}
                            <div>
                                <Label>3. Subtítulo Persuasivo</Label>
                                <RichTextArea value={content.hero.subheadline} onChange={(e) => updateNestedField('hero', 'subheadline', e.target.value)} />
                            </div>

                            {/* 4. Hero Multimedia URL (Unificado) */}
                            <div>
                                <Label>4. URL Imagen o Video (YouTube, Vimeo, MP4)</Label>
                                <div className="flex gap-2">
                                    <Input 
                                        value={content.hero.videoUrl || content.hero.heroImage || ''} 
                                        onChange={(e) => handleHeroMediaChange(e.target.value)} 
                                        placeholder="Pega el link de tu imagen o video..." 
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setLibraryModal({
                                            isOpen: true,
                                            images: masterProject?.multimedia_json?.heroImages || linkedProject?.multimedia_json?.heroImages || [],
                                            videos: masterProject?.multimedia_json?.videoUrls || linkedProject?.multimedia_json?.videoUrls || [],
                                            onSelect: handleHeroMediaChange
                                        })}
                                        className="px-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition-all flex items-center gap-2 shrink-0 text-xs font-bold uppercase tracking-widest"
                                    >
                                        <Library className="w-4 h-4 text-primary" /> Biblioteca
                                    </button>
                                </div>
                                
                                <p className="text-[10px] text-gray-500 mt-1">
                                    * Si pegas un video, la imagen previa se mantendrá como portada/miniatura.
                                </p>
                            </div>
                        </SectionContent>

                        {/* NEW: 3. Formulario de Captura (SmartCTA) */}
                        <SectionHeader id="capture" title="Formulario de Captura" icon={Target} openSection={openSection} toggleSection={toggleSection} />
                        <SectionContent id="capture" openSection={openSection}>
                            {/* 1. Urgencia (Badge Cupos Only) */}
                            <div className="space-y-4 pb-4 border-b border-gray-800">
                                <div>
                                    <Label>Badge Cupos Restantes</Label>
                                    <Input value={content.hero.spotsLeft || ''} onChange={(e) => updateNestedField('hero', 'spotsLeft', e.target.value)} placeholder="Ej: Solo 5 lugares" />
                                </div>
                            </div>

                            {/* 2. Copy de la Tarjeta */}
                            <div className="space-y-4 pb-4 border-b border-gray-800">
                                <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Controles de Copy (SmartCTA)</h4>
                                <div>
                                    <Label>Título de la Tarjeta</Label>
                                    <Input value={content.capture?.cardTitle || ''} onChange={(e) => updateCaptureField('cardTitle', e.target.value)} placeholder="Ej: Únete al Grupo VIP" />
                                </div>
                                <div>
                                    <Label>Descripción de la Tarjeta</Label>
                                    <Input value={content.capture?.cardDesc || ''} onChange={(e) => updateCaptureField('cardDesc', e.target.value)} placeholder="Ej: Recibe atención personalizada..." />
                                </div>
                                <div>
                                    <Label>Texto de Ayuda Superior</Label>
                                    <Input value={content.capture?.helpText || ''} onChange={(e) => updateCaptureField('helpText', e.target.value)} placeholder="Ej: Haz clic para chatear..." />
                                </div>
                                <div>
                                    <Label>Pie de Garantía</Label>
                                    <Input value={content.capture?.guaranteeText || ''} onChange={(e) => updateCaptureField('guaranteeText', e.target.value)} placeholder="Ej: Garantía de satisfacción oficial" />
                                </div>
                            </div>

                            {/* 3. Prueba Social y Seguridad */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Prueba Social y Seguridad</h4>
                                <div>
                                    <Label>Cronometro de urgencia CTA (Minutos)</Label>
                                    <Input type="number" value={content.capture?.timerDuration || 15} onChange={(e) => updateCaptureField('timerDuration', parseInt(e.target.value) || 0)} />
                                </div>
                                <div>
                                    <Label>Contador Alumnos (Número)</Label>
                                    <Input value={content.hero.socialProofCount || ''} onChange={(e) => updateNestedField('hero', 'socialProofCount', e.target.value)} placeholder="Ej: 2,458" />
                                </div>
                                <div>
                                    <Label>Etiqueta del Contador</Label>
                                    <Input value={content.capture?.socialProofLabel || ''} onChange={(e) => updateCaptureField('socialProofLabel', e.target.value)} placeholder="Ej: Alumnos registrados" />
                                </div>
                                <div>
                                    <Label>Texto de Seguridad Inferior</Label>
                                    <Input value={content.capture?.securityText || ''} onChange={(e) => updateCaptureField('securityText', e.target.value)} placeholder="Ej: Acceso Inmediato & Garantizado" />
                                </div>
                            </div>

                            {/* 7. CTA Text */}
                            <div>
                                <Label>7. Texto Botón (CTA)</Label>
                                <Input value={content.hero.ctaText} onChange={(e) => updateNestedField('hero', 'ctaText', e.target.value)} />
                            </div>
                        </SectionContent>

                        {/* 4. Dolores (Relocated from Hero) */}
                        <SectionHeader id="problems" title="Identificación de Dolores" icon={AlertTriangle} openSection={openSection} toggleSection={toggleSection} />
                        <SectionContent id="problems" openSection={openSection}>
                             <div className="mb-4">
                                <Label>Título de la sección de Dolores</Label>
                                <Input value={content.whatYouWillLearn.title} onChange={(e) => setContent({...content, whatYouWillLearn: {...content.whatYouWillLearn, title: e.target.value}})} />
                             </div>
                             
                             <div className="space-y-6 mt-6">
                                {(content.whatYouWillLearn?.items || []).map((item: any, idx: number) => {
                                    if (!item) return null;
                                    return (
                                    <div key={idx} className="p-4 rounded-xl border border-gray-800 bg-gray-900/40 space-y-4 relative group">
                                        <div className="flex items-center gap-3 border-b border-gray-800 pb-3 mb-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                Bloque {idx + 1}
                                            </div>
                                            <h4 className="text-sm font-bold text-white uppercase tracking-widest opacity-70">Perfil / Situación {idx + 1}</h4>
                                            
                                            <button
                                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-400 p-1"
                                                onClick={() => {
                                                    const newItems = [...content.whatYouWillLearn.items];
                                                    newItems.splice(idx, 1);
                                                    setContent({...content, whatYouWillLearn: {...content.whatYouWillLearn, items: newItems}});
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        
                                        <div>
                                            <Label>Título Principal</Label>
                                            <Input 
                                                value={typeof item === 'string' ? item : (item?.title || "")} 
                                                onChange={(e) => updateLearnItem(idx, typeof item === 'string' ? { title: e.target.value } : { ...item, title: e.target.value })}
                                                placeholder="Ej: Trabajas demasiado"
                                            />
                                        </div>
                                        
                                        <div>
                                            <Label>Descripción / Párrafo</Label>
                                            <textarea 
                                                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:border-primary outline-none transition"
                                                value={typeof item === 'string' ? "" : (item?.description || "")} 
                                                onChange={(e: any) => updateLearnItem(idx, typeof item === 'string' ? { title: item, description: e.target.value } : { ...item, description: e.target.value })}
                                                placeholder="Ej: Jornadas agotadoras sin aumento de ingresos..."
                                                rows={2}
                                            />
                                        </div>

                                        <div>
                                            <Label>Puntos Clave (separados por coma)</Label>
                                            <Input 
                                                value={typeof item === 'string' ? "" : (Array.isArray(item?.points) ? item.points : (item?.points ? [item.points] : [])).join(", ")} 
                                                onChange={(e) => {
                                                    const points = e.target.value.split(",").map(s => s.trim()).filter(s => s.length > 0);
                                                    updateLearnItem(idx, typeof item === 'string' ? { title: item, points } : { ...item, points });
                                                }}
                                                placeholder="Ej: Poco tiempo libre, Desgaste, Estrés"
                                            />
                                        </div>
                                        
                                        <div>
                                            <Label>Icono</Label>
                                            <IconPicker selected={item?.icon} onChange={(icon) => updateLearnItem(idx, { ...item, icon: icon })} />
                                        </div>
                                    </div>
                                )})}
                                
                                <button 
                                    onClick={() => addItem('whatYouWillLearn')} 
                                    className="w-full bg-[#241544] hover:bg-[#342261] border border-[#3b2a63] text-white flex items-center justify-center py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Añadir Perfil / Situación
                                </button>
                             </div>
                        </SectionContent>

                        {/* 7. Benefits (Existing) - Moved after Dolores */}
                        <SectionHeader id="benefits" title="Beneficios" icon={Award} openSection={openSection} toggleSection={toggleSection} />
                        <SectionContent id="benefits" openSection={openSection}>
                            <div><Label>Título de Sección</Label><Input value={content.benefits.title} onChange={(e) => setContent({...content, benefits: {...content.benefits, title: e.target.value}})} /></div>
                            <div className="mt-3"><Label>Subtítulo de Sección</Label><Input value={content.benefits.subtitle || ''} onChange={(e) => setContent({...content, benefits: { ...content.benefits, subtitle: e.target.value }})} /></div>
                            <div className="space-y-4 mt-4">
                                {(content.benefits?.items || []).map((item, i) => {
                                    if (!item) return null;
                                    return (
                                    <div key={i} className="bg-gray-900 p-3 rounded border border-gray-700 relative group">
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"><button onClick={() => removeItem('benefits', i)} className="text-red-500"><Trash2 className="w-4 h-4"/></button></div>
                                        <div className="flex gap-4 mb-2">
                                            <div className="flex-1"><Label>Título del Beneficio</Label><Input value={item?.title || ''} onChange={(e) => updateBenefitItem(i, 'title', e.target.value)} /></div>
                                            <div>
                                                <Label>Icono</Label>
                                                <IconPicker selected={item?.icon} onChange={(icon) => updateBenefitItem(i, 'icon', icon)} />
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <Label>Color de Acento</Label>
                                            <ColorPicker selected={item?.color} onChange={(color) => updateBenefitItem(i, 'color', color)} />
                                        </div>
                                        <div><Label>Descripción</Label><RichTextArea value={item?.description || ''} onChange={(e) => updateBenefitItem(i, 'description', e.target.value)} className="min-h-[60px]" /></div>
                                    </div>
                                )})}
                                <button onClick={() => addItem('benefits')} className="w-full py-2 border border-dashed border-gray-700 text-gray-400 hover:text-white rounded text-xs flex items-center justify-center gap-1"><Plus className="w-3 h-3" /> Agregar Beneficio</button>
                            </div>
                        </SectionContent>

                        {/* 5. Testimonials (Existing) */}
                        <SectionHeader id="testimonials" title="Testimonios" icon={MessageCircle} openSection={openSection} toggleSection={toggleSection} />
                        <SectionContent id="testimonials" openSection={openSection}>
                             <div><Label>Título de Sección</Label><Input value={content.testimonialTitle || ''} onChange={(e) => setContent({...content, testimonialTitle: e.target.value})} placeholder="Ej: Lo que dicen nuestros alumnos" /></div>
                             <div className="mt-3"><Label>Subtítulo de Sección</Label><Input value={content.testimonialSubtitle || ''} onChange={(e) => setContent({...content, testimonialSubtitle: e.target.value})} placeholder="Ej: Historias de éxito" /></div>
                             <div className="space-y-4 mt-4">
                                {(content.testimonials || []).map((t, i) => {
                                    if (!t) return null;
                                    return (
                                    <div key={i} className="bg-gray-900 p-3 rounded border border-gray-700 relative group">
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"><button onClick={() => removeItem('testimonials', i)} className="text-red-500"><Trash2 className="w-4 h-4"/></button></div>
                                        <div className="grid grid-cols-2 gap-2 mb-2">
                                            <div><Label>Nombre</Label><Input value={t?.name || ''} onChange={(e) => updateArrayItem('testimonials', i, 'name', e.target.value)} /></div>
                                            <div><Label>Ciudad/País</Label><Input value={t?.location || ''} onChange={(e) => updateArrayItem('testimonials', i, 'location', e.target.value)} placeholder="Ej: Madrid, ES" /></div>
                                        </div>
                                        <div className="mb-2">
                                            <Label>Foto URL (Opcional)</Label>
                                            <div className="flex gap-2 items-center">
                                                <Input value={t?.image || ''} onChange={(e) => updateArrayItem('testimonials', i, 'image', e.target.value)} placeholder="https://..." />
                                                {t?.image && (
                                                    <img src={t.image} alt="Preview" className="w-8 h-8 rounded-full object-cover border border-gray-700 bg-gray-800" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <Label>Rating</Label>
                                            <div className="flex gap-1">
                                                {[1,2,3,4,5].map(star => (
                                                    <button key={star} onClick={() => updateArrayItem('testimonials', i, 'rating', star)} className="focus:outline-none hover:scale-110 transition">
                                                        <Star className={`w-5 h-5 ${star <= (t?.rating || 5) ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}`} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div><Label>Testimonio</Label><RichTextArea value={t?.text || ''} onChange={(e) => updateArrayItem('testimonials', i, 'text', e.target.value)} className="min-h-[60px]" /></div>
                                    </div>
                                )})}
                                <button onClick={() => addItem('testimonials')} className="w-full py-2 border border-dashed border-gray-700 text-gray-400 hover:text-white rounded text-xs flex items-center justify-center gap-1"><Plus className="w-3 h-3" /> Agregar Testimonio</button>
                             </div>
                        </SectionContent>

                        {/* 6. Intro Section (Existing) */}
                        <SectionHeader id="intro" title="Carta de Ventas" icon={Image} openSection={openSection} toggleSection={toggleSection} />
                        <SectionContent id="intro" openSection={openSection}>
                            <div><Label>Título de Sección</Label><Input value={content.intro.title} onChange={(e) => updateNestedField('intro', 'title', e.target.value)} /></div>
                            <div><Label>Descripción</Label><RichTextArea value={content.intro.description} onChange={(e) => updateNestedField('intro', 'description', e.target.value)} className="h-32" /></div>
                            <div>
                                <Label>Imagen de Introducción (URL)</Label>
                                <div className="flex gap-2 items-center">
                                    <Input 
                                        value={content.intro.imageUrl || ''} 
                                        onChange={(e) => updateNestedField('intro', 'imageUrl', e.target.value)} 
                                        placeholder="Pega la URL de la imagen..." 
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setLibraryModal({
                                            isOpen: true,
                                            images: masterProject?.multimedia_json?.descriptiveImages || linkedProject?.multimedia_json?.descriptiveImages || [],
                                            videos: [],
                                            onSelect: (url) => updateNestedField('intro', 'imageUrl', url)
                                        })}
                                        className="px-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition-all flex items-center gap-2 shrink-0 text-xs font-bold uppercase tracking-widest h-[38px]"
                                    >
                                        <Library className="w-4 h-4 text-primary" /> Biblioteca
                                    </button>
                                </div>
                            </div>
                        </SectionContent>

                        {/* 8. Instructor (Existing) */}
                        <SectionHeader id="instructor" title="Instructor / Experto" icon={User} openSection={openSection} toggleSection={toggleSection} />
                        <SectionContent id="instructor" openSection={openSection}>
                            <div className="mb-2"><Label>Título de Sección</Label><Input value={content.instructor.title || ''} onChange={(e) => updateNestedField('instructor', 'title', e.target.value)} placeholder="Ej: Conoce a tu Mentor" /></div>
                            <div><Label>Nombre Completo</Label><Input value={content.instructor.name} onChange={(e) => updateNestedField('instructor', 'name', e.target.value)} /></div>
                            <div><Label>Biografía Corta</Label><RichTextArea value={content.instructor.bio} onChange={(e) => updateNestedField('instructor', 'bio', e.target.value)} className="h-24" /></div>
                            
                            <div className="pt-2">
                                <Label>Foto del Instructor (URL)</Label>
                                <div className="flex gap-2 items-center">
                                    <Input 
                                        value={content.instructor.imageUrl || ''} 
                                        onChange={(e) => updateNestedField('instructor', 'imageUrl', e.target.value)} 
                                        placeholder="Pega la URL de la foto..." 
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setLibraryModal({
                                            isOpen: true,
                                            images: masterProject?.multimedia_json?.instructorImage ? [masterProject.multimedia_json.instructorImage] : (linkedProject?.multimedia_json?.instructorImage ? [linkedProject.multimedia_json.instructorImage] : []),
                                            videos: [],
                                            onSelect: (url) => updateNestedField('instructor', 'imageUrl', url)
                                        })}
                                        className="px-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition-all flex items-center gap-2 shrink-0 text-xs font-bold uppercase tracking-widest h-[38px]"
                                    >
                                        <Library className="w-4 h-4 text-primary" /> Biblioteca
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-gray-800">
                                <div><Label>Badge Superior</Label><Input value={content.instructor.badgeText || ''} onChange={(e) => updateNestedField('instructor', 'badgeText', e.target.value)} placeholder="Ej: Master" /></div>
                                <div><Label>Subtítulo Badge</Label><Input value={content.instructor.badgeSubtext || ''} onChange={(e) => updateNestedField('instructor', 'badgeSubtext', e.target.value)} placeholder="Ej: Certificado" /></div>
                                <div><Label>Stats 1 (Alumnos)</Label><Input value={content.instructor.statsStudents || ''} onChange={(e) => updateNestedField('instructor', 'statsStudents', e.target.value)} placeholder="Ej: +1000 Alumnos" /></div>
                                <div><Label>Stats 2 (Rating)</Label><Input value={content.instructor.statsRating || ''} onChange={(e) => updateNestedField('instructor', 'statsRating', e.target.value)} placeholder="Ej: 5.0" /></div>
                            </div>
                        </SectionContent>

                        {/* 9. FAQ (Existing) */}
                        <SectionHeader id="faq" title="Preguntas Frecuentes" icon={HelpCircle} openSection={openSection} toggleSection={toggleSection} />
                        <SectionContent id="faq" openSection={openSection}>
                            <div className="space-y-4">
                                {(content.faq || []).map((q, i) => (
                                    <div key={i} className="bg-gray-900 p-3 rounded border border-gray-700 relative group">
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"><button onClick={() => removeItem('faq', i)} className="text-red-500"><Trash2 className="w-4 h-4"/></button></div>
                                        <div className="mb-2"><Label>Pregunta</Label><Input value={q.question} onChange={(e) => updateArrayItem('faq', i, 'question', e.target.value)} /></div>
                                        <div><Label>Respuesta</Label><RichTextArea value={q.answer} onChange={(e) => updateArrayItem('faq', i, 'answer', e.target.value)} className="min-h-[60px]" /></div>
                                    </div>
                                ))}
                                <button onClick={() => addItem('faq')} className="w-full py-2 border border-dashed border-gray-700 text-gray-400 hover:text-white rounded text-xs flex items-center justify-center gap-1"><Plus className="w-3 h-3" /> Agregar Pregunta</button>
                            </div>
                        </SectionContent>

                        {/* 10. Footer (Existing) */}
                        <SectionHeader id="footer" title="Cierre y Footer" icon={LayoutTemplate} openSection={openSection} toggleSection={toggleSection} />
                        <SectionContent id="footer" openSection={openSection}>
                             <div><Label>Texto de Cierre (CTA Final)</Label><Input value={content.closingOfferText || ''} onChange={(e) => setContent({ ...content, closingOfferText: e.target.value })} placeholder="Ej: No dejes pasar esta oportunidad..." /></div>
                             <div className="pt-4 border-t border-gray-800"><Label>Copyright Text</Label><Input value={content.footer.copyright} onChange={(e) => updateNestedField('footer', 'copyright', e.target.value)} /></div>
                             <div><Label>Email de Contacto</Label><Input value={content.footer.contact} onChange={(e) => updateNestedField('footer', 'contact', e.target.value)} /></div>
                             <div className="pt-4 border-t border-gray-800">
                                <Label>Redes Sociales</Label>
                                <div className="space-y-2 mt-2">
                                  <div className="flex items-center gap-2"><Facebook className="w-4 h-4 text-blue-500" /><Input placeholder="URL Facebook" value={content.footer.socials?.facebook || ''} onChange={(e) => updateSocials('facebook', e.target.value)} /></div>
                                  <div className="flex items-center gap-2"><Instagram className="w-4 h-4 text-pink-500" /><Input placeholder="URL Instagram" value={content.footer.socials?.instagram || ''} onChange={(e) => updateSocials('instagram', e.target.value)} /></div>
                                  <div className="flex items-center gap-2"><Twitter className="w-4 h-4 text-sky-500" /><Input placeholder="URL Twitter" value={content.footer.socials?.twitter || ''} onChange={(e) => updateSocials('twitter', e.target.value)} /></div>
                                </div>
                             </div>
                        </SectionContent>
                      </>
                  )}

                  {/* === TAB: THANK YOU PAGE === */}
                  {activeTab === 'thankyou' && (
                      <div className="space-y-6 animate-in slide-in-from-left-2 duration-200 p-2">
                          
                          {/* 1. HERO Y CONFIRMACIÓN */}
                          <SectionHeader id="ty-hero" title="1. Hero & Confirmación" icon={Sparkles} openSection={openSection} toggleSection={toggleSection} />
                          <SectionContent id="ty-hero" openSection={openSection}>
                              <div><Label>Nombre de la Marca / Logo</Label><Input value={content.thankYouPage?.headerLogoText || ''} onChange={(e) => updateThankYouConfig('headerLogoText', e.target.value)} placeholder="ResinPro Studio Latino" /></div>
                              <div><Label>Título de Confirmación</Label><Input value={content.thankYouPage?.headline || ''} onChange={(e) => updateThankYouConfig('headline', e.target.value)} placeholder="Perfecto, tu registro está confirmado" /></div>
                              <div><Label>Mensaje / Subtítulo</Label><RichTextArea value={content.thankYouPage?.subheadline || ''} onChange={(e) => updateThankYouConfig('subheadline', e.target.value)} className="h-20" placeholder="Tu clase gratuita ya está disponible..." /></div>
                              <div><Label>Texto de Aviso (Email / Spam)</Label><Input value={content.thankYouPage?.emailNotificationText || ''} onChange={(e) => updateThankYouConfig('emailNotificationText', e.target.value)} placeholder="Revisa tu bandeja de entrada (y spam) para encontrar el acceso." /></div>
                          </SectionContent>

                          {/* 2. CLASE GRATUITA (VIDEO) */}
                          <SectionHeader id="ty-video" title="2. Clase Gratuita (Video)" icon={Video} openSection={openSection} toggleSection={toggleSection} />
                          <SectionContent id="ty-video" openSection={openSection}>
                              <div><Label>Badge Superior</Label><Input value={content.thankYouPage?.videoBadge || ''} onChange={(e) => updateThankYouConfig('videoBadge', e.target.value)} placeholder="CLASE GRATUITA" /></div>
                              <div><Label>Título de la Clase</Label><Input value={content.thankYouPage?.videoTitle || ''} onChange={(e) => updateThankYouConfig('videoTitle', e.target.value)} placeholder="Cómo empezar profesionalmente con resina epóxica para suelos" /></div>
                              <div><Label>Subtítulo / Descripción</Label><RichTextArea value={content.thankYouPage?.videoSubtitle || ''} onChange={(e) => updateThankYouConfig('videoSubtitle', e.target.value)} className="h-20" placeholder="Aprende cómo funciona esta técnica..." /></div>
                              <div className="pt-3 border-t border-gray-800">
                                  <Label>URL del Video (YouTube, Vimeo o MP4)</Label>
                                  <Input value={content.thankYouPage?.videoUrl || ''} onChange={(e) => updateThankYouConfig('videoUrl', e.target.value)} placeholder="https://www.youtube.com/watch?v=... o https://vimeo.com/..." />
                                  <p className="text-[11px] text-gray-500 mt-1">Si dejas este campo vacío, se mostrará el reproductor interactivo con fotograma cinematográfico.</p>
                              </div>
                              <div><Label>URL Fotograma / Poster (Opcional)</Label><Input value={content.thankYouPage?.videoPosterUrl || ''} onChange={(e) => updateThankYouConfig('videoPosterUrl', e.target.value)} placeholder="https://images.unsplash.com/..." /></div>
                              <div className="grid grid-cols-2 gap-2">
                                  <div><Label>Duración del Video</Label><Input value={content.thankYouPage?.videoDuration || ''} onChange={(e) => updateThankYouConfig('videoDuration', e.target.value)} placeholder="34:28" /></div>
                                  <div><Label>Aviso Recomendación</Label><Input value={content.thankYouPage?.videoNoticeText || ''} onChange={(e) => updateThankYouConfig('videoNoticeText', e.target.value)} placeholder="Te recomendamos ver la clase completa..." /></div>
                              </div>
                          </SectionContent>

                          {/* 3. FORMACIÓN COMPLETA / UPSELL */}
                          <SectionHeader id="ty-upsell" title="3. Formación Completa (Upsell)" icon={GraduationCap} openSection={openSection} toggleSection={toggleSection} />
                          <SectionContent id="ty-upsell" openSection={openSection}>
                              <div><Label>Título Sección</Label><Input value={content.thankYouPage?.upsellTitle || ''} onChange={(e) => updateThankYouConfig('upsellTitle', e.target.value)} placeholder="¿Quieres aprender el proceso completo?" /></div>
                              <div><Label>Subtítulo Sección</Label><Input value={content.thankYouPage?.upsellSubtitle || ''} onChange={(e) => updateThankYouConfig('upsellSubtitle', e.target.value)} placeholder="Lleva tus habilidades al siguiente nivel..." /></div>
                              <div className="pt-3 border-t border-gray-800">
                                  <Label>Nombre del Programa / Formación</Label>
                                  <Input value={content.thankYouPage?.upsellProductName || ''} onChange={(e) => updateThankYouConfig('upsellProductName', e.target.value)} placeholder="Especialista en Resina Epóxica para Suelos" />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                  <div><Label>Nombre del Instructor</Label><Input value={content.thankYouPage?.upsellInstructorName || ''} onChange={(e) => updateThankYouConfig('upsellInstructorName', e.target.value)} placeholder="Ariana Zamora" /></div>
                                  <div><Label>Especialidad Instructor</Label><Input value={content.thankYouPage?.upsellInstructorTitle || ''} onChange={(e) => updateThankYouConfig('upsellInstructorTitle', e.target.value)} placeholder="Especialista en recubrimientos epóxicos" /></div>
                              </div>
                              <div className="pt-3 border-t border-gray-800">
                                  <Label>Texto Botón CTA</Label>
                                  <Input value={content.thankYouPage?.upsellButtonText || ''} onChange={(e) => updateThankYouConfig('upsellButtonText', e.target.value)} placeholder="CONOCER LA FORMACIÓN COMPLETA" />
                              </div>
                              <div>
                                  <Label>Enlace Botón (Checkout / Página de Pago)</Label>
                                  <Input value={content.thankYouPage?.upsellButtonUrl || ''} onChange={(e) => updateThankYouConfig('upsellButtonUrl', e.target.value)} placeholder="https://pay.hotmart.com/... o enlace de compra" />
                              </div>
                              <div>
                                  <Label>Imagen Mockup Personalizada (Opcional)</Label>
                                  <Input value={content.thankYouPage?.upsellImageUrl || ''} onChange={(e) => updateThankYouConfig('upsellImageUrl', e.target.value)} placeholder="URL de imagen de mockup (deja vacío para mockup 3D automático)" />
                              </div>
                          </SectionContent>

                          {/* 4. REGALO ADICIONAL (WHATSAPP + GUÍA) */}
                          <SectionHeader id="ty-whatsapp" title="4. Regalo Adicional (WhatsApp + Guía)" icon={Gift} openSection={openSection} toggleSection={toggleSection} />
                          <SectionContent id="ty-whatsapp" openSection={openSection}>
                              <div><Label>Badge Superior</Label><Input value={content.thankYouPage?.whatsappBadge || ''} onChange={(e) => updateThankYouConfig('whatsappBadge', e.target.value)} placeholder="REGALO ADICIONAL" /></div>
                              <div><Label>Título Principal</Label><Input value={content.thankYouPage?.whatsappTitle || ''} onChange={(e) => updateThankYouConfig('whatsappTitle', e.target.value)} placeholder="Únete a nuestro grupo de WhatsApp y recibe gratis esta guía práctica" /></div>
                              <div><Label>Subtítulo</Label><RichTextArea value={content.thankYouPage?.whatsappSubtitle || ''} onChange={(e) => updateThankYouConfig('whatsappSubtitle', e.target.value)} className="h-20" placeholder="Conecta con nuestra comunidad, resuelve tus dudas..." /></div>
                              <div className="pt-3 border-t border-gray-800">
                                  <Label>Título de la Guía Práctica</Label>
                                  <Input value={content.thankYouPage?.whatsappGuideTitle || ''} onChange={(e) => updateThankYouConfig('whatsappGuideTitle', e.target.value)} placeholder="Cómo convertir la aplicación de resina epóxica para suelos en un negocio rentable" />
                              </div>
                              <div className="pt-3 border-t border-gray-800">
                                  <Label>Texto Botón de WhatsApp</Label>
                                  <Input value={content.thankYouPage?.whatsappButtonText || ''} onChange={(e) => updateThankYouConfig('whatsappButtonText', e.target.value)} placeholder="UNIRME AL GRUPO Y RECIBIR LA GUÍA" />
                              </div>
                              <div>
                                  <Label>Enlace del Grupo de WhatsApp (VIP)</Label>
                                  <Input value={content.thankYouPage?.ctaLink || ''} onChange={(e) => updateThankYouConfig('ctaLink', e.target.value)} placeholder="https://chat.whatsapp.com/..." />
                              </div>
                              <div>
                                  <Label>Imagen Guía Personalizada (Opcional)</Label>
                                  <Input value={content.thankYouPage?.whatsappGuideImageUrl || ''} onChange={(e) => updateThankYouConfig('whatsappGuideImageUrl', e.target.value)} placeholder="URL de imagen de la guía (deja vacío para mockup 3D automático)" />
                              </div>
                          </SectionContent>

                          {/* 5. ONBOARDING (¿QUÉ OCURRE AHORA?) */}
                          <SectionHeader id="ty-steps" title="5. Pasos Onboarding" icon={List} openSection={openSection} toggleSection={toggleSection} />
                          <SectionContent id="ty-steps" openSection={openSection}>
                              <div><Label>Título Sección</Label><Input value={content.thankYouPage?.stepsTitle || ''} onChange={(e) => updateThankYouConfig('stepsTitle', e.target.value)} placeholder="¿Qué ocurre ahora?" /></div>
                              <div><Label>Subtítulo</Label><Input value={content.thankYouPage?.stepsSubtitle || ''} onChange={(e) => updateThankYouConfig('stepsSubtitle', e.target.value)} placeholder="Sigue estos 3 pasos para aprovechar al máximo tu acceso:" /></div>
                          </SectionContent>

                          {/* 6. FOOTER */}
                          <SectionHeader id="ty-footer" title="6. Footer & Lema" icon={Sparkles} openSection={openSection} toggleSection={toggleSection} />
                          <SectionContent id="ty-footer" openSection={openSection}>
                              <div><Label>Lema del Nicho / Footer</Label><Input value={content.thankYouPage?.footerTagline || ''} onChange={(e) => updateThankYouConfig('footerTagline', e.target.value)} placeholder="Transformando ideas en suelos que generan oportunidades." /></div>
                          </SectionContent>

                      </div>
                  )}

                  {/* === TAB: DESIGN === */}
                  {activeTab === 'design' && (
                      <div className="space-y-8 animate-in slide-in-from-left-2 duration-200 p-2">
                           <div><h3 className="text-white font-bold mb-4 flex items-center gap-2"><LayoutTemplate className="w-4 h-4 text-primary" /> Estructura</h3><div className="grid grid-cols-2 gap-3">{structures.map(s => (<div key={s.id} onClick={() => setContent({...content, structure: s.id})} className={`cursor-pointer rounded-lg border p-2 transition-all hover:scale-105 ${content.structure === s.id ? 'bg-gray-800 border-primary ring-1 ring-primary' : 'bg-black border-gray-800 hover:border-gray-600'}`}><div className="mb-2 pointer-events-none scale-90 origin-top-left">{s.wireframe}</div><p className={`text-xs font-bold ${content.structure === s.id ? 'text-primary' : 'text-gray-400'}`}>{s.name}</p></div>))}</div></div>
                           <div><h3 className="text-white font-bold mb-4 flex items-center gap-2"><Palette className="w-4 h-4 text-primary" /> Colores</h3><div className="grid grid-cols-4 gap-3">{palettes.map(p => (<div key={p.id} onClick={() => setContent({...content, palette: p.id})} className={`cursor-pointer rounded-lg p-2 flex flex-col items-center gap-1 transition ${content.palette === p.id ? 'bg-gray-800 border border-primary' : 'hover:bg-gray-800 border border-transparent'}`}><div className={`w-8 h-8 rounded-full shadow-sm ${p.colors}`}></div><span className="text-[10px] text-gray-400 text-center leading-tight">{p.name}</span></div>))}</div></div>
                      </div>
                  )}

                  {/* === TAB: SETTINGS === */}
                  {activeTab === 'settings' && (
                      <div className="space-y-6 animate-in slide-in-from-left-2 duration-200 p-2">
                           <div className="bg-black p-4 rounded-xl border border-gray-800">
                               <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Settings className="w-4 h-4 text-primary" /> General</h3>
                               <div className="space-y-4">
                                   <div><Label>Nombre de la Página</Label><Input value={pageName} onChange={(e) => setPageName(e.target.value)} /></div>
                                   <div><Label>Nicho</Label><Input value={niche} onChange={(e) => setNiche(e.target.value)} /></div>
                                   <div><Label>Audiencia Objetivo</Label><Input value={content.targetAudience || ''} onChange={(e) => setContent({...content, targetAudience: e.target.value})} /></div>
                                   
                                   {/* Vinculación de Proyecto */}
                                   <div className="pt-2">
                                       <Label>Proyecto Vinculado</Label>
                                       <select 
                                           value={linkedProjectId} 
                                           onChange={(e) => setLinkedProjectId(e.target.value)}
                                           className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:border-primary outline-none transition appearance-none cursor-pointer"
                                       >
                                           <option value="">-- Sin Vincular --</option>
                                           {userProjects.map(p => (
                                               <option key={p.id} value={p.id}>{p.name}</option>
                                           ))}
                                       </select>
                                   </div>

                                   {/* Edición de Subdominio/Slug */}
                                   <div className="pt-2">
                                       <Label>Slug de la página (Subdominio)</Label>
                                       <div className="relative group">
                                           <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                           <Input 
                                               value={subdomain} 
                                               onChange={(e) => {
                                                   const val = e.target.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/--+/g, '-');
                                                   setSubdomain(val);
                                               }}
                                               className="pl-10"
                                               placeholder="ej: mi-landing-increible"
                                           />
                                       </div>
                                       <p className="text-[10px] text-gray-500 mt-2 italic px-1">
                                           * Tu URL final será: <span className="text-primary font-bold">{subdomain}.generatorlanding.com</span>
                                       </p>
                                   </div>
                               </div>
                           </div>
                           <div className="bg-black p-4 rounded-xl border border-gray-800"><h3 className="text-white font-bold mb-4 flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Destino (CTA)</h3><div className="flex flex-wrap gap-2 mb-4"><button onClick={() => updateDestination('type', 'form')} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition ${content.destination?.type === 'form' ? 'bg-primary text-white border-primary' : 'border-gray-700 text-gray-400 hover:bg-gray-800'}`}><FileText className="w-3 h-3" /> Form</button><button onClick={() => updateDestination('type', 'whatsapp')} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition ${content.destination?.type === 'whatsapp' ? 'bg-green-600 text-white border-green-600' : 'border-gray-700 text-gray-400 hover:bg-gray-800'}`}><MessageCircle className="w-3 h-3" /> WhatsApp</button><button onClick={() => updateDestination('type', 'external_url')} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition ${content.destination?.type === 'external_url' ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-700 text-gray-400 hover:bg-gray-800'}`}><LinkIcon className="w-3 h-3" /> Link</button></div><div className="space-y-4 border-t border-gray-800 pt-4">{content.destination?.type === 'whatsapp' && (<><div><Label>Número WhatsApp</Label><Input value={content.destination.whatsappPhone || ''} onChange={(e) => updateDestination('whatsappPhone', e.target.value)} placeholder="+57 300 123 4567" /></div><div><Label>Mensaje Inicial</Label><Input value={content.destination.whatsappMessage || ''} onChange={(e) => updateDestination('whatsappMessage', e.target.value)} placeholder="Hola..." /></div></>)}{content.destination?.type === 'external_url' && (<div><Label>URL de Destino</Label><Input value={content.destination.url || ''} onChange={(e) => updateDestination('url', e.target.value)} placeholder="https://..." /></div>)}{content.destination?.type === 'form' && (<div className="text-xs text-gray-500 bg-gray-900 p-3 rounded border border-gray-800 italic">* Se capturarán leads en el CRM.</div>)}</div></div>
                      </div>
                  )}
              </div>
          </div>
        )}

        {/* Right Area: Preview */}
        <div className={`flex-1 bg-gray-800 overflow-auto flex items-center justify-center relative ${fullScreenPreview ? 'p-0' : 'p-8'}`}>
             {!fullScreenPreview && <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#4b5563_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>}
             
             <div className={`bg-white shadow-2xl transition-all duration-500 ease-in-out overflow-hidden relative transform-gpu ${fullScreenPreview && previewMode === 'desktop' ? 'w-full h-full rounded-none border-0' : previewMode === 'mobile' ? 'w-[375px] h-[700px] rounded-[40px] border-[8px] border-gray-900' : 'w-full h-full rounded-lg border-[8px] border-gray-900'}`}>
                {previewMode === 'mobile' && !fullScreenPreview && <div className="absolute top-0 left-0 w-full h-6 bg-black z-50 flex justify-center"><div className="w-20 h-4 bg-black rounded-b-xl"></div></div>}
                <div id="preview-viewport" className="w-full h-full overflow-y-auto bg-white scrollbar-hide">
                    <LivePage 
                        content={content} 
                        project={linkedProject}
                        isMobilePreview={previewMode === 'mobile'} 
                        viewMode={activeTab === 'thankyou' ? 'thank-you' : 'home'} 
                    />
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};
