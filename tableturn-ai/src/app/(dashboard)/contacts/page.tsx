'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Users, Upload, Search, Filter, MoreHorizontal, Mail, Phone, Tag, Plus } from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { PageShell } from '@/components/layout/page-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar } from '@/components/ui/avatar'
import { EmptyState } from '@/components/ui/empty-state'
import { DropdownMenu, DropdownItem, DropdownSeparator } from '@/components/ui/dropdown'

const mockContacts = [
  { id: '1', name: 'Sarah Mitchell', email: 'sarah@example.com', phone: '(212) 555-0101', tags: ['VIP', 'Birthday Club'], lastVisit: 'Mar 15, 2025', visits: 12, source: 'Import', subscribed: true },
  { id: '2', name: 'Marcus Johnson', email: 'marcus@example.com', phone: '(212) 555-0102', tags: ['Private Events'], lastVisit: 'Feb 28, 2025', visits: 3, source: 'Web Form', subscribed: true },
  { id: '3', name: 'Jennifer Park', email: 'jen.park@example.com', phone: '(917) 555-0103', tags: ['VIP', 'Newsletter'], lastVisit: 'Jan 10, 2025', visits: 24, source: 'Import', subscribed: true },
  { id: '4', name: 'Robert Chen', email: 'rchen@example.com', phone: '(646) 555-0104', tags: ['Lapsed'], lastVisit: 'Oct 5, 2024', visits: 2, source: 'Import', subscribed: false },
  { id: '5', name: 'Amanda Torres', email: 'amanda.t@example.com', phone: '(718) 555-0105', tags: ['Birthday Club', 'Newsletter'], lastVisit: 'Mar 20, 2025', visits: 8, source: 'Walk-in', subscribed: true },
  { id: '6', name: 'David Kim', email: 'dkim@example.com', phone: '(212) 555-0106', tags: ['VIP'], lastVisit: 'Mar 22, 2025', visits: 31, source: 'Import', subscribed: true },
  { id: '7', name: 'Lisa Thompson', email: 'lisa.t@example.com', phone: '(347) 555-0107', tags: ['Newsletter'], lastVisit: 'Feb 14, 2025', visits: 5, source: 'Social', subscribed: true },
  { id: '8', name: 'James Wilson', email: 'jwilson@example.com', phone: '(212) 555-0108', tags: ['Lapsed'], lastVisit: 'Sep 12, 2024', visits: 1, source: 'Import', subscribed: false },
]

const tagColors: Record<string, string> = {
  'VIP': 'purple',
  'Birthday Club': 'pink',
  'Private Events': 'blue',
  'Lapsed': 'warning',
  'Newsletter': 'secondary',
}

export default function ContactsPage() {
  const [search, setSearch] = useState('')
  const filtered = mockContacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Topbar
        title="Contacts"
        description={`${mockContacts.length.toLocaleString()} total contacts`}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/contacts/import">
              <Button variant="outline" size="sm">
                <Upload className="h-3.5 w-3.5" />
                Import CSV
              </Button>
            </Link>
            <Button size="sm">
              <Plus className="h-3.5 w-3.5" />
              Add Contact
            </Button>
          </div>
        }
      />
      <PageShell>
        {/* Stats row */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Total Contacts', value: '3,847' },
            { label: 'Subscribed', value: '3,201' },
            { label: 'Suppressed', value: '646' },
            { label: 'Imported this month', value: '124' },
          ].map(stat => (
            <div key={stat.label} className="rounded-lg border border-zinc-200 bg-white px-4 py-3">
              <p className="text-xs text-zinc-400 font-medium">{stat.label}</p>
              <p className="text-xl font-bold text-zinc-900 mt-0.5">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-4 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search contacts..."
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-3.5 w-3.5" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Tag className="h-3.5 w-3.5" />
            Tags
          </Button>
        </div>

        {/* Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Visits</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center">
                    <EmptyState
                      icon={<Users className="h-6 w-6" />}
                      title="No contacts found"
                      description="Try adjusting your search or import contacts from a CSV file."
                    />
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(contact => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar name={contact.name} size="sm" />
                        <Link href={`/contacts/${contact.id}`} className="font-medium text-zinc-900 hover:text-indigo-600 transition-colors">
                          {contact.name}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                          <Mail className="h-3 w-3 text-zinc-400" />
                          {contact.email}
                        </div>
                        {contact.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                            <Phone className="h-3 w-3 text-zinc-400" />
                            {contact.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.map(tag => (
                          <Badge key={tag} variant={tagColors[tag] as any}>{tag}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-600">{contact.lastVisit}</TableCell>
                    <TableCell className="font-medium text-zinc-900">{contact.visits}</TableCell>
                    <TableCell className="text-zinc-500">{contact.source}</TableCell>
                    <TableCell>
                      {contact.subscribed ? (
                        <Badge variant="success">Subscribed</Badge>
                      ) : (
                        <Badge variant="secondary">Unsubscribed</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu
                        align="right"
                        trigger={
                          <Button variant="ghost" size="icon-sm" className="text-zinc-400">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        }
                      >
                        <DropdownItem>View Profile</DropdownItem>
                        <DropdownItem>Send Email</DropdownItem>
                        <DropdownItem>Add to Segment</DropdownItem>
                        <DropdownSeparator />
                        <DropdownItem destructive>Suppress</DropdownItem>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between text-sm text-zinc-500">
          <p>Showing {filtered.length} of {mockContacts.length} contacts</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </PageShell>
    </>
  )
}
