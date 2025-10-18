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
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
            Spoona
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 text-sm">
              {session?.user?.name || session?.user?.email}
            </span>
            <button className="text-gray-600 hover:text-orange-600 transition-colors">
              <span>👤</span>
            </button>
            <button 
              onClick={handleSignOut}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-gray-600 hover:text-orange-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}