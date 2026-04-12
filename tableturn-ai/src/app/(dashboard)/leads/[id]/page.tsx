'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Phone,
  Mail,
  Users,
  Calendar,
  MapPin,
  DollarSign,
  Sparkles,
  RefreshCw,
  Copy,
  Send,
  Plus,
  CheckCircle,
  MessageSquare,
  Clock,
  UserCheck,
  ChevronDown,
} from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { PageShell } from '@/components/layout/page-shell'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { DropdownMenu, DropdownItem, DropdownSeparator, DropdownLabel } from '@/components/ui/dropdown'

type LeadStatus = 'NEW' | 'CONTACTED' | 'ENGAGED' | 'BOOKED' | 'LOST' | 'DO_NOT_CONTACT'
type LeadType =
  | 'PRIVATE_DINING'
  | 'CORPORATE_DINNER'
  | 'BIRTHDAY_DINNER'
  | 'CATERING'
  | 'LARGE_PARTY'
  | 'RESERVATION_INTEREST'
  | 'ANNIVERSARY'
  | 'GENERAL_INQUIRY'

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  type: LeadType
  status: LeadStatus
  source: string
  sourcePlatform: string
  value: string
  partySize: number
  preferredDate?: string
  time: string
  notes: string
  aiSummary?: string
}

interface ActivityEvent {
  id: string
  type: 'created' | 'status_change' | 'note' | 'email' | 'call'
  description: string
  detail?: string
  timestamp: string
  user?: string
}

const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    email: 'sarah@example.com',
    phone: '(212) 555-0101',
    company: '',
    type: 'PRIVATE_DINING',
    status: 'NEW',
    source: 'Website',
    sourcePlatform: 'Meta Ads',
    value: '$4,200',
    partySize: 40,
    preferredDate: 'Flexible',
    time: '2 hours ago',
    notes: 'Anniversary dinner for 40, wants private room, flexible on date',
    aiSummary: 'High-value private dining inquiry. 40-person anniversary event. Flexible dates suggest good conversion potential.',
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    email: 'marcus@corp.com',
    phone: '(646) 555-0102',
    company: 'Corp Inc.',
    type: 'CORPORATE_DINNER',
    status: 'CONTACTED',
    source: 'Website',
    sourcePlatform: 'Google',
    value: '$3,800',
    partySize: 25,
    preferredDate: 'Late April',
    time: '4 hours ago',
    notes: 'Q2 team dinner, needs AV setup',
    aiSummary: 'Corporate team dinner with specific AV requirements. Strong conversion candidate — clearly defined need and budget.',
  },
  {
    id: '3',
    name: 'Jennifer Park',
    email: 'jen@example.com',
    phone: '(917) 555-0103',
    company: '',
    type: 'BIRTHDAY_DINNER',
    status: 'ENGAGED',
    source: 'Instagram',
    sourcePlatform: 'Instagram',
    value: '$600',
    partySize: 8,
    preferredDate: 'May 12, 2025',
    time: '1 day ago',
    notes: 'Milestone 40th birthday',
    aiSummary: 'Birthday celebration for small group. Date is confirmed — should move to proposal stage.',
  },
  {
    id: '4',
    name: 'Westside Events Co.',
    email: 'events@westside.com',
    phone: '(212) 555-0104',
    company: 'Westside Events Co.',
    type: 'CATERING',
    status: 'NEW',
    source: 'Website',
    sourcePlatform: 'Direct',
    value: '$12,000',
    partySize: 200,
    preferredDate: 'TBD',
    time: '1 day ago',
    notes: 'Off-site catering for product launch',
    aiSummary: 'High-value catering inquiry from an events company. Off-site event — needs logistics discussion. Top priority lead.',
  },
  {
    id: '5',
    name: 'David Chen',
    email: 'dchen@example.com',
    phone: '(718) 555-0105',
    company: '',
    type: 'LARGE_PARTY',
    status: 'BOOKED',
    source: 'Referral',
    sourcePlatform: 'Direct',
    value: '$2,100',
    partySize: 15,
    preferredDate: 'Mar 28, 2025',
    time: '2 days ago',
    notes: 'Confirmed for March 28',
    aiSummary: 'Successfully booked. Send a confirmation and pre-event details.',
  },
  {
    id: '6',
    name: 'Amy Rodriguez',
    email: 'amy@example.com',
    phone: '(212) 555-0106',
    company: '',
    type: 'RESERVATION_INTEREST',
    status: 'NEW',
    source: 'Website',
    sourcePlatform: 'Direct',
    value: '$180',
    partySize: 4,
    preferredDate: 'Next Saturday',
    time: '3 days ago',
    notes: 'Interested in Saturday dinner',
    aiSummary: 'Small dinner party inquiry. Low value but straightforward — fast response recommended.',
  },
  {
    id: '7',
    name: 'Tech Startup Inc.',
    email: 'events@techco.com',
    phone: '(646) 555-0107',
    company: 'Tech Startup Inc.',
    type: 'PRIVATE_DINING',
    status: 'LOST',
    source: 'Website',
    sourcePlatform: 'Google',
    value: '$5,500',
    partySize: 50,
    preferredDate: 'Apr 10, 2025',
    time: '5 days ago',
    notes: 'Lost to competitor on price',
    aiSummary: 'Lost to competitor. Consider following up in 3 months for future events.',
  },
  {
    id: '8',
    name: 'Lisa Thompson',
    email: 'lisa@example.com',
    phone: '(347) 555-0108',
    company: '',
    type: 'ANNIVERSARY',
    status: 'CONTACTED',
    source: 'Website',
    sourcePlatform: 'Instagram',
    value: '$420',
    partySize: 2,
    preferredDate: 'Jun 5, 2025',
    time: '6 days ago',
    notes: 'Special anniversary dinner, VIP treatment requested',
    aiSummary: 'Intimate anniversary dinner with VIP expectations. High upsell potential on wine pairing and dessert courses.',
  },
]

