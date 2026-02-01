/**
 * Unit tests for product utility functions
 * 
 * Tests product fetching, parsing, validation, and caching functionality
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  fetchProducts,
  fetchProductsByCategory,
  parseProduct,
  fetchProductsWithCache,
  clearProductCache,
  getCacheStatus,
} from '../../lib/productUtils';
import { Product } from '../../lib/types';

// Mock fetch globally
global.fetch = vi.fn();

describe('productUtils', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    clearProductCache();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('parseProduct', () => {
    it('should parse valid product data', () => {
      const rawProduct = {
        id: 1,
        title: 'Test Product',
        price: 29.99,
        description: 'A test product',
        category: 'electronics',
        image: 'https://example.com/image.jpg',
        rating: {
          rate: 4.5,
          count: 100,
        },
      };

      const result = parseProduct(rawProduct);

      expect(result).toEqual({
        id: 1,
        title: 'Test Product',
        price: 29.99,
        description: 'A test product',
        category: 'electronics',
        image: 'https://example.com/image.jpg',
        rating: {
          rate: 4.5,
          count: 100,
        },
      });
    });

    it('should throw error for invalid category', () => {
      const rawProduct = {
        id: 1,
        title: 'Test Product',
        price: 29.99,
        description: 'A test product',
        category: 'invalid-category',
        image: 'https://example.com/image.jpg',
        rating: {
          rate: 4.5,
          count: 100,
        },
      };

      expect(() => parseProduct(rawProduct)).toThrow('Invalid product category');
    });

    it('should throw error for missing required fields', () => {
      const rawProduct = {
        id: 1,
        title: 'Test Product',
        // missing price
        description: 'A test product',
        category: 'electronics',
        image: 'https://example.com/image.jpg',
        rating: {
          rate: 4.5,
          count: 100,
        },
      };

      expect(() => parseProduct(rawProduct)).toThrow('Invalid product data');
    });

    it('should throw error for invalid rating structure', () => {
      const rawProduct = {
        id: 1,
        title: 'Test Product',
        price: 29.99,
        description: 'A test product',
        category: 'electronics',
        image: 'https://example.com/image.jpg',
        rating: {
          rate: 4.5,
          // missing count
        },
      };

      expect(() => parseProduct(rawProduct)).toThrow('Invalid product data');
    });

    it('should handle all valid categories', () => {
      const categories = ['electronics', 'jewelery', "men's clothing", "women's clothing"];

      categories.forEach((category) => {
        const rawProduct = {
          id: 1,
          title: 'Test Product',
          price: 29.99,
          description: 'A test product',
          category,
          image: 'https://example.com/image.jpg',
          rating: {
            rate: 4.5,
            count: 100,
          },
        };

        const result = parseProduct(rawProduct);
        expect(result.category).toBe(category);
      });
    });
  });

  describe('fetchProducts', () => {
    it('should fetch and parse products successfully', async () => {
      const mockProducts = [
        {
          id: 1,
          title: 'Product 1',
          price: 29.99,
          description: 'Description 1',
          category: 'electronics',
          image: 'https://example.com/1.jpg',
          rating: { rate: 4.5, count: 100 },
        },
        {
          id: 2,
          title: 'Product 2',
          price: 39.99,
          description: 'Description 2',
          category: 'jewelery',
          image: 'https://example.com/2.jpg',
          rating: { rate: 4.0, count: 50 },
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      });

      const result = await fetchProducts();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
      expect(global.fetch).toHaveBeenCalledWith('https://fakestoreapi.com/products');
    });

    it('should throw error on HTTP failure', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(fetchProducts()).rejects.toThrow('Failed to fetch products: HTTP 404 Not Found');
    });

    it('should throw error on invalid JSON response', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ invalid: 'not an array' }),
      });

      await expect(fetchProducts()).rejects.toThrow('Invalid API response: expected array of products');
    });

    it('should handle network errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchProducts()).rejects.toThrow('Network error');
    });

    it('should return valid products even if some fail to parse', async () => {
      const mockProducts = [
        {
          id: 1,
          title: 'Valid Product',
          price: 29.99,
          description: 'Description',
          category: 'electronics',
          image: 'https://example.com/1.jpg',
          rating: { rate: 4.5, count: 100 },
        },
        {
          id: 2,
          title: 'Invalid Product',
          // missing price
          description: 'Description',
          category: 'electronics',
          image: 'https://example.com/2.jpg',
          rating: { rate: 4.0, count: 50 },
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      });

      const result = await fetchProducts();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });
  });

  describe('fetchProductsByCategory', () => {
    it('should fetch products for a specific category', async () => {
      const mockProducts = [
        {
          id: 1,
          title: 'Electronics Product',
          price: 29.99,
          description: 'Description',
          category: 'electronics',
          image: 'https://example.com/1.jpg',
          rating: { rate: 4.5, count: 100 },
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      });

      const result = await fetchProductsByCategory('electronics');

      expect(result).toHaveLength(1);
      expect(result[0].category).toBe('electronics');
      expect(global.fetch).toHaveBeenCalledWith(
        'https://fakestoreapi.com/products/category/electronics'
      );
    });

    it('should handle category with spaces', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await fetchProductsByCategory("men's clothing");

      expect(global.fetch).toHaveBeenCalledWith(
        "https://fakestoreapi.com/products/category/men's%20clothing"
      );
    });

    it('should throw error on HTTP failure', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(fetchProductsByCategory('electronics')).rejects.toThrow(
        'Failed to fetch products for category electronics'
      );
    });
  });

  describe('fetchProductsWithCache', () => {
    it('should fetch and cache products on first call', async () => {
      const mockProducts = [
        {
          id: 1,
          title: 'Product 1',
          price: 29.99,
          description: 'Description',
          category: 'electronics',
          image: 'https://example.com/1.jpg',
          rating: { rate: 4.5, count: 100 },
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      });

      const result = await fetchProductsWithCache();

      expect(result).toHaveLength(1);
      expect(global.fetch).toHaveBeenCalledTimes(1);

      const cacheStatus = getCacheStatus();
      expect(cacheStatus.isCached).toBe(true);
      expect(cacheStatus.isExpired).toBe(false);
    });

    it('should return cached products on subsequent calls', async () => {
      const mockProducts = [
        {
          id: 1,
          title: 'Product 1',
          price: 29.99,
          description: 'Description',
          category: 'electronics',
          image: 'https://example.com/1.jpg',
          rating: { rate: 4.5, count: 100 },
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      });

      // First call - should fetch
      const result1 = await fetchProductsWithCache();
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Second call - should use cache
      const result2 = await fetchProductsWithCache();
      expect(global.fetch).toHaveBeenCalledTimes(1); // Still 1, not called again
      expect(result2).toEqual(result1);
    });

    it('should bypass cache when forceRefresh is true', async () => {
      const mockProducts1 = [
        {
          id: 1,
          title: 'Product 1',
          price: 29.99,
          description: 'Description',
          category: 'electronics',
          image: 'https://example.com/1.jpg',
          rating: { rate: 4.5, count: 100 },
        },
      ];

      const mockProducts2 = [
        {
          id: 2,
          title: 'Product 2',
          price: 39.99,
          description: 'Description',
          category: 'jewelery',
          image: 'https://example.com/2.jpg',
          rating: { rate: 4.0, count: 50 },
        },
      ];

      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockProducts1,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockProducts2,
        });

      // First call
      const result1 = await fetchProductsWithCache();
      expect(result1[0].id).toBe(1);

      // Second call with forceRefresh
      const result2 = await fetchProductsWithCache(true);
      expect(result2[0].id).toBe(2);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('clearProductCache', () => {
    it('should clear the cache', async () => {
      const mockProducts = [
        {
          id: 1,
          title: 'Product 1',
          price: 29.99,
          description: 'Description',
          category: 'electronics',
          image: 'https://example.com/1.jpg',
          rating: { rate: 4.5, count: 100 },
        },
      ];

      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockProducts,
      });

      // Fetch and cache
      await fetchProductsWithCache();
      expect(getCacheStatus().isCached).toBe(true);

      // Clear cache
      clearProductCache();
      expect(getCacheStatus().isCached).toBe(false);

      // Next fetch should call API again
      await fetchProductsWithCache();
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('getCacheStatus', () => {
    it('should return not cached when cache is empty', () => {
      const status = getCacheStatus();
      expect(status.isCached).toBe(false);
      expect(status.cacheAge).toBe(null);
      expect(status.isExpired).toBe(false);
    });

    it('should return cache status when cached', async () => {
      const mockProducts = [
        {
          id: 1,
          title: 'Product 1',
          price: 29.99,
          description: 'Description',
          category: 'electronics',
          image: 'https://example.com/1.jpg',
          rating: { rate: 4.5, count: 100 },
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      });

      await fetchProductsWithCache();

      const status = getCacheStatus();
      expect(status.isCached).toBe(true);
      expect(status.cacheAge).toBeGreaterThanOrEqual(0);
      expect(status.isExpired).toBe(false);
    });
  });
});
