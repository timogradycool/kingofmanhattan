'use client'

import { useState } from 'react'
import { Shield, Users, Building2, Mail, CreditCard } from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { PageShell } from '@/components/layout/page-shell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog'

const tabs = ['Organization', 'Locations', 'Team', 'Email Settings', 'Billing']

const team = [
  { id: '1', name: 'Jane Doe', email: 'jane@rosewood.com', role: 'ADMIN', lastLogin: '2 hours ago', avatar: null },
  { id: '2', name: 'Marcus Lee', email: 'marcus@rosewood.com', role: 'MARKETING_MANAGER', lastLogin: '1 day ago', avatar: null },
  { id: '3', name: 'Sofia Garcia', email: 'sofia@rosewood.com', role: 'EVENT_MANAGER', lastLogin: '3 days ago', avatar: null },
  { id: '4', name: 'Kevin Park', email: 'kevin@rosewood.com', role: 'VIEWER', lastLogin: '1 week ago', avatar: null },
]

const locations = [
  { id: '1', name: 'Rosewood Kitchen', concept: 'Chef-driven American', address: '123 Park Ave, New York, NY' },
  { id: '2', name: 'Rosewood Bar & Lounge', concept: 'Cocktail Bar', address: '125 Park Ave, New York, NY' },
  { id: '3', name: 'Rosewood Private Dining', concept: 'Private Events Venue', address: '127 Park Ave, New York, NY' },
]

