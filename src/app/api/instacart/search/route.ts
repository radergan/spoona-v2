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

    // Instacart Development API endpoint (using dev server for development API key)
    const instacartUrl = 'https://connect.dev.instacart.tools/idp/v1/catalog/search'
    
    // Try POST request with proper body structure as shown in docs
    const requestBody = {
      query: query,
      location: {
        address: '123 Main St, San Francisco, CA 94102'
      },
      size: 20
    }
    
    console.log('Making request to Instacart API:', instacartUrl)
    console.log('Request body:', JSON.stringify(requestBody, null, 2))
    
    const response = await fetch(instacartUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    console.log('Response status:', response.status, response.statusText)
    
    if (!response.ok) {
      console.error('Instacart API error:', response.status, response.statusText)
      const errorText = await response.text()
      console.error('Response body:', errorText)
      console.log('Falling back to mock data because API failed')
      
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
    console.log('Instacart API raw response:', JSON.stringify(data, null, 2))
    
    // Transform Instacart API response to our format
    const products = data.products?.map((product: any) => ({
      id: product.id,
      name: product.name,
      brand: product.brand_name,
      category: product.category?.name || 'Other',
      price: product.price?.amount ? parseFloat(product.price.amount) : undefined,
      image: product.image_url,
    })) || []

    console.log('Transformed products:', JSON.stringify(products, null, 2))
    return NextResponse.json({ products })

  } catch (error) {
    console.error('Instacart search error:', error)
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    )
  }
}