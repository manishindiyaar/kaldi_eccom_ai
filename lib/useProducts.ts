/**
 * useProducts custom hook for product state management
 * 
 * This hook manages the product data layer including:
 * - Fetching products from the Fake Store API
 * - Loading, error, and success states
 * - Category filtering
 * - Current product index management
 * 
 * Requirements: 2.2, 3.1, 9.1, 9.2
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product, ProductCategory } from './types';
import { fetchProductsWithCache } from './productUtils';

/**
 * Return type for useProducts hook
 */
export interface UseProductsReturn {
  // Product data
  products: Product[];
  filteredProducts: Product[];
  currentProduct: Product | null;
  currentProductIndex: number;
  
  // State flags
  isLoading: boolean;
  error: string | null;
  
  // Category filter
  activeCategory: ProductCategory | 'all';
  
  // Actions
  setCategory: (category: ProductCategory | 'all') => void;
  setCurrentIndex: (index: number) => void;
  nextProduct: () => void;
  previousProduct: () => void;
  refreshProducts: () => Promise<void>;
}

/**
 * Custom hook for managing product state
 * 
 * Requirement 2.2: Handle loading, error, and success states
 * Requirement 3.1: Implement category filtering logic
 * Requirement 9.1: Support filtering by category
 * Requirement 9.2: Display only products in selected category
 * 
 * @returns UseProductsReturn object with product state and actions
 */
export function useProducts(): UseProductsReturn {
  // Product state
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentProductIndex, setCurrentProductIndex] = useState<number>(0);
  
  // Loading and error state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Category filter state
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');

  /**
   * Fetches products from the API
   * Requirement 2.2: Show loading indicator during fetch
   */
  const loadProducts = useCallback(async (forceRefresh: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const fetchedProducts = await fetchProductsWithCache(forceRefresh);
      setProducts(fetchedProducts);
      
      // If no category filter is active, show all products
      if (activeCategory === 'all') {
        setFilteredProducts(fetchedProducts);
      } else {
        // Apply current category filter
        const filtered = fetchedProducts.filter(
          (product) => product.category === activeCategory
        );
        setFilteredProducts(filtered);
      }
      
      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
      setError(errorMessage);
      setIsLoading(false);
      
      // Log error for debugging (Requirement 10.5)
      console.error('[useProducts] Error loading products:', err);
    }
  }, [activeCategory]);

  /**
   * Initial product fetch on mount
   * Requirement 2.1: Fetch products when application loads
   */
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  /**
   * Apply category filter to products
   * Requirement 3.1: Filter products by category
   * Requirement 9.1: Support filtering by electronics, jewelery, men's clothing, women's clothing
   * Requirement 9.2: Show only products in selected category
   */
  const setCategory = useCallback((category: ProductCategory | 'all') => {
    setActiveCategory(category);
    
    if (category === 'all') {
      // Requirement 3.5: Show all products when 'all' is selected
      setFilteredProducts(products);
    } else {
      // Filter products by selected category
      const filtered = products.filter((product) => product.category === category);
      setFilteredProducts(filtered);
    }
    
    // Requirement 9.5: Reset to first product when switching categories
    setCurrentProductIndex(0);
  }, [products]);

  /**
   * Set current product index with bounds checking
   */
  const setCurrentIndex = useCallback((index: number) => {
    if (filteredProducts.length === 0) {
      setCurrentProductIndex(0);
      return;
    }
    
    // Clamp index to valid range
    const clampedIndex = Math.max(0, Math.min(index, filteredProducts.length - 1));
    setCurrentProductIndex(clampedIndex);
  }, [filteredProducts.length]);

  /**
   * Navigate to next product
   * Requirement 3.2: Navigate to next product
   */
  const nextProduct = useCallback(() => {
    if (filteredProducts.length === 0) return;
    
    // Wrap to first product if at end
    const nextIndex = (currentProductIndex + 1) % filteredProducts.length;
    setCurrentProductIndex(nextIndex);
  }, [currentProductIndex, filteredProducts.length]);

  /**
   * Navigate to previous product
   * Requirement 3.3: Navigate to previous product
   */
  const previousProduct = useCallback(() => {
    if (filteredProducts.length === 0) return;
    
    // Wrap to last product if at beginning
    const prevIndex = currentProductIndex === 0 
      ? filteredProducts.length - 1 
      : currentProductIndex - 1;
    setCurrentProductIndex(prevIndex);
  }, [currentProductIndex, filteredProducts.length]);

  /**
   * Force refresh products from API
   * Useful for retry after error
   */
  const refreshProducts = useCallback(async () => {
    await loadProducts(true);
  }, [loadProducts]);

  /**
   * Get current product or null if no products
   */
  const currentProduct = filteredProducts.length > 0 
    ? filteredProducts[currentProductIndex] 
    : null;

  return {
    // Product data
    products,
    filteredProducts,
    currentProduct,
    currentProductIndex,
    
    // State flags
    isLoading,
    error,
    
    // Category filter
    activeCategory,
    
    // Actions
    setCategory,
    setCurrentIndex,
    nextProduct,
    previousProduct,
    refreshProducts,
  };
}
