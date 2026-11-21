# 🏢 RayLive — Next-Gen AI PropTech Marketplace

> **Find. Value. Transact.** — An intelligent, full-stack real estate marketplace powered by **RayBroker AI**, verified RERA agent directory, fair-price valuation benchmarking, and tour booking management.

---

## 🌟 Key Features

### 1. 🔍 Property Discovery & Filtering
* **Multi-Intent Search:** Filter by **Buy**, **Rent**, and **Commercial** properties.
* **Granular Criteria:** City selectors (*Bangalore, Mumbai, Delhi-NCR, Hyderabad, Pune*), BHK count, and budget ranges.
* **Comprehensive Listings:** Photo galleries, super built-up area specs, furnishing details, and community amenities.

### 2. 🤖 RayBroker AI — Online Property Consultant
* **24/7 AI Broker Assistant:** Floating slide-out widget for neighborhood advisory and property recommendations.
* **Fair Price Benchmark:** Analyzes city real estate trends to determine whether an asking price is Below Market, Fair Value, or Overpriced.
* **Instant EMI Calculator:** Interactive down payment, tenure, and interest rate sliders with monthly payment breakdowns.

### 3. ❤️ Personal Watchlist & Saved Homes (`/favorites`)
* 1-click property bookmarking with real-time counter badge in the navigation bar.
* Portfolio aggregate metrics: Total bookmarked value (₹ Cr) and average rate per sq.ft.
* Account-isolated storage with toast alerts.

### 4. 📅 Tour Booking & Visit Management (`/bookings`)
* Schedule physical site visits with preferred dates and time windows (*Morning, Afternoon, Evening*).
* User appointment dashboard with confirmation statuses (`CONFIRMED`, `SCHEDULED`).
* 1-click booking cancellation and agent direct contact.

### 5. 🏡 "List Your Property" Portal (`/sell`)
* 4-step wizard for property owners and brokers to publish listings to Buy or Rent.
* Real-time price benchmark calculation as you input area and city.
* Direct integration with Spring Boot backend so custom properties appear live across the site.

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** React 18 with TypeScript
* **Bundler:** Vite
* **Styling:** Tailwind CSS (Navy & Gold PropTech theme)
* **Icons:** Lucide React
* **Routing:** React Router v6

### Backend
* **Runtime & Framework:** Java 21, Spring Boot 3.3.4
* **Database:** H2 Database (In-Memory Development) / PostgreSQL (Production)
* **ORM:** Spring Data JPA / Hibernate
* **API Documentation:** OpenAPI 3 / Swagger UI (`/swagger-ui.html`)

---

## 🚀 Getting Started

### Prerequisites
* **Node.js:** v18+ (v20+ recommended)
* **Java:** JDK 21 (Eclipse Adoptium)
* **Maven:** 3.9+

### 1. Start the Backend (Spring Boot)
```bash
cd backend
.\mvnw.cmd spring-boot:run
```
* Backend runs at: `http://localhost:8080`
* Swagger API Docs: `http://localhost:8080/swagger-ui.html`
* H2 Database Console: `http://localhost:8080/h2-console`

### 2. Start the Frontend (Vite + React)
```bash
cd ..
npm run dev
```
* Frontend runs at: `http://localhost:5173`
* Network Wi-Fi URL is automatically displayed to test on mobile phones and tablets.

---

## 🗺️ Project Roadmap
- [x] Responsive PropTech Frontend (React + TS + Tailwind)
- [x] RayBroker AI Consultant & EMI Calculator
- [x] Property Discovery with Multi-Filter Search
- [x] Saved Homes Watchlist (`/favorites`)
- [x] Site Visit / Tour Booking System (`/bookings`)
- [x] "List Your Property" Publishing Wizard (`/sell`)
- [x] Spring Boot REST APIs & OpenAPI Swagger Docs
- [ ] Backend JWT Authentication with Database Persistence
- [ ] Drag-and-drop Image File Upload
- [ ] Cloud Deployment (Vercel + Render + PostgreSQL)

---

## 📄 License
MIT © 2026 RayLive PropTech
