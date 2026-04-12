import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

const createSchema = z.object({
  contactName: z.string().min(1),
  company: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  occasion: z.string().optional(),
  requestedDate: z.string().optional(),
  partySize: z.number().optional(),
  budgetMin: z.number().optional(),
  budgetMax: z.number().optional(),
  notes: z.string().optional(),
  source: z.string().optional(),
  locationId: z.string().optional(),
})

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const events = await db.privateEventInquiry.findMany({
    where: { organizationId: session.organizationId },
    include: { assignedTo: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(events)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const data = createSchema.parse(body)

    const event = await db.privateEventInquiry.create({
      data: {
        organizationId: session.organizationId,
        contactName: data.contactName,
        company: data.company,
        email: data.email || null,
        phone: data.phone,
        occasion: data.occasion,
        requestedDate: data.requestedDate ? new Date(data.requestedDate) : null,
        partySize: data.partySize,
        budgetMin: data.budgetMin,
        budgetMax: data.budgetMax,
        notes: data.notes,
        source: data.source,
        locationId: data.locationId,
        stage: 'NEW_INQUIRY',
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', issues: err.issues }, { status: 400 })
    }
    console.error('[PRIVATE-EVENTS POST]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
