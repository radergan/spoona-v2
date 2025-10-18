'use client'

import { useState } from 'react'

interface Recipe {
  id: string
  title: string
  description?: string
  cookTime?: number
  servings?: number
  tags: string[]
  image?: string
}

interface RecipeSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectRecipe: (recipe: Recipe) => void
}

export function RecipeSelectionModal({ isOpen, onClose, onSelectRecipe }: RecipeSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  
  // Mock recipe data - in real app this would come from the database
  const mockRecipes: Recipe[] = [
    {
      id: '1',
      title: 'Chicken Parmesan',
      description: 'Crispy breaded chicken with marinara sauce and melted cheese',
      cookTime: 30,
      servings: 4,
      tags: ['Italian', 'Dinner', 'Comfort Food']
    },
    {
      id: '2',
      title: 'Beef Stir Fry',
      description: 'Quick and healthy beef with vegetables in savory sauce',
      cookTime: 15,
      servings: 3,
      tags: ['Asian', 'Quick', 'Healthy']
    },
    {
      id: '3',
      title: 'Caesar Salad',
      description: 'Fresh romaine lettuce with creamy Caesar dressing',
      cookTime: 10,
      servings: 2,
      tags: ['Salad', 'Quick', 'Vegetarian']
    },
    {
      id: '4',
      title: 'Pancakes',
      description: 'Fluffy homemade pancakes perfect for breakfast',
      cookTime: 20,
      servings: 4,
      tags: ['Breakfast', 'Sweet', 'Family']
    },
    {
      id: '5',
      title: 'Grilled Salmon',
      description: 'Healthy grilled salmon with lemon and herbs',
      cookTime: 25,
      servings: 2,
      tags: ['Healthy', 'Seafood', 'Dinner']
    },
    {
      id: '6',
      title: 'Vegetable Soup',
      description: 'Hearty vegetable soup with seasonal vegetables',
      cookTime: 45,
      servings: 6,
      tags: ['Soup', 'Healthy', 'Vegetarian']
    }
  ]

  const filteredRecipes = mockRecipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
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
        <div className="p-6 border-b border-gray-200 bg-orange-50">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Select a Recipe</h2>
              <p className="text-gray-600 mt-1">Choose from your recipe collection</p>
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
              placeholder="Search recipes by name, description, or tags..."
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Recipe List */}
        <div className="p-6 overflow-y-auto max-h-96">
          <div className="grid md:grid-cols-2 gap-4">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => onSelectRecipe(recipe)}
                className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{recipe.title}</h3>
                    {recipe.description && (
                      <p className="text-sm text-gray-600 mb-2">{recipe.description}</p>
                    )}
                  </div>
                  <div className="text-4xl ml-4">🍽️</div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <div className="flex items-center space-x-4">
                    {recipe.cookTime && (
                      <span className="flex items-center">
                        ⏱️ {recipe.cookTime} min
                      </span>
                    )}
                    {recipe.servings && (
                      <span className="flex items-center">
                        👥 {recipe.servings} servings
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="text-orange-600 text-sm font-medium">Click to add to meal plan →</div>
                </div>
              </div>
            ))}
          </div>

          {filteredRecipes.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
              <p className="text-gray-600">
                {searchQuery 
                  ? `No recipes match "${searchQuery}". Try a different search term.`
                  : 'You don\'t have any recipes yet. Create some recipes first!'
                }
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} available
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-medium transition-colors">
                + Create New Recipe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}