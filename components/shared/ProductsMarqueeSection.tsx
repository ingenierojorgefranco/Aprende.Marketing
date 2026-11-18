import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Briefcase, Cpu, Layout, Mail, Smartphone } from 'lucide-react';
import { User } from '../../types';
import { api } from '../../services/api';

interface MarqueeProductItem {
  id: string;
  name: string;
  niche: string;
  description: string;
  imageUrl: string;
  fullPrice: number;
  commissionRate: number;
}

interface ProductsMarqueeSectionProps {
  user?: User | null;
}

export const ProductsMarqueeSection: React.FC<ProductsMarqueeSectionProps> = ({ user = null }) => {
  const navigate = useNavigate();
  const [marqueeProducts, setMarqueeProducts] = useState<MarqueeProductItem[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [failedProductImages, setFailedProductImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    api.getPublicMasterProducts()
      .then((serverProducts) => {
        if (Array.isArray(serverProducts) && serverProducts.length > 0) {
          const mapped: MarqueeProductItem[] = serverProducts.map((p) => ({
            id: p.id,
            name: p.name,
            niche: p.niche || 'Producto Digital',
            description: p.shortDescription || p.description || 'Producto validado con embudo, página de captura y contenido listo para impulsar tus comisiones.',
            imageUrl: p.imageUrl || '',
            fullPrice: p.fullPrice || 0,
            commissionRate: p.commissionRate || 0
          }));
          setMarqueeProducts(mapped);
        } else {
          setMarqueeProducts([]);
        }
      })
      .catch(err => {
        console.error("Error loading public master products:", err);
        setMarqueeProducts([]);
      })
      .finally(() => {
        setLoadingProducts(false);
      });
  }, []);

  if (!loadingProducts && marqueeProducts.length === 0) {
    return null;
  }

  return (
    <section id="products-marquee" className="w-full py-20 md:py-24 bg-[#07090E] border-t border-b border-white/5 relative overflow-hidden">
      <style>{`
        @keyframes marqueeTrack {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-track {
          display: flex;
          width: max-content;
          animation: marqueeTrack 40s linear infinite;
        }
        .marquee-wrapper:hover .animate-marquee-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee-track {
            animation: none;
          }
        }
      `}</style>

      <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl mb-12 md:mb-16">
        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#FF5A1F]">
          Catálogo listo para vender
        </p>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mt-3 leading-tight"
          style={{ textWrap: 'balance' }}
        >
          Productos analizados, <span className="text-[#FF5A1F]">listos para elegir hoy.</span>
        </h2>
        <p className="text-base sm:text-lg text-[#B0B0B0] mt-4 leading-relaxed font-normal">
          Cada producto que añadimos a la plataforma viene con su investigación de mercado, página de captura, secuencias de seguimiento y guiones listos para que empieces en minutos.
        </p>
      </div>

      {/* Carril único de marquesina más alto con pausa al pasar el cursor */}
      <div className="marquee-wrapper relative w-full overflow-hidden py-2">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-28 bg-gradient-to-r from-[#07090E] to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-28 bg-gradient-to-l from-[#07090E] to-transparent z-20" />

        {loadingProducts && marqueeProducts.length === 0 ? (
          <div className="flex gap-6 px-6 justify-center">
            {[0, 1, 2].map((skeletonIdx) => (
              <div
                key={`marquee-skeleton-${skeletonIdx}`}
                className="w-[310px] sm:w-[390px] md:w-[410px] shrink-0 bg-[#111319] border border-white/10 rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="w-full h-52 sm:h-56 bg-white/5" />
                <div className="p-6 space-y-3">
                  <div className="h-3 w-32 bg-white/10 rounded" />
                  <div className="h-6 w-3/4 bg-white/10 rounded" />
                  <div className="h-14 w-full bg-white/5 rounded" />
                  <div className="h-11 w-full bg-white/10 rounded-xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : (() => {
          const repeatTimes = Math.max(2, Math.ceil(6 / Math.max(1, marqueeProducts.length)));
          const halfTrack: MarqueeProductItem[] = [];
          for (let r = 0; r < repeatTimes; r++) {
            halfTrack.push(...marqueeProducts);
          }

          const renderProductCard = (product: MarqueeProductItem, idx: number) => {
            const imgFailed = !!failedProductImages[`${product.id}-${idx}`];
            const hasValidImage = Boolean(product.imageUrl && !imgFailed);
            const commissionPct = product.commissionRate
              ? Math.round(product.commissionRate <= 1 ? product.commissionRate * 100 : product.commissionRate)
              : 0;

            return (
              <div
                key={`single-row-${product.id}-${idx}`}
                className="w-[310px] sm:w-[390px] md:w-[410px] shrink-0 bg-[#111319] border border-white/10 hover:border-[#FF5A1F]/45 rounded-2xl overflow-hidden transition-colors duration-200 flex flex-col justify-between shadow-2xl"
              >
                {/* Imagen del producto real desde la base de datos */}
                <div className="w-full h-52 sm:h-56 bg-[#191B23] relative overflow-hidden shrink-0">
                  {hasValidImage ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      onError={() => setFailedProductImages(prev => ({ ...prev, [`${product.id}-${idx}`]: true }))}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#191B23] via-[#13151C] to-[#0B0D12] flex items-center justify-center">
                      <Briefcase className="w-12 h-12 text-[#FF5A1F]/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111319] via-black/15 to-transparent pointer-events-none" />
                </div>

                {/* Información completa y sistema incluido */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between text-left">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-medium whitespace-nowrap overflow-hidden">
                      <span className="truncate">{product.niche}</span>
                      {commissionPct > 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#FF5A1F] font-semibold tabular-nums shrink-0">{commissionPct}% comisión</span>
                        </>
                      )}
                    </div>

                    <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug mt-1.5 line-clamp-2 whitespace-normal">
                      {product.name}
                    </h3>

                    <p className="text-sm text-gray-300 leading-relaxed mt-2.5 line-clamp-3 whitespace-normal font-normal min-h-[3.9rem]">
                      {product.description}
                    </p>

                    <div className="mt-4 pt-4 border-t border-white/5">
                      <p className="text-[11px] font-semibold text-gray-400 mb-2.5">
                        Sistema listo en la plataforma:
                      </p>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs text-gray-200 font-medium">
                        <div className="flex items-center gap-1.5 truncate">
                          <Cpu className="w-3.5 h-3.5 text-[#FF5A1F] shrink-0" />
                          <span className="truncate">Estrategia IA</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <Layout className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">Página de Captura</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <Smartphone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">Guiones Reels / TikTok</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          <span className="truncate">Email & WhatsApp</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(user ? '/dashboard/projects' : '/register')}
                    className="mt-5 w-full py-3 px-4 rounded-xl bg-[#FF5A1F] hover:bg-[#D94A1E] text-white font-extrabold text-sm tracking-wide transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <span>Quiero este producto</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </div>
            );
          };

          return (
            <div className="animate-marquee-track gap-6">
              {[...halfTrack, ...halfTrack].map((item, i) => renderProductCard(item, i))}
            </div>
          );
        })()}
      </div>

      {/* CTA debajo de la marquesina */}
      <div className="container mx-auto px-6 mt-12 md:mt-14 text-center relative z-10">
        <button
          type="button"
          onClick={() => navigate(user ? '/dashboard' : '/register')}
          className="px-8 sm:px-12 py-4 sm:py-5 rounded-xl bg-gradient-to-r from-[#FF5A1F] to-[#E04810] hover:brightness-110 text-white font-black text-base sm:text-lg uppercase tracking-wider shadow-2xl shadow-[#FF5A1F]/35 hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-3 cursor-pointer"
        >
          <span>Crear mi cuenta gratis</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="mt-3 text-xs sm:text-sm text-gray-400 font-medium">
          Sin tarjeta de crédito · Elige tu producto ganador y lanza tu proyecto hoy
        </p>
      </div>
    </section>
  );
};
