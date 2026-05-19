# Deployment

## Environment Variables

| Variable | Required | Description | Source |
|---|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string for Prisma | Your PostgreSQL provider (e.g. Neon, Railway, AWS RDS, or local) |
| `NEXTAUTH_SECRET` | Yes | Random string used to encrypt NextAuth JWT tokens and session cookies | Generate with: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Yes | Canonical URL of your deployed site (e.g. `https://your-app.vercel.app`) | Your deployment URL |
| `RESEND_API_KEY` | Yes | API key for sending transactional emails via Resend | [Resend Dashboard](https://resend.com/api-keys) |
| `EMAIL_FROM` | No | Sender email address for outgoing emails | Default: `onboarding@resend.dev` (Resend test sender) |
| `UPSTASH_REDIS_REST_URL` | Yes | REST URL for Upstash Redis instance (rate limiting) | [Upstash Console](https://console.upstash.com) |
| `UPSTASH_REDIS_REST_TOKEN` | Yes | REST token for Upstash Redis instance | [Upstash Console](https://console.upstash.com) |

## Deployment to Vercel

1. Push the repository to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Set the following build settings (auto-detected for Next.js):
   - **Framework**: Next.js
   - **Build Command**: `npx prisma generate && next build`
   - **Output Directory**: `.next`
4. Add all environment variables from the table above in the Vercel project settings.
5. Deploy.

> **Note**: Prisma migrations must be run separately against your production database. After deploying, run:
> ```
> npx prisma migrate deploy
> ```
> Or use Prisma Migrate as part of your CI/CD pipeline.

## Post-Deployment Checklist

- [ ] Environment variables are set in Vercel project settings
- [ ] Prisma migrations have been applied to the production database
- [ ] Resend domain has been verified (configure Resend's SPF/DKIM for your domain)
- [ ] Upstash Redis instance is running with rate limit data populated
- [ ] NEXTAUTH_URL matches the production domain exactly (no trailing slash)
- [ ] NEXTAUTH_SECRET is a strong random string unique to production
