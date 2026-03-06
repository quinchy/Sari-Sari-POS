# Products Feature

Manage product inventory and stock levels for your store.

## Overview

> **Note**: This feature is currently under development.

- **Product List**: View all products
- **Add Product**: Create new product entries
- **Stock Management**: Track inventory levels
- **Search**: Find products quickly

---

## Repositories Used

| Repository | Database Table | Description |
|------------|----------------|-------------|
| `repositories/product.ts` | `Product` | Product CRUD (placeholder) |

---

## File Structure

```
features/products/
└── components/
    └── products-toolbar.tsx    # Product list toolbar
```

---

## Current Implementation

### Components

#### `products-toolbar.tsx`
- Search input (UI placeholder)
- Add product button (opens GCashEarningForm - placeholder)

---

## Planned Structure

```
features/products/
├── apis/
│   └── products.ts              # Client-side API wrappers
├── components/
│   ├── products-table.tsx       # Product data table
│   ├── products-form.tsx       # Create/edit form
│   └── products-toolbar.tsx    # Toolbar actions
├── hooks/
│   └── use-products.ts         # React Query hooks
├── services/
│   └── products.ts             # Business logic
├── types/
│   └── products.ts             # TypeScript types
└── validation/
    └── products.ts             # Zod validation schemas
```

---

## API Routes (Planned)

| Method | Endpoint | Handler |
|--------|----------|---------|
| GET | `/api/products` | List products |
| POST | `/api/products` | Create product |
| PUT | `/api/products` | Update product |
| DELETE | `/api/products` | Delete product |

---

## Repository (`repositories/product.ts`)

Currently empty - placeholder for future implementation.

---

## Next Steps

1. Create product API routes in `app/api/products/`
2. Create product service layer
3. Create product types and validation
4. Implement CRUD operations in repository
5. Build product table and form components
6. Add React Query hooks

---

## Related Features

The GCash Earning form is currently reused as a placeholder in the products page. This will be replaced with a dedicated product form once the feature is fully implemented.
