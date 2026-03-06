# Qwenta - Point of Sale for Sari Sari Stores

Qwenta is a modern Point of Sale (POS) application designed specifically for Sari Sari stores (small retail shops in the Philippines). It helps store owners track their GCash earnings, manage product inventory, and analyze sales performance.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL (via Supabase) |
| ORM | Prisma |
| Caching | Redis |
| Authentication | Supabase Auth |
| UI Components | Shadcn/UI |
| State Management | TanStack Query + Zustand |
| Form Validation | Zod |
| Charts | Recharts |

---

## Features

1. **Authentication** - User sign-up, sign-in, and session management
2. **Account & Store Management** - Create and manage store profiles
3. **Analytics & Dashboard** - View sales performance and statistics
4. **GCash Earning Tracking** - Track daily GCash earnings with charts and history
5. **Product Stock Inventory** - Manage product inventory and stock levels

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase)
- Redis instance (Upstash or self-hosted)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages and API routes
├── features/              # Feature-based modules
├── components/           # Shared UI components
├── repositories/         # Database access layer
├── lib/                  # Utilities and clients
├── providers/            # React providers
└── types/                # Shared TypeScript types
```

---

## License

MIT
