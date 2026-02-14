import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      description,
      targetPersona,
      interviewDuration,
      totalPoolAmount,
      numParticipants,
      perParticipantPay,
    } = body

    // Validation
    if (!title || !description || !targetPersona) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create project in DRAFT status
    const project = await prisma.project.create({
      data: {
        creatorId: session.user.id,
        title,
        description,
        targetPersona,
        interviewDuration,
        totalPoolAmount,
        numParticipants,
        perParticipantPay,
        status: 'DRAFT',
        escrowPaid: false,
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
