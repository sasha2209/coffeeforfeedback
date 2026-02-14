# CoffeeForFeedback - Complete Implementation Guide

## 🚀 Quick Deploy (Free!)

**Want to deploy immediately with zero cost?**

### Option 1: One-Click Deploy to Vercel
Follow the complete step-by-step guide in **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**

**Total time:** 15 minutes | **Cost:** ₹0/month

You'll get:
- ✅ Live website (Vercel free tier)
- ✅ PostgreSQL database (Supabase free tier)
- ✅ SSL certificate (automatic)
- ✅ Auto-deploys on git push

### Option 2: Local Development
```bash
chmod +x setup.sh
./setup.sh
```

---

## 🎯 What You're Building

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Google OAuth credentials
- Stripe account (test mode)

### Setup Steps

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your actual credentials

# 3. Initialize database
npx prisma db push
npx prisma generate

# 4. Run development server
npm run dev

# Visit http://localhost:3000
```

---

## 📁 Project Structure

```
coffeeforfeedback/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Sample data (to create)
├── public/                    # Static assets
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/  # NextAuth endpoints
│   │   │   ├── projects/            # Project CRUD APIs
│   │   │   ├── applications/        # Application APIs
│   │   │   ├── stripe/              # Payment webhooks
│   │   │   └── admin/               # Admin APIs
│   │   ├── browse/             # Browse projects page
│   │   ├── projects/
│   │   │   ├── new/            # Create project
│   │   │   └── [id]/           # Project details
│   │   ├── dashboard/          # User dashboard
│   │   ├── profile/            # User profile
│   │   ├── admin/              # Admin panel
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing page
│   │   ├── globals.css         # Global styles
│   │   └── providers.tsx       # Context providers
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── navigation.tsx      # Nav bar
│   │   ├── create-project-form.tsx
│   │   ├── project-card.tsx
│   │   ├── application-modal.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── prisma.ts           # Prisma client
│   │   ├── auth.ts             # NextAuth config
│   │   ├── stripe.ts           # Stripe helpers (to create)
│   │   └── utils.ts            # Utilities
│   └── types/
│       └── index.ts            # TypeScript types
├── .env.example
├── package.json
└── README.md
```

---

## 🗄️ Database Schema

**Key Models:**
- **User**: Authentication + role (PROFESSIONAL/FOUNDER/ADMIN)
- **Profile**: Extended user info (bio, skills, ratings)
- **Project**: Interview requests with escrow
- **Application**: Professionals applying to projects
- **Interview**: Scheduled interviews with status
- **Payment**: Escrow and payouts
- **Wallet**: User balances
- **Review**: Two-way ratings
- **Dispute**: Conflict resolution

**Escrow Flow:**
```
1. Founder creates project (DRAFT status)
2. Founder pays → Stripe → Project (ACTIVE status)
3. Escrow held in Project.escrowAmount
4. Professionals apply
5. Founder selects → Interview created (SCHEDULED)
6. Interview completed → Payment released (24h dispute window)
7. Professional receives payout to Wallet
```

---

## 🔌 API Routes to Implement

### Projects
```typescript
// src/app/api/projects/create/route.ts
POST /api/projects/create
- Body: { title, description, targetPersona, duration, pool, participants }
- Action: Create project in DRAFT status
- Return: Project object

// src/app/api/projects/[id]/fund/route.ts
POST /api/projects/[id]/fund
- Body: { paymentMethodId }
- Action: Create Stripe PaymentIntent → Update project to ACTIVE
- Return: { success, clientSecret }

// src/app/api/projects/[id]/route.ts
GET /api/projects/[id]
- Return: Project with applications and interviews
```

### Applications
```typescript
// src/app/api/applications/create/route.ts
POST /api/applications/create
- Body: { projectId, coverLetter, availability }
- Action: Create application (PENDING status)
- Return: Application object

// src/app/api/applications/[id]/accept/route.ts
POST /api/applications/[id]/accept
- Action: Accept application → Create interview
- Return: Interview object

// src/app/api/applications/[id]/reject/route.ts
POST /api/applications/[id]/reject
- Action: Update status to REJECTED
- Return: { success }
```

### Interviews
```typescript
// src/app/api/interviews/[id]/complete/route.ts
POST /api/interviews/[id]/complete
- Body: { meetingLink, scheduledAt }
- Action: Update interview status to COMPLETED
- Trigger: Start 24h payout timer

// src/app/api/interviews/[id]/payout/route.ts
POST /api/interviews/[id]/payout
- Action: Release escrow → Transfer to professional wallet
- Update: PayoutStatus to RELEASED
- Return: { success, payment }
```

### Stripe
```typescript
// src/app/api/stripe/webhook/route.ts
POST /api/stripe/webhook
- Handle: payment_intent.succeeded
- Handle: payment_intent.failed
- Handle: transfer.created
- Verify: Stripe signature
```

### Admin
```typescript
// src/app/api/admin/users/route.ts
GET /api/admin/users
- Return: All users with stats

