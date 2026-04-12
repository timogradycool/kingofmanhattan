'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Users,
  DollarSign,
  CalendarDays,
  TrendingUp,
  Eye,
  Clock,
} from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { PageShell } from '@/components/layout/page-shell'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { StatCard } from '@/components/ui/stat-card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

type EventStage =
  | 'NEW_INQUIRY'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'PROPOSAL_SENT'
  | 'NEGOTIATING'
  | 'BOOKED'
  | 'LOST'

interface PrivateEvent {
  id: string
  contactName: string
  occasion: string
  requestedDate: string
  partySize: number
  estimatedValue: string
  stage: EventStage
  company: string
  time: string
}

interface AddInquiryForm {
  contactName: string
  company: string
  email: string
  phone: string
  occasion: string
  requestedDate: string
  partySize: string
  budgetMin: string
  budgetMax: string
  notes: string
  source: string
}

const mockEvents: PrivateEvent[] = [
  {
    id: '1',
    contactName: 'The Harrington Family',
    occasion: 'Wedding Rehearsal Dinner',
    requestedDate: 'Apr 15, 2025',
    partySize: 60,
    estimatedValue: '$8,500',
    stage: 'NEW_INQUIRY',
    company: '',
    time: '1 day ago',
  },
  {
    id: '2',
    contactName: 'Goldman & Partners',
    occasion: 'Corporate Milestone Dinner',
    requestedDate: 'May 2, 2025',
    partySize: 45,
    estimatedValue: '$12,000',
    stage: 'CONTACTED',
    company: 'Goldman & Partners Law',
    time: '2 days ago',
  },
  {
    id: '3',
    contactName: 'Rodriguez Wedding',
    occasion: 'Rehearsal Dinner',
    requestedDate: 'Jun 7, 2025',
    partySize: 35,
    estimatedValue: '$5,200',
    stage: 'QUALIFIED',
    company: '',
    time: '3 days ago',
  },
  {
    id: '4',
    contactName: 'Apex Tech Launch',
    occasion: 'Product Launch Dinner',
    requestedDate: 'Apr 22, 2025',
    partySize: 80,
    estimatedValue: '$18,000',
    stage: 'PROPOSAL_SENT',
    company: 'Apex Technologies',
    time: '4 days ago',
  },
  {
    id: '5',
    contactName: 'Chang Anniversary',
    occasion: '25th Anniversary Party',
    requestedDate: 'May 10, 2025',
    partySize: 50,
    estimatedValue: '$7,800',
    stage: 'NEGOTIATING',
    company: '',
    time: '1 week ago',
  },
  {
    id: '6',
    contactName: 'Meridian Bank Q2',
    occasion: 'Executive Dinner',
    requestedDate: 'Apr 30, 2025',
    partySize: 20,
    estimatedValue: '$4,500',
    stage: 'BOOKED',
    company: 'Meridian Bank',
    time: '2 weeks ago',
  },
  {
    id: '7',
    contactName: 'Park Engagement',
    occasion: 'Engagement Party',
    requestedDate: 'Mar 28, 2025',
    partySize: 30,
    estimatedValue: '$3,200',
    stage: 'LOST',
    company: '',
    time: '3 weeks ago',
  },
]

const stageConfig: Record<EventStage, {
  label: string
  badgeVariant: 'secondary' | 'blue' | 'default' | 'purple' | 'warning' | 'success' | 'destructive'
  headerColor: string
  borderColor: string
  dotColor: string
}> = {
  NEW_INQUIRY: {
    label: 'New Inquiry',
    badgeVariant: 'secondary',
    headerColor: 'bg-zinc-100 text-zinc-700',
    borderColor: 'border-zinc-200',
    dotColor: 'bg-zinc-400',
  },
  CONTACTED: {
    label: 'Contacted',
    badgeVariant: 'blue',
    headerColor: 'bg-blue-50 text-blue-700',
    borderColor: 'border-blue-200',
    dotColor: 'bg-blue-500',
  },
  QUALIFIED: {
    label: 'Qualified',
    badgeVariant: 'default',
    headerColor: 'bg-indigo-50 text-indigo-700',
    borderColor: 'border-indigo-200',
    dotColor: 'bg-indigo-500',
  },
  PROPOSAL_SENT: {
    label: 'Proposal Sent',
    badgeVariant: 'purple',
    headerColor: 'bg-purple-50 text-purple-700',
    borderColor: 'border-purple-200',
    dotColor: 'bg-purple-500',
  },
  NEGOTIATING: {
    label: 'Negotiating',
    badgeVariant: 'warning',
    headerColor: 'bg-amber-50 text-amber-700',
    borderColor: 'border-amber-200',
    dotColor: 'bg-amber-500',
  },
  BOOKED: {
    label: 'Booked',
    badgeVariant: 'success',
    headerColor: 'bg-emerald-50 text-emerald-700',
    borderColor: 'border-emerald-200',
    dotColor: 'bg-emerald-500',
  },
  LOST: {
    label: 'Lost',
    badgeVariant: 'secondary',
    headerColor: 'bg-zinc-100 text-zinc-400',
    borderColor: 'border-zinc-100',
    dotColor: 'bg-zinc-300',
  },
}