const mockActivity: Record<string, ActivityEvent[]> = {
  '1': [
    { id: 'a1', type: 'created', description: 'Lead created via Meta Ads', timestamp: '2 hours ago' },
  ],
  '2': [
    { id: 'a1', type: 'created', description: 'Lead created via Google', timestamp: '4 hours ago' },
    { id: 'a2', type: 'email', description: 'Initial outreach email sent', detail: 'Subject: Your upcoming dinner at TableTurn', timestamp: '3 hours ago', user: 'Maria S.' },
    { id: 'a3', type: 'status_change', description: 'Status changed to Contacted', timestamp: '3 hours ago', user: 'Maria S.' },
  ],
  '3': [
    { id: 'a1', type: 'created', description: 'Lead created via Instagram DM', timestamp: '1 day ago' },
    { id: 'a2', type: 'status_change', description: 'Status changed to Contacted', timestamp: '22 hours ago', user: 'Alex T.' },
    { id: 'a3', type: 'call', description: 'Phone call — 8 min', detail: 'Discussed menu options and date availability', timestamp: '20 hours ago', user: 'Alex T.' },
    { id: 'a4', type: 'status_change', description: 'Status changed to Engaged', timestamp: '20 hours ago', user: 'Alex T.' },
    { id: 'a5', type: 'note', description: 'Note added', detail: 'Confirmed May 12 as the date. Interested in the chef\'s tasting menu.', timestamp: '19 hours ago', user: 'Alex T.' },
  ],
  '4': [
    { id: 'a1', type: 'created', description: 'Lead created via Direct', timestamp: '1 day ago' },
  ],
  '5': [
    { id: 'a1', type: 'created', description: 'Lead created via Referral', timestamp: '2 days ago' },
    { id: 'a2', type: 'status_change', description: 'Status changed to Contacted', timestamp: '2 days ago', user: 'Maria S.' },
    { id: 'a3', type: 'email', description: 'Proposal email sent', timestamp: '2 days ago', user: 'Maria S.' },
    { id: 'a4', type: 'status_change', description: 'Status changed to Booked', timestamp: '1 day ago', user: 'Maria S.' },
    { id: 'a5', type: 'note', description: 'Note added', detail: 'Confirmed booking. Deposit received. Party of 15 confirmed for March 28.', timestamp: '1 day ago', user: 'Maria S.' },
  ],
  '6': [
    { id: 'a1', type: 'created', description: 'Lead created via Website', timestamp: '3 days ago' },
  ],
  '7': [
    { id: 'a1', type: 'created', description: 'Lead created via Google', timestamp: '5 days ago' },
    { id: 'a2', type: 'status_change', description: 'Status changed to Contacted', timestamp: '5 days ago', user: 'Alex T.' },
    { id: 'a3', type: 'email', description: 'Follow-up email sent', timestamp: '4 days ago', user: 'Alex T.' },
    { id: 'a4', type: 'status_change', description: 'Status changed to Lost', detail: 'Lost to competitor on price', timestamp: '3 days ago', user: 'Alex T.' },
  ],
  '8': [
    { id: 'a1', type: 'created', description: 'Lead created via Instagram', timestamp: '6 days ago' },
    { id: 'a2', type: 'email', description: 'Initial outreach email sent', timestamp: '6 days ago', user: 'Maria S.' },
    { id: 'a3', type: 'status_change', description: 'Status changed to Contacted', timestamp: '6 days ago', user: 'Maria S.' },
  ],
}

