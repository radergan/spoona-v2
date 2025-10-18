'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (isLogin) {
        // Login
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        if (result?.error) {
          setError('Invalid email or password')
        } else {
          router.push('/dashboard')
        }
      } else {
        // Register
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match')
          return
        }

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name,
          }),
        })

        if (response.ok) {
          // Auto-login after successful registration
          const result = await signIn('credentials', {
            email: formData.email,
            password: formData.password,
            redirect: false,
          })

          if (!result?.error) {
            router.push('/dashboard')
          }
        } else {
          const data = await response.json()
          setError(data.error || 'Registration failed')
        }
      }
    } catch (error) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <main className="min-h-screen bg-gh-canvas-inset flex items-center justify-center px-gh-4">
      <div className="bg-gh-canvas-default border border-gh-border-default p-gh-6 rounded-gh-md shadow-gh-lg w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-gh-6">
          <Link href="/" className="text-2xl font-semibold text-gh-fg-default hover:text-gh-accent-fg transition-colors">
            Spoona
          </Link>
          <h2 className="mt-gh-4 text-xl font-semibold text-gh-fg-default">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gh-fg-muted mt-gh-2 text-sm">
            {isLogin ? 'Sign in to your account' : 'Join Spoona today'}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-gh-4 p-gh-3 bg-gh-danger-subtle border border-gh-danger-muted text-gh-danger-fg rounded-gh-sm text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-gh-4">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gh-fg-default mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-gh-3 py-2 text-sm border border-gh-border-default rounded-gh-sm focus:outline-none focus:border-gh-accent-emphasis bg-gh-canvas-default transition-colors"
                placeholder="Enter your full name"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gh-fg-default mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-gh-3 py-2 text-sm border border-gh-border-default rounded-gh-sm focus:outline-none focus:border-gh-accent-emphasis bg-gh-canvas-default transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gh-fg-default mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-gh-3 py-2 text-sm border border-gh-border-default rounded-gh-sm focus:outline-none focus:border-gh-accent-emphasis bg-gh-canvas-default transition-colors"
              placeholder="Enter your password"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gh-fg-default mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-gh-3 py-2 text-sm border border-gh-border-default rounded-gh-sm focus:outline-none focus:border-gh-accent-emphasis bg-gh-canvas-default transition-colors"
                placeholder="Confirm your password"
                required={!isLogin}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gh-accent-emphasis hover:bg-gh-accent-fg disabled:opacity-50 disabled:cursor-not-allowed text-gh-fg-onEmphasis py-2 px-gh-4 rounded-gh-sm font-medium transition-colors shadow-gh-sm"
          >
            {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        {/* Toggle between login/register */}
        <div className="mt-gh-6 text-center">
          <p className="text-gh-fg-muted text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-gh-accent-fg hover:text-gh-accent-emphasis font-medium"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {/* Social Login Options */}
        <div className="mt-gh-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gh-border-muted" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-gh-2 bg-gh-canvas-default text-gh-fg-muted">Or continue with</span>
            </div>
          </div>

          <div className="mt-gh-4 grid grid-cols-2 gap-gh-3">
            <button className="w-full inline-flex justify-center py-2 px-gh-3 border border-gh-border-default rounded-gh-sm shadow-gh-sm bg-gh-canvas-default text-sm font-medium text-gh-fg-muted hover:bg-gh-canvas-subtle transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="ml-2">Google</span>
            </button>

            <button className="w-full inline-flex justify-center py-2 px-gh-3 border border-gh-border-default rounded-gh-sm shadow-gh-sm bg-gh-canvas-default text-sm font-medium text-gh-fg-muted hover:bg-gh-canvas-subtle transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="ml-2">Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}