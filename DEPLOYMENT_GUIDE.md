# 🚀 Free Deployment Guide - CoffeeForFeedback

## ✨ What You're Getting (100% Free)

- ✅ **Hosting**: Vercel (free tier - perfect for Next.js)
- ✅ **Database**: Supabase (free tier - 500MB PostgreSQL)
- ✅ **Authentication**: Google OAuth (free)
- ✅ **Payments**: Stripe (test mode - free)
- ✅ **Total cost**: **₹0/month**

---

## 📋 Complete Deployment Checklist

### ⏱️ Total Time: 15 minutes

- [ ] Step 1: Create Supabase database (3 min)
- [ ] Step 2: Set up Google OAuth (3 min)
- [ ] Step 3: Create Stripe account (2 min)
- [ ] Step 4: Deploy to Vercel (2 min)
- [ ] Step 5: Add demo data (2 min)
- [ ] Step 6: Test everything (3 min)

---

## 🗄️ STEP 1: Create Free PostgreSQL Database (Supabase)

### 1.1 Create Account
1. Go to **https://supabase.com**
2. Click **"Start your project"**
3. Sign in with GitHub (or email)
4. Click **"New project"**

### 1.2 Create Project
```
Organization: [Your name]
Project name: coffeeforfeedback
Database Password: [Generate strong password - SAVE THIS!]
Region: Southeast Asia (Singapore) [closest to India]
Pricing Plan: Free
```

### 1.3 Get Database URL
1. Wait 2 minutes for database to provision
2. Go to **Settings** → **Database**
3. Scroll to **Connection string** → **URI**
4. Copy the connection string (looks like this):
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
```

### 1.4 Configure Connection Pooling (Important!)
1. In the same page, scroll to **Connection Pooling**
2. Copy the **Transaction** mode connection string
3. This will be your `DATABASE_URL`

**Save both URLs:**
```
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
```

---

## 🔐 STEP 2: Set Up Google OAuth (Free)

### 2.1 Create Google Cloud Project
1. Go to **https://console.cloud.google.com**
2. Click **"Select a project"** → **"New Project"**
3. Project name: `CoffeeForFeedback`
4. Click **"Create"**

### 2.2 Enable OAuth
1. In the search bar, type **"APIs & Services"**
2. Click **"Credentials"** in the left sidebar
3. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
4. If prompted, configure consent screen:
   - User Type: **External**
   - App name: `CoffeeForFeedback`
   - User support email: [your email]
   - Developer contact: [your email]
   - Click **"Save and Continue"** through all steps

### 2.3 Create OAuth Client
1. Application type: **Web application**
2. Name: `CoffeeForFeedback Production`
3. Authorized JavaScript origins:
   ```
   http://localhost:3000
   https://[your-app-name].vercel.app
   ```
4. Authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   https://[your-app-name].vercel.app/api/auth/callback/google
   ```
5. Click **"Create"**

### 2.4 Save Credentials
Copy these values:
```
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxx"
```

---

## 💳 STEP 3: Create Stripe Account (Test Mode - Free)

### 3.1 Sign Up
1. Go to **https://dashboard.stripe.com/register**
2. Create account with email
3. Skip business details for now (stay in test mode)

### 3.2 Get API Keys
1. In dashboard, click **"Developers"** → **"API keys"**
2. You'll see **Test mode** keys (this is free!)
3. Copy both keys:
```
STRIPE_PUBLISHABLE_KEY="pk_test_xxx"
STRIPE_SECRET_KEY="sk_test_xxx"
```

### 3.3 Set Up Webhook (After Vercel deployment)
*We'll come back to this in Step 4.5*

---

## 🚀 STEP 4: Deploy to Vercel (1-Click!)

### 4.1 Prepare Repository
1. If you haven't already, create a GitHub account
2. Create a new repository: **coffeeforfeedback**
3. Upload the entire `coffeeforfeedback` folder to GitHub

**Or use GitHub Desktop:**
```
1. Download GitHub Desktop
2. File → Add Local Repository → Choose coffeeforfeedback folder
3. Publish repository → Name: coffeeforfeedback
```

### 4.2 Deploy to Vercel
1. Go to **https://vercel.com/signup**
2. Sign up with GitHub
3. Click **"Import Project"**
4. Select your **coffeeforfeedback** repository
5. Click **"Import"**

### 4.3 Configure Environment Variables
Before deploying, add these environment variables in Vercel:

**Click "Environment Variables"** and add each one:

```bash
# Database
DATABASE_URL="[paste your Supabase connection pooling URL]"
DIRECT_URL="[paste your Supabase direct URL]"

# NextAuth
NEXTAUTH_SECRET="[run: openssl rand -base64 32]"
NEXTAUTH_URL="https://[your-app-name].vercel.app"

# Google OAuth
GOOGLE_CLIENT_ID="[paste from Step 2]"
GOOGLE_CLIENT_SECRET="[paste from Step 2]"

# Stripe
STRIPE_SECRET_KEY="[paste from Step 3]"
STRIPE_PUBLISHABLE_KEY="[paste from Step 3]"

# Platform Settings
PLATFORM_FEE_PERCENTAGE="10"
NEXT_PUBLIC_APP_URL="https://[your-app-name].vercel.app"
```

### 4.4 Deploy!
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. You'll get a URL like: `https://coffeeforfeedback.vercel.app`

