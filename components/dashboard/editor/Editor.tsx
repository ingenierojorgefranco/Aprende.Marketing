
import React, { useState, useRef, useEffect } from 'react';
import { LandingPage, GeneratedPageContent, ColorPalette, StructureType, DestinationType } from '../../../types';
import { Save, Globe, ArrowLeft, CheckCircle, LayoutTemplate, Palette, Type, Settings, Smartphone, Monitor, Sparkles, FileText, Maximize, Minimize2, MessageCircle, Link as LinkIcon, Target, Plus, Trash2, ChevronDown, ChevronUp, Image, HelpCircle, User, Award, Anchor, Menu, MousePointerClick, Facebook, Instagram, Twitter, Bold, Italic, List, AlignCenter, AlignLeft, Star, DollarSign, Briefcase, Users, Zap, BookOpen, ScanFace, Feather, Rocket, Grid, ExternalLink, PlayCircle, Gift } from 'lucide-react';
import { LivePage } from '../../LivePage';

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
  
  // NEW: View Mode for Preview (Toggle between Landing and Thank You)
  const [previewView, setPreviewView] = useState<'home' | 'thank-you'>('home');
  
  const [openSection, setOpenSection] = useState<string | null>('header');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

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

  // --- THANK YOU PAGE UPDATE HELPER ---
  const updateThankYouPage = (field: string, value: string) => {
      setContent(prev => ({
          ...prev,
          thankYouPage: {
              ...prev.thankYouPage,
              [field]: value
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
            
            {/* NEW: View Mode Switcher (Landing / Thanks) */}
            <button 
                onClick={() => setPreviewView('home')} 
                className={`text-xs px-3 py-1.5 rounded transition font-bold ${previewView === 'home' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
                Landing
            </button>
            <button 
                onClick={() => setPreviewView('thank-you')} 
                className={`text-xs px-3 py-1.5 rounded transition font-bold ${previewView === 'thank-you' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
                Gracias
            </button>

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
                            {/* ... (Existing Logo/Brand inputs) ... */}
                            <div><Label>1. Logo / Icono Marca</Label><div className="flex gap-2 mb-2"><div className="flex-1"><Label>Seleccionar Icono</Label><IconPicker selected={content.brandIcon} onChange={(icon) => setContent({...content, brandIcon: icon})} /></div></div></div>
                            <div><Label>2. Nombre de la Marca</Label><Input value={content.brandName || ''} onChange={(e) => setContent({ ...content, brandName: e.target.value })} placeholder="Ej: Beauty Pro" /></div>
                            <div className="pt-4 border-t border-gray-800"><Label>3. Enlaces del Menú</Label><div className="space-y-3 mt-2">{(content.navLinks || []).map((link, i) => (<div key={i} className="flex gap-2 items-center bg-gray-900 p-2 rounded border border-gray-700"><div className="flex-1 space-y-1"><input className="w-full bg-black border border-gray-800 rounded px-2 py-1 text-xs text-white" value={link.label} onChange={(e) => updateArrayItem('navLinks', i, 'label', e.target.value)} placeholder="Nombre" /><input className="w-full bg-black border border-gray-800 rounded px-2 py-1 text-xs text-blue-400" value={link.href} onChange={(e) => updateArrayItem('navLinks', i, 'href', e.target.value)} placeholder="#seccion" /></div><button onClick={() => removeItem('navLinks', i)} className="p-2 text-red-500 hover:bg-red-900/20 rounded"><Trash2 className="w-4 h-4"/></button></div>))}<button onClick={() => addItem('navLinks')} className="w-full py-2 border border-dashed border-gray-700 text-gray-400 hover:text-white rounded text-xs flex items-center justify-center gap-1"><Plus className="w-3 h-3" /> Añadir Enlace</button></div></div>
                            <div className="pt-4 border-t border-gray-800"><Label>4. Texto Botón CTA</Label><div className="flex gap-2"><Input value={content.navCta || ''} onChange={(e) => setContent({...content, navCta: e.target.value})} placeholder="Ej: Regístrate Gratis" /><div className="p-2 bg-gray-800 border border-gray-700 rounded text-gray-400"><MousePointerClick className="w-5 h-5"/></div></div></div>
                        </SectionContent>

                        {/* 2. Hero Section */}
                        <SectionHeader id="hero" title="Sección Hero" icon={Sparkles} openSection={openSection} toggleSection={toggleSection} />
                        <SectionContent id="hero" openSection={openSection}>
                            <div><Label>Tagline Superior</Label><Input value={content.topTagline || ''} onChange={(e) => setContent({ ...content, topTagline: e.target.value })} /></div>
                            <div><Label>Título Principal</Label><RichTextArea value={content.hero.headline} onChange={(e) => updateNestedField('hero', 'headline', e.target.value)} /></div>
                            <div><Label>Subtítulo</Label><RichTextArea value={content.hero.subheadline} onChange={(e) => updateNestedField('hero', 'subheadline', e.target.value)} /></div>
                            <div><Label>URL Imagen/Video</Label><Input value={content.hero.heroImage || ''} onChange={(e) => updateNestedField('hero', 'heroImage', e.target.value)} /></div>
                            <div><Label>Texto Botón CTA</Label><Input value={content.hero.ctaText} onChange={(e) => updateNestedField('hero', 'ctaText', e.target.value)} /></div>
                        </SectionContent>

                        {/* ... (Existing sections: Testimonials, Intro, Benefits, Instructor, FAQ) ... */}
                        
                        {/* 8. Footer & Legal */}
                        <SectionHeader id="footer" title="Footer y Legal" icon={LayoutTemplate} openSection={openSection} toggleSection={toggleSection} />
                        <SectionContent id="footer" openSection={openSection}>
                             <div><Label>Texto de Cierre</Label><Input value={content.closingOfferText || ''} onChange={(e) => setContent({ ...content, closingOfferText: e.target.value })} /></div>
                             <div className="pt-4 border-t border-gray-800"><Label>Copyright Text</Label><Input value={content.footer.copyright} onChange={(e) => updateNestedField('footer', 'copyright', e.target.value)} /></div>
                             <div><Label>Email</Label><Input value={content.footer.contact} onChange={(e) => updateNestedField('footer', 'contact', e.target.value)} /></div>
                        </SectionContent>

                        {/* NEW: Thank You Page Section */}
                        <SectionHeader id="thankyou" title="Página de Gracias" icon={Gift} openSection={openSection} toggleSection={toggleSection} />
                        <SectionContent id="thankyou" openSection={openSection}>
                            <div className="bg-green-900/20 p-3 rounded border border-green-500/30 text-xs text-green-300 mb-4">
                                Esta es la página que verán los usuarios después de registrarse.
                            </div>
                            
                            <div>
                                <Label>Título de Agradecimiento</Label>
                                <Input 
                                    value={content.thankYouPage?.headline || "¡Felicidades! Registro Exitoso"} 
                                    onChange={(e) => updateThankYouPage('headline', e.target.value)} 
                                />
                            </div>
                            
                            <div>
                                <Label>Mensaje / Instrucciones</Label>
                                <RichTextArea 
                                    value={content.thankYouPage?.subheadline || "Hemos recibido tus datos correctamente."} 
                                    onChange={(e) => updateThankYouPage('subheadline', e.target.value)} 
                                    className="h-20"
                                />
                            </div>

                            <div>
                                <Label>Texto del Botón Siguiente</Label>
                                <Input 
                                    value={content.thankYouPage?.ctaText || "Unirme al Grupo VIP"} 
                                    onChange={(e) => updateThankYouPage('ctaText', e.target.value)} 
                                />
                            </div>

                            <div>
                                <Label>Enlace del Botón (WhatsApp/Descarga)</Label>
                                <Input 
                                    value={content.thankYouPage?.ctaLink || ""} 
                                    onChange={(e) => updateThankYouPage('ctaLink', e.target.value)} 
                                    placeholder="https://wa.me/..."
                                />
                                <p className="text-[10px] text-gray-500 mt-1">Si lo dejas vacío, usará el teléfono de WhatsApp configurado en Ajustes.</p>
                            </div>
                        </SectionContent>
                      </>
                  )}

                  {/* ... (Existing Design and Settings Tabs) ... */}
                  {activeTab === 'settings' && (
                      <div className="space-y-6 animate-in slide-in-from-left-2 duration-200 p-2">
                           {/* ... General ... */}
                           <div className="bg-black p-4 rounded-xl border border-gray-800">
                              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                  <Target className="w-4 h-4 text-primary" /> Destino (CTA)
                              </h3>
                              {/* ... (Destination options) ... */}
                              <div className="flex flex-wrap gap-2 mb-4">
                                <button onClick={() => updateDestination('type', 'form')} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition ${content.destination?.type === 'form' ? 'bg-primary text-white border-primary' : 'border-gray-700 text-gray-400 hover:bg-gray-800'}`}><FileText className="w-3 h-3" /> Form</button>
                                <button onClick={() => updateDestination('type', 'whatsapp')} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition ${content.destination?.type === 'whatsapp' ? 'bg-green-600 text-white border-green-600' : 'border-gray-700 text-gray-400 hover:bg-gray-800'}`}><MessageCircle className="w-3 h-3" /> WhatsApp</button>
                                <button onClick={() => updateDestination('type', 'external_url')} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition ${content.destination?.type === 'external_url' ? 'bg-purple-600 text-white border-purple-600' : 'border-gray-700 text-gray-400 hover:bg-gray-800'}`}><LinkIcon className="w-3 h-3" /> Link</button>
                              </div>
                              <div className="space-y-4 border-t border-gray-800 pt-4">
                                {content.destination?.type === 'whatsapp' && (
                                    <>
                                        <div><Label>Número WhatsApp</Label><Input value={content.destination.whatsappPhone || ''} onChange={(e) => updateDestination('whatsappPhone', e.target.value)} placeholder="+57 300 123 4567" /></div>
                                        <div><Label>Mensaje Inicial</Label><Input value={content.destination.whatsappMessage || ''} onChange={(e) => updateDestination('whatsappMessage', e.target.value)} placeholder="Hola..." /></div>
                                    </>
                                )}
                                {content.destination?.type === 'external_url' && (
                                    <div><Label>URL de Destino</Label><Input value={content.destination.url || ''} onChange={(e) => updateDestination('url', e.target.value)} placeholder="https://..." /></div>
                                )}
                                {content.destination?.type === 'form' && (
                                    <div className="text-xs text-gray-500 bg-gray-900 p-3 rounded border border-gray-800 italic">* Se capturarán leads en el CRM y luego redirigirá a la página de gracias.</div>
                                )}
                              </div>
                           </div>
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
                
                {/* PREVIEW VIEWPORT WITH VIEW MODE SWITCHING */}
                <div id="preview-viewport" className="w-full h-full overflow-y-auto bg-white scrollbar-hide">
                    <LivePage 
                        content={content} 
                        isMobilePreview={previewMode === 'mobile'} 
                        viewMode={previewView} // Passing home or thank-you
                        // pageId is optional in preview, but good for relative linking simulation if needed
                        pageId={page.id}
                    />
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};
