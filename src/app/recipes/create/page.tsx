'use client'

import { useState } from 'react'
import { MainNavigation } from '@/components/MainNavigation'

interface Ingredient {
  id: string
  name: string
  amount: string
  unit: string
  category?: string
  productSuggestions?: ProductSuggestion[]
  linkedProduct?: string
}

interface ProductSuggestion {
  id: string
  name: string
  brand?: string
  price?: number
  storeAvailability: string[]
}

interface Recipe {
  title: string
  description: string
  servings: number
  prepTime: number
  cookTime: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  cuisine: string
  dietary: string[]
  tags: string[]
  ingredients: Ingredient[]
  instructions: string[]
  notes: string
  nutritionEstimate?: {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
  }
}

const DIETARY_OPTIONS = [
  'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 
  'Low-Carb', 'Keto', 'Paleo', 'Whole30', 'Low-Sodium'
]

const CUISINE_OPTIONS = [
  'American', 'Italian', 'Mexican', 'Asian', 'Mediterranean', 'Indian', 
  'French', 'Thai', 'Chinese', 'Japanese', 'Greek', 'Spanish', 'Other'
]

const UNIT_OPTIONS = [
  'cup', 'tbsp', 'tsp', 'oz', 'lb', 'g', 'kg', 'ml', 'L', 'piece', 'clove', 'can', 'package'
]

