'use client'

import { MainNavigation } from '@/components/MainNavigation'

export default function RecipesPage() {
  // Sample recipe data - in real app this would come from database
  const sampleRecipes = [
    {
      id: 1,
      title: "Chicken Parmesan",
      description: "Crispy breaded chicken with marinara sauce and melted cheese",
      cookTime: "30 mins",
      servings: 4,
      image: null,
      tags: ["Italian", "Dinner", "Comfort Food"]
    },
    {
      id: 2,
      title: "Beef Stir Fry",
      description: "Quick and healthy beef with vegetables in savory sauce",
      cookTime: "15 mins", 
      servings: 3,
      image: null,
      tags: ["Asian", "Quick", "Healthy"]
    },
    {
      id: 3,
      title: "Chocolate Chip Cookies",
      description: "Classic homemade cookies with chocolate chips",
      cookTime: "25 mins",
      servings: 24,
      image: null,
      tags: ["Dessert", "Baking", "Sweet"]
    }
  ]

  return (
    <div className="min-h-screen bg-gh-canvas-inset">
      <MainNavigation />
      
      <main className="container mx-auto px-gh-6 py-gh-6">
        <div className="flex justify-between items-start mb-gh-6">
          <div>
            <h1 className="text-2xl font-semibold text-gh-fg-default mb-gh-2">My Recipes</h1>
            <p className="text-gh-fg-muted">Organize and discover your favorite recipes</p>
          </div>
          <button className="bg-gh-accent-emphasis hover:bg-gh-accent-fg text-gh-fg-onEmphasis px-gh-4 py-1.5 rounded-gh-sm text-sm font-medium transition-colors">
            + Add Recipe
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-gh-canvas-default border border-gh-border-default rounded-gh-md p-gh-4 mb-gh-6 shadow-gh-sm">
          <div className="flex flex-col md:flex-row gap-gh-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search recipes..."
                className="w-full px-gh-3 py-2 text-sm border border-gh-border-default rounded-gh-sm focus:outline-none focus:border-gh-accent-emphasis bg-gh-canvas-default transition-colors"
              />
            </div>
            <select className="px-gh-3 py-2 text-sm border border-gh-border-default rounded-gh-sm focus:outline-none focus:border-gh-accent-emphasis bg-gh-canvas-default transition-colors">
              <option>All Categories</option>
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
              <option>Dessert</option>
              <option>Snacks</option>
            </select>
            <select className="px-gh-3 py-2 text-sm border border-gh-border-default rounded-gh-sm focus:outline-none focus:border-gh-accent-emphasis bg-gh-canvas-default transition-colors">
              <option>All Cook Times</option>
              <option>Under 15 mins</option>
              <option>15-30 mins</option>
              <option>30-60 mins</option>
              <option>Over 1 hour</option>
            </select>
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-gh-4">
          {sampleRecipes.map((recipe) => (
            <div key={recipe.id} className="bg-gh-canvas-default border border-gh-border-default rounded-gh-md overflow-hidden hover:shadow-gh-md transition-all group">
              {/* Recipe Image Placeholder */}
              <div className="h-32 bg-gradient-to-br from-gh-accent-subtle to-gh-severe-subtle flex items-center justify-center border-b border-gh-border-muted">
                <div className="text-gh-fg-muted text-sm">Recipe Photo</div>
              </div>
              
              <div className="p-gh-4">
                <h3 className="text-base font-semibold mb-gh-2 text-gh-fg-default group-hover:text-gh-accent-fg transition-colors">{recipe.title}</h3>
                <p className="text-gh-fg-muted text-sm mb-gh-3 line-clamp-2">{recipe.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gh-fg-muted mb-gh-3">
                  <span>{recipe.cookTime}</span>
                  <span>{recipe.servings} servings</span>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-gh-3">
                  {recipe.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-gh-neutral-muted text-gh-fg-default text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-gh-2">
                  <button className="flex-1 bg-gh-accent-emphasis hover:bg-gh-accent-fg text-gh-fg-onEmphasis py-1.5 px-gh-3 rounded-gh-sm text-sm font-medium transition-colors">
                    View Recipe
                  </button>
                  <button className="px-gh-2 py-1.5 border border-gh-border-default rounded-gh-sm hover:bg-gh-canvas-subtle transition-colors">
                    <svg className="w-4 h-4 text-gh-fg-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (if no recipes) */}
        {sampleRecipes.length === 0 && (
          <div className="text-center py-gh-8">
            <div className="bg-gh-canvas-default border border-gh-border-default rounded-gh-md p-gh-6">
              <div className="w-12 h-12 bg-gh-neutral-muted rounded-gh-md flex items-center justify-center mx-auto mb-gh-3">
                <svg className="w-6 h-6 text-gh-fg-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-base font-medium text-gh-fg-default mb-gh-2">No recipes yet</h3>
              <p className="text-gh-fg-muted mb-gh-4 text-sm">Start by creating your first recipe</p>
              <button className="bg-gh-accent-emphasis hover:bg-gh-accent-fg text-gh-fg-onEmphasis px-gh-4 py-2 rounded-gh-sm text-sm font-medium transition-colors">
                Create First Recipe
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}