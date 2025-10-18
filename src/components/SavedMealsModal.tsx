'use client'

import { useState } from 'react'

interface SavedMeal {
  id: string
  name: string
  description?: string
  items: Array<{
    name: string
    amount: string
    category?: string
  }>
  createdAt: string
}

interface SavedMealsModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectMeal: (meal: SavedMeal) => void
}

export function SavedMealsModal({ isOpen, onClose, onSelectMeal }: SavedMealsModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  
  // Mock saved meals data - in real app this would come from the database
  const mockSavedMeals: SavedMeal[] = [
    {
      id: '1',
      name: 'Mediterranean Bowl',
      description: 'Fresh vegetables with hummus and pita',
      items: [
        { name: 'Hummus', amount: '1 container', category: 'Dairy' },
        { name: 'Cucumber', amount: '1 large', category: 'Produce' },
        { name: 'Cherry Tomatoes', amount: '1 cup', category: 'Produce' },
        { name: 'Pita Bread', amount: '2 pieces', category: 'Bakery' },
        { name: 'Feta Cheese', amount: '2 oz', category: 'Dairy' }
      ],
      createdAt: '2025-10-15'
    },
    {
      id: '2',
      name: 'Protein Smoothie Bowl',
      description: 'Healthy smoothie with toppings',
      items: [
        { name: 'Frozen Berries', amount: '1 cup', category: 'Frozen' },
        { name: 'Banana', amount: '1 large', category: 'Produce' },
        { name: 'Protein Powder', amount: '1 scoop', category: 'Pantry' },
        { name: 'Granola', amount: '2 tbsp', category: 'Pantry' },
        { name: 'Almond Milk', amount: '1 cup', category: 'Dairy' }
      ],
      createdAt: '2025-10-12'
    },
    {
      id: '3',
      name: 'Quick Sandwich Combo',
      description: 'Turkey sandwich with sides',
      items: [
        { name: 'Sliced Turkey', amount: '4 oz', category: 'Deli' },
        { name: 'Whole Grain Bread', amount: '2 slices', category: 'Bakery' },
        { name: 'Swiss Cheese', amount: '2 slices', category: 'Deli' },
        { name: 'Lettuce', amount: '2 leaves', category: 'Produce' },
        { name: 'Apple', amount: '1 medium', category: 'Produce' },
        { name: 'Chips', amount: '1 small bag', category: 'Snacks' }
      ],
      createdAt: '2025-10-10'
    }
  ]

  const filteredMeals = mockSavedMeals.filter(meal =>
    meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meal.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meal.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div 
        className="bg-gh-canvas-default rounded-gh-md shadow-gh-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-gh-4 border-b border-gh-border-muted bg-gh-canvas-subtle">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gh-fg-default">Select a Saved Meal</h2>
              <p className="text-gh-fg-muted mt-1">Choose from your custom meal combinations</p>
            </div>
            <button
              onClick={onClose}
              className="text-gh-fg-muted hover:text-gh-fg-default transition-colors p-gh-2 rounded-gh-sm hover:bg-gh-neutral-muted"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-gh-4 border-b border-gh-border-muted">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved meals by name or ingredients..."
              className="w-full px-gh-3 py-2 pl-8 text-sm border border-gh-border-default rounded-gh-sm focus:outline-none focus:border-gh-accent-emphasis bg-gh-canvas-default transition-colors"
            />
            <svg className="absolute left-3 top-2.5 h-4 w-4 text-gh-fg-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Saved Meals List */}
        <div className="p-gh-4 overflow-y-auto max-h-96">
          <div className="space-y-gh-3">
            {filteredMeals.map((meal) => (
              <div
                key={meal.id}
                onClick={() => onSelectMeal(meal)}
                className="p-gh-3 border border-gh-border-default rounded-gh-sm hover:border-gh-accent-muted hover:bg-gh-accent-subtle cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between mb-gh-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gh-fg-default">{meal.name}</h3>
                      <span className="text-xs bg-gh-success-subtle text-gh-success-fg px-2 py-0.5 rounded-full">
                        Saved Meal
                      </span>
                    </div>
                    {meal.description && (
                      <p className="text-sm text-gh-fg-muted mb-2">{meal.description}</p>
                    )}
                    <p className="text-xs text-gh-fg-muted">
                      Created: {new Date(meal.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                </div>

                {/* Items Preview */}
                <div className="mb-gh-3">
                  <h4 className="text-sm font-medium text-gh-fg-default mb-2">
                    Ingredients ({meal.items.length} items):
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {meal.items.slice(0, 6).map((item, index) => (
                      <div key={index} className="text-sm text-gh-fg-muted flex justify-between">
                        <span className="truncate">{item.name}</span>
                        <span className="text-gh-fg-muted ml-2">{item.amount}</span>
                      </div>
                    ))}
                    {meal.items.length > 6 && (
                      <div className="text-sm text-gh-fg-muted col-span-2">
                        +{meal.items.length - 6} more items...
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-gh-3 border-t border-gh-border-muted">
                  <div className="text-gh-accent-fg text-sm font-medium">Click to add to meal plan →</div>
                </div>
              </div>
            ))}
          </div>

          {filteredMeals.length === 0 && (
            <div className="text-center py-gh-8">
              <h3 className="text-lg font-medium text-gh-fg-default mb-2">No saved meals found</h3>
              <p className="text-gh-fg-muted">
                {searchQuery 
                  ? `No saved meals match "${searchQuery}". Try a different search term.`
                  : 'You don\'t have any saved meals yet. Create custom meals and save them for reuse!'
                }
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-gh-4 border-t border-gh-border-muted bg-gh-canvas-subtle">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gh-fg-muted">
              {filteredMeals.length} saved meal{filteredMeals.length !== 1 ? 's' : ''} available
            </div>
            <div className="flex gap-gh-2">
              <button
                onClick={onClose}
                className="px-gh-3 py-2 border border-gh-border-default text-gh-fg-default rounded-gh-sm hover:bg-gh-canvas-subtle transition-colors text-sm"
              >
                Cancel
              </button>
              <button className="px-gh-3 py-2 bg-gh-accent-emphasis hover:bg-gh-accent-fg text-gh-fg-onEmphasis rounded-gh-sm font-medium transition-colors text-sm">
                + Create New Meal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}