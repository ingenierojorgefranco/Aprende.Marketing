import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

interface TrackingManagerProps {
  user?: { id: string | number; email?: string } | null;
}

export const TrackingManager: React.FC<TrackingManagerProps> = ({ user }) => {
  const location = useLocation();
  const initializedGa = useRef<string | null>(null);
  const initializedFb = useRef<string | null>(null);

  useEffect(() => {
    const initTracking = async () => {
      try {
        const settings = await api.getTrackingSettings();
        const { googleAnalyticsId, facebookPixelId } = settings || {};

        // 1. Google Analytics Injection
        if (googleAnalyticsId && googleAnalyticsId.trim() !== '' && initializedGa.current !== googleAnalyticsId) {
          const rawGa = googleAnalyticsId.trim();
          initializedGa.current = rawGa;

          // Si es un ID de medición como G-XXXXXXXXXX o UA-XXXXXXXX-X
          if (/^(G-[A-Z0-9]+|UA-\d+-\d+)$/i.test(rawGa)) {
            if (!document.getElementById('ga-gtag-script')) {
              const scriptEl = document.createElement('script');
              scriptEl.id = 'ga-gtag-script';
              scriptEl.async = true;
              scriptEl.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(rawGa)}`;
              document.head.appendChild(scriptEl);

              window.dataLayer = window.dataLayer || [];
              window.gtag = function () {
                window.dataLayer?.push(arguments);
              };
              window.gtag('js', new Date());

              const configParams: Record<string, any> = { page_path: window.location.pathname };
              if (user?.id) {
                configParams.user_id = String(user.id);
                window.gtag('set', 'user_id', String(user.id));
              }

              window.gtag('config', rawGa, configParams);
              console.log(`[TrackingManager] Google Analytics inicializado con ID: ${rawGa}${user?.id ? ` (User ID: ${user.id})` : ''}`);
            }
          } else if (rawGa.includes('<script')) {
            // Si el usuario pegó el código script completo de GA / Tag Manager
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = rawGa;
            const scripts = tempDiv.getElementsByTagName('script');
            for (let i = 0; i < scripts.length; i++) {
              const s = document.createElement('script');
              if (scripts[i].src) {
                s.src = scripts[i].src;
                s.async = true;
              } else {
                s.textContent = scripts[i].textContent;
              }
              document.head.appendChild(s);
            }
            console.log('[TrackingManager] Script de Google Analytics inyectado en <head>');
          }
        }

        // 2. Facebook / Meta Pixel Injection
        if (facebookPixelId && facebookPixelId.trim() !== '' && initializedFb.current !== facebookPixelId) {
          const rawFb = facebookPixelId.trim();
          initializedFb.current = rawFb;

          // Si es un ID numérico como 1234567890123456
          if (/^\d+$/.test(rawFb)) {
            if (!document.getElementById('fb-pixel-script')) {
              (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
                if (f.fbq) return;
                n = f.fbq = function () {
                  n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
                };
                if (!f._fbq) f._fbq = n;
                n.push = n;
                n.loaded = !0;
                n.version = '2.0';
                n.queue = [];
                t = b.createElement(e);
                t.id = 'fb-pixel-script';
                t.async = !0;
                t.src = v;
                s = b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t, s);
              })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

              if (window.fbq) {
                if (user?.id) {
                  window.fbq('init', rawFb, { external_id: String(user.id) });
                } else {
                  window.fbq('init', rawFb);
                }
                window.fbq('track', 'PageView');
                console.log(`[TrackingManager] Pixel de Facebook inicializado con ID: ${rawFb}${user?.id ? ` (External ID: ${user.id})` : ''}`);
              }
            }
          } else if (rawFb.includes('<script')) {
            // Si el usuario pegó el código script completo del Píxel
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = rawFb;
            const scripts = tempDiv.getElementsByTagName('script');
            for (let i = 0; i < scripts.length; i++) {
              const s = document.createElement('script');
              if (scripts[i].src) {
                s.src = scripts[i].src;
                s.async = true;
              } else {
                s.textContent = scripts[i].textContent;
              }
              document.head.appendChild(s);
            }
            console.log('[TrackingManager] Script del Pixel de Facebook inyectado en <head>');
          }
        }
      } catch (err) {
        console.error('[TrackingManager Error] No se pudieron cargar las etiquetas de seguimiento:', err);
      }
    };

    initTracking();
  }, []);

  // Actualizar ID del usuario cuando inicie sesión o cambie el estado de autenticación
  useEffect(() => {
    if (user?.id) {
      if (window.gtag) {
        window.gtag('set', 'user_id', String(user.id));
        if (initializedGa.current && /^(G-[A-Z0-9]+|UA-\d+-\d+)$/i.test(initializedGa.current)) {
          window.gtag('config', initializedGa.current, { user_id: String(user.id) });
        }
      }
      if (window.fbq) {
        window.fbq('set', 'userData', { external_id: String(user.id) });
      }
    }
  }, [user?.id]);

  // Seguimiento de cambio de páginas (SPA PageView)
  useEffect(() => {
    if (window.gtag && initializedGa.current && /^(G-[A-Z0-9]+|UA-\d+-\d+)$/i.test(initializedGa.current)) {
      const configParams: Record<string, any> = { page_path: location.pathname };
      if (user?.id) configParams.user_id = String(user.id);
      window.gtag('config', initializedGa.current, configParams);
    }
    if (window.fbq && initializedFb.current) {
      window.fbq('track', 'PageView');
    }
  }, [location, user?.id]);

  return null;
};
