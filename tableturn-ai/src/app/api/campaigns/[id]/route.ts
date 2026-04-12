import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  subject: z.string().optional(),
  status: z.string().optional(),
  scheduledAt: z.string().optional(),
})

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const campaign = await db.campaign.findFirst({
    where: { id, organizationId: session.organizationId },
    include: {
      _count: { select: { recipients: true } },
    },
  })

  if (!campaign) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(campaign)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const existing = await db.campaign.findFirst({
    where: { id, organizationId: session.organizationId },
  })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  try {
    const body = await req.json()
    const data = updateSchema.parse(body)

    const campaign = await db.campaign.update({
      where: { id },
      data: {
        name: data.name,
        subject: data.subject,
        status: data.status as any,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
      },
    })

    return NextResponse.json(campaign)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', issues: err.issues }, { status: 400 })
    }
    console.error('[CAMPAIGNS PATCH]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const existing = await db.campaign.findFirst({
    where: { id, organizationId: session.organizationId },
  })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (existing.status !== 'DRAFT') {
    return NextResponse.json(
      { error: 'Only DRAFT campaigns can be deleted' },
      { status: 400 }
    )
  }

  await db.campaign.delete({ where: { id } })

  return new NextResponse(null, { status: 204 })
}