const followUpDrafts: Record<string, string> = {
  '1': `Hi Sarah,

Thank you for reaching out to us about your anniversary celebration! We'd love to help make it a truly memorable evening for you and your guests.

We do have a beautiful private dining room that can comfortably accommodate your party of 40. I'd love to schedule a quick call to walk you through our private event packages and discuss your vision for the evening.

Would you be available for a brief call this week? I'm happy to work around your schedule.

Warm regards,
The TableTurn Team`,
  '2': `Hi Marcus,

Thank you for considering us for your Q2 team dinner! We specialize in corporate events and have full AV capabilities to support your team's needs.

Our private event coordinator would love to connect with you to discuss the details and send over a tailored proposal. We're confident we can create a great experience for your team.

Are you available for a 15-minute call this week?

Best,
The TableTurn Team`,
  default: `Hi there,

Thank you for your interest in hosting an event with us! We'd love to learn more about what you have in mind and put together a personalized proposal for you.

Please don't hesitate to reach out directly at events@tableturn.com or reply to this email.

Looking forward to speaking with you!

Warm regards,
The TableTurn Team`,
}

const nextActions: Record<string, string> = {
  NEW: 'Send an initial outreach email within the next 2 hours to maximize conversion chances.',
  CONTACTED: 'Follow up with a phone call if no response within 24 hours.',
  ENGAGED: 'Send a formal proposal with pricing and availability options.',
  BOOKED: 'Send a confirmation email with event details and deposit instructions.',
  LOST: 'Schedule a re-engagement in 90 days. Consider a win-back offer.',
  DO_NOT_CONTACT: 'No action required. Contact is flagged as Do Not Contact.',
}

const statusConfig: Record<LeadStatus, { label: string; variant: 'warning' | 'blue' | 'purple' | 'success' | 'secondary' | 'destructive' }> = {
  NEW: { label: 'New', variant: 'warning' },
  CONTACTED: { label: 'Contacted', variant: 'blue' },
  ENGAGED: { label: 'Engaged', variant: 'purple' },
  BOOKED: { label: 'Booked', variant: 'success' },
  LOST: { label: 'Lost', variant: 'secondary' },
  DO_NOT_CONTACT: { label: 'Do Not Contact', variant: 'destructive' },
}

const leadTypeLabels: Record<LeadType, string> = {
  PRIVATE_DINING: 'Private Dining',
  CORPORATE_DINNER: 'Corporate Dinner',
  BIRTHDAY_DINNER: 'Birthday Dinner',
  CATERING: 'Catering',
  LARGE_PARTY: 'Large Party',
  RESERVATION_INTEREST: 'Reservation',
  ANNIVERSARY: 'Anniversary',
  GENERAL_INQUIRY: 'General Inquiry',
}

