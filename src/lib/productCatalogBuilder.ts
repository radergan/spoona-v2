// Product Catalog Builder - Focus on comprehensive product data, not pricing
import { PrismaClient } from '@prisma/client';

interface ScrapedProduct {
  upc?: string;
  name: string;
  brand: string;
  description?: string;
  category: string; // "Dairy", "Produce", "Meat & Seafood", "Pantry"
  subcategory?: string; // "Milk", "Greek Yogurt", "Chicken Breast"
  keywords: string[]; // For enhanced search ["organic", "fat-free", "greek", "protein"]
  nutrition?: NutritionFacts;
  servingSizes: ServingSize[];
  imageUrl?: string;
  thumbnailUrl?: string;
  productUrl: string;
  source: 'walmart' | 'target' | 'kroger' | 'wholefoodsmarket';
  lastUpdated: Date;
  verified: boolean; // Has nutrition data been human-verified
  searchPopularity: number; // Track how often users select this product
}

interface ServingSize {
  name: string; // "1 cup (240ml)", "1 container (170g)", "1 tbsp (15ml)"
  grams?: number;
  isDefault: boolean;
}

interface NutritionFacts {
  servingSize: string;
  servingsPerContainer?: number;
  calories: number;
  totalFat: number;
  saturatedFat?: number;
  transFat?: number;
  cholesterol?: number;
  sodium: number;
  totalCarbs: number;
  dietaryFiber?: number;
  sugars?: number;
  addedSugars?: number;
  protein: number;
  vitaminD?: number;
  calcium?: number;
  iron?: number;
  potassium?: number;
}

interface StoreConfig {
  name: string;
  baseUrl: string;
  selectors: {
    productName: string;
    brand: string;
    description: string;
    category: string;
    nutrition: {
      servingSize: string;
      calories: string;
      totalFat: string;
      saturatedFat: string;
      sodium: string;
      totalCarbs: string;
      dietaryFiber: string;
      sugars: string;
      protein: string;
    };
    image: string;
    thumbnail: string;
    upc: string;
  };
  categoryMappings: Record<string, { category: string; subcategory: string }>;
  rateLimit: number; // milliseconds between requests
}

class ProductCatalogBuilder {
  private stores: Map<string, StoreConfig> = new Map();
  private prisma = new PrismaClient();

  constructor() {
    this.initializeStoreConfigs();
  }

