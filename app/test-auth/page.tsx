'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { authToken, userInfo } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function TestAuthPage() {
  const router = useRouter()
  const [tokenData, setTokenData] = useState<any>(null)
  const [userInfoData, setUserInfoData] = useState<any>(null)
  const [role, setRole] = useState<string | null>(null)
  const [decodedToken, setDecodedToken] = useState<any>(null)

  useEffect(() => {
    const token = authToken.get()
    const user = userInfo.get()
    const userRole = authToken.getRole()

    setTokenData(token)
    setUserInfoData(user)
    setRole(userRole)

    // Decode token manually
    if (token) {
      try {
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        )
        const payload = JSON.parse(jsonPayload)
        setDecodedToken(payload)
      } catch (error) {
        console.error('Error decoding token:', error)
      }
    }
  }, [])

  const handleLogout = () => {
    authToken.remove()
    router.push('/login')
  }

  const handleGoToAdmin = () => {
    router.push('/admin')
  }

  const handleGoToDashboard = () => {
    router.push('/dashboard')
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Test Authentication & Role</h1>
        <div className="space-x-2">
          <Button onClick={handleGoToAdmin}>Go to Admin</Button>
          <Button onClick={handleGoToDashboard} variant="secondary">
            Go to Dashboard
          </Button>
          <Button onClick={handleLogout} variant="destructive">
            Logout
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Token Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <strong>Token exists:</strong>{' '}
              <Badge variant={tokenData ? 'default' : 'destructive'}>
                {tokenData ? 'Yes' : 'No'}
              </Badge>
            </div>
            {tokenData && (
              <div className="mt-4 space-y-2">
                <div>
                  <strong>Token (first 50 chars):</strong>
                  <pre className="bg-muted p-2 rounded text-xs mt-2 overflow-auto">
                    {tokenData.substring(0, 50)}...
                  </pre>
                </div>
                <div>
                  <strong>Token length:</strong> {tokenData.length} chars
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Decoded JWT Payload</CardTitle>
        </CardHeader>
        <CardContent>
          {decodedToken ? (
            <div className="space-y-4">
              <div>
                <strong>Role from JWT:</strong>{' '}
                <Badge variant="default" className="ml-2">
                  {decodedToken.role || 'Not found'}
                </Badge>
              </div>
              <div>
                <strong>User ID (nameid):</strong> {decodedToken.nameid}
              </div>
              <div>
                <strong>Email:</strong> {decodedToken.email}
              </div>
              <div>
                <strong>Unique Name:</strong> {decodedToken.unique_name}
              </div>
              <div>
                <strong>Issued At:</strong>{' '}
                {new Date(decodedToken.iat * 1000).toLocaleString()}
              </div>
              <div>
                <strong>Expires At:</strong>{' '}
                {new Date(decodedToken.exp * 1000).toLocaleString()}
              </div>
              <div className="mt-4">
                <strong>Full JWT Payload:</strong>
                <pre className="bg-muted p-4 rounded overflow-auto text-xs mt-2">
                  {JSON.stringify(decodedToken, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No token to decode</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Info (localStorage)</CardTitle>
        </CardHeader>
        <CardContent>
          {userInfoData ? (
            <pre className="bg-muted p-4 rounded overflow-auto">
              {JSON.stringify(userInfoData, null, 2)}
            </pre>
          ) : (
            <p className="text-muted-foreground">No user info found</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Detection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <strong>Detected Role:</strong>{' '}
              <Badge variant={role ? 'default' : 'outline'}>
                {role || 'Not found'}
              </Badge>
            </div>
            <div className="mt-4">
              <strong>Lowercase:</strong> {role?.toLowerCase() || 'N/A'}
            </div>
            <div>
              <strong>Is Manager:</strong>{' '}
              <Badge
                variant={
                  role?.toLowerCase() === 'manager' ? 'default' : 'outline'
                }
              >
                {role?.toLowerCase() === 'manager' ? 'Yes ✓' : 'No ✗'}
              </Badge>
            </div>
            <div>
              <strong>Is Admin:</strong>{' '}
              <Badge
                variant={
                  role?.toLowerCase() === 'admin' ? 'default' : 'outline'
                }
              >
                {role?.toLowerCase() === 'admin' ? 'Yes ✓' : 'No ✗'}
              </Badge>
            </div>
            <div>
              <strong>Is Staff:</strong>{' '}
              <Badge
                variant={
                  role?.toLowerCase() === 'staff' ? 'default' : 'outline'
                }
              >
                {role?.toLowerCase() === 'staff' ? 'Yes ✓' : 'No ✗'}
              </Badge>
            </div>
            <div>
              <strong>Is Customer:</strong>{' '}
              <Badge
                variant={
                  role?.toLowerCase() === 'customer' ? 'default' : 'outline'
                }
              >
                {role?.toLowerCase() === 'customer' ? 'Yes ✓' : 'No ✗'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cookies</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded overflow-auto text-xs">
            {typeof document !== 'undefined'
              ? document.cookie || 'No cookies found'
              : 'Server-side render'}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expected Redirect</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {role?.toLowerCase() === 'manager' ||
            role?.toLowerCase() === 'admin' ? (
              <Badge variant="default" className="text-lg p-3">
                Should redirect to: /admin
              </Badge>
            ) : role?.toLowerCase() === 'staff' ? (
              <Badge variant="secondary" className="text-lg p-3">
                Should redirect to: /staff
              </Badge>
            ) : (
              <Badge variant="outline" className="text-lg p-3">
                Should redirect to: /dashboard
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
