import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

const createSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  type: z.string().default('GENERAL_INQUIRY'),
  source: z.string().optional(),
  sourcePlatform: z.string().optional(),
  notes: z.string().optional(),
  partySize: z.number().optional(),
  estimatedValue: z.number().optional(),
  preferredDate: z.string().optional(),
  locationId: z.string().optional(),
})

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')

  const leads = await db.lead.findMany({
    where: {
      organizationId: session.organizationId,
      ...(status ? { status: status as any } : {}),
    },
    include: {
      assignedTo: { select: { id: true, name: true } },
      activities: { orderBy: { createdAt: 'desc' }, take: 5 },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(leads)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const data = createSchema.parse(body)

    const lead = await db.lead.create({
      data: {
        organizationId: session.organizationId,
        firstName: data.firstName,
        lastName: data.lastName ?? undefined,
        email: data.email ?? undefined,
        phone: data.phone ?? undefined,
        company: data.company ?? undefined,
        type: data.type as any,
        status: 'NEW',
        source: data.source ?? undefined,
        sourcePlatform: data.sourcePlatform ?? undefined,
        notes: data.notes ?? undefined,
        partySize: data.partySize ?? undefined,
        estimatedValue: data.estimatedValue ?? undefined,
        preferredDate: data.preferredDate ? new Date(data.preferredDate) : undefined,
        locationId: data.locationId ?? undefined,
      },
    })

    return NextResponse.json(lead, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', issues: err.issues }, { status: 400 })
    }
    console.error('[LEADS POST]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
