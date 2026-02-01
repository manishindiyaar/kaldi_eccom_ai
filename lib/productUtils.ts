/**
 * Product utility functions for fetching and caching product data
 * 
 * This module handles fetching products from the Fake Store API,
 * parsing and validating the response data, and providing error handling.
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */

import { Product, ProductCategory } from './types';

/**
 * Fake Store API base URL
 */
const FAKE_STORE_API_URL = 'https://fakestoreapi.com/products';

/**
 * Raw product data structure from Fake Store API
 * This may have slightly different types than our normalized Product interface
 */
interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

/**
 * Validates if a string is a valid ProductCategory
 * Requirement 2.5: Product data validation
 */
function isValidCategory(category: string): category is ProductCategory {
  return ['electronics', 'jewelery', "men's clothing", "women's clothing"].includes(category);
}

/**
 * Validates a product object has all required fields
 * Requirement 2.5: Product data validation
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateProduct(product: any): product is FakeStoreProduct {
  return (
    typeof product === 'object' &&
    product !== null &&
    typeof product.id === 'number' &&
    typeof product.title === 'string' &&
    typeof product.price === 'number' &&
    typeof product.description === 'string' &&
    typeof product.category === 'string' &&
    typeof product.image === 'string' &&
    typeof product.rating === 'object' &&
    product.rating !== null &&
    typeof product.rating.rate === 'number' &&
    typeof product.rating.count === 'number'
  );
}

/**
 * Parses and normalizes a product from the Fake Store API response
 * Requirement 2.5: Product data parsing with all required fields
 * 
 * @param rawProduct - Raw product data from API
 * @returns Normalized Product object
 * @throws Error if product data is invalid or category is not recognized
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseProduct(rawProduct: any): Product {
  // Validate the product structure
  if (!validateProduct(rawProduct)) {
    throw new Error(`Invalid product data: missing or invalid required fields`);
  }

  // Validate and normalize the category
  if (!isValidCategory(rawProduct.category)) {
    throw new Error(`Invalid product category: ${rawProduct.category}`);
  }

  // Return normalized product
  return {
    id: rawProduct.id,
    title: rawProduct.title,
    price: rawProduct.price,
    description: rawProduct.description,
    category: rawProduct.category,
    image: rawProduct.image,
    rating: {
      rate: rawProduct.rating.rate,
      count: rawProduct.rating.count,
    },
  };
}

/**
 * Fetches all products from the Fake Store API
 * Requirement 2.1: Fetch all products from the Fake Store API
 * Requirement 2.3: Error handling for API failures
 * Requirement 2.4: Cache products for session duration
 * 
 * @returns Promise resolving to array of Product objects
 * @throws Error if fetch fails or response is invalid
 */
export async function fetchProducts(): Promise<Product[]> {
  try {
    // Fetch products from API
    const response = await fetch(FAKE_STORE_API_URL);

    // Check for HTTP errors
    if (!response.ok) {
      throw new Error(
        `Failed to fetch products: HTTP ${response.status} ${response.statusText}`
      );
    }

    // Parse JSON response
    const data = await response.json();

    // Validate response is an array
    if (!Array.isArray(data)) {
      throw new Error('Invalid API response: expected array of products');
    }

    // Parse and validate each product
    const products: Product[] = [];
    const errors: string[] = [];

    for (let i = 0; i < data.length; i++) {
      try {
        const product = parseProduct(data[i]);
        products.push(product);
      } catch (error) {
        // Collect errors but continue processing other products
        errors.push(`Product at index ${i}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // If we have some valid products, return them even if some failed
    if (products.length > 0) {
      if (errors.length > 0) {
        console.warn('Some products failed to parse:', errors);
      }
      return products;
    }

    // If no products were valid, throw an error
    throw new Error(`Failed to parse any products. Errors: ${errors.join('; ')}`);

  } catch (error) {
    // Log error for debugging (Requirement 10.5)
    console.error('[fetchProducts]', error);
    
    // Re-throw with context
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred while fetching products');
  }
}

/**
 * Fetches products for a specific category
 * Requirement 9.1: Support filtering by category
 * 
 * @param category - Category to filter by
 * @returns Promise resolving to array of Product objects in that category
 * @throws Error if fetch fails or response is invalid
 */
export async function fetchProductsByCategory(category: ProductCategory): Promise<Product[]> {
  try {
    const url = `${FAKE_STORE_API_URL}/category/${encodeURIComponent(category)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch products for category ${category}: HTTP ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Invalid API response: expected array of products');
    }

    return data.map(parseProduct);

  } catch (error) {
    console.error(`[fetchProductsByCategory:${category}]`, error);
    
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Unknown error occurred while fetching products for category ${category}`);
  }
}

/**
 * Simple in-memory cache for products
 * Requirement 2.4: Cache products for session duration
 */
let productCache: Product[] | null = null;
let cacheTimestamp: number | null = null;

/**
 * Cache duration in milliseconds (5 minutes)
 */
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * Fetches products with caching
 * Returns cached products if available and not expired
 * Requirement 2.4: Cache products for session duration
 * 
 * @param forceRefresh - If true, bypass cache and fetch fresh data
 * @returns Promise resolving to array of Product objects
 */
export async function fetchProductsWithCache(forceRefresh: boolean = false): Promise<Product[]> {
  const now = Date.now();

  // Return cached products if available and not expired
  if (
    !forceRefresh &&
    productCache !== null &&
    cacheTimestamp !== null &&
    now - cacheTimestamp < CACHE_DURATION
  ) {
    return productCache;
  }

  // Fetch fresh products
  const products = await fetchProducts();

  // Update cache
  productCache = products;
  cacheTimestamp = now;

  return products;
}

/**
 * Clears the product cache
 * Useful for testing or forcing a refresh
 */
export function clearProductCache(): void {
  productCache = null;
  cacheTimestamp = null;
}

/**
 * Gets the current cache status
 * Useful for debugging and UI indicators
 * 
 * @returns Object with cache status information
 */
export function getCacheStatus(): {
  isCached: boolean;
  cacheAge: number | null;
  isExpired: boolean;
} {
  if (productCache === null || cacheTimestamp === null) {
    return {
      isCached: false,
      cacheAge: null,
      isExpired: false,
    };
  }

  const age = Date.now() - cacheTimestamp;
  return {
    isCached: true,
    cacheAge: age,
    isExpired: age >= CACHE_DURATION,
  };
}
