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
        className="bg-gh-canvas-default border border-gh-border-default rounded-gh-md shadow-gh-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-gh-4 border-b border-gh-border-muted bg-gh-canvas-subtle">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gh-fg-default">Select a Recipe</h2>
              <p className="text-gh-fg-muted mt-1 text-sm">Choose from your recipe collection</p>
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
              placeholder="Search recipes by name, description, or tags..."
              className="w-full px-gh-3 py-2 pl-8 text-sm border border-gh-border-default rounded-gh-sm focus:outline-none focus:border-gh-accent-emphasis bg-gh-canvas-default transition-colors"
            />
            <svg className="absolute left-3 top-2.5 h-4 w-4 text-gh-fg-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Recipe List */}
        <div className="p-gh-4 overflow-y-auto max-h-96">
          <div className="grid md:grid-cols-2 gap-gh-3">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => onSelectRecipe(recipe)}
                className="p-gh-3 border border-gh-border-default rounded-gh-sm hover:border-gh-accent-muted hover:bg-gh-accent-subtle cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between mb-gh-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gh-fg-default mb-1">{recipe.title}</h3>
                    {recipe.description && (
                      <p className="text-sm text-gh-fg-muted mb-2">{recipe.description}</p>
                    )}
                  </div>

                </div>

                <div className="flex items-center justify-between text-sm text-gh-fg-muted mb-gh-3">
                  <div className="flex items-center space-x-4">
                    {recipe.cookTime && (
                      <span className="flex items-center">
                        Cook: {recipe.cookTime} min
                      </span>
                    )}
                    {recipe.servings && (
                      <span className="flex items-center">
                        Serves: {recipe.servings}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {recipe.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-gh-neutral-muted text-gh-fg-default text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-gh-3 pt-gh-3 border-t border-gh-border-muted">
                  <div className="text-gh-accent-fg text-sm font-medium">Click to add to meal plan →</div>
                </div>
              </div>
            ))}
          </div>

          {filteredRecipes.length === 0 && (
            <div className="text-center py-gh-8">
              <h3 className="text-lg font-medium text-gh-fg-default mb-2">No recipes found</h3>
              <p className="text-gh-fg-muted">
                {searchQuery 
                  ? `No recipes match "${searchQuery}". Try a different search term.`
                  : 'You don\'t have any recipes yet. Create some recipes first!'
                }
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-gh-4 border-t border-gh-border-muted bg-gh-canvas-subtle">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gh-fg-muted">
              {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} available
            </div>
            <div className="flex gap-gh-2">
              <button
                onClick={onClose}
                className="px-gh-3 py-2 border border-gh-border-default text-gh-fg-default rounded-gh-sm hover:bg-gh-canvas-subtle transition-colors text-sm"
              >
                Cancel
              </button>
              <button className="px-gh-3 py-2 bg-gh-accent-emphasis hover:bg-gh-accent-fg text-gh-fg-onEmphasis rounded-gh-sm font-medium transition-colors text-sm">
                + Create New Recipe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}