import { NextRequest, NextResponse } from 'next/server'

interface MealPlanItem {
  id: string
  name: string
  type: 'recipe' | 'product-based' | 'mixed'
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
}

export async function POST(request: NextRequest) {
  try {
    const { mealPlanItems, weekStart } = await request.json()

    if (!mealPlanItems || !Array.isArray(mealPlanItems)) {
      return NextResponse.json({ error: 'Invalid meal plan items' }, { status: 400 })
    }

    const apiKey = process.env.INSTACART_API_KEY
    if (!apiKey) {
      console.error('INSTACART_API_KEY not found')
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    // Aggregate all items from meal plan
    const shoppingListItems: Array<{
      name: string
      display_text?: string
      instacart_search_term?: string
      upc?: string
      measurements?: Array<{
        quantity: number
        unit: string
      }>
    }> = []

    // Process each meal
    mealPlanItems.forEach((meal: MealPlanItem) => {
      meal.items.forEach(item => {
        // Check if we already have this item (aggregate quantities)
        const existingItem = shoppingListItems.find(si => 
          si.instacart_search_term === item.instacartSearchTerm ||
          (si.upc && si.upc === item.upc)
        )

        if (existingItem && existingItem.measurements) {
          // Add to existing quantity
          const existingMeasurement = existingItem.measurements.find(m => m.unit === item.unit)
          if (existingMeasurement) {
            existingMeasurement.quantity += item.quantity
          } else {
            existingItem.measurements.push({
              quantity: item.quantity,
              unit: item.unit
            })
          }
        } else {
          // Add new item
          shoppingListItems.push({
            name: item.name,
            display_text: item.brand ? `${item.brand} ${item.name}` : item.name,
            instacart_search_term: item.instacartSearchTerm,
            upc: item.upc,
            measurements: [{
              quantity: item.quantity,
              unit: item.unit
            }]
          })
        }
      })
    })

    // Create Instacart shopping list
    const instacartUrl = 'https://connect.dev.instacart.tools/idp/v1/products/shopping_list'
    
    const requestBody = {
      title: `Meal Plan Shopping List - Week of ${new Date(weekStart).toLocaleDateString()}`,
      partner_linkback_url: `${process.env.NEXTAUTH_URL}/meal-planning`,
      enable_pantry_items: true,
      items: shoppingListItems.map(item => ({
        name: item.instacart_search_term || item.name,
        display_text: item.display_text,
        measurements: item.measurements
      }))
    }

    console.log('Creating Instacart shopping list:', JSON.stringify(requestBody, null, 2))

    const response = await fetch(instacartUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    console.log('Instacart response status:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Instacart API error:', errorText)
      return NextResponse.json({ 
        error: 'Failed to create shopping list',
        details: errorText 
      }, { status: response.status })
    }

    const data = await response.json()
    console.log('Instacart shopping list created:', data)

    return NextResponse.json({
      success: true,
      shoppingListUrl: data.products_link_url,
      itemCount: shoppingListItems.length,
      estimatedTotal: mealPlanItems.reduce((total: number, meal: MealPlanItem) => {
        return total + meal.items.reduce((mealTotal, item) => {
          return mealTotal + ((item.estimatedPrice || 0) * item.quantity)
        }, 0)
      }, 0)
    })

  } catch (error) {
    console.error('Shopping list creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create shopping list' },
      { status: 500 }
    )
  }
}