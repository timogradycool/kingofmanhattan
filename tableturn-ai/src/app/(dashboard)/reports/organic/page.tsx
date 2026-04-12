import Link from 'next/link'
import { Topbar } from '@/components/layout/topbar'
import { PageShell } from '@/components/layout/page-shell'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/ui/stat-card'
import { Zap, TrendingUp } from 'lucide-react'

const themes = [
  { theme: 'Private Events', platform: 'Instagram', impressions: 42000, saves: 891, shares: 234, linkClicks: 312, reservationClicks: 89, trend: '+28%', rating: 'top' },
  { theme: 'Chef / Personality', platform: 'Instagram', impressions: 68000, saves: 642, shares: 489, linkClicks: 204, reservationClicks: 31, trend: '+19%', rating: 'top' },
  { theme: 'Food Beauty Shot', platform: 'TikTok', impressions: 124000, saves: 1240, shares: 892, linkClicks: 128, reservationClicks: 12, trend: '+11%', rating: 'high' },
  { theme: 'Cocktails', platform: 'Instagram', impressions: 38000, saves: 412, shares: 198, linkClicks: 89, reservationClicks: 8, trend: '+22%', rating: 'high' },
  { theme: 'Behind the Scenes', platform: 'TikTok', impressions: 89000, saves: 329, shares: 712, linkClicks: 64, reservationClicks: 4, trend: '+9%', rating: 'medium' },
  { theme: 'Guest Experience', platform: 'Instagram', impressions: 31000, saves: 218, shares: 124, linkClicks: 42, reservationClicks: 6, trend: '+4%', rating: 'medium' },
  { theme: 'Promotion / Offer', platform: 'Facebook', impressions: 18000, saves: 84, shares: 56, linkClicks: 198, reservationClicks: 24, trend: '-3%', rating: 'low' },
  { theme: 'Holiday / Seasonal', platform: 'Instagram', impressions: 22000, saves: 312, shares: 189, linkClicks: 72, reservationClicks: 11, trend: '+15%', rating: 'medium' },
]

const ratingColors: Record<string, string> = { top: 'success', high: 'blue', medium: 'secondary', low: 'warning' }
const platformColors: Record<string, string> = { Instagram: 'pink', TikTok: 'secondary', Facebook: 'blue', YouTube: 'destructive' }

const tabs = [
  { label: 'Overview', href: '/reports' },
  { label: 'Paid Social', href: '/reports/paid-social' },
  { label: 'Organic Social', href: '/reports/organic' },
  { label: 'Attribution', href: '/reports/attribution' },
]

export default function OrganicReportPage() {
  return (
    <>
      <Topbar title="Reports" description="Organic Social Content Performance" />
      <PageShell>
        {/* Tabs */}
        <div className="mb-6 flex gap-1 border-b border-zinc-200">
          {tabs.map(t => (
            <Link key={t.href} href={t.href} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${t.href === '/reports/organic' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-800'}`}>
              {t.label}
            </Link>
          ))}
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-bold text-zinc-900">Organic Social Performance</h2>
          <p className="text-sm text-zinc-500">Content theme analysis across all platforms · Last 30 days</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
          <StatCard title="Total Reach" value="128.4K" trend={11} />
          <StatCard title="Total Saves" value="4,128" trend={22} priority="high" />
          <StatCard title="Total Shares" value="2,894" trend={14} />
          <StatCard title="Avg Engagement Rate" value="4.2%" trend={6} />
        </div>

        {/* AI Insight */}
        <div className="mb-6 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-4">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-indigo-900">AI Content Insight</p>
              <p className="text-sm text-indigo-700 mt-0.5">
                Private Events content drives 3× more saves than your average post and generates 89 reservation-attributed clicks — the highest of any theme. Consider posting Private Events content on Tuesday/Wednesday when your audience saves rates peak. Chef/Personality content drives strong shares; pair these two themes for maximum distribution.
              </p>
            </div>
          </div>
        </div>

        {/* Theme performance */}
        <Card>
          <CardHeader>
            <CardTitle>Content Theme Performance</CardTitle>
            <CardDescription>Sorted by business impact (saves + reservation clicks)</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">Theme</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">Platform</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wide">Impressions</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-emerald-600 uppercase tracking-wide bg-emerald-50">Saves</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wide">Shares</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-blue-600 uppercase tracking-wide bg-blue-50">Resv. Clicks</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wide">Trend</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {themes.map(t => (
                    <tr key={t.theme} className="border-b border-zinc-100 hover:bg-zinc-50">
                      <td className="px-4 py-3 font-medium text-zinc-900">{t.theme}</td>
                      <td className="px-4 py-3"><Badge variant={platformColors[t.platform] as any}>{t.platform}</Badge></td>
                      <td className="px-4 py-3 text-right text-zinc-600">{(t.impressions / 1000).toFixed(0)}K</td>
                      <td className="px-4 py-3 text-right font-semibold text-emerald-700 bg-emerald-50/50">{t.saves.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-zinc-600">{t.shares.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-semibold text-blue-700 bg-blue-50/50">{t.reservationClicks}</td>
                      <td className={`px-4 py-3 text-right text-xs font-semibold ${t.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>{t.trend}</td>
                      <td className="px-4 py-3"><Badge variant={ratingColors[t.rating] as any}>{t.rating}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Platform breakdown */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { platform: 'Instagram', posts: 24, reach: '68K', topTheme: 'Private Events', engRate: '5.1%' },
            { platform: 'TikTok', posts: 12, reach: '213K', topTheme: 'Food Beauty Shot', engRate: '3.8%' },
            { platform: 'Facebook', posts: 18, reach: '22K', topTheme: 'Promotion', engRate: '2.1%' },
          ].map(p => (
            <Card key={p.platform}>
              <CardContent className="pt-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-zinc-900">{p.platform}</p>
                  <Badge variant={platformColors[p.platform] as any}>{p.posts} posts</Badge>
                </div>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between"><dt className="text-zinc-400">Reach</dt><dd className="font-medium text-zinc-800">{p.reach}</dd></div>
                  <div className="flex justify-between"><dt className="text-zinc-400">Top Theme</dt><dd className="font-medium text-zinc-800">{p.topTheme}</dd></div>
                  <div className="flex justify-between"><dt className="text-zinc-400">Eng. Rate</dt><dd className="font-medium text-zinc-800">{p.engRate}</dd></div>
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageShell>
    </>
  )
}
