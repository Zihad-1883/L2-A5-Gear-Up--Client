# 🎒 GearUp Client — Outdoor & Equipment Rental Platform

**GearUp** is a modern, peer-to-peer and business equipment rental web application. It connects equipment owners (Providers) with outdoor enthusiasts, adventurers, and professionals (Customers) looking to rent high-quality gear seamlessly.

---

## 🔗 Repositories & API Links

- 🖥️ **Frontend Repository**: [https://github.com/Zihad-1883/L2-A5-Gear-Up--Client](https://github.com/Zihad-1883/L2-A5-Gear-Up--Client)
- ⚙️ **Backend Server Repository**: [https://github.com/Zihad-1883/L2-A4-Gear-Up--Server](https://github.com/Zihad-1883/L2-A4-Gear-Up--Server)
- 🌐 **Live API Base URL**: [https://gearup-backend-4eca.onrender.com](https://gearup-backend-4eca.onrender.com)

---

## ✨ Key Features

### 👤 Customer Features
- **Equipment Catalog**: Search, filter by category, price, and availability.
- **Detailed Item View**: Inspect rental rates per day, specifications, provider info, and user reviews.
- **Seamless Booking**: Select rental start and end dates with real-time cost calculation.
- **SSLCommerz Payment Integration**: Secure online payment gateway session creation and status tracking.
- **Customer Dashboard**: View active/past rental orders, track payment receipts, and submit reviews for returned gear.

### 🏭 Provider Features
- **List Equipment**: Create new rental listings with images, descriptions, pricing, and category classification.
- **Inventory Management**: Edit rates, update stock, or remove listings.
- **Order Handling**: Manage customer rental requests and update status (`APPROVED`, `RETURNED`, `CANCELLED`).

### 🛡️ Admin Features
- **User Management**: Monitor registered users and toggle account statuses (`ACTIVE` / `BLOCKED`).
- **Category Management**: Create, update, and manage gear categories.
- **Platform Oversight**: Audit all platform gear listings and rental transactions across providers.

---

## 🔐 Security & Authentication Architecture

- **JWT Authentication**: Secure authentication flow using Access Tokens and Refresh Tokens stored in HTTP-Only cookies.
- **Role-Based Access Control (RBAC)**: Custom Next.js middleware proxy (`src/proxy.ts`) enforcing role protection across `/dashboard/customer`, `/dashboard/provider`, and `/dashboard/admin`.
- **Automatic Token Refresh**: Silent access token regeneration on expiration using HTTP-Only refresh tokens.
- **SSLCommerz Redirect Interceptor**: Middleware handles third-party POST payment callbacks and maps them to user-friendly status routes.

---

## 🛠️ Tech Stack

| Domain | Technology |
|---|---|
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) |
| **Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **UI Components** | Radix UI Primitives, Lucide Icons, Sonner Toasts |
| **Form & Validation** | React Hook Form, Zod, @hookform/resolvers |
| **Payment Gateway** | SSLCommerz Integration |

---

## 📁 Project Structure

```text
gearup-client/
├── API_INTEGRATION.md      # API endpoints to component mapping documentation
├── public/                 # Static assets
└── src/
    ├── app/
    │   ├── (auth)/         # Login & Register pages
    │   ├── (private)/      # Dashboard routes (admin, customer, provider)
    │   ├── (public)/       # Home, Gear catalog, Item details, About, Contact
    │   └── payment/        # Payment success, fail, cancel handling
    ├── components/         # Reusable UI, Layout, & Feature components
    ├── lib/
    │   └── actions/        # Next.js Server Actions (userAuth, public, customer, provider, admin)
    ├── utilis/             # JWT & Cookie token helpers
    └── proxy.ts            # RBAC Middleware & Payment Callback proxy
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.x or higher)
- **npm**, **yarn**, or **pnpm**

### 1. Clone the Repository
```bash
git clone https://github.com/Zihad-1883/L2-A5-Gear-Up--Client.git
cd gearup-client
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:

```env
NEXT_PUBLIC_BASE_API=https://gearup-backend-4eca.onrender.com/api
NEXT_PUBLIC_SERVER_URL=https://gearup-backend-4eca.onrender.com

JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License
This project is part of Programming Hero Level-2 Web Development Assignment 5. All rights reserved.
