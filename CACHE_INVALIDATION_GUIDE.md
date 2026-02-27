# Cache Invalidation Guide

## Overview

This guide explains how cache invalidation works in the GCash Earning system, with both **client-side (TanStack Query)** and **server-side (Redis)** caching strategies.

---

## What is Cache Invalidation?

**Cache invalidation** means removing stale data from cache so that the next request fetches fresh data from the database instead of serving outdated cached data.

### Why is it important?

When you **create, update, or delete** a GCash earning:
1. The data changes in the database
2. The cached data is now **stale** (outdated)
3. Without invalidation, users would see old data
4. **Invalidation** forces a fresh fetch, keeping data consistent

---

## Architecture: Two-Layer Caching

```
┌─────────────────────────────────────────────────────┐
│           USER BROWSER (Client)                      │
│  ┌───────────────────────────────────────────────┐  │
│  │  TanStack Query Cache                         │  │
│  │  (In-memory, 10 min storage)                  │  │
│  │                                               │  │
│  │  queryKey: ["gcash-earnings"]                 │  │
│  └───────────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ API Request
                   ▼
┌─────────────────────────────────────────────────────┐
│           YOUR SERVER (Backend)                      │
│  ┌───────────────────────────────────────────────┐  │
│  │  Redis Cache (Upstash)                        │  │
│  │  (Persistent, 5 min TTL)                      │  │
│  │                                               │  │
│  │  Key: gcash-earnings:{storeId}                │  │
│  └───────────────────────────────────────────────┘  │
│                   │                                  │
│                   │ Cache Miss                       │
│                   ▼                                  │
│  ┌───────────────────────────────────────────────┐  │
│  │  PostgreSQL Database                          │  │
│  │  (Source of Truth)                            │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## Layer 1: Client-Side (TanStack Query) Invalidation

### How It Works

**Location:** `src/features/gcash/hooks/use-gcash-earning.ts`

```typescript
export const useCreateGCashEarning = () => {
  const queryClient = useQueryClient();  // ← Get query client

  const { isPending, mutate } = useMutation({
    mutationFn: createGCashEarning,
    onSuccess: (data) => {
      toast.success(data.message);
      
      // ← INVALIDATE THE CACHE
      queryClient.invalidateQueries({ queryKey: ["gcash-earnings"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return { isCreateGCashEarningPending: isPending, createGCashEarning: mutate };
};
```

### Step-by-Step Process

1. **User submits form** → `createGCashEarning(data)` is called
2. **Server responds** → `onSuccess` callback fires
3. **Toast shows** → "GCash earning created successfully"
4. **Query invalidated** → `queryClient.invalidateQueries({ queryKey: ["gcash-earnings"] })`
5. **TanStack marks stale** → The cached data is marked as stale
6. **Auto refetch** → If component is visible, TanStack automatically fetches fresh data
7. **UI updates** → Component re-renders with new data

### Why `useQueryClient()`?

`useQueryClient()` gives you access to the **Query Client**, which manages all cached queries in your app. Think of it as a cache manager.

---

## Layer 2: Server-Side (Redis) Invalidation

### Redis Utility Functions

**Location:** `src/lib/cache/redis.ts`

This file provides helper functions to keep Redis logic centralized and reusable:

```typescript
/**
 * Generate cache key for GCash earnings by store
 * Example: "gcash-earnings:550e8400-e29b-41d4-a716-446655440000"
 */
export const getGCashEarningsCacheKey = (storeId: string): string => {
  return `gcash-earnings:${storeId}`;
};

/**
 * Invalidate (delete) GCash earnings cache for a specific store
 * Removes the key from Redis entirely
 */
export const invalidateGCashEarningsCache = async (
  storeId: string,
): Promise<void> => {
  const cacheKey = getGCashEarningsCacheKey(storeId);
  await redis.del(cacheKey);  // ← Deletes from Redis
};

/**
 * Get cached GCash earnings for a store
 * Returns null if key doesn't exist or expired
 */
export const getCachedGCashEarnings = async <T>(storeId: string): Promise<T | null> => {
  const cacheKey = getGCashEarningsCacheKey(storeId);
  return redis.get<T>(cacheKey);
};

/**
 * Set cached GCash earnings for a store with TTL (Time To Live)
 * TTL: 5 minutes by default (data expires after 5 min)
 */
export const setCachedGCashEarnings = async <T>(
  storeId: string,
  data: T,
  ttlSeconds: number = 300, // 5 minutes default
): Promise<void> => {
  const cacheKey = getGCashEarningsCacheKey(storeId);
  await redis.set(cacheKey, data, { ex: ttlSeconds });
};
```

### Usage in API Route

**Location:** `src/app/api/gcash-earning/route.ts`

#### GET Handler (Read with Cache)

```typescript
export async function GET() {
  try {
    const result = await getGCashEarning();  // Get data from service

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: result.status },
      );
    }

    const storeId = (result as any).storeId;

    // ===== CACHE LOOKUP =====
    const cached = await getCachedGCashEarnings(storeId);
    if (cached) {
      // Cache HIT: Return cached data (fast!)
      return NextResponse.json(
        { success: true, message: result.message, data: cached },
        { status: 200 },
      );
    }

    // Cache MISS: Store fresh data in Redis for next request
    await setCachedGCashEarnings(storeId, result.data, 300); // 5 min TTL

    return NextResponse.json(
      { success: true, message: result.message, data: result.data },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}
```

#### POST Handler (Create with Cache Invalidation)

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createGCashEarningSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: `Validation failed: ${formatZodError(parsed.error)}` },
        { status: 400 },
      );
    }

    const result = await createGCashEarning(parsed.data);

    // ===== CACHE INVALIDATION =====
    if (result.success && (result as any).storeId) {
      // Delete the cached data from Redis
      await invalidateGCashEarningsCache((result as any).storeId);
      // Next GET request will fetch fresh data from database
    }

    return NextResponse.json(
      result.success
        ? { success: true, message: result.message, data: result.data }
        : { success: false, message: result.message },
      { status: result.status },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}
```

---

## Complete Flow: Creating a GCash Earning

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER SUBMITS FORM                                        │
│    Form sends: { amount: 500, date: "2024-01-15" }         │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. API POST /api/gcash-earning                              │
│    - Validates input                                        │
│    - Calls createGCashEarning service                       │
│    - Service creates record in database                     │
│    - Service returns { success: true, storeId: "abc123" }  │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. REDIS CACHE INVALIDATION (Server-side)                  │
│    if (result.success && result.storeId) {                 │
│      invalidateGCashEarningsCache(result.storeId)          │
│      // Deletes key: "gcash-earnings:abc123" from Redis    │
│    }                                                        │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. API RESPONSE TO CLIENT                                  │
│    { success: true, message: "Created successfully" }      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. TANSTACK QUERY INVALIDATION (Client-side)               │
│    onSuccess callback fires:                               │
│    - toast.success("GCash earning created successfully")   │
│    - queryClient.invalidateQueries({                       │
│        queryKey: ["gcash-earnings"]                        │
│      })                                                    │
│                                                            │
│    This marks the cached query as "stale"                 │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. AUTO REFETCH (React Query)                               │
│    Since query is marked stale:                            │
│    - TanStack detects the invalidation                     │
│    - Automatically fetches fresh data                      │
│    - Makes GET request to /api/gcash-earning              │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. GET REQUEST WITH REDIS CACHE CHECK                      │
│    - Redis lookup for "gcash-earnings:abc123"              │
│    - CACHE MISS (we just deleted it!)                      │
│    - Query database for fresh data                         │
│    - Store result in Redis (TTL 5 min)                    │
│    - Return fresh data to client                          │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. UI UPDATES WITH FRESH DATA                              │
│    Component re-renders with new GCash earning             │
│    User sees their new entry in the table                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Concepts to Remember

### 1. Cache Keys
```typescript
// Cache keys should be unique and predictable
// Format: "resource:identifier"

"gcash-earnings:550e8400-e29b-41d4-a716-446655440000"  // ✓ Good
"user:123:gcash-earnings"                               // ✓ Also good
"cache_data"                                             // ✗ Too vague
```

### 2. TTL (Time To Live)
```typescript
// How long data stays in cache before expiring

setCachedGCashEarnings(storeId, data, 300)  // 300 seconds = 5 minutes
// After 5 min, Redis automatically deletes the key
// Next request will fetch fresh from database
```

### 3. Cache Layers

| Layer | Technology | Location | TTL | Speed |
|-------|-----------|----------|-----|-------|
| Client | TanStack Query | Browser Memory | 10 min | Instant (in-memory) |
| Server | Redis | Upstash Cloud | 5 min | ~50ms (network) |
| Source | PostgreSQL | Database | ∞ | ~100-500ms (disk I/O) |

### 4. Invalidation Patterns

**Pattern 1: Delete on Mutation**
```typescript
// When something changes, delete the cache immediately
await invalidateGCashEarningsCache(storeId);
// Next request will be fresh
```

**Pattern 2: Time-Based Expiry**
```typescript
// Cache expires automatically after TTL
await setCachedGCashEarnings(storeId, data, 300);
// After 5 min, key is gone (even if not manually deleted)
```

**Pattern 3: Hybrid (What we use)**
```typescript
// Use both:
// - Manual invalidation on mutations (create/update/delete)
// - Automatic expiry as safety net
```

---

## Common Operations

### Invalidate Cache After Create
```typescript
const result = await createGCashEarning(data);
if (result.success) {
  await invalidateGCashEarningsCache(result.storeId);
}
```

### Invalidate Cache After Update
```typescript
const result = await updateGCashEarning(data);
if (result.success) {
  // Get storeId from updated record
  await invalidateGCashEarningsCache(storeId);
}
```

### Invalidate Cache After Delete
```typescript
const result = await deleteGCashEarning(id);
if (result.success) {
  await invalidateGCashEarningsCache(storeId);
}
```

### Query Client Invalidation
```typescript
// Invalidate specific query
queryClient.invalidateQueries({ queryKey: ["gcash-earnings"] });

// Refetch immediately
queryClient.refetchQueries({ queryKey: ["gcash-earnings"] });

// Remove from cache
queryClient.removeQueries({ queryKey: ["gcash-earnings"] });
```

---

## Performance Impact

### Without Caching
```
User Request → Database Query → Return Data
Time: ~200-500ms per request
Cost: Every request hits the database
```

### With Caching (Cache Hit)
```
User Request → TanStack Query Cache (in-memory) → Return Data
Time: ~1-5ms
Cost: No database query
```

### With Caching (Cache Miss)
```
User Request → Redis Check → Database Query → Cache → Return Data
Time: ~100-200ms (includes Redis lookup)
Cost: Single database query, then served from Redis for 5 min
```

### Typical Scenario
```
First request:   200ms (database hit, cached)
Next 299 requests: ~2ms each (cached)
Average latency: ~2ms (dramatic improvement!)
```

---

## Debugging Cache Issues

### Check if cache is working

1. **TanStack DevTools** (Browser)
   - Install React Query DevTools
   - Check query status: "success", "pending", "error"
   - Look for "isFetching" flag

2. **Redis CLI** (Server)
   ```bash
   # Check if key exists
   redis-cli GET gcash-earnings:abc123
   
   # Check TTL
   redis-cli TTL gcash-earnings:abc123
   
   # Delete specific key
   redis-cli DEL gcash-earnings:abc123
   ```

3. **Logs**
   - Add console.log before/after cache operations
   - Track cache hits vs misses

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Stale data persists | Cache not invalidated | Ensure `invalidateGCashEarningsCache()` is called on mutation |
| Data updates but UI doesn't | TanStack query not invalidated | Add `queryClient.invalidateQueries()` in hook |
| Cache grows forever | No TTL set | Set `ex: 300` when calling `redis.set()` |
| High latency | Redis timeout | Check Upstash credentials and network |

---

## Best Practices

✅ **DO:**
- Always invalidate cache after mutations (create/update/delete)
- Use consistent cache key format
- Set appropriate TTL values (not too long, not too short)
- Invalidate in both client and server
- Handle cache invalidation errors gracefully

❌ **DON'T:**
- Cache sensitive user data without expiry
- Forget to invalidate after changes
- Use unpredictable cache keys
- Set TTL too short (causes unnecessary DB hits)
- Set TTL too long (serves stale data)
- Assume cache always works (have fallbacks)

---

## Summary

**Cache invalidation** ensures users always see fresh data by:

1. **Server-Side (Redis)**: Deletes stale data from Redis on POST/PUT/DELETE
2. **Client-Side (TanStack)**: Marks cached queries as stale and triggers refetch
3. **Automatic**: Data expires after TTL even if not manually invalidated

This creates a fast, responsive experience while keeping data consistent!