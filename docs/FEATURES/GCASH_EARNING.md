# GCash Earning Feature

Track and visualize daily GCash earnings with charts, analytics, and history.

## Overview

- **Create Earning**: Record daily GCash earnings
- **View History**: Paginated list of all earnings
- **Analytics**: Total, highest, lowest earnings
- **Charts**: Visualize earnings by month

---

## Repositories Used

| Repository | Database Table | Description |
|------------|----------------|-------------|
| `repositories/gcash-earning.ts` | `GCashEarning` | All GCash earning CRUD |

---

## File Structure

```
features/gcash/
├── apis/
│   └── gcash.ts              # Client-side API wrappers
├── components/
│   ├── gcash-earning-analytics.tsx  # Analytics cards
│   ├── gcash-earning-chart.tsx      # Line chart
│   ├── gcash-earning-form.tsx       # Create/edit form
│   ├── gcash-toolbar.tsx            # Toolbar actions
│   └── table/
│       ├── gcash-earning-action-cell.tsx  # Row actions
│       └── gcash-earning-table.tsx        # Data table
├── hooks/
│   └── use-gcash-earning.ts   # React Query hooks
├── lib/
│   ├── gcash-earning-table-columns.tsx  # Table columns config
│   └── gcash-redis.ts        # Redis caching utilities
├── services/
│   └── gcash.ts              # Business logic
├── types/
│   └── gcash.ts              # TypeScript types
└── validation/
    └── gcash.ts              # Zod validation schemas
```

---

## Repositories Used

| Repository | Database Table | Description |
|------------|----------------|-------------|
| `repositories/gcash-earning.ts` | `GCashEarning` | All GCash earning CRUD operations |

---

## API Routes

| Method | Endpoint | Handler |
|--------|----------|---------|
| GET | `/api/gcash-earning` | List earnings (paginated, filtered) |
| POST | `/api/gcash-earning` | Create earning |
| PUT | `/api/gcash-earning` | Update earning |
| DELETE | `/api/gcash-earning` | Delete earning |
| GET | `/api/gcash-earning/total` | Get total earnings |
| GET | `/api/gcash-earning/extreme` | Get highest/lowest |

### Query Parameters (GET)

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (for pagination) |
| `limit` | number | Items per page |
| `year` | number | Filter by year |
| `month` | number | Filter by month |

---

## Client API (`features/gcash/apis/gcash.ts`)

```typescript
// Get earnings (paginated or filtered)
getGCashEarning(params?: GetGCashEarningParams): Promise<GCashEarningResponse>

// Create earning
createGCashEarning(data: CreateGCashEarning): Promise<{ id: string }>

// Update earning
updateGCashEarning(data: UpdateGCashEarning): Promise<{ id: string }>

// Delete earning
deleteGCashEarning(data: DeleteGCashEarning): Promise<{ id: string }>

// Get total earnings
getGCashEarningTotal(): Promise<number>

// Get extreme (highest/lowest)
getGCashEarningExtreme(type: "highest" | "lowest"): Promise<ExtremeResult>
```

---

## Services (`features/gcash/services/gcash.ts`)

### `getGCashEarning(params)`

1. Get current user and store
2. Build cache key from params
3. Check Redis cache
4. If cached → return cached data
5. If not cached:
   - If year & month → fetch by month
   - If page & limit → fetch paginated
   - Otherwise → fetch all
6. Map to response type
7. Cache result
8. Return response

**Unified Response**: Returns `GCashEarningResponse[]` regardless of filters.

### `createGCashEarning(data)`

1. Validate input
2. Get current user and store
3. Create earning in database
4. Invalidate cache
5. Return created ID

### `updateGCashEarning(data)`

1. Validate input
2. Update earning in database
3. Invalidate cache
4. Return updated ID

### `deleteGCashEarning(id)`

1. Validate input
2. Check if record exists
3. Delete from database
4. Invalidate cache
5. Return deleted ID

---

## Caching (`features/gcash/lib/gcash-redis.ts`)

### Cache Keys

```
gcash-earnings:{storeId}                    # All earnings
gcash-earnings:{storeId}:page={n}:limit={n} # Paginated
gcash-earnings:{storeId}:year={y}:month={m}  # By month
gcash-earnings-total:{storeId}              # Total earnings
gcash-earnings-extreme:{storeId}:{type}     # Highest/lowest
```

