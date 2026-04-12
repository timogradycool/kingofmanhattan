import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

const createSchema = z.object({
  name: z.string().min(1),
  subject: z.string().optional(),
  body: z.string().optional(),
  type: z.string().optional(),
})

export async function GET(_req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const templates = await db.template.findMany({
    where: { organizationId: session.organizationId },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(templates)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const data = createSchema.parse(body)

    const template = await db.template.create({
      data: {
        organizationId: session.organizationId,
        name: data.name,
        subject: data.subject,
        bodyHtml: data.body,
        category: data.type,
      },
    })

    return NextResponse.json(template, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', issues: err.issues }, { status: 400 })
    }
    console.error('[TEMPLATES POST]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
