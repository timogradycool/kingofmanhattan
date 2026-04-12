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
  source: z.string().optional(),
  notes: z.string().optional(),
  locationId: z.string().optional(),
})

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('q') ?? ''
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '50')
  const skip = (page - 1) * limit

  const where = {
    organizationId: session.organizationId,
    ...(search && {
      OR: [
        { firstName: { contains: search, mode: 'insensitive' as const } },
        { lastName: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
  }

  const [contacts, total] = await Promise.all([
    db.contact.findMany({
      where,
      include: { contactTags: { include: { tag: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    db.contact.count({ where }),
  ])

  return NextResponse.json({ contacts, total, page, limit })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const data = createSchema.parse(body)

    const contact = await db.contact.create({
      data: {
        organizationId: session.organizationId,
        firstName: data.firstName,
        lastName: data.lastName ?? undefined,
        email: data.email ?? undefined,
        phone: data.phone ?? undefined,
        company: data.company ?? undefined,
        source: data.source ?? undefined,
        notes: data.notes ?? undefined,
        locationId: data.locationId ?? undefined,
      },
    })

    return NextResponse.json(contact, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', issues: err.issues }, { status: 400 })
    }
    console.error('[CONTACTS POST]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