// src/app/api/admin/disputes/route.ts
GET /api/admin/disputes
- Return: All disputes
POST /api/admin/disputes/[id]/resolve
- Body: { resolution, action }
```

---

## 💳 Stripe Integration

### Setup
```bash
npm install stripe @stripe/stripe-js
```

### Create Stripe Helper (`src/lib/stripe.ts`)
```typescript
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// Create PaymentIntent for escrow
export async function createEscrowPayment(
  amount: number, // in paise
  projectId: string
) {
  return await stripe.paymentIntents.create({
    amount,
    currency: 'inr',
    metadata: { projectId },
    capture_method: 'automatic',
  })
}

// Transfer to professional (Stripe Connect)
export async function transferToProfessional(
  amount: number,
  professionalStripeId: string,
  interviewId: string
) {
  return await stripe.transfers.create({
    amount,
    currency: 'inr',
    destination: professionalStripeId,
    metadata: { interviewId },
  })
}
```

### Webhook Handler
```typescript
// src/app/api/stripe/webhook/route.ts
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return new Response(`Webhook Error`, { status: 400 })
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object
      // Update project status to ACTIVE
      break
    
    case 'transfer.created':
      const transfer = event.data.object
      // Update payout status to RELEASED
      break
  }

  return new Response(JSON.stringify({ received: true }))
}
```

---

## 🎨 Additional Components Needed

### UI Components
Create these in `src/components/ui/`:
- `card.tsx` - Card container
- `input.tsx` - Form input
- `textarea.tsx` - Text area
- `select.tsx` - Dropdown select
- `dialog.tsx` - Modal dialog
- `badge.tsx` - Status badges
- `avatar.tsx` - User avatar
- `skeleton.tsx` - Loading states
- `toast.tsx` - Notifications

### Feature Components
Create these in `src/components/`:
- `project-card.tsx` - Display project summary
- `application-modal.tsx` - Apply to project
- `interview-scheduler.tsx` - Schedule calendar
- `rating-form.tsx` - Submit review
- `dispute-form.tsx` - Report issue
- `wallet-widget.tsx` - Show balance
- `transaction-list.tsx` - Transaction history

---

## 📄 Pages to Implement

### Dashboard
```typescript
// src/app/dashboard/page.tsx
- Show user's role-based dashboard
- Founders: Projects, interviews, payments
- Professionals: Applications, upcoming interviews, earnings
- Quick stats, recent activity
```

### Project Detail
```typescript
// src/app/projects/[id]/page.tsx
- Full project description
- Application form (if professional)
- Applicants list (if founder)
- Interview schedule
- Payment status
```

### Profile
```typescript
// src/app/profile/page.tsx
- Edit professional profile
- Skills, experience, bio
- LinkedIn verification
- Portfolio/past interviews
- Ratings and reviews
```

### Admin Panel
```typescript
// src/app/admin/page.tsx
- User management
- Project moderation
- Dispute resolution
- Platform stats
- Escrow balances
```

---

## 🔐 Authentication Flow

1. **Sign Up/In:**
   - Google OAuth via NextAuth
   - Create User + Profile records
   - Default role: PROFESSIONAL

2. **Role Switching:**
   - Users can be both FOUNDER and PROFESSIONAL
   - Create separate "role selector" in dashboard

3. **Protected Routes:**
```typescript
// Middleware example
export { default } from "next-auth/middleware"

export const config = {
  matcher: ['/dashboard/:path*', '/projects/new'],
}
```

---

## 🧪 Seed Data

Create `prisma/seed.ts`:
```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create test users
  const founder = await prisma.user.create({
    data: {
      email: 'founder@test.com',
      name: 'Test Founder',
      role: 'FOUNDER',
      profile: {
        create: {
          headline: 'Startup Founder',
        },
      },
    },
  })

  const professional = await prisma.user.create({
    data: {
      email: 'pro@test.com',
      name: 'Test Professional',
      role: 'PROFESSIONAL',
      profile: {
        create: {
          headline: 'Product Manager at Tech Co',
          skills: ['SaaS', 'B2B', 'Product Management'],
          yearsExperience: 5,
        },
      },
    },
  })

  // Create test project
  const project = await prisma.project.create({
    data: {
      creatorId: founder.id,
      title: 'B2B SaaS User Interviews',
      description: 'Looking for product managers to validate our new feature',
      targetPersona: 'Product Managers at B2B SaaS companies',
      interviewDuration: 30,
      totalPoolAmount: 500000, // ₹5000 in paise
      numParticipants: 5,
      perParticipantPay: 100000, // ₹1000 in paise
      status: 'ACTIVE',
      escrowPaid: true,
    },
  })

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Run with: `npm run db:seed`

---

## 🚦 Testing Checklist

