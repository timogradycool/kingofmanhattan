import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import Anthropic from '@anthropic-ai/sdk'

// ---------------------------------------------------------------------------
// Request schema — accepts all generation types
// ---------------------------------------------------------------------------

const schema = z.object({
  type: z.enum([
    'subject_lines',
    'email_copy',
    'lead_summary',
    'event_followup',
    'contact_followup',
  ]),
  context: z.record(z.string(), z.unknown()),
})

// ---------------------------------------------------------------------------
// Mock fallback (used when ANTHROPIC_API_KEY is absent)
// ---------------------------------------------------------------------------

function generateMockResponse(
  type: string,
  context: Record<string, unknown>,
): Record<string, unknown> {
  const restaurantName = (context.restaurantName as string | undefined) ?? 'our restaurant'
  const offer = (context.offer as string | undefined) ?? 'a special evening'
  const guestName = (context.guestName as string | undefined) ?? '[Guest]'
  const contactName = (context.contactName as string | undefined) ?? '[Name]'
  const eventName = (context.eventName as string | undefined) ?? 'your event'

  if (type === 'subject_lines') {
    return {
      suggestions: [
        `Tonight only: ${offer} at ${restaurantName}`,
        `We saved you a table — ${offer} inside`,
        `[First Name], this one's for you`,
        `A special invite from ${restaurantName}`,
        `Don't miss out — ${offer}`,
      ],
    }
  }

  if (type === 'email_copy') {
    return {
      html: `<p>Hi [First Name],</p><p>We have something special planned and wanted you to be the first to know.</p><p>${offer}. Just for our most valued guests.</p><p>Reserve your spot before it fills up — we'd love to see you.</p><p>Warm regards,<br/>The Team at ${restaurantName}</p>`,
    }
  }

  if (type === 'lead_summary') {
    return {
      summary: `${contactName} submitted an inquiry via ${(context.source as string | undefined) ?? 'the website'}. Based on the information provided, this appears to be a qualified opportunity. Recommended next action: reach out within 2 hours while intent is high.`,
    }
  }

  if (type === 'event_followup') {
    return {
      subject: `Thank you for attending ${eventName}`,
      body: `Hi ${guestName},\n\nThank you for joining us at ${eventName}. It was wonderful to have you with us.\n\nWe hope you had a memorable experience and would love to host you again soon.\n\nWarm regards,\nThe Team at ${restaurantName}`,
    }
  }

  if (type === 'contact_followup') {
    return {
      subject: `We miss you at ${restaurantName}`,
      body: `Hi ${contactName},\n\nIt's been a while since we've seen you, and we wanted to reach out personally. We'd love to welcome you back.\n\nWarm regards,\nThe Team at ${restaurantName}`,
    }
  }

  return { result: 'Generated content based on your inputs.' }
}

// ---------------------------------------------------------------------------
// Prompt builders
// ---------------------------------------------------------------------------

function buildSystemPrompt(type: string): string {
  if (type === 'subject_lines') {
    return 'You are an experienced restaurant email marketer who specialises in writing high-converting email subject lines. You write concise, compelling, and personalised subject lines that drive opens.'
  }
  if (type === 'email_copy') {
    return 'You are an expert restaurant copywriter. You write warm, persuasive HTML email bodies that feel personal and drive action. Return only the inner HTML content — no <html>, <head>, or <body> wrapper tags.'
  }
  if (type === 'lead_summary') {
    return 'You are a sales intelligence assistant for a restaurant group. You write clear, concise lead summaries that help the sales team quickly understand and prioritise incoming enquiries.'
  }
  if (type === 'event_followup') {
    return 'You are a hospitality communications specialist. You write warm, personalised post-event follow-up emails that strengthen the relationship with private dining guests and encourage future bookings.'
  }
  if (type === 'contact_followup') {
    return 'You are a guest relations specialist for an upscale restaurant. You write personalised re-engagement emails that feel genuine and entice lapsed guests to return.'
  }
  return 'You are a helpful restaurant marketing assistant.'
}

