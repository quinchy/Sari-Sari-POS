# SariSariPOS

A modern Point of Sale (POS) application for Sari Sari stores (small retail shops in the Philippines). Track GCash earnings, manage product inventory, and analyze sales performance.

## Features

- **Authentication** - User sign-up, sign-in, and session management
- **Account & Store Management** - Create and manage multiple stores
- **GCash Earning Tracking** - Record, view, and visualize daily GCash earnings
- **Analytics Dashboard** - View total, highest, and lowest earnings
- **Product Inventory** - Manage product stock (coming soon)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Caching**: Redis (Upstash)
- **Auth**: Supabase Auth
- **UI**: Shadcn/UI + Tailwind CSS
- **State**: TanStack Query + Zustand

## Getting Started

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

## Project Structure

```
src/
├── app/              # Next.js App Router (pages + API routes)
├── features/         # Feature modules (auth, gcash, products)
├── components/       # Shared UI components
├── repositories/     # Database access layer
├── lib/             # Utilities (Prisma, Redis, Supabase clients)
└── types/           # Shared TypeScript types
```

## Documentation

For detailed documentation, see the [docs](./docs) folder:

- [Overview](./docs/OVERVIEW.md) - Project introduction
- [Architecture](./docs/ARCHITECTURE.md) - System design and patterns
- [Feature Docs](./docs/FEATURES/) - Detailed feature documentation
- [API Reference](./docs/API_REFERENCE.md) - API endpoints

## License

MIT
