# 🔧 Troubleshooting Guide - CoffeeForFeedback

## Common Issues & Solutions

### 🗄️ Database Issues

#### Error: "Can't reach database server"
**Problem:** Database connection failed

**Solutions:**
1. Check your `DATABASE_URL` in `.env`
2. Verify Supabase database is running (check dashboard)
3. Make sure you're using the **connection pooling** URL, not direct connection
4. Check if your IP is whitelisted (Supabase allows all by default)

**Test connection:**
```bash
npx prisma db pull
```

#### Error: "Database schema not in sync"
**Problem:** Prisma schema doesn't match database

**Solutions:**
```bash
# Push schema to database
npx prisma db push

# Or run migrations
npx prisma migrate deploy

# Regenerate Prisma client
npx prisma generate
```

#### Error: "Prisma Client not generated"
**Problem:** `@prisma/client` module not found

**Solutions:**
```bash
# Generate Prisma Client
npx prisma generate

# Restart your development server
npm run dev
```

---

### 🔐 Authentication Issues

#### Error: "redirect_uri_mismatch"
**Problem:** Google OAuth redirect URL doesn't match

**Solutions:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. APIs & Services → Credentials
3. Edit your OAuth 2.0 Client
4. Add authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   https://your-app.vercel.app/api/auth/callback/google
   ```
5. Save and wait 5 minutes for changes to propagate

#### Error: "Invalid client_id or client_secret"
**Problem:** Google OAuth credentials are wrong

**Solutions:**
1. Double-check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`
2. Make sure there are no extra spaces or quotes
3. Regenerate credentials if needed

#### Error: "NextAuth configuration error"
**Problem:** NextAuth environment variables missing

**Solutions:**
```bash
# Generate a new secret
openssl rand -base64 32

# Add to .env
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"  # or your Vercel URL
```

---

### 💳 Stripe Issues

#### Error: "No such payment_intent"
**Problem:** Stripe test mode vs live mode mismatch

**Solutions:**
1. Make sure you're using **test** API keys (start with `sk_test_`)
2. Use test credit card: `4242 4242 4242 4242`
3. Check Stripe dashboard → Developers → Webhooks

#### Webhook not receiving events
**Problem:** Stripe can't reach your webhook endpoint

**Solutions for Local Development:**
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Use the webhook signing secret shown
```

**Solutions for Production:**
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-app.vercel.app/api/stripe/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.failed`
4. Copy webhook signing secret to Vercel environment variables

---

### 🚀 Vercel Deployment Issues

#### Error: "Build failed"
**Problem:** Deployment failing on Vercel

**Solutions:**
1. Check build logs in Vercel dashboard
2. Make sure all environment variables are set
3. Verify `postinstall` script in package.json:
   ```json
   "postinstall": "prisma generate"
   ```

#### Error: "Module not found: @prisma/client"
**Problem:** Prisma Client not generated during build

**Solutions:**
1. Add to `package.json`:
   ```json
   "scripts": {
     "postinstall": "prisma generate",
     "build": "prisma generate && next build"
   }
   ```
2. Redeploy

#### Database migrations not running
**Problem:** Database schema out of sync in production

**Solutions:**
```bash
# Use Vercel CLI
vercel env pull .env.production
npx prisma migrate deploy

# Or set up automatic migrations in vercel.json
```

#### Error: "Function execution timeout"
**Problem:** API route taking too long

**Solutions:**
1. Optimize database queries (add indexes)
2. Use connection pooling (already configured with Supabase)
3. Check for infinite loops in code
4. Upgrade to Vercel Pro for longer timeouts

---

### 🎨 UI/Frontend Issues

#### Styles not loading
**Problem:** Tailwind CSS not working

**Solutions:**
1. Restart dev server: `npm run dev`
2. Clear `.next` folder: `rm -rf .next`
3. Reinstall dependencies: `rm -rf node_modules && npm install`

#### Components not rendering
**Problem:** TypeScript errors or imports failing

**Solutions:**
1. Check browser console for errors
2. Verify all imports are correct
3. Run TypeScript check: `npx tsc --noEmit`

#### "Hydration failed" error
**Problem:** Server-rendered HTML doesn't match client

