'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Phone, Mail, Users, DollarSign, Calendar, Zap, Copy, Send, CheckCircle2, MessageSquare, ChevronRight } from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { PageShell } from '@/components/layout/page-shell'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog'

const stages = [
  { id: 'NEW_INQUIRY', label: 'New Inquiry' },
  { id: 'CONTACTED', label: 'Contacted' },
  { id: 'QUALIFIED', label: 'Qualified' },
  { id: 'PROPOSAL_SENT', label: 'Proposal Sent' },
  { id: 'NEGOTIATING', label: 'Negotiating' },
  { id: 'BOOKED', label: 'Booked' },
  { id: 'LOST', label: 'Lost' },
]

const stageColors: Record<string, string> = {
  NEW_INQUIRY: 'secondary', CONTACTED: 'blue', QUALIFIED: 'default',
  PROPOSAL_SENT: 'purple', NEGOTIATING: 'warning', BOOKED: 'success', LOST: 'secondary',
}

const mockEvent = {
  id: '4',
  contactName: 'Apex Tech Launch',
  company: 'Apex Technologies',
  email: 'events@apextech.com',
  phone: '(646) 555-0200',
  occasion: 'Product Launch Dinner',
  requestedDate: 'April 22, 2025',
  flexibleDates: 'April 22–25 work',
  partySize: 80,
  budgetMin: 15000,
  budgetMax: 20000,
  estimatedValue: 18000,
  preferredFormat: 'Seated dinner with presentations',
  foodBevNeeds: 'Full open bar, 4-course plated dinner, dietary accommodations for 12 guests',
  notes: 'This is a high-priority tech company launch. They want exclusivity that evening. AV setup required.',
  stage: 'PROPOSAL_SENT',
  source: 'Website',
  sourcePlatform: 'Google Ads',
  aiSummary: 'High-value corporate event. $15K-$20K budget. 80 guests. Flexible on specific date. AV and exclusivity required. Priority: HIGH. Recommended next action: Send tailored proposal with venue exclusivity pricing.',
  nextAction: 'Follow up on proposal sent April 3 — no response after 3 days.',
}

const timeline = [
  { icon: CheckCircle2, label: 'Moved to Proposal Sent', time: 'Apr 3, 2025', detail: 'Proposal emailed to events@apextech.com' },
  { icon: MessageSquare, label: 'Note added', time: 'Apr 2, 2025', detail: 'Client confirmed AV requirements. Exclusivity is non-negotiable.' },
  { icon: Phone, label: 'Moved to Qualified', time: 'Mar 31, 2025', detail: 'Discovery call completed' },
  { icon: Mail, label: 'Moved to Contacted', time: 'Mar 29, 2025', detail: 'Initial email sent via AI draft' },
  { icon: CheckCircle2, label: 'Inquiry created', time: 'Mar 28, 2025', detail: 'Source: Google Ads → website form' },
]

