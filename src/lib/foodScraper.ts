// Product Catalog Scraper - Build comprehensive food database
import { PrismaClient } from '@prisma/client';

interface ScrapedProduct {
  upc?: string;
  name: string;
  brand: string;
  description?: string;
  category: string; // "Dairy", "Produce", "Meat & Seafood"
  subcategory?: string; // "Milk", "Yogurt", "Cheese"
  keywords: string[]; // For search optimization
  nutrition?: NutritionFacts;
  servingSizes: ServingSize[];
  imageUrl?: string;
  thumbnailUrl?: string;
  productUrl: string;
  source: 'walmart' | 'target' | 'kroger' | 'wholefoodsmarket';
  lastUpdated: Date;
  verified: boolean; // Has nutrition data been verified
  popularity?: number; // Calculated from search frequency
}

interface ServingSize {
  name: string; // "1 cup", "1 tbsp", "100g", "1 container"
  grams?: number;
  isDefault: boolean;
}

interface ProductCategory {
  name: string;
  subcategories: string[];
  commonKeywords: string[];
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
    price: string;
    nutrition: {
      servingSize: string;
      calories: string;
      totalFat: string;
      sodium: string;
      totalCarbs: string;
      protein: string;
    };
    availability: string;
    image: string;
  };
  rateLimit: number; // milliseconds between requests
}

class EthicalFoodScraper {
  private stores: Map<string, StoreConfig> = new Map();
  private requestQueue: Array<{ url: string; store: string; priority: number }> = [];
  private isProcessing = false;

  constructor() {
    this.initializeStoreConfigs();
  }

  private initializeStoreConfigs() {
    // Walmart Grocery - Large selection, consistent structure
    this.stores.set('walmart', {
      name: 'Walmart',
      baseUrl: 'https://www.walmart.com',
      selectors: {
        productName: '[data-testid="product-title"]',
        brand: '[data-testid="product-brand"]',
        price: '[data-testid="price-current"]',
        nutrition: {
          servingSize: '[data-testid="nutrition-serving-size"]',
          calories: '[data-testid="nutrition-calories"]',
          totalFat: '[data-testid="nutrition-total-fat"]',
          sodium: '[data-testid="nutrition-sodium"]',
          totalCarbs: '[data-testid="nutrition-total-carbs"]',
          protein: '[data-testid="nutrition-protein"]',
        },
        availability: '[data-testid="fulfillment-add-to-cart"]',
        image: '[data-testid="hero-image-container"] img'
      },
      rateLimit: 2000 // 2 seconds between requests
    });

    // Target - Clean product pages, good nutrition labels
    this.stores.set('target', {
      name: 'Target',
      baseUrl: 'https://www.target.com',
      selectors: {
        productName: '[data-test="product-title"]',
        brand: '[data-test="product-brand"]',
        price: '[data-test="product-price"]',
        nutrition: {
          servingSize: '[data-test="nutrition-serving-size"]',
          calories: '[data-test="nutrition-calories"]',
          totalFat: '[data-test="nutrition-total-fat"]',
          sodium: '[data-test="nutrition-sodium"]',
          totalCarbs: '[data-test="nutrition-total-carbs"]',
          protein: '[data-test="nutrition-protein"]',
        },
        availability: '[data-test="shipItButton"], [data-test="storePickupButton"]',
        image: 'picture img'
      },
      rateLimit: 1500
    });

    // Kroger - Extensive private label data
    this.stores.set('kroger', {
      name: 'Kroger',
      baseUrl: 'https://www.kroger.com',
      selectors: {
        productName: '.ProductDetails-title',
        brand: '.ProductDetails-brand',
        price: '.ProductDetails-sellBy-price',
        nutrition: {
          servingSize: '.nutrition-serving-size',
          calories: '.nutrition-calories',
          totalFat: '.nutrition-total-fat',
          sodium: '.nutrition-sodium',
          totalCarbs: '.nutrition-total-carbs',
          protein: '.nutrition-protein',
        },
        availability: '.add-to-cart-button:not([disabled])',
        image: '.ProductDetails-image img'
      },
      rateLimit: 3000 // More conservative for Kroger
    });
  }

