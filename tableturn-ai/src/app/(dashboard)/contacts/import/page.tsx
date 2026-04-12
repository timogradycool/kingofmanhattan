'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, FileText, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, X } from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { PageShell } from '@/components/layout/page-shell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Step = 'upload' | 'map' | 'preview' | 'done'

const CONTACT_FIELDS = [
  { value: 'firstName', label: 'First Name', required: true },
  { value: 'lastName', label: 'Last Name' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'company', label: 'Company' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'anniversary', label: 'Anniversary' },
  { value: 'lastVisitDate', label: 'Last Visit Date' },
  { value: 'notes', label: 'Notes' },
  { value: 'source', label: 'Source' },
  { value: 'ignore', label: '— Skip this column —' },
]

const mockPreview = [
  { 'Full Name': 'Sarah Mitchell', 'Email Address': 'sarah@example.com', 'Cell': '(212) 555-0101', 'Last Visit': '3/15/2025', 'Loyalty Points': '1200' },
  { 'Full Name': 'Marcus Johnson', 'Email Address': 'marcus@example.com', 'Cell': '(212) 555-0102', 'Last Visit': '2/28/2025', 'Loyalty Points': '340' },
  { 'Full Name': 'Jennifer Park', 'Email Address': 'jen.park@example.com', 'Cell': '(917) 555-0103', 'Last Visit': '1/10/2025', 'Loyalty Points': '2100' },
]

