import React, { useState, useRef } from 'react';
import { LandingPage, GeneratedPageContent, ColorPalette, StructureType, DestinationType } from '../types';
import { Save, Globe, ArrowLeft, CheckCircle, LayoutTemplate, Palette, Type, Settings, Smartphone, Monitor, Sparkles, FileText, Maximize, Minimize2, MessageCircle, Link as LinkIcon, Target, Plus, Trash2, ChevronDown, ChevronUp, Image, HelpCircle, User, Award, Anchor, Menu, MousePointerClick, Facebook, Instagram, Twitter, Bold, Italic, List, AlignCenter, AlignLeft, Star, DollarSign, Briefcase, Users, Zap, BookOpen, ScanFace, Feather, Rocket, Grid, ExternalLink, Eye } from 'lucide-react';
import { LivePage } from './LivePage';

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

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:border-primary outline-none transition" {...props} />
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
                <button onClick={() => insertTag('<br/>', '')} className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white" title="Salto de línea"><ArrowLeft className="w-3 h-3 rotate-90"/></button>
            </div>
            <textarea
                ref={textareaRef}
                value={value}
                onChange={onChange}
                className={`w-full bg-gray-900 border border-gray-800 border-t-0 rounded-b-lg px-3 py-2 text-white text-sm focus:border-primary outline-none transition resize-y min-h-[100px] font-sans ${className}`}
                {...props}
            />
        </div>
    );
};

// --- MAIN EDITOR COMPONENT ---

interface EditorProps {
  page: LandingPage;
  onSave: (page: LandingPage) => Promise<void>;
  onBack: () => void;
}

