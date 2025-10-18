'use client'

import { useState } from 'react'

interface InstacartProduct {
  id: string
  name: string
  brand?: string
  category: string
  price?: number
  image?: string
}

interface MealBuilderProps {
  onSave: (meal: { name: string; description: string; items: any[] }) => void
  onCancel: () => void
}

export function MealBuilder({ onSave, onCancel }: MealBuilderProps) {
  const [mealName, setMealName] = useState('')
  const [mealDescription, setMealDescription] = useState('')
  const [selectedItems, setSelectedItems] = useState<Array<{ product: InstacartProduct; amount: string }>>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<InstacartProduct[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Real Instacart API search
  const searchInstacartProducts = async (query: string): Promise<InstacartProduct[]> => {
    try {
      const response = await fetch('/api/instacart/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error('Failed to search products')
      }

      const data = await response.json()
      return data.products || []
    } catch (error) {
      console.error('Instacart search error:', error)
      
      // Fallback to mock data if API fails
      const mockProducts: InstacartProduct[] = [
        { id: '1', name: 'Organic Chicken Breast', brand: 'Bell & Evans', category: 'Meat & Seafood', price: 8.99 },
        { id: '2', name: 'Roma Tomatoes', category: 'Produce', price: 2.49 },
        { id: '3', name: 'Fresh Basil', category: 'Produce', price: 2.99 },
        { id: '4', name: 'Mozzarella Cheese', brand: 'Galbani', category: 'Dairy', price: 4.29 },
        { id: '5', name: 'Olive Oil', brand: 'Bertolli', category: 'Pantry', price: 6.99 },
        { id: '6', name: 'Yellow Onion', category: 'Produce', price: 1.29 },
        { id: '7', name: 'Garlic Cloves', category: 'Produce', price: 0.89 },
        { id: '8', name: 'Bell Peppers', category: 'Produce', price: 2.97 },
        { id: '9', name: 'Apple', category: 'Produce', price: 1.99 },
        { id: '10', name: 'Green Apple', brand: 'Granny Smith', category: 'Produce', price: 2.29 },
        { id: '11', name: 'Red Apple', brand: 'Gala', category: 'Produce', price: 2.19 },
      ]

      return mockProducts.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        (product.brand && product.brand.toLowerCase().includes(query.toLowerCase()))
      )
    }
  }

  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const results = await searchInstacartProducts(query)
      setSearchResults(results)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const addItem = (product: InstacartProduct) => {
    setSelectedItems(prev => [...prev, { product, amount: '1' }])
    setSearchQuery('')
    setSearchResults([])
  }

  const removeItem = (index: number) => {
    setSelectedItems(prev => prev.filter((_, i) => i !== index))
  }

  const updateItemAmount = (index: number, amount: string) => {
    setSelectedItems(prev => prev.map((item, i) => 
      i === index ? { ...item, amount } : item
    ))
  }

  const handleSave = () => {
    if (!mealName.trim()) {
      alert('Please enter a meal name')
      return
    }

    if (selectedItems.length === 0) {
      alert('Please add at least one item')
      return
    }

    onSave({
      name: mealName,
      description: mealDescription,
      items: selectedItems.map(item => ({
        name: item.product.name,
        amount: item.amount,
        instacartId: item.product.id,
        category: item.product.category,
        price: item.product.price
      }))
    })

    // Reset form
    setMealName('')
    setMealDescription('')
    setSelectedItems([])
  }

  const totalCost = selectedItems.reduce((sum, item) => sum + (item.product.price || 0), 0)

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto max-h-[90vh] overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-orange-50">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Build Custom Meal</h2>
        <p className="text-gray-600">Create a meal from individual ingredients and products</p>
      </div>

      <div className="flex flex-col lg:flex-row h-full">
        {/* Left Side - Product Search */}
        <div className="lg:w-1/2 p-6 border-r border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Find Ingredients</h3>
          
          {/* Search Input */}
          <div className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                handleSearch(e.target.value)
              }}
              placeholder="Search for ingredients, products, brands..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            {isSearching && (
              <div className="absolute right-3 top-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
              </div>
            )}
          </div>

          {/* Search Results */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {searchResults.map((product) => (
              <div
                key={product.id}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => addItem(product)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{product.name}</div>
                    {product.brand && (
                      <div className="text-sm text-gray-500">{product.brand}</div>
                    )}
                    <div className="text-sm text-orange-600">{product.category}</div>
                  </div>
                  <div className="text-right">
                    {product.price && (
                      <div className="font-semibold text-green-600">${product.price.toFixed(2)}</div>
                    )}
                    <button className="text-xs bg-orange-500 text-white px-2 py-1 rounded mt-1 hover:bg-orange-600 transition-colors">
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
              <div className="text-center py-8 text-gray-500">
                <p>No products found for &quot;{searchQuery}&quot;</p>
              </div>
            )}
            
            {searchQuery.length < 2 && (
              <div className="text-center py-8 text-gray-400">
                <p>Start typing to search for ingredients...</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Meal Builder */}
        <div className="lg:w-1/2 p-6">
          <h3 className="text-lg font-semibold mb-4">Your Custom Meal</h3>
          
          {/* Meal Info */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meal Name *
              </label>
              <input
                type="text"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                placeholder="e.g., Chicken Caprese Bowl"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                value={mealDescription}
                onChange={(e) => setMealDescription(e.target.value)}
                placeholder="Brief description of your custom meal..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Selected Items */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-3">
              Selected Items ({selectedItems.length})
            </h4>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {selectedItems.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.product.name}</div>
                    <div className="text-xs text-gray-500">{item.product.category}</div>
                  </div>
                  
                  <input
                    type="text"
                    value={item.amount}
                    onChange={(e) => updateItemAmount(index, e.target.value)}
                    placeholder="Amount"
                    className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500"
                  />
                  
                  {item.product.price && (
                    <div className="text-sm font-medium text-green-600">
                      ${item.product.price.toFixed(2)}
                    </div>
                  )}
                  
                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
              
              {selectedItems.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p>No items added yet</p>
                  <p className="text-sm">Search and add ingredients above</p>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          {selectedItems.length > 0 && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Estimated Total:</span>
                <span className="font-bold text-green-600 text-lg">
                  ${totalCost.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!mealName.trim() || selectedItems.length === 0}
              className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white rounded-md font-medium transition-colors"
            >
              Save Meal
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}