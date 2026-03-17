# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The project is Qwenta, a Point of Sale (POS) application for Sari Sari Stores. The project uses Next.js for both frontend and backend.

## Tech Stack

- Next.js v16.1.6 (App Router)
- React v19.2.3
- TailwindCSS v4
- ShadcnUI v3.8.5
- Prisma v7.4.1 (PostgreSQL)
- Supabase Auth via supabase/ssr v0.8.0
- Redis via @upstash/redis v1.36.2
- TanStack React Query v5.90.21
- TanStack React Table v8.21.3
- Zustand v5.0.11
- Zod v4.3.6
- React Hook Form v7.71.2
- Motion (for Animation) v12.34.3
- Biome v2.2.0

## Commands

- `bun run dev`  Starts the development server for local development.
- `bun run build`  Creates the production build of the project.
- `bun run start`  Starts the app using the production build.
- `bun run lint`  Runs Biome checks for the project.
- `bun run lint:fix`  Runs Biome checks and applies safe fixes automatically.
- `bun run format`  Formats the project files with Biome.
- `bunx prisma db push`  Pushes the current Prisma schema to the database without creating a migration.
- `bunx prisma db pull`  Pulls the current database schema into `schema.prisma`.
- `bunx prisma generate`  Regenerates the Prisma Client based on the current Prisma schema.

## Architecture

This project uses a **layered, feature-based architecture** for frontend stuffs and **services-repositories** for backend stuffs

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

## Next.js Best Practices

- **Images**: Always use `next/image` instead of `<img>` for optimized images with lazy loading, automatic format conversion, and better performance.
- **Links**: Use `next/link` for internal navigation to enable prefetching.
- **Font**: Use `next/font` (Google Fonts) for optimized font loading with zero layout shift.
- **Server Components**: Prefer server components for data fetching and static content.
- **Client Components**: Add `'use client'` only when needed (hooks, event handlers, browser APIs).
