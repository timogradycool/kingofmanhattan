'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Utensils, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Invalid email or password')
        return
      }
      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-lg">
            <Utensils className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-zinc-900">
            TableTurn<span className="text-indigo-600"> AI</span>
          </h1>
          <p className="mt-1 text-sm text-zinc-500">Restaurant Growth Platform</p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold text-zinc-900">Sign in</h2>
          <p className="mb-6 text-sm text-zinc-500">Enter your credentials to access your dashboard.</p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@restaurant.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button type="button" className="text-xs text-indigo-600 hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 rounded-lg bg-zinc-50 border border-zinc-200 p-3">
            <p className="text-xs font-semibold text-zinc-600 mb-2">Demo credentials</p>
            <p className="text-xs text-zinc-500">Admin: <span className="font-mono text-zinc-700">admin@rosewood.com</span></p>
            <p className="text-xs text-zinc-500">Password: <span className="font-mono text-zinc-700">admin123</span></p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-400">
          © {new Date().getFullYear()} TableTurn AI. All rights reserved.
        </p>
      </div>
    </div>
  )
}