### Functions

```typescript
// Build cache key
buildGCashEarningsCacheKey(storeId, params): string

// Get cached data
getCachedGCashEarnings<T>(cacheKey): Promise<T | null>

// Set cached data
setCachedGCashEarnings<T>(payload, storeId, params, ttl?): Promise<void>

// Invalidate all cache
invalidateAllGCashEarningsCache(storeId): Promise<void>

// Invalidate specific cache
invalidateGCashEarningsCache(storeId, params): Promise<void>
```

### Cache Invalidation

Invalidation happens in the **service layer** after mutations (create, update, delete) to ensure consistency.

---

## Types (`features/gcash/types/gcash.ts`)

```typescript
// Input types (from Zod)
type CreateGCashEarning = z.input<typeof createGCashEarningSchema>
type UpdateGCashEarning = z.input<typeof updateGCashEarningSchema>
type DeleteGCashEarning = z.input<typeof deleteGCashEarningSchema>

// Response type
interface GCashEarningResponse {
  id: string;
  storeId: string;
  amount: number;
  created_at: Date;
  updated_at: Date;
}

// Query params
interface GetGCashEarningParams {
  page?: number;
  limit?: number;
  year?: number;
  month?: number;
}
```

---

## Validation (`features/gcash/validation/gcash.ts`)

```typescript
// Base schema
const gcashEarningSchema = z.strictObject({
  amount: z.number()
    .nonnegative()
    .min(1)
    .max(1_000_000)
    .refine((n) => Number.isInteger(n * 100), {
      message: "Amount must have at most 2 decimal places",
    }),
  date: z.iso.datetime().optional(),
});

// Create (requires amount)
const createGCashEarningSchema = z.strictObject({
  amount: gcashEarningSchema.shape.amount,
  date: gcashEarningSchema.shape.date,
});

// Update (all optional)
const updateGCashEarningSchema = z.strictObject({
  id: z.uuid(),
  amount: gcashEarningSchema.shape.amount.optional(),
  date: gcashEarningSchema.shape.date.optional(),
});

// Delete
const deleteGCashEarningSchema = z.strictObject({
  id: z.uuid(),
});
```

---

## React Hooks (`features/gcash/hooks/use-gcash-earning.ts`)

### Query Hooks

```typescript
// Get earnings (paginated/filtered)
useGetGCashEarning(params): {
  gcashEarnings: GCashEarningResponse[];
  isGCashEarningsLoading: boolean;
  isGCashEarningsError: boolean;
  isGCashEarningsEmpty: boolean;
  refetchGCashEarnings: () => void;
  pagination: Pagination;
}

// Get total earnings
useGetGCashEarningTotal(): {
  total: number;
  isTotalLoading: boolean;
  isTotalError: boolean;
  refetchTotal: () => void;
}

// Get extreme (highest/lowest)
useGetGCashEarningExtreme(type): {
  extreme: { id: string; amount: number; created_at: string };
  isExtremeLoading: boolean;
  isExtremeError: boolean;
  refetchExtreme: () => void;
}
```

### Mutation Hooks

```typescript
// Create earning
useCreateGCashEarning(): {
  isCreateGCashEarningPending: boolean;
  createGCashEarning: (data) => void;
}

// Update earning
useUpdateGCashEarning(): {
  isUpdateGCashEarningPending: boolean;
  updateGCashEarning: (data) => void;
}

// Delete earning
useDeleteGCashEarning(): {
  isDeleteGCashEarningPending: boolean;
  deleteGCashEarning: (id) => void;
}
```

---

## Components

### `gcash-earning-chart.tsx`
- Interactive line chart showing daily earnings for selected month
- Month/year selector dropdowns
- Total amount display
- Fills missing days with 0 for complete chart

### `gcash-earning-analytics.tsx`
- Total earnings card
- Highest earning card
- Lowest earning card
- Fetches all three metrics

### `gcash-earning-table.tsx`
- Paginated data table
- Sortable columns
- Date and amount display

### `gcash-earning-action-cell.tsx`
- Edit button (opens form dialog)
- Delete button (opens confirmation dialog)

### `gcash-earning-form.tsx`
- Create/Edit form with amount and date fields
- Dialog-based form

### `gcash-toolbar.tsx`
- Create new earning button
- Filter by month/year (optional)