  private initializeStoreConfigs() {
    // Walmart - Massive selection, consistent data structure
    this.stores.set('walmart', {
      name: 'Walmart',
      baseUrl: 'https://www.walmart.com',
      selectors: {
        productName: '[data-testid="product-title"]',
        brand: '[data-testid="product-brand"]',
        description: '[data-testid="product-description"]',
        category: '.breadcrumb-list li:nth-child(2)',
        nutrition: {
          servingSize: '[data-testid="keyFeatures-section"] *[data-testid*="serving"]',
          calories: '[data-testid="keyFeatures-section"] *[data-testid*="calorie"]',
          totalFat: '[data-testid="nutrition-facts"] *[data-testid*="fat"]',
          saturatedFat: '[data-testid="nutrition-facts"] *[data-testid*="saturated"]',
          sodium: '[data-testid="nutrition-facts"] *[data-testid*="sodium"]',
          totalCarbs: '[data-testid="nutrition-facts"] *[data-testid*="carb"]',
          dietaryFiber: '[data-testid="nutrition-facts"] *[data-testid*="fiber"]',
          sugars: '[data-testid="nutrition-facts"] *[data-testid*="sugar"]',
          protein: '[data-testid="nutrition-facts"] *[data-testid*="protein"]',
        },
        image: '[data-testid="hero-image-container"] img',
        thumbnail: '.thumbnails img',
        upc: '[data-testid="product-details"] *[data-testid*="upc"]'
      },
      categoryMappings: {
        'food': { category: 'Grocery', subcategory: 'Food' },
        'dairy': { category: 'Dairy', subcategory: 'Milk & Dairy' },
        'produce': { category: 'Produce', subcategory: 'Fresh' },
        'meat': { category: 'Meat & Seafood', subcategory: 'Fresh Meat' },
        'pantry': { category: 'Pantry', subcategory: 'Shelf-Stable' },
        'frozen': { category: 'Frozen', subcategory: 'Frozen Foods' },
        'beverages': { category: 'Beverages', subcategory: 'Drinks' }
      },
      rateLimit: 2000
    });

    // Target - Clean product data, good nutrition labels
    this.stores.set('target', {
      name: 'Target',
      baseUrl: 'https://www.target.com',
      selectors: {
        productName: '[data-test="product-title"]',
        brand: '[data-test="product-brand"]',
        description: '[data-test="item-details-description"]',
        category: '.Breadcrumbs__StyledBreadcrumb a',
        nutrition: {
          servingSize: '.nutritional-info *[data-test*="serving"]',
          calories: '.nutritional-info *[data-test*="calorie"]',
          totalFat: '.nutritional-info *[data-test*="fat"]',
          saturatedFat: '.nutritional-info *[data-test*="saturated"]',
          sodium: '.nutritional-info *[data-test*="sodium"]',
          totalCarbs: '.nutritional-info *[data-test*="carb"]',
          dietaryFiber: '.nutritional-info *[data-test*="fiber"]',
          sugars: '.nutritional-info *[data-test*="sugar"]',
          protein: '.nutritional-info *[data-test*="protein"]',
        },
        image: 'picture img[src*="target.scene7.com"]',
        thumbnail: '.carousel img',
        upc: '[data-test="item-details"] *:contains("UPC")'
      },
      categoryMappings: {
        'grocery': { category: 'Grocery', subcategory: 'Food' },
        'dairy': { category: 'Dairy', subcategory: 'Milk & Dairy' },
        'produce': { category: 'Produce', subcategory: 'Fresh' }
      },
      rateLimit: 1500
    });
  }

  // Main method: Build comprehensive product database
  async buildProductCatalog(categories: string[] = ['dairy', 'produce', 'meat', 'pantry']): Promise<void> {
    console.log('🏪 Starting product catalog build...');
    
    for (const category of categories) {
      console.log(`📦 Processing category: ${category}`);
      
      for (const [storeKey, storeConfig] of this.stores) {
        try {
          await this.scrapeCategoryFromStore(category, storeKey, storeConfig);
          await this.delay(5000); // Be respectful between store switches
        } catch (error) {
          console.error(`❌ Error processing ${category} from ${storeConfig.name}:`, error);
          continue;
        }
      }
    }
    
    console.log('✅ Product catalog build complete!');
  }

  // Scrape specific product by URL
  async scrapeProduct(productUrl: string, store: string): Promise<ScrapedProduct | null> {
    const storeConfig = this.stores.get(store);
    if (!storeConfig) {
      throw new Error(`Store configuration not found: ${store}`);
    }

    try {
      // Rate limiting
      await this.delay(storeConfig.rateLimit);
      
      const response = await fetch(productUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
        }
      });

      if (!response.ok) {
        console.warn(`Failed to fetch ${productUrl}: ${response.status}`);
        return null;
      }

