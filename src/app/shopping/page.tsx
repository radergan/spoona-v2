'use client'

import { MainNavigation } from '@/components/MainNavigation'

export default function ShoppingPage() {
  // Sample shopping list data
  const sampleShoppingList = [
    { id: 1, name: 'Chicken Breast', category: 'Meat & Seafood', quantity: '2 lbs', checked: false, price: 12.99 },
    { id: 2, name: 'Pasta Sauce', category: 'Pantry', quantity: '1 jar', checked: true, price: 3.49 },
    { id: 3, name: 'Mozzarella Cheese', category: 'Dairy', quantity: '8 oz', checked: false, price: 4.29 },
    { id: 4, name: 'Bell Peppers', category: 'Produce', quantity: '3 pieces', checked: false, price: 2.97 },
    { id: 5, name: 'Onions', category: 'Produce', quantity: '2 lbs', checked: true, price: 1.99 },
    { id: 6, name: 'Garlic', category: 'Produce', quantity: '1 bulb', checked: false, price: 0.89 },
    { id: 7, name: 'Olive Oil', category: 'Pantry', quantity: '1 bottle', checked: false, price: 6.99 },
    { id: 8, name: 'Bread Crumbs', category: 'Pantry', quantity: '1 container', checked: false, price: 2.79 }
  ]

  const categories = Array.from(new Set(sampleShoppingList.map(item => item.category)))
  const totalItems = sampleShoppingList.length
  const checkedItems = sampleShoppingList.filter(item => item.checked).length
  const totalCost = sampleShoppingList.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="min-h-screen bg-gh-canvas-inset">
      <MainNavigation />
      
      <main className="container mx-auto px-gh-6 py-gh-6">
        <div className="flex justify-between items-start mb-gh-6">
          <div>
            <h1 className="text-2xl font-semibold text-gh-fg-default mb-gh-2">Shopping Lists</h1>
            <p className="text-gh-fg-muted">Manage your shopping lists and order through Instacart</p>
          </div>
          <div className="flex gap-gh-2">
            <button className="bg-gh-canvas-default border border-gh-border-default hover:bg-gh-canvas-subtle text-gh-fg-default px-gh-3 py-1.5 rounded-gh-sm text-sm font-medium transition-colors">
              New List
            </button>
            <button className="bg-gh-success-emphasis hover:bg-gh-success-fg text-gh-fg-onEmphasis px-gh-4 py-1.5 rounded-gh-sm text-sm font-medium transition-colors">
              Order with Instacart
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-gh-6">
          {/* Shopping List */}
          <div className="lg:col-span-2">
            <div className="bg-gh-canvas-default border border-gh-border-default rounded-gh-md shadow-gh-sm">
              <div className="p-gh-4 border-b border-gh-border-muted">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gh-fg-default">This Week&apos;s Shopping List</h2>
                  <div className="text-sm text-gh-fg-muted">
                    {checkedItems} of {totalItems} items
                  </div>
                </div>
                <div className="mt-gh-2 bg-gh-neutral-muted rounded-full h-2">
                  <div 
                    className="bg-gh-success-emphasis h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(checkedItems / totalItems) * 100}%` }}
                  ></div>
                </div>
              </div>

              {categories.map(category => {
                const categoryItems = sampleShoppingList.filter(item => item.category === category)
                
                return (
                  <div key={category} className="border-b border-gh-border-muted last:border-b-0">
                    <div className="p-gh-3 bg-gh-canvas-subtle">
                      <h3 className="font-medium text-gh-fg-default text-sm">{category}</h3>
                    </div>
                    <div className="divide-y divide-gh-border-subtle">
                      {categoryItems.map(item => (
                        <div key={item.id} className={`p-gh-3 flex items-center gap-gh-3 hover:bg-gh-canvas-subtle transition-colors ${item.checked ? 'opacity-60' : ''}`}>
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => {}}
                            className="w-4 h-4 text-gh-success-emphasis rounded focus:ring-gh-success-emphasis border-gh-border-default"
                          />
                          <div className="flex-1">
                            <div className={`font-medium text-sm ${item.checked ? 'line-through text-gh-fg-muted' : 'text-gh-fg-default'}`}>
                              {item.name}
                            </div>
                            <div className="text-xs text-gh-fg-muted">{item.quantity}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gh-fg-default text-sm">${item.price.toFixed(2)}</div>
                          </div>
                          <button className="text-gh-fg-muted hover:text-gh-danger-fg transition-colors p-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}

              {/* Add Item */}
              <div className="p-gh-3 border-t border-gh-border-muted">
                <div className="flex gap-gh-2">
                  <input
                    type="text"
                    placeholder="Add new item..."
                    className="flex-1 px-gh-3 py-2 text-sm border border-gh-border-default rounded-gh-sm focus:outline-none focus:border-gh-accent-emphasis bg-gh-canvas-default transition-colors"
                  />
                  <button className="bg-gh-accent-emphasis hover:bg-gh-accent-fg text-gh-fg-onEmphasis px-gh-4 py-2 rounded-gh-sm text-sm font-medium transition-colors">
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-gh-4">
            {/* Summary */}
            <div className="bg-gh-canvas-default border border-gh-border-default rounded-gh-md p-gh-4 shadow-gh-sm">
              <h3 className="text-base font-semibold text-gh-fg-default mb-gh-4">Summary</h3>
              <div className="space-y-gh-3">
                <div className="flex justify-between">
                  <span className="text-gh-fg-muted text-sm">Total Items:</span>
                  <span className="font-medium text-gh-fg-default text-sm">{totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gh-fg-muted text-sm">Completed:</span>
                  <span className="font-medium text-gh-success-fg text-sm">{checkedItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gh-fg-muted text-sm">Remaining:</span>
                  <span className="font-medium text-gh-severe-fg text-sm">{totalItems - checkedItems}</span>
                </div>
                <div className="border-t border-gh-border-muted pt-gh-3 mt-gh-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gh-fg-default">Estimated Total:</span>
                    <span className="font-bold text-gh-success-fg">${totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Instacart Integration */}
            <div className="bg-gh-canvas-default border border-gh-border-default rounded-gh-md p-gh-4 shadow-gh-sm">
              <h3 className="text-base font-semibold text-gh-fg-default mb-gh-4">Instacart Delivery</h3>
              <div className="space-y-gh-3">
                <div className="text-sm text-gh-fg-muted">
                  Order your groceries for delivery or pickup from your favorite local stores.
                </div>
                <div className="space-y-gh-2">
                  <div className="text-sm">
                    <span className="font-medium text-gh-fg-default">Delivery:</span> <span className="text-gh-fg-muted">As soon as 30 min</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gh-fg-default">Pickup:</span> <span className="text-gh-fg-muted">As soon as 15 min</span>
                  </div>
                </div>
                <button className="w-full bg-gh-success-emphasis hover:bg-gh-success-fg text-gh-fg-onEmphasis py-2 px-gh-3 rounded-gh-sm text-sm font-medium transition-colors">
                  Order with Instacart
                </button>
                <div className="text-xs text-gh-fg-muted text-center">
                  Powered by Instacart API
                </div>
              </div>
            </div>

            {/* Recent Lists */}
            <div className="bg-gh-canvas-default border border-gh-border-default rounded-gh-md p-gh-4 shadow-gh-sm">
              <h3 className="text-base font-semibold text-gh-fg-default mb-gh-4">Recent Lists</h3>
              <div className="space-y-gh-2">
                <div className="flex justify-between items-center p-gh-2 bg-gh-canvas-subtle rounded-gh-sm">
                  <div>
                    <div className="font-medium text-sm text-gh-fg-default">Weekly Groceries</div>
                    <div className="text-xs text-gh-fg-muted">Oct 14, 2025</div>
                  </div>
                  <span className="text-xs text-gh-success-fg font-medium">Completed</span>
                </div>
                <div className="flex justify-between items-center p-gh-2 bg-gh-canvas-subtle rounded-gh-sm">
                  <div>
                    <div className="font-medium text-sm text-gh-fg-default">Party Supplies</div>
                    <div className="text-xs text-gh-fg-muted">Oct 10, 2025</div>
                  </div>
                  <span className="text-xs text-gh-success-fg font-medium">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}