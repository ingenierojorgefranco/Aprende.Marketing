import React, { useState, useEffect, useRef } from 'react';
import { Play, Check, Clock, Plus, ChevronLeft, ChevronRight, X, Video, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { MasterStepVideo, User } from '../../../types';
import { api } from '../../../services/api';

export interface VideoItem {
  id: string;
  stepNumber?: number;
  type: 'Principal' | 'Complementario';
  title: string;
  subtitle?: string;
  duration: string;
  videoUrl: string;
  posterImage?: string;
  positionOrder?: number;
}

interface StepVideoContainerProps {
  videos?: VideoItem[];
  videoUrl?: string;
  posterImage?: string;
  title?: string;
  isAdmin?: boolean;
  stepNumber?: number;
  user?: User | any;
}

export const StepVideoContainer: React.FC<StepVideoContainerProps> = ({
  videos: customVideos,
  videoUrl = "https://www.youtube.com/embed/vGfXD9VbfXo?rel=0&controls=1&showinfo=0",
  posterImage = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200&h=675",
  title = "Entiende tu proyecto",
  isAdmin: isAdminProp,
  stepNumber = 1,
  user: userProp,
}) => {
  // Resolver usuario actual desde prop o desde el contexto de la aplicación (Outlet)
  let contextUser: any = null;
  try {
    const ctx = useOutletContext() as any;
    if (ctx && ctx.user) {
      contextUser = ctx.user;
    }
  } catch {
    // Si se renderiza fuera de OutletContext no falla
  }

  const activeUser = userProp || contextUser;

  // Lógica estricta de administrador:
  // Solo es admin si isAdmin prop es explícitamente true, O si no se especificó isAdmin pero activeUser tiene role === 'admin'
  const isUserAdmin = typeof isAdminProp === 'boolean'
    ? isAdminProp
    : Boolean(activeUser && activeUser.role === 'admin');
  // Built-in default videos matching screenshot if custom list is not provided
  const initialVideos: VideoItem[] = (customVideos && customVideos.length > 0)
    ? customVideos
    : [
        {
          id: 'v1',
          stepNumber: 1,
          type: 'Principal',
          duration: '4:36',
          title: title || 'Entiende tu proyecto',
          subtitle: 'Resumen del producto, público y recorrido',
          videoUrl: videoUrl,
          posterImage: posterImage,
        },
        {
          id: 'v2',
          stepNumber: 1,
          type: 'Complementario',
          duration: '2:18',
          title: 'Cómo interpretar tu comisión',
          subtitle: 'Precio, porcentaje y ganancia por venta',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&controls=1&showinfo=0',
          posterImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1200&h=675',
        },
        {
          id: 'v3',
          stepNumber: 1,
          type: 'Complementario',
          duration: '3:05',
          title: 'Cómo funciona tu sistema',
          subtitle: 'Del contenido a la posible comisión',
          videoUrl: 'https://www.youtube.com/embed/L_LUpnjgPso?rel=0&controls=1&showinfo=0',
          posterImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&h=675',
        },
      ];

  const [videoList, setVideoList] = useState<VideoItem[]>(initialVideos);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeVideoId, setActiveVideoId] = useState<string>(initialVideos[0]?.id || 'v1');
  const [watchedVideoIds, setWatchedVideoIds] = useState<Set<string>>(new Set([initialVideos[0]?.id || 'v1']));
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Modals state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formDuration, setFormDuration] = useState('3:00');
  const [formType, setFormType] = useState<'Principal' | 'Complementario'>('Complementario');

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Cargar videos desde la base de datos (master_step_videos)
  useEffect(() => {
    let isMounted = true;
    const fetchMasterVideos = async () => {
      setLoading(true);
      try {
        const data = await api.getMasterStepVideos(stepNumber);
        if (isMounted) {
          if (data && data.length > 0) {
            setVideoList(data);
            setActiveVideoId(data[0].id);
          } else if (customVideos && customVideos.length > 0) {
            setVideoList(customVideos);
            setActiveVideoId(customVideos[0].id);
          }
        }
      } catch (err) {
        console.error("Error al obtener master_step_videos:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMasterVideos();
    return () => { isMounted = false; };
  }, [stepNumber]);

  const activeVideoIndex = videoList.findIndex((v) => v.id === activeVideoId);
  const activeVideo = videoList[activeVideoIndex >= 0 ? activeVideoIndex : 0] || videoList[0] || initialVideos[0];

  // Total cards including admin add button
  const totalCardsCount = videoList.length + (isUserAdmin ? 1 : 0);
  const isMarquee = totalCardsCount > 3;

  const handleSelectVideo = (video: VideoItem) => {
    setActiveVideoId(video.id);
    setWatchedVideoIds((prev) => new Set([...Array.from(prev), video.id]));
    setIsPlaying(true);
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('autoplay=')) return url;
    return `${url}${url.includes('?') ? '&' : '?'}autoplay=1`;
  };

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const resetForm = () => {
    setFormTitle('');
    setFormSubtitle('');
    setFormUrl('');
    setFormDuration('3:00');
    setFormType('Complementario');
  };

  const handleOpenAddModal = () => {
    if (!isUserAdmin) return;
    resetForm();
    setShowAddModal(true);
  };

  const handleOpenEditModal = (video: VideoItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!isUserAdmin) return;
    setEditingVideo(video);
    setFormTitle(video.title);
    setFormSubtitle(video.subtitle || '');
    setFormUrl(video.videoUrl);
    setFormDuration(video.duration || '3:00');
    setFormType(video.type);
    setShowEditModal(true);
  };

  const handleAddVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUserAdmin || !formTitle.trim() || !formUrl.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await api.createMasterStepVideo({
        stepNumber: stepNumber,
        type: formType,
        title: formTitle.trim(),
        subtitle: formSubtitle.trim() || 'Video explicativo de la lección',
        duration: formDuration.trim() || '3:00',
        videoUrl: formUrl.trim(),
        posterImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200&h=675',
      });

      setVideoList((prev) => [...prev, created]);
      setActiveVideoId(created.id);
      setWatchedVideoIds((prev) => new Set([...Array.from(prev), created.id]));
      setIsPlaying(true);
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error("Error al añadir video:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUserAdmin || !editingVideo || !formTitle.trim() || !formUrl.trim()) return;

    setIsSubmitting(true);
    try {
      const updated = await api.updateMasterStepVideo(editingVideo.id, {
        stepNumber: stepNumber,
        type: formType,
        title: formTitle.trim(),
        subtitle: formSubtitle.trim(),
        duration: formDuration.trim() || '3:00',
        videoUrl: formUrl.trim(),
      });

      setVideoList((prev) =>
        prev.map((v) => (v.id === editingVideo.id ? { ...v, ...updated } : v))
      );

      setShowEditModal(false);
      setEditingVideo(null);
      resetForm();
    } catch (error) {
      console.error("Error al editar video:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!isUserAdmin) return;
    if (!window.confirm('¿Estás seguro de que deseas eliminar este video?')) return;

    setIsSubmitting(true);
    try {
      await api.deleteMasterStepVideo(videoId);
      setVideoList((prev) => {
        const filtered = prev.filter((v) => v.id !== videoId);
        if (activeVideoId === videoId && filtered.length > 0) {
          setActiveVideoId(filtered[0].id);
        }
        return filtered;
      });

      setShowEditModal(false);
      setEditingVideo(null);
      resetForm();
    } catch (error) {
      console.error("Error al eliminar video:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-left relative">
      {/* Reproductor Principal */}
      <div className="relative bg-[#060a12] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-800 shadow-2xl w-full">
        
        {/* Top Overlay Bar */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl max-w-[calc(100%-2rem)]">
          <span className="bg-[#FF5A1F] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            REPRODUCIENDO
          </span>

          {/* Botón Editar junto a Reproduciendo para Administrador */}
          {isUserAdmin && activeVideo && (
            <button
              onClick={(e) => handleOpenEditModal(activeVideo, e)}
              className="bg-slate-800/90 hover:bg-[#FF5A1F] text-slate-200 hover:text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-700/80 hover:border-[#FF5A1F] flex items-center gap-1 transition-all shrink-0 cursor-pointer"
              title="Editar este video"
            >
              <Pencil className="w-3 h-3" />
              <span>Editar</span>
            </button>
          )}

          <span className="bg-slate-800/90 text-slate-200 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border border-slate-700/80 shrink-0">
            Video {activeVideoIndex >= 0 ? activeVideoIndex + 1 : 1}
          </span>

          <span className="text-white text-xs sm:text-sm font-semibold truncate max-w-[160px] sm:max-w-xs md:max-w-md">
            {activeVideo?.title}
          </span>
        </div>

        {/* Video Area */}
        <div key={activeVideo?.id} className="relative aspect-video w-full bg-black">
          {activeVideo?.posterImage && !isPlaying ? (
            <div 
              onClick={() => {
                setIsPlaying(true);
                setWatchedVideoIds((prev) => new Set([...Array.from(prev), activeVideo.id]));
              }}
              className="relative w-full h-full cursor-pointer group"
            >
              <img 
                src={activeVideo.posterImage}
                alt={activeVideo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-[#FF5A1F] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-current ml-1" />
                </div>
              </div>
            </div>
          ) : (
            <iframe 
              key={`iframe-${activeVideo?.id}`}
              className="w-full h-full"
              src={getEmbedUrl(activeVideo?.videoUrl || videoUrl)} 
              title={activeVideo?.title || 'Video'} 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
          )}
        </div>
      </div>

      {/* Sección: VIDEOS DE ESTE PASO */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
              VIDEOS DE ESTE PASO
            </h3>
            {isUserAdmin && (
              <span className="text-[10px] bg-amber-500/10 text-amber-400 font-bold px-2 py-0.5 rounded-md border border-amber-500/20">
                ADMIN MASTER
              </span>
            )}
            {loading && (
              <Loader2 className="w-3.5 h-3.5 text-[#FF5A1F] animate-spin ml-1" />
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium">
              <strong className="text-[#FF5A1F] font-bold">{watchedVideoIds.size} de {videoList.length}</strong>{' '}
              <span className="text-slate-400">vistos</span>
            </span>

            {/* Carousel Navigation Buttons (only if > 3 cards) */}
            {isMarquee && (
              <div className="flex items-center gap-1.5 ml-2">
                <button
                  onClick={handleScrollLeft}
                  className="w-7 h-7 rounded-lg bg-slate-800/90 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700 hover:border-[#FF5A1F]/50 flex items-center justify-center transition-all shadow-sm cursor-pointer"
                  title="Video anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleScrollRight}
                  className="w-7 h-7 rounded-lg bg-slate-800/90 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700 hover:border-[#FF5A1F]/50 flex items-center justify-center transition-all shadow-sm cursor-pointer"
                  title="Siguiente video"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tarjetas de videos (Marquesina si >3 tarjetas, de lo contrario Grid estática) */}
        <div
          ref={scrollContainerRef}
          className={
            isMarquee
              ? "flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto scrollbar-none snap-x pb-2"
              : "grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4"
          }
        >
          {videoList.map((video, idx) => {
            const isActive = video.id === activeVideoId;
            const isWatched = watchedVideoIds.has(video.id);

            return (
              <div
                key={video.id}
                onClick={() => handleSelectVideo(video)}
                className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-left group ${
                  isMarquee ? 'min-w-[280px] sm:min-w-[310px] md:min-w-[315px] snap-start shrink-0' : 'w-full'
                } ${
                  isActive
                    ? 'bg-[#FF5A1F]/[0.05] border-[#FF5A1F] ring-1 ring-[#FF5A1F]/60 shadow-lg shadow-orange-500/10'
                    : 'bg-[#0B1120] border-slate-800/90 hover:border-slate-700 hover:bg-[#0E1628]'
                }`}
              >
                <div>
                  {/* Top: Type & Duration & Video Number + Checked Icon */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-400">
                      <span className="text-slate-300 font-semibold">Video {idx + 1}</span> · {video.type} · {video.duration}
                    </span>
                    {isWatched && (
                      <div className="w-5 h-5 rounded-full bg-[#FF5A1F] text-white flex items-center justify-center shrink-0 shadow-sm">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Body: Play Icon + Title & Subtitle */}
                  <div className="flex items-start gap-3 my-1">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all group-hover:scale-105 ${
                      isActive
                        ? 'bg-[#FF5A1F] text-white shadow-md shadow-orange-500/30'
                        : 'bg-slate-800/90 border border-slate-700 text-slate-200 group-hover:border-[#FF5A1F]/50 group-hover:text-[#FF5A1F]'
                    }`}>
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <h4 className={`text-sm font-bold leading-snug transition-colors ${
                        isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'
                      }`}>
                        {video.title}
                      </h4>
                      {video.subtitle && (
                        <p className="text-xs text-slate-400 font-normal leading-relaxed line-clamp-2">
                          {video.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Badge: Reproduciendo / Visto / Pendiente + Botón Editar */}
                <div className="mt-4 pt-2 border-t border-slate-800/40 flex items-center justify-between">
                  {isActive ? (
                    <span className="inline-flex items-center gap-1.5 bg-[#FF5A1F] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      REPRODUCIENDO
                    </span>
                  ) : isWatched ? (
                    <span className="inline-flex items-center gap-1 text-[#FF5A1F] text-[11px] font-bold">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" /> Visto
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-slate-400 text-[11px] font-medium">
                      <Clock className="w-3.5 h-3.5" /> Pendiente
                    </span>
                  )}

                  {/* Botón Editar en tarjeta SOLO para Administrador */}
                  {isUserAdmin && (
                    <button
                      onClick={(e) => handleOpenEditModal(video, e)}
                      className="text-xs text-slate-400 hover:text-white hover:bg-slate-800 px-2 py-1 rounded-md border border-slate-800 hover:border-slate-700 flex items-center gap-1 transition-all"
                      title="Editar video"
                    >
                      <Pencil className="w-3 h-3 text-[#FF5A1F]" />
                      <span>Editar</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Admin "Añadir video" Card */}
          {isUserAdmin && (
            <div
              onClick={handleOpenAddModal}
              className={`relative p-4 rounded-2xl border-2 border-dashed border-slate-800 hover:border-[#FF5A1F]/70 bg-[#070D1A]/50 hover:bg-[#FF5A1F]/[0.03] transition-all cursor-pointer flex flex-col items-center justify-center text-center group min-h-[165px] ${
                isMarquee ? 'min-w-[280px] sm:min-w-[310px] md:min-w-[315px] snap-start shrink-0' : 'w-full'
              }`}
            >
              <div className="w-11 h-11 rounded-full bg-slate-800/80 border border-slate-700 text-[#FF5A1F] flex items-center justify-center mb-2 group-hover:scale-110 group-hover:bg-[#FF5A1F] group-hover:text-white transition-all shadow-md">
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-[#FF5A1F] transition-colors">
                Añadir video
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                Agregar nuevo contenido a la lección de este paso
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal para Administrador: Añadir Video */}
      {showAddModal && isUserAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl sm:rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 flex items-center justify-center text-[#FF5A1F]">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Añadir Video</h3>
                  <p className="text-xs text-slate-400">Nuevo video para este paso</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVideoSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  TÍTULO DEL VIDEO *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Estrategia de Cierre Rápido"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-[#060a12] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  SUBTÍTULO O DESCRIPCIÓN BREVE
                </label>
                <input
                  type="text"
                  placeholder="Ej. Explicación paso a paso del embudo"
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  className="w-full bg-[#060a12] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    TIPO DE VIDEO
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as 'Principal' | 'Complementario')}
                    className="w-full bg-[#060a12] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5A1F]"
                  >
                    <option value="Complementario">Complementario</option>
                    <option value="Principal">Principal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    DURACIÓN
                  </label>
                  <input
                    type="text"
                    placeholder="3:00"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full bg-[#060a12] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5A1F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  URL DEL VIDEO (YOUTUBE / VIMEO / EMBED) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://www.youtube.com/embed/..."
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  className="w-full bg-[#060a12] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-[#FF5A1F] text-white hover:bg-[#ff6d38] transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Guardar Video</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Administrador: Editar / Eliminar Video */}
      {showEditModal && editingVideo && isUserAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl sm:rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 flex items-center justify-center text-[#FF5A1F]">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Editar Video</h3>
                  <p className="text-xs text-slate-400">Modifica los detalles del video master</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingVideo(null);
                }}
                className="w-8 h-8 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditVideoSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  TÍTULO DEL VIDEO *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Estrategia de Cierre Rápido"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-[#060a12] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  SUBTÍTULO O DESCRIPCIÓN BREVE
                </label>
                <input
                  type="text"
                  placeholder="Ej. Explicación paso a paso del embudo"
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  className="w-full bg-[#060a12] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    TIPO DE VIDEO
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as 'Principal' | 'Complementario')}
                    className="w-full bg-[#060a12] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF5A1F]"
                  >
                    <option value="Complementario">Complementario</option>
                    <option value="Principal">Principal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    DURACIÓN
                  </label>
                  <input
                    type="text"
                    placeholder="3:00"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full bg-[#060a12] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5A1F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  URL DEL VIDEO (YOUTUBE / VIMEO / EMBED) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://www.youtube.com/embed/..."
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  className="w-full bg-[#060a12] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5A1F]"
                />
              </div>

              {/* Botón Eliminar abajo en el modal de edición + botones de Acción */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleDeleteVideo(editingVideo.id)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Eliminar este video"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar video</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingVideo(null);
                    }}
                    className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-xl text-sm font-bold bg-[#FF5A1F] text-white hover:bg-[#ff6d38] transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>Guardar Cambios</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
