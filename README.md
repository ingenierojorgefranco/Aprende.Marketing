# 🚀 Aprende.Marketing | AI-Powered Sales Engineering Ecosystem
> **Production-grade SaaS that automates the creation of high-conversion sales funnels using Fragmented AI Architectures.**

*<!-- 💡 CRITICAL: If you don't have a high-res screenshot yet, REMOVE the placeholder below. 
     A clean header is better than a "coming soon" image. -->*
![Main Banner](./Assets/AprendeMarketingDashboard.png)


![Dashboard Preview](./Assets/AprendeMarketingDashboard.png)

[![React](https://img.shields.io/badge/Frontend-React_19_|_Vite_7-blue?logo=react)](https://react.dev/)
[![Node](https://img.shields.io/badge/Backend-Node.js_20_|_Express-green?logo=node.js)](https://nodejs.org/)
[![GCP](https://img.shields.io/badge/Cloud-Google_Cloud_Run-4285F4?logo=google-cloud)](https://cloud.google.com/)
[![IA](https://img.shields.io/badge/AI_Engine-Gemini_3_Flash-7422FF?logo=google-gemini)](https://deepmind.google/technologies/gemini/)

## ⚡ The Quick Pitch
Aprende.Marketing eliminates the execution gap in digital product marketing by automating the entire sales process, creating a professional conversion funnel to generate scalable and automated results.

*   **Input:** A raw product idea, sales URL, or niche description.
*   **Output:** A fully structured sales system (Conversion Funnel) (**Strategy** + **Avatars** + **Sales Angles** + **Conversion-Optimized Landing Engine** + **Thank You Page** + **SEO-Optimized Blog Articles** + **Lead Attraction Hooks and Videos** + **WhatsApp Conversion Sequences** + **Conversion Email Marketing Sequences** + **Nurturing Email Marketing Sequences** + **Ad Copy**).


## 💥 Why It Matters
Most digital product sales fail not because of the idea itself, but because of poor execution. Creating high-converting content takes weeks; Aprende.Marketing compresses this process into minutes, allowing Hotmart Digital Product Affiliates to focus on growing their digital business, not the manual labor.

---

## 📊 Real Usage Snapshot
*(Beta Phase Metrics - Internal Benchmarks)*
- **Funnels Generated:** 20+
- **Avg. Generation Time:** ~1.5 minutes
- **Active Beta Users:** 15+
- **Conversion Uplift (Early tests):** +15% (non-statistical sample)

---

## ✨ Key Capabilities

- **End-to-End Funnel Generation:** Complete sales system starting from a single point of entry.
- **AI-Driven Psychographic Profiling:** Automated mapping of potential customer profiles (avatars) to the digital product.
- **Conversion-Optimized Landing Engine:** Reactive JSON rendering of high-speed lead capture and thank-you pages.
- **SEO-Optimized Blog Post Generation:** Extraction of stored database data and AI curation for optimized search engine ranking and content avoidance.
- **Email Marketing Conversion and Nurturing Sequences:** Generation of automated mass email sequences designed to nurture and convert audiences, integrated with Systeme.io.
- **WhatsApp Conversion Sequences:** Automated follow-ups designed to close leads.
- **Built-in ROI Projection:** Mathematical engine to estimate traffic profitability at a 5% return.
- **Multi-Tenant Architecture:** Scalable support for independent and additional custom domains (CNAME).



---

## 🎥 Live Demo & Credentials
*   **Production URL:** [https://aprende.marketing/login](https://aprende.marketing/login)
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

### 4. Cross-Platform Payment Synchronization (Stripe & Hotmart)
Problem: Managing user subscription tiers and AI credit quotas across fragmented payment ecosystems with different data structures.
Solution: Built a unified Payment Orchestration Layer that handles webhooks from both Stripe and Hotmart. It normalizes incoming payloads into a single internal event bus, ensuring real-time provisioning of resources and sub-second updates to user access levels upon successful checkout.


### 5. Automated SaaS-to-CRM Handover (Systeme.io Integration)
Problem: Manually syncing new leads from high-conversion landing pages to external email marketing sequences often creates data lag.
Solution: Developed a server-side integration with Systeme.io's API using a Tag-Triggered Architecture. When a lead is captured on a generated page, the system automatically injects the contact into the user's list with specific behavioral tags, firing automated email sequences instantly.

### 6. Integrated Lead Management & Internal CRM
Problem: Users often lose potential sales because they cannot track lead origin or status within their funnel builder.
Solution: Engineered a Built-in CRM Module directly within the dashboard. It captures leads via capture-page hooks and displays them in a real-time analytics panel, providing a "Single Source of Truth" for funnel performance without requiring third-party subscriptions.

### 7. Internal LMS: Course Platform for User Success
Problem: High churn rates in SaaS products due to "Blank Page Syndrome" or lack of platform mastery.
Solution: Built a proprietary Internal Virtual Course Platform (LMS). This gated training environment is integrated with the core Auth system, delivering high-performance video training and certifications tailored to the user’s progress directly inside the app.

### 8. Master Strategy Unlocking & Project Cloning
Problem: Manually replicating successful, battle-tested marketing strategies for new projects is time-consuming and prone to human error.
Solution: Implemented a "Master Strategy" Inheritance System. Strategy-level privileges from a Root account allow for the atomic cloning of entire data structures—including landing layouts, psychographic profiles, and email templates—into a new project in less than 50ms.

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