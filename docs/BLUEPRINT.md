# RayLive — Real Estate Marketplace & AI Property Consultant

**Find Properties. Discover Opportunities. Live Better.**

---

## 1. Project Overview
RayLive is a PropTech digital marketplace designed to connect property buyers, tenants, owners, and verified human agents through one platform. It combines real-time property discovery across residential and commercial sectors with an integrated 24/7 **AI Real Estate Broker ("RayBroker")** that calculates fair market valuations, rental yields, and mortgage EMI scenarios.

---

## 2. Technology Stack

### Frontend:
* **Framework:** React.js (v18) with TypeScript
* **Tooling:** Vite + React Router DOM
* **Styling:** Tailwind CSS (Custom Navy `#0A1128` & Amber Gold `#F59E0B` palette)
* **Icons:** Lucide React
* **Port:** `http://localhost:5173`

### Backend:
* **Runtime:** Java 21 LTS (OpenJDK Temurin)
* **Framework:** Spring Boot 3.3.4 (Modular Monolith)
* **Security:** Spring Security + Stateless JWT
* **Data Layer:** Spring Data JPA + Hibernate
* **Database:** H2 In-Memory (Dev profile) / PostgreSQL + PostGIS (Prod profile)
* **API Documentation:** OpenAPI 3 / Swagger UI (`http://localhost:8080/swagger-ui.html`)
* **Port:** `http://localhost:8080`

---

## 3. Core REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/properties` | Search & filter properties by city, type, budget, BHK |
| `GET` | `/api/properties/{id}` | Get full property details, images, and agent info |
| `GET` | `/api/properties/featured` | Get verified featured listings for carousel |
| `POST` | `/api/properties` | Publish a new property (Sell / Rent Out) |
| `POST` | `/api/ai-broker/chat` | Conversational property search, deal check & EMI calc |
| `POST` | `/api/ai-broker/valuation` | Instant micro-market fair price valuation calculation |
| `GET` | `/api/agents` | List verified RERA-licensed property agents |
| `POST` | `/api/inquiries` | Submit schedule-a-tour booking or agent message |

---

## 4. How to Run

### Running the Frontend:
```powershell
cd C:\Users\ASUS\OneDrive\Documents\RayLive\frontend
npm install
npm run dev
```
Access at: **`http://localhost:5173`**

### Running the Backend:
```powershell
cd C:\Users\ASUS\OneDrive\Documents\RayLive\backend
.\mvnw.cmd spring-boot:run
```
Access Swagger API Docs at: **`http://localhost:8080/swagger-ui.html`**  
Access H2 Database Console at: **`http://localhost:8080/h2-console`**
