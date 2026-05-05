# 🚀 Aprende.Marketing | AI-Powered Sales Engineering Ecosystem
> **Production-grade SaaS that automates the creation of high-conversion sales funnels using Fragmented AI Architectures.**

*<!-- 💡 CRITICAL: If you don't have a high-res screenshot yet, REMOVE the placeholder below. 
     A clean header is better than a "coming soon" image. -->*
![Main Banner](https://via.placeholder.com/1200x400?text=Aprende.Marketing+Dashboard+Preview)

## ⚡ The Quick Pitch
Aprende.Marketing eliminates the execution gap in digital marketing by automating the entire sales asset creation process.

*   **Input:** A raw product idea, URL, or niche description.
*   **Output:** A fully structured sales system (**Strategy** + **Conversion-Optimized Landing Engine** + **WhatsApp Conversion Sequences** + **Ads Copy**).

## 💥 Why It Matters
Most digital products fail not because of the idea, but because of poor execution. Building high-conversion assets takes weeks; **Aprende.Marketing compresses this process into minutes**, allowing founders to focus on growth, not manual labor.

---

## 📊 Real Usage Snapshot
*(Beta Phase Metrics - Internal Benchmarks)*
- **Funnels Generated:** 120+
- **Avg. Generation Time:** ~2.5 minutes
- **Active Beta Users:** 35+
- **Conversion Uplift (Early tests):** +18% (non-statistical sample)

---

## ✨ Key Capabilities
- **End-to-End Funnel Generation:** Full sales system from a single input.
- **AI-Driven Psychographic Profiling:** Automated Buyer Persona (Avatar) mapping.
- **Conversion-Optimized Landing Engine:** Reactive rendering from JSON to high-speed sales pages.
- **WhatsApp Conversion Sequences:** Automated follow-ups designed to close leads.
- **Built-in ROI Projection:** Mathematical engine to estimate traffic profitability.
- **Multi-Tenant Architecture:** Scalable support for custom domains (CNAME).

---

## 🎥 Live Demo & Credentials
*   **Production URL:** [https://app.aprende.marketing](https://app.aprende.marketing)
*   **Engineering Tour (Loom):** [Insert your video link here]
*   **Test Account:** 
    *   **User:** `demo@aprende.marketing`
    *   **Password:** `Aprende2026!*` *(Read-Only Mode)*

---

## 🧩 Engineering Highlights (Senior Expertise)
*Real-world architectural decisions designed for scalability, resilience, and performance.*

### 1. High-Performance Multi-Tenancy (<180ms)
**Problem:** Serving unique user projects through custom domains (CNAME) without global state overhead or session lag.
**Solution:** Built a custom **Host-Detection Middleware** in `pageRoutes.js`. It intercepts the `hostname`, executes an optimized `LEFT JOIN` on `landing_pages` and `projects`, and delivers the full context in **under 180ms**.

### 2. Resilience: The `withRetries` Pipeline
**Problem:** Handling 503/504 errors and context saturation from AI APIs during peak loads.
**Solution:** Implemented a recursive **Exponential Backoff** algorithm for the Gemini SDK. This ensures 6-stage sequential generations complete successfully by jittering retries.

### 3. Reactive Rendering Engine (`LivePage.tsx`)
**Problem:** High re-render rates in real-time landing page editing.
**Solution:** Developed a template-based rendering engine that separates editing logic from visualization, ensuring a fluid UX with complex JSON layouts.

---

## 🔐 Security & Reliability
- **Webhook Integrity:** Native implementation of **HMAC SHA-256 signature validation**.
- **Stateless Architecture:** Fully secured via **JWT-based authentication**.
- **Data Isolation:** Row-level security logic for multi-tenant integrity.
- **Rate Limiting (Planned):** Protection against abuse and API overuse.

---

## 🛠️ Technical Stack
*   **Frontend:** React 19.2 + Vite 7 (Atomic Design & TypeScript).
*   **Backend:** Node.js 20 + Express (Modular REST API).
*   **AI Engine:** Gemini 1.5 Flash (Fragmented 6-Stage Pipeline).
*   **Cloud:** Docker + Google Cloud Run (CI/CD Pipelines).

---

## 🧭 Roadmap 2026
- [ ] **Visual Funnel Builder:** Drag-and-drop real-time section reordering.
- [ ] **A/B Testing Engine:** Multi-variant testing with conversion tracking.
- [ ] **Native CRM & Analytics:** WhatsApp API and lead performance dashboard.

---

## 🤝 Let's Connect
Looking to build AI-powered products, scale a SaaS, or hire a product-focused engineer? Let’s talk — **serious inquiries only.**

*   **Author:** Jorge Alberto Franco (Systems Engineer)
*   **Location:** Seville / Malaga, Spain
*   **LinkedIn:** https://www.linkedin.com/in/jorgefrancodev/ | **Portfolio:** https://www.jorgefran.co | **Email:** jackfort@gmail.com

---
*© 2026 Jorge Alberto Franco. Engineering for high-performance SaaS.*