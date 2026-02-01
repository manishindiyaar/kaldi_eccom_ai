/**
 * Core type definitions for Jarvis Shopping Assistant
 * 
 * This file contains the main application types for products, cart, and voice status.
 * Requirements: 2.5, 5.1, 5.2
 */

/**
 * Product category types from Fake Store API
 */
export type ProductCategory = 'electronics' | 'jewelery' | "men's clothing" | "women's clothing";

/**
 * Product tag types for trending/bestseller indicators
 */
export type ProductTag = 'HOT' | 'BESTSELLER' | null;

/**
 * Product data structure from Fake Store API
 * Requirement 2.5: Product data parsing with all required fields
 */
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: ProductCategory;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

/**
 * Determine product tag based on rating and review count
 * - BESTSELLER: 4.5+ rating with 200+ reviews
 * - HOT: 4.0+ rating with 150+ reviews
 * - null: Below thresholds
 */
export function getProductTag(product: Product): ProductTag {
  const { rate, count } = product.rating;
  
  if (rate >= 4.5 && count >= 200) {
    return 'BESTSELLER';
  } else if (rate >= 4.0 && count >= 150) {
    return 'HOT';
  }
  
  return null;
}

/**
 * Shopping cart item with product and quantity
 * Requirement 5.1: Cart item structure for managing products
 */
export interface CartItem {
  product: Product;
  quantity: number;
}

/**
 * Shopping cart state
 * Requirement 5.2: Cart state with items and calculated subtotal
 */
export interface CartState {
  items: CartItem[];
  subtotal: number;
}

/**
 * Voice session status types
 * Requirement 1.2: Voice status indicator states
 */
export type VoiceStatus = 'idle' | 'connecting' | 'listening' | 'speaking' | 'error';

/**
 * Swipe direction for product navigation
 * Requirement 4.1, 4.2: Swipe-based navigation
 */
export type SwipeDirection = 'left' | 'right';

/**
 * Voice session state
 * Requirement 1.1, 1.3: Voice session management
 */
export interface VoiceSessionState {
  status: VoiceStatus;
  isConnected: boolean;
  isMicMuted: boolean;
  error: string | null;
}

/**
 * Application state structure
 */
export interface AppState {
  // Products
  products: Product[];
  filteredProducts: Product[];
  currentProductIndex: number;
  activeCategory: ProductCategory | 'all';
  isLoadingProducts: boolean;
  productError: string | null;
  
  // Cart
  cart: CartState;
  
  // Voice
  voiceSession: VoiceSessionState;
}

/**
 * Persisted cart structure for localStorage
 * Requirement 6.5: Cart persistence
 */
export interface PersistedCart {
  items: Array<{
    productId: number;
    quantity: number;
  }>;
  lastUpdated: string; // ISO timestamp
}

/**
 * Client tool parameter types for voice commands
 */

export interface UpdateCartParams {
  action: 'add' | 'remove' | 'clear' | 'update';
  productId?: number;
  quantity?: number;
}

export interface NavigateProductParams {
  direction: 'next' | 'previous';
}

export interface FilterCategoryParams {
  category: ProductCategory | 'all';
}

export interface SpeakProductParams {
  productId: number;
}

/**
 * Custom event types for client tool communication
 */

export interface CartUpdateEvent extends CustomEvent {
  detail: {
    action: 'add' | 'remove' | 'clear' | 'update';
    productId?: number;
    quantity?: number;
  };
}

export interface ProductNavigateEvent extends CustomEvent {
  detail: {
    direction: 'next' | 'previous';
  };
}

export interface CategoryFilterEvent extends CustomEvent {
  detail: {
    category: ProductCategory | 'all';
  };
}

export interface ReadProductEvent extends CustomEvent {
  detail: {
    productId: number;
  };
}
