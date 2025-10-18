import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || query.length < 2) {
      return NextResponse.json({ products: [] })
    }

    const apiKey = process.env.INSTACART_API_KEY
    if (!apiKey) {
      console.error('INSTACART_API_KEY not found')
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    // Instacart Connect API endpoint for product search
    const instacartUrl = 'https://connect.instacart.com/v2/fulfillment/products/search'
    
    const response = await fetch(instacartUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        location: {
          address: '123 Main St, San Francisco, CA 94102' // Default location - should be user configurable
        },
        size: 20, // Limit results
      }),
    })

    if (!response.ok) {
      console.error('Instacart API error:', response.status, response.statusText)
      const errorText = await response.text()
      console.error('Response body:', errorText)
      
      // Return mock data if API fails
      return NextResponse.json({ 
        products: [
          { id: 'mock-1', name: `${query} - Organic`, category: 'Produce', price: 2.99 },
          { id: 'mock-2', name: `${query} - Regular`, category: 'Produce', price: 1.99 },
          { id: 'mock-3', name: `${query} - Premium`, brand: 'Premium Brand', category: 'Produce', price: 3.99 },
        ]
      })
    }

    const data = await response.json()
    
    // Transform Instacart API response to our format
    const products = data.products?.map((product: any) => ({
      id: product.id,
      name: product.name,
      brand: product.brand_name,
      category: product.category?.name || 'Other',
      price: product.price?.amount ? parseFloat(product.price.amount) : undefined,
      image: product.image_url,
    })) || []

    return NextResponse.json({ products })

  } catch (error) {
    console.error('Instacart search error:', error)
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    )
  }
}