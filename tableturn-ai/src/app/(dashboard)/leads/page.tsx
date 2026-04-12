'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Phone, Mail, Eye, Plus, Users, DollarSign, Clock, CalendarCheck,
  ChevronDown, ChevronUp, Sparkles, Inbox,
} from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { PageShell } from '@/components/layout/page-shell'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { StatCard } from '@/components/ui/stat-card'
import { EmptyState } from '@/components/ui/empty-state'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

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
  type: LeadType
  status: LeadStatus
  source: string
  sourcePlatform: string
  value: string
  partySize: number
  time: string
  notes: string
  aiSummary?: string
}

const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    email: 'sarah@example.com',
    phone: '(212) 555-0101',
    type: 'PRIVATE_DINING',
    status: 'NEW',
    source: 'Website',
    sourcePlatform: 'Meta Ads',
    value: '$4,200',
    partySize: 40,
    time: '2 hours ago',
    notes: 'Anniversary dinner for 40, wants private room, flexible on date',
    aiSummary: 'High-value private dining inquiry. 40-person anniversary event. Flexible dates suggest good conversion potential.',
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    email: 'marcus@corp.com',
    phone: '(646) 555-0102',
    type: 'CORPORATE_DINNER',
    status: 'CONTACTED',
    source: 'Website',
    sourcePlatform: 'Google',
    value: '$3,800',
    partySize: 25,
    time: '4 hours ago',
    notes: 'Q2 team dinner, needs AV setup',
  },
  {
    id: '3',
    name: 'Jennifer Park',
    email: 'jen@example.com',
    phone: '(917) 555-0103',
    type: 'BIRTHDAY_DINNER',
    status: 'ENGAGED',
    source: 'Instagram',
    sourcePlatform: 'Instagram',
    value: '$600',
    partySize: 8,
    time: '1 day ago',
    notes: 'Milestone 40th birthday',
  },
  {
    id: '4',
    name: 'Westside Events Co.',
    email: 'events@westside.com',
    phone: '(212) 555-0104',
    type: 'CATERING',
    status: 'NEW',
    source: 'Website',
    sourcePlatform: 'Direct',
    value: '$12,000',
    partySize: 200,
    time: '1 day ago',
    notes: 'Off-site catering for product launch',
  },
  {
    id: '5',
    name: 'David Chen',
    email: 'dchen@example.com',
    phone: '(718) 555-0105',
    type: 'LARGE_PARTY',
    status: 'BOOKED',
    source: 'Referral',
    sourcePlatform: 'Direct',
    value: '$2,100',
    partySize: 15,
    time: '2 days ago',
    notes: 'Confirmed for March 28',
  },
  {
    id: '6',
    name: 'Amy Rodriguez',
    email: 'amy@example.com',
    phone: '(212) 555-0106',
    type: 'RESERVATION_INTEREST',
    status: 'NEW',
    source: 'Website',
    sourcePlatform: 'Direct',
    value: '$180',
    partySize: 4,
    time: '3 days ago',
    notes: 'Interested in Saturday dinner',
  },
  {
    id: '7',
    name: 'Tech Startup Inc.',
    email: 'events@techco.com',
    phone: '(646) 555-0107',
    type: 'PRIVATE_DINING',
    status: 'LOST',
    source: 'Website',
    sourcePlatform: 'Google',
    value: '$5,500',
    partySize: 50,
    time: '5 days ago',
    notes: 'Lost to competitor on price',
  },
  {
    id: '8',
    name: 'Lisa Thompson',
    email: 'lisa@example.com',
    phone: '(347) 555-0108',
    type: 'ANNIVERSARY',
    status: 'CONTACTED',
    source: 'Website',
    sourcePlatform: 'Instagram',
    value: '$420',
    partySize: 2,
    time: '6 days ago',
    notes: 'Special anniversary dinner, VIP treatment requested',
  },
]

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

type FilterTab = 'ALL' | LeadStatus

const filterTabs: { key: FilterTab; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'NEW', label: 'New' },
  { key: 'CONTACTED', label: 'Contacted' },
  { key: 'ENGAGED', label: 'Engaged' },
  { key: 'BOOKED', label: 'Booked' },
  { key: 'LOST', label: 'Lost' },
]

interface AddLeadForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  leadType: LeadType | ''
  source: string
  notes: string
  estimatedValue: string
  partySize: string
}

const emptyForm: AddLeadForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  leadType: '',
  source: '',
  notes: '',
  estimatedValue: '',
  partySize: '',
}

