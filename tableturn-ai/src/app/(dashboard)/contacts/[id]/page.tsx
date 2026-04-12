'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, Tag, Edit3, Clock, CheckCircle2, MessageSquare, Zap, Copy, Send, ChevronDown } from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { PageShell } from '@/components/layout/page-shell'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog'
import { Avatar } from '@/components/ui/avatar'

const mockContact = {
  id: '1',
  firstName: 'Sarah',
  lastName: 'Mitchell',
  email: 'sarah@example.com',
  phone: '(212) 555-0101',
  company: 'Mitchell PR',
  birthday: 'June 14',
  anniversary: null,
  lastVisitDate: 'March 15, 2025',
  visitFrequency: 12,
  source: 'CSV Import',
  notes: 'Prefers corner booth. Allergic to shellfish. Celebrates birthday every year with group of 8-10.',
  isSubscribed: true,
  tags: ['VIP', 'Birthday Club'],
  location: 'Rosewood Kitchen',
  createdAt: 'Jan 3, 2024',
}

const timeline = [
  { id: 1, type: 'campaign', icon: Mail, label: 'Received campaign "Thursday Happy Hour"', time: 'Mar 10, 2025', detail: 'Opened · Clicked CTA' },
  { id: 2, type: 'visit', icon: CheckCircle2, label: 'Visit recorded at Rosewood Kitchen', time: 'Mar 15, 2025', detail: 'Party of 4' },
  { id: 3, type: 'campaign', icon: Mail, label: 'Received campaign "Birthday Club — March"', time: 'Jun 10, 2024', detail: 'Opened · No click' },
  { id: 4, type: 'note', icon: MessageSquare, label: 'Note added by Jane Doe', time: 'Jan 15, 2024', detail: 'Prefers corner booth. Shellfish allergy noted.' },
  { id: 5, type: 'import', icon: Tag, label: 'Contact imported from CSV', time: 'Jan 3, 2024', detail: 'Source: Loyalty Export Q4 2023' },
]

export default function ContactDetailPage({ params }: { params: { id: string } }) {
  const [addNoteOpen, setAddNoteOpen] = useState(false)
  const [note, setNote] = useState('')

  return (
    <>
      <Topbar
        title="Contact Profile"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm"><Edit3 className="h-3.5 w-3.5" /> Edit</Button>
            <Button size="sm"><Mail className="h-3.5 w-3.5" /> Send Email</Button>
          </div>
        }
      />
      <PageShell>
        <Link href="/contacts" className="mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Contacts
        </Link>

        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Profile */}
          <div className="lg:col-span-2 space-y-5">
            {/* Header card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar name={`${mockContact.firstName} ${mockContact.lastName}`} size="lg" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-zinc-900">{mockContact.firstName} {mockContact.lastName}</h2>
                        {mockContact.company && <p className="text-sm text-zinc-500">{mockContact.company}</p>}
                      </div>
                      <div className="flex gap-1">
                        {mockContact.tags.map(t => (
                          <Badge key={t} variant={t === 'VIP' ? 'purple' : 'pink'}>{t}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm text-zinc-600">
                        <Mail className="h-4 w-4 text-zinc-400" /> {mockContact.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-600">
                        <Phone className="h-4 w-4 text-zinc-400" /> {mockContact.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-600">
                        <Tag className="h-4 w-4 text-zinc-400" /> {mockContact.source}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-zinc-600">
                        <Clock className="h-4 w-4 text-zinc-400" /> Last visit: {mockContact.lastVisitDate}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Total Visits', value: mockContact.visitFrequency },
                { label: 'Campaigns Received', value: 14 },
                { label: 'Emails Opened', value: 9 },
              ].map(s => (
                <div key={s.label} className="rounded-xl border border-zinc-200 bg-white p-4 text-center">
                  <p className="text-2xl font-bold text-zinc-900">{s.value}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Details */}
            <Card>
              <CardHeader><CardTitle>Contact Details</CardTitle></CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  {[
                    { label: 'Location', value: mockContact.location },
                    { label: 'Birthday', value: mockContact.birthday },
                    { label: 'Customer Since', value: mockContact.createdAt },
                    { label: 'Email Status', value: mockContact.isSubscribed ? 'Subscribed' : 'Unsubscribed' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <dt className="text-zinc-400 font-medium">{label}</dt>
                      <dd className="text-zinc-800 mt-0.5">{value}</dd>
                    </div>
                  ))}
                </dl>
                {mockContact.notes && (
                  <div className="mt-4 pt-4 border-t border-zinc-100">
                    <p className="text-xs font-semibold text-zinc-500 mb-1">Notes</p>
                    <p className="text-sm text-zinc-700">{mockContact.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Panel */}
            <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-indigo-600" />
                <p className="text-sm font-semibold text-indigo-900">AI Suggested Follow-up</p>
              </div>
              <div className="rounded-lg bg-white border border-indigo-100 p-4 text-sm text-zinc-700 leading-relaxed">
                Subject: Sarah, your birthday month at Rosewood is almost here 🎂
                <br /><br />
                Hi Sarah,<br /><br />
                June is right around the corner, and we want to make sure your birthday dinner at Rosewood Kitchen is everything you deserve. As a VIP member, you have access to our exclusive birthday table package — private seating, complimentary dessert, and a personalized menu card.<br /><br />
                Ready to celebrate? Reply to this email or call us at (212) 555-9000 to reserve your birthday table.
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" className="border-indigo-200 text-indigo-700">
                  <Copy className="h-3.5 w-3.5" /> Copy
                </Button>
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                  <Send className="h-3.5 w-3.5" /> Send Email
                </Button>
              </div>
            </div>
          </div>

          {/* Right: Timeline */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-900">Activity Timeline</h3>
              <Button variant="outline" size="sm" onClick={() => setAddNoteOpen(true)}>
                <MessageSquare className="h-3.5 w-3.5" /> Add Note
              </Button>
            </div>
            <div className="space-y-3">
              {timeline.map((item, i) => (
                <div key={item.id} className="relative flex gap-3">
                  {i < timeline.length - 1 && (
                    <div className="absolute left-3.5 top-7 bottom-0 w-px bg-zinc-200" />
                  )}
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
          </div>
        </div>

        {/* Add Note Dialog */}
        <Dialog open={addNoteOpen} onOpenChange={setAddNoteOpen}>
          <DialogContent className="max-w-md" onClose={() => setAddNoteOpen(false)}>
            <DialogHeader>
              <DialogTitle>Add Note</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <Textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note about this contact..." rows={4} />
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddNoteOpen(false)}>Cancel</Button>
              <Button onClick={() => setAddNoteOpen(false)}>Save Note</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageShell>
    </>
  )
}
