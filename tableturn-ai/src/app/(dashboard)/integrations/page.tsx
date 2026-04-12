'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, RefreshCw, Settings, Link2, AlertTriangle } from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { PageShell } from '@/components/layout/page-shell'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog'

const integrations = [
  {
    id: 'google',
    name: 'Google Workspace / Gmail',
    description: 'Send bulk email campaigns through your own Gmail account. Requires OAuth authorization.',
    status: 'connected',
    accountName: 'Rosewood Group',
    accountEmail: 'marketing@rosewood.com',
    lastSync: '2 minutes ago',
    features: ['Bulk email sending', 'Send scheduling', 'Delivery tracking', 'OAuth secured'],
    color: 'bg-red-500',
    initials: 'G',
  },
  {
    id: 'meta',
    name: 'Meta / Facebook Ads',
    description: 'Sync paid ad campaign data, track spend, impressions, clicks, and reservation-attributed conversions.',
    status: 'disconnected',
    accountName: null,
    accountEmail: null,
    lastSync: null,
    features: ['Ad spend sync', 'Campaign metrics', 'Audience insights', 'Conversion tracking'],
    color: 'bg-blue-600',
    initials: 'f',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Sync organic post performance — reach, saves, shares, and profile visit attribution.',
    status: 'disconnected',
    accountName: null,
    accountEmail: null,
    lastSync: null,
    features: ['Post metrics', 'Reel analytics', 'Story reach', 'Follower trends'],
    color: 'bg-gradient-to-br from-purple-500 to-pink-500',
    initials: '⬡',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    description: 'Sync TikTok video performance and paid ad data for content theme reporting.',
    status: 'disconnected',
    accountName: null,
    accountEmail: null,
    lastSync: null,
    features: ['Video views', 'Watch time', 'TikTok Ads', 'Profile visits'],
    color: 'bg-zinc-900',
    initials: '♪',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    description: 'Track video performance, watch time, and audience engagement for content reporting.',
    status: 'disconnected',
    accountName: null,
    accountEmail: null,
    lastSync: null,
    features: ['Video analytics', 'Watch time', 'Subscribers', 'Impressions'],
    color: 'bg-red-600',
    initials: '▶',
  },
]

export default function IntegrationsPage() {
  const [connectOpen, setConnectOpen] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<typeof integrations[0] | null>(null)

  const openConnect = (integration: typeof integrations[0]) => {
    setSelectedIntegration(integration)
    setConnectOpen(true)
  }

  return (
    <>
      <Topbar title="Integrations" description="Connect platforms to sync data and send campaigns" />
      <PageShell>
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-900">Data import available for all platforms</p>
              <p className="text-sm text-amber-700">While live API sync requires OAuth connections, you can manually import CSV exports from any platform to populate your reporting dashboards immediately.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {integrations.map(integration => (
            <Card key={integration.id} className={`${integration.status === 'connected' ? 'border-emerald-200' : ''}`}>
              <CardContent className="pt-5">
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-white text-lg font-bold flex-shrink-0 ${integration.color}`}>
                    {integration.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-zinc-900">{integration.name}</h3>
                      {integration.status === 'connected' ? (
                        <Badge variant="success" className="flex-shrink-0">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Connected
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="flex-shrink-0">Not connected</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-zinc-500">{integration.description}</p>

                    {integration.status === 'connected' && integration.accountEmail && (
                      <div className="mt-2 rounded-lg bg-zinc-50 border border-zinc-100 px-3 py-2">
                        <p className="text-xs text-zinc-500">
                          Connected as <span className="font-semibold text-zinc-700">{integration.accountEmail}</span>
                        </p>
                        <p className="text-xs text-zinc-400 mt-0.5">Last sync: {integration.lastSync}</p>
                      </div>
                    )}

                    <div className="mt-3 flex flex-wrap gap-1">
                      {integration.features.map(f => (
                        <span key={f} className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">{f}</span>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      {integration.status === 'connected' ? (
                        <>
                          <Button size="sm" variant="outline"><RefreshCw className="h-3.5 w-3.5" /> Sync Now</Button>
                          <Button size="sm" variant="outline"><Settings className="h-3.5 w-3.5" /> Settings</Button>
                          <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50">Disconnect</Button>
                        </>
                      ) : (
                        <Button size="sm" onClick={() => openConnect(integration)}>
                          <Link2 className="h-3.5 w-3.5" /> Connect {integration.name.split('/')[0].trim()}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Connect Dialog */}
        <Dialog open={connectOpen} onOpenChange={setConnectOpen}>
          <DialogContent className="max-w-md" onClose={() => setConnectOpen(false)}>
            <DialogHeader>
              <DialogTitle>Connect {selectedIntegration?.name}</DialogTitle>
            </DialogHeader>
            <DialogBody>
              {selectedIntegration?.id === 'google' ? (
                <div className="space-y-4">
                  <p className="text-sm text-zinc-600">TableTurn AI uses Gmail OAuth to send campaigns from your Google Workspace account. We request only the minimum required permissions.</p>
                  <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-4 space-y-2">
                    <p className="text-xs font-semibold text-zinc-700 uppercase tracking-wide">Permissions requested</p>
                    {['Send emails on your behalf', 'Read sent messages for tracking', 'Manage email labels'].map(p => (
                      <div key={p} className="flex items-center gap-2 text-sm text-zinc-600">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" /> {p}
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700">
                    <strong>Compliance note:</strong> You are responsible for ensuring your email list has appropriate consent. TableTurn AI automatically appends unsubscribe footers to all campaigns.
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-zinc-600">Connect your {selectedIntegration?.name} account to automatically sync campaign and performance data into your reports.</p>
                  <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-4 space-y-2">
                    <p className="text-xs font-semibold text-zinc-700 uppercase tracking-wide">What syncs</p>
                    {(selectedIntegration?.features ?? []).map(f => (
                      <div key={f} className="flex items-center gap-2 text-sm text-zinc-600">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" /> {f}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-zinc-400">OAuth connection is read-only. TableTurn AI will never post on your behalf without explicit action.</p>
                </div>
              )}
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConnectOpen(false)}>Cancel</Button>
              <Button onClick={() => setConnectOpen(false)}>
                Authorize with {selectedIntegration?.name.split('/')[0].trim()}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageShell>
    </>
  )
}