export default function PrivateEventDetailPage({ params }: { params: { id: string } }) {
  const [stage, setStage] = useState(mockEvent.stage)
  const [addNoteOpen, setAddNoteOpen] = useState(false)
  const [lostOpen, setLostOpen] = useState(false)
  const [bookedOpen, setBookedOpen] = useState(false)
  const [note, setNote] = useState('')
  const [lostReason, setLostReason] = useState('')

  const currentStageIdx = stages.findIndex(s => s.id === stage)

  return (
    <>
      <Topbar
        title="Private Event Inquiry"
        actions={
          <div className="flex items-center gap-2">
            <Select value={stage} onChange={e => setStage(e.target.value)} className="w-44">
              {stages.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </Select>
            <Button size="sm" variant="success" onClick={() => setBookedOpen(true)}>
              <CheckCircle2 className="h-3.5 w-3.5" /> Mark Booked
            </Button>
          </div>
        }
      />
      <PageShell>
        <Link href="/private-events" className="mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Pipeline
        </Link>

        {/* Stage bar */}
        <div className="mt-4 mb-6 flex items-center gap-0 overflow-x-auto pb-1">
          {stages.slice(0, 6).map((s, i) => {
            const isDone = i < currentStageIdx
            const isActive = s.id === stage
            return (
              <div key={s.id} className="flex items-center flex-shrink-0">
                <div className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  isActive ? 'bg-indigo-600 text-white' : isDone ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-400'
                }`}>
                  {isDone && '✓ '}{s.label}
                </div>
                {i < 5 && <ChevronRight className="h-4 w-4 text-zinc-300 mx-1 flex-shrink-0" />}
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-5">
            <Card>
              <CardHeader className="flex-row items-center justify-between pb-3">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900">{mockEvent.contactName}</h2>
                  {mockEvent.company && <p className="text-sm text-zinc-500">{mockEvent.company}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={stageColors[stage] as any}>{stages.find(s => s.id === stage)?.label}</Badge>
                  <span className="text-lg font-bold text-zinc-900">${mockEvent.estimatedValue.toLocaleString()}</span>
                </div>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  {[
                    { label: 'Occasion', value: mockEvent.occasion },
                    { label: 'Requested Date', value: mockEvent.requestedDate },
                    { label: 'Flexible Dates', value: mockEvent.flexibleDates },
                    { label: 'Party Size', value: `${mockEvent.partySize} guests` },
                    { label: 'Budget Range', value: `$${mockEvent.budgetMin.toLocaleString()} – $${mockEvent.budgetMax.toLocaleString()}` },
                    { label: 'Format', value: mockEvent.preferredFormat },
                    { label: 'Email', value: mockEvent.email },
                    { label: 'Phone', value: mockEvent.phone },
                    { label: 'Source', value: `${mockEvent.sourcePlatform} → ${mockEvent.source}` },
                  ].map(d => (
                    <div key={d.label}>
                      <dt className="text-zinc-400 text-xs font-semibold uppercase tracking-wide">{d.label}</dt>
                      <dd className="text-zinc-800 mt-0.5">{d.value}</dd>
                    </div>
                  ))}
                </dl>
                {mockEvent.foodBevNeeds && (
                  <div className="mt-4 pt-4 border-t border-zinc-100">
                    <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wide mb-1">Food & Beverage Needs</p>
                    <p className="text-sm text-zinc-700">{mockEvent.foodBevNeeds}</p>
                  </div>
                )}
                {mockEvent.notes && (
                  <div className="mt-3">
                    <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wide mb-1">Internal Notes</p>
                    <p className="text-sm text-zinc-700">{mockEvent.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Summary */}
            <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-indigo-600" />
                <p className="text-sm font-semibold text-indigo-900">AI Summary</p>
              </div>
              <p className="text-sm text-indigo-800 leading-relaxed">{mockEvent.aiSummary}</p>
              <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 p-3">
                <p className="text-xs font-semibold text-amber-800">Next Recommended Action</p>
                <p className="text-sm text-amber-700 mt-0.5">{mockEvent.nextAction}</p>
              </div>
            </div>

            {/* AI Follow-up draft */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>AI-Generated Follow-up Draft</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-4 text-sm text-zinc-700 leading-relaxed">
                  Subject: Your Apex Tech Proposal — Rosewood Private Dining<br /><br />
                  Hi [Contact Name],<br /><br />
                  Thank you for considering Rosewood Kitchen for your April product launch. We'd love to be part of this milestone evening.<br /><br />
                  Attached you'll find our private dining proposal for 80 guests, including full venue exclusivity, AV setup, and our signature 4-course dinner. We've also included pricing for an open bar package and dietary accommodation options.<br /><br />
                  Please let me know if you'd like to schedule a site visit or have any questions about customizing the evening. We hold the date tentatively until April 10th.<br /><br />
                  Warm regards,<br />
                  [Your Name]<br />
                  Rosewood Kitchen Private Events
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline"><Copy className="h-3.5 w-3.5" /> Copy</Button>
                  <Button size="sm"><Send className="h-3.5 w-3.5" /> Send Email</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Timeline */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-900">Activity</h3>
              <Button variant="outline" size="sm" onClick={() => setAddNoteOpen(true)}>
                <MessageSquare className="h-3.5 w-3.5" /> Add Note
              </Button>
            </div>
            <div className="space-y-3">
              {timeline.map((item, i) => (
                <div key={i} className="relative flex gap-3">
                  {i < timeline.length - 1 && <div className="absolute left-3.5 top-7 bottom-0 w-px bg-zinc-200" />}
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white border border-zinc-200 z-10">
                    <item.icon className="h-3.5 w-3.5 text-zinc-500" />
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm text-zinc-800">{item.label}</p>
                    {item.detail && <p className="text-xs text-zinc-400 mt-0.5">{item.detail}</p>}
                    <p className="text-xs text-zinc-400 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" size="sm" className="w-full text-red-600 border-red-200 hover:bg-red-50" onClick={() => setLostOpen(true)}>
              Mark as Lost
            </Button>
          </div>
        </div>

        {/* Modals */}
        <Dialog open={addNoteOpen} onOpenChange={setAddNoteOpen}>
          <DialogContent className="max-w-md" onClose={() => setAddNoteOpen(false)}>
            <DialogHeader><DialogTitle>Add Note</DialogTitle></DialogHeader>
            <DialogBody>
              <Textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note..." rows={4} />
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddNoteOpen(false)}>Cancel</Button>
              <Button onClick={() => setAddNoteOpen(false)}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={lostOpen} onOpenChange={setLostOpen}>
          <DialogContent className="max-w-md" onClose={() => setLostOpen(false)}>
            <DialogHeader><DialogTitle>Mark as Lost</DialogTitle></DialogHeader>
            <DialogBody>
              <p className="text-sm text-zinc-500 mb-3">Help improve future follow-up by noting why this inquiry was lost.</p>
              <Select value={lostReason} onChange={e => setLostReason(e.target.value)}>
                <option value="">Select reason...</option>
                <option value="price">Price / Budget mismatch</option>
                <option value="date">Date not available</option>
                <option value="capacity">Capacity mismatch</option>
                <option value="competitor">Chose competitor</option>
                <option value="no_response">No response</option>
                <option value="cancelled">Event cancelled</option>
                <option value="other">Other</option>
              </Select>
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" onClick={() => setLostOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={() => { setStage('LOST'); setLostOpen(false) }}>Mark Lost</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={bookedOpen} onOpenChange={setBookedOpen}>
          <DialogContent className="max-w-md" onClose={() => setBookedOpen(false)}>
            <DialogHeader><DialogTitle>Confirm Booking</DialogTitle></DialogHeader>
            <DialogBody>
              <p className="text-sm text-zinc-600">Mark <strong>{mockEvent.contactName}</strong> as booked? This will move them to the Booked stage and log a booking activity.</p>
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" onClick={() => setBookedOpen(false)}>Cancel</Button>
              <Button variant="success" onClick={() => { setStage('BOOKED'); setBookedOpen(false) }}>Confirm Booking</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageShell>
    </>
  )
}
