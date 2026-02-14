import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, DollarSign, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react'

async function getUserDashboardData(userId: string, role: string) {
  if (role === 'FOUNDER') {
    const projects = await prisma.project.findMany({
      where: { creatorId: userId },
      include: {
        _count: {
          select: {
            applications: true,
            interviews: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    const stats = await prisma.project.aggregate({
      where: { creatorId: userId },
      _count: true,
      _sum: {
        totalPoolAmount: true,
      },
    })

    return { projects, stats, role: 'FOUNDER' }
  } else {
    const applications = await prisma.application.findMany({
      where: { applicantId: userId },
      include: {
        project: {
          select: {
            title: true,
            perParticipantPay: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    const interviews = await prisma.interview.findMany({
      where: { professionalId: userId },
      include: {
        project: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { scheduledAt: 'desc' },
      take: 10,
    })

    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    })

    return { applications, interviews, wallet, role: 'PROFESSIONAL' }
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/api/auth/signin')
  }

  const data = await getUserDashboardData(session.user.id, session.user.role)

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2">
              Dashboard
            </h1>
            <p className="text-slate-600">
              Welcome back, {session.user.name || session.user.email}
            </p>
          </div>
          {data.role === 'FOUNDER' ? (
            <Link href="/projects/new">
              <Button size="lg">
                Create New Project
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/browse">
              <Button size="lg">
                Browse Projects
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>

        {data.role === 'FOUNDER' ? (
          <FounderDashboard data={data} />
        ) : (
          <ProfessionalDashboard data={data} />
        )}
      </div>
    </div>
  )
}

function FounderDashboard({ data }: any) {
  return (
    <>
      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-purple-600" />
            <span className="text-sm text-slate-500">Total Projects</span>
          </div>
          <div className="text-3xl font-bold">{data.stats._count}</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-green-600" />
            <span className="text-sm text-slate-500">Total Spent</span>
          </div>
          <div className="text-3xl font-bold">
            {formatCurrency(data.stats._sum.totalPoolAmount || 0)}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-blue-600" />
            <span className="text-sm text-slate-500">Interviews</span>
          </div>
          <div className="text-3xl font-bold">
            {data.projects.reduce((sum: number, p: any) => sum + p._count.interviews, 0)}
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-display font-semibold">Your Projects</h2>
        </div>
        <div className="divide-y divide-slate-200">
          {data.projects.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-slate-400" />
              <p>No projects yet. Create your first one!</p>
            </div>
          ) : (
            data.projects.map((project: any) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block p-6 hover:bg-slate-50 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{project.title}</h3>
                    <p className="text-sm text-slate-600 mb-3 line-clamp-1">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {project._count.applications} applications
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        {project._count.interviews} interviews
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-6">
                    <StatusBadge status={project.status} />
                    <div className="text-sm text-slate-500 mt-2">
                      {formatRelativeTime(project.createdAt)}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  )
}

function ProfessionalDashboard({ data }: any) {
  return (
    <>
      {/* Wallet */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-8 text-white mb-8">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-purple-200 mb-2">Your Earnings</p>
            <div className="text-5xl font-bold mb-1">
              {formatCurrency(data.wallet?.balance || 0)}
            </div>
            <p className="text-sm text-purple-200">
              Escrow: {formatCurrency(data.wallet?.escrowBalance || 0)}
            </p>
          </div>
          <Button variant="secondary" size="lg">
            Withdraw
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-orange-600" />
            <span className="text-sm text-slate-500">Applications</span>
          </div>
          <div className="text-3xl font-bold">{data.applications.length}</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <span className="text-sm text-slate-500">Interviews</span>
          </div>
          <div className="text-3xl font-bold">{data.interviews.length}</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-blue-600" />
            <span className="text-sm text-slate-500">Avg Payout</span>
          </div>
          <div className="text-3xl font-bold">₹1,000</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-display font-semibold">Recent Applications</h2>
          </div>
          <div className="divide-y divide-slate-200">
            {data.applications.slice(0, 5).map((app: any) => (
              <div key={app.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium mb-1">{app.project.title}</h3>
                    <p className="text-sm text-slate-500">
                      {formatRelativeTime(app.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-display font-semibold">Upcoming Interviews</h2>
          </div>
          <div className="divide-y divide-slate-200">
            {data.interviews.slice(0, 5).map((interview: any) => (
              <div key={interview.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium mb-1">{interview.project.title}</h3>
                    <p className="text-sm text-slate-500">
                      {interview.scheduledAt
                        ? new Date(interview.scheduledAt).toLocaleString()
                        : 'Not scheduled'}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    {formatCurrency(interview.payoutAmount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    DRAFT: 'bg-slate-100 text-slate-700',
    ACTIVE: 'bg-green-100 text-green-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-purple-100 text-purple-700',
    PENDING: 'bg-orange-100 text-orange-700',
    ACCEPTED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || styles.DRAFT}`}>
      {status.replace('_', ' ')}
    </span>
  )
}
