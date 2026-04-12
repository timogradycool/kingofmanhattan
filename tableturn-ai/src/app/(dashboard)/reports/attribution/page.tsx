import Link from 'next/link'
import { Topbar } from '@/components/layout/topbar'
import { PageShell } from '@/components/layout/page-shell'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/ui/stat-card'

const tabs = [
  { label: 'Overview', href: '/reports' },
  { label: 'Paid Social', href: '/reports/paid-social' },
  { label: 'Organic Social', href: '/reports/organic' },
  { label: 'Attribution', href: '/reports/attribution' },
]

const sourceData = [
  { source: 'Meta Ads', reservations: 58, privateEvents: 12, catering: 3, giftCards: 8, spend: '$2,000', cpr: '$34.50', color: 'bg-blue-500', pct: 42 },
  { source: 'Instagram Organic', reservations: 38, privateEvents: 8, catering: 1, giftCards: 4, spend: '—', cpr: '—', color: 'bg-pink-500', pct: 28 },
  { source: 'Email Campaigns', reservations: 26, privateEvents: 3, catering: 0, giftCards: 2, spend: '—', cpr: '—', color: 'bg-indigo-500', pct: 18 },
  { source: 'Google Ads', reservations: 20, privateEvents: 2, catering: 1, giftCards: 6, spend: '$1,200', cpr: '$60.00', color: 'bg-amber-500', pct: 12 },
]

const utmData = [
  { campaign: 'spring_private_dining', medium: 'cpc', source: 'meta', clicks: 1240, conversions: 34, cpa: '$35.30' },
  { campaign: 'happy_hour_thursday', medium: 'email', source: 'mailsend', clicks: 892, conversions: 28, cpa: '—' },
  { campaign: 'chef_tasting_launch', medium: 'cpc', source: 'google', clicks: 340, conversions: 12, cpa: '$100.00' },
  { campaign: 'brunch_promo_march', medium: 'social', source: 'instagram', clicks: 289, conversions: 9, cpa: '—' },
  { campaign: 'birthday_club_april', medium: 'email', source: 'mailsend', clicks: 214, conversions: 18, cpa: '—' },
]

export default function AttributionReportPage() {
  return (
    <>
      <Topbar title="Reports" description="Source Attribution Analysis" />
      <PageShell>
        <div className="mb-6 flex gap-1 border-b border-zinc-200">
          {tabs.map(t => (
            <Link key={t.href} href={t.href} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${t.href === '/reports/attribution' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-800'}`}>
              {t.label}
            </Link>
          ))}
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-bold text-zinc-900">Source Attribution</h2>
          <p className="text-sm text-zinc-500">Which channels drove real business outcomes · Last 30 days</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
          <StatCard title="Total Attributed Resv." value="142" trend={18} priority="high" />
          <StatCard title="Private Event Attr." value="25" trend={28} priority="high" />
          <StatCard title="Best Channel" value="Meta Ads" description="By reservation volume" priority="high" />
          <StatCard title="Lowest Cost/Resv." value="Email" description="$0 marginal cost" priority="medium" />
        </div>

        {/* Source breakdown visual */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Reservation Attribution by Source</CardTitle>
            <CardDescription>Which channels drove the most reservation outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sourceData.map(s => (
                <div key={s.source}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${s.color}`} />
                      <span className="text-sm font-medium text-zinc-900">{s.source}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-zinc-500">{s.reservations} reservations</span>
                      <span className="font-semibold text-zinc-900">{s.pct}%</span>
                    </div>
                  </div>
                  <div className="h-2.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Outcomes by source table */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Outcomes by Source</CardTitle>
            <CardDescription>All attributed business outcomes per channel</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">Source</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-emerald-600 uppercase tracking-wide bg-emerald-50">Reservations</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-purple-600 uppercase tracking-wide bg-purple-50">Private Events</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wide">Catering</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wide">Gift Cards</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wide">Ad Spend</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wide">Cost/Resv.</th>
                </tr>
              </thead>
              <tbody>
                {sourceData.map(s => (
                  <tr key={s.source} className="border-b border-zinc-100 hover:bg-zinc-50">
                    <td className="px-4 py-3 font-medium text-zinc-900">
                      <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full ${s.color}`} />
                        {s.source}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-emerald-700 bg-emerald-50/50">{s.reservations}</td>
                    <td className="px-4 py-3 text-right font-semibold text-purple-700 bg-purple-50/50">{s.privateEvents}</td>
                    <td className="px-4 py-3 text-right text-zinc-600">{s.catering}</td>
                    <td className="px-4 py-3 text-right text-zinc-600">{s.giftCards}</td>
                    <td className="px-4 py-3 text-right text-zinc-600">{s.spend}</td>
                    <td className="px-4 py-3 text-right text-zinc-600">{s.cpr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* UTM Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>UTM Campaign Analysis</CardTitle>
            <CardDescription>Campaign-level click and conversion tracking</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">Campaign</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">Source / Medium</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wide">Clicks</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wide">Conversions</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wide">CPA</th>
                </tr>
              </thead>
              <tbody>
                {utmData.map(u => (
                  <tr key={u.campaign} className="border-b border-zinc-100 hover:bg-zinc-50">
                    <td className="px-4 py-3 font-mono text-xs text-zinc-700">{u.campaign}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Badge variant="secondary">{u.source}</Badge>
                        <Badge variant="outline">{u.medium}</Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-700">{u.clicks.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-semibold text-zinc-900">{u.conversions}</td>
                    <td className="px-4 py-3 text-right text-zinc-600">{u.cpa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </PageShell>
    </>
  )
}
