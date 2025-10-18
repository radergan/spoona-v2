'use client'

import Link from 'next/link'
import { MainNavigation } from '@/components/MainNavigation'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Spoona</h1>
          <p className="text-gray-600">Manage your recipes, plan meals, and create shopping lists all in one place.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">My Recipes</h3>
                <p className="text-sm text-gray-600">Manage and organize your recipe collection</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link href="/recipes" className="text-orange-600 hover:text-orange-700 font-medium">
                  View Recipes →
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Meal Planning</h3>
                <p className="text-sm text-gray-600">Plan your weekly meals and generate shopping lists</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link href="/meal-planning" className="text-orange-600 hover:text-orange-700 font-medium">
                  Plan Meals →
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Shopping Lists</h3>
                <p className="text-sm text-gray-600">Create and manage your shopping lists</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link href="/shopping" className="text-orange-600 hover:text-orange-700 font-medium">
                  View Lists →
                </Link>
              </div>
            </div>          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-4">📅</div>
              <h3 className="text-lg font-semibold">Meal Planning</h3>
            </div>
            <p className="text-gray-600 mb-4">Plan your weekly meals with drag-and-drop</p>
            <a href="/meal-planning" className="text-orange-600 hover:text-orange-700 font-medium">
              Plan Meals →
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-4">🛒</div>
              <h3 className="text-lg font-semibold">Shopping Lists</h3>
            </div>
            <p className="text-gray-600 mb-4">Generate smart shopping lists from your meal plans</p>
            <a href="/shopping" className="text-orange-600 hover:text-orange-700 font-medium">
              View Lists →
            </a>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-4">📝</div>
              <p>No recent activity yet. Start by adding some recipes!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}