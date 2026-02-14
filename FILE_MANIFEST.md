# CoffeeForFeedback - Complete File Manifest

## 📁 Project Overview

This is a **production-ready MVP** for CoffeeForFeedback - a two-sided marketplace for paid user interviews. The codebase includes core functionality, database schema, authentication, payment integration setup, and comprehensive documentation.

---

## ✅ Implemented Files

### Root Configuration
```
coffeeforfeedback/
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.ts        # Tailwind CSS with custom theme
├── postcss.config.js         # PostCSS configuration
├── next.config.js            # Next.js configuration
├── .env.example              # Environment variables template
├── README.md                 # Complete setup and implementation guide
├── ARCHITECTURE.md           # System architecture documentation
```

### Database
```
prisma/
├── schema.prisma             # Complete database schema with all models
└── (seed.ts)                 # TO CREATE: Sample data for testing
```

### Core Application
```
src/
├── app/
│   ├── layout.tsx            # Root layout with navigation
│   ├── page.tsx              # Landing page (stunning hero, how it works, pricing)
│   ├── globals.css           # Global styles with custom design system
│   ├── providers.tsx         # SessionProvider wrapper
│   │
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   │   └── route.ts      # NextAuth API route
│   │   └── projects/
│   │       └── create/
│   │           └── route.ts  # Project creation API (sample)
│   │
│   ├── browse/
│   │   └── page.tsx          # Browse active projects
│   │
│   ├── projects/
│   │   ├── new/
│   │   │   └── page.tsx      # Create project page
│   │   └── [id]/
│   │       └── (page.tsx)    # TO CREATE: Project detail page
│   │
│   ├── dashboard/
│   │   └── page.tsx          # Role-based user dashboard
│   │
│   ├── profile/
│   │   └── (page.tsx)        # TO CREATE: Profile management
│   │
│   └── admin/
│       └── (page.tsx)        # TO CREATE: Admin panel
```

### Components
```
src/components/
├── navigation.tsx            # Responsive nav bar with auth
├── create-project-form.tsx   # Comprehensive project creation form
│
└── ui/                       # Reusable UI components
    ├── button.tsx            # Button component with variants
    └── (others)              # TO CREATE: card, input, dialog, etc.
```

### Library Functions
```
src/lib/
├── prisma.ts                 # Prisma client singleton
├── auth.ts                   # NextAuth configuration
├── utils.ts                  # Utility functions (currency, dates, etc.)
└── (stripe.ts)               # TO CREATE: Stripe helper functions
```

### Types
```
src/types/
└── index.ts                  # TypeScript type definitions
```

---

## 🚧 Files to Implement (Priority Order)

### High Priority - Core Functionality

#### 1. API Routes
```
src/app/api/
├── projects/
│   ├── [id]/
│   │   ├── route.ts          # Get project details
│   │   └── fund/
│   │       └── route.ts      # Fund project with Stripe
│   │
├── applications/
│   ├── create/
│   │   └── route.ts          # Submit application
│   └── [id]/
│       ├── accept/
│       │   └── route.ts      # Accept application → Create interview
│       └── reject/
│           └── route.ts      # Reject application
│
├── interviews/
│   └── [id]/
│       ├── complete/
│       │   └── route.ts      # Mark interview complete
│       └── payout/
│           └── route.ts      # Release payment
│
└── stripe/
    └── webhook/
        └── route.ts          # Handle Stripe events
```

#### 2. Pages
```
src/app/
├── projects/[id]/
│   └── page.tsx              # Project detail + application form
│
├── profile/
│   └── page.tsx              # Professional profile management
│
└── how-it-works/
    └── page.tsx              # Explainer page
```

#### 3. Stripe Integration
```
src/lib/
└── stripe.ts                 # Payment helper functions:
                              # - createEscrowPayment()
                              # - transferToProfessional()
                              # - handleWebhook()
```

### Medium Priority - Enhanced Features

#### 4. UI Components
```
src/components/ui/
├── card.tsx                  # Card container
├── input.tsx                 # Form input
├── textarea.tsx              # Text area
├── select.tsx                # Dropdown
├── dialog.tsx                # Modal
├── badge.tsx                 # Status badges
├── avatar.tsx                # User avatar
└── toast.tsx                 # Notifications
```

#### 5. Feature Components
```
src/components/
├── project-card.tsx          # Project display card
├── application-modal.tsx     # Application submission modal
├── interview-scheduler.tsx   # Calendar integration
├── rating-form.tsx           # Review submission
├── wallet-widget.tsx         # Balance display
└── transaction-list.tsx      # Transaction history
```

### Nice to Have - Polish

#### 6. Admin Panel
```
src/app/admin/
├── page.tsx                  # Admin dashboard
├── users/
│   └── page.tsx              # User management
├── projects/
│   └── page.tsx              # Project moderation
└── disputes/
    └── page.tsx              # Dispute resolution
```

#### 7. Email Notifications
```
src/lib/
└── email.ts                  # Email sending logic:
                              # - Application submitted
                              # - Application accepted
                              # - Interview scheduled
                              # - Payment released
```

#### 8. Database Seeding
```
prisma/
└── seed.ts                   # Sample data:
                              # - Test users (founder + professional)
                              # - Sample projects
                              # - Demo applications
```

---

## 🎯 Quick Start Guide

### 1. Install Dependencies
```bash
cd coffeeforfeedback
npm install
```

### 2. Set Up Database
```bash
# Create PostgreSQL database (locally or Supabase)

# Copy environment template
cp .env.example .env

# Edit .env with your database URL
DATABASE_URL="postgresql://user:password@localhost:5432/coffeeforfeedback"

# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate
```