### Core Flows
- [ ] User can sign up/in with Google
- [ ] Founder can create project
- [ ] Founder can fund project via Stripe (test mode)
- [ ] Professional can browse active projects
- [ ] Professional can apply to project
- [ ] Founder can view applications
- [ ] Founder can accept/reject applications
- [ ] Interview is created on acceptance
- [ ] Founder can schedule interview (add Google Meet link)
- [ ] Founder can mark interview complete
- [ ] Payment is released after 24h
- [ ] Professional sees payout in wallet
- [ ] Two-way reviews work
- [ ] Dispute can be filed
- [ ] Admin can view/resolve disputes

### Edge Cases
- [ ] What if <3 people apply? (Refund policy)
- [ ] No-show protection
- [ ] Duplicate applications prevented
- [ ] Escrow insufficient for all participants
- [ ] Stripe payment failures

---

## 🎯 MVP Feature Checklist

### ✅ Implemented
- [x] Database schema
- [x] Authentication (NextAuth + Google)
- [x] Landing page
- [x] Browse projects page
- [x] Create project page
- [x] Navigation component
- [x] Basic UI components
- [x] Utility functions

### 🚧 To Implement (Priority Order)

1. **High Priority:**
   - [ ] API routes for project CRUD
   - [ ] Stripe payment integration
   - [ ] Application submission
   - [ ] Project detail page
   - [ ] Founder dashboard
   - [ ] Professional dashboard

2. **Medium Priority:**
   - [ ] Interview scheduling
   - [ ] Completion verification
   - [ ] Payout release logic
   - [ ] Review system
   - [ ] Profile management

3. **Nice to Have:**
   - [ ] Email notifications
   - [ ] Admin panel
   - [ ] Dispute resolution
   - [ ] Advanced search/filters
   - [ ] Analytics dashboard

---

## 🔮 Future Roadmap

### V2 Features
- In-platform video calls (Zoom/Google Meet API)
- AI interview transcription
- Calendar integration (Calendly)
- Advanced matching algorithm
- Professional "expert badges"
- Founder "repeat client" badges
- Referral program
- Mobile app (React Native)

### V3 Features
- Industry-specific verticals (Healthcare, Fintech, etc.)
- Tiered pricing (junior vs senior professionals)
- Subscription plans for frequent founders
- Interview question templates
- AI-powered insights from transcripts
- International expansion (US, Southeast Asia)

---

## 📈 Success Metrics to Track

### User Metrics
- New signups (founder vs professional split)
- Profile completion rate
- Verification rate

### Marketplace Metrics
- Projects created per week
- Average applications per project
- Match rate (% projects with ≥3 participants)
- Interview completion rate
- Average time to match

### Financial Metrics
- GMV (Gross Merchandise Value)
- Platform fee collected
- Average project size
- Payout speed

### Quality Metrics
- Average rating (both sides)
- Dispute rate
- No-show rate
- Repeat usage rate

---

## 🛡️ Security Considerations

1. **Authentication:**
   - Use NextAuth.js with secure session handling
   - CSRF protection enabled
   - HTTP-only cookies

2. **Authorization:**
   - Role-based access control (RBAC)
   - Server-side permission checks
   - API route protection

3. **Payments:**
   - Never store credit card details
   - Use Stripe Elements for PCI compliance
   - Webhook signature verification
   - Idempotency keys for payments

4. **Data Protection:**
   - Input validation (Zod schemas)
   - SQL injection prevention (Prisma ORM)
   - XSS protection (React default)
   - Rate limiting on APIs

---

## 📝 Environment Variables Reference

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/coffeeforfeedback"

# NextAuth
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Platform Settings
PLATFORM_FEE_PERCENTAGE=10
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Getting Credentials

**Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID
4. Add authorized redirect: `http://localhost:3000/api/auth/callback/google`

**Stripe:**
1. Sign up at [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get test API keys from Developers → API keys
3. Set up webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
4. Copy webhook signing secret

---

## 🚀 Deployment

### Database (Supabase)
```bash
# 1. Create Supabase project
# 2. Get connection string
# 3. Update DATABASE_URL in production env
# 4. Run migrations
npx prisma migrate deploy
```

### Hosting (Vercel)
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Set environment variables in Vercel dashboard
# 4. Connect GitHub for auto-deployments
```

### Post-Deployment
- [ ] Test payment flow in Stripe test mode
- [ ] Verify webhooks are working
- [ ] Check OAuth redirects
- [ ] Monitor error logs
- [ ] Set up analytics (Mixpanel/Amplitude)
- [ ] Configure domain + SSL

---

## 🤝 Contributing

This is a production MVP. Before making changes:
1. Run tests (when implemented)
2. Check TypeScript types
3. Test payment flows thoroughly
4. Review database migrations

---

## 📞 Support

For questions or issues:
- Review this README first
- Check Prisma/Next.js/Stripe docs
- Inspect browser console for errors
- Check server logs

---

**Built with ❤️ using:**
- Next.js 14 (App Router)
- TypeScript
- Prisma + PostgreSQL
- NextAuth.js
- Stripe
- Tailwind CSS
- Radix UI

**Remember:** This is an MVP. Focus on core user flows first, polish later. Ship fast, iterate based on real user feedback.
