// Decode JWT token to get payload
function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

// Token management utilities
export const authToken = {
  get(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token')
    }
    return null
  },

  set(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
      // Also set as cookie for middleware
      document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
    }
  },

  remove(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Remove cookies
      document.cookie = 'token=; path=/; max-age=0'
      document.cookie = 'user=; path=/; max-age=0'
    }
  },

  getRole(): string | null {
    const token = this.get()
    if (!token) return null

    const payload = decodeJWT(token)
    return payload?.role || null
  },
}

// User info management
export const userInfo = {
  get(): any | null {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    }
    return null
  },

  set(user: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user))
      // Also set as cookie for middleware
      document.cookie = `user=${encodeURIComponent(
        JSON.stringify(user)
      )}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
    }
  },
}

// Get auth headers for API requests
export function getAuthHeaders(): HeadersInit {
  const token = authToken.get()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return headers
}