      const html = await response.text();
      return this.parseProductPage(html, storeConfig, productUrl);
      
    } catch (error) {
      console.error(`Error scraping ${productUrl}:`, error);
      return null;
    }
  }

  // Smart product search across all sources
  async searchProducts(query: string, maxResults = 50): Promise<ScrapedProduct[]> {
    console.log(`🔍 Searching for: "${query}"`);
    
    // First check our existing database
    const existingProducts = await this.searchExistingProducts(query);
    
    if (existingProducts.length >= maxResults) {
      console.log(`✅ Found ${existingProducts.length} existing products`);
      return existingProducts.slice(0, maxResults);
    }
    
    // If we need more, scrape fresh data
    const freshProducts: ScrapedProduct[] = [];
    const needed = maxResults - existingProducts.length;
    
    for (const [storeKey, storeConfig] of this.stores) {
      if (freshProducts.length >= needed) break;
      
      try {
        const storeResults = await this.scrapeSearchResults(query, storeKey, needed / this.stores.size);
        freshProducts.push(...storeResults);
        await this.delay(3000); // Respectful delay between stores
      } catch (error) {
        console.error(`Error searching ${storeConfig.name}:`, error);
        continue;
      }
    }
    
    // Save new products to database
    for (const product of freshProducts) {
      await this.saveProduct(product);
    }
    
    const allResults = [...existingProducts, ...freshProducts];
    return this.rankByRelevance(query, allResults).slice(0, maxResults);
  }

  // Enhanced search for MyFitnessPal-like experience
  async searchForMealBuilder(query: string, userId?: string): Promise<any[]> {
    // 1. Get user's recent selections first (personalization)
    const userFavorites = userId ? await this.getUserFavoriteProducts(userId) : [];
    const relevantFavorites = userFavorites.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.keywords.some(k => k.toLowerCase().includes(query.toLowerCase()))
    );

    // 2. Search comprehensive product database
    const searchResults = await this.searchProducts(query, 30);
    
    // 3. Enhance with USDA data for whole foods
    const usdaResults = await this.searchUSDAFoods(query);
    
    // 4. Combine and rank by user preference + relevance
    return this.createMealBuilderResults([
      ...relevantFavorites,
      ...searchResults,
      ...usdaResults
    ], query, userId);
  }

  private async scrapeCategoryFromStore(category: string, storeKey: string, config: StoreConfig): Promise<void> {
    // Implementation would scrape category pages and extract product URLs
    console.log(`  📝 Scraping ${category} from ${config.name}...`);
    
    // Example: Build category URL based on store structure
    const categoryUrl = `${config.baseUrl}/browse/${category}`;
    
    try {
      const response = await fetch(categoryUrl);
      const html = await response.text();
      
      // Parse category page for product links
      const productUrls = this.extractProductUrls(html, config);
      
      console.log(`  Found ${productUrls.length} products in ${category}`);
      
      // Scrape each product (with rate limiting)
      for (const url of productUrls.slice(0, 50)) { // Limit per category
        const product = await this.scrapeProduct(url, storeKey);
        if (product) {
          await this.saveProduct(product);
        }
        await this.delay(config.rateLimit);
      }
      
    } catch (error) {
      console.error(`Error scraping category ${category}:`, error);
    }
  }

  private parseProductPage(html: string, config: StoreConfig, url: string): ScrapedProduct | null {
    try {
      // In production, use Cheerio or Playwright for proper HTML parsing
      // This is a conceptual example showing the data extraction structure
      
      const product: ScrapedProduct = {
        name: this.extractText(html, config.selectors.productName) || 'Unknown Product',
        brand: this.extractText(html, config.selectors.brand) || 'Generic',
        description: this.extractText(html, config.selectors.description),
        category: this.mapCategory(html, config),
        subcategory: this.mapSubcategory(html, config),
        keywords: this.extractKeywords(html, config),
        nutrition: this.extractNutrition(html, config),
        servingSizes: this.extractServingSizes(html, config),
        imageUrl: this.extractImageUrl(html, config.selectors.image),
        thumbnailUrl: this.extractImageUrl(html, config.selectors.thumbnail),
        upc: this.extractText(html, config.selectors.upc),
        productUrl: url,
        source: config.name.toLowerCase() as any,
        lastUpdated: new Date(),
        verified: false, // Will be verified manually or through user feedback
        searchPopularity: 0
      };
      
      return product;
      
    } catch (error) {
      console.error('Error parsing product page:', error);
      return null;
    }
  }

  private async saveProduct(product: ScrapedProduct): Promise<void> {
    try {
      // Check if product already exists (by UPC or URL)
      // Check if product already exists (by UPC or URL)
      const existing = product.upc 
        ? await this.prisma.product.findUnique({ where: { upc: product.upc } })
        : await this.prisma.product.findFirst({ where: { productUrl: product.productUrl } });

      if (existing) {
        // Update existing product with new data
        await this.prisma.product.update({
          where: { id: existing.id },
          data: {
            name: product.name,
            brand: product.brand,
            description: product.description,
            category: product.category,
            subcategory: product.subcategory,
            keywords: product.keywords,
            imageUrl: product.imageUrl,
            thumbnailUrl: product.thumbnailUrl,
            lastUpdated: new Date()
          }
        });
      } else {
        // Create new product
        await this.prisma.product.create({
          data: {
            upc: product.upc,
            name: product.name,
            brand: product.brand,
            description: product.description,
            category: product.category,
            subcategory: product.subcategory,
            keywords: product.keywords,
            imageUrl: product.imageUrl,
            thumbnailUrl: product.thumbnailUrl,
            productUrl: product.productUrl,
            source: product.source,
            verified: product.verified,
            searchPopularity: product.searchPopularity
          }
        });
      }
      
    } catch (error) {
      console.error('Error saving product:', error);
    }
  }

  // Helper methods for data extraction
  private extractText(html: string, selector: string): string | undefined {
    // In production, use proper HTML parser
    return undefined;
  }

  private mapCategory(html: string, config: StoreConfig): string {
    // Extract and map category using config.categoryMappings
    return 'Grocery';
  }

  private mapSubcategory(html: string, config: StoreConfig): string {
    return 'Food';
  }

  private extractKeywords(html: string, config: StoreConfig): string[] {
    // Extract keywords from product title, description, and features
    return [];
  }

  private extractNutrition(html: string, config: StoreConfig): NutritionFacts | undefined {
    // Parse nutrition facts using config selectors
    return undefined;
  }

  private extractServingSizes(html: string, config: StoreConfig): ServingSize[] {
    return [{ name: '1 serving', isDefault: true }];
  }

  private extractImageUrl(html: string, selector: string): string | undefined {
    return undefined;
  }

  private extractProductUrls(html: string, config: StoreConfig): string[] {
    // Extract product URLs from category pages
    return [];
  }

  private async searchExistingProducts(query: string): Promise<ScrapedProduct[]> {
    // Search existing database with fuzzy matching
    return [];
  }

  private async scrapeSearchResults(query: string, store: string, maxResults: number): Promise<ScrapedProduct[]> {
    // Scrape search results from store
    return [];
  }

  private async getUserFavoriteProducts(userId: string): Promise<ScrapedProduct[]> {
    // Get user's frequently selected products
    return [];
  }

  private async searchUSDAFoods(query: string): Promise<any[]> {
    // Search USDA database for whole foods
    return [];
  }

  private rankByRelevance(query: string, products: ScrapedProduct[]): ScrapedProduct[] {
    // Smart ranking algorithm
    return products;
  }

  private createMealBuilderResults(products: any[], query: string, userId?: string): any[] {
    // Format results for meal builder UI
    return products;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Usage example for meal planning
export class FoodSearchService {
  private catalogBuilder = new ProductCatalogBuilder();

  async searchForMealPlan(query: string, userLocation?: string): Promise<any[]> {
    console.log(`🍽️ Searching foods for meal plan: "${query}"`);
    
    // Get comprehensive product data (no pricing complexity)
    const products = await this.catalogBuilder.searchForMealBuilder(query);
    
    // Format for meal planner UI
    return products.map(product => ({
      id: product.id,
      name: product.name,
      brand: product.brand,
      description: product.description,
      category: product.category,
      nutrition: product.nutrition,
      image: product.thumbnailUrl || product.imageUrl,
      servingSizes: product.servingSizes,
      // Add location-specific data if needed (separate service)
      // pricing: userLocation ? await this.getPricing(product.upc, userLocation) : null
    }));
  }

  // Future: Add location-specific pricing as separate service
  async getPricingData(upc: string, zipCode: string): Promise<any> {
    // This would be a separate, simpler service that just gets current pricing
    // Much easier to maintain than scraping prices with products
    return {
      stores: [
        { name: 'Walmart', price: 3.99, available: true },
        { name: 'Target', price: 4.29, available: true }
      ]
    };
  }
}

export default ProductCatalogBuilder;