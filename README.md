# 🚀 Aprende.Marketing | AI-Powered Sales Engineering Ecosystem
> **SaaS de alto rendimiento para la automatización de embudos de venta mediante Arquitectura de IA Fraccionada y Cloud Nativo.**

![Banner](https://via.placeholder.com/1200x400?text=Aprende.Marketing+Platform+Vision+2026)
**

[![React](https://img.shields.io/badge/Frontend-React_19_|_Vite_7-blue?logo=react)](https://react.dev/)
[![Node](https://img.shields.io/badge/Backend-Node.js_20_|_Express-green?logo=node.js)](https://nodejs.org/)
[![GCP](https://img.shields.io/badge/Cloud-Google_Cloud_Run-4285F4?logo=google-cloud)](https://cloud.google.com/)
[![IA](https://img.shields.io/badge/AI_Engine-Gemini_3_Flash-7422FF?logo=google-gemini)](https://deepmind.google/technologies/gemini/)

**Aprende.Marketing** es una plataforma de ingeniería de software diseñada para resolver el cuello de botella en la creación de activos de venta para productos digitales. A través de un pipeline propietario de IA, el sistema orquesta la generación de estrategias psicográficas, landing pages reactivas y automatizaciones de marketing, todo bajo una infraestructura escalable y segura.

---

## 🛠️ Arquitectura y Stack Tecnológico

| Dimensión | Tecnología | Implementación de Ingeniería |
| :--- | :--- | :--- |
| **Frontend** | **React 19 + TypeScript 5** | Arquitectura de componentes atómicos y estados memorizados para optimizar el re-renderizado. |
| **Backend** | **Node.js (Express)** | API RESTful modular con middlewares de seguridad y validación de esquemas JSON. |
| **Base de Datos** | **MySQL (Cloud SQL)** | Esquema relacional normalizado con soporte para multi-tenancy y alta disponibilidad. |
| **IA Orchestrator** | **Gemini 3 Flash (SDK v1.30)** | Pipeline de generación fraccionada con inyección de contexto dinámico. |
| **DevOps / Infra** | **Docker + Cloud Run** | Despliegue serverless containerizado con pipelines de CI/CD en Google Cloud Build. |

---

## 🧠 Core: Pipeline de IA & Reverse Engineering

El sistema no realiza simples peticiones a un LLM; ejecuta un flujo de trabajo distribuido para garantizar la **veracidad y la conversión**:

1.  **Inverse Marketing Engineering**: El motor realiza un análisis del producto base para extraer la Propuesta Única de Venta (USP) de forma automatizada.
2.  **Modelado Psicográfico del Avatar**: Generación de perfiles basados en miedos, dolores y deseos profundos, superando las descripciones demográficas básicas.
3.  **Generación Fraccionada (6 Etapas)**: Para mitigar timeouts y alucinaciones, la carga se divide en: Estrategia -> Copywriting -> Estructura de Landing -> Email Sequences -> Scripts RRSS -> Análisis de ROI.
4.  **Resiliencia**: Implementación de `withRetries` con **Exponential Backoff** para manejar la disponibilidad de la API de Google de forma transparente.

---

## 🏗️ Desafíos Técnicos Superados

### 1. Resolución de Host Dinámico y Multi-Tenancy
**Problema:** Cargar datos de proyectos en dominios personalizados sin sesiones activas o cookies de terceros.
**Solución:** Diseñé un middleware de resolución de `host` que ejecuta un `LEFT JOIN` optimizado en MySQL. Esto permite servir la configuración del proyecto y el contenido de la landing en una sola petición atómica (<180ms), eliminando múltiples viajes al servidor.

### 2. Sincronización de Pagos y Créditos (Webhooks)
**Problema:** Gestión de créditos de IA en tiempo real tras compras en Hotmart/Stripe.
**Solución:** Integración de Webhooks seguros con validación de firma **HMAC SHA256**. Esto garantiza que la provisión de recursos sea instantánea y protegida contra ataques de inyección de peticiones.

### 3. Renderizado Reactivo de Landings (`LivePage.tsx`)
**Problema:** La edición en tiempo real de estructuras complejas de marketing saturaba el hilo principal.
**Solución:** Uso de un motor de plantillas basado en JSON que separa la lógica de edición de la visualización, utilizando **Hooks personalizados** para el manejo de estados complejos y persistencia en tiempo real.

---

## 📸 Evidencia de Infraestructura

| Panel de Control (GCP) | Diseño de Datos (Cloud SQL) |
|---|---|
| ![GCP](https://via.placeholder.com/600x350?text=Cloud+Run+Instances+Monitoring) | ![MySQL](https://via.placeholder.com/600x350?text=Relational+Database+EER+Diagram) |
| *Monitoreo de instancias y escalado automático.* | *Normalización y gestión de índices técnicos.* |

---

## 🚀 Instalación y Despliegue Local

```bash
# 1. Clonar y acceder
git clone [https://github.com/tu-usuario/aprende-marketing.git](https://github.com/tu-usuario/aprende-marketing.git)
cd aprende-marketing

# 2. Configurar entorno (.env)
# Define: DB_HOST, API_KEY, STRIPE_WEBHOOK_SECRET, JWT_SECRET

# 3. Levantar con Docker
docker-compose up -d --build


👨‍💻 Perfil del Desarrollador
Jorge Alberto Franco
Ingeniero de Sistemas y Telecomunicaciones

CEO y Lead Developer de Aprende.Marketing. Experto en la intersección entre el desarrollo de software escalable y las estrategias de Growth Marketing de alto rendimiento.

📍 Sevilla / Málaga (Disponibilidad inmediata para traslado o modelo híbrido).

💼 Especialidad: Full Stack Development (Node/React), Cloud Infrastructure y AI Integration.

🔗 LinkedIn | Portfolio

Este proyecto representa la convergencia de la ingeniería de datos y la psicología de ventas. © 2026 Jorge Alberto Franco.












