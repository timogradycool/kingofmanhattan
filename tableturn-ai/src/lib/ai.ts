// Re-export types for use in pages
export type GenerationType =
  | 'subject_lines'
  | 'email_copy'
  | 'lead_summary'
  | 'event_followup'
  | 'contact_followup'

export type GenerateRequest = { type: GenerationType; context: Record<string, unknown> }

export async function generateAI(req: GenerateRequest): Promise<Record<string, unknown>> {
  const res = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
  if (!res.ok) throw new Error('AI generation failed')
  return res.json()
}
