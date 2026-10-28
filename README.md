<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="100" alt="NestJS Logo" />
</p>

<h1 align="center">NestJS Auth Template</h1>

<p align="center">
  A production-ready authentication starter built with <strong>NestJS 12</strong>, <strong>Drizzle ORM</strong>, <strong>Neon Postgres</strong>, and <strong>JWT</strong>.<br/>
  Batteries-included — register, verify email, login, refresh tokens, password reset, RBAC, and rate limiting out of the box.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-12-ea2845?logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-6-3178c6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Drizzle_ORM-0.45-c5f74f?logo=drizzle&logoColor=black" alt="Drizzle ORM" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-00e599?logo=postgresql&logoColor=white" alt="Neon Postgres" />
  <img src="https://img.shields.io/badge/JWT-Auth-000?logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Vitest-Testing-6e9f18?logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="MIT License" />
</p>

---

## ✨ Features

| Category | Details |
|---|---|
| **Authentication** | Register → Email verification → Login → Logout |
| **JWT Tokens** | Short-lived access token (Bearer) + long-lived refresh token (HTTP-only cookie) |
| **Token Rotation** | Refresh tokens are hashed (bcrypt) and rotated on every refresh |
| **Password Reset** | Forgot password → email link → reset with time-limited token |
| **Email Verification** | Token-based email verification via [Resend](https://resend.com) |
| **Role-Based Access** | `user` / `admin` roles with `@Roles()` decorator and global guard |
| **Rate Limiting** | Global throttle (20 req/min) + stricter limits on login & forgot-password |
| **Input Validation** | DTO validation with `class-validator` (whitelist + forbid non-whitelisted) |
| **Error Handling** | Global exception filter with consistent JSON error responses |
| **API Docs** | Auto-generated Swagger UI at `/api/docs` |
| **Database** | PostgreSQL on [Neon](https://neon.tech) with Drizzle ORM (type-safe, zero-abstraction) |
| **Modern Tooling** | ESM modules, Vitest for testing, oxlint for linting, pnpm |

---

## 📐 Architecture

```
src/
├── main.ts                          # Bootstrap, global pipes/filters, Swagger setup
├── app.module.ts                    # Root module — wires everything + global guards
│
├── auth/                            # Authentication module
│   ├── auth.module.ts
│   ├── auth.controller.ts           # Auth endpoints (register, login, refresh, etc.)
│   ├── auth.service.ts              # Core auth logic (hashing, tokens, verification)
│   ├── email.service.ts             # Transactional emails via Resend
│   └── dto/
│       ├── register.dto.ts
│       ├── login.dto.ts
│       ├── forgot-password.dto.ts
│       └── reset-password.dto.ts
│
├── users/                           # Users module
│   ├── users.module.ts
│   └── users.service.ts             # CRUD operations on the users table
│
├── tasks/                           # Example protected resource
│   ├── tasks.module.ts
│   ├── tasks.controller.ts          # CRUD endpoints (scoped to authenticated user)
│   ├── tasks.service.ts
│   └── dto/
│       └── create-task.dto.ts
│
├── admin/                           # Admin-only module
│   ├── admin.module.ts
│   └── admin.controller.ts          # List/delete users (admin role required)
│
├── common/                          # Shared infrastructure
│   ├── decorators/
│   │   ├── public.decorator.ts      # @Public() — bypasses JWT guard
│   │   ├── roles.decorator.ts       # @Roles('admin') — sets required roles
│   │   └── current-user.decorator.ts# @CurrentUser() — injects authenticated user
│   ├── guards/
│   │   ├── jwt-auth.guard.ts        # Global JWT verification guard
│   │   └── roles.guard.ts           # Global RBAC guard
│   └── filters/
│       └── http-exception.filter.ts # Consistent error response format
│
└── db/                              # Database layer
    ├── index.ts                     # Drizzle + Neon connection
    └── schema.ts                    # Users & Tasks table definitions + types
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 22 (LTS recommended)
- **pnpm** ≥ 9
- A **Neon** database (free tier at [neon.tech](https://neon.tech))
- A **Resend** API key (free tier at [resend.com](https://resend.com))

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/nestjs-auth.git
cd nestjs-auth
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://user:pass@host/db?sslmode=require` |
| `JWT_SECRET` | Secret key for signing access tokens | Generate with `openssl rand -hex 64` |
| `JWT_REFRESH_SECRET` | Secret key for signing refresh tokens | Generate with `openssl rand -hex 64` |
| `JWT_EXPIRES_IN` | Access token lifetime | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifetime | `7d` |
| `RESEND_API_KEY` | API key from [resend.com](https://resend.com/api-keys) | `re_xxxxxxxxx` |
| `APP_URL` | Base URL of the application | `http://localhost:3000` |
| `PORT` | Port the server listens on | `3000` |

### 4. Push the Database Schema

No migrations needed — Drizzle Kit pushes the schema directly to your Neon database:

```bash
pnpm db:push
```

> **Tip:** Use `pnpm db:studio` to open Drizzle Studio and visually browse your database.

### 5. Start the Development Server

```bash
pnpm start:dev
```

The server starts at `http://localhost:3000/api` with Swagger docs at `http://localhost:3000/api/docs`.

---

## 🔑 Authentication Flow

### Registration & Verification

```
POST /api/auth/register       →  Creates user (unverified) + sends verification email
GET  /api/auth/verify-email   →  Verifies token + auto-logs the user in
```

1. User registers with `name`, `email`, `password` (min 8 chars).
2. A verification token (random 32 bytes, hex) is generated with a 24-hour expiry.
3. A verification email is sent asynchronously (fire-and-forget) via Resend.
4. Clicking the email link hits `verify-email?token=...`, which marks the account as verified and returns an access token + sets a refresh token cookie — the user is immediately logged in.

### Login

```
POST /api/auth/login          →  Returns access token + sets refresh cookie
```

1. Validates email/password against bcrypt hash (cost factor 12).
2. Rejects unverified accounts.
3. Returns a short-lived JWT access token in the response body.
4. Sets an HTTP-only `refresh_token` cookie (7-day lifetime).
5. The refresh token hash is stored in the database (bcrypt, cost 10) for server-side validation.

### Token Refresh

```
POST /api/auth/refresh        →  Returns new access token + rotates refresh cookie
```

1. Reads `refresh_token` from cookies.
2. Verifies the JWT signature and expiry.
3. Compares against the hashed refresh token stored in the database.
4. Issues a **new** access token and a **new** refresh token (rotation), invalidating the previous one.

### Logout

```
POST /api/auth/logout         →  Clears refresh token (requires Bearer token)
```

1. Nullifies the `refreshTokenHash` in the database.
2. Clears the `refresh_token` cookie.

### Password Reset

```
POST /api/auth/forgot-password →  Sends reset email (always returns success for security)
POST /api/auth/reset-password  →  Validates token + updates password
```

1. `forgot-password` generates a time-limited reset token (1 hour) and emails a reset link.
2. The response is intentionally generic ("If an account exists...") to prevent user enumeration.
3. `reset-password` validates the token, hashes the new password, and clears the reset token.

---

## 🛡️ Authorization & Guards

Three global guards are applied to **every** route in this order:

| Order | Guard | Purpose |
|---|---|---|
| 1 | `ThrottlerGuard` | Rate limiting (20 req/min globally) |
| 2 | `JwtAuthGuard` | Verifies Bearer token and attaches `user` to request |
| 3 | `RolesGuard` | Checks `@Roles()` metadata against `user.role` |

### Making a Route Public

Use the `@Public()` decorator to bypass JWT authentication:

```typescript
@Public()
@Post('register')
async register(@Body() dto: RegisterDTO) {
  return this.authService.register(dto);
}
```

### Restricting by Role

Use the `@Roles()` decorator to require specific roles:

```typescript
@Roles('admin')
@Get('users')
findAll() {
  return this.userService.findAll();
}
```

### Accessing the Current User

Use the `@CurrentUser()` parameter decorator to inject the full authenticated user:

```typescript
@Get('me')
me(@CurrentUser() user: User) {
  return { id: user.id, email: user.email, name: user.name };
}
```

---

## 📚 API Reference

All endpoints are prefixed with `/api`. Interactive documentation is available at `/api/docs` (Swagger UI).

### Auth Endpoints

| Method | Endpoint | Auth | Rate Limit | Description |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Global | Register a new account |
| `GET` | `/api/auth/verify-email?token=` | Public | Global | Verify email + auto-login |
| `POST` | `/api/auth/login` | Public | 5/min | Authenticate and receive tokens |
| `POST` | `/api/auth/refresh` | Cookie | Global | Refresh access token |
| `POST` | `/api/auth/logout` | Bearer | Global | Log out and invalidate tokens |
| `GET` | `/api/auth/me` | Bearer | Global | Get current user profile |
| `POST` | `/api/auth/forgot-password` | Public | 3/min | Request password reset email |
| `POST` | `/api/auth/reset-password` | Public | Global | Reset password with token |

### Tasks Endpoints (Example Protected Resource)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/tasks` | Bearer | List current user's tasks |
| `POST` | `/api/tasks` | Bearer | Create a new task |
| `PATCH` | `/api/tasks/:id` | Bearer | Update a task (owner only) |
| `DELETE` | `/api/tasks/:id` | Bearer | Delete a task (owner only) |

### Admin Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/admin/users` | Bearer + Admin | List all users |
| `DELETE` | `/api/admin/users/:id` | Bearer + Admin | Delete a user |

---

## 🗄️ Database Schema

The schema is defined with Drizzle ORM in [`src/db/schema.ts`](src/db/schema.ts) and uses two tables:

### `users`

| Column | Type | Notes |
|---|---|---|
| `id` | `UUID` | Primary key (auto-generated) |
| `email` | `TEXT` | Unique, not null |
| `password_hash` | `TEXT` | bcrypt hash (cost 12) |
| `name` | `TEXT` | Not null |
| `role` | `ENUM('user', 'admin')` | Default: `user` |
| `is_verified` | `BOOLEAN` | Default: `false` |
| `verification_token` | `TEXT` | Nullable — set on registration |
| `verification_token_expires_at` | `TIMESTAMP` | Nullable — 24h expiry |
| `reset_token` | `TEXT` | Nullable — set on forgot-password |
| `reset_token_expires_at` | `TIMESTAMP` | Nullable — 1h expiry |
| `refresh_token_hash` | `TEXT` | Nullable — bcrypt hash of current refresh token |
| `created_at` | `TIMESTAMP` | Auto-set |
| `updated_at` | `TIMESTAMP` | Auto-set, updated on mutation |

### `tasks`

| Column | Type | Notes |
|---|---|---|
| `id` | `UUID` | Primary key (auto-generated) |
| `title` | `TEXT` | Not null |
| `description` | `TEXT` | Optional |
| `status` | `ENUM('todo', 'in_progress', 'done')` | Default: `todo` |
| `user_id` | `UUID` | Foreign key → `users.id` (cascade delete) |
| `created_at` | `TIMESTAMP` | Auto-set |
| `updated_at` | `TIMESTAMP` | Auto-set |

---

## 🔒 Security Highlights

- **Passwords** are hashed with bcrypt (cost factor 12) — never stored in plain text.
- **Refresh tokens** are hashed (bcrypt, cost 10) before storage — a database leak does not expose usable tokens.
- **Refresh token rotation** — every refresh issues a new token pair, invalidating the old refresh token.
- **HTTP-only cookies** — refresh tokens are stored in `httpOnly`, `sameSite: lax` cookies, immune to XSS.
- **Secure cookies** in production — the `secure` flag is automatically enabled when `NODE_ENV=production`.
- **Token expiry** — access tokens are short-lived (default 15m), refresh tokens expire in 7 days.
- **Rate limiting** — 5 attempts/min on login, 3 attempts/min on forgot-password to prevent brute-force.
- **User enumeration prevention** — forgot-password returns a generic message regardless of whether the email exists.
- **Validation whitelist** — `forbidNonWhitelisted: true` rejects payloads with unexpected fields.
- **Verification tokens** expire after 24 hours; reset tokens expire after 1 hour.
- **Cascading deletes** — deleting a user automatically removes their tasks.

---

## 🧪 Testing

The project uses [Vitest](https://vitest.dev/) as the test runner:

```bash
# Run unit tests
pnpm test

# Run in watch mode
pnpm test:watch

# Run with coverage
pnpm test:cov

# Run end-to-end tests
pnpm test:e2e
```

---

## 📦 Available Scripts

| Script | Description |
|---|---|
| `pnpm start` | Start the application |
| `pnpm start:dev` | Start in watch mode (development) |
| `pnpm start:debug` | Start in debug mode with watch |
| `pnpm start:prod` | Run the compiled production build |
| `pnpm build` | Compile the project |
| `pnpm db:push` | Push schema to database (no migration files) |
| `pnpm db:studio` | Open Drizzle Studio (visual DB browser) |
| `pnpm db:generate` | Generate migration files |
| `pnpm db:migrate` | Run pending migrations |
| `pnpm lint` | Lint source and test files with oxlint |
| `pnpm format` | Format code with Prettier |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run end-to-end tests |
| `pnpm test:cov` | Run tests with coverage report |

---

## 🧩 Extending the Template

This template is designed to be forked and extended. Here are some ideas:

- **Add OAuth** — integrate Google/GitHub sign-in with Passport.js strategies
- **Email templates** — replace inline HTML with a template engine (e.g., React Email, MJML)
- **Account lockout** — lock accounts after N failed login attempts
- **Two-factor authentication (2FA)** — add TOTP support with `otplib`
- **Audit logging** — track login events, password changes, and admin actions
- **File uploads** — add profile avatar support with S3/Cloudflare R2
- **Caching** — integrate Redis for session management and rate limiting
- **WebSockets** — add real-time capabilities with NestJS gateways

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [NestJS 12](https://nestjs.com/) | Backend framework |
| [TypeScript 6](https://www.typescriptlang.org/) | Type safety |
| [Drizzle ORM](https://orm.drizzle.team/) | Type-safe SQL query builder |
| [Neon](https://neon.tech/) | Serverless PostgreSQL |
| [JWT](https://jwt.io/) | Stateless authentication |
| [bcryptjs](https://github.com/nicolo-ribaudo/bcrypt.js) | Password & token hashing |
| [Resend](https://resend.com/) | Transactional email delivery |
| [Swagger](https://swagger.io/) | Auto-generated API documentation |
| [Vitest](https://vitest.dev/) | Unit & e2e test runner |
| [oxlint](https://oxc-project.github.io/docs/guide/usage/linter.html) | Fast Rust-based linter |
| [Prettier](https://prettier.io/) | Code formatting |
| [pnpm](https://pnpm.io/) | Fast, disk-efficient package manager |

---

## 📄 License

This project is [MIT licensed](LICENSE).
