/**
 * Integration tests for product utilities
 * 
 * These tests make real API calls to verify integration with Fake Store API
 * They are marked as integration tests and can be skipped in CI if needed
 */

import { describe, it, expect } from 'vitest';
import {
  fetchProducts,
  fetchProductsByCategory,
  fetchProductsWithCache,
  clearProductCache,
} from '../../lib/productUtils';

describe('productUtils integration', () => {
  // These tests make real API calls, so they may be slower
  // and could fail if the API is down
  
  it('should fetch real products from Fake Store API', async () => {
    const products = await fetchProducts();
    
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    
    // Verify first product has all required fields
    const firstProduct = products[0];
    expect(firstProduct).toHaveProperty('id');
    expect(firstProduct).toHaveProperty('title');
    expect(firstProduct).toHaveProperty('price');
    expect(firstProduct).toHaveProperty('description');
    expect(firstProduct).toHaveProperty('category');
    expect(firstProduct).toHaveProperty('image');
    expect(firstProduct).toHaveProperty('rating');
    expect(firstProduct.rating).toHaveProperty('rate');
    expect(firstProduct.rating).toHaveProperty('count');
  }, 10000); // 10 second timeout for API call

  it('should fetch products by category', async () => {
    const products = await fetchProductsByCategory('electronics');
    
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    
    // All products should be in electronics category
    products.forEach(product => {
      expect(product.category).toBe('electronics');
    });
  }, 10000);

  it('should cache products correctly', async () => {
    // Clear cache first
    clearProductCache();
    
    // First fetch
    const startTime1 = Date.now();
    const products1 = await fetchProductsWithCache();
    const duration1 = Date.now() - startTime1;
    
    // Second fetch (should be from cache, much faster)
    const startTime2 = Date.now();
    const products2 = await fetchProductsWithCache();
    const duration2 = Date.now() - startTime2;
    
    // Verify same products
    expect(products1).toEqual(products2);
    
    // Cache should be significantly faster (less than 10ms vs potentially 100ms+)
    expect(duration2).toBeLessThan(10);
    
    console.log(`First fetch: ${duration1}ms, Cached fetch: ${duration2}ms`);
  }, 15000);
});
