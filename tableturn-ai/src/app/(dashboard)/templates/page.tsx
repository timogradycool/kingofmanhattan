'use client'

import { useState } from 'react'
import { FileText, Plus, Edit3, Trash2, Copy } from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { PageShell } from '@/components/layout/page-shell'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog'

const templates = [
  { id: '1', name: 'VIP Guest Welcome Back', category: 'Reactivation', subject: 'We\'ve missed you at Rosewood — a gift inside', preview: 'It\'s been a while, and we miss having you with us. As one of our most valued guests...', tone: 'Polished', updatedAt: '2 days ago' },
  { id: '2', name: 'Happy Hour Promo', category: 'Promotion', subject: 'Tonight only: Half-price cocktails at Rosewood 🍸', preview: 'Join us this Thursday from 5–7 PM for our signature happy hour...', tone: 'Playful', updatedAt: '5 days ago' },
  { id: '3', name: 'Birthday Celebration Offer', category: 'Birthday', subject: 'Happy Birthday! A gift from us, [First Name]', preview: 'Your birthday deserves to be celebrated properly. We\'d love to treat you...', tone: 'Warm', updatedAt: '1 week ago' },
  { id: '4', name: 'Private Event Follow-up', category: 'Events', subject: 'Thank you for your inquiry about private dining at Rosewood', preview: 'Thank you for considering Rosewood Kitchen for your special event. Our private dining team would love...', tone: 'Polished', updatedAt: '1 week ago' },
  { id: '5', name: 'Win-Back: 6-Month Lapsed', category: 'Reactivation', subject: 'It\'s been a while — come back for something special', preview: 'We noticed it\'s been a few months since your last visit, and we\'d love to welcome you back...', tone: 'Warm', updatedAt: '2 weeks ago' },
  { id: '6', name: 'Holiday Special Preview', category: 'Seasonal', subject: 'This holiday season at Rosewood — reserve now', preview: 'The holidays are approaching and we\'ve created something magical at Rosewood...', tone: 'Elegant', updatedAt: '3 weeks ago' },
]

const categoryColors: Record<string, string> = {
  Reactivation: 'default', Promotion: 'blue', Birthday: 'pink',
  Events: 'purple', Seasonal: 'orange', Holiday: 'warning',
}

export default function TemplatesPage() {
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<typeof templates[0] | null>(null)
  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState('Reactivation')
  const [tone, setTone] = useState('Polished')

  const openNew = () => {
    setEditingTemplate(null)
    setName(''); setSubject(''); setBody(''); setCategory('Reactivation'); setTone('Polished')
    setEditorOpen(true)
  }

  const openEdit = (t: typeof templates[0]) => {
    setEditingTemplate(t)
    setName(t.name); setSubject(t.subject); setBody(t.preview); setCategory(t.category); setTone(t.tone)
    setEditorOpen(true)
  }

  return (
    <>
      <Topbar
        title="Templates"
        description="Reusable email templates for campaigns"
        actions={<Button size="sm" onClick={openNew}><Plus className="h-3.5 w-3.5" /> New Template</Button>}
      />
      <PageShell>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map(t => (
            <Card key={t.id} className="hover:border-zinc-300 transition-colors">
              <CardContent className="pt-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
                    <FileText className="h-5 w-5 text-indigo-500" />
                  </div>
                  <Badge variant={categoryColors[t.category] as any}>{t.category}</Badge>
                </div>
                <h3 className="text-sm font-semibold text-zinc-900">{t.name}</h3>
                <p className="mt-1 text-xs text-zinc-500 line-clamp-2">{t.preview}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-zinc-400">
                  <span>Tone: {t.tone}</span>
                  <span>·</span>
                  <span>Updated {t.updatedAt}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(t)}>
                    <Edit3 className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button size="sm" variant="ghost"><Copy className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" variant="ghost"><Trash2 className="h-3.5 w-3.5 text-zinc-400" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add card */}
          <button onClick={openNew} className="rounded-xl border-2 border-dashed border-zinc-200 bg-white p-6 text-center hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors">
            <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100">
              <Plus className="h-5 w-5 text-zinc-400" />
            </div>
            <p className="text-sm font-medium text-zinc-500">New Template</p>
          </button>
        </div>

        {/* Editor dialog */}
        <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
          <DialogContent className="max-w-2xl" onClose={() => setEditorOpen(false)}>
            <DialogHeader>
              <DialogTitle>{editingTemplate ? 'Edit Template' : 'New Template'}</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Template Name</Label>
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Birthday Offer" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <Label>Category</Label>
                      <Select value={category} onChange={e => setCategory(e.target.value)}>
                        {['Reactivation', 'Promotion', 'Birthday', 'Events', 'Seasonal', 'Holiday', 'General'].map(c => <option key={c}>{c}</option>)}
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Tone</Label>
                      <Select value={tone} onChange={e => setTone(e.target.value)}>
                        {['Polished', 'Warm', 'Playful', 'Elegant', 'Edgy', 'Direct'].map(t => <option key={t}>{t}</option>)}
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Subject Line</Label>
                  <Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Email subject line" />
                </div>
                <div className="space-y-1.5">
                  <Label>Email Body</Label>
                  <Textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Write your email template here. Use [First Name] for personalization." rows={10} />
                  <p className="text-xs text-zinc-400">Personalization tokens: [First Name], [Last Name], [Location], [CTA Link]</p>
                </div>
              </div>
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditorOpen(false)}>Cancel</Button>
              <Button onClick={() => setEditorOpen(false)}>Save Template</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageShell>
    </>
  )
}
