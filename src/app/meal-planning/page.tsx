'use client'

import { useState } from 'react'
import { MainNavigation } from '@/components/MainNavigation'
import { MealBuilder } from '@/components/MealBuilder'
import { ProductMealBuilder } from '@/components/ProductMealBuilder'
import { RecipeSelectionModal } from '@/components/RecipeSelectionModal'
import { SavedMealsModal } from '@/components/SavedMealsModal'

type ModalType = null | 'recipe' | 'savedMeal' | 'mealBuilder' | 'productMeal' | 'mealSlots'

interface MealPlanItem {
  type: 'recipe' | 'savedMeal' | 'productMeal'
  name: string
  estimatedPrice?: number
}

interface UserSubscription {
  isPremium: boolean
  customMealSlots?: string[]
}

interface MealSlot {
  id: string
  name: string
  order: number
  isDefault: boolean
}

export default function MealPlanningPage() {
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [selectedCell, setSelectedCell] = useState<{ day: string; mealType: string } | null>(null)
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set())
  
  // Premium subscription state (in real app, this would come from auth context)
  const [userSubscription] = useState<UserSubscription>({
    isPremium: true, // Set to false to test free version
    customMealSlots: ['Breakfast', 'Mid-Morning Snack', 'Lunch', 'Afternoon Snack', 'Dinner', 'Evening Snack']
  })

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  
  // Default meal slots for free users
  const defaultMealSlots: MealSlot[] = [
    { id: 'breakfast', name: 'Breakfast', order: 1, isDefault: true },
    { id: 'lunch', name: 'Lunch', order: 2, isDefault: true },
    { id: 'dinner', name: 'Dinner', order: 3, isDefault: true }
  ]

  // Get current meal slots based on subscription
  const getMealSlots = (): MealSlot[] => {
    if (userSubscription.isPremium && userSubscription.customMealSlots) {
      return userSubscription.customMealSlots.map((slot, index) => ({
        id: slot.toLowerCase().replace(/\s+/g, '-'),
        name: slot,
        order: index + 1,
        isDefault: defaultMealSlots.some(d => d.name === slot)
      }))
    }
    return defaultMealSlots
  }

  const mealSlots = getMealSlots()
  const mealTypes = mealSlots.map(slot => slot.name)

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

  const toggleDayExpansion = (day: string) => {
    setExpandedDays(prev => {
      const newSet = new Set(prev)
      if (newSet.has(day)) {
        newSet.delete(day)
      } else {
        newSet.add(day)
      }
      return newSet
    })
  }

  const handleMealSlotConfig = () => {
    setActiveModal('mealSlots')
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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-gh-6 gap-gh-4">
          <div>
            <div className="flex items-center gap-gh-3 mb-gh-2">
              <h1 className="text-2xl font-semibold text-gh-fg-default">Meal Planning</h1>
              {userSubscription.isPremium && (
                <span className="bg-gh-accent-emphasis text-gh-fg-onEmphasis px-2 py-0.5 rounded-full text-xs font-medium">
                  Premium
                </span>
              )}
            </div>
            <p className="text-gh-fg-muted text-sm">Plan your weekly meals and generate shopping lists</p>
            <p className="text-gh-fg-muted text-xs mt-1">
              {userSubscription.isPremium 
                ? `Using ${mealSlots.length} custom meal slots`
                : '3 meal slots (upgrade for more)'}
            </p>
          </div>
          <div className="flex flex-wrap gap-gh-2">
            {userSubscription.isPremium && (
              <button 
                onClick={handleMealSlotConfig}
                className="bg-gh-canvas-default border border-gh-border-default hover:bg-gh-canvas-subtle text-gh-fg-default px-gh-3 py-1.5 rounded-gh-md text-sm font-medium transition-colors shadow-gh-sm hover:shadow-gh-md"
              >
                Configure Meals
              </button>
            )}
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

        {/* Desktop Meal Planning Grid */}
        <div className="hidden lg:block bg-gh-canvas-default border border-gh-border-default rounded-gh-md overflow-hidden shadow-gh-sm">
          {/* Header Row */}
          <div className={`grid bg-gh-canvas-inset border-b border-gh-border-muted`} style={{ gridTemplateColumns: `120px repeat(7, 1fr)` }}>
            <div className="p-gh-3 text-sm font-medium text-gh-fg-muted">Meal</div>
            {daysOfWeek.map((day) => (
              <div key={day} className="p-gh-3 text-sm font-medium text-gh-fg-muted text-center border-l border-gh-border-muted">
                {day.slice(0, 3)}
              </div>
            ))}
          </div>

          {/* Meal Rows */}
          {mealTypes.map((mealType) => (
            <div key={mealType} className={`grid border-b border-gh-border-muted last:border-b-0`} style={{ gridTemplateColumns: `120px repeat(7, 1fr)` }}>
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
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-gh-danger-emphasis hover:bg-gh-danger-fg text-gh-fg-onEmphasis rounded-gh-sm w-5 h-5 flex items-center justify-center transition-all shadow-gh-sm"
                          title="Remove meal"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => handleCellClick(day, mealType)}
                        className="border-2 border-dashed border-gh-border-default rounded-gh-sm p-gh-2 text-center cursor-pointer hover:border-gh-accent-muted hover:bg-gh-accent-subtle transition-colors h-full flex items-center justify-center"
                      >
                        <span className="text-gh-fg-muted text-xs">+ Add</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Mobile Day Cards */}
        <div className="lg:hidden space-y-gh-3">
          {daysOfWeek.map((day) => {
            const isExpanded = expandedDays.has(day)
            const dayMeals = mealTypes.filter(mealType => mealPlan[`${day}-${mealType}`])
            
            return (
              <div key={day} className="bg-gh-canvas-default border border-gh-border-default rounded-gh-md shadow-gh-sm overflow-hidden">
                {/* Day Header */}
                <button
                  onClick={() => toggleDayExpansion(day)}
                  className="w-full p-gh-4 flex items-center justify-between bg-gh-canvas-subtle hover:bg-gh-neutral-muted transition-colors"
                >
                  <div className="flex items-center gap-gh-3">
                    <h3 className="font-semibold text-gh-fg-default">{day}</h3>
                    <span className="text-sm text-gh-fg-muted">
                      {dayMeals.length} of {mealTypes.length} meals
                    </span>
                  </div>
                  <div className="flex items-center gap-gh-2">
                    {dayMeals.length > 0 && (
                      <div className="flex -space-x-1">
                        {dayMeals.slice(0, 3).map((mealType) => {
                          const meal = mealPlan[`${day}-${mealType}`]
                          return (
                            <div
                              key={mealType}
                              className={`w-6 h-6 rounded-full border-2 border-gh-canvas-default flex items-center justify-center text-xs font-medium ${
                                meal?.type === 'recipe' ? 'bg-gh-accent-subtle text-gh-accent-fg' : 
                                meal?.type === 'productMeal' ? 'bg-gh-severe-subtle text-gh-severe-fg' : 
                                'bg-gh-success-subtle text-gh-success-fg'
                              }`}
                              title={`${mealType}: ${meal?.name}`}
                            >
                              {mealType.charAt(0)}
                            </div>
                          )
                        })}
                        {dayMeals.length > 3 && (
                          <div className="w-6 h-6 rounded-full border-2 border-gh-canvas-default bg-gh-neutral-muted text-gh-fg-muted flex items-center justify-center text-xs font-medium">
                            +{dayMeals.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                    <svg 
                      className={`w-4 h-4 text-gh-fg-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expanded Day Content */}
                {isExpanded && (
                  <div className="border-t border-gh-border-muted">
                    <div className="p-gh-4 space-y-gh-3">
                      {mealTypes.map((mealType) => {
                        const mealKey = `${day}-${mealType}`
                        const meal = mealPlan[mealKey]
                        
                        return (
                          <div key={mealType} className="flex items-start gap-gh-3">
                            <div className="w-20 text-sm font-medium text-gh-fg-muted py-2 flex-shrink-0">
                              {mealType}
                            </div>
                            <div className="flex-1">
                              {meal ? (
                                <div className="bg-gh-success-subtle border border-gh-success-muted rounded-gh-sm p-gh-3 group relative">
                                  <div className="font-medium text-sm text-gh-fg-default mb-1">{meal.name}</div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                      meal.type === 'recipe' ? 'bg-gh-accent-subtle text-gh-accent-fg' : 
                                      meal.type === 'productMeal' ? 'bg-gh-severe-subtle text-gh-severe-fg' : 
                                      'bg-gh-neutral-muted text-gh-fg-muted'
                                    }`}>
                                      {meal.type === 'recipe' ? 'Recipe' : 
                                       meal.type === 'productMeal' ? 'Product' : 'Custom'}
                                    </span>
                                    {meal.estimatedPrice && (
                                      <span className="text-xs text-gh-success-fg font-medium">
                                        ${meal.estimatedPrice.toFixed(2)}
                                      </span>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => handleRemoveMeal(day, mealType)}
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-gh-danger-emphasis hover:bg-gh-danger-fg text-gh-fg-onEmphasis rounded-gh-sm w-6 h-6 flex items-center justify-center transition-all shadow-gh-sm"
                                    title="Remove meal"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => handleCellClick(day, mealType)}
                                  className="w-full border-2 border-dashed border-gh-border-default rounded-gh-sm p-gh-3 text-center hover:border-gh-accent-muted hover:bg-gh-accent-subtle transition-colors"
                                >
                                  <span className="text-gh-fg-muted text-sm">+ Add meal</span>
                                </button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
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

        {/* Meal Slot Configuration Modal (Premium) */}
        {activeModal === 'mealSlots' && userSubscription.isPremium && (
          <div 
            className="fixed inset-0 bg-gh-neutral-emphasis/50 flex items-center justify-center z-50 p-gh-4"
            onClick={() => setActiveModal(null)}
          >
            <div 
              className="bg-gh-canvas-default border border-gh-border-default rounded-gh-md shadow-gh-lg max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-gh-4 border-b border-gh-border-muted bg-gh-canvas-subtle">
                <div>
                  <h3 className="text-lg font-semibold text-gh-fg-default">Configure Meal Slots</h3>
                  <p className="text-gh-fg-muted text-sm mt-1">Customize up to 8 meal slots for your daily planning</p>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="text-gh-fg-muted hover:text-gh-fg-default p-gh-2 rounded-gh-sm hover:bg-gh-neutral-muted transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-gh-4">
                <div className="mb-gh-4">
                  <div className="flex items-center gap-gh-2 mb-gh-3">
                    <svg className="w-4 h-4 text-gh-accent-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <h4 className="font-medium text-gh-fg-default">Premium Feature</h4>
                  </div>
                  <p className="text-sm text-gh-fg-muted mb-gh-4">
                    As a premium member, you can customize your meal slots beyond the standard Breakfast, Lunch, Dinner. 
                    Perfect for athletes, shift workers, or anyone with unique eating schedules.
                  </p>
                </div>

                <div className="space-y-gh-3 mb-gh-4">
                  <h5 className="font-medium text-gh-fg-default text-sm">Current Meal Slots ({mealSlots.length}/8)</h5>
                  {mealSlots.map((slot, index) => (
                    <div key={slot.id} className="flex items-center gap-gh-3 p-gh-3 bg-gh-canvas-subtle rounded-gh-sm border border-gh-border-default">
                      <div className="w-6 h-6 bg-gh-accent-subtle text-gh-accent-fg rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <input
                        type="text"
                        value={slot.name}
                        readOnly
                        className="flex-1 px-gh-3 py-1.5 text-sm border border-gh-border-default rounded-gh-sm bg-gh-canvas-default"
                      />
                      <div className="flex gap-gh-1">
                        {slot.isDefault && (
                          <span className="text-xs bg-gh-neutral-muted text-gh-fg-muted px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                        <button className="text-gh-fg-muted hover:text-gh-danger-fg p-1 rounded-gh-sm hover:bg-gh-danger-subtle transition-colors">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {mealSlots.length < 8 && (
                    <button className="w-full p-gh-3 border-2 border-dashed border-gh-border-default rounded-gh-sm hover:border-gh-accent-muted hover:bg-gh-accent-subtle transition-colors text-gh-fg-muted hover:text-gh-accent-fg">
                      <span className="text-sm">+ Add Meal Slot</span>
                    </button>
                  )}
                </div>

                <div className="bg-gh-attention-subtle border border-gh-attention-muted rounded-gh-sm p-gh-3 mb-gh-4">
                  <div className="flex items-start gap-gh-2">
                    <svg className="w-4 h-4 text-gh-attention-fg mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gh-attention-fg">Popular Custom Slots</p>
                      <p className="text-xs text-gh-fg-muted mt-1">
                        Pre-workout, Post-workout, Mid-morning Snack, Afternoon Snack, Evening Snack, Late Night, Second Breakfast
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-gh-2 pt-gh-4 border-t border-gh-border-muted">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="flex-1 px-gh-3 py-2 border border-gh-border-default text-gh-fg-default rounded-gh-sm hover:bg-gh-canvas-subtle transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 px-gh-3 py-2 bg-gh-accent-emphasis hover:bg-gh-accent-fg text-gh-fg-onEmphasis rounded-gh-sm font-medium transition-colors text-sm">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}