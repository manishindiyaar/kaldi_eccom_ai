/**
 * Unit tests for useCart custom hook
 * 
 * Tests cart state management, operations, and localStorage persistence
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCart } from '@/lib/useCart';
import { Product } from '@/lib/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

// Sample test products
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

const mockProducts: Product[] = [mockProduct1, mockProduct2];

describe('useCart', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();
    
    // Clear console.error mock
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with empty cart', () => {
      const { result } = renderHook(() => useCart());

      expect(result.current.cart.items).toEqual([]);
      expect(result.current.cart.subtotal).toBe(0);
      expect(result.current.itemCount).toBe(0);
    });

    it('should load cart from localStorage if products are provided', () => {
      // Pre-populate localStorage
      const savedCart = {
        items: [{ productId: 1, quantity: 2 }],
        lastUpdated: new Date().toISOString(),
      };
      localStorageMock.setItem('jarvis-cart', JSON.stringify(savedCart));

      const { result } = renderHook(() => useCart(mockProducts));

      // Wait for effect to run
      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.items[0].product.id).toBe(1);
      expect(result.current.cart.items[0].quantity).toBe(2);
      expect(result.current.cart.subtotal).toBe(29.99 * 2);
    });
  });

  describe('addToCart', () => {
    it('should add a product with default quantity 1', () => {
      const { result } = renderHook(() => useCart(mockProducts));

      act(() => {
        result.current.addToCart(mockProduct1);
      });

      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.items[0].product.id).toBe(1);
      expect(result.current.cart.items[0].quantity).toBe(1);
      expect(result.current.cart.subtotal).toBe(29.99);
      expect(result.current.itemCount).toBe(1);
    });

    it('should add a product with specified quantity', () => {
      const { result } = renderHook(() => useCart(mockProducts));

      act(() => {
        result.current.addToCart(mockProduct1, 3);
      });

      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.items[0].quantity).toBe(3);
      expect(result.current.cart.subtotal).toBe(29.99 * 3);
      expect(result.current.itemCount).toBe(3);
    });

    it('should update quantity if product already exists in cart', () => {
      const { result } = renderHook(() => useCart(mockProducts));

      act(() => {
        result.current.addToCart(mockProduct1, 2);
      });

      act(() => {
        result.current.addToCart(mockProduct1, 3);
      });

      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.items[0].quantity).toBe(5);
      expect(result.current.cart.subtotal).toBe(29.99 * 5);
    });

    it('should add multiple different products', () => {
      const { result } = renderHook(() => useCart(mockProducts));

      act(() => {
        result.current.addToCart(mockProduct1, 2);
      });

      act(() => {
        result.current.addToCart(mockProduct2, 1);
      });

      expect(result.current.cart.items).toHaveLength(2);
      expect(result.current.cart.subtotal).toBe(29.99 * 2 + 49.99);
      expect(result.current.itemCount).toBe(3);
    });

    it('should throw error for invalid quantity', () => {
      const { result } = renderHook(() => useCart(mockProducts));
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        act(() => {
          result.current.addToCart(mockProduct1, 0);
        });
      }).toThrow('Quantity must be greater than 0');

      consoleErrorSpy.mockRestore();
    });
  });

  describe('removeFromCart', () => {
    it('should remove a product from cart', () => {
      const { result } = renderHook(() => useCart(mockProducts));

      act(() => {
        result.current.addToCart(mockProduct1, 2);
        result.current.addToCart(mockProduct2, 1);
      });

      act(() => {
        result.current.removeFromCart(1);
      });

      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.items[0].product.id).toBe(2);
      expect(result.current.cart.subtotal).toBe(49.99);
      expect(result.current.itemCount).toBe(1);
    });

    it('should handle removing non-existent product gracefully', () => {
      const { result } = renderHook(() => useCart(mockProducts));

      act(() => {
        result.current.addToCart(mockProduct1);
      });

      act(() => {
        result.current.removeFromCart(999);
      });

      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.items[0].product.id).toBe(1);
    });

    it('should result in empty cart when removing last item', () => {
      const { result } = renderHook(() => useCart(mockProducts));

      act(() => {
        result.current.addToCart(mockProduct1);
      });

      act(() => {
        result.current.removeFromCart(1);
      });

      expect(result.current.cart.items).toHaveLength(0);
      expect(result.current.cart.subtotal).toBe(0);
      expect(result.current.itemCount).toBe(0);
    });
  });

  describe('updateQuantity', () => {
    it('should update quantity of existing product', () => {
      const { result } = renderHook(() => useCart(mockProducts));

      act(() => {
        result.current.addToCart(mockProduct1, 2);
      });

      act(() => {
        result.current.updateQuantity(1, 5);
      });

      expect(result.current.cart.items[0].quantity).toBe(5);
      expect(result.current.cart.subtotal).toBe(29.99 * 5);
      expect(result.current.itemCount).toBe(5);
    });

    it('should throw error for invalid quantity', () => {
      const { result } = renderHook(() => useCart(mockProducts));
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      act(() => {
        result.current.addToCart(mockProduct1, 2);
      });

      expect(() => {
        act(() => {
          result.current.updateQuantity(1, 0);
        });
      }).toThrow('Quantity must be greater than 0');

      consoleErrorSpy.mockRestore();
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      const { result } = renderHook(() => useCart(mockProducts));

      act(() => {
        result.current.addToCart(mockProduct1, 2);
        result.current.addToCart(mockProduct2, 3);
      });

      act(() => {
        result.current.clearCart();
      });

      expect(result.current.cart.items).toHaveLength(0);
      expect(result.current.cart.subtotal).toBe(0);
      expect(result.current.itemCount).toBe(0);
    });

    it('should clear cart from localStorage', () => {
      const { result } = renderHook(() => useCart(mockProducts));

      act(() => {
        result.current.addToCart(mockProduct1, 2);
      });

      // Verify cart was saved to localStorage
      expect(localStorageMock.getItem('jarvis-cart')).not.toBeNull();

      act(() => {
        result.current.clearCart();
      });

      // Verify cart was removed from localStorage
      expect(localStorageMock.getItem('jarvis-cart')).toBeNull();
    });

    it('should handle clearing empty cart', () => {
      const { result } = renderHook(() => useCart(mockProducts));

      act(() => {
        result.current.clearCart();
      });

      expect(result.current.cart.items).toHaveLength(0);
      expect(result.current.cart.subtotal).toBe(0);
    });
  });

  describe('isProductInCart', () => {
    it('should return true if product is in cart', () => {
      const { result } = renderHook(() => useCart(mockProducts));

      act(() => {
        result.current.addToCart(mockProduct1);
      });

      expect(result.current.isProductInCart(1)).toBe(true);
    });

    it('should return false if product is not in cart', () => {
      const { result } = renderHook(() => useCart(mockProducts));

      act(() => {
        result.current.addToCart(mockProduct1);
      });

      expect(result.current.isProductInCart(2)).toBe(false);
    });
  });

  describe('getProductQuantity', () => {
    it('should return correct quantity for product in cart', () => {
      const { result } = renderHook(() => useCart(mockProducts));

      act(() => {
        result.current.addToCart(mockProduct1, 5);
      });

      expect(result.current.getProductQuantity(1)).toBe(5);
    });

    it('should return 0 for product not in cart', () => {
      const { result } = renderHook(() => useCart(mockProducts));

      act(() => {
        result.current.addToCart(mockProduct1);
      });

      expect(result.current.getProductQuantity(2)).toBe(0);
    });
  });

  describe('localStorage Persistence', () => {
    it('should save cart to localStorage when items are added', () => {
      const { result } = renderHook(() => useCart(mockProducts));

      act(() => {
        result.current.addToCart(mockProduct1, 2);
      });

      const savedData = localStorageMock.getItem('jarvis-cart');
      expect(savedData).not.toBeNull();

      const parsedData = JSON.parse(savedData!);
      expect(parsedData.items).toHaveLength(1);
      expect(parsedData.items[0].productId).toBe(1);
      expect(parsedData.items[0].quantity).toBe(2);
    });

    it('should restore cart from localStorage on mount', () => {
      // Pre-populate localStorage
      const savedCart = {
        items: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 1 },
        ],
        lastUpdated: new Date().toISOString(),
      };
      localStorageMock.setItem('jarvis-cart', JSON.stringify(savedCart));

      const { result } = renderHook(() => useCart(mockProducts));

      expect(result.current.cart.items).toHaveLength(2);
      expect(result.current.cart.items[0].product.id).toBe(1);
      expect(result.current.cart.items[0].quantity).toBe(2);
      expect(result.current.cart.items[1].product.id).toBe(2);
      expect(result.current.cart.items[1].quantity).toBe(1);
      expect(result.current.cart.subtotal).toBe(29.99 * 2 + 49.99);
    });

    it('should handle invalid localStorage data gracefully', () => {
      // Set invalid JSON in localStorage
      localStorageMock.setItem('jarvis-cart', 'invalid json');

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() => useCart(mockProducts));

      // Should initialize with empty cart
      expect(result.current.cart.items).toHaveLength(0);
      expect(result.current.cart.subtotal).toBe(0);

      consoleErrorSpy.mockRestore();
    });

    it('should skip products that no longer exist when loading from localStorage', () => {
      // Pre-populate localStorage with a product that doesn't exist
      const savedCart = {
        items: [
          { productId: 1, quantity: 2 },
          { productId: 999, quantity: 1 }, // Non-existent product
        ],
        lastUpdated: new Date().toISOString(),
      };
      localStorageMock.setItem('jarvis-cart', JSON.stringify(savedCart));

      const { result } = renderHook(() => useCart(mockProducts));

      // Should only load the existing product
      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.items[0].product.id).toBe(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle cart operations without products array', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct1);
      });

      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.items[0].product.id).toBe(1);
    });

    it('should calculate subtotal correctly with floating point prices', () => {
      const { result } = renderHook(() => useCart(mockProducts));

      act(() => {
        result.current.addToCart(mockProduct1, 3); // 29.99 * 3 = 89.97
      });

      // Allow for small floating point errors
      expect(result.current.cart.subtotal).toBeCloseTo(89.97, 2);
    });

    it('should maintain cart state across multiple operations', () => {
      const { result } = renderHook(() => useCart(mockProducts));

      // Add products
      act(() => {
        result.current.addToCart(mockProduct1, 2);
        result.current.addToCart(mockProduct2, 1);
      });

      // Update quantity
      act(() => {
        result.current.updateQuantity(1, 5);
      });

      // Remove one product
      act(() => {
        result.current.removeFromCart(2);
      });

      // Verify final state
      expect(result.current.cart.items).toHaveLength(1);
      expect(result.current.cart.items[0].product.id).toBe(1);
      expect(result.current.cart.items[0].quantity).toBe(5);
      expect(result.current.cart.subtotal).toBe(29.99 * 5);
    });
  });
});