export const Editor: React.FC<EditorProps> = ({ page, onSave, onBack }) => {
  const [content, setContent] = useState<GeneratedPageContent>(page.content);
  const [saving, setSaving] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>('hero');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const toggleSection = (id: string) => setOpenSection(openSection === id ? null : id);

  const updateContent = (path: string, value: any) => {
    const newContent = { ...content };
    const keys = path.split('.');
    let current: any = newContent;
    
    for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setContent(newContent);
  };

  const updateArrayItem = (path: string, index: number, field: string, value: any) => {
      const newContent = { ...content };
      const keys = path.split('.');
      let current: any = newContent;
      for (const key of keys) current = current[key];
      
      // If primitive array
      if (typeof current[index] !== 'object') {
          current[index] = value;
      } else {
          current[index][field] = value;
      }
      setContent(newContent);
  };

  const handleSave = async () => {
    setSaving(true);
    // Preservar estado de publicación original, solo guardar contenido
    await onSave({ ...page, content });
    setSaving(false);
  };

  const publicUrl = `/admin/lp/${page.subdomain ? page.subdomain.split('.')[0] : page.id}`;

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 z-20">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-white font-bold text-lg">{page.name}</h1>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className={`w-2 h-2 rounded-full ${page.isPublished ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                        {page.isPublished ? 'Publicada' : 'Borrador'}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden md:flex bg-black border border-gray-800 rounded-lg p-1 mr-4">
                    <button 
                        onClick={() => setPreviewMode('desktop')}
                        className={`p-2 rounded ${previewMode === 'desktop' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-white'}`}
                    >
                        <Monitor className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => setPreviewMode('mobile')}
                        className={`p-2 rounded ${previewMode === 'mobile' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-white'}`}
                    >
                        <Smartphone className="w-4 h-4" />
                    </button>
                </div>

                <a 
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-bold text-sm transition flex items-center gap-2 border border-gray-700"
                >
                    <ExternalLink className="w-4 h-4" /> Ver Página
                </a>

                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-primary hover:bg-indigo-600 text-white rounded-lg font-bold text-sm transition flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                >
                    {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save className="w-4 h-4" />}
                    Guardar Cambios
                </button>
            </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Editor */}
            <aside className="w-full md:w-[400px] bg-black border-r border-gray-800 overflow-y-auto p-4 custom-scrollbar z-10 flex-shrink-0">
                <div className="space-y-2 pb-20">
                    <div className="mb-6">
                        <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Estructura & Diseño</h2>
                        <SectionHeader id="brand" title="Identidad de Marca" icon={Sparkles} openSection={openSection} toggleSection={toggleSection} />
                        <SectionContent id="brand" openSection={openSection}>
                            <div>
                                <Label>Nombre de Marca</Label>
                                <Input value={content.brandName || ''} onChange={(e) => updateContent('brandName', e.target.value)} placeholder="Ej: BeautyPro" />
                            </div>
                            <div>
                                <Label>Icono / Logo</Label>
                                <div className="flex gap-4 items-center">
                                    <IconPicker selected={content.brandIcon} onChange={(icon) => updateContent('brandIcon', icon)} />
                                    <span className="text-xs text-gray-500">Selecciona un icono</span>
                                </div>
                            </div>
                            <div>
                                <Label>Paleta de Colores</Label>
                                <select 
                                    value={content.palette}
                                    onChange={(e) => updateContent('palette', e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm outline-none"
                                >
                                    <option value="modern-blue">Azul Moderno</option>
                                    <option value="elegant-purple">Púrpura Elegante</option>
                                    <option value="energetic-orange">Naranja Energético</option>
                                    <option value="nature-green">Verde Naturaleza</option>
                                    <option value="dark-luxury">Lujo Oscuro</option>
                                    <option value="ocean-teal">Océano Teal</option>
                                    <option value="crimson-red">Rojo Carmesí</option>
                                    <option value="corporate-slate">Corporativo Slate</option>
                                    <option value="gold-prestige">Dorado Prestigio</option>
                                    <option value="minimal-mono">Minimalista Monocromo</option>
                                </select>
                            </div>
                        </SectionContent>
                    </div>

                    <SectionHeader id="hero" title="Sección Hero (Inicio)" icon={LayoutTemplate} openSection={openSection} toggleSection={toggleSection} />
                    <SectionContent id="hero" openSection={openSection}>
                        <div>
                            <Label>Tagline Superior</Label>
                            <Input value={content.topTagline || ''} onChange={(e) => updateContent('topTagline', e.target.value)} placeholder="Ej: 🔥 Clase Gratuita" />
                        </div>
                        <div>
                            <Label>Título Principal (H1)</Label>
                            <RichTextArea value={content.hero.headline} onChange={(e) => updateContent('hero.headline', e.target.value)} placeholder="Usa <b>negrita</b> para resaltar" />
                        </div>
                        <div>
                            <Label>Subtítulo</Label>
                            <RichTextArea value={content.hero.subheadline} onChange={(e) => updateContent('hero.subheadline', e.target.value)} />
                        </div>
                        <div>
                            <Label>Texto del Botón (CTA)</Label>
                            <Input value={content.hero.ctaText} onChange={(e) => updateContent('hero.ctaText', e.target.value)} />
                        </div>
                        <div>
                            <Label>Imagen Principal / Video Cover (URL)</Label>
                            <Input value={content.hero.heroImage || ''} onChange={(e) => updateContent('hero.heroImage', e.target.value)} placeholder="https://..." />
                        </div>
                    </SectionContent>

                    <SectionHeader id="intro" title="Introducción / Qué es" icon={BookOpen} openSection={openSection} toggleSection={toggleSection} />
                    <SectionContent id="intro" openSection={openSection}>
                        <div>
                            <Label>Título de la Sección</Label>
                            <Input value={content.intro.title} onChange={(e) => updateContent('intro.title', e.target.value)} />
                        </div>
                        <div>
                            <Label>Descripción</Label>
                            <RichTextArea value={content.intro.description} onChange={(e) => updateContent('intro.description', e.target.value)} className="h-32" />
                        </div>
                        {content.intro.items && (
                            <div className="space-y-4 pt-4 border-t border-gray-800">
                                <Label>Puntos Clave</Label>
                                {content.intro.items.map((item, i) => (
                                    <div key={i} className="bg-gray-900 p-3 rounded border border-gray-800">
                                        <div className="mb-2">
                                            <Input value={item.title} onChange={(e) => updateArrayItem('intro.items', i, 'title', e.target.value)} placeholder="Título del punto" className="font-bold mb-1" />
                                            <RichTextArea value={item.description} onChange={(e) => updateArrayItem('intro.items', i, 'description', e.target.value)} placeholder="Descripción" className="text-xs" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </SectionContent>

                    <SectionHeader id="benefits" title="Beneficios" icon={Star} openSection={openSection} toggleSection={toggleSection} />
                    <SectionContent id="benefits" openSection={openSection}>
                        <div>
                            <Label>Título de la Sección</Label>
                            <Input value={content.benefits.title} onChange={(e) => updateContent('benefits.title', e.target.value)} />
                        </div>
                        <div className="space-y-3 mt-4">
                            {content.benefits.items.map((item, i) => (
                                <div key={i} className="bg-gray-900 p-3 rounded border border-gray-800 relative group">
                                    <div className="flex gap-3 mb-2">
                                        <div className="mt-1">
                                            <IconPicker selected={item.icon} onChange={(icon) => updateArrayItem('benefits.items', i, 'icon', icon)} />
                                        </div>
                                        <div className="flex-1">
                                            <Input value={item.title} onChange={(e) => updateArrayItem('benefits.items', i, 'title', e.target.value)} placeholder="Título del beneficio" className="mb-1" />
                                            <RichTextArea value={item.description} onChange={(e) => updateArrayItem('benefits.items', i, 'description', e.target.value)} placeholder="Descripción" className="text-xs" />
                                        </div>
                                    </div>
                                    <div className="mt-2 flex gap-2">
                                        <ColorPicker selected={item.color} onChange={(color) => updateArrayItem('benefits.items', i, 'color', color)} />
                                    </div>
                                    <button 
                                        onClick={() => {
                                            const newItems = content.benefits.items.filter((_, idx) => idx !== i);
                                            updateContent('benefits.items', newItems);
                                        }}
                                        className="absolute top-2 right-2 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <button 
                                onClick={() => updateContent('benefits.items', [...content.benefits.items, { title: 'Nuevo Beneficio', description: 'Descripción...', icon: 'Star', color: 'blue' }])}
                                className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-xs flex items-center justify-center gap-2 transition"
                            >
                                <Plus className="w-3 h-3" /> Agregar Beneficio
                            </button>
                        </div>
                    </SectionContent>

                    <SectionHeader id="instructor" title="Instructor / Experto" icon={User} openSection={openSection} toggleSection={toggleSection} />
                    <SectionContent id="instructor" openSection={openSection}>
                        <div>
                            <Label>Nombre</Label>
                            <Input value={content.instructor.name} onChange={(e) => updateContent('instructor.name', e.target.value)} />
                        </div>
                        <div>
                            <Label>Biografía</Label>
                            <RichTextArea value={content.instructor.bio} onChange={(e) => updateContent('instructor.bio', e.target.value)} className="h-24" />
                        </div>
                        <div>
                            <Label>Estadísticas (Opcional)</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Input value={content.instructor.statsStudents || ''} onChange={(e) => updateContent('instructor.statsStudents', e.target.value)} placeholder="5k+ Alumnos" />
                                <Input value={content.instructor.statsRating || ''} onChange={(e) => updateContent('instructor.statsRating', e.target.value)} placeholder="4.9/5 Rating" />
                            </div>
                        </div>
                    </SectionContent>

                    <SectionHeader id="cta" title="Configuración CTA" icon={Target} openSection={openSection} toggleSection={toggleSection} />
                    <SectionContent id="cta" openSection={openSection}>
                        <div>
                            <Label>Tipo de Destino</Label>
                            <div className="flex gap-2 mb-3">
                                {['form', 'whatsapp', 'external_url'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => updateContent('destination.type', type)}
                                        className={`px-3 py-1.5 rounded text-xs capitalize ${content.destination.type === type ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400'}`}
                                    >
                                        {type === 'external_url' ? 'Link Externo' : type}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {content.destination.type === 'whatsapp' && (
                            <>
                                <div><Label>Teléfono WhatsApp</Label><Input value={content.destination.whatsappPhone || ''} onChange={(e) => updateContent('destination.whatsappPhone', e.target.value)} /></div>
                                <div><Label>Mensaje Default</Label><Input value={content.destination.whatsappMessage || ''} onChange={(e) => updateContent('destination.whatsappMessage', e.target.value)} /></div>
                            </>
                        )}
                        {content.destination.type === 'external_url' && (
                            <div><Label>URL de Destino</Label><Input value={content.destination.url || ''} onChange={(e) => updateContent('destination.url', e.target.value)} placeholder="https://..." /></div>
                        )}
                        {content.destination.type === 'form' && (
                            <div className="text-xs text-gray-500 italic p-2 bg-gray-900 rounded border border-gray-800">
                                El formulario capturará Nombre y Email y los guardará en tu CRM automáticamente.
                            </div>
                        )}
                    </SectionContent>
                </div>
            </aside>

            {/* Preview Area */}
            <main className="flex-1 bg-[#111] relative overflow-hidden flex flex-col">
                <div className={`flex-1 transition-all duration-300 origin-top overflow-y-auto ${previewMode === 'mobile' ? 'max-w-[375px] mx-auto border-x border-gray-800 shadow-2xl bg-white h-full' : 'w-full h-full'}`} id="preview-viewport">
                    <LivePage 
                        content={content} 
                        isMobilePreview={previewMode === 'mobile'} 
                        pageId={page.id}
                    />
                </div>
            </main>
        </div>
    </div>
  );
};