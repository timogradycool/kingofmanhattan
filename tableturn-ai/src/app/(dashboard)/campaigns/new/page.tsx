'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Sparkles,
  Users,
  Mail,
  Settings,
  Eye,
  Send,
  AlertTriangle,
  CheckCircle2,
  CalendarDays,
  Clock,
  X,
} from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { PageShell } from '@/components/layout/page-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from '@/components/ui/dialog'

// ─── Types ───────────────────────────────────────────────────────────────────

type StepKey = 'setup' | 'audience' | 'content' | 'review' | 'send'

interface StepDef {
  key: StepKey
  label: string
  icon: React.ReactNode
}

const STEPS: StepDef[] = [
  { key: 'setup', label: 'Setup', icon: <Settings className="h-4 w-4" /> },
  { key: 'audience', label: 'Audience', icon: <Users className="h-4 w-4" /> },
  { key: 'content', label: 'Content', icon: <Mail className="h-4 w-4" /> },
  { key: 'review', label: 'Review', icon: <Eye className="h-4 w-4" /> },
  { key: 'send', label: 'Send', icon: <Send className="h-4 w-4" /> },
]

const STEP_KEYS: StepKey[] = STEPS.map(s => s.key)

// ─── Mock Data ────────────────────────────────────────────────────────────────

interface Segment {
  id: string
  name: string
  count: number
  description: string
}

const MOCK_SEGMENTS: Segment[] = [
  { id: 'all', name: 'All Subscribed Contacts', count: 3201, description: 'Everyone who has opted in' },
  { id: 'vip', name: 'VIP Guests', count: 412, description: 'Top spenders & frequent visitors' },
  { id: 'birthday', name: 'Birthday This Month', count: 87, description: 'Contacts with birthdays in April' },
  { id: 'lapsed', name: 'Lapsed 90+ Days', count: 648, description: "Guests who haven't visited in 90+ days" },
  { id: 'happy-hour', name: 'Happy Hour Regulars', count: 1240, description: 'Frequent visitors during happy hour' },
  { id: 'brunch', name: 'Brunch Subscribers', count: 1100, description: 'Contacts interested in brunch' },
  { id: 'private-events', name: 'Private Events Interest', count: 340, description: 'Contacts who enquired about events' },
  { id: 'newsletter', name: 'Newsletter Subscribers', count: 2800, description: 'General newsletter list' },
]

const AI_SUBJECT_SUGGESTIONS = [
  "You're invited — exclusive happy hour just for you",
  'A special offer from us to you this week',
  "It's been a while. We'd love to have you back.",
]

const AI_GENERATED_EMAIL = `Hi {{first_name}},

We've been thinking about you — and we'd love to see you back at the table.

This week, we're rolling out a special offer just for our guests: enjoy 20% off your next visit when you dine with us Sunday through Thursday.

Whether it's a quiet dinner for two or a night out with friends, we've got the perfect table waiting for you.

👉 Reserve your spot now — offer valid through April 30.

Warmly,
The Team at King of Manhattan`

// ─── Form State ───────────────────────────────────────────────────────────────

interface FormData {
  // Step 1 — Setup
  campaignName: string
  campaignType: string
  objective: string
  targetLocation: string
  offerIncentive: string
  ctaText: string
  ctaUrl: string
  notes: string
  // Step 2 — Audience
  selectedSegmentId: string
  // Step 3 — Content
  subjectLine: string
  previewText: string
  fromName: string
  fromEmail: string
  emailBody: string
  // Step 5 — Send
  scheduleType: 'now' | 'later'
  scheduleDate: string
  scheduleTime: string
}

const INITIAL_FORM: FormData = {
  campaignName: '',
  campaignType: '',
  objective: '',
  targetLocation: '',
  offerIncentive: '',
  ctaText: '',
  ctaUrl: '',
  notes: '',
  selectedSegmentId: '',
  subjectLine: '',
  previewText: '',
  fromName: 'King of Manhattan',
  fromEmail: 'hello@kingofmanhattan.com',
  emailBody: '',
  scheduleType: 'now',
  scheduleDate: '',
  scheduleTime: '',
}

// ─── Step Progress ────────────────────────────────────────────────────────────

