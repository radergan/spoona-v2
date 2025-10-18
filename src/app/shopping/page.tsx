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
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Lists</h1>
            <p className="text-gray-600">Manage your shopping lists and order through Instacart</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
              📋 New List
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              🛒 Order with Instacart
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Shopping List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">This Week&apos;s Shopping List</h2>
                  <div className="text-sm text-gray-500">
                    {checkedItems} of {totalItems} items
                  </div>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(checkedItems / totalItems) * 100}%` }}
                  ></div>
                </div>
              </div>

              {categories.map(category => {
                const categoryItems = sampleShoppingList.filter(item => item.category === category)
                
                return (
                  <div key={category} className="border-b border-gray-200 last:border-b-0">
                    <div className="p-4 bg-gray-50">
                      <h3 className="font-medium text-gray-700">{category}</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {categoryItems.map(item => (
                        <div key={item.id} className={`p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors ${item.checked ? 'opacity-60' : ''}`}>
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => {}}
                            className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                          />
                          <div className="flex-1">
                            <div className={`font-medium ${item.checked ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {item.name}
                            </div>
                            <div className="text-sm text-gray-500">{item.quantity}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">${item.price.toFixed(2)}</div>
                          </div>
                          <button className="text-gray-400 hover:text-red-500 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Add new item..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-medium transition-colors">
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Items:</span>
                  <span className="font-medium">{totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-medium text-green-600">{checkedItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining:</span>
                  <span className="font-medium text-orange-600">{totalItems - checkedItems}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Estimated Total:</span>
                    <span className="font-bold text-green-600">${totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Instacart Integration */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">🛒 Instacart Delivery</h3>
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  Order your groceries for delivery or pickup from your favorite local stores.
                </div>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Delivery:</span> As soon as 30 min
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Pickup:</span> As soon as 15 min
                  </div>
                </div>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium transition-colors">
                  Order with Instacart
                </button>
                <div className="text-xs text-gray-500 text-center">
                  Powered by Instacart API
                </div>
              </div>
            </div>

            {/* Recent Lists */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Lists</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div>
                    <div className="font-medium text-sm">Weekly Groceries</div>
                    <div className="text-xs text-gray-500">Oct 14, 2025</div>
                  </div>
                  <span className="text-xs text-green-600">Completed</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div>
                    <div className="font-medium text-sm">Party Supplies</div>
                    <div className="text-xs text-gray-500">Oct 10, 2025</div>
                  </div>
                  <span className="text-xs text-green-600">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}