const stageOrder: EventStage[] = [
  'NEW_INQUIRY',
  'CONTACTED',
  'QUALIFIED',
  'PROPOSAL_SENT',
  'NEGOTIATING',
  'BOOKED',
  'LOST',
]

function parseDollarValue(v: string): number {
  return parseInt(v.replace(/[$,]/g, ''), 10) || 0
}

const emptyForm: AddInquiryForm = {
  contactName: '',
  company: '',
  email: '',
  phone: '',
  occasion: '',
  requestedDate: '',
  partySize: '',
  budgetMin: '',
  budgetMax: '',
  notes: '',
  source: '',
}

export default function PrivateEventsPage() {
  const [events, setEvents] = useState<PrivateEvent[]>(mockEvents)
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState<AddInquiryForm>(emptyForm)

  const totalInquiries = events.length
  const openEvents = events.filter(e => e.stage !== 'LOST' && e.stage !== 'BOOKED')
  const openValue = openEvents.reduce((sum, e) => sum + parseDollarValue(e.estimatedValue), 0)
  const bookedEvents = events.filter(e => e.stage === 'BOOKED')
  const bookedValue = bookedEvents.reduce((sum, e) => sum + parseDollarValue(e.estimatedValue), 0)
  const allValues = events.filter(e => e.stage !== 'LOST').map(e => parseDollarValue(e.estimatedValue))
  const avgDeal = allValues.length > 0 ? Math.round(allValues.reduce((a, b) => a + b, 0) / allValues.length) : 0

  function handleFormChange(field: keyof AddInquiryForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleAddInquiry() {
    if (!form.contactName.trim()) return
    const newEvent: PrivateEvent = {
      id: `new-${Date.now()}`,
      contactName: form.contactName,
      occasion: form.occasion || 'Private Event',
      requestedDate: form.requestedDate || 'TBD',
      partySize: parseInt(form.partySize, 10) || 0,
      estimatedValue: form.budgetMin ? `$${parseInt(form.budgetMin, 10).toLocaleString()}` : 'TBD',
      stage: 'NEW_INQUIRY',
      company: form.company,
      time: 'just now',
    }
    setEvents(prev => [newEvent, ...prev])
    setAddOpen(false)
    setForm(emptyForm)
  }

  return (
    <>
      <Topbar
        title="Private Events"
        description="Manage your private dining and event pipeline"
        actions={
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="h-3.5 w-3.5" />
            New Inquiry
          </Button>
        }
      />

      <PageShell>
        {/* Stats Row */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            title="Total Inquiries"
            value={totalInquiries}
            description="All time"
            icon={<CalendarDays className="h-5 w-5" />}
            priority="high"
          />
          <StatCard
            title="Open Value"
            value={`$${openValue.toLocaleString()}`}
            description="Active pipeline"
            icon={<DollarSign className="h-5 w-5" />}
            priority="high"
          />
          <StatCard
            title="Booked This Month"
            value={`$${bookedValue.toLocaleString()}`}
            description={`${bookedEvents.length} events confirmed`}
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <StatCard
            title="Avg Deal Size"
            value={`$${avgDeal.toLocaleString()}`}
            description="Across open pipeline"
            icon={<Users className="h-5 w-5" />}
            priority="medium"
          />
        </div>

        {/* Kanban Board */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {stageOrder.map(stage => {
              const config = stageConfig[stage]
              const stageEvents = events.filter(e => e.stage === stage)
              const stageTotal = stageEvents.reduce((sum, e) => sum + parseDollarValue(e.estimatedValue), 0)

              return (
                <div
                  key={stage}
                  className={`flex w-72 flex-col rounded-xl border ${config.borderColor} bg-white`}
                >
                  {/* Column Header */}
                  <div className={`flex items-center justify-between rounded-t-xl px-3 py-2.5 ${config.headerColor}`}>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${config.dotColor}`} />
                      <span className="text-sm font-semibold">{config.label}</span>
                      <span className="rounded-full bg-white/60 px-1.5 py-0.5 text-xs font-bold">
                        {stageEvents.length}
                      </span>
                    </div>
                    {stageTotal > 0 && (
                      <span className="text-xs font-semibold opacity-80">
                        ${stageTotal.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Cards */}
                  <div className="flex flex-col gap-2 p-2 flex-1">
                    {stageEvents.length === 0 && (
                      <div className="flex items-center justify-center py-8 text-center">
                        <p className="text-xs text-zinc-400">No events in this stage</p>
                      </div>
                    )}
                    {stageEvents.map(event => (
                      <KanbanCard key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </PageShell>

      {/* Add Inquiry Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg" onClose={() => setAddOpen(false)}>
          <DialogHeader>
            <DialogTitle>New Private Event Inquiry</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="contactName">Contact Name *</Label>
                  <Input
                    id="contactName"
                    placeholder="John Smith"
                    value={form.contactName}
                    onChange={e => handleFormChange('contactName', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="company">Company / Organization</Label>
                  <Input
                    id="company"
                    placeholder="Acme Corp (optional)"
                    value={form.company}
                    onChange={e => handleFormChange('company', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={e => handleFormChange('email', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(212) 555-0100"
                    value={form.phone}
                    onChange={e => handleFormChange('phone', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="occasion">Occasion / Event Type</Label>
                <Select
                  id="occasion"
                  value={form.occasion}
                  onChange={e => handleFormChange('occasion', e.target.value)}
                >
                  <option value="">Select occasion...</option>
                  <option value="Wedding Rehearsal Dinner">Wedding Rehearsal Dinner</option>
                  <option value="Corporate Dinner">Corporate Dinner</option>
                  <option value="Birthday Celebration">Birthday Celebration</option>
                  <option value="Anniversary Party">Anniversary Party</option>
                  <option value="Engagement Party">Engagement Party</option>
                  <option value="Product Launch">Product Launch</option>
                  <option value="Holiday Party">Holiday Party</option>
                  <option value="Team Dinner">Team Dinner</option>
                  <option value="Other">Other</option>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="requestedDate">Requested Date</Label>
                  <Input
                    id="requestedDate"
                    type="date"
                    value={form.requestedDate}
                    onChange={e => handleFormChange('requestedDate', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="partySize">Party Size</Label>
                  <Input
                    id="partySize"
                    type="number"
                    placeholder="30"
                    value={form.partySize}
                    onChange={e => handleFormChange('partySize', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="budgetMin">Budget Min ($)</Label>
                  <Input
                    id="budgetMin"
                    type="number"
                    placeholder="3000"
                    value={form.budgetMin}
                    onChange={e => handleFormChange('budgetMin', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="budgetMax">Budget Max ($)</Label>
                  <Input
                    id="budgetMax"
                    type="number"
                    placeholder="8000"
                    value={form.budgetMax}
                    onChange={e => handleFormChange('budgetMax', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="source">Source</Label>
                <Select
                  id="source"
                  value={form.source}
                  onChange={e => handleFormChange('source', e.target.value)}
                >
                  <option value="">Select source...</option>
                  <option value="Website">Website</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Google">Google</option>
                  <option value="Referral">Referral</option>
                  <option value="Phone">Phone Call</option>
                  <option value="Walk-in">Walk-in</option>
                  <option value="Direct">Direct</option>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="inquiryNotes">Notes</Label>
                <Textarea
                  id="inquiryNotes"
                  placeholder="Any relevant details about the event request..."
                  rows={3}
                  value={form.notes}
                  onChange={e => handleFormChange('notes', e.target.value)}
                />
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddInquiry} disabled={!form.contactName.trim()}>
              <Plus className="h-3.5 w-3.5" />
              Add Inquiry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function KanbanCard({ event }: { event: PrivateEvent }) {
  return (
    <Card className="cursor-default shadow-none hover:shadow-sm transition-shadow">
      <CardContent className="p-3">
        <div className="mb-2 flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-zinc-900 leading-tight">{event.contactName}</p>
          <Link href={`/private-events/${event.id}`} onClick={e => e.stopPropagation()}>
            <Button variant="ghost" size="icon-sm" title="View event" className="flex-shrink-0 -mt-0.5">
              <Eye className="h-3.5 w-3.5 text-zinc-400" />
            </Button>
          </Link>
        </div>

        <p className="text-xs text-zinc-500 mb-2 truncate">{event.occasion}</p>

        {event.company && (
          <p className="text-xs text-zinc-400 mb-2 truncate">{event.company}</p>
        )}

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3 w-3 text-zinc-400" />
            {event.requestedDate}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3 text-zinc-400" />
            {event.partySize}
          </span>
        </div>

        <div className="mt-2.5 flex items-center justify-between">
          <span className="text-sm font-bold text-zinc-900">{event.estimatedValue}</span>
          <span className="flex items-center gap-1 text-xs text-zinc-400">
            <Clock className="h-3 w-3" />
            {event.time}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
