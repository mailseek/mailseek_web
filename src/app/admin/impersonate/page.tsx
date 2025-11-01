'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert } from '@/components/ui/alert'

export default function AdminImpersonatePage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [impersonateData, setImpersonateData] = useState<any>(null)

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  if (!backendUrl) {
    throw new Error('No backend URL')
  }

  const createBasicAuth = (user: string, pass: string): string => {
    const credentials = `${user}:${pass}`
    return `Basic ${btoa(credentials)}`
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setImpersonateData(null)
    setLoading(true)

    if (!backendUrl) {
      setError('Backend URL is not configured')
      setLoading(false)
      return
    }

    try {
      const authHeader = createBasicAuth(username, password)

      // Step 1: Validate admin credentials directly with backend
      const authResponse = await fetch(`${backendUrl}/api/admin/auth`, {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
      })

      if (!authResponse.ok) {
        setError('Invalid admin credentials')
        setLoading(false)
        return
      }

      // Step 2: Get impersonate email from Next.js API
      const emailResponse = await fetch('/api/admin/impersonate-email')
      if (!emailResponse.ok) {
        setError('Failed to get impersonate email')
        setLoading(false)
        return
      }
      const { email } = await emailResponse.json()

      // Step 3: Call backend impersonate endpoint with the email
      const impersonateResponse = await fetch(`${backendUrl}/api/admin/impersonate`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      })

      if (!impersonateResponse.ok) {
        const errorData = await impersonateResponse.json().catch(() => ({ error: 'Failed to impersonate user' }))
        setError(errorData.error || 'Failed to impersonate user')
        setLoading(false)
        return
      }

      const data = await impersonateResponse.json()
      setImpersonateData(data)
      setSuccess('Successfully impersonated user!')
    } catch (err) {
      console.error('Error:', err)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Impersonate</CardTitle>
          <CardDescription>
            Enter your admin credentials to impersonate a user
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                placeholder="Admin username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="Admin password"
              />
            </div>
            {error && (
              <Alert className="bg-destructive/10 text-destructive border-destructive/20">
                {error}
              </Alert>
            )}
            {success && (
              <Alert className="bg-green-500/10 text-green-600 border-green-500/20">
                {success}
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processing...' : 'Impersonate User'}
            </Button>
          </form>
          {impersonateData && (
            <div className="mt-6 p-4 bg-muted rounded-md">
              <h3 className="font-semibold mb-2">Impersonation Data:</h3>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(impersonateData, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
