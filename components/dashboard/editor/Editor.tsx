import React, { useState, useRef } from 'react';
import { LandingPage, GeneratedPageContent, ColorPalette, StructureType, DestinationType } from '../../../types';
import { Save, Globe, ArrowLeft, CheckCircle, LayoutTemplate, Palette, Type, Settings, Smartphone, Monitor, Sparkles, FileText, Maximize, Minimize2, MessageCircle, Link as LinkIcon, Target, Plus, Trash2, ChevronDown, ChevronUp, Image, HelpCircle, User, Award, Anchor, Menu, MousePointerClick, Facebook, Instagram, Twitter, Bold, Italic, List, AlignCenter, AlignLeft, Star, DollarSign, Briefcase, Users, Zap, BookOpen, ScanFace, Feather, Rocket, Grid, ExternalLink, PlayCircle } from 'lucide-react';
import { LivePage } from '../../LivePage';

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

interface EditorProps {
  page: LandingPage;
  onSave: (updatedPage: LandingPage) => Promise<void>;
  onBack: () => void;
}

export const Editor: React.FC<EditorProps> = ({ page, onSave, onBack }) => {
  const [content, setContent] = useState<GeneratedPageContent>(page.content);
  const [pageName, setPageName] = useState(page.name);
  const [niche, setNiche] = useState(page.niche);
  
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'settings'>('content');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [fullScreenPreview, setFullScreenPreview] = useState(false);
  const [isPublished, setIsPublished] = useState(page.isPublished);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [openSection, setOpenSection] = useState<string | null>('header');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const baseSlug = page.subdomain ? page.subdomain.split('.')[0] : page.id;
  const publicUrl = `/admin/lp/${baseSlug}`;

  const updateNestedField = (section: keyof GeneratedPageContent, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section] as any,
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

  const updateIntroItem = (index: number, field: 'title' | 'description', value: string) => {
    setContent(prev => {
        const newItems = [...(prev.intro.items || [])];
        newItems[index] = { ...newItems[index], [field]: value };
        return { ...prev, intro: { ...prev.intro, items: newItems } };
    });
  };

  const updateLearnItem = (index: number, value: string) => {
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

  const addItem = (section: 'benefits' | 'whatYouWillLearn' | 'testimonials' | 'faq' | 'navLinks' | 'introItems') => {
      setContent(prev => {
          if (section === 'benefits') {
              return { ...prev, benefits: { ...prev.benefits, items: [...prev.benefits.items, { title: 'Nuevo Beneficio', description: 'Descripción corta aquí.' }] } };
          }
          if (section === 'whatYouWillLearn') {
              return { ...prev, whatYouWillLearn: { ...prev.whatYouWillLearn, items: [...prev.whatYouWillLearn.items, 'Nuevo punto clave de aprendizaje'] } };
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
          if (section === 'introItems') {
              return { ...prev, intro: { ...prev.intro, items: [...(prev.intro.items || []), { title: 'Nuevo Punto', description: 'Descripción aquí' }] } };
          }
          return prev;
      });
  };

  const removeItem = (section: 'benefits' | 'whatYouWillLearn' | 'testimonials' | 'faq' | 'navLinks' | 'introItems', index: number) => {
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
          if (section === 'introItems') {
              const newItems = [...(prev.intro.items || [])];
              newItems.splice(index, 1);
              return { ...prev, intro: { ...prev.intro, items: newItems } };
          }
          return prev;
      });
  };

  const handleSave = async (publishState: boolean) => {
    setSaving(true);
    setIsPublished(publishState);
    
    await onSave({
      ...page,
      name: pageName,
      niche: niche,
      content,
      isPublished: publishState
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
      id: 'webinar-funnel', 
      name: 'Webinar', 
      wireframe: <div className="w-full h-16 bg-gray-800 rounded flex gap-1 p-1 opacity-70"><div className="w-1/2 flex flex-col gap-1"><div className="w-full h-2 bg-gray-600 rounded-sm"></div><div className="w-full h-2 bg-gray-600 rounded-sm"></div></div><div className="w-1/2 bg-gray-700 rounded-sm"></div></div>
    },
    { 
      id: 'minimal-capture', 
      name: 'Minimalista', 
      wireframe: <div className="w-full h-16 bg-gray-800 rounded flex flex-col items-center justify-center gap-1 p-1 opacity-70"><div className="w-3/4 h-2 bg-gray-600 rounded-sm mb-1"></div><div className="w-2/3 h-6 bg-gray-700 rounded-sm border border-dashed border-gray-600"></div></div>
    }
  ];

  return (
    <div className="fixed inset-0 bg-black flex flex-col z-50">
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

      <div className="flex-1 flex overflow-hidden relative">
        
        {!fullScreenPreview && (
          <div className="w-[420px] bg-gray-900 border-r border-gray-800 flex flex-col">
              <div className="flex border-b border-gray-800 shrink-0">
                  <button onClick={() => setActiveTab('content')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition ${activeTab === 'content' ? 'text-white border-b-2 border-primary bg-gray-800/50' : 'text-gray-500 hover:text-gray-300'}`}><Type className="w-4 h-4" /> Contenido</button>
                  <button onClick={() => setActiveTab('design')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition ${activeTab === 'design' ? 'text-white border-b-2 border-primary bg-gray-800/50' : 'text-gray-500 hover:text-gray-300'}`}><Palette className="w-4 h-4" /> Diseño</button>
                  <button onClick={() => setActiveTab('settings')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition ${activeTab === 'settings' ? 'text-white border-b-2 border-primary bg-gray-800/50' : 'text-gray-500 hover:text-gray-300'}`}><Settings className="w-4 h-4" /> Ajustes</button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  
                  {activeTab === 'content' && (
                      <>
                        <SectionHeader id="header" title="Encabezado" icon={LayoutTemplate} openSection={openSection} toggleSection={toggleSection} />
                        <SectionContent id="header" openSection={openSection}>
                            <div>
                                <Label>1. Logo / Icono Marca</Label>
                                <div className="flex gap-2 mb-2">
                                     <div className="flex-1">
                                        <Label>Seleccionar Icono</Label>
                                        <IconPicker selected={content.brandIcon} onChange={(icon) => setContent({...content, brandIcon: icon})} />
                                     </div>
                                </div>
                            </div>
                            
                            <div>
                                <Label>2. Nombre de la Marca (Usa &lt;b&gt; para resaltar)</Label>
                                <Input value={content.brandName || ''} onChange={(e) => setContent({ ...content, brandName: e.target.value })} placeholder="Ej: Beauty Pro" />
                            </div>

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

                            <div className="pt-4 border-t border-gray-800">
                                <Label>4. Texto Botón CTA (Abre Registro)</Label>
                                <div className="flex gap-2">
                                    <Input value={content.navCta || ''} onChange={(e) => setContent({...content, navCta: e.target.value})} placeholder="Ej: Regístrate Gratis" />
                                    <div className="p-2 bg-gray-800 border border-gray-700 rounded text-gray-400" title="Este botón abre una ventana modal con formulario"><MousePointerClick className="w-5 h-5"/></div>
                                </div>
                            </div>
                        </SectionContent>

                        <SectionHeader id="hero" title="Sección Hero" icon={Sparkles} openSection={openSection} toggleSection={toggleSection} />
                        <SectionContent id="hero" openSection={openSection}>
                            <div>
                                <Label>1. Tagline Superior (Opcional)</Label>
                                <Input value={content.topTagline || ''} onChange={(e) => setContent({ ...content, topTagline: e.target.value })} placeholder="Ej: 🔥 Oferta Limitada" />
                            </div>

                            <div>
                                <Label>2. Título Principal (Usa &lt;b&gt; para resaltar)</Label>
                                <RichTextArea value={content.hero.headline} onChange={(e) => updateNestedField('hero', 'headline', e.target.value)} />
                            </div>

                            <div>
                                <Label>3. Subtítulo Persuasivo</Label>
                                <RichTextArea value={content.hero.subheadline} onChange={(e) => updateNestedField('hero', 'subheadline', e.target.value)} />
                            </div>

                            <div>
                                <Label>4. URL Imagen/Portada Video</Label>
                                <div className="flex gap-2">
                                    <Input value={content.hero.heroImage || ''} onChange={(e) => updateNestedField('hero', 'heroImage', e.target.value)} placeholder="https://..." />
                                    {content.hero.heroImage && <img src={content.hero.heroImage} alt="Preview" className="w-10 h-10 rounded border border-gray-700 object-cover" />}
                                </div>
                            </div>

                            <div>
                                <Label>5. Título dentro de la imagen</Label>
                                <Input value={content.hero.videoTitle || ''} onChange={(e) => updateNestedField('hero', 'videoTitle', e.target.value)} placeholder="Ej: Masterclass" />
                            </div>

                            <div>
                                <Label>6. Duración (Texto)</Label>
                                <Input value={content.hero.videoDuration || ''} onChange={(e) => updateNestedField('hero', 'videoDuration', e.target.value)} placeholder="Ej: 1h 30m" />
                            </div>

                            <div>
                                <Label>7. Texto Botón (CTA)</Label>
                                <Input value={content.hero.ctaText} onChange={(e) => updateNestedField('hero', 'ctaText', e.target.value)} />
                            </div>

                            <div className="pt-4 border-t border-gray-800">
                                <Label>8. Lo Que Descubrirás Hoy</Label>
                                <div className="mb-2 flex items-center gap-2">
                                     <div className="flex-1">
                                        <Label>Título Lista</Label>
                                        <Input value={content.whatYouWillLearn.title} onChange={(e) => setContent({...content, whatYouWillLearn: {...content.whatYouWillLearn, title: e.target.value}})} />
                                     </div>
                                     <div>
                                        <Label>Icono</Label>
                                        <IconPicker selected={content.whatYouWillLearn.icon} onChange={(icon) => setContent({...content, whatYouWillLearn: {...content.whatYouWillLearn, icon: icon}})} />
                                     </div>
                                </div>
                                <div className="space-y-2 mt-2">
                                    {(content.whatYouWillLearn.items || []).map((item, i) => (
                                        <div key={i} className="flex gap-2">
                                            <Input value={item} onChange={(e) => updateLearnItem(i, e.target.value)} />
                                            <button onClick={() => removeItem('whatYouWillLearn', i)} className="p-2 text-red-500 hover:bg-red-900/20 rounded"><Trash2 className="w-4 h-4"/></button>
                                        </div>
                                    ))}
                                    <button onClick={() => addItem('whatYouWillLearn')} className="w-full py-2 border border-dashed border-gray-700 text-gray-400 hover:text-white rounded text-xs flex items-center justify-center gap-1"><Plus className="w-3 h-3" /> Agregar Punto</button>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-800">
                                <Label>9. Badge Cupos Restantes</Label>
                                <Input value={content.hero.spotsLeft || ''} onChange={(e) => updateNestedField('hero', 'spotsLeft', e.target.value)} placeholder="Ej: Solo 5 lugares" />
                            </div>

                            <div>
                                <Label>10. Contador Alumnos (Prueba Social)</Label>
                                <Input value={content.hero.socialProofCount || ''} onChange={(e) => updateNestedField('hero', 'socialProofCount', e.target.value)} placeholder="Ej: +500 Estudiantes" />
                            </div>
                        </SectionContent>

                        <SectionHeader id="testimonials" title="Testimonios" icon={MessageCircle} openSection={openSection} toggleSection={toggleSection} />
                        <SectionContent id="testimonials" openSection={openSection}>
                             <div><Label>Título de Sección</Label><Input value={content.testimonialTitle || ''} onChange={(e) => setContent({...content, testimonialTitle: e.target.value})} placeholder="Ej: Lo que dicen nuestros alumnos" /></div>
                             <div className="mt-3"><Label>Subtítulo de Sección</Label><Input value={content.testimonialSubtitle || ''} onChange={(e) => setContent({...content, testimonialSubtitle: e.target.value})} placeholder="Ej: Historias de éxito" /></div>
                             <div className="space-y-4 mt-4">
                                {(content.testimonials || []).map((t, i) => (
                                    <div key={i} className="bg-gray-900 p-3 rounded border border-gray-700 relative group">
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"><button onClick={() => removeItem('testimonials', i)} className="text-red-500"><Trash2 className="w-4 h-4"/></button></div>
                                        <div className="grid grid-cols-2 gap-2 mb-2">
                                            <div><Label>Nombre</Label><Input value={t.name} onChange={(e) => updateArrayItem('testimonials', i, 'name', e.target.value)} /></div>
                                            <div><Label>Ciudad/País</Label><Input value={t.location || ''} onChange={(e) => updateArrayItem('testimonials', i, 'location', e.target.value)} placeholder="Ej: Madrid, ES" /></div>
                                        </div>
                                        
                                        <div className="mb-2">
                                            <Label>Foto URL (Opcional)</Label>
                                            <div className="flex gap-2 items-center">
                                                <Input value={t.image || ''} onChange={(e) => updateArrayItem('testimonials', i, 'image', e.target.value)} placeholder="https://..." />
                                                {t.image && (
                                                    <img src={t.image} alt="Preview" className="w-8 h-8 rounded-full object-cover border border-gray-700 bg-gray-800" />
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-2">
                                            <Label>Rating</Label>
                                            <div className="flex gap-1">
                                                {[1,2,3,4,5].map(star => (
                                                    <button key={star} onClick={() => updateArrayItem('testimonials', i, 'rating', star)} className="focus:outline-none hover:scale-110 transition">
                                                        <Star className={`w-5 h-5 ${star <= t.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}`} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div><Label>Testimonio</Label><RichTextArea value={t.text} onChange={(e) => updateArrayItem('testimonials', i, 'text', e.target.value)} className="min-h-[60px]" /></div>
                                    </div>
                                ))}
                                <button onClick={() => addItem('testimonials')} className="w-full py-2 border border-dashed border-gray-700 text-gray-400 hover:text-white rounded text-xs flex items-center justify-center gap-1"><Plus className="w-3 h-3" /> Agregar Testimonio</button>
                             </div>
                        </SectionContent>

                        <SectionHeader id="intro" title="Introducción" icon={Image} openSection={openSection} toggleSection={toggleSection} />
                        <SectionContent id="intro" openSection={openSection}>
                            <div><Label>Título de Sección</Label><Input value={content.intro.title} onChange={(e) => updateNestedField('intro', 'title', e.target.value)} /></div>
                            <div><Label>Descripción</Label><RichTextArea value={content.intro.description} onChange={(e) => updateNestedField('intro', 'description', e.target.value)} className="h-32" /></div>
                            <div className="pt-2"><Label>Texto Tarjeta Flotante (Sobre Imagen)</Label><Input value={content.intro.imageCardText || ''} onChange={(e) => updateNestedField('intro', 'imageCardText', e.target.value)} placeholder="Ej: Método Único" /></div>
                            
                            <div className="pt-4 border-t border-gray-800">
                                <Label>Puntos Clave (Bullets)</Label>
                                <div className="space-y-4 mt-2">
                                    {(content.intro.items || []).map((item, i) => (
                                        <div key={i} className="bg-gray-900 p-3 rounded border border-gray-700 relative group">
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"><button onClick={() => removeItem('introItems', i)} className="text-red-500"><Trash2 className="w-4 h-4"/></button></div>
                                            <div className="mb-2"><Label>Título</Label><Input value={item.title} onChange={(e) => updateIntroItem(i, 'title', e.target.value)} /></div>
                                            <div><Label>Descripción</Label><RichTextArea value={item.description} onChange={(e) => updateIntroItem(i, 'description', e.target.value)} className="min-h-[60px]" /></div>
                                        </div>
                                    ))}
                                    <button onClick={() => addItem('introItems')} className="w-full py-2 border border-dashed border-gray-700 text-gray-400 hover:text-white rounded text-xs flex items-center justify-center gap-1"><Plus className="w-3 h-3" /> Agregar Punto Clave</button>
                                </div>
                            </div>
                        </SectionContent>

                        <SectionHeader id="benefits" title="Beneficios" icon={Award} openSection={openSection} toggleSection={toggleSection} />
                        <SectionContent id="benefits" openSection={openSection}>
                            <div><Label>Título de Sección</Label><Input value={content.benefits.title} onChange={(e) => setContent({...content, benefits: {...content.benefits, title: e.target.value}})} /></div>
                            
                            <div className="mt-3">
                                <Label>Subtítulo de Sección</Label>
                                <Input 
                                    value={content.benefits.subtitle || ''} 
                                    onChange={(e) => setContent({
                                        ...content, 
                                        benefits: { ...content.benefits, subtitle: e.target.value }
                                    })} 
                                />
                            </div>

                            <div className="space-y-4 mt-4">
                                {(content.benefits.items || []).map((item, i) => (
                                    <div key={i} className="bg-gray-900 p-3 rounded border border-gray-700 relative group">
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"><button onClick={() => removeItem('benefits', i)} className="text-red-500"><Trash2 className="w-4 h-4"/></button></div>
                                        <div className="flex gap-4 mb-2">
                                            <div className="flex-1"><Label>Título del Beneficio</Label><Input value={item.title} onChange={(e) => updateBenefitItem(i, 'title', e.target.value)} /></div>
                                            <div>
                                                <Label>Icono</Label>
                                                <IconPicker selected={item.icon} onChange={(icon) => updateBenefitItem(i, 'icon', icon)} />
                                            </div>
                                        </div>
                                        <div className="mb-