/**
 * useCart custom hook for cart state management
 * 
 * This hook manages the shopping cart state including:
 * - Cart operations (add, remove, clear, update quantity)
 * - localStorage persistence
 * - Cart calculations (subtotal, item count)
 * - Integration with product data for cart restoration
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.5, 5.6, 6.2, 6.5
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { CartState, Product } from './types';
import {
  addToCart as addToCartUtil,
  removeFromCart as removeFromCartUtil,
  clearCart as clearCartUtil,
  updateCartItemQuantity,
  saveCart,
  loadCart,
  getCartItemCount,
  isProductInCart as isProductInCartUtil,
  getProductQuantity as getProductQuantityUtil,
} from './cartUtils';

/**
 * Return type for useCart hook
 */
export interface UseCartReturn {
  // Cart state
  cart: CartState;
  itemCount: number;
  
  // Cart operations
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  
  // Cart queries
  isProductInCart: (productId: number) => boolean;
  getProductQuantity: (productId: number) => number;
}

/**
 * Custom hook for managing cart state
 * 
 * Requirement 5.1: Add items to cart
 * Requirement 5.2: Add items with specified quantity
 * Requirement 5.3: Remove items from cart
 * Requirement 5.5: Clear cart functionality
 * Requirement 5.6: Update cart total when items change
 * Requirement 6.2: Calculate and display cart subtotal
 * Requirement 6.5: Persist cart to localStorage
 * 
 * @param products - Array of all available products (needed for cart restoration from localStorage)
 * @returns UseCartReturn object with cart state and operations
 */
export function useCart(products: Product[] = []): UseCartReturn {
  // Cart state
  const [cart, setCart] = useState<CartState>({
    items: [],
    subtotal: 0,
  });

  /**
   * Load cart from localStorage on mount
   * Requirement 6.5: Load persisted cart on application start
   */
  useEffect(() => {
    // Only load from localStorage if we have products available
    if (products.length > 0) {
      const loadedCart = loadCart(products);
      setCart(loadedCart);
    }
  }, [products]);

  /**
   * Save cart to localStorage whenever it changes
   * Requirement 6.5: Persist cart across page refreshes
   */
  useEffect(() => {
    // Only save if cart has been initialized (not empty initial state)
    if (cart.items.length > 0 || cart.subtotal > 0) {
      saveCart(cart);
    }
  }, [cart]);

  /**
   * Add a product to the cart
   * Requirement 5.1: Add items to cart with quantity 1
   * Requirement 5.2: Add items with specified quantity
   * Requirement 5.6: Update cart total when items are added
   */
  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    try {
      setCart((prevCart) => {
        const updatedCart = addToCartUtil(prevCart, product, quantity);
        return updatedCart;
      });
    } catch (error) {
      // Log error for debugging (Requirement 10.5)
      console.error('[useCart] Error adding to cart:', error);
      throw error;
    }
  }, []);

  /**
   * Remove a product from the cart
   * Requirement 5.3: Remove items from cart
   * Requirement 5.6: Update cart total when items are removed
   */
  const removeFromCart = useCallback((productId: number) => {
    try {
      setCart((prevCart) => {
        const updatedCart = removeFromCartUtil(prevCart, productId);
        return updatedCart;
      });
    } catch (error) {
      // Log error for debugging (Requirement 10.5)
      console.error('[useCart] Error removing from cart:', error);
      throw error;
    }
  }, []);

  /**
   * Update the quantity of a cart item
   * Requirement 5.6: Update cart total when quantity changes
   */
  const updateQuantity = useCallback((productId: number, quantity: number) => {
    try {
      setCart((prevCart) => {
        const updatedCart = updateCartItemQuantity(prevCart, productId, quantity);
        return updatedCart;
      });
    } catch (error) {
      // Log error for debugging (Requirement 10.5)
      console.error('[useCart] Error updating quantity:', error);
      throw error;
    }
  }, []);

  /**
   * Clear all items from the cart
   * Requirement 5.5: Clear cart functionality
   */
  const clearCart = useCallback(() => {
    try {
      const emptyCart = clearCartUtil();
      setCart(emptyCart);
      
      // Clear from localStorage as well
      try {
        localStorage.removeItem('jarvis-cart');
      } catch (error) {
        console.error('[useCart] Error clearing cart from localStorage:', error);
      }
    } catch (error) {
      // Log error for debugging (Requirement 10.5)
      console.error('[useCart] Error clearing cart:', error);
      throw error;
    }
  }, []);

  /**
   * Check if a product is in the cart
   */
  const isProductInCart = useCallback((productId: number): boolean => {
    return isProductInCartUtil(cart, productId);
  }, [cart]);

  /**
   * Get the quantity of a specific product in the cart
   */
  const getProductQuantity = useCallback((productId: number): number => {
    return getProductQuantityUtil(cart, productId);
  }, [cart]);

  /**
   * Calculate total item count
   * Requirement 6.2: Display cart item count
   */
  const itemCount = getCartItemCount(cart);

  return {
    // Cart state
    cart,
    itemCount,
    
    // Cart operations
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    
    // Cart queries
    isProductInCart,
    getProductQuantity,
  };
}
