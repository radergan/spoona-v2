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
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-green-50">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Select a Saved Meal</h2>
              <p className="text-gray-600 mt-1">Choose from your custom meal combinations</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved meals by name or ingredients..."
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Saved Meals List */}
        <div className="p-6 overflow-y-auto max-h-96">
          <div className="space-y-4">
            {filteredMeals.map((meal) => (
              <div
                key={meal.id}
                onClick={() => onSelectMeal(meal)}
                className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{meal.name}</h3>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Saved Meal
                      </span>
                    </div>
                    {meal.description && (
                      <p className="text-sm text-gray-600 mb-2">{meal.description}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Created: {new Date(meal.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-4xl ml-4">🥗</div>
                </div>

                {/* Items Preview */}
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Ingredients ({meal.items.length} items):
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {meal.items.slice(0, 6).map((item, index) => (
                      <div key={index} className="text-sm text-gray-600 flex justify-between">
                        <span className="truncate">{item.name}</span>
                        <span className="text-gray-400 ml-2">{item.amount}</span>
                      </div>
                    ))}
                    {meal.items.length > 6 && (
                      <div className="text-sm text-gray-500 col-span-2">
                        +{meal.items.length - 6} more items...
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <div className="text-green-600 text-sm font-medium">Click to add to meal plan →</div>
                </div>
              </div>
            ))}
          </div>

          {filteredMeals.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🥗</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No saved meals found</h3>
              <p className="text-gray-600">
                {searchQuery 
                  ? `No saved meals match "${searchQuery}". Try a different search term.`
                  : 'You don\'t have any saved meals yet. Create custom meals and save them for reuse!'
                }
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {filteredMeals.length} saved meal{filteredMeals.length !== 1 ? 's' : ''} available
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium transition-colors">
                + Create New Meal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}