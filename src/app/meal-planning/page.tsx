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
  estimatedPrice?: number
}

export default function MealPlanningPage() {
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [selectedCell, setSelectedCell] = useState<{ day: string; mealType: string } | null>(null)
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner']

  // Sample meal plan data
  const [mealPlan, setMealPlan] = useState<Record<string, MealPlanItem>>({
    'Monday-Breakfast': { type: 'recipe', name: 'Oatmeal with Berries' },
    'Monday-Dinner': { type: 'recipe', name: 'Chicken Parmesan' },
    'Tuesday-Lunch': { type: 'savedMeal', name: 'Caesar Salad' },
    'Wednesday-Dinner': { type: 'recipe', name: 'Beef Stir Fry' },
    'Friday-Breakfast': { type: 'recipe', name: 'Pancakes' },
    'Sunday-Dinner': { type: 'recipe', name: 'Roast Chicken' }
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
        [key]: { type: 'recipe', name: recipe.title }
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
        [key]: { type: 'savedMeal', name: meal.name }
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
        [key]: { type: 'savedMeal', name: meal.name }
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
    <div className="min-h-screen bg-gh-canvas-default">
      <MainNavigation />
      
      <main className="container mx-auto px-gh-6 py-gh-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-gh-6">
          <div>
            <h1 className="text-2xl font-semibold text-gh-fg-default mb-gh-2">Meal Planning</h1>
            <p className="text-gh-fg-muted text-sm">Plan your weekly meals and generate shopping lists</p>
          </div>
          <div className="flex gap-gh-2">
            <button 
              onClick={generateShoppingList}
              className="bg-gh-canvas-default border border-gh-border-default hover:bg-gh-canvas-subtle text-gh-fg-default px-gh-3 py-1.5 rounded-gh-md text-sm font-medium transition-colors shadow-gh-sm hover:shadow-gh-md"
            >
              Generate Shopping List
            </button>
            <button className="bg-gh-accent-emphasis hover:bg-gh-accent-fg text-gh-fg-onEmphasis px-gh-4 py-1.5 rounded-gh-md text-sm font-medium transition-colors shadow-gh-sm">
              New Week
            </button>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="bg-gh-canvas-default border border-gh-border-default rounded-gh-md p-gh-4 mb-gh-6 shadow-gh-sm">
          <div className="flex items-center justify-between">
            <button className="p-gh-2 hover:bg-gh-neutral-muted rounded-gh-sm transition-colors text-gh-fg-muted hover:text-gh-fg-default">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-base font-medium text-gh-fg-default">Week of October 14 - October 20, 2025</h2>
            <button className="p-gh-2 hover:bg-gh-neutral-muted rounded-gh-sm transition-colors text-gh-fg-muted hover:text-gh-fg-default">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Meal Planning Grid */}
        <div className="bg-gh-canvas-default border border-gh-border-default rounded-gh-md overflow-hidden shadow-gh-sm">
          {/* Header Row */}
          <div className="grid grid-cols-8 bg-gh-canvas-inset border-b border-gh-border-muted">
            <div className="p-gh-3 text-sm font-medium text-gh-fg-muted">Meal</div>
            {daysOfWeek.map((day) => (
              <div key={day} className="p-gh-3 text-sm font-medium text-gh-fg-muted text-center border-l border-gh-border-muted">
                {day.slice(0, 3)}
              </div>
            ))}
          </div>

          {/* Meal Rows */}
          {mealTypes.map((mealType) => (
            <div key={mealType} className="grid grid-cols-8 border-b border-gh-border-muted last:border-b-0">
              <div className="p-gh-3 bg-gh-canvas-inset text-sm font-medium text-gh-fg-default flex items-center border-r border-gh-border-muted">
                {mealType}
              </div>
              {daysOfWeek.map((day) => {
                const mealKey = `${day}-${mealType}`
                const meal = mealPlan[mealKey]
                
                return (
                  <div key={`${day}-${mealType}`} className="p-gh-2 border-l border-gh-border-muted min-h-[80px] hover:bg-gh-canvas-subtle transition-colors">
                    {meal ? (
                      <div className="bg-gh-success-subtle border border-gh-success-muted rounded-gh-sm p-gh-2 cursor-pointer hover:bg-gh-success-muted/30 transition-colors group relative">
                        <div className="text-xs font-medium text-gh-fg-default mb-1 line-clamp-2">{meal.name}</div>
                        <div className="flex items-center gap-1">
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                            meal.type === 'recipe' ? 'bg-gh-accent-subtle text-gh-accent-fg' : 
                            meal.type === 'productMeal' ? 'bg-gh-severe-subtle text-gh-severe-fg' : 
                            'bg-gh-neutral-muted text-gh-fg-muted'
                          }`}>
                            {meal.type === 'recipe' ? 'Recipe' : 
                             meal.type === 'productMeal' ? 'Product' : 'Custom'}
                          </span>
                        </div>
                        {meal.estimatedPrice && (
                          <div className="text-xs text-gh-success-fg mt-1 font-medium">
                            ${meal.estimatedPrice.toFixed(2)}
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveMeal(day, mealType)
                          }}
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-gh-danger-emphasis hover:bg-gh-danger-fg text-gh-fg-onEmphasis rounded-full w-4 h-4 flex items-center justify-center text-xs transition-all"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => handleCellClick(day, mealType)}
                        className="border-2 border-dashed border-gh-border-default rounded-gh-sm p-gh-2 text-center cursor-pointer hover:border-gh-accent-muted hover:bg-gh-accent-subtle transition-colors h-full flex items-center justify-center"
                      >
                        <span className="text-gh-fg-muted text-xs">+ Add meal</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Quick Add and Summary Section */}
        <div className="mt-gh-6 grid lg:grid-cols-2 gap-gh-6">
          {/* Quick Add Section */}
          <div className="bg-gh-canvas-default border border-gh-border-default rounded-gh-md p-gh-4 shadow-gh-sm">
            <h3 className="text-base font-semibold text-gh-fg-default mb-gh-4">Quick Add Recipe</h3>
            <div className="space-y-gh-3">
              <input
                type="text"
                placeholder="Search recipes..."
                className="w-full px-gh-3 py-2 text-sm border border-gh-border-default rounded-gh-sm focus:outline-none focus:ring-0 focus:border-gh-accent-emphasis bg-gh-canvas-default transition-colors"
              />
              <div className="grid grid-cols-2 gap-gh-2">
                <select className="px-gh-3 py-2 text-sm border border-gh-border-default rounded-gh-sm focus:outline-none focus:border-gh-accent-emphasis bg-gh-canvas-default transition-colors">
                  <option>Select Day</option>
                  {daysOfWeek.map(day => <option key={day}>{day}</option>)}
                </select>
                <select className="px-gh-3 py-2 text-sm border border-gh-border-default rounded-gh-sm focus:outline-none focus:border-gh-accent-emphasis bg-gh-canvas-default transition-colors">
                  <option>Select Meal</option>
                  {mealTypes.map(meal => <option key={meal}>{meal}</option>)}
                </select>
              </div>
              <button className="w-full bg-gh-accent-emphasis hover:bg-gh-accent-fg text-gh-fg-onEmphasis py-2 px-gh-3 rounded-gh-sm text-sm font-medium transition-colors">
                Add to Plan
              </button>
            </div>
          </div>

          {/* Summary Section */}
          <div className="bg-gh-canvas-default border border-gh-border-default rounded-gh-md p-gh-4 shadow-gh-sm">
            <h3 className="text-base font-semibold text-gh-fg-default mb-gh-4">This Week&apos;s Summary</h3>
            <div className="space-y-gh-3">
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-gh-fg-muted">Planned Meals:</span>
                <span className="text-sm font-medium text-gh-fg-default">6 of 21</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-gh-fg-muted">Estimated Cost:</span>
                <span className="text-sm font-medium text-gh-success-fg">$124.50</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-gh-fg-muted">Shopping Items:</span>
                <span className="text-sm font-medium text-gh-fg-default">23 items</span>
              </div>
              <div className="border-t border-gh-border-muted pt-gh-3 mt-gh-4">
                <button className="w-full bg-gh-success-emphasis hover:bg-gh-success-fg text-gh-fg-onEmphasis py-2 px-gh-3 rounded-gh-sm text-sm font-medium transition-colors">
                  Create Shopping List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Meal Selection Modal */}
        {selectedCell && !activeModal && (
          <div 
            className="fixed inset-0 bg-gh-neutral-emphasis/50 flex items-center justify-center z-40 p-gh-4"
            onClick={() => setSelectedCell(null)}
          >
            <div 
              className="bg-gh-canvas-default border border-gh-border-default rounded-gh-md shadow-gh-lg max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-gh-4 border-b border-gh-border-muted">
                <h3 className="text-base font-semibold text-gh-fg-default">
                  Add meal for {selectedCell.day} {selectedCell.mealType}
                </h3>
                <button
                  onClick={() => setSelectedCell(null)}
                  className="text-gh-fg-muted hover:text-gh-fg-default p-1 rounded-gh-sm hover:bg-gh-neutral-muted transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-gh-4 space-y-gh-2">
                <button
                  onClick={() => handleAddMeal('recipe')}
                  className="w-full p-gh-3 text-left border border-gh-border-default rounded-gh-sm hover:border-gh-accent-muted hover:bg-gh-accent-subtle transition-colors group"
                >
                  <div className="font-medium text-sm text-gh-fg-default group-hover:text-gh-accent-fg">From Recipe</div>
                  <div className="text-xs text-gh-fg-muted mt-1">Choose from your recipe collection</div>
                </button>
                
                <button
                  onClick={() => handleAddMeal('savedMeal')}
                  className="w-full p-gh-3 text-left border border-gh-border-default rounded-gh-sm hover:border-gh-success-muted hover:bg-gh-success-subtle transition-colors group"
                >
                  <div className="font-medium text-sm text-gh-fg-default group-hover:text-gh-success-fg">Saved Meal</div>
                  <div className="text-xs text-gh-fg-muted mt-1">Choose from your custom meals</div>
                </button>

                <button
                  onClick={() => handleAddMeal('productMeal')}
                  className="w-full p-gh-3 text-left border border-gh-border-default rounded-gh-sm hover:border-gh-severe-muted hover:bg-gh-severe-subtle transition-colors group"
                >
                  <div className="font-medium text-sm text-gh-fg-default group-hover:text-gh-severe-fg">Product-Based Meal</div>
                  <div className="text-xs text-gh-fg-muted mt-1">Mac & cheese, nuggets, etc.</div>
                </button>

                <button
                  onClick={() => handleAddMeal('mealBuilder')}
                  className="w-full p-gh-3 text-left border border-gh-border-default rounded-gh-sm hover:border-gh-attention-muted hover:bg-gh-attention-subtle transition-colors group"
                >
                  <div className="font-medium text-sm text-gh-fg-default group-hover:text-gh-attention-fg">Search Products</div>
                  <div className="text-xs text-gh-fg-muted mt-1">Search Instacart catalog</div>
                </button>
              </div>
              
              <div className="p-gh-4 border-t border-gh-border-muted">
                <button
                  onClick={() => setSelectedCell(null)}
                  className="w-full px-gh-3 py-2 border border-gh-border-default text-gh-fg-default rounded-gh-sm hover:bg-gh-canvas-subtle transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
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
            className="fixed inset-0 bg-gh-neutral-emphasis/50 flex items-center justify-center z-50 p-gh-4"
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