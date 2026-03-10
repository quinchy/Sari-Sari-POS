# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Qwenta is a modern Point of Sale (POS) application for Sari Sari stores in the Philippines. Built with Next.js 16 (App Router), TypeScript, PostgreSQL (via Prisma), and Redis (Upstash) for caching.

## Common Commands

```bash
# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code with Biome
npm run lint

# Format code with Biome
npm run format
```

## Architecture

This project uses a **layered, feature-based architecture**:

1. **Pages/Components** → Call React Query hooks
2. **APIs** (`features/*/apis/*.ts`) → Client-side fetch wrappers
3. **API Routes** (`app/api/*/route.ts`) → Request validation, delegate to services
4. **Services** (`features/*/services/*.ts`) → Business logic, validation, cache management
5. **Repositories** (`repositories/*.ts`) → Database access via Prisma

## Feature Modules

Each feature (auth, gcash, products) follows the same structure:
- `apis/` - Client-side fetch wrappers
- `components/` - React UI components
- `hooks/` - React Query hooks
- `lib/` - Feature-specific utilities
- `services/` - Business logic
- `store/` - Zustand store/state management
- `types/` - TypeScript types
- `validation/` - Zod validation schemas

## Key Patterns

- **Data fetching**: Use React Query hooks in `features/*/hooks/`
- **API calls**: Use client functions in `features/*/apis/`
- **Server-side logic**: Services in `features/*/services/`
- **Database access**: Repositories in `repositories/`
- **Caching**: Redis via Upstash, managed in service layer
- **Validation**: Zod schemas in `features/*/validation/`

## Next.js Best Practices

- **Images**: Always use `next/image` instead of `<img>` for optimized images with lazy loading and automatic format conversion
- **Links**: Use `next/link` for internal navigation (automatically prefetches routes)
- **Fonts**: Use `next/font` (Google Fonts) for optimized font loading with zero layout shift
- **Server Components**: Default to Server Components for data fetching and static content; use `"use client"` only when needed (interactivity, hooks, browser APIs)
- **API Routes**: Place in `app/api/` using Route Handlers (`route.ts`) or API Routes (`route.js`)
- **Environment Variables**: Use `.env.local` for local development, prefix public vars with `NEXT_PUBLIC_`

## Route Groups

- `(auth)/` - Authentication pages (sign-in, sign-up)
- `(dashboard)/` - Protected dashboard pages (gcash, products)

## Tech Stack

- Next.js 16.1.6 (App Router)
- React 19.2.3
- Prisma 7.4.1 (PostgreSQL)
- Redis via @upstash/redis
- Supabase Auth
- TanStack React Query + Zustand
- Tailwind CSS 4 + Shadcn/UI
- Biome for linting/formatting

## Next.js Best Practices

- **Images**: Always use `next/image` instead of `<img>` for optimized images with lazy loading, automatic format conversion, and better performance.
- **Links**: Use `next/link` for internal navigation to enable prefetching.
- **Font**: Use `next/font` (Google Fonts) for optimized font loading with zero layout shift.
- **Server Components**: Prefer server components for data fetching and static content.
- **Client Components**: Add `'use client'` only when needed (hooks, event handlers, browser APIs).
