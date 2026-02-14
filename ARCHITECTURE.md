# CoffeeForFeedback — System Architecture

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
├─────────────────────────────────────────────────────────────┤
│  Next.js 14 App Router (React Server Components)            │
│  - Landing Page                                              │
│  - Browse Projects                                           │
│  - Create Project                                            │
│  - Dashboard (Role-based)                                    │
│  - Profile Management                                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    API ROUTES LAYER                          │
├─────────────────────────────────────────────────────────────┤
│  /api/auth/*          → NextAuth.js (Google OAuth)           │
│  /api/projects/*      → Project CRUD                         │
│  /api/applications/*  → Application management               │
│  /api/interviews/*    → Interview scheduling & completion    │
│  /api/payments/*      → Payment processing                   │
│  /api/stripe/*        → Stripe webhooks                      │
│  /api/admin/*         → Admin operations                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   BUSINESS LOGIC LAYER                       │
├─────────────────────────────────────────────────────────────┤
│  Prisma ORM → Type-safe database queries                    │
│  Validation → Zod schemas                                    │
│  Authorization → Role-based access control                   │
│  Payment Logic → Escrow handling                             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                          │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL     → Data persistence                           │
│  Stripe API     → Payment processing                         │
│  Google OAuth   → Authentication                             │
│  (Future) SendGrid → Email notifications                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Core User Flows

### Flow 1: Founder Creates Project
```
1. Founder signs in via Google OAuth
2. Navigates to /projects/new
3. Fills out project form:
   - Title, description, target persona
   - Interview duration
   - Total pool amount, number of participants
4. Submits form → POST /api/projects/create
5. Project created in DRAFT status
6. Redirects to /projects/[id] for funding
7. Founder clicks "Fund Project"
8. Stripe PaymentIntent created
9. Founder completes payment
10. Webhook received → Project status: ACTIVE
11. Project visible on /browse
```

### Flow 2: Professional Applies to Project
```
1. Professional browses /browse
2. Finds interesting project
3. Clicks to view details → /projects/[id]
4. Reads full description
5. Fills out application form:
   - Cover letter
   - Availability
6. Submits → POST /api/applications/create
7. Application created (PENDING status)
8. Founder notified (email - future)
```

### Flow 3: Founder Selects & Schedules Interview
```
1. Founder views applications on /projects/[id]
2. Reviews applicant profiles
3. Accepts application → POST /api/applications/[id]/accept
4. Interview record created (SCHEDULED status)
5. Founder adds Google Meet link + scheduled time
6. Professional notified (email - future)
7. Interview appears on both dashboards
```

### Flow 4: Interview Completion & Payout
```
1. Interview happens (off-platform initially)
2. Founder marks complete → POST /api/interviews/[id]/complete
3. Interview status: COMPLETED
4. 24-hour dispute window starts
5. If no dispute:
   a. Payment released → POST /api/interviews/[id]/payout
   b. Stripe Transfer created
   c. Professional's wallet balance increases
   d. Transaction recorded
6. Both parties prompted to leave review
```

### Flow 5: Dispute Resolution (Admin)
```
1. Professional (or Founder) files dispute
2. Dispute created (OPEN status)
3. Admin reviews in /admin/disputes
4. Admin contacts both parties (email)
5. Admin makes decision:
   - Full payout to professional
   - Partial payout
   - Refund to founder
6. Dispute status: RESOLVED
7. Payments adjusted accordingly
```

---

## 💾 Data Model Relationships

```
User
 ├─ 1:1 Profile
 ├─ 1:1 Wallet
 ├─ 1:N Projects (as creator)
 ├─ 1:N Applications (as applicant)
 ├─ 1:N Interviews (as professional)
 ├─ 1:N Reviews (as reviewer)
 ├─ 1:N Reviews (as reviewee)
 └─ 1:N Transactions

Project
 ├─ N:1 User (creator)
 ├─ 1:N Applications
 ├─ 1:N Interviews
 └─ 1:N Payments

Application
 ├─ N:1 Project
 ├─ N:1 User (applicant)
 └─ 1:1 Interview (if accepted)

Interview
 ├─ N:1 Project
 ├─ N:1 User (professional)
 ├─ 1:1 Application
 ├─ 1:1 Payment
 ├─ 1:N Reviews
 └─ 1:1 Dispute (if exists)
```

---

## 🔐 Authentication & Authorization

### Authentication (NextAuth.js)
- **Provider:** Google OAuth 2.0
- **Session:** Database sessions (not JWT for admin flexibility)
- **Storage:** PostgreSQL via Prisma adapter

### Authorization Matrix

| Action | PROFESSIONAL | FOUNDER | ADMIN |
|--------|-------------|---------|-------|
| Browse projects | ✅ | ✅ | ✅ |
| Apply to project | ✅ | ❌ | ❌ |
| Create project | ❌ | ✅ | ✅ |
| View applications | ❌ | ✅ (own) | ✅ (all) |
| Accept/reject applicants | ❌ | ✅ (own) | ✅ (all) |
| Complete interview | ❌ | ✅ (own) | ✅ (all) |
| View wallet | ✅ (own) | ❌ | ✅ (all) |
| Resolve disputes | ❌ | ❌ | ✅ |

### Middleware Protection
```typescript
// middleware.ts
export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/projects/new',
    '/profile/:path*',
    '/admin/:path*',
  ],
}
```

---

## 💰 Payment Architecture

### Escrow Flow (Stripe)
```
1. ESCROW DEPOSIT
   Founder → Stripe → Platform Account
   - Create PaymentIntent
   - Amount: totalPoolAmount (in paise)
   - Metadata: { projectId, creatorId }
   - Status: Project.status = ACTIVE

2. ESCROW HOLDING
   - Money sits in Stripe account
   - Not transferred yet
   - Tracked via Project.escrowAmount

3. PAYOUT RELEASE
   - Trigger: Interview marked complete + 24h passed
   - Stripe Transfer API
   - Destination: Professional's Stripe Connect account
   - Amount: perParticipantPay - platformFee - stripeFee
   - Update: Wallet.balance increases

4. PLATFORM FEE
   - Calculated: 10% of payout
   - Automatically deducted during transfer
   - Tracked: Transaction (type: PLATFORM_FEE)
```

### Stripe Integration Points
```typescript
// Create payment
stripe.paymentIntents.create({
  amount: totalPoolAmount,
  currency: 'inr',
  metadata: { projectId },
})

// Transfer to professional
stripe.transfers.create({
  amount: netAmount,
  currency: 'inr',
  destination: professionalStripeAccountId,
  metadata: { interviewId },
})

// Webhook handling
stripe.webhooks.constructEvent(
  payload,
  signature,
  webhookSecret
)
```

### Money States
```
┌─────────────────────────────────────────┐
│          MONEY LIFECYCLE                 │
├─────────────────────────────────────────┤
│  1. Founder's bank account               │
│  2. Stripe PaymentIntent (pending)       │
│  3. Platform Stripe account (escrowed)   │
│  4. Professional's Stripe Connect        │
│  5. Professional's bank account          │
└─────────────────────────────────────────┘
```

---

## 🎯 State Machines

### Project Status State Machine
```
DRAFT → (payment) → ACTIVE → (selection) → IN_PROGRESS → (completion) → COMPLETED
   ↓                           ↓
CANCELLED               CANCELLED
```

### Application Status State Machine
```
PENDING → (founder action) → ACCEPTED or REJECTED
```

### Interview Status State Machine
```
SCHEDULED → (founder marks) → COMPLETED
              ↓
          NO_SHOW
              ↓
          CANCELLED
```

### Payment Status State Machine
```
PENDING → (processing) → COMPLETED
   ↓
FAILED
```

---

## 🔔 Future: Event-Driven Architecture

When scaling, move to event-driven:

```typescript
// Events to emit
enum EventType {
  PROJECT_CREATED = 'project.created',
  PROJECT_FUNDED = 'project.funded',
  APPLICATION_SUBMITTED = 'application.submitted',
  APPLICATION_ACCEPTED = 'application.accepted',
  INTERVIEW_SCHEDULED = 'interview.scheduled',
  INTERVIEW_COMPLETED = 'interview.completed',
  PAYMENT_RELEASED = 'payment.released',
  REVIEW_SUBMITTED = 'review.submitted',
  DISPUTE_FILED = 'dispute.filed',
}

// Event handlers
handleProjectFunded → Send email to creator
handleApplicationSubmitted → Notify founder
handleInterviewCompleted → Start payout timer
handlePaymentReleased → Update wallet balance
```

**Benefits:**
- Decouple business logic
- Easy to add notifications
- Audit trail
- Retry failed operations

---

## 📊 Database Indexing Strategy

### High-Traffic Queries
```sql
-- Browse active projects
CREATE INDEX idx_projects_status_created 
ON projects(status, created_at DESC);

-- User's applications
CREATE INDEX idx_applications_applicant_status 
ON applications(applicant_id, status);

-- Project's applicants
CREATE INDEX idx_applications_project_status 
ON applications(project_id, status);

-- User's interviews
CREATE INDEX idx_interviews_professional_status 
ON interviews(professional_id, status);
```

### Composite Indexes
```sql
-- Prevent duplicate applications
CREATE UNIQUE INDEX idx_applications_unique 
ON applications(project_id, applicant_id);

-- Fast auth lookups
CREATE INDEX idx_users_email ON users(email);
```

---

## 🚀 Scaling Considerations

### Phase 1: MVP (0-100 users)
- Single Vercel deployment
- Supabase PostgreSQL (free tier)
- Stripe test mode
- No caching needed

### Phase 2: Growth (100-1000 users)
- Vercel Pro plan
- Supabase Pro ($25/mo)
- Redis for session caching
- Background jobs (Vercel Cron or Inngest)
- Email service (SendGrid/Resend)

### Phase 3: Scale (1000+ users)
- Edge caching (Vercel Edge Network)
- Database read replicas
- Queue system (BullMQ + Redis)
- Full-text search (Algolia/Typesense)
- Real-time notifications (Pusher/Ably)
- CDN for assets (Cloudflare)

### Database Optimization
```typescript
// Use connection pooling
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // For migrations
}

// Implement caching
const getCachedProjects = cache(async () => {
  return prisma.project.findMany({ ... })
})
```

---

## 🛡️ Security Best Practices

### 1. Input Validation
```typescript
import { z } from 'zod'

const CreateProjectSchema = z.object({
  title: z.string().min(10).max(200),
  description: z.string().min(50),
  targetPersona: z.string().min(10),
  totalPoolAmount: z.number().min(100000), // ₹1000 minimum
})
```

### 2. SQL Injection Prevention
- ✅ Prisma ORM (parameterized queries)
- ❌ Never use raw SQL with user input

### 3. XSS Protection
- ✅ React auto-escapes by default
- ✅ Use `dangerouslySetInnerHTML` sparingly
- ✅ Sanitize rich text (DOMPurify)

### 4. CSRF Protection
- ✅ NextAuth.js includes CSRF tokens
- ✅ SameSite cookies

### 5. Rate Limiting
```typescript
// middleware.ts or API routes
import { Ratelimit } from '@upstash/ratelimit'

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
})

// In API route
const { success } = await ratelimit.limit(userId)
if (!success) return Response.json({ error: 'Rate limit exceeded' })
```

---

## 📈 Monitoring & Observability

### Key Metrics to Track
```typescript
// Application metrics
- Request latency (p50, p95, p99)
- Error rate by endpoint
- Database query performance
- API rate limits hit

// Business metrics
- New user signups (founder vs professional)
- Projects created per day
- Application rate (apps per project)
- Match rate (% projects with ≥3 participants)
- Interview completion rate
- Average payout amount
- Platform revenue (fees collected)

// Trust metrics
- Dispute rate
- No-show rate
- Average ratings (both sides)
- Time to first match
```

### Tools
- **Vercel Analytics** (built-in)
- **Sentry** (error tracking)
- **Mixpanel/Amplitude** (product analytics)
- **Stripe Dashboard** (payment analytics)

---

## 🧪 Testing Strategy

### Unit Tests
```typescript
// lib/utils.test.ts
test('formatCurrency converts paise to rupees', () => {
  expect(formatCurrency(100000)).toBe('₹1,000')
})

test('calculatePlatformFee applies 10%', () => {
  expect(calculatePlatformFee(100000)).toBe(10000)
})
```

### Integration Tests
```typescript
// api/projects/create.test.ts
test('authenticated user can create project', async () => {
  const response = await POST({
    headers: { authorization: `Bearer ${token}` },
    body: { title: 'Test Project', ... },
  })
  expect(response.status).toBe(201)
})
```

### E2E Tests (Playwright)
```typescript
test('complete interview flow', async ({ page }) => {
  await page.goto('/projects/new')
  await page.fill('[name="title"]', 'E2E Test Project')
  await page.click('button[type="submit"]')
  // ... continue full flow
})
```

---

## 🔮 Architecture Evolution

### V2: Microservices (if needed)
```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Next.js    │  │  Interview   │  │   Payment    │
│   Frontend   │→ │   Service    │→ │   Service    │
└──────────────┘  └──────────────┘  └──────────────┘
                         ↓
                  ┌──────────────┐
                  │ Notification │
                  │   Service    │
                  └──────────────┘
```

### V3: Real-time Features
```
┌──────────────┐
│   WebSocket  │ → Real-time chat during interviews
│    Server    │ → Live status updates
└──────────────┘ → Collaborative note-taking
```

---

## 📝 Code Organization Principles

### 1. Colocation
- Components near where they're used
- API routes mirror app structure

### 2. Separation of Concerns
```
lib/          → Pure functions, utilities
components/   → UI components (presentational)
app/          → Pages, layouts (container components)
```

### 3. Type Safety
- Prisma generates types automatically
- Zod for runtime validation
- TypeScript strict mode

### 4. Server vs Client
```typescript
// Server Component (default)
async function ProjectsList() {
  const projects = await prisma.project.findMany()
  return <div>...</div>
}

// Client Component (when needed)
'use client'
function InteractiveForm() {
  const [state, setState] = useState()
  return <form>...</form>
}
```

---

**This architecture supports:**
✅ Rapid MVP development  
✅ Type-safe, maintainable code  
✅ Secure payment handling  
✅ Scalable to thousands of users  
✅ Easy feature additions  

**Remember:** Start simple, add complexity only when needed.
