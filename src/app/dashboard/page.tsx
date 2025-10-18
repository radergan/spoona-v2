'use client'

import Link from 'next/link'
import { MainNavigation } from '@/components/MainNavigation'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gh-canvas-inset">
      <MainNavigation />
      
      <main className="container mx-auto px-gh-6 py-gh-6">
        <div className="mb-gh-6">
          <h1 className="text-2xl font-semibold text-gh-fg-default mb-gh-2">Welcome to Spoona</h1>
          <p className="text-gh-fg-muted">Manage your recipes, plan meals, and create shopping lists all in one place.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-gh-4 mb-gh-6">
          <div className="bg-gh-canvas-default border border-gh-border-default rounded-gh-md hover:shadow-gh-md transition-all group">
            <div className="p-gh-4">
              <div className="flex items-center mb-gh-3">
                <div className="w-8 h-8 bg-gh-accent-subtle rounded-gh-sm flex items-center justify-center mr-gh-3">
                  <svg className="w-4 h-4 text-gh-accent-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gh-fg-default group-hover:text-gh-accent-fg transition-colors">My Recipes</h3>
              </div>
              <p className="text-sm text-gh-fg-muted mb-gh-4">Manage and organize your recipe collection</p>
              <Link href="/recipes" className="text-gh-accent-fg hover:text-gh-accent-emphasis font-medium text-sm group-hover:underline">
                View Recipes →
              </Link>
            </div>
          </div>

          <div className="bg-gh-canvas-default border border-gh-border-default rounded-gh-md hover:shadow-gh-md transition-all group">
            <div className="p-gh-4">
              <div className="flex items-center mb-gh-3">
                <div className="w-8 h-8 bg-gh-success-subtle rounded-gh-sm flex items-center justify-center mr-gh-3">
                  <svg className="w-4 h-4 text-gh-success-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gh-fg-default group-hover:text-gh-success-fg transition-colors">Meal Planning</h3>
              </div>
              <p className="text-sm text-gh-fg-muted mb-gh-4">Plan your weekly meals and generate shopping lists</p>
              <Link href="/meal-planning" className="text-gh-success-fg hover:text-gh-success-emphasis font-medium text-sm group-hover:underline">
                Plan Meals →
              </Link>
            </div>
          </div>

          <div className="bg-gh-canvas-default border border-gh-border-default rounded-gh-md hover:shadow-gh-md transition-all group">
            <div className="p-gh-4">
              <div className="flex items-center mb-gh-3">
                <div className="w-8 h-8 bg-gh-severe-subtle rounded-gh-sm flex items-center justify-center mr-gh-3">
                  <svg className="w-4 h-4 text-gh-severe-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gh-fg-default group-hover:text-gh-severe-fg transition-colors">Shopping Lists</h3>
              </div>
              <p className="text-sm text-gh-fg-muted mb-gh-4">Create and manage your shopping lists</p>
              <Link href="/shopping" className="text-gh-severe-fg hover:text-gh-severe-emphasis font-medium text-sm group-hover:underline">
                View Lists →
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gh-canvas-default border border-gh-border-default rounded-gh-md">
          <div className="p-gh-4 border-b border-gh-border-muted">
            <h2 className="text-lg font-semibold text-gh-fg-default">Recent Activity</h2>
          </div>
          <div className="p-gh-6">
            <div className="text-center text-gh-fg-muted py-gh-6">
              <div className="w-12 h-12 bg-gh-neutral-muted rounded-gh-md flex items-center justify-center mx-auto mb-gh-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-sm">No recent activity yet. Start by adding some recipes!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}