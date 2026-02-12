
import express from 'express';
import pool from '../db.js';
import { authMiddleware } from '../authMiddleware.js';
import { generateContent } from '../geminiService.js';

const router = express.Router();

const DEFAULT_LAUNCH_MESSAGES = [
    // FASE 1: Anticipación y Autoridad (Días previos)
    { id: 'wl1', name: 'Bienvenida y Confirmación de Fecha', momentText: 'Día -7', pilarType: 'Seguridad', purpose: 'Confirmar que están en el lugar correcto, dar las gracias y fijar la fecha/hora del evento en el calendario mental del usuario.', objective: 'Confirmar lugar, dar gracias, fijar fecha/hora.', content: '', isGenerated: false },
    { id: 'wl2', name: 'Historia de Autoridad (Storytelling)', momentText: 'Día -5', pilarType: 'Empatía y Confianza', purpose: 'Quién es el experto, sus fracasos iniciales y cómo el método que va a enseñar cambió su vida. Humaniza la marca.', objective: 'Conectar emocionalmente con la experta.', content: '', isGenerated: false },
    { id: 'wl3', name: 'El "Qué" vs el "Cómo" (Curiosidad)', momentText: 'Día -3', pilarType: 'Valor Percibido', purpose: 'Revelar los temas que se verán en la clase. Prometer un secreto o técnica específica que no encontrarán en YouTube.', objective: 'Elevar el valor percibido de la clase.', content: '', isGenerated: false },
    { id: 'wl4', name: 'Los 3 Errores Fatales', momentText: 'Día -1', pilarType: 'Conciencia del Dolor', purpose: 'Identificar qué están haciendo mal los leads hoy. Esto posiciona al experto como la única solución para dejar de perder tiempo/dinero.', objective: 'Entregar valor previo para generar compromiso.', content: '', isGenerated: false },
    
    // FASE 2: El Día del Evento
    { id: 'wl5', name: 'Recordatorio Matutino', momentText: 'Día Clase (AM)', pilarType: 'Entusiasmo', purpose: '¡Llegó el día!. Confirmar horarios por países para evitar confusiones.', objective: 'Recordatorio matutino.', content: '', isGenerated: false },
    { id: 'wl6', name: 'Instrucciones de Preparación (T-4h)', momentText: 'Día Clase (PM)', pilarType: 'Compromiso', purpose: 'Pedir que preparen libreta, café y eliminen distracciones. Crea un ritual en torno a la clase.', objective: 'Instrucciones de preparación.', content: '', isGenerated: false },
    { id: 'wl7', name: '¡Estamos en Vivo! (El Link)', momentText: 'Día Clase (Link)', pilarType: 'Acción Inmediata', purpose: 'Enlace directo a YouTube/Zoom/VSL. Corto, al grano y con muchos emojis de alerta.', objective: 'Acceso directo a la transmisión.', content: '', isGenerated: false },
    
    // FASE 3: Apertura y Conversión
    { id: 'wl8', name: 'Apertura de Carrito y Oferta Irresistible', momentText: 'Post-Clase', pilarType: 'Lanzamiento', purpose: 'Revelar el precio especial de lanzamiento, los bonos y el enlace de Hotmart.', objective: 'Apertura de inscripciones.', content: '', isGenerated: false },
    { id: 'wl9', name: 'Bonos de Acción Rápida (Urgencia)', momentText: 'Urgencia 1', pilarType: 'Beneficio extra', purpose: 'Regalo extra solo para las primeras X personas que compren en las próximas 2 horas.', objective: 'Presión por los regalos exclusivos.', content: '', isGenerated: false },
    { id: 'wl10', name: 'Tutorial de Pago y Soporte', momentText: 'Soporte', pilarType: 'Elimin