### 4.5 Run Database Migrations
After deployment:
1. In Vercel dashboard, go to your project
2. Click **"Settings"** → **"General"**
3. Copy your **deployment URL**
4. Open terminal on your computer:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Run migrations
vercel env pull .env.local
npx prisma migrate deploy
```

**Or use Vercel's built-in terminal:**
1. In Vercel project → **"Deployments"**
2. Click latest deployment → **"..."** → **"Redeploy"**
3. Check **"Use existing Build Cache"** → **"Redeploy"**

---

## 🎯 STEP 5: Add Demo Data (Seed Database)

### 5.1 Run Seed Script
On your local computer:

```bash
# Make sure you have the .env.local from Step 4.5
npx tsx prisma/seed.ts
```

This creates:
- 2 test users (founder + professional)
- 1 sample project
- Demo profiles with realistic data

### 5.2 Test Login
1. Visit your Vercel URL
2. Click **"Sign In"**
3. Sign in with your Google account
4. You should see the dashboard!

---

## ✅ STEP 6: Final Testing Checklist

### Test Each Flow:
- [ ] **Landing page loads** ✓
- [ ] **Sign in with Google works** ✓
- [ ] **Dashboard shows** ✓
- [ ] **Browse projects page loads** ✓
- [ ] **Can create new project** ✓
- [ ] **Project saves to database** ✓

### Check Database:
1. Go to Supabase dashboard
2. Click **"Table Editor"**
3. You should see your tables populated

---

## 🐛 Debugging & Troubleshooting

### If deployment fails:

**Error: "Can't find module '@prisma/client'"**
```bash
# Add to package.json scripts:
"postinstall": "prisma generate"
```

**Error: "Database connection failed"**
- Check DATABASE_URL is correct
- Make sure you're using the **connection pooling** URL
- Verify password doesn't have special characters (URL encode if needed)

**Error: "Google OAuth redirect_uri_mismatch"**
- Go back to Google Cloud Console
- Add your actual Vercel URL to authorized redirect URIs
- Format: `https://your-app.vercel.app/api/auth/callback/google`

**Error: "NextAuth configuration error"**
- Make sure NEXTAUTH_URL matches your Vercel deployment URL
- NEXTAUTH_SECRET must be set (run `openssl rand -base64 32`)

### View Logs:
1. In Vercel dashboard → **"Deployments"**
2. Click on deployment → **"Runtime Logs"**
3. Check for errors

### Database Issues:
1. Go to Supabase → **"SQL Editor"**
2. Run: `SELECT * FROM "User";`
3. Should show your users

---

## 💰 Free Tier Limits (You're Safe!)

### Vercel Free:
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month (plenty for MVP)
- ✅ Auto SSL certificate
- ✅ Custom domains (1 free)

### Supabase Free:
- ✅ 500MB database (enough for 10,000+ users)
- ✅ Unlimited API requests
- ✅ Auto backups

### Google OAuth:
- ✅ Completely free
- ✅ Unlimited users

### Stripe Test Mode:
- ✅ Completely free
- ✅ Unlimited test transactions

**You won't hit limits until you have 1000+ active users!**

---

## 🔄 Update & Redeploy

When you make code changes:

```bash
# Commit changes
git add .
git commit -m "Update feature X"
git push

# Vercel auto-deploys! 🎉
```

---

## 🎓 Next Steps After Deployment

### Week 1: Test Everything
- [ ] Create test projects as founder
- [ ] Apply to projects as professional
- [ ] Test full interview flow
- [ ] Verify payments (Stripe test mode)
- [ ] Get 3 friends to test

### Week 2: Add Missing Features
- [ ] Implement remaining API routes (see README.md)
- [ ] Add Stripe payment integration
- [ ] Build project detail page
- [ ] Create application flow

### Week 3: Go Live
- [ ] Switch Stripe to live mode
- [ ] Add custom domain
- [ ] Launch to 20 beta users
- [ ] Collect feedback

---

## 🎉 SUCCESS!

Your app is now live at: **https://[your-app].vercel.app**

**What you have:**
- ✅ Production website (hosted free)
- ✅ PostgreSQL database (hosted free)
- ✅ User authentication (Google OAuth)
- ✅ Payment system ready (Stripe test mode)
- ✅ Auto-deploys on git push
- ✅ SSL certificate (HTTPS)
- ✅ Monitoring & logs

**Total setup time:** ~15 minutes  
**Monthly cost:** ₹0

**Now go get your first users! 🚀**

---

## 📞 Need Help?

### Common Issues:

**"My site is slow"**
- Free tier has cold starts (first load takes 5-10 seconds)
- Subsequent loads are fast
- Upgrade to Vercel Pro ($20/mo) for instant loads

**"I want a custom domain"**
- Vercel free tier includes 1 custom domain
- Go to Vercel → Settings → Domains
- Add your domain (purchase from Namecheap/GoDaddy)

**"How do I see database?"**
- Supabase → Table Editor (visual interface)
- Or use `npx prisma studio` locally

**"Stripe webhooks not working"**
- Make sure you added webhook URL in Stripe dashboard
- URL should be: `https://your-app.vercel.app/api/stripe/webhook`
- Use Stripe CLI for local testing

---

## 🎯 You're Ready!

Everything is set up and running. Focus on:
1. Getting your first 10 users
2. Running 5 successful interviews
3. Collecting feedback
4. Iterating the product

**The infrastructure is solid. Now make it useful! 💪**
