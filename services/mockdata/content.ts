import { Article } from "../../types";

export const MOCK_ARTICLES: Article[] = [
  {
    id: "art-micro-01",
    title: "Diferencia entre Microblading y Micropigmentación: Guía Definitiva",
    slug: "diferencia-microblading-micropigmentacion",
    description: "Muchas clientas confunden estas técnicas. Aprende a explicarlo correctamente y vende mejor tus servicios de cejas.",
    contentHtml: `
      <p>Cuando te adentras en el mundo de la belleza, es común escuchar estos términos de forma intercambiable, pero <strong>no son lo mismo</strong>.</p>
      <h2>1. La Herramienta</h2>
      <p>El <strong>Microblading</strong> se realiza con un tébori (pluma manual), lo que permite un control total sobre cada trazo. La <strong>Micropigmentación</strong> utiliza un demógrafo eléctrico.</p>
      <h2>2. La Profundidad</h2>
      <p>El microblading trabaja en la epidermis (capa superficial), por lo que es semipermanente. La micropigmentación puede llegar más profundo, durando más tiempo pero con un aspecto más "tatuado".</p>
      <h2>Conclusión</h2>
      <p>Si buscas un acabado natural y pelo a pelo, el Microblading es la opción ganadora en 2024.</p>
    `,
    metaTitle: "Microblading vs Micropigmentación: ¿Cuál es mejor?",
    metaDescription: "Descubre las diferencias clave entre Microblading y Micropigmentación para elegir la mejor técnica para tus cejas.",
    keyword: "microblading vs micropigmentacion",
    seoScore: 85,
    status: 'published',
    publishedAt: new Date("2024-03-10"),
    createdAt: new Date("2024-03-10"),
    pageId: "page-micro-01",
    featuredImage: "https://images.unsplash.com/photo-1599592237937-234b6b6c0780?auto=format&fit=crop&w=800",
    pageName: "Landing Principal Microblading",
    pageSubdomain: "curso-cejas.generatorlanding.com"
  },
  {
    id: "art-micro-02",
    title: "Cuánto cobrar por un servicio de cejas en 2024",
    slug: "cuanto-cobrar-cejas-2024",
    description: "Guía de precios para esteticistas principiantes. No regales tu trabajo y aprende a valorar tu arte.",
    contentHtml: "<p>El precio promedio varía según la zona, pero nunca deberías cobrar menos de $150 USD por una sesión inicial...</p>",
    keyword: "precio microblading",
    seoScore: 92,
    status: 'draft',
    publishedAt: new Date(),
    createdAt: new Date(),
    pageId: "page-micro-01",
    pageName: "Landing Principal Microblading",
    pageSubdomain: "curso-cejas.generatorlanding.com"
  }
];