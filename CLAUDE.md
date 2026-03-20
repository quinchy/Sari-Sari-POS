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

This project uses a **Hybrid Feature-Based Modular Monolith with Layered Tendencies** More specifically, it is closest to vertical slice / feature-first organization for business code, combined with shared technical layers for reusable app-wide code, plus a repository pattern for data access. It is more like Feature-Sliced Design mixed with classic layered organization inside a single Next.js codebase.

The features folder follows the same structure or add these folder if necessary:
- `features/feature-name/apis/` - Client-side fetch call functions
- `features/feature-name/components/` - UI components
- `features/feature-name/data/` - Constants or Static datas
- `features/feature-name/hooks/` - Custom React Query hooks or Custom React Hooks
- `features/feature-name/lib/` - Feature-specific utilities
- `features/feature-name/services/` - Business logic
- `features/feature-name/store/` - Zustand store/state management
- `features/feature-name/types/` - TypeScript types
- `features/feature-name/validation/` - Zod validation schemas

## Project's Key Patterns

- **Data fetching and mutation**: Use Tanstack React Query hooks such as `useQuery` or `useMutation`.
- **API calls**: Use exportable client API call functions to be used by Tanstack React Query.
- **Server-side logic**: Use a Services Layer for Route Handlers. Services should handle validation, caching, repository calls, business logic, response shaping, and status code decisions.
- **Database access**: Use a Repositories Layer for reusable queries per table/model.
- **Caching**: Use Redis Upstash to manage server-side caching.
- **Rate limiting**: Use Redis Upstash to manage server-side rate limiting for API routes.
- **Validation**: Use Zod for both client-side and server-side validation, with inferred types where applicable.
- **API Routes**: Place in `app/api/` using Next.js Route Handlers (`route.ts`) and follow RESTful resource-based routing. Use noun-based paths such as `/api/users` and `/api/users/[id]`, and let the HTTP method (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) define the action instead of action-based endpoints like `/api/get-users` or `/api/create-user` which should be avoided at all cause.
- **Route Handler responsibility**: Keep Route Handlers thin. They should mainly parse the request, call the appropriate service, and return the service result using `NextResponse.json()`. Do not place business logic, database logic, caching logic, or heavy validation directly inside Route Handlers.
- **Response contract**: Use the `sendResponse` utility from `@/lib/response`. Response shape must be exactly: `success`, `status`, `message`, and either `data` (for success) or `error` (for failure). Never add extra top-level properties—put additional data inside `data`.
- **Types / DRY**: Always reuse existing types from `src/types/shared/` instead of redefining them. Use TypeScript's `type` and `interface` with `extends` for composition. Keep a single source of truth for each type—don't duplicate types across files.
- **Status codes**: Always return the appropriate HTTP status code based on the result of the service, such as `200`, `201`, `400`, `401`, `403`, `404`, `409`, `422`, or `500`. Services should decide the correct response status, and Route Handlers should preserve and return it.
- **ORM / database source of truth**: This project uses Prisma as the main database access layer. Define and update models in `root/prisma/schema.prisma`.
- **Prisma types**: Prefer Prisma's generated model and query typings from `root/prisma/generated/client` instead of redefining database model types manually.
- **Supabase usage**: This project uses Supabase as the database provider/infrastructure, but application data access should go through Prisma, not through direct Supabase queries or client calls.

## DRY Principles for Types

- **Centralize shared types**: Define reusable types in `src/types/shared/` and import them across the codebase. Never duplicate type definitions.
- **Use TypeScript's extends**: When creating types that build upon existing ones, use `extends` or intersection types instead of redefining properties.
- **Import from single source**: If a type is used in multiple places (e.g., `ErrorDetails`, `SuccessResponse`, `FailureResponse`), define it once in `src/types/shared/` and re-export where needed.
- **Leverage type inference**: Let TypeScript infer types from existing code (e.g., Zod schemas, Prisma models) rather than manually defining them.

## Next.js Best Practices

- **Images**: Always use `next/image` instead of `<img>` for optimized images with lazy loading and automatic format conversion
- **Links**: Use `next/link` for internal navigation (automatically prefetches routes)
- **Fonts**: Use `next/font` (Google Fonts) for optimized font loading with zero layout shift
- **Server Components**: Default to Server Components for pages; use `"use client"` only for components that needs (data fetching/mutation, interactivity, hooks, browser APIs)
- **Route Groups**: Use Next.js Route Groups to organize pages and endpoints by feature or access scope without affecting the URL structure. Group related routes under folders for example, such as `(auth)` for authentication flows and `(dashboard)` for protected app areas like gcash and products.
