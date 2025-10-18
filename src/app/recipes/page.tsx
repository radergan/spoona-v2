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
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Recipes</h1>
            <p className="text-gray-600">Organize and discover your favorite recipes</p>
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            + Add Recipe
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search recipes..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              <option>All Categories</option>
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
              <option>Dessert</option>
              <option>Snacks</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              <option>All Cook Times</option>
              <option>Under 15 mins</option>
              <option>15-30 mins</option>
              <option>30-60 mins</option>
              <option>Over 1 hour</option>
            </select>
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleRecipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Recipe Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                <div className="text-6xl">🍽️</div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">{recipe.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{recipe.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>⏱️ {recipe.cookTime}</span>
                  <span>👥 {recipe.servings} servings</span>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors">
                    View Recipe
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    <span>📋</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (if no recipes) */}
        {sampleRecipes.length === 0 && (
                    {recipes.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes yet</h3>
                <p className="text-gray-600 mb-6">Start by creating your first recipe</p>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Create First Recipe
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{recipe.title}</h3>
                      <button className="text-gray-400 hover:text-orange-600 transition-colors text-sm">
                        Save
                      </button>
                    </div>
                    {recipe.description && (
                      <p className="text-sm text-gray-600 mb-4">{recipe.description}</p>
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{recipe.ingredients?.length || 0} ingredients</span>
                      {recipe.cookTime && <span>{recipe.cookTime} min</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        {showCreateForm && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Recipe Builder Coming Soon</h3>
            <p className="text-gray-600 mb-6">We're working on an amazing recipe creation experience</p>
            <button 
              onClick={() => setShowCreateForm(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Back to Recipes
            </button>
          </div>
        )}
        )}
      </main>
    </div>
  )
}