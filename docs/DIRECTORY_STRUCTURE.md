# Directory Structure

Complete reference of all directories and files in the project.

---

## Root Directory

```
sari-sari-pos/
├── .env.example           # Environment variables template
├── .gitignore
├── docs/                  # Documentation
├── next.config.js
├── package.json
├── postcss.config.js
├── prisma/
│   └── schema.prisma     # Database schema
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

---

## `src/` Directory

```
src/
├── app/                    # Next.js App Router
├── components/            # Shared UI components
├── features/             # Feature modules
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and clients
├── providers/            # React context providers
├── repositories/         # Database access layer
└── types/                # Shared TypeScript types
```

---

## `src/app/` - Next.js Pages

```
src/app/
├── (auth)/               # Auth route group
│   ├── layout.tsx       # Auth layout
│   ├── sign-in/         # Sign in page
│   └── sign-up/         # Sign up page
│
├── (dashboard)/         # Protected route group
│   ├── layout.tsx       # Dashboard layout (sidebar)
│   ├── gcash/           # GCash page
│   ├── products/        # Products page
│   └── page.tsx         # Dashboard home
│
├── api/                 # API routes
│   └── (auth)/
│       ├── sign-in/
│       ├── sign-up/
│       ├── sign-out/
│       └── current-user/
│
├── favicon.ico
├── globals.css
├── layout.tsx
├── not-found.tsx
└── page.tsx             # Root redirect
```

---

## `src/features/` - Feature Modules

```
src/features/
├── auth/                     # Authentication feature
│   ├── apis/
│   │   └── auth.ts          # Auth API wrappers
│   ├── components/
│   │   ├── account-form.tsx
│   │   ├── sign-in-form.tsx
│   │   └── store-form.tsx
│   ├── hooks/
│   │   └── use-auth.ts
│   ├── services/
│   │   └── auth.ts
│   ├── store/
│   │   └── use-signup-store.ts
│   ├── types/
│   │   └── auth.ts
│   └── validations/
│       └── auth.ts
│
├── gcash/                   # GCash earning feature
│   ├── apis/
│   │   └── gcash.ts
│   ├── components/
│   │   ├── gcash-earning-analytics.tsx
│   │   ├── gcash-earning-chart.tsx
│   │   ├── gcash-earning-form.tsx
│   │   ├── gcash-toolbar.tsx
│   │   └── table/
│   │       ├── gcash-earning-action-cell.tsx
│   │       └── gcash-earning-table.tsx
│   ├── hooks/
│   │   └── use-gcash-earning.ts
│   ├── lib/
│   │   ├── gcash-earning-table-columns.tsx
│   │   └── gcash-redis.ts
│   ├── services/
│   │   └── gcash.ts
│   ├── types/
│   │   └── gcash.ts
│   └── validation/
│       └── gcash.ts
│
└── products/                # Products feature (in development)
    └── components/
        └── products-toolbar.tsx
```

---

## `src/components/` - Shared Components

```
src/components/
├── app-header.tsx
├── app-logo.tsx
├── form-header.tsx
├── sidebar/
│   ├── app-sidebar.tsx
│   └── app-sidebar-content.tsx
├── table-fallback.tsx
├── table-pagination.tsx
└── ui/                      # Shadcn/UI components
    ├── alert-dialog.tsx
    ├── badge.tsx
    ├── button.tsx
    ├── calendar.tsx
    ├── card.tsx
    ├── combobox.tsx
    ├── dropdown-menu.tsx
    ├── field.tsx
    ├── input.tsx
    ├── input-group.tsx
    ├── label.tsx
    ├── pagination.tsx
    ├── popover.tsx
    ├── select.tsx
    ├── sheet.tsx
    ├── skeleton.tsx
    ├── sidebar.tsx
    ├── sonner.tsx
    ├── spinner.tsx
    ├── table.tsx
    ├── textarea.tsx
    ├── tooltip.tsx
    └── chart.tsx
```

---

## `src/lib/` - Utilities

```
src/lib/
├── prisma/
│   ├── client.ts          # Prisma client (client-side)
│   └── server.ts         # Prisma client (server-side)
├── redis/
│   └── client.ts         # Redis client
├── supabase/
│   ├── client.ts         # Supabase client
│   ├── proxy.ts
│   └── server.ts        # Supabase server client
└── utils.ts              # Utility functions
```

---

## `src/repositories/` - Database Layer

```
src/repositories/
├── gcash-earning.ts     # GCash earning queries
├── product.ts           # Product queries
├── store.ts             # Store queries
├── store-member.ts      # Store membership queries
└── user.ts              # User queries
```

---

## `src/types/` - Shared Types

```
src/types/
├── domain/
│   ├── store.ts         # Store domain types
│   └── store-member.ts # Store member types
│   └── user.ts         # User domain types
└── shared/
    ├── pagination.ts    # Pagination types
    └── response.ts     # Response wrapper types
```

---

## `docs/` - Documentation

```
docs/
├── ARCHITECTURE.md      # Architecture overview
├── DIRECTORY_STRUCTURE.md
├── FEATURES/
│   ├── AUTH.md         # Authentication feature
│   ├── GCASH_EARNING.md
│   └── PRODUCTS.md     # Products feature
└── OVERVIEW.md         # Project overview
```

---

## `prisma/` - Database Schema

```
prisma/
└── schema.prisma        # Database schema definitions
```

Contains:
- Users
- Stores
- Store Members
- GCash Earnings
- Products (planned)
