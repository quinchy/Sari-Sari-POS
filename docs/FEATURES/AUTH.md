# Authentication Feature

Handles user authentication, account management, and store creation.

## Overview

- **Sign Up**: Create account, set up first store
- **Sign In**: Authenticate with email/password
- **Session**: Manage user session via Supabase Auth

---

## Repositories Used

| Repository | Database Table | Description |
|------------|----------------|-------------|
| `repositories/user.ts` | `User` | User account management |
| `repositories/store.ts` | `Store` | Store CRUD operations |
| `repositories/store-member.ts` | `StoreMember` | User-store relationship |

---

## File Structure

```
features/auth/
├── apis/
│   └── auth.ts              # Client-side API wrappers
├── components/
│   ├── account-form.tsx     # Account management form
│   ├── sign-in-form.tsx    # Sign in form
│   └── store-form.tsx      # Store creation form
├── hooks/
│   └── use-auth.ts         # Auth React hooks
├── services/
│   └── auth.ts             # Auth business logic
├── store/
│   └── use-signup-store.ts # Signup state (Zustand)
├── types/
│   └── auth.ts             # Auth types
└── validations/
    └── auth.ts             # Zod validation schemas
```

---

## API Routes

| Method | Endpoint | Handler |
|--------|----------|---------|
| POST | `/api/auth/sign-up` | Create account + store |
| POST | `/api/auth/sign-in` | Authenticate user |
| POST | `/api/auth/sign-out` | Sign out |
| GET | `/api/auth/current-user` | Get current session |

---

## Client API (`features/auth/apis/auth.ts`)

```typescript
// Sign up with account and store
signUp(data: SignUpInput): Promise<AuthResponse>

// Sign in
signIn(data: SignInInput): Promise<AuthResponse>

// Sign out
signOut(): Promise<void>

// Get current user
getCurrentUser(): Promise<CurrentUserResponse>
```

---

## Services (`features/auth/services/auth.ts`)

### `signUp(data)`
1. Validate input
2. Create Supabase auth user
3. Create store in database
4. Return session + store info

### `signIn(data)`
1. Validate input
2. Authenticate with Supabase
3. Return session + store info

### `getCurrentUser()`
1. Get session from Supabase
2. Fetch user profile from database
3. Return user + current store

---

## Types (`features/auth/types/auth.ts`)

```typescript
interface User {
  id: string;
  email: string;
  currentStoreId?: string;
}

interface Store {
  id: string;
  name: string;
  description?: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    store: Store;
  };
}
```

---

## State Management

### Signup Flow (Zustand)
`features/auth/store/use-signup-store.ts`

Manages multi-step signup state:
- Step 1: Account details
- Step 2: Store details

---

## Validation (`features/auth/validations/auth.ts`)

```typescript
// Sign up schema
const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  storeName: z.string().min(1),
});

// Sign in schema
const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
```
