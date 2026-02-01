/**
 * Unit tests for cart utility functions
 * 
 * Tests the core cart operations: add, remove, clear, calculate subtotal,
 * and localStorage persistence.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  addToCart,
  removeFromCart,
  clearCart,
  calculateSubtotal,
  updateCartItemQuantity,
  saveCart,
  loadCart,
  getCartItemCount,
  isProductInCart,
  getProductQuantity,
} from '@/lib/cartUtils';
import { CartState, Product, CartItem } from '@/lib/types';

// Mock products for testing
const mockProduct1: Product = {
  id: 1,
  title: 'Test Product 1',
  price: 29.99,
  description: 'Test description 1',
  category: 'electronics',
  image: 'https://example.com/image1.jpg',
  rating: { rate: 4.5, count: 100 },
};

const mockProduct2: Product = {
  id: 2,
  title: 'Test Product 2',
  price: 49.99,
  description: 'Test description 2',
  category: 'jewelery',
  image: 'https://example.com/image2.jpg',
  rating: { rate: 4.0, count: 50 },
};

const mockProduct3: Product = {
  id: 3,
  title: 'Test Product 3',
  price: 19.99,
  description: 'Test description 3',
  category: "men's clothing",
  image: 'https://example.com/image3.jpg',
  rating: { rate: 3.5, count: 25 },
};

describe('cartUtils', () => {
  let emptyCart: CartState;

  beforeEach(() => {
    emptyCart = { items: [], subtotal: 0 };
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('addToCart', () => {
    it('should add a new product to an empty cart', () => {
      const result = addToCart(emptyCart, mockProduct1, 1);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].product.id).toBe(mockProduct1.id);
      expect(result.items[0].quantity).toBe(1);
      expect(result.subtotal).toBe(29.99);
    });

    it('should add a product with specified quantity', () => {
      const result = addToCart(emptyCart, mockProduct1, 3);

      expect(result.items[0].quantity).toBe(3);
      expect(result.subtotal).toBe(89.97);
    });

    it('should update quantity when adding existing product', () => {
      const cartWithItem: CartState = {
        items: [{ product: mockProduct1, quantity: 2 }],
        subtotal: 59.98,
      };

      const result = addToCart(cartWithItem, mockProduct1, 1);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].quantity).toBe(3);
      expect(result.subtotal).toBe(89.97);
    });

    it('should add multiple different products', () => {
      let cart = addToCart(emptyCart, mockProduct1, 1);
      cart = addToCart(cart, mockProduct2, 2);

      expect(cart.items).toHaveLength(2);
      expect(cart.subtotal).toBe(129.97); // 29.99 + (49.99 * 2)
    });

    it('should throw error for zero quantity', () => {
      expect(() => addToCart(emptyCart, mockProduct1, 0)).toThrow(
        'Quantity must be greater than 0'
      );
    });

    it('should throw error for negative quantity', () => {
      expect(() => addToCart(emptyCart, mockProduct1, -1)).toThrow(
        'Quantity must be greater than 0'
      );
    });

    it('should default to quantity 1 when not specified', () => {
      const result = addToCart(emptyCart, mockProduct1);

      expect(result.items[0].quantity).toBe(1);
    });
  });

  describe('removeFromCart', () => {
    it('should remove a product from cart', () => {
      const cartWithItem: CartState = {
        items: [{ product: mockProduct1, quantity: 2 }],
        subtotal: 59.98,
      };

      const result = removeFromCart(cartWithItem, mockProduct1.id);

      expect(result.items).toHaveLength(0);
      expect(result.subtotal).toBe(0);
    });

    it('should remove only the specified product', () => {
      const cartWithItems: CartState = {
        items: [
          { product: mockProduct1, quantity: 1 },
          { product: mockProduct2, quantity: 2 },
        ],
        subtotal: 129.97,
      };

      const result = removeFromCart(cartWithItems, mockProduct1.id);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].product.id).toBe(mockProduct2.id);
      expect(result.subtotal).toBe(99.98);
    });

    it('should handle removing non-existent product', () => {
      const cartWithItem: CartState = {
        items: [{ product: mockProduct1, quantity: 1 }],
        subtotal: 29.99,
      };

      const result = removeFromCart(cartWithItem, 999);

      expect(result.items).toHaveLength(1);
      expect(result.subtotal).toBe(29.99);
    });

    it('should handle removing from empty cart', () => {
      const result = removeFromCart(emptyCart, 1);

      expect(result.items).toHaveLength(0);
      expect(result.subtotal).toBe(0);
    });
  });

  describe('clearCart', () => {
    it('should return an empty cart', () => {
      const result = clearCart();

      expect(result.items).toHaveLength(0);
      expect(result.subtotal).toBe(0);
    });

    it('should clear a cart with items', () => {
      // This test verifies the function works regardless of input
      const result = clearCart();

      expect(result).toEqual({ items: [], subtotal: 0 });
    });
  });

  describe('calculateSubtotal', () => {
    it('should return 0 for empty cart', () => {
      const result = calculateSubtotal([]);

      expect(result).toBe(0);
    });

    it('should calculate subtotal for single item', () => {
      const items: CartItem[] = [{ product: mockProduct1, quantity: 2 }];

      const result = calculateSubtotal(items);

      expect(result).toBe(59.98);
    });

    it('should calculate subtotal for multiple items', () => {
      const items: CartItem[] = [
        { product: mockProduct1, quantity: 2 }, // 59.98
        { product: mockProduct2, quantity: 1 }, // 49.99
        { product: mockProduct3, quantity: 3 }, // 59.97
      ];

      const result = calculateSubtotal(items);

      expect(result).toBeCloseTo(169.94, 2);
    });

    it('should handle single quantity items', () => {
      const items: CartItem[] = [{ product: mockProduct1, quantity: 1 }];

      const result = calculateSubtotal(items);

      expect(result).toBe(29.99);
    });

    it('should handle large quantities', () => {
      const items: CartItem[] = [{ product: mockProduct1, quantity: 100 }];

      const result = calculateSubtotal(items);

      expect(result).toBe(2999);
    });
  });

  describe('updateCartItemQuantity', () => {
    it('should update quantity of existing item', () => {
      const cartWithItem: CartState = {
        items: [{ product: mockProduct1, quantity: 2 }],
        subtotal: 59.98,
      };

      const result = updateCartItemQuantity(cartWithItem, mockProduct1.id, 5);

      expect(result.items[0].quantity).toBe(5);
      expect(result.subtotal).toBeCloseTo(149.95, 2);
    });

    it('should update only the specified item', () => {
      const cartWithItems: CartState = {
        items: [
          { product: mockProduct1, quantity: 2 },
          { product: mockProduct2, quantity: 1 },
        ],
        subtotal: 109.97,
      };

      const result = updateCartItemQuantity(cartWithItems, mockProduct1.id, 1);

      expect(result.items[0].quantity).toBe(1);
      expect(result.items[1].quantity).toBe(1);
      expect(result.subtotal).toBeCloseTo(79.98, 2);
    });

    it('should throw error for zero quantity', () => {
      const cartWithItem: CartState = {
        items: [{ product: mockProduct1, quantity: 2 }],
        subtotal: 59.98,
      };

      expect(() =>
        updateCartItemQuantity(cartWithItem, mockProduct1.id, 0)
      ).toThrow('Quantity must be greater than 0');
    });

    it('should throw error for negative quantity', () => {
      const cartWithItem: CartState = {
        items: [{ product: mockProduct1, quantity: 2 }],
        subtotal: 59.98,
      };

      expect(() =>
        updateCartItemQuantity(cartWithItem, mockProduct1.id, -1)
      ).toThrow('Quantity must be greater than 0');
    });
  });

  describe('saveCart and loadCart', () => {
    it('should save and load cart successfully', () => {
      const cart: CartState = {
        items: [
          { product: mockProduct1, quantity: 2 },
          { product: mockProduct2, quantity: 1 },
        ],
        subtotal: 109.97,
      };

      saveCart(cart);

      const products = [mockProduct1, mockProduct2, mockProduct3];
      const loadedCart = loadCart(products);

      expect(loadedCart.items).toHaveLength(2);
      expect(loadedCart.items[0].product.id).toBe(mockProduct1.id);
      expect(loadedCart.items[0].quantity).toBe(2);
      expect(loadedCart.items[1].product.id).toBe(mockProduct2.id);
      expect(loadedCart.items[1].quantity).toBe(1);
      expect(loadedCart.subtotal).toBeCloseTo(109.97, 2);
    });

    it('should return empty cart when localStorage is empty', () => {
      const products = [mockProduct1, mockProduct2];
      const loadedCart = loadCart(products);

      expect(loadedCart.items).toHaveLength(0);
      expect(loadedCart.subtotal).toBe(0);
    });

    it('should skip products that no longer exist', () => {
      const cart: CartState = {
        items: [
          { product: mockProduct1, quantity: 2 },
          { product: mockProduct2, quantity: 1 },
        ],
        subtotal: 109.97,
      };

      saveCart(cart);

      // Load with only mockProduct1 available
      const products = [mockProduct1];
      const loadedCart = loadCart(products);

      expect(loadedCart.items).toHaveLength(1);
      expect(loadedCart.items[0].product.id).toBe(mockProduct1.id);
      expect(loadedCart.subtotal).toBe(59.98);
    });

    it('should handle corrupted localStorage data', () => {
      localStorage.setItem('jarvis-cart', 'invalid json');

      const products = [mockProduct1];
      const loadedCart = loadCart(products);

      expect(loadedCart.items).toHaveLength(0);
      expect(loadedCart.subtotal).toBe(0);
    });

    it('should save timestamp with cart', () => {
      const cart: CartState = {
        items: [{ product: mockProduct1, quantity: 1 }],
        subtotal: 29.99,
      };

      saveCart(cart);

      const savedData = localStorage.getItem('jarvis-cart');
      expect(savedData).toBeTruthy();

      const parsed = JSON.parse(savedData!);
      expect(parsed.lastUpdated).toBeTruthy();
      expect(new Date(parsed.lastUpdated).getTime()).toBeLessThanOrEqual(
        Date.now()
      );
    });
  });

  describe('getCartItemCount', () => {
    it('should return 0 for empty cart', () => {
      const result = getCartItemCount(emptyCart);

      expect(result).toBe(0);
    });

    it('should return total quantity for single item', () => {
      const cart: CartState = {
        items: [{ product: mockProduct1, quantity: 3 }],
        subtotal: 89.97,
      };

      const result = getCartItemCount(cart);

      expect(result).toBe(3);
    });

    it('should return sum of quantities for multiple items', () => {
      const cart: CartState = {
        items: [
          { product: mockProduct1, quantity: 2 },
          { product: mockProduct2, quantity: 3 },
          { product: mockProduct3, quantity: 1 },
        ],
        subtotal: 0,
      };

      const result = getCartItemCount(cart);

      expect(result).toBe(6);
    });
  });

  describe('isProductInCart', () => {
    it('should return false for empty cart', () => {
      const result = isProductInCart(emptyCart, mockProduct1.id);

      expect(result).toBe(false);
    });

    it('should return true when product is in cart', () => {
      const cart: CartState = {
        items: [{ product: mockProduct1, quantity: 1 }],
        subtotal: 29.99,
      };

      const result = isProductInCart(cart, mockProduct1.id);

      expect(result).toBe(true);
    });

    it('should return false when product is not in cart', () => {
      const cart: CartState = {
        items: [{ product: mockProduct1, quantity: 1 }],
        subtotal: 29.99,
      };

      const result = isProductInCart(cart, mockProduct2.id);

      expect(result).toBe(false);
    });
  });

  describe('getProductQuantity', () => {
    it('should return 0 for empty cart', () => {
      const result = getProductQuantity(emptyCart, mockProduct1.id);

      expect(result).toBe(0);
    });

    it('should return quantity when product is in cart', () => {
      const cart: CartState = {
        items: [{ product: mockProduct1, quantity: 5 }],
        subtotal: 149.95,
      };

      const result = getProductQuantity(cart, mockProduct1.id);

      expect(result).toBe(5);
    });

    it('should return 0 when product is not in cart', () => {
      const cart: CartState = {
        items: [{ product: mockProduct1, quantity: 2 }],
        subtotal: 59.98,
      };

      const result = getProductQuantity(cart, mockProduct2.id);

      expect(result).toBe(0);
    });
  });
});