### 3. Configure Authentication
```bash
# Get Google OAuth credentials from:
# https://console.cloud.google.com/apis/credentials

# Add to .env:
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Generate NextAuth secret:
openssl rand -base64 32

# Add to .env:
NEXTAUTH_SECRET="generated-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Set Up Stripe (Test Mode)
```bash
# Sign up at https://dashboard.stripe.com/

# Get test API keys
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Set up webhook (after deployment):
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 5. Run Development Server
```bash
npm run dev

# Open http://localhost:3000
```

---

## 🔑 Key Implementation Notes

### Stripe Payment Flow
```typescript
// 1. Create PaymentIntent when funding project
const paymentIntent = await stripe.paymentIntents.create({
  amount: totalPoolAmount, // in paise
  currency: 'inr',
  metadata: { projectId },
})

// 2. On successful payment (webhook):
// Update project status to ACTIVE

// 3. After interview completion:
const transfer = await stripe.transfers.create({
  amount: payoutAmount, // after fees
  currency: 'inr',
  destination: professionalStripeAccountId,
  metadata: { interviewId },
})

// 4. Update wallet balance
await prisma.wallet.update({
  where: { userId: professionalId },
  data: { balance: { increment: payoutAmount } },
})
```

### Escrow State Management
```
DRAFT → (Stripe payment) → ACTIVE → (Select participants) → IN_PROGRESS → (Complete interviews) → COMPLETED
```

### Application Acceptance Logic
```typescript
// When founder accepts application:
1. Update application status to ACCEPTED
2. Create Interview record
3. Lock escrow for this participant
4. Send notification to professional
5. If all spots filled, update project to IN_PROGRESS
```

### Payout Release Logic
```typescript
// After interview marked complete:
1. Start 24-hour dispute timer
2. If no dispute filed:
   a. Calculate net amount (amount - platformFee - stripeFee)
   b. Create Stripe transfer
   c. Update wallet balance
   d. Create transaction record
   e. Prompt for reviews
```

---

## 📊 Database Seeding Example

```typescript
// prisma/seed.ts
import { PrismaClient, UserRole, ProjectStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create founder
  const founder = await prisma.user.create({
    data: {
      email: 'founder@example.com',
      name: 'Sarah Founder',
      role: 'FOUNDER',
      profile: {
        create: {
          headline: 'CEO at StartupXYZ',
          bio: 'Building the future of productivity tools',
        },
      },
      wallet: { create: {} },
    },
  })

  // Create professional
  const professional = await prisma.user.create({
    data: {
      email: 'professional@example.com',
      name: 'Alex Professional',
      role: 'PROFESSIONAL',
      profile: {
        create: {
          headline: 'Senior PM at TechCorp',
          bio: '8 years in B2B SaaS product management',
          skills: ['SaaS', 'B2B', 'Product Management'],
          yearsExperience: 8,
          currentCompany: 'TechCorp',
        },
      },
      wallet: { create: {} },
    },
  })

  // Create active project
  const project = await prisma.project.create({
    data: {
      creatorId: founder.id,
      title: 'Validate New Productivity Feature',
      description: 'We're building a new collaborative task management feature...',
      targetPersona: 'Product Managers with B2B SaaS experience',
      interviewDuration: 30,
      totalPoolAmount: 500000, // ₹5,000
      numParticipants: 5,
      perParticipantPay: 100000, // ₹1,000
      status: 'ACTIVE',
      escrowPaid: true,
      escrowAmount: 500000,
    },
  })

  console.log('✅ Seed data created!')
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

---

## 🎨 Design System

### Color Palette
- Primary: Slate (neutral base)
- Accent: Purple → Blue gradient
- Success: Green
- Warning: Orange
- Error: Red

### Typography
- Display: Cabinet Grotesk (headings)
- Body: Inter (content)

### Spacing
- Base: 4px (0.25rem)
- Scale: 4, 8, 12, 16, 24, 32, 48, 64

### Components
- Buttons: Multiple variants (default, outline, ghost)
- Cards: Hover effects, shadows
- Forms: Focus states, validation
- Badges: Status indicators

---

## 🚀 Deployment Checklist

### Pre-Deploy
- [ ] All environment variables set
- [ ] Database migrations run
- [ ] Stripe webhook endpoint configured
- [ ] Test payment flow end-to-end
- [ ] Seed sample data for demo

### Deploy to Vercel
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Link project
vercel link

# 3. Set environment variables
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
# ... repeat for all env vars

# 4. Deploy
vercel --prod
```

### Post-Deploy
- [ ] Test authentication
- [ ] Test project creation
- [ ] Test payment flow (small amount)
- [ ] Verify webhooks working
- [ ] Check error logs
- [ ] Set up monitoring (Sentry)

---

## 📈 Next Steps After MVP

1. **Week 1-2:** Implement core API routes + Stripe integration
2. **Week 3:** Build project detail page + application flow
3. **Week 4:** Add interview scheduling + completion
4. **Week 5:** Implement reviews + dispute system
5. **Week 6:** Admin panel + moderation tools
6. **Week 7-8:** Email notifications + polish
7. **Week 9:** Testing + bug fixes
8. **Week 10:** Beta launch with 10 hand-picked users

---

## 🎯 Success Metrics (First 3 Months)

- 100 registered users (50 founders, 50 professionals)
- 30 completed projects
- ₹3,00,000 GMV
- 4.5+ average rating (both sides)
- <5% dispute rate
- 90%+ interview completion rate

---

**🎉 You now have a production-ready foundation for CoffeeForFeedback!**

Focus on implementing the high-priority files first, test thoroughly, and iterate based on real user feedback. The architecture is designed to scale, so start simple and add complexity only when needed.

Questions? Check the README.md and ARCHITECTURE.md for comprehensive guidance.