const activityIcons: Record<ActivityEvent['type'], React.ReactNode> = {
  created: <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />,
  status_change: <UserCheck className="h-3.5 w-3.5 text-blue-500" />,
  note: <MessageSquare className="h-3.5 w-3.5 text-amber-500" />,
  email: <Mail className="h-3.5 w-3.5 text-indigo-500" />,
  call: <Phone className="h-3.5 w-3.5 text-purple-500" />,
}

function LeadDetailContent({ id }: { id: string }) {
  const lead = mockLeads.find(l => l.id === id) ?? mockLeads[0]
  const activity = mockActivity[id] ?? mockActivity['1']

  const [currentStatus, setCurrentStatus] = useState<LeadStatus>(lead.status)
  const [addNoteOpen, setAddNoteOpen] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [activityLog, setActivityLog] = useState<ActivityEvent[]>(activity)
  const [copiedDraft, setCopiedDraft] = useState(false)

  const status = statusConfig[currentStatus]
  const draft = followUpDrafts[id] ?? followUpDrafts['default']
  const nextAction = nextActions[currentStatus]

  function handleStatusChange(newStatus: LeadStatus) {
    if (newStatus === currentStatus) return
    setCurrentStatus(newStatus)
    setActivityLog(prev => [
      ...prev,
      {
        id: `auto-${Date.now()}`,
        type: 'status_change',
        description: `Status changed to ${statusConfig[newStatus].label}`,
        timestamp: 'just now',
        user: 'You',
      },
    ])
  }

  function handleAddNote() {
    if (!noteText.trim()) return
    setActivityLog(prev => [
      ...prev,
      {
        id: `note-${Date.now()}`,
        type: 'note',
        description: 'Note added',
        detail: noteText,
        timestamp: 'just now',
        user: 'You',
      },
    ])
    setNoteText('')
    setAddNoteOpen(false)
  }

  function handleCopyDraft() {
    navigator.clipboard.writeText(draft).catch(() => {})
    setCopiedDraft(true)
    setTimeout(() => setCopiedDraft(false), 2000)
  }

  return (
    <>
      <Topbar
        title="Lead Detail"
        actions={
          <div className="flex items-center gap-2">
            <DropdownMenu
              align="right"
              trigger={
                <Button variant="outline" size="sm">
                  Change Status
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              }
            >
              <DropdownLabel>Set Status</DropdownLabel>
              {(Object.keys(statusConfig) as LeadStatus[]).map(s => (
                <DropdownItem
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={currentStatus === s ? 'font-semibold text-indigo-600' : ''}
                >
                  {statusConfig[s].label}
                </DropdownItem>
              ))}
            </DropdownMenu>
            <Button variant="outline" size="sm" onClick={() => setAddNoteOpen(true)}>
              <Plus className="h-3.5 w-3.5" />
              Add Note
            </Button>
            <Button size="sm" onClick={() => window.open(`mailto:${lead.email}`)}>
              <Send className="h-3.5 w-3.5" />
              Send Email
            </Button>
          </div>
        }
      />

      <PageShell>
        {/* Back link + Header */}
        <div className="mb-6">
          <Link href="/leads" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Leads
          </Link>

          <div className="flex flex-wrap items-start gap-4">
            <Avatar name={lead.name} size="lg" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-zinc-900">{lead.name}</h2>
                <Badge variant={status.variant}>{status.label}</Badge>
                <Badge variant="outline">{leadTypeLabels[lead.type]}</Badge>
              </div>
              <p className="mt-1 text-sm text-zinc-500">
                {lead.sourcePlatform} · Received {lead.time}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-2xl font-bold text-zinc-900">{lead.value}</p>
              <p className="text-xs text-zinc-500">Estimated value</p>
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT: Details + AI */}
          <div className="lg:col-span-2 space-y-5">

            {/* Contact Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InfoRow icon={<Users className="h-4 w-4" />} label="Name" value={lead.name} />
                  <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={lead.email} />
                  <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={lead.phone} />
                  {lead.company && (
                    <InfoRow icon={<MapPin className="h-4 w-4" />} label="Company" value={lead.company} />
                  )}
                  <InfoRow icon={<Users className="h-4 w-4" />} label="Party Size" value={`${lead.partySize} guests`} />
                  {lead.preferredDate && (
                    <InfoRow icon={<Calendar className="h-4 w-4" />} label="Preferred Date" value={lead.preferredDate} />
                  )}
                  <InfoRow icon={<MapPin className="h-4 w-4" />} label="Source" value={`${lead.source} (${lead.sourcePlatform})`} />
                  <InfoRow icon={<DollarSign className="h-4 w-4" />} label="Estimated Value" value={lead.value} />
                </div>
                {lead.notes && (
                  <div className="mt-4 rounded-lg bg-zinc-50 border border-zinc-100 p-3">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">Notes</p>
                    <p className="text-sm text-zinc-700">{lead.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Summary */}
            {lead.aiSummary && (
              <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
                      <Sparkles className="h-3.5 w-3.5 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-indigo-900">AI Summary</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-indigo-600 hover:bg-indigo-100 h-7 px-2 text-xs">
                    <RefreshCw className="h-3 w-3" />
                    Regenerate
                  </Button>
                </div>
                <p className="text-sm text-indigo-800 leading-relaxed">{lead.aiSummary}</p>
              </div>
            )}

            {/* AI Follow-up Draft */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                    <CardTitle>AI Follow-up Draft</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-7 px-2.5 text-xs" onClick={handleCopyDraft}>
                      <Copy className="h-3 w-3" />
                      {copiedDraft ? 'Copied!' : 'Copy'}
                    </Button>
                    <Button size="sm" className="h-7 px-2.5 text-xs" onClick={() => window.open(`mailto:${lead.email}`)}>
                      <Send className="h-3 w-3" />
                      Send Email
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4">
                  <p className="whitespace-pre-line text-sm text-zinc-700 leading-relaxed">{draft}</p>
                </div>
              </CardContent>
            </Card>

            {/* Next Recommended Action */}
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 flex-shrink-0 mt-0.5">
                  <Clock className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-900">Next Recommended Action</p>
                  <p className="mt-0.5 text-sm text-amber-800">{nextAction}</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Activity Timeline */}
          <div>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-3 top-2 bottom-2 w-px bg-zinc-100" />

                  <div className="space-y-5">
                    {activityLog.map((event) => (
                      <div key={event.id} className="relative flex items-start gap-3 pl-8">
                        {/* Icon bubble */}
                        <div className="absolute left-0 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-zinc-200 shadow-sm">
                          {activityIcons[event.type]}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-zinc-900">{event.description}</p>
                          {event.detail && (
                            <p className="mt-0.5 text-xs text-zinc-500 italic">"{event.detail}"</p>
                          )}
                          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-400">
                            <span>{event.timestamp}</span>
                            {event.user && (
                              <>
                                <span>·</span>
                                <span>{event.user}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageShell>

      {/* Add Note Dialog */}
      <Dialog open={addNoteOpen} onOpenChange={setAddNoteOpen}>
        <DialogContent className="max-w-md" onClose={() => setAddNoteOpen(false)}>
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <div className="space-y-1.5">
              <Label htmlFor="noteText">Note</Label>
              <Textarea
                id="noteText"
                placeholder="Write a note about this lead..."
                rows={4}
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddNoteOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNote} disabled={!noteText.trim()}>
              <Plus className="h-3.5 w-3.5" />
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 text-zinc-400 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-zinc-400">{label}</p>
        <p className="text-sm font-medium text-zinc-900">{value}</p>
      </div>
    </div>
  )
}

export default function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  return <LeadDetailContent id={id} />
}