export default function LeadsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [addLeadOpen, setAddLeadOpen] = useState(false)
  const [form, setForm] = useState<AddLeadForm>(emptyForm)

  const filtered = activeTab === 'ALL' ? mockLeads : mockLeads.filter(l => l.status === activeTab)

  const stats = {
    newLeads: mockLeads.filter(l => l.status === 'NEW').length,
    totalValue: '$28,800',
    avgResponseTime: '1.4 hrs',
    bookedThisMonth: mockLeads.filter(l => l.status === 'BOOKED').length,
  }

  function toggleExpand(id: string) {
    setExpandedId(prev => (prev === id ? null : id))
  }

  function handleFormChange(field: keyof AddLeadForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleAddLead() {
    // In a real app, submit to API
    setAddLeadOpen(false)
    setForm(emptyForm)
  }

  return (
    <>
      <Topbar
        title="Leads Inbox"
        description="Manage and follow up on incoming inquiries"
        actions={
          <Button size="sm" onClick={() => setAddLeadOpen(true)}>
            <Plus className="h-3.5 w-3.5" />
            Add Lead
          </Button>
        }
      />

      <PageShell>
        {/* Stats Row */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            title="New Leads"
            value={stats.newLeads}
            description="Awaiting first contact"
            icon={<Inbox className="h-5 w-5" />}
            priority="high"
          />
          <StatCard
            title="Total Pipeline Value"
            value={stats.totalValue}
            description="Across all open leads"
            icon={<DollarSign className="h-5 w-5" />}
            priority="high"
          />
          <StatCard
            title="Avg Response Time"
            value={stats.avgResponseTime}
            description="Last 30 days"
            icon={<Clock className="h-5 w-5" />}
          />
          <StatCard
            title="Booked This Month"
            value={stats.bookedThisMonth}
            description="Converted leads"
            icon={<CalendarCheck className="h-5 w-5" />}
            priority="medium"
          />
        </div>

        {/* Filter Tabs */}
        <div className="mb-4 flex items-center gap-1 border-b border-zinc-200">
          {filterTabs.map(tab => {
            const count = tab.key === 'ALL' ? mockLeads.length : mockLeads.filter(l => l.status === tab.key).length
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative pb-3 pt-1 px-4 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'text-indigo-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600'
                    : 'text-zinc-500 hover:text-zinc-700'
                }`}
              >
                {tab.label}
                <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                  activeTab === tab.key ? 'bg-indigo-100 text-indigo-700' : 'bg-zinc-100 text-zinc-500'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Lead List */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Inbox className="h-6 w-6" />}
            title="No leads found"
            description="There are no leads matching this filter."
          />
        ) : (
          <div className="space-y-3">
            {filtered.map(lead => {
              const isExpanded = expandedId === lead.id
              const status = statusConfig[lead.status]
              return (
                <Card key={lead.id} className="overflow-hidden">
                  {/* Main row */}
                  <div className="flex items-center gap-4 p-4">
                    <Avatar name={lead.name} size="md" />

                    {/* Identity + meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/leads/${lead.id}`}
                          className="text-sm font-semibold text-zinc-900 hover:text-indigo-600 transition-colors"
                        >
                          {lead.name}
                        </Link>
                        <Badge variant="outline">{leadTypeLabels[lead.type]}</Badge>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {lead.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {lead.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {lead.partySize} guests
                        </span>
                        <span>{lead.sourcePlatform}</span>
                        <span>{lead.time}</span>
                      </div>
                    </div>

                    {/* Value + actions */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-sm font-bold text-zinc-900">{lead.value}</span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="Call"
                          onClick={() => window.open(`tel:${lead.phone}`)}
                        >
                          <Phone className="h-3.5 w-3.5 text-zinc-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="Email"
                          onClick={() => window.open(`mailto:${lead.email}`)}
                        >
                          <Mail className="h-3.5 w-3.5 text-zinc-500" />
                        </Button>
                        <Link href={`/leads/${lead.id}`}>
                          <Button variant="ghost" size="icon-sm" title="View">
                            <Eye className="h-3.5 w-3.5 text-zinc-500" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => toggleExpand(lead.id)}
                          title={isExpanded ? 'Collapse' : 'Expand'}
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-3.5 w-3.5 text-zinc-400" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Quick View */}
                  {isExpanded && (
                    <div className="border-t border-zinc-100 bg-zinc-50 px-4 py-3 grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">Notes</p>
                        <p className="text-sm text-zinc-700">{lead.notes || 'No notes added.'}</p>
                      </div>
                      {lead.aiSummary && (
                        <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                            <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">AI Summary</p>
                          </div>
                          <p className="text-sm text-indigo-800">{lead.aiSummary}</p>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        )}
      </PageShell>

      {/* Add Lead Dialog */}
      <Dialog open={addLeadOpen} onOpenChange={setAddLeadOpen}>
        <DialogContent className="max-w-lg" onClose={() => setAddLeadOpen(false)}>
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="Sarah"
                    value={form.firstName}
                    onChange={e => handleFormChange('firstName', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Mitchell"
                    value={form.lastName}
                    onChange={e => handleFormChange('lastName', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="sarah@example.com"
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

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="leadType">Lead Type</Label>
                  <Select
                    id="leadType"
                    value={form.leadType}
                    onChange={e => handleFormChange('leadType', e.target.value)}
                  >
                    <option value="">Select type...</option>
                    <option value="PRIVATE_DINING">Private Dining</option>
                    <option value="CORPORATE_DINNER">Corporate Dinner</option>
                    <option value="BIRTHDAY_DINNER">Birthday Dinner</option>
                    <option value="CATERING">Catering</option>
                    <option value="LARGE_PARTY">Large Party</option>
                    <option value="RESERVATION_INTEREST">Reservation</option>
                    <option value="ANNIVERSARY">Anniversary</option>
                    <option value="GENERAL_INQUIRY">General Inquiry</option>
                  </Select>
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
                    <option value="Phone">Phone</option>
                    <option value="Walk-in">Walk-in</option>
                    <option value="Direct">Direct</option>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="estimatedValue">Estimated Value</Label>
                  <Input
                    id="estimatedValue"
                    placeholder="$2,500"
                    value={form.estimatedValue}
                    onChange={e => handleFormChange('estimatedValue', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="partySize">Party Size</Label>
                  <Input
                    id="partySize"
                    type="number"
                    placeholder="20"
                    value={form.partySize}
                    onChange={e => handleFormChange('partySize', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any relevant details about this lead..."
                  rows={3}
                  value={form.notes}
                  onChange={e => handleFormChange('notes', e.target.value)}
                />
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddLeadOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddLead}>
              <Plus className="h-3.5 w-3.5" />
              Add Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
