# API Reference

## Authentication API

### Sign Up

Create a new user account and store.

| Property | Value |
|----------|-------|
| Method | `POST` |
| Endpoint | `/api/auth/sign-up` |

#### Request Body

```typescript
{
  email: string;      // User email
  password: string;   // User password (min 6 chars)
  storeName: string; // Name of the store
}
```

#### Response

```typescript
{
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      email: string;
      currentStoreId: string;
    };
    session: {
      access_token: string;
      refresh_token: string;
    };
  };
}
```

---

### Sign In

Authenticate an existing user.

| Property | Value |
|----------|-------|
| Method | `POST` |
| Endpoint | `/api/auth/sign-in` |

#### Request Body

```typescript
{
  email: string;
  password: string;
}
```

#### Response

```typescript
{
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      email: string;
      currentStoreId: string;
    };
    session: {
      access_token: string;
      refresh_token: string;
    };
  };
}
```

---

### Sign Out

Sign out the current user.

| Property | Value |
|----------|-------|
| Method | `POST` |
| Endpoint | `/api/auth/sign-out` |

#### Response

```typescript
{
  success: boolean;
  message: string;
}
```

---

### Get Current User

Get the currently authenticated user.

| Property | Value |
|----------|-------|
| Method | `GET` |
| Endpoint | `/api/auth/current-user` |

#### Response

```typescript
{
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      email: string;
      currentStoreId: string | null;
    };
  };
}
```

---

## GCash Earning API

### List Earnings

Get a list of GCash earnings, optionally filtered or paginated.

| Property | Value |
|----------|-------|
| Method | `GET` |
| Endpoint | `/api/gcash-earning` |

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | `number` | Page number (1-indexed) |
| `limit` | `number` | Items per page |
| `year` | `number` | Filter by year |
| `month` | `number` | Filter by month (1-12) |

#### Response

```typescript
{
  success: boolean;
  message: string;
  data: GCashEarningResponse[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

#### GCashEarningResponse

```typescript
{
  id: string;
  storeId: string;
  amount: number;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}
```

---

### Create Earning

Create a new GCash earning record.

| Property | Value |
|----------|-------|
| Method | `POST` |
| Endpoint | `/api/gcash-earning` |

#### Request Body

```typescript
{
  amount: number;      // Amount (1 - 1,000,000)
  date?: string;       // ISO datetime string (optional)
}
```

#### Response

```typescript
{
  success: boolean;
  message: string;
  data?: {
    id: string; // Created earning ID
  };
}
```

---

### Update Earning

Update an existing GCash earning record.

| Property | Value |
|----------|-------|
| Method | `PUT` |
| Endpoint | `/api/gcash-earning` |

#### Request Body

```typescript
{
  id: string;          // Earning UUID
  amount?: number;     // New amount (optional)
  date?: string;       // New date (optional)
}
```

#### Response

```typescript
{
  success: boolean;
  message: string;
  data?: {
    id: string; // Updated earning ID
  };
}
```

---

### Delete Earning

Delete a GCash earning record.

| Property | Value |
|----------|-------|
| Method | `DELETE` |
| Endpoint | `/api/gcash-earning` |

#### Request Body

```typescript
{
  id: string; // Earning UUID
}
```

#### Response

```typescript
{
  success: boolean;
  message: string;
  data?: {
    id: string; // Deleted earning ID
  };
}
```

---

### Get Total

Get the total sum of all GCash earnings for the current store.

| Property | Value |
|----------|-------|
| Method | `GET` |
| Endpoint | `/api/gcash-earning/total` |

#### Response

```typescript
{
  success: boolean;
  message: string;
  data: number; // Total amount
}
```

---

### Get Extreme

Get the highest or lowest GCash earning for the current store.

| Property | Value |
|----------|-------|
| Method | `GET` |
| Endpoint | `/api/gcash-earning/extreme` |

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | `"highest" \| "lowest"` | Type of extreme to fetch |

#### Response

```typescript
{
  success: boolean;
  message: string;
  data: {
    id: string;
    amount: number;
    created_at: string;
  };
}
```

---

## Error Responses

All API endpoints may return error responses in the following format:

```typescript
{
  success: false;
  message: string; // Error description
}
```

### Common Status Codes

| Code | Description |
|------|-------------|
| `400` | Bad Request - Invalid input |
| `401` | Unauthorized - Not authenticated |
| `404` | Not Found - Resource doesn't exist |
| `409` | Conflict - Duplicate entry |
| `500` | Internal Server Error |
