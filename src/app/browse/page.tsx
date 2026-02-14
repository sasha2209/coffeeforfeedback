import { prisma } from '@/lib/prisma'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Clock, Users, DollarSign } from 'lucide-react'

async function getActiveProjects() {
  return await prisma.project.findMany({
    where: {
      status: 'ACTIVE',
    },
    include: {
      creator: {
        select: {
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          applications: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export default async function BrowsePage() {
  const projects = await getActiveProjects()

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-display font-bold mb-4">
            Browse Interview Opportunities
          </h1>
          <p className="text-lg text-slate-600">
            Get paid to share your expertise with startup founders
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-slate-300">
            <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No active projects yet</h3>
            <p className="text-slate-600">Check back soon for new interview opportunities!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block"
              >
                <div className="bg-white rounded-xl p-6 border border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all card-hover">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-display font-semibold mb-2">
                        {project.title}
                      </h3>
                      <p className="text-slate-600 mb-4 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                        {project.targetPersona}
                      </div>
                    </div>
                    
                    <div className="ml-6 text-right">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        {formatCurrency(project.perParticipantPay)}
                      </div>
                      <div className="text-sm text-slate-500">
                        per interview
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-slate-600 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{project.interviewDuration} minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>
                        {project._count.applications} applied · {project.numParticipants} spots
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span>Total pool: {formatCurrency(project.totalPoolAmount)}</span>
                    </div>
                    <div className="ml-auto text-xs text-slate-500">
                      Posted {formatRelativeTime(project.createdAt)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
