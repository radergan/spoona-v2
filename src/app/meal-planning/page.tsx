'use client'

import { useState } from 'react'
import { MainNavigation } from '@/components/MainNavigation'
import { MealBuilder } from '@/components/MealBuilder'
import { ProductMealBuilder } from '@/components/ProductMealBuilder'
import { RecipeSelectionModal } from '@/components/RecipeSelectionModal'
import { SavedMealsModal } from '@/components/SavedMealsModal'

type ModalType = null | 'recipe' | 'savedMeal' | 'mealBuilder' | 'productMeal'

interface MealPlanItem {
  type: 'recipe' | 'savedMeal' | 'productMeal'
  name: string
  emoji: string
  estimatedPrice?: number
}

export default function MealPlanningPage() {
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [selectedCell, setSelectedCell] = useState<{ day: string; mealType: string } | null>(null)
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner']

  // Sample meal plan data
  const [mealPlan, setMealPlan] = useState<Record<string, MealPlanItem>>({
    'Monday-Breakfast': { type: 'recipe', name: 'Oatmeal with Berries', emoji: '🥣' },
    'Monday-Dinner': { type: 'recipe', name: 'Chicken Parmesan', emoji: '🍗' },
    'Tuesday-Lunch': { type: 'savedMeal', name: 'Caesar Salad', emoji: '🥗' },
    'Wednesday-Dinner': { type: 'recipe', name: 'Beef Stir Fry', emoji: '🥘' },
    'Friday-Breakfast': { type: 'recipe', name: 'Pancakes', emoji: '🥞' },
    'Sunday-Dinner': { type: 'recipe', name: 'Roast Chicken', emoji: '🍖' }
  })

  const handleCellClick = (day: string, mealType: string) => {
    setSelectedCell({ day, mealType })
    // Show meal selection options
  }

  const handleAddMeal = (type: 'recipe' | 'savedMeal' | 'mealBuilder' | 'productMeal') => {
    setActiveModal(type)
  }

  const handleRecipeSelect = (recipe: any) => {
    if (selectedCell) {
      const key = `${selectedCell.day}-${selectedCell.mealType}`
      setMealPlan(prev => ({
        ...prev,
        [key]: { type: 'recipe', name: recipe.title, emoji: '🍽️' }
      }))
    }
    setActiveModal(null)
    setSelectedCell(null)
  }

  const handleSavedMealSelect = (meal: any) => {
    if (selectedCell) {
      const key = `${selectedCell.day}-${selectedCell.mealType}`
      setMealPlan(prev => ({
        ...prev,
        [key]: { type: 'savedMeal', name: meal.name, emoji: '🥗' }
      }))
    }
    setActiveModal(null)
    setSelectedCell(null)
  }

  const handleMealBuilderSave = (meal: any) => {
    if (selectedCell) {
      const key = `${selectedCell.day}-${selectedCell.mealType}`
      setMealPlan(prev => ({
        ...prev,
        [key]: { type: 'savedMeal', name: meal.name, emoji: '🍽️' }
      }))
    }
    setActiveModal(null)
    setSelectedCell(null)
  }

  const handleProductMealSave = (meal: any) => {
    if (selectedCell) {
      const key = `${selectedCell.day}-${selectedCell.mealType}`
      setMealPlan(prev => ({
        ...prev,
        [key]: { 
          type: 'productMeal', 
          name: meal.name, 
          emoji: '🛒',
          estimatedPrice: meal.estimatedTotal
        }
      }))
    }
    setActiveModal(null)
    setSelectedCell(null)
  }

  const handleRemoveMeal = (day: string, mealType: string) => {
    const key = `${day}-${mealType}`
    setMealPlan(prev => {
      const newPlan = { ...prev }
      delete newPlan[key]
      return newPlan
    })
  }

  const generateShoppingList = async () => {
    try {
      // Filter only product-based meals from the meal plan
      const productMeals = Object.entries(mealPlan)
        .filter(([_, meal]) => meal.type === 'productMeal')
        .map(([key, meal]) => ({
          id: key,
          name: meal.name,
          type: 'product-based' as const,
          items: [] // This would come from saved meal data in a real implementation
        }))

      if (productMeals.length === 0) {
        alert('No product-based meals found. Add some meals with products to generate a shopping list.')
        return
      }

      const response = await fetch('/api/shopping/create-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mealPlanItems: productMeals,
          weekStart: new Date().toISOString()
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create shopping list')
      }

      const data = await response.json()
      
      if (data.success && data.shoppingListUrl) {
        // Open Instacart shopping list in new tab
        window.open(data.shoppingListUrl, '_blank')
      } else {
        throw new Error(data.error || 'Failed to create shopping list')
      }
    } catch (error) {
      console.error('Shopping list generation error:', error)
      alert('Failed to generate shopping list. Please try again.')
    }
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
            <button 
              onClick={generateShoppingList}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
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
                const meal = mealPlan[mealKey]
                
                return (
                  <div key={`${day}-${mealType}`} className="p-4 border-l border-gray-200 min-h-[100px] hover:bg-gray-50 transition-colors">
                    {meal ? (
                      <div className="bg-orange-100 border border-orange-200 rounded-lg p-3 cursor-pointer hover:bg-orange-200 transition-colors group relative">
                        <div className="text-lg mb-1">{meal.emoji}</div>
                        <div className="text-sm font-medium text-gray-800">{meal.name}</div>
                        <div className="text-xs text-orange-600 mt-1">
                          {meal.type === 'recipe' ? '📖 Recipe' : '🥗 Custom'}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveMeal(day, mealType)
                          }}
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-all"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => handleCellClick(day, mealType)}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition-colors h-full flex items-center justify-center"
                      >
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

        {/* Meal Selection Popup */}
        {selectedCell && !activeModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4"
            onClick={() => setSelectedCell(null)}
          >
            <div 
              className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Add meal for {selectedCell.day} {selectedCell.mealType}
                </h3>
                <button
                  onClick={() => setSelectedCell(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => handleAddMeal('recipe')}
                  className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📖</span>
                    <div>
                      <div className="font-medium">From Recipe</div>
                      <div className="text-sm text-gray-600">Choose from your recipe collection</div>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleAddMeal('savedMeal')}
                  className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🥗</span>
                    <div>
                      <div className="font-medium">Saved Meal</div>
                      <div className="text-sm text-gray-600">Choose from your custom meals</div>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleAddMeal('productMeal')}
                  className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🛒</span>
                    <div>
                      <div className="font-medium">Product-Based Meal</div>
                      <div className="text-sm text-gray-600">Mac & cheese, nuggets, etc.</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleAddMeal('mealBuilder')}
                  className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🔍</span>
                    <div>
                      <div className="font-medium">Search Products</div>
                      <div className="text-sm text-gray-600">Search Instacart catalog</div>
                    </div>
                  </div>
                </button>
              </div>
              
              <button
                onClick={() => setSelectedCell(null)}
                className="mt-4 w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Modals */}
        <RecipeSelectionModal
          isOpen={activeModal === 'recipe'}
          onClose={() => {
            setActiveModal(null)
            setSelectedCell(null)
          }}
          onSelectRecipe={handleRecipeSelect}
        />

        <SavedMealsModal
          isOpen={activeModal === 'savedMeal'}
          onClose={() => {
            setActiveModal(null)
            setSelectedCell(null)
          }}
          onSelectMeal={handleSavedMealSelect}
        />

        {activeModal === 'productMeal' && (
          <ProductMealBuilder
            onSave={handleProductMealSave}
            onCancel={() => {
              setActiveModal(null)
              setSelectedCell(null)
            }}
          />
        )}

        {activeModal === 'mealBuilder' && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setActiveModal(null)
              setSelectedCell(null)
            }}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <MealBuilder
                onSave={handleMealBuilderSave}
                onCancel={() => {
                  setActiveModal(null)
                  setSelectedCell(null)
                }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}