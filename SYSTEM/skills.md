# Project: QR Menu SaaS - Development Context

## Tech Stack
- Frontend: Next.js 14 (App Router), Tailwind CSS, shadcn/ui.
- Backend/DB: Supabase (PostgreSQL, Edge Functions).
- Auth: Supabase Auth.
- Payments: Stripe Billing.

## Core Logic & Constraints
- Multi-tenancy: Each restaurant has a unique `slug` (locked after onboarding).
- Public Routes: `/menu/[slug]` is the public digital menu.
- Admin Routes: `/dashboard/*` is the protected management area.
- UI Priority: Sidebar navigation on the left, mobile-first responsive design for menus.
- No-Change Policy: The 'slug' or unique URL chosen during onboarding cannot be modified by the user later.

## Data Structure Key Points
- Restaurants table: id, name, slug, owner_id, subscription_status.
- Categories table: id, restaurant_id, name, order_index.
- Products table: id, category_id, name, description, price, image_url.