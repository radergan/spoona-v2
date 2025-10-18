// Curated product database for meal planning
// These are common meal components that users can build meals from

export interface ProductItem {
  id: string
  name: string
  brand?: string
  category: 'Frozen' | 'Pantry' | 'Dairy' | 'Meat' | 'Produce' | 'Snacks' | 'Beverages'
  instacartSearchTerm: string // What to search for on Instacart
  upc?: string // Universal Product Code if available
  estimatedPrice: number
  commonUnits: string[]
  description?: string
}

export const productDatabase: ProductItem[] = [
  // Frozen Foods
  {
    id: 'perdue-chicken-nuggets',
    name: 'Chicken Nuggets',
    brand: 'Perdue',
    category: 'Frozen',
    instacartSearchTerm: 'perdue chicken nuggets',
    estimatedPrice: 8.99,
    commonUnits: ['bag', 'lb'],
    description: 'Crispy breaded chicken nuggets'
  },
  {
    id: 'tyson-chicken-strips',
    name: 'Chicken Strips',
    brand: 'Tyson',
    category: 'Frozen',
    instacartSearchTerm: 'tyson chicken strips',
    estimatedPrice: 9.49,
    commonUnits: ['bag', 'lb'],
  },
  {
    id: 'stouffers-lasagna',
    name: 'Stouffer\'s Lasagna',
    brand: 'Stouffer\'s',
    category: 'Frozen',
    instacartSearchTerm: 'stouffers meat lasagna',
    estimatedPrice: 4.99,
    commonUnits: ['each'],
  },
  {
    id: 'hot-pockets-pepperoni',
    name: 'Hot Pockets Pepperoni Pizza',
    brand: 'Hot Pockets',
    category: 'Frozen',
    instacartSearchTerm: 'hot pockets pepperoni pizza',
    estimatedPrice: 3.99,
    commonUnits: ['box'],
  },

  // Pantry Items
  {
    id: 'kraft-mac-cheese',
    name: 'Macaroni & Cheese',
    brand: 'Kraft',
    category: 'Pantry',
    instacartSearchTerm: 'kraft macaroni cheese',
    upc: '021000061365',
    estimatedPrice: 1.99,
    commonUnits: ['box'],
    description: 'Classic mac and cheese dinner'
  },
  {
    id: 'chef-boyardee-ravioli',
    name: 'Beef Ravioli',
    brand: 'Chef Boyardee',
    category: 'Pantry',
    instacartSearchTerm: 'chef boyardee beef ravioli',
    estimatedPrice: 1.49,
    commonUnits: ['can'],
  },
  {
    id: 'ramen-maruchan',
    name: 'Ramen Noodles',
    brand: 'Maruchan',
    category: 'Pantry',
    instacartSearchTerm: 'maruchan ramen noodles',
    estimatedPrice: 0.25,
    commonUnits: ['pack'],
  },
  {
    id: 'minute-rice',
    name: 'Instant Rice',
    brand: 'Minute Rice',
    category: 'Pantry',
    instacartSearchTerm: 'minute rice white',
    estimatedPrice: 2.99,
    commonUnits: ['box', 'cup'],
  },

  // Snacks
  {
    id: 'goldfish-crackers',
    name: 'Goldfish Crackers',
    brand: 'Pepperidge Farm',
    category: 'Snacks',
    instacartSearchTerm: 'goldfish crackers cheddar',
    estimatedPrice: 3.49,
    commonUnits: ['bag'],
  },
  {
    id: 'chips-lays',
    name: 'Potato Chips',
    brand: 'Lay\'s',
    category: 'Snacks',
    instacartSearchTerm: 'lays potato chips original',
    estimatedPrice: 3.99,
    commonUnits: ['bag'],
  },

  // Dairy
  {
    id: 'kraft-singles',
    name: 'American Cheese Singles',
    brand: 'Kraft',
    category: 'Dairy',
    instacartSearchTerm: 'kraft singles american cheese',
    estimatedPrice: 4.49,
    commonUnits: ['pack'],
  },
  {
    id: 'milk-whole',
    name: 'Whole Milk',
    category: 'Dairy',
    instacartSearchTerm: 'whole milk gallon',
    estimatedPrice: 3.99,
    commonUnits: ['gallon', 'half gallon'],
  },

  // Meat
  {
    id: 'ground-beef',
    name: 'Ground Beef',
    category: 'Meat',
    instacartSearchTerm: 'ground beef 80/20',
    estimatedPrice: 5.99,
    commonUnits: ['lb'],
  },
  {
    id: 'hot-dogs-oscar-mayer',
    name: 'Hot Dogs',
    brand: 'Oscar Mayer',
    category: 'Meat',
    instacartSearchTerm: 'oscar mayer hot dogs',
    estimatedPrice: 4.99,
    commonUnits: ['pack'],
  },

  // Produce
  {
    id: 'bananas',
    name: 'Bananas',
    category: 'Produce',
    instacartSearchTerm: 'bananas',
    estimatedPrice: 1.99,
    commonUnits: ['lb', 'each'],
  },
  {
    id: 'apples-gala',
    name: 'Gala Apples',
    category: 'Produce',
    instacartSearchTerm: 'gala apples',
    estimatedPrice: 2.99,
    commonUnits: ['lb', 'each'],
  },

  // Beverages
  {
    id: 'coca-cola',
    name: 'Coca-Cola',
    brand: 'Coca-Cola',
    category: 'Beverages',
    instacartSearchTerm: 'coca cola 12 pack',
    estimatedPrice: 5.99,
    commonUnits: ['12-pack', '6-pack'],
  },
  {
    id: 'apple-juice',
    name: 'Apple Juice',
    brand: 'Mott\'s',
    category: 'Beverages',
    instacartSearchTerm: 'motts apple juice',
    estimatedPrice: 3.49,
    commonUnits: ['bottle', '64oz'],
  },
]

// Helper functions
export function searchProducts(query: string): ProductItem[] {
  const lowercaseQuery = query.toLowerCase()
  return productDatabase.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.brand?.toLowerCase().includes(lowercaseQuery) ||
    product.category.toLowerCase().includes(lowercaseQuery) ||
    product.instacartSearchTerm.toLowerCase().includes(lowercaseQuery)
  )
}

export function getProductsByCategory(category: ProductItem['category']): ProductItem[] {
  return productDatabase.filter(product => product.category === category)
}

export function getProductById(id: string): ProductItem | undefined {
  return productDatabase.find(product => product.id === id)
}

// Predefined meal templates using products
export const mealTemplates = [
  {
    id: 'quick-lunch',
    name: 'Quick Mac & Cheese with Nuggets',
    products: [
      { productId: 'kraft-mac-cheese', quantity: 1, unit: 'box' },
      { productId: 'perdue-chicken-nuggets', quantity: 0.5, unit: 'lb' }
    ],
    estimatedTotal: 10.98,
    prepTime: '15 minutes'
  },
  {
    id: 'easy-dinner',
    name: 'Hot Dogs with Chips',
    products: [
      { productId: 'hot-dogs-oscar-mayer', quantity: 1, unit: 'pack' },
      { productId: 'chips-lays', quantity: 1, unit: 'bag' }
    ],
    estimatedTotal: 8.98,
    prepTime: '10 minutes'
  },
  {
    id: 'frozen-meal',
    name: 'Stouffer\'s Lasagna Dinner',
    products: [
      { productId: 'stouffers-lasagna', quantity: 1, unit: 'each' }
    ],
    estimatedTotal: 4.99,
    prepTime: '45 minutes'
  }
]