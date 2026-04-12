import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

const createSchema = z.object({
  name: z.string().min(1),
  subject: z.string().optional(),
  previewText: z.string().optional(),
  bodyHtml: z.string().optional(),
  bodyText: z.string().optional(),
  segmentId: z.string().optional(),
  locationId: z.string().optional(),
  objective: z.string().optional(),
  offer: z.string().optional(),
  ctaText: z.string().optional(),
  ctaUrl: z.string().optional(),
  fromName: z.string().optional(),
  fromEmail: z.string().optional(),
  tonePreset: z.string().optional(),
  scheduledAt: z.string().optional(),
})

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')

  const campaigns = await db.campaign.findMany({
    where: {
      organizationId: session.organizationId,
      ...(status && { status: status as any }),
    },
    include: { segment: true, createdBy: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(campaigns)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const data = createSchema.parse(body)

    const campaign = await db.campaign.create({
      data: {
        organizationId: session.organizationId,
        createdById: session.userId,
        name: data.name,
        subject: data.subject,
        previewText: data.previewText,
        bodyHtml: data.bodyHtml,
        bodyText: data.bodyText,
        segmentId: data.segmentId,
        locationId: data.locationId,
        objective: data.objective,
        offer: data.offer,
        ctaText: data.ctaText,
        ctaUrl: data.ctaUrl,
        fromName: data.fromName,
        fromEmail: data.fromEmail,
        tonePreset: data.tonePreset,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        status: data.scheduledAt ? 'SCHEDULED' : 'DRAFT',
      },
    })

    return NextResponse.json(campaign, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', issues: err.issues }, { status: 400 })
    }
    console.error('[CAMPAIGNS POST]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
