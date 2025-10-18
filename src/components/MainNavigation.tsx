'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

export function MainNavigation() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/recipes', label: 'Recipes' },
    { href: '/meal-planning', label: 'Meal Planning' },
    { href: '/shopping', label: 'Shopping' },
  ]

  return (
    <nav className="bg-gh-canvas-default border-b border-gh-border-default shadow-gh-sm">
      <div className="container mx-auto px-gh-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="text-xl font-semibold text-gh-fg-default hover:text-gh-accent-fg transition-colors">
            Spoona
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-gh-3 py-1.5 rounded-gh-sm text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gh-accent-subtle text-gh-accent-fg border border-gh-accent-muted'
                      : 'text-gh-fg-muted hover:text-gh-fg-default hover:bg-gh-neutral-muted'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-gh-3">
            <span className="text-gh-fg-muted text-sm hidden sm:block">
              {session?.user?.name || session?.user?.email}
            </span>
            <button className="p-gh-2 text-gh-fg-muted hover:text-gh-fg-default hover:bg-gh-neutral-muted rounded-gh-sm transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            <button 
              onClick={handleSignOut}
              className="bg-gh-accent-emphasis hover:bg-gh-accent-fg text-gh-fg-onEmphasis px-gh-3 py-1.5 rounded-gh-sm text-sm font-medium transition-colors shadow-gh-sm"
            >
              Sign Out
            </button>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-gh-2 text-gh-fg-muted hover:text-gh-fg-default hover:bg-gh-neutral-muted rounded-gh-sm transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}