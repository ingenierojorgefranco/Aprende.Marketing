
import React, { useState, useEffect, useRef } from 'react';
import { Course, CourseModule, CourseLesson } from '../../../types';
import { api } from '../../../services/api';
import { Video, Plus, Edit, Trash2, Save, ArrowLeft, ChevronDown, ChevronUp, Loader2, GripVertical, Image as ImageIcon, Bold, Italic, List, Code, Type, AlignLeft, AlignCenter, AlignRight, Underline, Palette, Eye, EyeOff } from 'lucide-react';

// --- VISUAL EDITOR COMPONENT (WYSIWYG) ---
interface VisualEditorProps {
    value: string;
    onChange: (val: string) => void;
    className?: string;
    placeholder?: string;
}

const VisualEditor = ({ value, onChange, className, placeholder }: VisualEditorProps) => {
    const [isSourceMode, setIsSourceMode] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    // Initial Sync
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
            {/* Toolbar */}
            <div className={`flex flex-wrap items-center gap-1 bg-gray-900 p-1.5 border-b border-gray-700 ${isSourceMode ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="flex gap-0.5 border-r border-gray-700 pr-2 mr-1">
                    <button type="button" onClick={() => execCmd('formatBlock', 'P')} className="p-1.5 rounded hover:bg-gray-800 text-gray-400 text-xs font-bold w-7" title="Párrafo">P</button>
                    <button type="button" onClick={() => execCmd('formatBlock', 'H3')} className="p-1.5 rounded hover:bg-gray-800 text-gray-400 text-xs font-bold w-7" title="Título H3">H3</button>
                    <button type="button" onClick={() => execCmd('formatBlock', 'H4')} className="p-1.5 rounded hover:bg-gray-800 text-gray-400 text-xs font-bold w-7" title="Título H4">H4</button>
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
                <div className="w-px h-4 bg-gray-700 mx-1"></div>
                
                {/* Colors - Native Color Input Hack */}
                <div className="relative group p-1.5 hover:bg-gray-800 rounded cursor-pointer">
                    <Type className="w-3.5 h-3.5 text-gray-400 group-hover:text-white" />
                    <input type="color" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" onChange={(e) => execCmd('foreColor', e.target.value)} title="Color Texto" />
                </div>
                <div className="relative group p-1.5 hover:bg-gray-800 rounded cursor-pointer">
                    <Palette className="w-3.5 h-3.5 text-gray-400 group-hover:text-white" />
                    <input type="color" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" onChange={(e) => execCmd('hiliteColor', e.target.value)} title="Resaltado" />
                </div>

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

            {/* Editor Area */}
            <div className="relative min-h-[150px] bg-black">
                {isSourceMode ? (
                    <textarea 
                        ref={textAreaRef}
                        className="w-full h-full min-h-[150px] p-3 bg-[#0d1117] text-gray-300 font-mono text-xs outline-none resize-y"
                        value={value}
                        onChange={handleSourceChange}
                    />
                ) : (
                    <div 
                        ref={contentRef}
                        className="prose prose-invert prose-sm max-w-none p-3 outline-none min-h-[150px] text-gray-300"
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

export const AdminCourses: React.FC = () => {
    const [view, setView] = useState<'list' | 'editor'>('list');
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingCourse, setEditingCourse] = useState<Partial<Course>>({});
    const [activeTab, setActiveTab] = useState<'general' | 'curriculum'>('general');
    const [expandedModules, setExpandedModules] = useState<string[]>([]);
    
    // Drag & Drop State
    const [draggedCourseIndex, setDraggedCourseIndex] = useState<number | null>(null);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        setLoading(true);
        try {
            const data = await api.getAdminCourses();
            setCourses(data);
        } catch (e) {
            console.error("Failed to load courses");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNew = () => {
        setEditingCourse({
            title: '',
            subtitle: '',
            badge_text: 'Certificado',
            description: '',
            slug: '',
            thumbnail: '',
            is_active: true, // Default active
            modules: []
        });
        setView('editor');
        setActiveTab('general');
    };

    const handleEdit = (course: Course) => {
        setEditingCourse({ ...course });
        setView('editor');
        setActiveTab('general');
    };

    const handleDelete = async (id: string) => {
        if (confirm("¿Eliminar este curso? Esta acción no se puede deshacer.")) {
            await api.deleteCourse(id);
            setCourses(courses.filter(c => c.id !== id));
        }
    };

    // New: Toggle Visibility directly from list
    const toggleVisibility = async (course: Course) => {
        const newStatus = !course.is_active;
        try {
            // Optimistic update
            setCourses(courses.map(c => c.id === course.id ? { ...c, is_active: newStatus } : c));
            
            // API Call
            await api.saveCourse({ ...course, is_active: newStatus });
        } catch (e) {
            alert("Error actualizando estado.");
            // Revert
            setCourses(courses.map(c => c.id === course.id ? { ...c, is_active: !newStatus } : c));
        }
    };

    const handleSaveCourse = async () => {
        if (!editingCourse.title || !editingCourse.slug) return alert("Título y Slug obligatorios");
        
        setLoading(true);
        try {
            await api.saveCourse(editingCourse as Course);
            await loadCourses();
            setView('list');
        } catch (e) {
            alert("Error guardando el curso");
        } finally {
            setLoading(false);
        }
    };

    // --- DRAG & DROP HANDLERS ---
    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedCourseIndex(index);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = async (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault();
        if (draggedCourseIndex === null || draggedCourseIndex === targetIndex) return;

        const newCourses = [...courses];
        const [movedCourse] = newCourses.splice(draggedCourseIndex, 1);
        newCourses.splice(targetIndex, 0, movedCourse);
        
        setCourses(newCourses);
        setDraggedCourseIndex(null);

        // Save new order
        try {
            const orderedIds = newCourses.map(c => c.id);
            await api.reorderCourses(orderedIds);
        } catch (err) {
            console.error("Error saving order", err);
            alert("Error guardando el orden");
        }
    };

    // --- CURRICULUM HELPERS ---
    const addModule = () => {
        const newModule: CourseModule = {
            id: `new-mod-${Date.now()}`,
            title: 'Nuevo Módulo',
            order_index: (editingCourse.modules?.length || 0) + 1,
            lessons: []
        };
        setEditingCourse(prev => ({ ...prev, modules: [...(prev.modules || []), newModule] }));
        setExpandedModules(prev => [...prev, newModule.id]);
    };

    const updateModule = (id: string, title: string) => {
        setEditingCourse(prev => ({
            ...prev,
            modules: prev.modules?.map(m => m.id === id ? { ...m, title } : m)
        }));
    };

    const deleteModule = (id: string) => {
        setEditingCourse(prev => ({
            ...prev,
            modules: prev.modules?.filter(m => m.id !== id)
        }));
    };

    const addLesson = (moduleId: string) => {
        const newLesson: CourseLesson = {
            id: `new-lesson-${Date.now()}`,
            title: 'Nueva Lección',
            duration: '00:00',
            video_url: '',
            description: '',
            learning_points: [''], // Initialize with one empty point
            order_index: 0
        };
        setEditingCourse(prev => ({
            ...prev,
            modules: prev.modules?.map(m => {
                if (m.id === moduleId) {
                    return { ...m, lessons: [...m.lessons, { ...newLesson, order_index: m.lessons.length + 1 }] };
                }
                return m;
            })
        }));
    };

    const updateLesson = (moduleId: string, lessonId: string, field: string, value: any) => {
        setEditingCourse(prev => ({
            ...prev,
            modules: prev.modules?.map(m => {
                if (m.id === moduleId) {
                    return {
                        ...m,
                        lessons: m.lessons.map(l => l.id === lessonId ? { ...l, [field]: value } : l)
                    };
                }
                return m;
            })
        }));
    };

    const deleteLesson = (moduleId: string, lessonId: string) => {
        setEditingCourse(prev => ({
            ...prev,
            modules: prev.modules?.map(m => {
                if (m.id === moduleId) {
                    return { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) };
                }
                return m;
            })
        }));
    };

    const toggleModuleExpand = (id: string) => {
        if (expandedModules.includes(id)) {
            setExpandedModules(expandedModules.filter(mId => mId !== id));
        } else {
            setExpandedModules([...expandedModules, id]);
        }
    };

    if (view === 'list') {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Video className="w-6 h-6 text-primary" /> Gestión de Cursos
                    </h1>
                    <button onClick={handleCreateNew} className="bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition">
                        <Plus className="w-4 h-4" /> Crear Nuevo Curso
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-20 bg-gray-900 rounded-xl border border-dashed border-gray-700">
                        <p className="text-gray-400">No hay cursos creados.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course, index) => (
                            <div 
                                key={course.id} 
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDrop={(e) => handleDrop(e, index)}
                                className={`bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-primary/50 transition group relative cursor-grab active:cursor-grabbing ${draggedCourseIndex === index ? 'opacity-50' : ''}`}
                            >
                                <div className="absolute top-2 left-2 z-10 p-1.5 bg-black/60 rounded cursor-grab active:cursor-grabbing text-white opacity-0 group-hover:opacity-100 transition">
                                    <GripVertical className="w-4 h-4" />
                                </div>

                                <div className="h-40 bg-gray-800 relative">
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} className={`w-full h-full object-cover transition ${!course.is_active ? 'grayscale opacity-50' : ''}`} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-600"><ImageIcon className="w-8 h-8" /></div>
                                    )}
                                    
                                    {/* Action Buttons Overlay */}
                                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                        <button 
                                            onClick={() => toggleVisibility(course)} 
                                            className={`p-2 rounded-full text-white ${course.is_active ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-600 hover:bg-gray-500'}`}
                                            title={course.is_active ? "Desactivar" : "Activar"}
                                        >
                                            {course.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        </button>
                                        <button onClick={() => handleEdit(course)} className="p-2 bg-gray-900/80 hover:bg-white hover:text-black text-white rounded-full"><Edit className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(course.id)} className="p-2 bg-red-900/80 hover:bg-red-600 text-white rounded-full"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                    
                                    {!course.is_active && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <span className="bg-black/70 text-white px-3 py-1 rounded font-bold text-sm border border-white/20">INACTIVO</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-white text-lg mb-1">{course.title}</h3>
                                    <p className="text-xs text-gray-500 mb-3">{course.modules?.length || 0} Módulos • {course.slug}</p>
                                    <div className="text-sm text-gray-400 line-clamp-2">{course.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <button onClick={() => setView('list')} className="text-gray-400 hover:text-white flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Volver
                </button>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg cursor-pointer border border-gray-700">
                        <input 
                            type="checkbox" 
                            checked={editingCourse.is_active}
                            onChange={(e) => setEditingCourse({...editingCourse, is_active: e.target.checked})}
                            className="w-4 h-4 accent-green-500"
                        />
                        <span className="text-white text-sm font-bold">Curso Activo</span>
                    </label>
                    <button onClick={handleSaveCourse} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Guardar Curso
                    </button>
                </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
                <div className="flex border-b border-gray-800">
                    <button 
                        onClick={() => setActiveTab('general')}
                        className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition ${activeTab === 'general' ? 'border-primary text-white bg-gray-800' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                    >
                        Información General
                    </button>
                    <button 
                        onClick={() => setActiveTab('curriculum')}
                        className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition ${activeTab === 'curriculum' ? 'border-primary text-white bg-gray-800' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                    >
                        Plan de Estudios (Temario)
                    </button>
                </div>

                <div className="p-8">
                    {activeTab === 'general' && (
                        <div className="space-y-6 animate-in fade-in">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Título del Curso</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                                        value={editingCourse.title || ''}
                                        onChange={(e) => setEditingCourse({...editingCourse, title: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Slug (URL)</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                                        value={editingCourse.slug || ''}
                                        onChange={(e) => setEditingCourse({...editingCourse, slug: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Subtítulo Corto</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                                        value={editingCourse.subtitle || ''}
                                        onChange={(e) => setEditingCourse({...editingCourse, subtitle: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Texto del Badge (ej: Certificado)</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                                        value={editingCourse.badge_text || ''}
                                        onChange={(e) => setEditingCourse({...editingCourse, badge_text: e.target.value})}
                                        placeholder="Certificado"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Descripción Completa</label>
                                <textarea 
                                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary outline-none h-32"
                                    value={editingCourse.description || ''}
                                    onChange={(e) => setEditingCourse({...editingCourse, description: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Thumbnail URL</label>
                                <div className="flex gap-4">
                                    <input 
                                        type="text" 
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                                        value={editingCourse.thumbnail || ''}
                                        onChange={(e) => setEditingCourse({...editingCourse, thumbnail: e.target.value})}
                                        placeholder="https://..."
                                    />
                                    {editingCourse.thumbnail && <img src={editingCourse.thumbnail} className="h-12 w-12 rounded object-cover border border-gray-700" alt="Preview" />}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'curriculum' && (
                        <div className="space-y-6 animate-in fade-in">
                            <div className="flex justify-between items-center">
                                <h3 className="text-white font-bold">Estructura del Curso</h3>
                                <button onClick={addModule} className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                                    <Plus className="w-4 h-4" /> Añadir Módulo
                                </button>
                            </div>

                            <div className="space-y-4">
                                {editingCourse.modules?.map((module, idx) => (
                                    <div key={module.id} className="border border-gray-700 rounded-xl bg-gray-800/50 overflow-hidden">
                                        <div className="p-4 flex items-center gap-4 bg-gray-800 hover:bg-gray-750 transition cursor-pointer" onClick={() => toggleModuleExpand(module.id)}>
                                            <div onClick={(e) => e.stopPropagation()} className="cursor-grab text-gray-500"><GripVertical className="w-5 h-5" /></div>
                                            <div className="flex-1">
                                                <input 
                                                    type="text" 
                                                    value={module.title}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={(e) => updateModule(module.id, e.target.value)}
                                                    className="bg-transparent text-white font-bold focus:outline-none w-full placeholder-gray-500"
                                                    placeholder="Título del Módulo"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button onClick={(e) => { e.stopPropagation(); deleteModule(module.id); }} className="p-2 text-gray-500 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                                {expandedModules.includes(module.id) ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                            </div>
                                        </div>

                                        {expandedModules.includes(module.id) && (
                                            <div className="p-4 bg-black/30 border-t border-gray-700 space-y-3">
                                                {module.lessons.map((lesson, lIdx) => (
                                                    <div key={lesson.id} className="pl-8 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg flex flex-col gap-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">{lIdx + 1}</div>
                                                            <input 
                                                                type="text" 
                                                                value={lesson.title} 
                                                                onChange={(e) => updateLesson(module.id, lesson.id, 'title', e.target.value)}
                                                                className="flex-1 bg-transparent text-white text-sm focus:outline-none"
                                                                placeholder="Título de la Lección"
                                                            />
                                                            <input 
                                                                type="text" 
                                                                value={lesson.duration} 
                                                                onChange={(e) => updateLesson(module.id, lesson.id, 'duration', e.target.value)}
                                                                className="w-16 bg-black border border-gray-700 rounded px-2 py-1 text-xs text-gray-300 text-center"
                                                                placeholder="00:00"
                                                            />
                                                            <button onClick={() => deleteLesson(module.id, lesson.id)} className="text-gray-600 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                                        </div>
                                                        <div className="pl-9 space-y-2">
                                                            <input 
                                                                type="text" 
                                                                value={lesson.video_url} 
                                                                onChange={(e) => updateLesson(module.id, lesson.id, 'video_url', e.target.value)}
                                                                className="w-full bg-black border border-gray-800 rounded px-3 py-2 text-xs text-blue-400 placeholder-gray-600"
                                                                placeholder="URL del Video (YouTube, Vimeo, MP4)"
                                                            />
                                                            
                                                            {/* Visual Editor for Description */}
                                                            <div>
                                                                <label className="text-[10px] text-gray-500 uppercase font-bold">Contenido de la Lección (Visual)</label>
                                                                <VisualEditor
                                                                    value={lesson.description || ''}
                                                                    onChange={(val) => updateLesson(module.id, lesson.id, 'description', val)}
                                                                    placeholder="Escribe la descripción de la lección aquí... Usa herramientas de formato arriba."
                                                                />
                                                            </div>

                                                            {/* Learning Points Manager */}
                                                            <div>
                                                                <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Puntos Clave de Aprendizaje</label>
                                                                <div className="space-y-2">
                                                                    {(lesson.learning_points || []).map((point, ptIdx) => (
                                                                        <div key={ptIdx} className="flex gap-2">
                                                                            <input 
                                                                                type="text"
                                                                                value={point}
                                                                                onChange={(e) => {
                                                                                    const newPoints = [...(lesson.learning_points || [])];
                                                                                    newPoints[ptIdx] = e.target.value;
                                                                                    updateLesson(module.id, lesson.id, 'learning_points', newPoints);
                                                                                }}
                                                                                className="flex-1 bg-black border border-gray-800 rounded px-3 py-1.5 text-xs text-white"
                                                                                placeholder="Ej: Mentalidad de Éxito"
                                                                            />
                                                                            <button 
                                                                                onClick={() => {
                                                                                    const newPoints = lesson.learning_points.filter((_, i) => i !== ptIdx);
                                                                                    updateLesson(module.id, lesson.id, 'learning_points', newPoints);
                                                                                }}
                                                                                className="text-red-500 hover:bg-red-900/20 p-1 rounded"
                                                                            >
                                                                                <Trash2 className="w-3 h-3" />
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                    <button 
                                                                        onClick={() => {
                                                                            const newPoints = [...(lesson.learning_points || []), ""];
                                                                            updateLesson(module.id, lesson.id, 'learning_points', newPoints);
                                                                        }}
                                                                        className="text-xs text-primary flex items-center gap-1 hover:underline"
                                                                    >
                                                                        <Plus className="w-3 h-3" /> Agregar Punto
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <button onClick={() => addLesson(module.id)} className="w-full py-2 border border-dashed border-gray-700 text-gray-500 hover:text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1">
                                                    <Plus className="w-3 h-3" /> Añadir Lección
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
