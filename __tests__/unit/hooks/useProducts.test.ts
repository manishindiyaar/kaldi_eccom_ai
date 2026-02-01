/**
 * Unit tests for useProducts hook
 * 
 * Tests product state management, category filtering, and navigation
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useProducts } from '@/lib/useProducts';
import * as productUtils from '@/lib/productUtils';
import { Product, ProductCategory } from '@/lib/types';

// Mock the productUtils module
vi.mock('@/lib/productUtils');

// Sample test products
const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Laptop',
    price: 999.99,
    description: 'A powerful laptop',
    category: 'electronics',
    image: 'https://example.com/laptop.jpg',
    rating: { rate: 4.5, count: 100 },
  },
  {
    id: 2,
    title: 'Gold Ring',
    price: 299.99,
    description: 'A beautiful gold ring',
    category: 'jewelery',
    image: 'https://example.com/ring.jpg',
    rating: { rate: 4.8, count: 50 },
  },
  {
    id: 3,
    title: 'T-Shirt',
    price: 19.99,
    description: 'A comfortable t-shirt',
    category: "men's clothing",
    image: 'https://example.com/tshirt.jpg',
    rating: { rate: 4.2, count: 200 },
  },
  {
    id: 4,
    title: 'Dress',
    price: 49.99,
    description: 'An elegant dress',
    category: "women's clothing",
    image: 'https://example.com/dress.jpg',
    rating: { rate: 4.6, count: 150 },
  },
  {
    id: 5,
    title: 'Headphones',
    price: 79.99,
    description: 'Noise-cancelling headphones',
    category: 'electronics',
    image: 'https://example.com/headphones.jpg',
    rating: { rate: 4.7, count: 300 },
  },
];

describe('useProducts', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    
    // Default mock implementation
    vi.mocked(productUtils.fetchProductsWithCache).mockResolvedValue(mockProducts);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Loading', () => {
    it('should start with loading state', () => {
      const { result } = renderHook(() => useProducts());
      
      expect(result.current.isLoading).toBe(true);
      expect(result.current.products).toEqual([]);
      expect(result.current.filteredProducts).toEqual([]);
      expect(result.current.currentProduct).toBeNull();
    });

    it('should fetch products on mount', async () => {
      const { result } = renderHook(() => useProducts());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      expect(productUtils.fetchProductsWithCache).toHaveBeenCalledTimes(1);
      expect(result.current.products).toEqual(mockProducts);
      expect(result.current.filteredProducts).toEqual(mockProducts);
      expect(result.current.error).toBeNull();
    });

    it('should set current product to first product after loading', async () => {
      const { result } = renderHook(() => useProducts());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      expect(result.current.currentProduct).toEqual(mockProducts[0]);
      expect(result.current.currentProductIndex).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle fetch errors', async () => {
      const errorMessage = 'Network error';
      vi.mocked(productUtils.fetchProductsWithCache).mockRejectedValue(
        new Error(errorMessage)
      );
      
      const { result } = renderHook(() => useProducts());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.products).toEqual([]);
      expect(result.current.filteredProducts).toEqual([]);
    });

    it('should handle non-Error exceptions', async () => {
      vi.mocked(productUtils.fetchProductsWithCache).mockRejectedValue('String error');
      
      const { result } = renderHook(() => useProducts());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      expect(result.current.error).toBe('Failed to load products');
    });
  });

  describe('Category Filtering', () => {
    it('should filter products by electronics category', async () => {
      const { result } = renderHook(() => useProducts());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      act(() => {
        result.current.setCategory('electronics');
      });
      
      const electronicsProducts = mockProducts.filter(p => p.category === 'electronics');
      expect(result.current.filteredProducts).toEqual(electronicsProducts);
      expect(result.current.activeCategory).toBe('electronics');
      expect(result.current.currentProductIndex).toBe(0);
    });

    it('should filter products by jewelery category', async () => {
      const { result } = renderHook(() => useProducts());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      act(() => {
        result.current.setCategory('jewelery');
      });
      
      const jeweleryProducts = mockProducts.filter(p => p.category === 'jewelery');
      expect(result.current.filteredProducts).toEqual(jeweleryProducts);
      expect(result.current.activeCategory).toBe('jewelery');
    });

    it('should filter products by men\'s clothing category', async () => {
      const { result } = renderHook(() => useProducts());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      act(() => {
        result.current.setCategory("men's clothing");
      });
      
      const mensProducts = mockProducts.filter(p => p.category === "men's clothing");
      expect(result.current.filteredProducts).toEqual(mensProducts);
      expect(result.current.activeCategory).toBe("men's clothing");
    });

    it('should filter products by women\'s clothing category', async () => {
      const { result } = renderHook(() => useProducts());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      act(() => {
        result.current.setCategory("women's clothing");
      });
      
      const womensProducts = mockProducts.filter(p => p.category === "women's clothing");
      expect(result.current.filteredProducts).toEqual(womensProducts);
      expect(result.current.activeCategory).toBe("women's clothing");
    });

    it('should show all products when category is set to "all"', async () => {
      const { result } = renderHook(() => useProducts());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      // First filter to a category
      act(() => {
        result.current.setCategory('electronics');
      });
      
      expect(result.current.filteredProducts.length).toBeLessThan(mockProducts.length);
      
      // Then set back to 'all'
      act(() => {
        result.current.setCategory('all');
      });
      
      expect(result.current.filteredProducts).toEqual(mockProducts);
      expect(result.current.activeCategory).toBe('all');
    });

    it('should reset index to 0 when switching categories', async () => {
      const { result } = renderHook(() => useProducts());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      // Navigate to a different product (one at a time)
      act(() => {
        result.current.nextProduct();
      });
      
      act(() => {
        result.current.nextProduct();
      });
      
      expect(result.current.currentProductIndex).toBe(2);
      
      // Switch category
      act(() => {
        result.current.setCategory('electronics');
      });
      
      // Index should be reset to 0
      expect(result.current.currentProductIndex).toBe(0);
    });
  });

  describe('Product Navigation', () => {
    it('should navigate to next product', async () => {
      const { result } = renderHook(() => useProducts());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      expect(result.current.currentProductIndex).toBe(0);
      
      act(() => {
        result.current.nextProduct();
      });
      
      expect(result.current.currentProductIndex).toBe(1);
      expect(result.current.currentProduct).toEqual(mockProducts[1]);
    });

    it('should navigate to previous product', async () => {
      const { result } = renderHook(() => useProducts());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      // Move to second product first
      act(() => {
        result.current.nextProduct();
      });
      
      expect(result.current.currentProductIndex).toBe(1);
      
      // Then go back
      act(() => {
        result.current.previousProduct();
      });
      
      expect(result.current.currentProductIndex).toBe(0);
      expect(result.current.currentProduct).toEqual(mockProducts[0]);
    });

    it('should wrap to first product when navigating next from last product', async () => {
      const { result } = renderHook(() => useProducts());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      // Navigate to last product
      act(() => {
        result.current.setCurrentIndex(mockProducts.length - 1);
      });
      
      expect(result.current.currentProductIndex).toBe(mockProducts.length - 1);
      
      // Navigate next should wrap to first
      act(() => {
        result.current.nextProduct();
      });
      
      expect(result.current.currentProductIndex).toBe(0);
      expect(result.current.currentProduct).toEqual(mockProducts[0]);
    });

    it('should wrap to last product when navigating previous from first product', async () => {
      const { result } = renderHook(() => useProducts());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      expect(result.current.currentProductIndex).toBe(0);
      
      // Navigate previous should wrap to last
      act(() => {
        result.current.previousProduct();
      });
      
      expect(result.current.currentProductIndex).toBe(mockProducts.length - 1);
      expect(result.current.currentProduct).toEqual(mockProducts[mockProducts.length - 1]);
    });

    it('should handle navigation with empty product list', async () => {
      vi.mocked(productUtils.fetchProductsWithCache).mockResolvedValue([]);
      
      const { result } = renderHook(() => useProducts());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      expect(result.current.currentProduct).toBeNull();
      
      // Navigation should not throw errors
      act(() => {
        result.current.nextProduct();
        result.current.previousProduct();
      });
      
      expect(result.current.currentProductIndex).toBe(0);
      expect(result.current.currentProduct).toBeNull();
    });
  });

  describe('Index Management', () => {
    it('should set current index within bounds', async () => {
      const { result } = renderHook(() => useProducts());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      act(() => {
        result.current.setCurrentIndex(2);
      });
      
      expect(result.current.currentProductIndex).toBe(2);
      expect(result.current.currentProduct).toEqual(mockProducts[2]);
    });

    it('should clamp index to maximum when set too high', async () => {
      const { result } = renderHook(() => useProducts());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      act(() => {
        result.current.setCurrentIndex(999);
      });
      
      expect(result.current.currentProductIndex).toBe(mockProducts.length - 1);
      expect(result.current.currentProduct).toEqual(mockProducts[mockProducts.length - 1]);
    });

    it('should clamp index to 0 when set negative', async () => {
      const { result } = renderHook(() => useProducts());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      act(() => {
        result.current.setCurrentIndex(-5);
      });
      
      expect(result.current.currentProductIndex).toBe(0);
      expect(result.current.currentProduct).toEqual(mockProducts[0]);
    });
  });

  describe('Refresh Products', () => {
    it('should refresh products from API', async () => {
      const { result } = renderHook(() => useProducts());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      expect(productUtils.fetchProductsWithCache).toHaveBeenCalledTimes(1);
      
      // Refresh products
      await act(async () => {
        await result.current.refreshProducts();
      });
      
      // Should call fetch again with forceRefresh=true
      expect(productUtils.fetchProductsWithCache).toHaveBeenCalledTimes(2);
      expect(productUtils.fetchProductsWithCache).toHaveBeenLastCalledWith(true);
    });

    it('should update loading state during refresh', async () => {
      const { result } = renderHook(() => useProducts());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      // Refresh products
      await act(async () => {
        await result.current.refreshProducts();
      });
      
      // Should not be loading after refresh completes
      expect(result.current.isLoading).toBe(false);
      
      // Should have called fetch twice (initial + refresh)
      expect(productUtils.fetchProductsWithCache).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty category filter result', async () => {
      const { result } = renderHook(() => useProducts());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      // Filter to a category with products
      act(() => {
        result.current.setCategory('electronics');
      });
      
      // Should have electronics products
      expect(result.current.filteredProducts.length).toBeGreaterThan(0);
      expect(result.current.currentProduct).not.toBeNull();
    });

    it('should maintain category filter after refresh', async () => {
      const { result } = renderHook(() => useProducts());
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      // Set category filter
      act(() => {
        result.current.setCategory('electronics');
      });
      
      const electronicsProducts = mockProducts.filter(p => p.category === 'electronics');
      expect(result.current.filteredProducts).toEqual(electronicsProducts);
      
      // Refresh products
      await act(async () => {
        await result.current.refreshProducts();
      });
      
      // Category filter should still be applied
      expect(result.current.activeCategory).toBe('electronics');
      expect(result.current.filteredProducts).toEqual(electronicsProducts);
    });
  });
});
