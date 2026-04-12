import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

const updateSchema = z.object({
  stage: z.string().optional(),
  notes: z.string().optional(),
  estimatedValue: z.number().optional(),
  eventDate: z.string().optional(),
  eventType: z.string().optional(),
  guestCount: z.number().int().optional(),
})

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const event = await db.privateEventInquiry.findFirst({
    where: { id, organizationId: session.organizationId },
    include: {
      activities: { orderBy: { createdAt: 'desc' } },
    },
  })

  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(event)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const existing = await db.privateEventInquiry.findFirst({
    where: { id, organizationId: session.organizationId },
  })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  try {
    const body = await req.json()
    const data = updateSchema.parse(body)

    const event = await db.privateEventInquiry.update({
      where: { id },
      data: {
        stage: data.stage as any,
        notes: data.notes,
        estimatedValue: data.estimatedValue,
        requestedDate: data.eventDate ? new Date(data.eventDate) : undefined,
        occasion: data.eventType,
        partySize: data.guestCount,
      },
    })

    return NextResponse.json(event)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', issues: err.issues }, { status: 400 })
    }
    console.error('[PRIVATE-EVENTS PATCH]', err)
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

  const existing = await db.privateEventInquiry.findFirst({
    where: { id, organizationId: session.organizationId },
  })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await db.privateEventInquiry.delete({ where: { id } })

  return new NextResponse(null, { status: 204 })
}