export default function ImportPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('upload')
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [tags, setTags] = useState('')
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({
    'Full Name': 'firstName',
    'Email Address': 'email',
    'Cell': 'phone',
    'Last Visit': 'lastVisitDate',
    'Loyalty Points': 'ignore',
  })

  const columns = Object.keys(mockPreview[0] ?? {})

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped?.name.endsWith('.csv')) {
      setFile(dropped)
      setStep('map')
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      setStep('map')
    }
  }

  const steps = [
    { id: 'upload', label: 'Upload File' },
    { id: 'map', label: 'Map Columns' },
    { id: 'preview', label: 'Preview' },
    { id: 'done', label: 'Import' },
  ]

  return (
    <>
      <Topbar title="Import Contacts" description="Upload a CSV file to import your guest list" />
      <PageShell>
        {/* Step indicator */}
        <div className="mb-8 flex items-center gap-0">
          {steps.map((s, i) => {
            const idx = steps.findIndex(x => x.id === step)
            const isActive = s.id === step
            const isDone = steps.findIndex(x => x.id === step) > i
            return (
              <div key={s.id} className="flex items-center">
                <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-indigo-600 text-white' : isDone ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-400'
                }`}>
                  {isDone ? <CheckCircle2 className="h-4 w-4" /> : <span className="w-4 text-center">{i + 1}</span>}
                  {s.label}
                </div>
                {i < steps.length - 1 && <div className={`mx-2 h-px w-8 ${isDone ? 'bg-emerald-300' : 'bg-zinc-200'}`} />}
              </div>
            )
          })}
        </div>

        {/* Step: Upload */}
        {step === 'upload' && (
          <div className="max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Upload your CSV file</CardTitle>
                <CardDescription>We support CSV files exported from most POS systems, reservation platforms, and spreadsheets.</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
                    isDragging ? 'border-indigo-400 bg-indigo-50' : 'border-zinc-300 hover:border-zinc-400'
                  }`}
                  onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-50">
                    <Upload className="h-7 w-7 text-indigo-500" />
                  </div>
                  <p className="text-sm font-semibold text-zinc-900">Drop your CSV here, or click to browse</p>
                  <p className="mt-1 text-xs text-zinc-400">Supports .csv files up to 50MB · Max 50,000 rows</p>
                  <label className="mt-4 cursor-pointer">
                    <input type="file" accept=".csv" className="sr-only" onChange={handleFileInput} />
                    <Button variant="outline" size="sm" className="pointer-events-none">Choose File</Button>
                  </label>
                </div>

                <div className="mt-6 rounded-lg bg-amber-50 border border-amber-200 p-4">
                  <div className="flex gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-amber-900">Compliance reminder</p>
                      <p className="mt-1 text-xs text-amber-700">Only import contacts who have given consent to receive marketing communications. Importing purchased lists or contacts without consent may violate CAN-SPAM, GDPR, and platform policies.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-semibold text-zinc-500 mb-2">Tips for your CSV:</p>
                  <ul className="text-xs text-zinc-500 space-y-1">
                    <li>• Include a header row with column names</li>
                    <li>• Email addresses should be in their own column</li>
                    <li>• Dates should be in MM/DD/YYYY or YYYY-MM-DD format</li>
                    <li>• We'll automatically deduplicate by email address</li>
                  </ul>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button onClick={() => setStep('map')} disabled={!file && true}>
                    Use sample data <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step: Map Columns */}
        {step === 'map' && (
          <div className="max-w-3xl">
            <Card>
              <CardHeader>
                <CardTitle>Map your columns</CardTitle>
                <CardDescription>Tell us which column in your file corresponds to each contact field.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {columns.map(col => (
                    <div key={col} className="flex items-center gap-4">
                      <div className="w-48 flex-shrink-0">
                        <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
                          <p className="text-xs text-zinc-400 font-medium">CSV Column</p>
                          <p className="text-sm font-medium text-zinc-900">{col}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                      <div className="flex-1">
                        <Select
                          value={columnMapping[col] || 'ignore'}
                          onChange={e => setColumnMapping(prev => ({ ...prev, [col]: e.target.value }))}
                        >
                          {CONTACT_FIELDS.map(f => (
                            <option key={f.value} value={f.value}>{f.label}{f.required ? ' *' : ''}</option>
                          ))}
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t border-zinc-100 pt-4">
                  <Label>Add tags to all imported contacts (optional)</Label>
                  <Input
                    className="mt-1.5"
                    placeholder="e.g. Import-April-2025, Loyalty-List"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                  />
                  <p className="mt-1 text-xs text-zinc-400">Separate multiple tags with commas</p>
                </div>

                <div className="mt-4 flex justify-between">
                  <Button variant="outline" onClick={() => setStep('upload')}>
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </Button>
                  <Button onClick={() => setStep('preview')}>
                    Preview Import <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step: Preview */}
        {step === 'preview' && (
          <div className="max-w-5xl">
            <Card>
              <CardHeader>
                <CardTitle>Preview Import</CardTitle>
                <CardDescription>Review the first few rows before importing. Verify names, emails, and field mapping look correct.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 grid grid-cols-3 gap-4">
                  <div className="rounded-lg bg-zinc-50 border border-zinc-200 p-3 text-center">
                    <p className="text-xs text-zinc-400">Total rows</p>
                    <p className="text-2xl font-bold text-zinc-900">247</p>
                  </div>
                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-center">
                    <p className="text-xs text-emerald-600">Valid emails</p>
                    <p className="text-2xl font-bold text-emerald-700">231</p>
                  </div>
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-center">
                    <p className="text-xs text-amber-600">Missing emails</p>
                    <p className="text-2xl font-bold text-amber-700">16</p>
                  </div>
                </div>

                <div className="rounded-lg border border-zinc-200 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-zinc-50 border-b border-zinc-200">
                        <th className="px-3 py-2 text-left text-xs text-zinc-500 font-semibold">First Name</th>
                        <th className="px-3 py-2 text-left text-xs text-zinc-500 font-semibold">Email</th>
                        <th className="px-3 py-2 text-left text-xs text-zinc-500 font-semibold">Phone</th>
                        <th className="px-3 py-2 text-left text-xs text-zinc-500 font-semibold">Last Visit</th>
                        <th className="px-3 py-2 text-left text-xs text-zinc-500 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockPreview.map((row, i) => (
                        <tr key={i} className="border-b border-zinc-100 hover:bg-zinc-50">
                          <td className="px-3 py-2 font-medium">{row['Full Name']}</td>
                          <td className="px-3 py-2 text-zinc-600">{row['Email Address']}</td>
                          <td className="px-3 py-2 text-zinc-600">{row['Cell']}</td>
                          <td className="px-3 py-2 text-zinc-600">{row['Last Visit']}</td>
                          <td className="px-3 py-2">
                            <Badge variant="success">Valid</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex justify-between">
                  <Button variant="outline" onClick={() => setStep('map')}>
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </Button>
                  <Button onClick={() => setStep('done')}>
                    Import 247 Contacts <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step: Done */}
        {step === 'done' && (
          <div className="max-w-lg">
            <Card>
              <CardContent className="pt-8 pb-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-zinc-900">Import Complete!</h2>
                <p className="mt-2 text-sm text-zinc-500">231 contacts were imported successfully. 16 rows were skipped due to missing email addresses.</p>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-emerald-50 p-3 text-center">
                    <p className="text-xs text-emerald-600 font-medium">Imported</p>
                    <p className="text-xl font-bold text-emerald-700">231</p>
                  </div>
                  <div className="rounded-lg bg-amber-50 p-3 text-center">
                    <p className="text-xs text-amber-600 font-medium">Skipped</p>
                    <p className="text-xl font-bold text-amber-700">16</p>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-3 text-center">
                    <p className="text-xs text-blue-600 font-medium">Duplicates</p>
                    <p className="text-xl font-bold text-blue-700">0</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-2">
                  <Button onClick={() => router.push('/contacts')}>View Contacts</Button>
                  <Button variant="outline" onClick={() => router.push('/campaigns/new')}>Create Campaign for these Contacts</Button>
                  <Button variant="ghost" onClick={() => setStep('upload')}>Import Another File</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </PageShell>
    </>
  )
}
