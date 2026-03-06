# Architecture Overview

## Design Principles

This project follows a **layered, feature-based architecture** with clear separation of concerns:

1. **Feature-First Organization** - Code is organized by feature (auth, gcash, products) rather than by technical layer
2. **Thin API Routes** - API routes delegate all business logic to services
3. **Service Layer Pattern** - Business logic, validation, and cache management happen in services
4. **Repository Pattern** - Database access is abstracted through repositories
5. **Standardized Responses** - All API responses follow a consistent format

---

## Layer Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PAGES & COMPONENTS                          │
│         (React components, pages, hooks)                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API LAYER                               │
│                  (features/*/apis/*.ts)                        │
│            Client-side fetch wrappers                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API ROUTES                                 │
│                    (app/api/*/route.ts)                       │
│              Request validation, delegation                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                               │
│                 (features/*/services/*.ts)                      │
│         Business logic, validation, cache invalidation          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   REPOSITORY LAYER                             │
│                  (repositories/*.ts)                           │
│                Database queries via Prisma                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  DATABASE & CACHE                              │
│              PostgreSQL (Prisma) + Redis                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Feature Module Structure

Each feature follows the same directory structure:

```
features/<feature-name>/
├── apis/                 # Client-side API wrappers (fetch)
├── components/           # React UI components
│   └── table/           # Table-specific components
├── hooks/               # React Query hooks
├── lib/                 # Feature-specific utilities
├── services/            # Business logic
├── types/               # TypeScript types
└── validation/          # Zod validation schemas
```

---

## Directory Reference

### `src/app/` - Next.js App Router

| Path | Description |
|------|-------------|
| `(auth)/` | Auth pages (sign-in, sign-up) |
| `(dashboard)/` | Protected dashboard pages |
| `api/` | API route handlers |

### `src/features/` - Feature Modules

| Feature | Description |
|---------|-------------|
| `auth/` | Authentication, account & store management |
| `gcash/` | GCash earning tracking |
| `products/` | Product inventory |

### `src/components/` - Shared Components

| Path | Description |
|------|-------------|
| `ui/` | Shadcn/UI component library |
| `sidebar/` | Application sidebar |

### `src/lib/` - Utilities

| Path | Description |
|------|-------------|
| `prisma/` | Prisma client singleton |
| `redis/` | Redis client |
| `supabase/` | Supabase client |
| `utils.ts` | General utilities |

### `src/repositories/` - Database Layer

| File | Description |
|------|-------------|
| `gcash-earning.ts` | GCash earning CRUD |
| `product.ts` | Product CRUD |
| `store.ts` | Store CRUD |
| `store-member.ts` | Store membership |
| `user.ts` | User management |

### `src/types/` - Shared Types

| Path | Description |
|------|-------------|
| `domain/` | Domain types (User, Store) |
| `shared/` | Shared types (Pagination, Response) |

---

## Data Flow

### Example: Fetching GCash Earnings

```
1. Component calls useGetGCashEarning({ year: 2026, month: 3 })
                         │
2. Hook calls getGCashEarning() from apis/gcash.ts
                         │
3. API client fetches /api/gcash-earning?year=2026&month=3
                         │
4. API Route (route.ts) calls service.getGCashEarning()
                         │
5. Service:
   - Validates params
   - Checks Redis cache
   - If not cached → calls repository
   - Caches result
   - Returns response
                         │
6. Repository executes Prisma query
                         │
7. Response flows back up, cached in Redis
```

---

## Key Patterns

### 1. Standardized Response Format

All API responses follow this structure:

```typescript
interface Response<T> {
  success: boolean;
  message: string;
  data?: T;
  status: number;
}
```

### 2. Validation

- **Location**: Services validate input before processing
- **Tool**: Zod schemas in `features/*/validation/`
- **Pattern**: `schema.safeParse(data)` returns typed result or errors

### 3. Caching Strategy

- **Tool**: Redis for server-side caching
- **Location**: Feature-specific lib files (e.g., `gcash-redis.ts`)
- **Invalidation**: Done in service layer after mutations

### 4. Error Handling

- Services return `{ success: false, status: number, message }` on error
- API routes transform service responses to NextResponse
- React Query hooks handle errors and expose error state

### 5. React Query Usage

- **Queries**: For fetching data (cached automatically)
- **Mutations**: For create/update/delete operations
- **Invalidation**: After mutations to refetch fresh data
