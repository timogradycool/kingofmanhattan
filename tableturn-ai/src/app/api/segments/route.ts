import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  filters: z.record(z.string(), z.any()).optional(),
})

export async function GET(_req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const segments = await db.segment.findMany({
    where: { organizationId: session.organizationId },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(segments)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const data = createSchema.parse(body)

    const segment = await db.segment.create({
      data: {
        organizationId: session.organizationId,
        name: data.name,
        description: data.description,
        filters: data.filters ?? {},
      },
    })

    return NextResponse.json(segment, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', issues: err.issues }, { status: 400 })
    }
    console.error('[SEGMENTS POST]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
