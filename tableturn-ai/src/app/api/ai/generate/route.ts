import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'

const schema = z.object({
  type: z.enum(['campaign_copy', 'subject_lines', 'event_followup', 'lead_summary', 'segment_summary']),
  context: z.object({
    campaignType: z.string().optional(),
    objective: z.string().optional(),
    offer: z.string().optional(),
    tone: z.string().optional(),
    archetype: z.string().optional(),
    locationName: z.string().optional(),
    segmentName: z.string().optional(),
    contactName: z.string().optional(),
    notes: z.string().optional(),
  }),
})

// Mock AI responses — replace with real Anthropic API call when key is available
function generateMockResponse(type: string, context: Record<string, string | undefined>): Record<string, unknown> {
  const tone = context.tone ?? 'polished'
  const location = context.locationName ?? 'our restaurant'
  const offer = context.offer ?? 'a special evening'

  if (type === 'subject_lines') {
    return {
      suggestions: [
        `Tonight only: ${offer} at ${location}`,
        `We saved you a table — ${offer} inside`,
        `[First Name], this one's for you 🍷`,
      ],
    }
  }

  if (type === 'campaign_copy') {
    return {
      subject: `Your invitation: ${offer} at ${location}`,
      body: `Hi [First Name],\n\nWe have something special planned and wanted you to be the first to know.\n\n${offer}. Just for our most valued guests.\n\nReserve your spot before it fills up — we'd love to see you.\n\n[CTA Button]\n\nWarm regards,\nThe Team at ${location}`,
    }
  }

  if (type === 'event_followup') {
    return {
      subject: `Your private dining inquiry at ${location}`,
      body: `Hi ${context.contactName ?? '[Name]'},\n\nThank you for reaching out about hosting your event at ${location}. We'd love to make it a memorable evening.\n\nI'd like to schedule a brief call to discuss your vision, preferred dates, and how we can customize the experience for your group.\n\nAre you available this week for a quick conversation?\n\nBest,\n[Your Name]\nPrivate Events, ${location}`,
    }
  }

  if (type === 'lead_summary') {
    return {
      summary: `${context.contactName ?? 'This lead'} submitted an inquiry via ${context.notes ?? 'the website'}. Based on the information provided, this appears to be a qualified opportunity. Recommended next action: reach out within 2 hours while intent is high.`,
      priority: 'high',
      nextAction: 'Call or email within 2 hours',
    }
  }

  return { result: 'Generated content based on your inputs.' }
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { type, context } = schema.parse(body)

    // Check for Anthropic API key — use real API if available
    const anthropicKey = process.env.ANTHROPIC_API_KEY
    if (anthropicKey && anthropicKey !== 'your-anthropic-api-key') {
      // Real Anthropic API call would go here
      // For now, fall through to mock
    }

    const result = generateMockResponse(type, context)
    return NextResponse.json(result)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request', issues: err.issues }, { status: 400 })
    }
    console.error('[AI GENERATE]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