function buildUserPrompt(type: string, context: Record<string, unknown>): string {
  if (type === 'subject_lines') {
    const { restaurantName, campaignGoal, audience } = context
    return `Generate exactly 5 email subject line options for the following campaign.

Restaurant: ${restaurantName ?? 'N/A'}
Campaign goal: ${campaignGoal ?? 'N/A'}
Target audience: ${audience ?? 'N/A'}

Return ONLY a valid JSON array of 5 strings — no explanation, no markdown fences, just the raw JSON array.
Example format: ["Subject 1", "Subject 2", "Subject 3", "Subject 4", "Subject 5"]`
  }

  if (type === 'email_copy') {
    const { restaurantName, campaignGoal, audience, subjectLine, tone } = context
    return `Write a full HTML email body for the following campaign.

Restaurant: ${restaurantName ?? 'N/A'}
Campaign goal: ${campaignGoal ?? 'N/A'}
Audience: ${audience ?? 'N/A'}
Subject line: ${subjectLine ?? 'N/A'}
Tone: ${tone ?? 'warm and professional'}

Return ONLY the inner HTML content (paragraphs, headings, links) — no <html>, <head>, or <body> tags. Use [First Name] as the personalisation placeholder.`
  }

  if (type === 'lead_summary') {
    const { leadName, source, notes, activities } = context
    const activitiesList = Array.isArray(activities)
      ? (activities as string[]).map((a, i) => `${i + 1}. ${a}`).join('\n')
      : 'None recorded'
    return `Write a 2–3 sentence AI summary of the following lead for the sales team.

Lead name: ${leadName ?? 'Unknown'}
Source: ${source ?? 'Unknown'}
Notes: ${notes ?? 'None'}
Activity history:
${activitiesList}

Return ONLY a valid JSON object with a single key "summary" containing the summary string.
Example format: {"summary": "..."}`
  }

  if (type === 'event_followup') {
    const { eventName, guestName, guestEmail, eventDate, guestCount, notes } = context
    return `Write a personalised post-event follow-up email for the following private dining guest.

Event name: ${eventName ?? 'N/A'}
Guest name: ${guestName ?? 'N/A'}
Guest email: ${guestEmail ?? 'N/A'}
Event date: ${eventDate ?? 'N/A'}
Guest count: ${guestCount ?? 'N/A'}
Additional notes: ${notes ?? 'None'}

Return ONLY a valid JSON object with keys "subject" (string) and "body" (string, plain text with \\n for line breaks).
Example format: {"subject": "...", "body": "..."}`
  }

  if (type === 'contact_followup') {
    const { contactName, lastVisit, visitCount, preferences } = context
    return `Write a personalised re-engagement email for the following lapsed guest.

Guest name: ${contactName ?? 'N/A'}
Last visit: ${lastVisit ?? 'N/A'}
Total visits: ${visitCount ?? 'N/A'}
Known preferences: ${preferences ?? 'None recorded'}

Return ONLY a valid JSON object with keys "subject" (string) and "body" (string, plain text with \\n for line breaks).
Example format: {"subject": "...", "body": "..."}`
  }

  return 'Please generate appropriate content.'
}

// ---------------------------------------------------------------------------
// Parse Claude's text response into the expected return shape
// ---------------------------------------------------------------------------

function parseClaudeResponse(
  type: string,
  text: string,
): Record<string, unknown> {
  // Strip any accidental markdown code fences
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim()

  if (type === 'subject_lines') {
    const parsed = JSON.parse(cleaned)
    return { suggestions: Array.isArray(parsed) ? parsed : parsed.suggestions }
  }

  if (type === 'email_copy') {
    // The model returns raw HTML — wrap it
    return { html: cleaned }
  }

  // All remaining types expect a JSON object
  const parsed = JSON.parse(cleaned)
  return parsed as Record<string, unknown>
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { type, context } = schema.parse(body)

    const apiKey = process.env.ANTHROPIC_API_KEY
    const hasRealKey = Boolean(apiKey && apiKey !== 'your-anthropic-api-key')

    if (!hasRealKey) {
      // Fall back to mock responses
      const result = generateMockResponse(type, context as Record<string, unknown>)
      return NextResponse.json(result)
    }

    // --- Real Anthropic API call ---
    const anthropic = new Anthropic({ apiKey })

    const isShortOutput = type === 'subject_lines' || type === 'lead_summary'
    const maxTokens = isShortOutput ? 1024 : 2048

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: maxTokens,
      system: [
        {
          type: 'text',
          text: buildSystemPrompt(type),
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: buildUserPrompt(type, context as Record<string, unknown>),
        },
      ],
    })

    const textBlock = response.content.find((b) => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text content in Anthropic response')
    }

    const result = parseClaudeResponse(type, textBlock.text)
    return NextResponse.json(result)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request', issues: err.issues }, { status: 400 })
    }
    console.error('[AI GENERATE]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
