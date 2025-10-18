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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Build Product-Based Meal</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Meal Templates */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Quick Start Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {mealTemplates.map(template => (
              <button
                key={template.id}
                onClick={() => loadMealTemplate(template)}
                className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-left"
              >
                <div className="font-medium">{template.name}</div>
                <div className="text-sm text-gray-600">{template.prepTime}</div>
                <div className="text-sm font-medium text-green-600">
                  ~${template.estimatedTotal.toFixed(2)}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Meal Info & Selected Products */}
          <div>
            {/* Meal Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Meal Information</h3>
              <input
                type="text"
                placeholder="Meal name (e.g., 'Mac & Cheese Dinner')"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-3"
              />
              <textarea
                placeholder="Description (optional)"
                value={mealDescription}
                onChange={(e) => setMealDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg h-20"
              />
            </div>

            {/* Selected Products */}
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Selected Products ({selectedProducts.length})
              </h3>
              {selectedProducts.length === 0 ? (
                <p className="text-gray-500 italic">No products selected yet</p>
              ) : (
                <div className="space-y-3">
                  {selectedProducts.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{item.product.name}</div>
                        {item.product.brand && (
                          <div className="text-sm text-gray-600">{item.product.brand}</div>
                        )}
                        <div className="text-sm text-green-600">
                          ${item.product.estimatedPrice?.toFixed(2)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={item.quantity}
                          onChange={(e) => updateProductQuantity(item.product.id, parseFloat(e.target.value) || 1)}
                          className="w-16 p-1 border border-gray-300 rounded text-center"
                        />
                        <select
                          value={item.unit}
                          onChange={(e) => updateProductUnit(item.product.id, e.target.value)}
                          className="p-1 border border-gray-300 rounded"
                        >
                          {item.product.commonUnits.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => removeProduct(item.product.id)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="pt-3 border-t">
                    <div className="text-lg font-semibold">
                      Estimated Total: ${calculateTotal().toFixed(2)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Product Search */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Add Products</h3>
            
            {/* Search */}
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-3"
            />

            {/* Category Filter */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => handleCategoryFilter(category)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedCategory === category
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category === 'all' ? 'All' : category}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Results */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {searchResults.length === 0 && searchQuery.length >= 2 && (
                <p className="text-gray-500 italic">No products found</p>
              )}
              {searchResults.length === 0 && searchQuery.length < 2 && selectedCategory === 'all' && (
                <p className="text-gray-500 italic">Start typing to search or select a category</p>
              )}
              {searchResults.map(product => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="font-medium">{product.name}</div>
                    {product.brand && (
                      <div className="text-sm text-gray-600">{product.brand}</div>
                    )}
                    <div className="text-sm text-gray-500">{product.category}</div>
                    <div className="text-sm text-green-600">
                      ${product.estimatedPrice.toFixed(2)}
                    </div>
                  </div>
                  <button
                    onClick={() => addProduct(product)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!mealName.trim() || selectedProducts.length === 0}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Meal
          </button>
        </div>
      </div>
    </div>
  )
}