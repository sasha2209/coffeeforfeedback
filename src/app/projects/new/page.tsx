import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { CreateProjectForm } from '@/components/create-project-form'

export default async function NewProjectPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold mb-4">
            Create Interview Project
          </h1>
          <p className="text-lg text-slate-600">
            Define your interview needs and connect with qualified professionals
          </p>
        </div>

        <CreateProjectForm />
      </div>
    </div>
  )
}
