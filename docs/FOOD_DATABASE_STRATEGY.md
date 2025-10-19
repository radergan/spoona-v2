# Food Database Strategy for MyFitnessPal-like Experience

## Current Situation
- MyFitnessPal API is **not accepting new requests**
- Need comprehensive food database for meal builder feature
- Goal: MyFitnessPal-like search and selection experience

## Recommended Multi-Source Approach

### Phase 1: Foundation Data Sources
1. **USDA FoodData Central API** (Free, Public Domain)
   - 20+ million foods
   - Comprehensive nutrition data
   - 1,000 requests/hour limit
   - Perfect for basic ingredients and whole foods

2. **Spoonacular API** (Already Integrated)
   - 600K+ products with nutrition data
   - Product mapping capabilities
   - Ingredient analysis
   - Complex food ontology

### Phase 2: Strategic Web Scraping
Target major grocery retailers for product-specific data:

#### High-Value Targets:
- **Walmart Grocery** - Largest selection, consistent structure
- **Target** - Clean product pages, good nutrition labels
- **Kroger** - Extensive private label data
- **Amazon Fresh** - Product reviews and ratings

#### Technical Implementation:
```typescript
// Scraping Architecture
interface FoodScrapingService {
  sources: {
    walmart: WalmartScraper;
    target: TargetScraper;
    kroger: KrogerScraper;
    amazonFresh: AmazonScraper;
  };
  
  // Unified product interface
  scrapeProduct(upc: string): Promise<FoodProduct>;
  searchProducts(query: string): Promise<FoodProduct[]>;
  enrichWithNutrition(product: FoodProduct): Promise<NutritionData>;
}
```

### Phase 3: Database Architecture

#### MongoDB Collections:
```typescript
// Core food items (USDA + Spoonacular)
interface CoreFood {
  fdcId?: string;           // USDA identifier
  spoonacularId?: number;   // Spoonacular identifier
  name: string;
  brand?: string;
  category: string;
  nutrition: NutritionFacts;
  servingSizes: ServingSize[];
  lastUpdated: Date;
  source: 'usda' | 'spoonacular' | 'scraped';
}

// Scraped products (grocery stores)
interface ScrapedProduct extends CoreFood {
  upc: string;
  retailer: string;
  price?: number;
  availability: boolean;
  productUrl: string;
  imageUrl?: string;
  reviews?: ProductReview[];
}

// User search analytics
interface SearchAnalytics {
  query: string;
  results: number;
  clickThrough: string[];  // Which results were selected
  timestamp: Date;
}
```

### Phase 4: Smart Search Implementation

#### MyFitnessPal-like Features:
1. **Fuzzy Search** - Handle typos and variations
2. **Brand Recognition** - "Cheerios" → "General Mills Cheerios"
3. **Serving Size Intelligence** - Auto-suggest common portions
4. **Recent/Frequent** - Remember user preferences
5. **Barcode Scanning** - UPC lookup integration

```typescript
// Search service mimicking MyFitnessPal UX
class FoodSearchService {
  async search(query: string, userId?: string): Promise<FoodSearchResult[]> {
    // 1. Check user's recent/frequent foods first
    const recentFoods = await this.getUserRecentFoods(userId);
    
    // 2. Fuzzy search across all sources
    const coreResults = await this.searchCoreFoods(query);
    const scrapedResults = await this.searchScrapedProducts(query);
    
    // 3. Rank by relevance + user history
    return this.rankResults([...coreResults, ...scrapedResults], userId);
  }
  
  async searchByBarcode(upc: string): Promise<FoodProduct | null> {
    // Check scraped products first (more current)
    const scrapedProduct = await this.findByUPC(upc);
    if (scrapedProduct) return scrapedProduct;
    
    // Fallback to APIs
    return await this.searchAPIsbyUPC(upc);
  }
}
```

## Implementation Timeline

### Week 1-2: Foundation
- Integrate USDA FoodData Central API
- Enhance Spoonacular integration
- Create unified food database schema

### Week 3-4: Web Scraping
- Build scraping infrastructure
- Target Walmart + Target initially
- Implement data validation/cleaning

### Week 5-6: Search Enhancement
- Implement fuzzy search
- Add user preference tracking
- Build MyFitnessPal-like search UI

### Week 7-8: Polish & Scale
- Add barcode scanning
- Implement caching strategies
- Performance optimization

## Legal & Ethical Considerations

### ✅ Acceptable Practices:
- **Public APIs** (USDA, Spoonacular)
- **Publicly available product information** (nutrition labels)
- **Respect robots.txt** files
- **Rate limiting** to avoid overloading servers
- **Caching** to minimize requests

### ⚠️ Best Practices:
- **Rotate IP addresses** for large-scale scraping
- **Use delays** between requests (1-2 seconds)
- **Focus on nutrition facts** (public information)
- **Avoid copyrighted content** (product descriptions, reviews)
- **Attribution** where required

## Expected Outcomes

### Data Quality:
- **90%+ accuracy** from USDA/Spoonacular base
- **Real-time pricing** from grocery scrapers
- **Local availability** data
- **User-driven improvements** through feedback

### User Experience:
- **MyFitnessPal-quality search** results
- **Faster than manual entry** (goal: <5 seconds per food)
- **Smart suggestions** based on user history
- **Barcode scanning** for packaged goods

### Business Value:
- **Differentiated product** - real pricing + nutrition
- **Affiliate opportunities** - direct links to purchase
- **User retention** - comprehensive food database
- **Data moat** - proprietary nutrition + pricing dataset

## Success Metrics
- **Search satisfaction**: >85% of searches result in selection
- **Database coverage**: 95% of common foods findable
- **Response time**: <2 seconds for search results
- **Data freshness**: Pricing updated within 24 hours