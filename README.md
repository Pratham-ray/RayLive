# 🏢 RayLive — Next-Gen AI PropTech Marketplace

> **Find. Value. Transact.** — A full-stack real estate marketplace powered by **RayBroker AI**, verified RERA agent directory, fair-price valuation benchmarking, JWT authentication, and cross-device PostgreSQL persistence.

---

## 🌐 Live Deployment

| Layer | Platform | URL |
|---|---|---|
| **Frontend** | Vercel | https://raylive.vercel.app |
| **Backend API** | Render (Docker) | https://raylive.onrender.com |
| **Database** | Neon (PostgreSQL) | Serverless PostgreSQL (Cloud) |

> **Note:** The backend runs on Render's free tier, so the first request after 15 minutes of inactivity may take ~30–60 seconds to wake up.

---

## 🌟 Key Features

### 1. 🔍 Property Discovery & Filtering (`/`, `/explore`, `/property/:id`)
* **Multi-Intent Search:** Filter by **Buy**, **Rent**, and **Commercial** properties.
* **Criteria-Based Filtering:** City, BHK count, property type, and budget ranges powered by JPA Specifications.
* **Detailed Property Pages:** Specs, super built-up area, furnishing details, amenities, and agent contact.

### 2. 🤖 RayBroker AI — Online Property Consultant
* **24/7 AI Broker Assistant:** Floating slide-out widget for neighborhood advisory and property recommendations.
* **Fair Price Benchmark:** Analyzes city real estate trends to evaluate asking prices.
* **Instant EMI Calculator:** Interactive down payment, tenure, and interest rate breakdown.

### 3. 🔐 Authentication & Cross-Device Sync (`/login`)
* **JWT Authentication:** User registration and login backed by Spring Security and PostgreSQL.
* **Persistent Watchlist (`/favorites`):** Bookmarked properties sync across devices via `/api/users/favorites`.

### 4. 📅 Tour Booking & Agent Lead Inbox (`/bookings`, `/agent-inbox`)
* **Site Visit Scheduling:** Book physical property tours with preferred date and time windows.
* **Agent & Owner Inbox:** Manage incoming property inquiries and lead statuses.

### 5. 🏡 "List Your Property" & Verified Agents (`/sell`, `/agents`)
* **Property Publishing Wizard:** Create and publish new Buy/Rent listings directly to the backend database.
* **RERA Agent Directory:** Browse verified real estate agents and their portfolios.

---

## 🛠️ Tech Stack

### Frontend (`frontend/`)
* **Framework:** React 18 with TypeScript
* **Bundler:** Vite 5
* **Styling:** Tailwind CSS
* **Routing:** React Router v6
* **Icons:** Lucide React

### Backend (`backend/`)
* **Runtime & Framework:** Java 21, Spring Boot 3.3.4, Maven
* **Security:** Spring Security + JWT (`jjwt`)
* **Database & ORM:** Spring Data JPA / Hibernate, H2 (local dev), PostgreSQL / Neon (production)
* **API Docs:** OpenAPI 3 / Swagger UI (`/swagger-ui.html`)
* **Containerization:** Multi-stage `Dockerfile` + `docker-compose.yml`

---

## 📁 Project Structure

```text
RayLive/
├── frontend/                 # React + TypeScript + Vite app (deployed on Vercel)
│   ├── src/
│   │   ├── components/       # UI components, Navbar, Footer, AIBrokerWidget
│   │   ├── context/          # AuthContext, FavoritesContext
│   │   ├── pages/            # Home, Explore, PropertyDetail, Favorites, Bookings, Sell, Agents, Login, AgentInbox
│   │   ├── services/         # API client (reads VITE_API_BASE_URL)
│   │   └── types/            # TypeScript interfaces
│   └── package.json
├── backend/                  # Spring Boot 3 REST API (deployed on Render)
│   ├── src/main/java/com/raylive/
│   │   ├── config/           # SecurityConfig, WebConfig (CORS), PostgresDataSourceConfig
│   │   ├── controller/       # Auth, Property, User, Agent, Inquiry, AIBroker controllers
│   │   ├── entity/           # JPA entities
│   │   ├── repository/       # Spring Data JPA repositories & PropertySpecification
│   │   └── service/          # Business logic
│   ├── Dockerfile            # Production Docker build
│   └── pom.xml
├── docker-compose.yml        # Local PostgreSQL 16 + Backend setup
└── README.md
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
* **Node.js:** v18+ (v20+ recommended)
* **Java:** JDK 21
* **Maven:** 3.9+ (or use included `mvnw.cmd`)
* **Docker** *(optional, for local PostgreSQL via Docker Compose)*

### 1. Start the Backend (Spring Boot)

**Option A: Quick local dev (H2 in-memory DB)**
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

**Option B: Production-like with Neon / PostgreSQL**
```powershell
$env:SPRING_PROFILES_ACTIVE="prod"
$env:DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require"
cd backend
.\mvnw.cmd spring-boot:run
```

**Option C: Docker Compose (Local PostgreSQL 16 + Backend)**
```powershell
docker compose up --build
```

* Backend API: `http://localhost:8080`
* Swagger UI: `http://localhost:8080/swagger-ui.html`

### 2. Start the Frontend (Vite + React)
```powershell
cd frontend
npm install
npm run dev
```
* Frontend runs at: `http://localhost:5173`
* To point the frontend to a custom backend URL, set `VITE_API_BASE_URL` (e.g., `https://raylive.onrender.com/api`).

---

## ☁️ Deployment Architecture

* **Frontend (Vercel):** Root directory `frontend`, build command `npm run build`, environment variable `VITE_API_BASE_URL=https://raylive.onrender.com/api`.
* **Backend (Render):** Root directory `backend`, Docker runtime using `backend/Dockerfile`, environment variables `SPRING_PROFILES_ACTIVE=prod` and `DATABASE_URL` pointing to Neon PostgreSQL.
* **Database (Neon):** Serverless PostgreSQL with automatic schema management (`ddl-auto: update`).

---

## ✅ Completed Milestones
- [x] Responsive PropTech Frontend (React + TypeScript + Tailwind CSS)
- [x] RayBroker AI Consultant & EMI Calculator
- [x] Property Discovery with Multi-Filter Search (JPA Specifications)
- [x] JWT Authentication & Persistent User Accounts
- [x] Cross-Device Saved Homes Watchlist (`/favorites`)
- [x] Site Visit / Tour Booking System (`/bookings`) & Agent Inbox (`/agent-inbox`)
- [x] Property Publishing Portal (`/sell`) & Agent Directory (`/agents`)
- [x] Spring Boot REST APIs & OpenAPI Swagger Docs
- [x] Cloud Deployment (Vercel + Render Docker + Neon PostgreSQL)

---

## 📄 License
MIT © 2026 RayLive PropTech
