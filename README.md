# SecureGate

A standalone, production-ready authentication system built with Next.js 14. This is not a full product — it is a focused auth layer that demonstrates deep understanding of identity and access management.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL via Prisma ORM
- **Authentication**: NextAuth.js (Credentials provider, JWT strategy)
- **Password Hashing**: bcryptjs (12 salt rounds)
- **Email**: Resend + React Email templates
- **Validation**: Zod (server-side)
- **Rate Limiting**: Upstash Redis (sliding window)
- **Styling**: Tailwind CSS (dark theme)
- **Deployment**: Vercel

## Features

- Email + password sign up with email verification
- Secure login with rate limiting (5 attempts / 10 min)
- Password reset flow (3 attempts / 15 min)
- Session management via JWT (stateless)
- Account verification enforcement
- Input validation on every endpoint
- Security headers (X-Frame-Options, HSTS, CSP-compatible)
- Enterprise dark-theme UI

## Local Setup

### Prerequisites

- Node.js 18+
- PostgreSQL (running locally or remote)
- Redis via Upstash (free tier works)
- Resend account (free tier works)

### Installation

```bash
npm install
```

### Environment Variables

Copy the template and fill in your values:

```bash
cp .env.local .env
```

Required variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random string for JWT encryption |
| `NEXTAUTH_URL` | Your local URL (e.g. `http://localhost:3000`) |
| `RESEND_API_KEY` | Resend API key for sending emails |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token |

### Database

```bash
npx prisma migrate dev --name init
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
├── app/                    # App Router routes and pages
│   ├── api/auth/           # All auth API endpoints
│   ├── dashboard/          # Protected dashboard
│   ├── login/              # Sign in page
│   ├── signup/             # Registration page
│   ├── forgot-password/    # Password reset request
│   ├── reset-password/     # Password reset form
│   └── verify-email/       # Email verification
├── components/             # Reusable UI components
├── emails/                 # React Email templates
├── lib/                    # Auth config, Prisma client, rate limiters
├── prisma/                 # Schema and migrations
└── middleware.ts           # Route protection
```

## Security

- Passwords are hashed with bcrypt at 12 salt rounds
- JWT session strategy (no session database table needed)
- Rate limiting on login (5/10m) and password reset (3/15m)
- Generic error messages never reveal whether an email is registered
- Email verification required before first login
- Verification and reset tokens are single-use, deleted after expiry
- All inputs validated server-side with Zod
- Security headers set via Next.js config