**Solutions:**
1. Don't use `localStorage` or `window` in components during first render
2. Use `useEffect` for client-side only code
3. Check for conditional rendering based on client-only state

---

### 📊 Performance Issues

#### Slow page loads
**Problem:** Pages taking too long to load

**Solutions:**
1. Add database indexes (already configured in schema)
2. Use `loading.tsx` files for better UX
3. Implement pagination for large lists
4. Check Vercel Analytics for slow queries

#### Database connection pool exhausted
**Problem:** Too many concurrent database connections

**Solutions:**
1. Use Supabase connection pooling URL (already configured)
2. Limit concurrent requests
3. Check for connection leaks (missing `prisma.$disconnect()`)

---

### 🐛 Debug Mode

#### Enable detailed logging

**Development:**
```bash
# Add to .env.local
DATABASE_URL="postgresql://...?connection_limit=5&pool_timeout=30"
NEXT_PUBLIC_DEBUG="true"
```

**Check Prisma queries:**
```typescript
// In prisma.ts
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})
```

#### View runtime logs

**Vercel:**
1. Go to project → Deployments
2. Click deployment → Runtime Logs
3. Filter by time/severity

**Supabase:**
1. Go to project → Database
2. Click "Logs" tab
3. View query logs

---

### 📧 Email Issues (Future)

#### Emails not sending
**Problem:** Email service not configured

**Solutions:**
1. For MVP, emails are not required
2. For production, use Resend or SendGrid
3. Add environment variables:
   ```
   EMAIL_FROM="noreply@yourdomain.com"
   EMAIL_SERVER_HOST="smtp.sendgrid.net"
   EMAIL_SERVER_USER="apikey"
   EMAIL_SERVER_PASSWORD="your-api-key"
   ```

---

### 🔍 Debugging Checklist

When something goes wrong:

- [ ] Check browser console for errors
- [ ] Check Vercel runtime logs
- [ ] Check Supabase database logs
- [ ] Verify all environment variables are set
- [ ] Test API endpoints with Postman/curl
- [ ] Check Prisma Studio for data: `npx prisma studio`
- [ ] Verify database schema is synced: `npx prisma db pull`
- [ ] Clear cache and restart: `rm -rf .next && npm run dev`

---

### 🆘 Still Stuck?

#### Get help:
1. **Check the code** - All files have comments explaining logic
2. **Read the docs**:
   - Next.js: https://nextjs.org/docs
   - Prisma: https://prisma.io/docs
   - NextAuth: https://next-auth.js.org
   - Stripe: https://stripe.com/docs
3. **Search GitHub Issues** for similar problems
4. **Ask in communities**:
   - Next.js Discord
   - Prisma Slack
   - Reddit r/nextjs

#### Common patterns to check:

**API Route Template:**
```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    // Your logic here

    return Response.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
```

**Database Query Template:**
```typescript
const result = await prisma.project.findMany({
  where: { status: 'ACTIVE' },
  include: {
    creator: { select: { name: true } },
    _count: { select: { applications: true } }
  },
  orderBy: { createdAt: 'desc' },
  take: 10,
})
```

---

## 💡 Pro Tips

1. **Always check logs first** - 90% of issues show up in logs
2. **Use TypeScript** - Catch errors before runtime
3. **Test locally** - Don't debug in production
4. **One change at a time** - Easier to identify issues
5. **Git commit often** - Easy to rollback bad changes

---

## ✅ Health Check Script

Run this to verify everything is working:

```bash
#!/bin/bash
echo "🏥 Running health checks..."

echo "1. Node.js version..."
node --version

echo "2. Database connection..."
npx prisma db pull > /dev/null 2>&1 && echo "✅ Connected" || echo "❌ Failed"

echo "3. Prisma Client..."
npx prisma validate && echo "✅ Valid" || echo "❌ Invalid"

echo "4. Environment variables..."
[ -f .env ] && echo "✅ .env exists" || echo "❌ Missing .env"

echo "5. Dependencies..."
npm list --depth=0 > /dev/null 2>&1 && echo "✅ Installed" || echo "❌ Missing dependencies"

echo ""
echo "Health check complete!"
```

Save as `health-check.sh`, make executable: `chmod +x health-check.sh`

---

**Remember: Most issues are configuration, not code. Check your environment variables first!**