const roleColors: Record<string, string> = {
  ADMIN: 'purple', MARKETING_MANAGER: 'blue', EVENT_MANAGER: 'indigo', VIEWER: 'secondary',
}
const roleLabels: Record<string, string> = {
  ADMIN: 'Admin', MARKETING_MANAGER: 'Marketing Manager', EVENT_MANAGER: 'Event Manager', VIEWER: 'Viewer',
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Organization')
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('VIEWER')

  return (
    <>
      <Topbar title="Settings" description="Manage your organization, team, and preferences" />
      <PageShell>
        {/* Tab nav */}
        <div className="mb-6 flex gap-1 border-b border-zinc-200">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-800'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Organization */}
        {activeTab === 'Organization' && (
          <div className="max-w-2xl space-y-5">
            <Card>
              <CardHeader><CardTitle>Organization Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5"><Label>Organization Name</Label><Input defaultValue="The Rosewood Group" /></div>
                <div className="space-y-1.5"><Label>Website</Label><Input defaultValue="https://rosewoodnyc.com" /></div>
                <div className="space-y-1.5"><Label>Phone</Label><Input defaultValue="(212) 555-9000" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Timezone</Label>
                    <Select defaultValue="America/New_York">
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Plan</Label>
                    <div className="h-9 flex items-center"><Badge variant="purple">Professional</Badge></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Brand Voice</CardTitle><CardDescription>Used to guide AI-generated content</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Default Tone</Label>
                  <Select defaultValue="polished">
                    {['polished', 'warm', 'playful', 'elegant', 'edgy', 'direct'].map(t => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Restaurant Archetype</Label>
                  <Select defaultValue="upscale">
                    <option value="upscale">Upscale Restaurant</option>
                    <option value="neighborhood">Neighborhood Restaurant</option>
                    <option value="themed">Themed Restaurant</option>
                    <option value="bar">Bar & Restaurant</option>
                    <option value="hospitality">Hospitality Group</option>
                    <option value="chef-driven">Chef-driven Concept</option>
                  </Select>
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </div>
        )}

        {/* Locations */}
        {activeTab === 'Locations' && (
          <div className="max-w-3xl space-y-4">
            {locations.map(loc => (
              <Card key={loc.id}>
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 flex-shrink-0">
                        <Building2 className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-900">{loc.name}</p>
                        <p className="text-xs text-zinc-500">{loc.concept}</p>
                        <p className="text-xs text-zinc-400">{loc.address}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" className="w-full">+ Add Location</Button>
          </div>
        )}

        {/* Team */}
        {activeTab === 'Team' && (
          <div className="max-w-3xl">
            <div className="mb-4 flex justify-end">
              <Button size="sm" onClick={() => setInviteOpen(true)}>
                <Users className="h-3.5 w-3.5" /> Invite Team Member
              </Button>
            </div>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {team.map(member => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar name={member.name} size="sm" />
                          <span className="font-medium text-zinc-900">{member.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-zinc-600">{member.email}</TableCell>
                      <TableCell><Badge variant={roleColors[member.role] as any}>{roleLabels[member.role]}</Badge></TableCell>
                      <TableCell className="text-zinc-500">{member.lastLogin}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">Change Role</Button>
                          {member.role !== 'ADMIN' && <Button variant="ghost" size="sm" className="text-red-500">Remove</Button>}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
              <DialogContent className="max-w-md" onClose={() => setInviteOpen(false)}>
                <DialogHeader><DialogTitle>Invite Team Member</DialogTitle></DialogHeader>
                <DialogBody>
                  <div className="space-y-4">
                    <div className="space-y-1.5"><Label>Email Address</Label><Input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="colleague@restaurant.com" /></div>
                    <div className="space-y-1.5">
                      <Label>Role</Label>
                      <Select value={inviteRole} onChange={e => setInviteRole(e.target.value)}>
                        <option value="ADMIN">Admin — Full access</option>
                        <option value="MARKETING_MANAGER">Marketing Manager — Campaigns, contacts, reports</option>
                        <option value="EVENT_MANAGER">Event Manager — Private events, leads</option>
                        <option value="VIEWER">Viewer — Read-only access</option>
                      </Select>
                    </div>
                  </div>
                </DialogBody>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
                  <Button onClick={() => setInviteOpen(false)}>Send Invitation</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Email Settings */}
        {activeTab === 'Email Settings' && (
          <div className="max-w-2xl space-y-5">
            <Card>
              <CardHeader><CardTitle>Sender Identity</CardTitle><CardDescription>Used as the default "From" for campaigns</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <p className="text-sm text-emerald-800">Gmail connected: <strong>marketing@rosewood.com</strong></p>
                </div>
                <div className="space-y-1.5"><Label>Sender Name</Label><Input defaultValue="Rosewood Kitchen" /></div>
                <div className="space-y-1.5"><Label>Reply-to Email</Label><Input defaultValue="hello@rosewood.com" /></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Sending Limits</CardTitle><CardDescription>Throttle settings to stay within Gmail quota</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Max emails per hour</Label>
                  <Input type="number" defaultValue={200} />
                  <p className="text-xs text-zinc-400">Gmail Workspace limit is typically 2,000/day. Stay conservative.</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Unsubscribe Footer</CardTitle><CardDescription>Automatically appended to every campaign</CardDescription></CardHeader>
              <CardContent>
                <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-3 text-xs text-zinc-600 font-mono">
                  You received this email because you dined with us or opted in to our guest communications. To unsubscribe, click here: [UNSUBSCRIBE_LINK]<br /><br />
                  Rosewood Group · 123 Park Ave · New York, NY 10017
                </div>
                <p className="mt-2 text-xs text-zinc-400">This footer is required and cannot be disabled.</p>
              </CardContent>
            </Card>
            <div className="flex justify-end"><Button>Save Settings</Button></div>
          </div>
        )}

        {/* Billing */}
        {activeTab === 'Billing' && (
          <div className="max-w-2xl space-y-5">
            <Card>
              <CardHeader><CardTitle>Current Plan</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2"><p className="text-xl font-bold text-zinc-900">Professional Plan</p><Badge variant="purple">Active</Badge></div>
                    <p className="text-sm text-zinc-500 mt-1">$149/month · Billed monthly</p>
                    <p className="text-xs text-zinc-400 mt-2">Next billing: May 1, 2025</p>
                  </div>
                  <CreditCard className="h-8 w-8 text-zinc-300" />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    { label: 'Contacts', value: '3,847 / 10,000' },
                    { label: 'Campaigns sent', value: '8 / unlimited' },
                    { label: 'Locations', value: '3 / 10' },
                  ].map(u => (
                    <div key={u.label} className="rounded-lg bg-zinc-50 border border-zinc-200 p-3">
                      <p className="text-xs text-zinc-400">{u.label}</p>
                      <p className="text-sm font-semibold text-zinc-900 mt-0.5">{u.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline">Manage Billing</Button>
                  <Button variant="ghost" className="text-red-500">Cancel Plan</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </PageShell>
    </>
  )
}
