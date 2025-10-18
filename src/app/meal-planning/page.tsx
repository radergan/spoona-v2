'use client'

import { MainNavigation } from '@/components/MainNavigation'

export default function MealPlanningPage() {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner']

  // Sample meal plan data
  const sampleMeals = {
    'Monday-Breakfast': { name: 'Oatmeal with Berries', emoji: '🥣' },
    'Monday-Dinner': { name: 'Chicken Parmesan', emoji: '🍗' },
    'Tuesday-Lunch': { name: 'Caesar Salad', emoji: '🥗' },
    'Wednesday-Dinner': { name: 'Beef Stir Fry', emoji: '🥘' },
    'Friday-Breakfast': { name: 'Pancakes', emoji: '🥞' },
    'Sunday-Dinner': { name: 'Roast Chicken', emoji: '🍖' }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Meal Planning</h1>
            <p className="text-gray-600">Plan your weekly meals and generate shopping lists</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
              📋 Generate Shopping List
            </button>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              🔄 New Week
            </button>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
              <span>←</span>
            </button>
            <h2 className="text-lg font-semibold">Week of October 14 - October 20, 2025</h2>
            <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Meal Planning Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-8 bg-gray-50 border-b border-gray-200">
            <div className="p-4 font-medium text-gray-700">Meal</div>
            {daysOfWeek.map((day) => (
              <div key={day} className="p-4 font-medium text-gray-700 text-center border-l border-gray-200">
                {day}
              </div>
            ))}
          </div>

          {/* Meal Rows */}
          {mealTypes.map((mealType) => (
            <div key={mealType} className="grid grid-cols-8 border-b border-gray-200 last:border-b-0">
              <div className="p-4 bg-gray-50 font-medium text-gray-700 flex items-center border-r border-gray-200">
                {mealType}
              </div>
              {daysOfWeek.map((day) => {
                const mealKey = `${day}-${mealType}`
                const meal = sampleMeals[mealKey as keyof typeof sampleMeals]
                
                return (
                  <div key={`${day}-${mealType}`} className="p-4 border-l border-gray-200 min-h-[100px] hover:bg-gray-50 transition-colors">
                    {meal ? (
                      <div className="bg-orange-100 border border-orange-200 rounded-lg p-3 cursor-pointer hover:bg-orange-200 transition-colors">
                        <div className="text-lg mb-1">{meal.emoji}</div>
                        <div className="text-sm font-medium text-gray-800">{meal.name}</div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition-colors h-full flex items-center justify-center">
                        <span className="text-gray-400 text-sm">+ Add meal</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Quick Add Section */}
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Add Recipe</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Search recipes..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <div className="flex gap-2">
                <select className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                  <option>Select Day</option>
                  {daysOfWeek.map(day => <option key={day}>{day}</option>)}
                </select>
                <select className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                  <option>Select Meal</option>
                  {mealTypes.map(meal => <option key={meal}>{meal}</option>)}
                </select>
              </div>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md font-medium transition-colors">
                Add to Plan
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">This Week&apos;s Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Planned Meals:</span>
                <span className="font-medium">6 of 21</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Cost:</span>
                <span className="font-medium">$124.50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shopping Items:</span>
                <span className="font-medium">23 items</span>
              </div>
              <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md font-medium transition-colors mt-4">
                🛒 Create Shopping List
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}