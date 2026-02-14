import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create founder user
  const founder = await prisma.user.upsert({
    where: { email: 'founder@coffeeforfeedback.com' },
    update: {},
    create: {
      email: 'founder@coffeeforfeedback.com',
      name: 'Sarah Founder',
      role: 'FOUNDER',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      emailVerified: new Date(),
      profile: {
        create: {
          headline: 'CEO at StartupXYZ',
          bio: 'Building the future of productivity tools for remote teams. Looking for feedback from product managers and operators.',
          skills: ['Product Strategy', 'Fundraising', 'Team Building'],
          currentCompany: 'StartupXYZ',
          location: 'Bangalore, India',
          yearsExperience: 6,
        },
      },
      wallet: {
        create: {
          balance: 0,
          escrowBalance: 0,
        },
      },
    },
  })

  // Create professional user 1
  const professional1 = await prisma.user.upsert({
    where: { email: 'alex@coffeeforfeedback.com' },
    update: {},
    create: {
      email: 'alex@coffeeforfeedback.com',
      name: 'Alex Kumar',
      role: 'PROFESSIONAL',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      emailVerified: new Date(),
      profile: {
        create: {
          headline: 'Senior Product Manager at Razorpay',
          bio: '8+ years building B2B SaaS products. Expertise in payments, fintech, and enterprise software. Love helping early-stage founders validate their ideas.',
          skills: ['B2B SaaS', 'Fintech', 'Product Management', 'User Research'],
          currentCompany: 'Razorpay',
          location: 'Bangalore, India',
          yearsExperience: 8,
          isVerified: true,
          verifiedAt: new Date(),
          totalInterviews: 12,
          avgRating: 4.8,
          completionRate: 95,
          linkedinUrl: 'https://linkedin.com/in/alexkumar',
        },
      },
      wallet: {
        create: {
          balance: 1200000, // ₹12,000 in paise
          escrowBalance: 0,
        },
      },
    },
  })

  // Create professional user 2
  const professional2 = await prisma.user.upsert({
    where: { email: 'priya@coffeeforfeedback.com' },
    update: {},
    create: {
      email: 'priya@coffeeforfeedback.com',
      name: 'Priya Sharma',
      role: 'PROFESSIONAL',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
      emailVerified: new Date(),
      profile: {
        create: {
          headline: 'UX Designer at CRED',
          bio: '6 years crafting delightful experiences for consumer apps. Passionate about design systems and user research. Available for product feedback sessions.',
          skills: ['UX Design', 'User Research', 'Design Systems', 'Consumer Apps'],
          currentCompany: 'CRED',
          location: 'Mumbai, India',
          yearsExperience: 6,
          isVerified: true,
          verifiedAt: new Date(),
          totalInterviews: 8,
          avgRating: 4.9,
          completionRate: 100,
          linkedinUrl: 'https://linkedin.com/in/priyasharma',
        },
      },
      wallet: {
        create: {
          balance: 800000, // ₹8,000 in paise
          escrowBalance: 0,
        },
      },
    },
  })

  // Create professional user 3
  const professional3 = await prisma.user.upsert({
    where: { email: 'raj@coffeeforfeedback.com' },
    update: {},
    create: {
      email: 'raj@coffeeforfeedback.com',
      name: 'Raj Patel',
      role: 'PROFESSIONAL',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raj',
      emailVerified: new Date(),
      profile: {
        create: {
          headline: 'Engineering Lead at Zerodha',
          bio: '10 years building scalable systems. Expertise in fintech infrastructure and trading platforms. Happy to share technical insights.',
          skills: ['Backend Engineering', 'System Design', 'Fintech', 'Trading Systems'],
          currentCompany: 'Zerodha',
          location: 'Bangalore, India',
          yearsExperience: 10,
          isVerified: true,
          verifiedAt: new Date(),
          totalInterviews: 5,
          avgRating: 4.6,
          completionRate: 100,
          linkedinUrl: 'https://linkedin.com/in/rajpatel',
        },
      },
      wallet: {
        create: {
          balance: 500000, // ₹5,000 in paise
          escrowBalance: 0,
        },
      },
    },
  })

  // Create sample active project
  const project1 = await prisma.project.upsert({
    where: { id: 'sample-project-1' },
    update: {},
    create: {
      id: 'sample-project-1',
      creatorId: founder.id,
      title: 'Validate New Task Management Feature',
      description: `We're building a collaborative task management feature for remote teams. Looking for product managers and team leads who:

- Have experience with project management tools (Asana, Linear, Notion, etc.)
- Work in remote/hybrid teams
- Manage 3+ person teams
- Deal with cross-functional projects

We want to understand:
1. Current pain points with existing tools
2. Workflows around task assignment and tracking
3. Communication patterns within teams
4. Feature prioritization preferences

The interview will be conversational - we'll share our prototype and get your honest feedback.`,
      targetPersona: 'Product Managers and Team Leads at tech companies',
      interviewDuration: 45,
      totalPoolAmount: 500000, // ₹5,000
      numParticipants: 5,
      perParticipantPay: 100000, // ₹1,000
      status: 'ACTIVE',
      escrowPaid: true,
      escrowAmount: 500000,
      publishedAt: new Date(),
      questionsPreview: `Sample questions:
- What tools do you currently use for task management?
- What's the biggest pain point in your current workflow?
- How do you handle task assignments across teams?
- What features would make your life easier?`,
    },
  })

  // Create sample draft project
  const project2 = await prisma.project.upsert({
    where: { id: 'sample-project-2' },
    update: {},
    create: {
      id: 'sample-project-2',
      creatorId: founder.id,
      title: 'Healthcare App User Research',
      description: `Building a telemedicine platform. Need feedback from healthcare professionals and patients about their experience with virtual consultations.`,
      targetPersona: 'Doctors, nurses, or patients who have used telemedicine',
      interviewDuration: 30,
      totalPoolAmount: 300000, // ₹3,000
      numParticipants: 3,
      perParticipantPay: 100000, // ₹1,000
      status: 'DRAFT',
      escrowPaid: false,
      escrowAmount: 0,
    },
  })

  // Create sample applications to project1
  const app1 = await prisma.application.upsert({
    where: { id: 'sample-app-1' },
    update: {},
    create: {
      id: 'sample-app-1',
      projectId: project1.id,
      applicantId: professional1.id,
      coverLetter: `Hi Sarah! I'd love to participate in this interview. I've been using project management tools for 8+ years, currently leading a team of 12 at Razorpay. We recently switched from Jira to Linear and I have strong opinions about what works and what doesn't. Happy to share insights about cross-functional project workflows and team collaboration patterns.`,
      availability: 'Weekdays 6-9 PM IST, Weekends flexible',
      status: 'PENDING',
    },
  })

  const app2 = await prisma.application.upsert({
    where: { id: 'sample-app-2' },
    update: {},
    create: {
      id: 'sample-app-2',
      projectId: project1.id,
      applicantId: professional2.id,
      coverLetter: `This sounds like a great project! As a designer, I've been deeply involved in evaluating and implementing task management tools for design teams. I can share perspectives on UX patterns, visual organization, and how different tools affect team collaboration. Would be happy to test your prototype!`,
      availability: 'Weekdays after 7 PM, Weekends mornings',
      status: 'PENDING',
    },
  })

  const app3 = await prisma.application.upsert({
    where: { id: 'sample-app-3' },
    update: {},
    create: {
      id: 'sample-app-3',
      projectId: project1.id,
      applicantId: professional3.id,
      coverLetter: `Interesting! I manage engineering teams and we use a combination of Linear + Notion. I can provide technical perspective on integration requirements, API expectations, and developer workflow considerations. Let me know if that's valuable for your research.`,
      availability: 'Flexible - just give me 24h notice',
      status: 'PENDING',
    },
  })

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@coffeeforfeedback.com' },
    update: {},
    create: {
      email: 'admin@coffeeforfeedback.com',
      name: 'Admin User',
      role: 'ADMIN',
      emailVerified: new Date(),
      profile: {
        create: {
          headline: 'Platform Administrator',
        },
      },
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log('\n📊 Summary:')
  console.log(`- Created ${4} users (1 founder, 3 professionals, 1 admin)`)
  console.log(`- Created ${2} projects (1 active, 1 draft)`)
  console.log(`- Created ${3} applications to active project`)
  console.log('\n🔐 Test Credentials:')
  console.log('Founder: founder@coffeeforfeedback.com')
  console.log('Professional 1: alex@coffeeforfeedback.com')
  console.log('Professional 2: priya@coffeeforfeedback.com')
  console.log('Professional 3: raj@coffeeforfeedback.com')
  console.log('Admin: admin@coffeeforfeedback.com')
  console.log('\n🌐 Next Steps:')
  console.log('1. Run: npm run dev')
  console.log('2. Visit: http://localhost:3000')
  console.log('3. Sign in with Google (any email)')
  console.log('4. Explore the platform!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