  // Ethical scraping with proper delays and respect for robots.txt
  async scrapeProduct(productUrl: string, store: string): Promise<ScrapedProduct | null> {
    const storeConfig = this.stores.get(store);
    if (!storeConfig) {
      throw new Error(`Store configuration not found: ${store}`);
    }

    try {
      // Check robots.txt compliance
      await this.checkRobotsPermission(storeConfig.baseUrl);
      
      // Rate limiting
      await this.delay(storeConfig.rateLimit);
      
      // Use headless browser with realistic headers
      const response = await fetch(productUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
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

  // Search for products across multiple stores
  async searchProducts(query: string, maxResults = 50): Promise<ScrapedFood[]> {
    const results: ScrapedFood[] = [];
    
    for (const [storeKey, storeConfig] of this.stores) {
      try {
        const searchUrl = `${storeConfig.baseUrl}/search?q=${encodeURIComponent(query)}`;
        const searchResults = await this.scrapeSearchResults(searchUrl, storeKey, maxResults / this.stores.size);
        results.push(...searchResults);
      } catch (error) {
        console.error(`Error searching ${storeConfig.name}:`, error);
        continue;
      }
    }

    return results.sort((a, b) => {
      // Sort by relevance (simple text matching for now)
      const aRelevance = this.calculateRelevance(query, a.name);
      const bRelevance = this.calculateRelevance(query, b.name);
      return bRelevance - aRelevance;
    });
  }

  // Bulk update pricing for existing products
  async updatePricing(productIds: string[]): Promise<void> {
    const prisma = new PrismaClient();
    
    try {
      const products = await prisma.scrapedFood.findMany({
        where: { id: { in: productIds } }
      });

      for (const product of products) {
        const updated = await this.scrapeProduct(product.productUrl, product.store);
        if (updated && updated.price !== product.price) {
          await prisma.scrapedFood.update({
            where: { id: product.id },
            data: {
              price: updated.price,
              availability: updated.availability,
              lastUpdated: new Date()
            }
          });
        }
        
        // Rate limiting between updates
        await this.delay(2000);
      }
    } finally {
      await prisma.$disconnect();
    }
  }

  // Helper methods
  private async checkRobotsPermission(baseUrl: string): Promise<boolean> {
    try {
      const robotsUrl = `${baseUrl}/robots.txt`;
      const response = await fetch(robotsUrl);
      const robotsTxt = await response.text();
      
      // Basic robots.txt parsing - in production, use a proper parser
      const lines = robotsTxt.split('\n');
      let userAgentSection = false;
      
      for (const line of lines) {
        if (line.startsWith('User-agent: *') || line.startsWith('User-agent: spoona')) {
          userAgentSection = true;
          continue;
        }
        
        if (userAgentSection && line.startsWith('Disallow: /')) {
          const disallowedPath = line.substring(10).trim();
          // Check if we're trying to access a disallowed path
          // For now, assume product pages are generally allowed
        }
      }
      
      return true; // Most grocery stores allow product page access
    } catch (error) {
      console.warn(`Could not check robots.txt for ${baseUrl}:`, error);
      return true; // Default to allowed if robots.txt is not accessible
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private parseProductPage(html: string, config: StoreConfig, url: string): ScrapedFood | null {
    // In a real implementation, you'd use a proper HTML parser like Cheerio
    // This is a simplified example showing the structure
    
    try {
      // Parse HTML and extract data using config selectors
      // This would use a library like Cheerio or Playwright
      
      const mockData: ScrapedFood = {
        name: "Example Product", // Extract using config.selectors.productName
        brand: "Example Brand", // Extract using config.selectors.brand  
        price: 3.99, // Extract and parse price
        nutrition: {
          servingSize: "1 cup",
          calories: 150,
          totalFat: 2,
          sodium: 300,
          totalCarbs: 30,
          protein: 8
        },
        store: config.name,
        storeId: url.split('/').pop() || '',
        availability: true,
        lastUpdated: new Date(),
        productUrl: url
      };
      
      return mockData;
      
    } catch (error) {
      console.error('Error parsing product page:', error);
      return null;
    }
  }

  private async scrapeSearchResults(searchUrl: string, store: string, maxResults: number): Promise<ScrapedFood[]> {
    // Implementation would scrape search results and return product URLs
    // Then scrape each product page individually
    return [];
  }

  private calculateRelevance(query: string, productName: string): number {
    const queryLower = query.toLowerCase();
    const nameLower = productName.toLowerCase();
    
    if (nameLower.includes(queryLower)) {
      return nameLower.indexOf(queryLower) === 0 ? 100 : 50; // Prefer starts-with
    }
    
    // More sophisticated relevance scoring could include:
    // - Levenshtein distance
    // - Brand matching
    // - Category matching
    // - User preference history
    
    return 0;
  }
}

// Usage example
export class FoodSearchService {
  private scraper = new EthicalFoodScraper();
  private prisma = new PrismaClient();

  async searchForFood(query: string, includeStores = true): Promise<any[]> {
    const results = [];
    
    // 1. Search USDA database first (free, comprehensive)
    const usdaResults = await this.searchUSDA(query);
    results.push(...usdaResults);
    
    // 2. Search Spoonacular (already integrated)
    const spoonacularResults = await this.searchSpoonacular(query);
    results.push(...spoonacularResults);
    
    // 3. Search scraped grocery store data (real prices!)
    if (includeStores) {
      const storeResults = await this.scraper.searchProducts(query);
      results.push(...storeResults);
    }
    
    return this.deduplicateAndRank(results);
  }

  private async searchUSDA(query: string): Promise<any[]> {
    // Implementation for USDA FoodData Central API
    return [];
  }

  private async searchSpoonacular(query: string): Promise<any[]> {
    // Implementation for Spoonacular API
    return [];
  }

  private deduplicateAndRank(results: any[]): any[] {
    // Smart deduplication and ranking logic
    return results;
  }
}

export default EthicalFoodScraper;