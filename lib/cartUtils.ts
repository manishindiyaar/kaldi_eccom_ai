/**
 * Cart utility functions for Jarvis Shopping Assistant
 * 
 * This file contains utility functions for managing the shopping cart,
 * including add, remove, clear operations, subtotal calculation, and
 * localStorage persistence.
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.5, 6.2, 6.5
 */

import { CartItem, CartState, Product, PersistedCart } from './types';

/**
 * Add a product to the cart with specified quantity
 * 
 * Requirement 5.1: Add items to cart with quantity
 * Requirement 5.2: Support adding multiple quantities
 * 
 * @param cart - Current cart state
 * @param product - Product to add
 * @param quantity - Quantity to add (default: 1)
 * @returns Updated cart state
 */
export function addToCart(
  cart: CartState,
  product: Product,
  quantity: number = 1
): CartState {
  // Validate quantity
  if (quantity <= 0) {
    throw new Error('Quantity must be greater than 0');
  }

  // Check if product already exists in cart
  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.id === product.id
  );

  let updatedItems: CartItem[];

  if (existingItemIndex >= 0) {
    // Update existing item quantity
    updatedItems = cart.items.map((item, index) =>
      index === existingItemIndex
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
  } else {
    // Add new item to cart
    updatedItems = [...cart.items, { product, quantity }];
  }

  // Calculate new subtotal
  const subtotal = calculateSubtotal(updatedItems);

  return {
    items: updatedItems,
    subtotal,
  };
}

/**
 * Remove a product from the cart
 * 
 * Requirement 5.3: Remove items from cart
 * 
 * @param cart - Current cart state
 * @param productId - ID of product to remove
 * @returns Updated cart state
 */
export function removeFromCart(cart: CartState, productId: number): CartState {
  // Filter out the item with matching product ID
  const updatedItems = cart.items.filter(
    (item) => item.product.id !== productId
  );

  // Calculate new subtotal
  const subtotal = calculateSubtotal(updatedItems);

  return {
    items: updatedItems,
    subtotal,
  };
}

/**
 * Clear all items from the cart
 * 
 * Requirement 5.5: Clear cart functionality
 * 
 * @returns Empty cart state
 */
export function clearCart(): CartState {
  return {
    items: [],
    subtotal: 0,
  };
}

/**
 * Calculate the subtotal for cart items
 * 
 * Requirement 6.2: Calculate cart subtotal
 * 
 * @param items - Array of cart items
 * @returns Subtotal amount
 */
export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);
}

/**
 * Update the quantity of an existing cart item
 * 
 * @param cart - Current cart state
 * @param productId - ID of product to update
 * @param quantity - New quantity (must be > 0)
 * @returns Updated cart state
 */
export function updateCartItemQuantity(
  cart: CartState,
  productId: number,
  quantity: number
): CartState {
  // Validate quantity
  if (quantity <= 0) {
    throw new Error('Quantity must be greater than 0');
  }

  // Update the item quantity
  const updatedItems = cart.items.map((item) =>
    item.product.id === productId ? { ...item, quantity } : item
  );

  // Calculate new subtotal
  const subtotal = calculateSubtotal(updatedItems);

  return {
    items: updatedItems,
    subtotal,
  };
}

/**
 * Save cart to localStorage
 * 
 * Requirement 6.5: Persist cart to localStorage
 * 
 * @param cart - Cart state to save
 */
export function saveCart(cart: CartState): void {
  try {
    const persistedCart: PersistedCart = {
      items: cart.items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      lastUpdated: new Date().toISOString(),
    };

    localStorage.setItem('jarvis-cart', JSON.stringify(persistedCart));
  } catch (error) {
    // Handle localStorage quota exceeded or other errors
    console.error('Failed to save cart to localStorage:', error);
  }
}

/**
 * Load cart from localStorage
 * 
 * Requirement 6.5: Load cart from localStorage
 * 
 * @param products - Array of all available products (needed to reconstruct cart items)
 * @returns Loaded cart state or empty cart if not found/invalid
 */
export function loadCart(products: Product[]): CartState {
  try {
    const savedData = localStorage.getItem('jarvis-cart');

    if (!savedData) {
      return clearCart();
    }

    const persistedCart: PersistedCart = JSON.parse(savedData);

    // Reconstruct cart items by matching product IDs
    const items: CartItem[] = persistedCart.items
      .map((savedItem) => {
        const product = products.find((p) => p.id === savedItem.productId);
        if (!product) {
          // Product no longer exists, skip it
          return null;
        }
        return {
          product,
          quantity: savedItem.quantity,
        };
      })
      .filter((item): item is CartItem => item !== null);

    // Calculate subtotal
    const subtotal = calculateSubtotal(items);

    return {
      items,
      subtotal,
    };
  } catch (error) {
    // Handle JSON parse errors or other issues
    console.error('Failed to load cart from localStorage:', error);
    return clearCart();
  }
}

/**
 * Get the total number of items in the cart
 * 
 * @param cart - Cart state
 * @returns Total item count
 */
export function getCartItemCount(cart: CartState): number {
  return cart.items.reduce((count, item) => count + item.quantity, 0);
}

/**
 * Check if a product is in the cart
 * 
 * @param cart - Cart state
 * @param productId - Product ID to check
 * @returns True if product is in cart
 */
export function isProductInCart(cart: CartState, productId: number): boolean {
  return cart.items.some((item) => item.product.id === productId);
}

/**
 * Get the quantity of a specific product in the cart
 * 
 * @param cart - Cart state
 * @param productId - Product ID to check
 * @returns Quantity of product in cart (0 if not found)
 */
export function getProductQuantity(cart: CartState, productId: number): number {
  const item = cart.items.find((item) => item.product.id === productId);
  return item ? item.quantity : 0;
}
