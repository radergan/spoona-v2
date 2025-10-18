'use client'

import { useState } from 'react'
import { productDatabase, searchProducts, mealTemplates, ProductItem } from '@/data/products'

interface SelectedProduct {
  product: ProductItem
  quantity: number
  unit: string
}

interface ProductMealBuilderProps {
  onSave: (meal: {
    name: string
    description: string
    type: 'product-based'
    items: Array<{
      name: string
      brand?: string
      category: string
      quantity: number
      unit: string
      instacartSearchTerm: string
      upc?: string
      estimatedPrice?: number
    }>
    estimatedTotal: number
  }) => void
  onCancel: () => void
}

export function ProductMealBuilder({ onSave, onCancel }: ProductMealBuilderProps) {
  const [mealName, setMealName] = useState('')
  const [mealDescription, setMealDescription] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<ProductItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = ['all', 'Frozen', 'Pantry', 'Dairy', 'Meat', 'Produce', 'Snacks', 'Beverages']

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.length >= 2) {
      const results = searchProducts(query)
      setSearchResults(results.slice(0, 10)) // Limit to 10 results
    } else {
      setSearchResults([])
    }
  }

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category)
    if (category === 'all') {
      setSearchResults(productDatabase.slice(0, 20))
    } else {
      const filtered = productDatabase.filter(p => p.category === category)
      setSearchResults(filtered)
    }
  }

  const addProduct = (product: ProductItem) => {
    const existing = selectedProducts.find(p => p.product.id === product.id)
    if (existing) {
      // Increase quantity if already added
      setSelectedProducts(prev =>
        prev.map(p =>
          p.product.id === product.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        )
      )
    } else {
      // Add new product with default quantity and unit
      setSelectedProducts(prev => [
        ...prev,
        {
          product,
          quantity: 1,
          unit: product.commonUnits[0] || 'each'
        }
      ])
    }
  }

  const removeProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.product.id !== productId))
  }

  const updateProductQuantity = (productId: string, quantity: number) => {
    setSelectedProducts(prev =>
      prev.map(p =>
        p.product.id === productId ? { ...p, quantity } : p
      )
    )
  }

  const updateProductUnit = (productId: string, unit: string) => {
    setSelectedProducts(prev =>
      prev.map(p =>
        p.product.id === productId ? { ...p, unit } : p
      )
    )
  }

  const loadMealTemplate = (template: typeof mealTemplates[0]) => {
    setMealName(template.name)
    setMealDescription(`${template.prepTime} prep time`)
    
    const templateProducts: SelectedProduct[] = template.products.map(tp => {
      const product = productDatabase.find(p => p.id === tp.productId)!
      return {
        product,
        quantity: tp.quantity,
        unit: tp.unit
      }
    })
    
    setSelectedProducts(templateProducts)
  }

  const calculateTotal = () => {
    return selectedProducts.reduce((total, item) => {
      return total + (item.product.estimatedPrice * item.quantity)
    }, 0)
  }

  const handleSave = () => {
    if (!mealName.trim() || selectedProducts.length === 0) {
      alert('Please add a meal name and at least one product')
      return
    }

    const mealData = {
      name: mealName,
      description: mealDescription,
      type: 'product-based' as const,
      items: selectedProducts.map(sp => ({
        name: sp.product.name,
        brand: sp.product.brand,
        category: sp.product.category,
        quantity: sp.quantity,
        unit: sp.unit,
        instacartSearchTerm: sp.product.instacartSearchTerm,
        upc: sp.product.upc,
        estimatedPrice: sp.product.estimatedPrice
      })),
      estimatedTotal: calculateTotal()
    }

    onSave(mealData)
  }

  return (
    <div className="fixed inset-0 bg-gh-neutral-emphasis/50 flex items-center justify-center z-50 p-gh-4">
      <div className="bg-gh-canvas-default border border-gh-border-default rounded-gh-md shadow-gh-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-gh-4 border-b border-gh-border-muted">
          <h2 className="text-xl font-semibold text-gh-fg-default">Build Product-Based Meal</h2>
          <button
            onClick={onCancel}
            className="p-gh-2 text-gh-fg-muted hover:text-gh-fg-default hover:bg-gh-neutral-muted rounded-gh-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-gh-4">
          {/* Meal Templates */}
          <div className="mb-gh-6">
            <h3 className="text-base font-semibold text-gh-fg-default mb-gh-3">Quick Start Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gh-3">
              {mealTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => loadMealTemplate(template)}
                  className="p-gh-3 border border-gh-border-default rounded-gh-sm hover:bg-gh-canvas-subtle hover:border-gh-border-muted text-left transition-colors"
                >
                  <div className="font-medium text-gh-fg-default text-sm">{template.name}</div>
                  <div className="text-xs text-gh-fg-muted mt-1">{template.prepTime}</div>
                  <div className="text-xs font-medium text-gh-success-fg mt-1">
                    ~${template.estimatedTotal.toFixed(2)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gh-6">
            {/* Left Column: Meal Info & Selected Products */}
            <div>
              {/* Meal Information */}
              <div className="mb-gh-6">
                <h3 className="text-base font-semibold text-gh-fg-default mb-gh-3">Meal Information</h3>
                <input
                  type="text"
                  placeholder="Meal name (e.g., 'Mac & Cheese Dinner')"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  className="w-full p-gh-2 text-sm border border-gh-border-default rounded-gh-sm mb-gh-3 focus:outline-none focus:border-gh-accent-emphasis bg-gh-canvas-default transition-colors"
                />
                <textarea
                  placeholder="Description (optional)"
                  value={mealDescription}
                  onChange={(e) => setMealDescription(e.target.value)}
                  className="w-full p-gh-2 text-sm border border-gh-border-default rounded-gh-sm h-16 focus:outline-none focus:border-gh-accent-emphasis bg-gh-canvas-default transition-colors resize-none"
                />
              </div>

              {/* Selected Products */}
              <div>
                <h3 className="text-base font-semibold text-gh-fg-default mb-gh-3">
                  Selected Products ({selectedProducts.length})
                </h3>
                {selectedProducts.length === 0 ? (
                  <div className="p-gh-4 text-center border border-gh-border-default rounded-gh-sm bg-gh-canvas-subtle">
                    <p className="text-gh-fg-muted text-sm">No products selected yet</p>
                  </div>
                ) : (
                  <div className="space-y-gh-2">
                    {selectedProducts.map((item) => (
                      <div key={item.product.id} className="flex items-center justify-between p-gh-3 bg-gh-canvas-subtle border border-gh-border-muted rounded-gh-sm">
                        <div className="flex-1">
                          <div className="font-medium text-gh-fg-default text-sm">{item.product.name}</div>
                          {item.product.brand && (
                            <div className="text-xs text-gh-fg-muted">{item.product.brand}</div>
                          )}
                          <div className="text-xs text-gh-success-fg font-medium">
                            ${item.product.estimatedPrice?.toFixed(2)}
                          </div>
                        </div>
                        <div className="flex items-center space-x-gh-2">
                          <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            value={item.quantity}
                            onChange={(e) => updateProductQuantity(item.product.id, parseFloat(e.target.value) || 1)}
                            className="w-16 p-1 text-xs border border-gh-border-default rounded-gh-sm text-center focus:outline-none focus:border-gh-accent-emphasis bg-gh-canvas-default"
                          />
                          <select
                            value={item.unit}
                            onChange={(e) => updateProductUnit(item.product.id, e.target.value)}
                            className="p-1 text-xs border border-gh-border-default rounded-gh-sm focus:outline-none focus:border-gh-accent-emphasis bg-gh-canvas-default"
                          >
                            {item.product.commonUnits.map(unit => (
                              <option key={unit} value={unit}>{unit}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => removeProduct(item.product.id)}
                            className="text-gh-danger-fg hover:text-gh-danger-emphasis text-xs px-gh-2 py-1 border border-gh-danger-muted rounded-gh-sm hover:bg-gh-danger-subtle transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="pt-gh-3 border-t border-gh-border-muted">
                      <div className="text-base font-semibold text-gh-fg-default">
                        Estimated Total: <span className="text-gh-success-fg">${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Product Search */}
            <div>
              <h3 className="text-base font-semibold text-gh-fg-default mb-gh-3">Add Products</h3>
              
              {/* Search */}
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full p-gh-2 text-sm border border-gh-border-default rounded-gh-sm mb-gh-3 focus:outline-none focus:border-gh-accent-emphasis bg-gh-canvas-default transition-colors"
              />

              {/* Category Filter */}
              <div className="mb-gh-4">
                <div className="flex flex-wrap gap-gh-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => handleCategoryFilter(category)}
                      className={`px-gh-2 py-1 rounded-full text-xs transition-colors ${
                        selectedCategory === category
                          ? 'bg-gh-accent-emphasis text-gh-fg-onEmphasis'
                          : 'bg-gh-neutral-muted text-gh-fg-default hover:bg-gh-neutral-emphasis'
                      }`}
                    >
                      {category === 'all' ? 'All' : category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Results */}
              <div className="space-y-gh-2 max-h-96 overflow-y-auto">
                {searchResults.length === 0 && searchQuery.length >= 2 && (
                  <p className="text-gh-fg-muted text-sm p-gh-3 text-center">No products found</p>
                )}
                {searchResults.length === 0 && searchQuery.length < 2 && selectedCategory === 'all' && (
                  <p className="text-gh-fg-muted text-sm p-gh-3 text-center">Start typing to search or select a category</p>
                )}
                {searchResults.map(product => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-gh-3 border border-gh-border-default rounded-gh-sm hover:bg-gh-canvas-subtle transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gh-fg-default">{product.name}</div>
                      {product.brand && (
                        <div className="text-xs text-gh-fg-muted">{product.brand}</div>
                      )}
                      <div className="text-xs text-gh-fg-muted">{product.category}</div>
                      <div className="text-xs text-gh-success-fg font-medium">
                        ${product.estimatedPrice.toFixed(2)}
                      </div>
                    </div>
                    <button
                      onClick={() => addProduct(product)}
                      className="px-gh-3 py-1 bg-gh-accent-emphasis text-gh-fg-onEmphasis rounded-gh-sm hover:bg-gh-accent-fg text-sm transition-colors"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-gh-3 mt-gh-6 pt-gh-4 border-t border-gh-border-muted">
            <button
              onClick={onCancel}
              className="px-gh-4 py-2 border border-gh-border-default rounded-gh-sm hover:bg-gh-canvas-subtle text-gh-fg-default text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!mealName.trim() || selectedProducts.length === 0}
              className="px-gh-4 py-2 bg-gh-accent-emphasis text-gh-fg-onEmphasis rounded-gh-sm hover:bg-gh-accent-fg disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
            >
              Save Meal
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}