export default function CreateRecipePage() {
  const [recipe, setRecipe] = useState<Recipe>({
    title: '',
    description: '',
    servings: 4,
    prepTime: 15,
    cookTime: 30,
    difficulty: 'Medium',
    cuisine: '',
    dietary: [],
    tags: [],
    ingredients: [{ id: '1', name: '', amount: '', unit: 'cup' }],
    instructions: [''],
    notes: ''
  })

  const [activeSection, setActiveSection] = useState<'basic' | 'ingredients' | 'instructions' | 'details'>('basic')
  const [showProductSuggestions, setShowProductSuggestions] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const addIngredient = () => {
    const newId = (recipe.ingredients.length + 1).toString()
    setRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { id: newId, name: '', amount: '', unit: 'cup' }]
    }))
  }

  const removeIngredient = (id: string) => {
    setRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(ing => ing.id !== id)
    }))
  }

  const updateIngredient = (id: string, field: keyof Ingredient, value: string) => {
    setRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.map(ing =>
        ing.id === id ? { ...ing, [field]: value } : ing
      )
    }))
  }

  const addInstruction = () => {
    setRecipe(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }))
  }

  const removeInstruction = (index: number) => {
    setRecipe(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }))
  }

  const updateInstruction = (index: number, value: string) => {
    setRecipe(prev => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) => i === index ? value : inst)
    }))
  }

  const toggleDietary = (option: string) => {
    setRecipe(prev => ({
      ...prev,
      dietary: prev.dietary.includes(option)
        ? prev.dietary.filter(d => d !== option)
        : [...prev.dietary, option]
    }))
  }

  const addTag = (tag: string) => {
    if (tag.trim() && !recipe.tags.includes(tag.trim())) {
      setRecipe(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }))
    }
  }

  const removeTag = (tag: string) => {
    setRecipe(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Here you would save to your database
      console.log('Saving recipe:', recipe)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Recipe saved successfully!')
    } catch (error) {
      alert('Error saving recipe. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'basic':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        )
      case 'ingredients':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        )
      case 'instructions':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        )
      case 'details':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gh-canvas-default">
      <MainNavigation />
      
      <main className="container mx-auto px-gh-4 py-gh-6 max-w-5xl">
        {/* Header */}
        <div className="mb-gh-6">
          <div className="flex items-center gap-gh-3 mb-gh-2">
            <h1 className="text-2xl font-semibold text-gh-fg-default">Create New Recipe</h1>
            <div className="flex items-center gap-gh-2">
              <svg className="w-4 h-4 text-gh-accent-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-sm text-gh-accent-fg font-medium">Smart Product Linking</span>
            </div>
          </div>
          <p className="text-gh-fg-muted">Create detailed recipes with automatic product suggestions for seamless shopping list generation.</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-gh-6">
          {/* Progress Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-gh-canvas-default border border-gh-border-default rounded-gh-md p-gh-4 sticky top-gh-6">
              <h3 className="text-sm font-semibold text-gh-fg-default mb-gh-4">Recipe Sections</h3>
              <nav className="space-y-gh-1">
                {[
                  { id: 'basic', label: 'Basic Info', completed: recipe.title && recipe.description },
                  { id: 'ingredients', label: 'Ingredients', completed: recipe.ingredients.some(i => i.name) },
                  { id: 'instructions', label: 'Instructions', completed: recipe.instructions.some(i => i.trim()) },
                  { id: 'details', label: 'Details & Tags', completed: recipe.cuisine || recipe.dietary.length > 0 }
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`w-full flex items-center gap-gh-3 px-gh-3 py-2 rounded-gh-sm text-sm transition-colors ${
                      activeSection === section.id
                        ? 'bg-gh-accent-subtle text-gh-accent-fg border border-gh-accent-muted'
                        : 'text-gh-fg-muted hover:text-gh-fg-default hover:bg-gh-canvas-subtle'
                    }`}
                  >
                    <div className={`${
                      activeSection === section.id ? 'text-gh-accent-fg' : 'text-gh-fg-muted'
                    }`}>
                      {getSectionIcon(section.id)}
                    </div>
                    <span className="flex-1 text-left">{section.label}</span>
                    {section.completed && (
                      <svg className="w-4 h-4 text-gh-success-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </nav>
              
              <div className="mt-gh-6 pt-gh-4 border-t border-gh-border-muted">
                <button
                  onClick={handleSave}
                  disabled={isSaving || !recipe.title || !recipe.ingredients.some(i => i.name)}
                  className="w-full bg-gh-accent-emphasis hover:bg-gh-accent-fg disabled:bg-gh-neutral-muted disabled:text-gh-fg-disabled text-gh-fg-onEmphasis px-gh-4 py-2 rounded-gh-sm font-medium transition-colors text-sm"
                >
                  {isSaving ? 'Saving...' : 'Save Recipe'}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-gh-canvas-default border border-gh-border-default rounded-gh-md">
              {/* Basic Info Section */}
              {activeSection === 'basic' && (
                <div className="p-gh-6">
                  <div className="flex items-center gap-gh-2 mb-gh-6">
                    {getSectionIcon('basic')}
                    <h2 className="text-lg font-semibold text-gh-fg-default">Basic Information</h2>
                  </div>
                  
                  <div className="space-y-gh-4">
                    <div>
                      <label className="block text-sm font-medium text-gh-fg-default mb-gh-2">
                        Recipe Title *
                      </label>
                      <input
                        type="text"
                        value={recipe.title}
                        onChange={(e) => setRecipe(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Grandmother's Chocolate Chip Cookies"
                        className="w-full px-gh-3 py-2 text-sm border border-gh-border-default rounded-gh-sm focus:outline-none focus:border-gh-accent-emphasis bg-gh-canvas-default transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gh-fg-default mb-gh-2">
                        Description
                      </label>
                      <textarea
                        value={recipe.description}
                        onChange={(e) => setRecipe(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of your recipe, what makes it special..."
                        rows={3}
                        className="w-full px-gh-3 py-2 text-sm border border-gh-border-default rounded-gh-sm focus:outline-none focus:border-gh-accent-emphasis bg-gh-canvas-default transition-colors resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-gh-4">
                      <div>
                        <label className="block text-sm font-medium text-gh-fg-default mb-gh-2">
                          Servings
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={recipe.servings}
                          onChange={(e) => setRecipe(prev => ({ ...prev, servings: parseInt(e.target.value) || 1 }))}
                          className="w-full px-gh-3 py-2 text-sm border border-gh-border-default rounded-gh-sm focus:outline-none focus:border-gh-accent-emphasis bg-gh-canvas-default transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gh-fg-default mb-gh-2">
                          Prep Time (min)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={recipe.prepTime}
                          onChange={(e) => setRecipe(prev => ({ ...prev, prepTime: parseInt(e.target.value) || 0 }))}
                          className="w-full px-gh-3 py-2 text-sm border border-gh-border-default rounded-gh-sm focus:outline-none focus:border-gh-accent-emphasis bg-gh-canvas-default transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gh-fg-default mb-gh-2">
                          Cook Time (min)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={recipe.cookTime}
                          onChange={(e) => setRecipe(prev => ({ ...prev, cookTime: parseInt(e.target.value) || 0 }))}
                          className="w-full px-gh-3 py-2 text-sm border border-gh-border-default rounded-gh-sm focus:outline-none focus:border-gh-accent-emphasis bg-gh-canvas-default transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gh-fg-default mb-gh-2">
                          Difficulty
                        </label>
                        <select
                          value={recipe.difficulty}
                          onChange={(e) => setRecipe(prev => ({ ...prev, difficulty: e.target.value as any }))}
                          className="w-full px-gh-3 py-2 text-sm border border-gh-border-default rounded-gh-sm focus:outline-none focus:border-gh-accent-emphasis bg-gh-canvas-default transition-colors"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Ingredients Section */}
              {activeSection === 'ingredients' && (
                <div className="p-gh-6">
                  <div className="flex items-center justify-between mb-gh-6">
                    <div className="flex items-center gap-gh-2">
                      {getSectionIcon('ingredients')}
                      <h2 className="text-lg font-semibold text-gh-fg-default">Ingredients</h2>
                      <div className="bg-gh-accent-subtle text-gh-accent-fg px-2 py-0.5 rounded-full text-xs font-medium">
                        Smart Linking
                      </div>
                    </div>
                    <button
                      onClick={addIngredient}
                      className="bg-gh-accent-emphasis hover:bg-gh-accent-fg text-gh-fg-onEmphasis px-gh-3 py-1.5 rounded-gh-sm text-sm font-medium transition-colors"
                    >
                      + Add Ingredient
                    </button>
                  </div>

                  <div className="space-y-gh-3">
                    {recipe.ingredients.map((ingredient, index) => (
                      <div key={ingredient.id} className="grid grid-cols-12 gap-gh-3 items-start">
                        <div className="col-span-2">
                          <input
                            type="text"
                            value={ingredient.amount}
                            onChange={(e) => updateIngredient(ingredient.id, 'amount', e.target.value)}
                            placeholder="1"
                            className="w-full px-gh-3 py-2 text-sm border border-gh-border-default rounded-gh-sm focus:outline-none focus:border-gh-accent-emphasis bg-gh-canvas-default transition-colors"
                          />
                        </div>
                        
                        <div className="col-span-2">
                          <select
                            value={ingredient.unit}
                            onChange={(e) => updateIngredient(ingredient.id, 'unit', e.target.value)}
                            className="w-full px-gh-3 py-2 text-sm border border-gh-border-default rounded-gh-sm focus:outline-none focus:border-gh-accent-emphasis bg-gh-canvas-default transition-colors"
                          >
                            {UNIT_OPTIONS.map(unit => (
                              <option key={unit} value={unit}>{unit}</option>
                            ))}
                          </select>
                        </div>

                        <div className="col-span-6 relative">
                          <input
                            type="text"
                            value={ingredient.name}
                            onChange={(e) => updateIngredient(ingredient.id, 'name', e.target.value)}
                            placeholder="e.g., all-purpose flour"
                            className="w-full px-gh-3 py-2 text-sm border border-gh-border-default rounded-gh-sm focus:outline-none focus:border-gh-accent-emphasis bg-gh-canvas-default transition-colors pr-8"
                          />
                          {ingredient.name && (
                            <button
                              onClick={() => setShowProductSuggestions(showProductSuggestions === ingredient.id ? null : ingredient.id)}
                              className="absolute right-2 top-2 text-gh-accent-fg hover:text-gh-accent-emphasis transition-colors"
                              title="Find matching products"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </button>
                          )}
                        </div>

                        <div className="col-span-2 flex gap-gh-1">
                          {index > 0 && (
                            <button
                              onClick={() => removeIngredient(ingredient.id)}
                              className="text-gh-danger-fg hover:text-gh-danger-emphasis p-1 rounded-gh-sm transition-colors"
                              title="Remove ingredient"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>

                        {/* Product Suggestions */}
                        {showProductSuggestions === ingredient.id && (
                          <div className="col-span-12 bg-gh-canvas-subtle border border-gh-border-muted rounded-gh-sm p-gh-3 mt-gh-2">
                            <div className="flex items-center gap-gh-2 mb-gh-3">
                              <svg className="w-4 h-4 text-gh-accent-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                              </svg>
                              <span className="text-sm font-medium text-gh-fg-default">Suggested Products</span>
                            </div>
                            <div className="space-y-2">
                              {/* Mock product suggestions */}
                              <div className="flex items-center justify-between p-2 bg-gh-canvas-default rounded-gh-sm border border-gh-border-default hover:border-gh-accent-muted transition-colors cursor-pointer">
                                <div>
                                  <div className="text-sm font-medium text-gh-fg-default">King Arthur All-Purpose Flour</div>
                                  <div className="text-xs text-gh-fg-muted">5 lb bag • Available at Kroger, Instacart</div>
                                </div>
                                <div className="text-sm font-medium text-gh-success-fg">$4.99</div>
                              </div>
                              <div className="flex items-center justify-between p-2 bg-gh-canvas-default rounded-gh-sm border border-gh-border-default hover:border-gh-accent-muted transition-colors cursor-pointer">
                                <div>
                                  <div className="text-sm font-medium text-gh-fg-default">Gold Medal All-Purpose Flour</div>
                                  <div className="text-xs text-gh-fg-muted">5 lb bag • Available at Walmart, Target</div>
                                </div>
                                <div className="text-sm font-medium text-gh-success-fg">$3.49</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-gh-6 p-gh-4 bg-gh-attention-subtle border border-gh-attention-muted rounded-gh-sm">
                    <div className="flex items-start gap-gh-2">
                      <svg className="w-4 h-4 text-gh-attention-fg mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gh-attention-fg">Smart Product Linking</p>
                        <p className="text-xs text-gh-fg-muted mt-1">
                          As you add ingredients, we&apos;ll automatically suggest matching products from major grocery stores. This enables seamless shopping list generation with real prices and availability.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Instructions Section */}
              {activeSection === 'instructions' && (
                <div className="p-gh-6">
                  <div className="flex items-center justify-between mb-gh-6">
                    <div className="flex items-center gap-gh-2">
                      {getSectionIcon('instructions')}
                      <h2 className="text-lg font-semibold text-gh-fg-default">Instructions</h2>
                    </div>
                    <button
                      onClick={addInstruction}
                      className="bg-gh-accent-emphasis hover:bg-gh-accent-fg text-gh-fg-onEmphasis px-gh-3 py-1.5 rounded-gh-sm text-sm font-medium transition-colors"
                    >
                      + Add Step
                    </button>
                  </div>

                  <div className="space-y-gh-4">
                    {recipe.instructions.map((instruction, index) => (
                      <div key={index} className="flex gap-gh-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-gh-accent-subtle text-gh-accent-fg rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <textarea
                            value={instruction}
                            onChange={(e) => updateInstruction(index, e.target.value)}
                            placeholder={`Step ${index + 1}: Describe what to do in this step...`}
                            rows={2}
                            className="w-full px-gh-3 py-2 text-sm border border-gh-border-default rounded-gh-sm focus:outline-none focus:border-gh-accent-emphasis bg-gh-canvas-default transition-colors resize-none"
                          />
                        </div>
                        {recipe.instructions.length > 1 && (
                          <button
                            onClick={() => removeInstruction(index)}
                            className="flex-shrink-0 text-gh-danger-fg hover:text-gh-danger-emphasis p-1 rounded-gh-sm transition-colors"
                            title="Remove step"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-gh-6">
                    <label className="block text-sm font-medium text-gh-fg-default mb-gh-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={recipe.notes}
                      onChange={(e) => setRecipe(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Any additional tips, variations, or storage instructions..."
                      rows={3}
                      className="w-full px-gh-3 py-2 text-sm border border-gh-border-default rounded-gh-sm focus:outline-none focus:border-gh-accent-emphasis bg-gh-canvas-default transition-colors resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Details Section */}
              {activeSection === 'details' && (
                <div className="p-gh-6">
                  <div className="flex items-center gap-gh-2 mb-gh-6">
                    {getSectionIcon('details')}
                    <h2 className="text-lg font-semibold text-gh-fg-default">Details & Tags</h2>
                  </div>

                  <div className="space-y-gh-6">
                    <div>
                      <label className="block text-sm font-medium text-gh-fg-default mb-gh-3">
                        Cuisine Type
                      </label>
                      <select
                        value={recipe.cuisine}
                        onChange={(e) => setRecipe(prev => ({ ...prev, cuisine: e.target.value }))}
                        className="w-full md:w-1/2 px-gh-3 py-2 text-sm border border-gh-border-default rounded-gh-sm focus:outline-none focus:border-gh-accent-emphasis bg-gh-canvas-default transition-colors"
                      >
                        <option value="">Select cuisine type</option>
                        {CUISINE_OPTIONS.map(cuisine => (
                          <option key={cuisine} value={cuisine}>{cuisine}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gh-fg-default mb-gh-3">
                        Dietary Restrictions
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-gh-2">
                        {DIETARY_OPTIONS.map(option => (
                          <label key={option} className="flex items-center gap-gh-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={recipe.dietary.includes(option)}
                              onChange={() => toggleDietary(option)}
                              className="rounded border-gh-border-default text-gh-accent-emphasis focus:ring-gh-accent-emphasis focus:ring-offset-0"
                            />
                            <span className="text-sm text-gh-fg-default">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gh-fg-default mb-gh-3">
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-gh-2 mb-gh-3">
                        {recipe.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-gh-1 bg-gh-neutral-muted text-gh-fg-default px-2 py-1 rounded-full text-xs"
                          >
                            {tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className="text-gh-fg-muted hover:text-gh-danger-fg transition-colors"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-gh-2">
                        <input
                          type="text"
                          placeholder="Add a tag (e.g., quick, family-friendly, comfort-food)"
                          className="flex-1 px-gh-3 py-2 text-sm border border-gh-border-default rounded-gh-sm focus:outline-none focus:border-gh-accent-emphasis bg-gh-canvas-default transition-colors"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              addTag(e.currentTarget.value)
                              e.currentTarget.value = ''
                            }
                          }}
                        />
                        <button
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement
                            addTag(input.value)
                            input.value = ''
                          }}
                          className="bg-gh-accent-emphasis hover:bg-gh-accent-fg text-gh-fg-onEmphasis px-gh-3 py-2 rounded-gh-sm text-sm transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}