'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Users, Plus, Edit3, Trash2, Mail, ChevronDown } from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { PageShell } from '@/components/layout/page-shell'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog'
import { EmptyState } from '@/components/ui/empty-state'

const segments = [
  {
    id: '1', name: 'VIP Guests', description: 'High-frequency guests tagged as VIP', contactCount: 847,
    filters: [{ field: 'tags', op: 'includes', value: 'VIP' }, { field: 'lastVisitDate', op: 'within', value: '90 days' }],
    updatedAt: '2 days ago',
  },
  {
    id: '2', name: 'Lapsed Guests', description: 'Guests who haven\'t visited in over 6 months', contactCount: 1240,
    filters: [{ field: 'lastVisitDate', op: 'older_than', value: '180 days' }],
    updatedAt: '1 week ago',
  },
  {
    id: '3', name: 'Birthday This Month', description: 'Contacts with birthdays in the next 30 days', contactCount: 34,
    filters: [{ field: 'birthday', op: 'within_next', value: '30 days' }],
    updatedAt: '1 day ago',
  },
  {
    id: '4', name: 'Private Events Interest', description: 'Contacts tagged for private events or who submitted an inquiry', contactCount: 312,
    filters: [{ field: 'tags', op: 'includes', value: 'Private Events' }],
    updatedAt: '3 days ago',
  },
  {
    id: '5', name: 'Newsletter Subscribers', description: 'All subscribed contacts who have never visited', contactCount: 2891,
    filters: [{ field: 'isSubscribed', op: 'equals', value: 'true' }],
    updatedAt: '5 days ago',
  },
]

const filterFields = [
  { value: 'lastVisitDate', label: 'Last Visit Date' },
  { value: 'tags', label: 'Tags' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'isSubscribed', label: 'Email Status' },
  { value: 'source', label: 'Source' },
  { value: 'visitFrequency', label: 'Visit Count' },
  { value: 'location', label: 'Location' },
]

export default function SegmentsPage() {
  const [newOpen, setNewOpen] = useState(false)
  const [segName, setSegName] = useState('')
  const [segDesc, setSegDesc] = useState('')
  const [filters, setFilters] = useState([{ field: 'lastVisitDate', op: 'within', value: '' }])

  const addFilter = () => setFilters(prev => [...prev, { field: 'lastVisitDate', op: 'within', value: '' }])
  const removeFilter = (i: number) => setFilters(prev => prev.filter((_, idx) => idx !== i))

  return (
    <>
      <Topbar
        title="Segments"
        description="Saved audience groups for targeting campaigns"
        actions={
          <Button size="sm" onClick={() => setNewOpen(true)}>
            <Plus className="h-3.5 w-3.5" /> New Segment
          </Button>
        }
      />
      <PageShell>
        <div className="space-y-4">
          {segments.map(seg => (
            <Card key={seg.id}>
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 flex-shrink-0">
                      <Users className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-zinc-900">{seg.name}</h3>
                        <Badge variant="secondary">{seg.contactCount.toLocaleString()} contacts</Badge>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">{seg.description}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {seg.filters.map((f, i) => (
                          <span key={i} className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                            <span className="font-medium">{filterFields.find(ff => ff.value === f.field)?.label ?? f.field}</span>
                            <span className="text-zinc-400">{f.op.replace(/_/g, ' ')}</span>
                            <span>{f.value}</span>
                          </span>
                        ))}
                      </div>
                      <p className="mt-1.5 text-xs text-zinc-400">Updated {seg.updatedAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link href="/campaigns/new">
                      <Button variant="outline" size="sm"><Mail className="h-3.5 w-3.5" /> Use in Campaign</Button>
                    </Link>
                    <Button variant="ghost" size="icon-sm"><Edit3 className="h-4 w-4 text-zinc-400" /></Button>
                    <Button variant="ghost" size="icon-sm"><Trash2 className="h-4 w-4 text-zinc-400" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* New Segment Dialog */}
        <Dialog open={newOpen} onOpenChange={setNewOpen}>
          <DialogContent className="max-w-2xl" onClose={() => setNewOpen(false)}>
            <DialogHeader>
              <DialogTitle>Create Segment</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Segment Name</Label>
                  <Input value={segName} onChange={e => setSegName(e.target.value)} placeholder="e.g. Lapsed Guests — 6 Months" />
                </div>
                <div className="space-y-1.5">
                  <Label>Description (optional)</Label>
                  <Input value={segDesc} onChange={e => setSegDesc(e.target.value)} placeholder="Brief description of this audience" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Filters</Label>
                    <Button variant="ghost" size="sm" onClick={addFilter}><Plus className="h-3.5 w-3.5" /> Add Filter</Button>
                  </div>
                  <div className="space-y-2">
                    {filters.map((f, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Select value={f.field} onChange={e => setFilters(prev => prev.map((x, idx) => idx === i ? { ...x, field: e.target.value } : x))} className="flex-1">
                          {filterFields.map(ff => <option key={ff.value} value={ff.value}>{ff.label}</option>)}
                        </Select>
                        <Select value={f.op} onChange={e => setFilters(prev => prev.map((x, idx) => idx === i ? { ...x, op: e.target.value } : x))} className="w-36">
                          <option value="equals">equals</option>
                          <option value="within">within</option>
                          <option value="older_than">older than</option>
                          <option value="within_next">within next</option>
                          <option value="includes">includes</option>
                          <option value="greater_than">greater than</option>
                        </Select>
                        <Input value={f.value} onChange={e => setFilters(prev => prev.map((x, idx) => idx === i ? { ...x, value: e.target.value } : x))} placeholder="value" className="w-32" />
                        {filters.length > 1 && (
                          <Button variant="ghost" size="icon-sm" onClick={() => removeFilter(i)}>
                            <Trash2 className="h-4 w-4 text-zinc-400" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 rounded-lg bg-indigo-50 border border-indigo-100 p-3">
                    <p className="text-xs text-indigo-700 font-medium">Estimated reach: <span className="font-bold">~1,240 contacts</span></p>
                  </div>
                </div>
              </div>
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewOpen(false)}>Cancel</Button>
              <Button onClick={() => setNewOpen(false)}>Create Segment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageShell>
    </>
  )
}