function StepProgress({
  currentStep,
  completedSteps,
}: {
  currentStep: StepKey
  completedSteps: Set<StepKey>
}) {
  const currentIndex = STEP_KEYS.indexOf(currentStep)

  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, idx) => {
        const isCompleted = completedSteps.has(step.key)
        const isCurrent = step.key === currentStep
        const isPast = idx < currentIndex

        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={[
                  'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all',
                  isCompleted || isPast
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : isCurrent
                    ? 'border-indigo-600 bg-white text-indigo-600'
                    : 'border-zinc-200 bg-white text-zinc-400',
                ].join(' ')}
              >
                {isCompleted || isPast ? <Check className="h-4 w-4" /> : idx + 1}
              </div>
              <span
                className={[
                  'text-xs font-medium',
                  isCurrent ? 'text-indigo-600' : isPast || isCompleted ? 'text-zinc-700' : 'text-zinc-400',
                ].join(' ')}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={[
                  'mb-5 mx-2 h-0.5 w-12',
                  isPast || isCompleted ? 'bg-indigo-600' : 'bg-zinc-200',
                ].join(' ')}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Step 1: Setup ────────────────────────────────────────────────────────────

function StepSetup({
  form,
  onChange,
}: {
  form: FormData
  onChange: (updates: Partial<FormData>) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Campaign Setup</h2>
        <p className="mt-1 text-sm text-zinc-500">Start by giving your campaign a name and defining its purpose.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="campaignName">
            Campaign Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="campaignName"
            placeholder="e.g., Thursday Happy Hour — Week 3"
            value={form.campaignName}
            onChange={e => onChange({ campaignName: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="campaignType">Campaign Type</Label>
          <Select
            id="campaignType"
            value={form.campaignType}
            onChange={e => onChange({ campaignType: e.target.value })}
          >
            <option value="">Select a type…</option>
            <option value="Reactivation">Reactivation</option>
            <option value="Promotion">Promotion</option>
            <option value="Birthday">Birthday</option>
            <option value="Anniversary">Anniversary</option>
            <option value="Private Event">Private Event</option>
            <option value="Seasonal">Seasonal</option>
            <option value="Holiday">Holiday</option>
            <option value="Win-back">Win-back</option>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="targetLocation">Target Location</Label>
          <Select
            id="targetLocation"
            value={form.targetLocation}
            onChange={e => onChange({ targetLocation: e.target.value })}
          >
            <option value="">All Locations</option>
            <option value="midtown">Midtown — W 44th St</option>
            <option value="downtown">Downtown — Wall St</option>
            <option value="uptown">Uptown — Columbus Ave</option>
          </Select>
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="objective">Objective</Label>
          <Input
            id="objective"
            placeholder="e.g., Drive weeknight covers during slow period"
            value={form.objective}
            onChange={e => onChange({ objective: e.target.value })}
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="offerIncentive">Offer / Incentive</Label>
          <Input
            id="offerIncentive"
            placeholder="e.g., 20% off entrées Sunday–Thursday"
            value={form.offerIncentive}
            onChange={e => onChange({ offerIncentive: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ctaText">CTA Text</Label>
          <Input
            id="ctaText"
            placeholder="e.g., Reserve Your Table"
            value={form.ctaText}
            onChange={e => onChange({ ctaText: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ctaUrl">CTA URL</Label>
          <Input
            id="ctaUrl"
            type="url"
            placeholder="https://resy.com/…"
            value={form.ctaUrl}
            onChange={e => onChange({ ctaUrl: e.target.value })}
          />
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="notes">Internal Notes</Label>
          <Textarea
            id="notes"
            placeholder="Any internal context or reminders for this campaign…"
            value={form.notes}
            onChange={e => onChange({ notes: e.target.value })}
            className="min-h-[80px]"
          />
        </div>
      </div>
    </div>
  )
}

// ─── Step 2: Audience ─────────────────────────────────────────────────────────

function StepAudience({
  form,
  onChange,
}: {
  form: FormData
  onChange: (updates: Partial<FormData>) => void
}) {
  const selected = MOCK_SEGMENTS.find(s => s.id === form.selectedSegmentId)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Choose Your Audience</h2>
        <p className="mt-1 text-sm text-zinc-500">Select the segment you want to target with this campaign.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {MOCK_SEGMENTS.map(segment => {
          const isSelected = form.selectedSegmentId === segment.id
          return (
            <button
              key={segment.id}
              type="button"
              onClick={() => onChange({ selectedSegmentId: segment.id })}
              className={[
                'flex items-start gap-3 rounded-xl border p-4 text-left transition-all',
                isSelected
                  ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
                  : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50',
              ].join(' ')}
            >
              <div
                className={[
                  'mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                  isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-zinc-300',
                ].join(' ')}
              >
                {isSelected && <Check className="h-3 w-3 text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-zinc-900">{segment.name}</span>
                  <Badge variant="secondary">{segment.count.toLocaleString()}</Badge>
                </div>
                <p className="mt-0.5 text-xs text-zinc-500">{segment.description}</p>
              </div>
            </button>
          )
        })}
      </div>

      {selected && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
              <Users className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-indigo-900">
                Estimated Reach: {selected.count.toLocaleString()} contacts
              </p>
              <p className="text-xs text-indigo-600 mt-0.5">
                Segment: {selected.name}
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <div className="rounded-lg bg-white border border-indigo-200 px-3 py-1.5 text-xs text-indigo-700 font-medium">
              Subscribed only
            </div>
            <div className="rounded-lg bg-white border border-indigo-200 px-3 py-1.5 text-xs text-indigo-700 font-medium">
              Suppression list applied
            </div>
            <div className="rounded-lg bg-white border border-indigo-200 px-3 py-1.5 text-xs text-indigo-700 font-medium">
              Duplicates removed
            </div>
          </div>
        </div>
      )}

      {!selected && (
        <div className="rounded-xl border border-dashed border-zinc-300 p-6 text-center">
          <Users className="mx-auto h-8 w-8 text-zinc-300" />
          <p className="mt-2 text-sm text-zinc-500">Select a segment above to see the estimated reach.</p>
        </div>
      )}
    </div>
  )
}

// ─── AI Generate Modal ────────────────────────────────────────────────────────

function AIGenerateModal({
  open,
  onClose,
  onApply,
}: {
  open: boolean
  onClose: () => void
  onApply: (body: string) => void
}) {
  const [tone, setTone] = useState('Warm')
  const [archetype, setArchetype] = useState('Upscale')
  const [brief, setBrief] = useState('')
  const [generated, setGenerated] = useState('')
  const [loading, setLoading] = useState(false)

  function handleGenerate() {
    setLoading(true)
    setTimeout(() => {
      setGenerated(AI_GENERATED_EMAIL)
      setLoading(false)
    }, 1200)
  }

  function handleApply() {
    onApply(generated)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg" onClose={onClose}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            Generate with AI
          </DialogTitle>
          <DialogDescription>
            Choose a tone and archetype, then describe your offer and we'll write the email for you.
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-4">
          <div className="space-y-1.5">
            <Label>Tone Preset</Label>
            <div className="flex flex-wrap gap-2">
              {['Polished', 'Warm', 'Playful', 'Elegant', 'Edgy', 'Direct'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={[
                    'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                    tone === t
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300',
                  ].join(' ')}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Restaurant Archetype</Label>
            <div className="flex flex-wrap gap-2">
              {['Upscale', 'Neighborhood', 'Themed', 'Bar & Restaurant', 'Hospitality Group', 'Chef-driven'].map(a => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setArchetype(a)}
                  className={[
                    'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                    archetype === a
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300',
                  ].join(' ')}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="brief">Brief Description</Label>
            <Textarea
              id="brief"
              placeholder="Describe your offer, the occasion, or what you want guests to do…"
              value={brief}
              onChange={e => setBrief(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {generated && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
              <p className="mb-1 text-xs font-semibold text-emerald-700 uppercase tracking-wide">Generated Copy</p>
              <pre className="whitespace-pre-wrap text-xs text-zinc-700 font-sans leading-relaxed">{generated}</pre>
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {generated ? (
            <Button onClick={handleApply}>
              <Check className="h-4 w-4" />
              Use This Copy
            </Button>
          ) : (
            <Button onClick={handleGenerate} loading={loading}>
              <Sparkles className="h-4 w-4" />
              Generate Copy
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Step 3: Content ──────────────────────────────────────────────────────────

function StepContent({
  form,
  onChange,
}: {
  form: FormData
  onChange: (updates: Partial<FormData>) => void
}) {
  const [aiModalOpen, setAiModalOpen] = useState(false)

  const subjectLength = form.subjectLine.length
  const subjectColor =
    subjectLength === 0
      ? 'text-zinc-400'
      : subjectLength <= 50
      ? 'text-emerald-600'
      : subjectLength <= 70
      ? 'text-amber-500'
      : 'text-red-500'

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Email Content</h2>
          <p className="mt-1 text-sm text-zinc-500">Write your email or let AI generate it for you.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setAiModalOpen(true)}>
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          Generate with AI
        </Button>
      </div>

      {/* Subject + Preview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2 space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="subjectLine">Subject Line</Label>
            <span className={['text-xs font-medium tabular-nums', subjectColor].join(' ')}>
              {subjectLength} / 70 chars
            </span>
          </div>
          <Input
            id="subjectLine"
            placeholder="e.g., A special night is waiting for you…"
            value={form.subjectLine}
            onChange={e => onChange({ subjectLine: e.target.value })}
            maxLength={120}
          />
          {/* Subject line AI suggestions */}
          <div className="flex flex-wrap gap-2 pt-1">
            {AI_SUBJECT_SUGGESTIONS.map(suggestion => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onChange({ subjectLine: suggestion })}
                className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <Label htmlFor="previewText">Preview Text</Label>
          <Input
            id="previewText"
            placeholder="Short teaser shown in the inbox preview…"
            value={form.previewText}
            onChange={e => onChange({ previewText: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="fromName">From Name</Label>
          <Input
            id="fromName"
            value={form.fromName}
            onChange={e => onChange({ fromName: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="fromEmail">From Email</Label>
          <Input
            id="fromEmail"
            type="email"
            value={form.fromEmail}
            onChange={e => onChange({ fromEmail: e.target.value })}
          />
        </div>
      </div>

      {/* Email Body */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="emailBody">Email Body</Label>
          <span className="text-xs text-zinc-400">Supports basic HTML</span>
        </div>
        <Textarea
          id="emailBody"
          placeholder="Write your email content here. You can use {&#123;first_name&#125;} to personalize."
          value={form.emailBody}
          onChange={e => onChange({ emailBody: e.target.value })}
          className="min-h-[260px] font-mono text-xs"
        />
      </div>

      {/* Preview panel */}
      {(form.subjectLine || form.emailBody) && (
        <Card className="overflow-hidden">
          <CardHeader className="bg-zinc-50 border-b border-zinc-100 py-3 px-4">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>
              <span className="text-xs text-zinc-500 font-medium">Email Preview</span>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="max-w-md mx-auto">
              {form.subjectLine && (
                <p className="text-base font-semibold text-zinc-900 mb-1">{form.subjectLine}</p>
              )}
              {form.previewText && (
                <p className="text-xs text-zinc-400 mb-4">{form.previewText}</p>
              )}
              <div className="border-t border-zinc-100 pt-4">
                <pre className="whitespace-pre-wrap text-sm text-zinc-700 font-sans leading-relaxed">
                  {form.emailBody || <span className="text-zinc-300">Your email body will appear here…</span>}
                </pre>
              </div>
              <div className="mt-6 text-center">
                <div className="inline-block rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white">
                  Reserve Your Table
                </div>
              </div>
              <div className="mt-6 border-t border-zinc-100 pt-4 text-center">
                <p className="text-xs text-zinc-400">
                  You received this email because you&apos;re a valued guest at King of Manhattan.
                  <br />
                  <span className="underline cursor-pointer">Unsubscribe</span> · <span className="underline cursor-pointer">Manage preferences</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <AIGenerateModal
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onApply={body => onChange({ emailBody: body })}
      />
    </div>
  )
}

// ─── Step 4: Review ───────────────────────────────────────────────────────────

function StepReview({ form }: { form: FormData }) {
  const segment = MOCK_SEGMENTS.find(s => s.id === form.selectedSegmentId)
  const [testSent, setTestSent] = useState(false)

  function handleTestSend() {
    setTimeout(() => setTestSent(true), 800)
  }

  const checklist = [
    { label: 'Unsubscribe footer included', passed: true },
    { label: 'Suppression list will be applied', passed: true },
    { label: 'Test send recommended before deploying', passed: testSent },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Review Your Campaign</h2>
        <p className="mt-1 text-sm text-zinc-500">Double-check everything before scheduling or sending.</p>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Review carefully before sending</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Once a campaign is sent, it cannot be undone. Make sure your content, audience, and scheduling are correct.
          </p>
        </div>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0 divide-y divide-zinc-100">
          {[
            { label: 'Campaign Name', value: form.campaignName || '—' },
            { label: 'Campaign Type', value: form.campaignType || '—' },
            { label: 'Audience Segment', value: segment ? `${segment.name} (${segment.count.toLocaleString()} contacts)` : '—' },
            { label: 'Subject Line', value: form.subjectLine || '—' },
            { label: 'From', value: form.fromName && form.fromEmail ? `${form.fromName} <${form.fromEmail}>` : '—' },
            { label: 'Target Location', value: form.targetLocation || 'All Locations' },
            { label: 'Offer / Incentive', value: form.offerIncentive || '—' },
          ].map(row => (
            <div key={row.label} className="flex items-start justify-between py-3 gap-4">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide w-36 flex-shrink-0">{row.label}</span>
              <span className="text-sm text-zinc-900 text-right flex-1">{row.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Compliance Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {checklist.map(item => (
            <div key={item.label} className="flex items-center gap-3">
              <div
                className={[
                  'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full',
                  item.passed ? 'bg-emerald-100 text-emerald-600' : 'bg-zinc-100 text-zinc-400',
                ].join(' ')}
              >
                <Check className="h-3 w-3" />
              </div>
              <span className={['text-sm', item.passed ? 'text-zinc-700' : 'text-zinc-400'].join(' ')}>
                {item.label}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Test Send */}
      <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4">
        <div>
          <p className="text-sm font-semibold text-zinc-900">Send a Test Email</p>
          <p className="text-xs text-zinc-500 mt-0.5">Sends to {form.fromEmail} so you can preview how it looks in an inbox.</p>
        </div>
        {testSent ? (
          <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
            <CheckCircle2 className="h-4 w-4" />
            Test sent!
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={handleTestSend}>
            <Mail className="h-3.5 w-3.5" />
            Send Test to Myself
          </Button>
        )}
      </div>
    </div>
  )
}

// ─── Step 5: Send ─────────────────────────────────────────────────────────────

function StepSend({
  form,
  onChange,
  onSend,
  sent,
}: {
  form: FormData
  onChange: (updates: Partial<FormData>) => void
  onSend: () => void
  sent: boolean
}) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const segment = MOCK_SEGMENTS.find(s => s.id === form.selectedSegmentId)

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-zinc-900">Campaign Sent!</h2>
        <p className="mt-2 text-sm text-zinc-500 max-w-sm">
          <strong>{form.campaignName || 'Your campaign'}</strong> has been queued for delivery to{' '}
          {segment ? segment.count.toLocaleString() : 'your'} contacts.
        </p>
        <p className="mt-1 text-xs text-zinc-400">Results will start appearing within a few minutes.</p>
        <div className="mt-6 flex items-center gap-3">
          <Link href="/campaigns">
            <Button variant="outline">Back to Campaigns</Button>
          </Link>
          <Link href="/campaigns/c1">
            <Button>View Results</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Schedule or Send</h2>
        <p className="mt-1 text-sm text-zinc-500">Choose when to deliver your campaign.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onChange({ scheduleType: 'now' })}
          className={[
            'flex items-start gap-4 rounded-xl border p-5 text-left transition-all',
            form.scheduleType === 'now'
              ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
              : 'border-zinc-200 bg-white hover:border-zinc-300',
          ].join(' ')}
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100">
            <Send className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <p className="font-semibold text-zinc-900">Send Now</p>
            <p className="mt-0.5 text-xs text-zinc-500">
              Deliver immediately to all {segment?.count.toLocaleString() ?? '—'} contacts in this segment.
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onChange({ scheduleType: 'later' })}
          className={[
            'flex items-start gap-4 rounded-xl border p-5 text-left transition-all',
            form.scheduleType === 'later'
              ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
              : 'border-zinc-200 bg-white hover:border-zinc-300',
          ].join(' ')}
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-zinc-100">
            <CalendarDays className="h-5 w-5 text-zinc-600" />
          </div>
          <div>
            <p className="font-semibold text-zinc-900">Schedule for Later</p>
            <p className="mt-0.5 text-xs text-zinc-500">Pick a date and time to send the campaign automatically.</p>
          </div>
        </button>
      </div>

      {form.scheduleType === 'later' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="scheduleDate">
              <CalendarDays className="inline h-3.5 w-3.5 mr-1" />
              Send Date
            </Label>
            <Input
              id="scheduleDate"
              type="date"
              value={form.scheduleDate}
              onChange={e => onChange({ scheduleDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="scheduleTime">
              <Clock className="inline h-3.5 w-3.5 mr-1" />
              Send Time
            </Label>
            <Input
              id="scheduleTime"
              type="time"
              value={form.scheduleTime}
              onChange={e => onChange({ scheduleTime: e.target.value })}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <Button size="lg" onClick={() => setConfirmOpen(true)}>
          {form.scheduleType === 'now' ? (
            <>
              <Send className="h-4 w-4" />
              Send Campaign Now
            </>
          ) : (
            <>
              <CalendarDays className="h-4 w-4" />
              Schedule Campaign
            </>
          )}
        </Button>
      </div>

      {/* Confirm Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-sm" onClose={() => setConfirmOpen(false)}>
          <DialogHeader>
            <DialogTitle>Confirm Send</DialogTitle>
            <DialogDescription>
              This will {form.scheduleType === 'now' ? 'immediately send' : 'schedule'} your campaign to{' '}
              <strong>{segment?.count.toLocaleString() ?? '—'} contacts</strong>. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Campaign</span>
                <span className="font-medium text-zinc-900 text-right max-w-[180px] truncate">{form.campaignName || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Audience</span>
                <span className="font-medium text-zinc-900">{segment?.count.toLocaleString() ?? '—'} contacts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Delivery</span>
                <span className="font-medium text-zinc-900">
                  {form.scheduleType === 'now'
                    ? 'Immediately'
                    : form.scheduleDate && form.scheduleTime
                    ? `${form.scheduleDate} at ${form.scheduleTime}`
                    : 'Scheduled'}
                </span>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setConfirmOpen(false)
                onSend()
              }}
            >
              {form.scheduleType === 'now' ? 'Send Now' : 'Confirm Schedule'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NewCampaignPage() {
  const [currentStep, setCurrentStep] = useState<StepKey>('setup')
  const [completedSteps, setCompletedSteps] = useState<Set<StepKey>>(new Set())
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [sent, setSent] = useState(false)

  function updateForm(updates: Partial<FormData>) {
    setForm(prev => ({ ...prev, ...updates }))
  }

  function goToStep(step: StepKey) {
    setCurrentStep(step)
  }

  function handleNext() {
    const currentIndex = STEP_KEYS.indexOf(currentStep)
    setCompletedSteps(prev => new Set(prev).add(currentStep))
    if (currentIndex < STEP_KEYS.length - 1) {
      setCurrentStep(STEP_KEYS[currentIndex + 1])
    }
  }

  function handleBack() {
    const currentIndex = STEP_KEYS.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(STEP_KEYS[currentIndex - 1])
    }
  }

  function handleSend() {
    setSent(true)
  }

  const currentIndex = STEP_KEYS.indexOf(currentStep)
  const isFirst = currentIndex === 0
  const isLast = currentStep === 'send'

  const canProceedFromSetup = form.campaignName.trim().length > 0
  const canProceedFromAudience = form.selectedSegmentId.length > 0
  const canProceedFromContent = form.subjectLine.trim().length > 0 && form.emailBody.trim().length > 0

  function canProceed(): boolean {
    if (currentStep === 'setup') return canProceedFromSetup
    if (currentStep === 'audience') return canProceedFromAudience
    if (currentStep === 'content') return canProceedFromContent
    return true
  }

  return (
    <>
      <Topbar
        title="New Campaign"
        description="Build and send a targeted email campaign"
        actions={
          <Link href="/campaigns">
            <Button variant="ghost" size="sm">
              <X className="h-3.5 w-3.5" />
              Cancel
            </Button>
          </Link>
        }
      />
      <PageShell>
        {/* Step progress */}
        <div className="mb-8 flex justify-center overflow-x-auto pb-2">
          <StepProgress currentStep={currentStep} completedSteps={completedSteps} />
        </div>

        {/* Step content */}
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardContent className="p-6 sm:p-8">
              {currentStep === 'setup' && (
                <StepSetup form={form} onChange={updateForm} />
              )}
              {currentStep === 'audience' && (
                <StepAudience form={form} onChange={updateForm} />
              )}
              {currentStep === 'content' && (
                <StepContent form={form} onChange={updateForm} />
              )}
              {currentStep === 'review' && (
                <StepReview form={form} />
              )}
              {currentStep === 'send' && (
                <StepSend
                  form={form}
                  onChange={updateForm}
                  onSend={handleSend}
                  sent={sent}
                />
              )}

              {/* Nav buttons (hide when sent) */}
              {!sent && (
                <div className="mt-8 flex items-center justify-between border-t border-zinc-100 pt-6">
                  <Button
                    variant="outline"
                    onClick={isFirst ? undefined : handleBack}
                    disabled={isFirst}
                    className={isFirst ? 'invisible' : ''}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>

                  {!isLast && (
                    <Button onClick={handleNext} disabled={!canProceed()}>
                      {currentStep === 'review' ? 'Continue to Send' : 'Continue'}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </PageShell>
    </>
  )
}
