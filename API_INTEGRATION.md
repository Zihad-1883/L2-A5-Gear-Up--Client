# API Integration Mapping

This document maps the core frontend components and pages to the backend endpoints they consume.

## 1. Authentication & Users
| Frontend Route / Component | Backend API Endpoint | Method | Purpose |
|----------------------------|----------------------|--------|---------|
| `/auth/register` (RegisterForm) | `/api/user/register` | `POST` | Create a new user (Customer/Provider). |
| `/auth/login` (LoginForm) | `/api/auth/login` | `POST` | Authenticate user and receive JWT access/refresh tokens. |
| Dashboard Sidebar / Navbar | *(Decoded JWT)* | N/A | Roles are retrieved from the decoded JWT token payload. |
| `/dashboard/admin/all-users` | `/api/users` | `GET` | Admin view of all registered platform users. |

## 2. Gear & Inventory
| Frontend Route / Component | Backend API Endpoint | Method | Purpose |
|----------------------------|----------------------|--------|---------|
| `/` & `/gear` (GearGrid) | `/api/gear-items` | `GET` | Fetch all public gear items with filters (price, category, etc.). |
| `/gear/[id]` (GearDetails) | `/api/gear-items/:id` | `GET` | Fetch a single piece of gear with full details and provider info. |
| `/dashboard/provider/create-gears` | `/api/gear-items` | `POST` | Provider creates a new gear listing (secured with JWT). |
| `/dashboard/provider/my-all-gears` | `/api/gear-items/my-gears` | `GET` | Fetch only the gear items owned by the authenticated provider. |
| `/dashboard/provider/my-all-gears` | `/api/gear-items/:id` | `PATCH` / `DELETE` | Update stock/price or remove a gear item completely. |

## 3. Categories
| Frontend Route / Component | Backend API Endpoint | Method | Purpose |
|----------------------------|----------------------|--------|---------|
| `/dashboard/admin/categories`| `/api/categories` | `GET`, `POST`, `PATCH`, `DELETE` | Admins create, list, and manage valid equipment categories. |

## 4. Rental Orders
| Frontend Route / Component | Backend API Endpoint | Method | Purpose |
|----------------------------|----------------------|--------|---------|
| `/gear/[id]` (Rent Now) | `/api/rentals` | `POST` | Customer initiates a rental booking with start/end dates. |
| `/dashboard/customer/orders` | `/api/rentals/my-rentals` | `GET` | Customer views their own active/past rental history. |
| `/dashboard/provider/orders` | `/api/rentals/provider-orders`| `GET` | Provider checks incoming orders for their gear. |
| `/dashboard/provider/orders` | `/api/rentals/:id` | `PATCH` | Provider updates status (e.g. `APPROVED`, `RETURNED`). |
| `/dashboard/admin/orders` | `/api/rentals` | `GET` | Admin oversees all platform rental orders. |

## 5. Payments (SSLCommerz)
| Frontend Route / Component | Backend API Endpoint | Method | Purpose |
|----------------------------|----------------------|--------|---------|
| `/dashboard/customer/orders`| `/api/payments/create` | `POST` | Creates an SSLCommerz gateway session for a specific rental order. |
| `/dashboard/customer/my-payments`| `/api/payments/my-payments` | `GET` | Customer reviews all historic payment receipts. |
| `src/proxy.ts` (Interceptor) | N/A | N/A | Intercepts SSLCommerz query redirects and enforces clean UI routing. |

## 6. Reviews
| Frontend Route / Component | Backend API Endpoint | Method | Purpose |
|----------------------------|----------------------|--------|---------|
| `/dashboard/customer/orders`| `/api/reviews` | `POST` | Customer tests a rating/comment for gear marked as `RETURNED`. |
| `/gear/[id]` | `/api/reviews/:gearId` | `GET` | Public page loads and displays all reviews for an item. |
