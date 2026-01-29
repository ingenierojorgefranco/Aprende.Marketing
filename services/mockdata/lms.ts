import { Course, Comment } from "../../types";

export const MOCK_COURSES: Course[] = [
    {
        id: "mock-course-1",
        title: "Productos Digitales",
        subtitle: "Curso Intensivo",
        description: "Aprende a crear, validar y vender tu primer infoproducto desde cero. Descubre las estrategias que usan los grandes productores para facturar miles de dólares en Hotmart.",
        slug: "digital-products",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        modules: [
            {
                id: "mod-1",
                title: "Módulo 1: Fundamentos y Mentalidad",
                order_index: 1,
                lessons: [
                    { id: "l-1", title: "Bienvenida al Curso", duration: "5:00", video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Intro", learning_points: ["Punto 1"], order_index: 1 },
                    { id: "l-2", title: "Mentalidad de Productor", duration: "12:00", video_url: "", description: "Mindset", learning_points: ["Punto A"], order_index: 2 }
                ]
            },
            {
                id: "mod-2",
                title: "Módulo 2: Creación del Producto",
                order_index: 2,
                lessons: []
            }
        ],
        createdAt: new Date("2024-01-01")
    },
    {
        id: "mock-course-2",
        title: "Inteligencia Artificial",
        subtitle: "Masterclass",
        description: "Domina las herramientas de IA que están revolucionando el marketing.",
        slug: "ai",
        thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        modules: [],
        createdAt: new Date("2024-02-01")
    }
];

export const MOCK_COMMENTS: Comment[] = [
    {
        id: "c-1",
        lessonId: "l-1",
        lessonTitle: "Bienvenida al Curso",
        courseTitle: "Productos Digitales",
        user: "Juan Perez",
        userId: "u-2",
        date: new Date().toISOString(),
        text: "¡Excelente introducción! Estoy listo para aprender.",
        isApproved: true
    },
    {
        id: "c-3",
        parentId: "c-1", // Reply to Juan Perez
        lessonId: "l-1",
        lessonTitle: "Bienvenida al Curso",
        courseTitle: "Productos Digitales",
        user: "Maria Rodriguez",
        userId: "u-4",
        date: new Date().toISOString(),
        text: "Gracias Juan, espero que disfrutes el contenido. ¡Vamos con todo!",
        isApproved: true
    },
    {
        id: "c-2",
        lessonId: "l-2",
        lessonTitle: "Mentalidad de Productor",
        courseTitle: "Productos Digitales",
        user: "Ana Lopez",
        userId: "u-3",
        date: new Date(Date.now() - 86400000).toISOString(),
        text: "Tengo una duda sobre los nichos, ¿se hablará de eso más adelante?",
        isApproved: false // Pending
    }
];