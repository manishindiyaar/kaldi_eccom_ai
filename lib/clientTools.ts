/**
 * Ultravox Client Tools for Jarvis Shopping Assistant
 * 
 * This file defines client-side tools that enable voice-controlled UI interactions.
 * Each tool dispatches custom events that UI components listen for to update state.
 * 
 * Requirements: 3.1, 3.2, 3.3, 5.1, 5.2, 5.3, 5.5
 */

import {
  SelectedTool,
  ParameterLocation,
} from './ultravox-types';
import { ProductCategory } from './types';

/**
 * Custom event names for client tool communication
 */
export const CLIENT_TOOL_EVENTS = {
  CART_UPDATE: 'jarvis:cart:update',
  PRODUCT_NAVIGATE: 'jarvis:product:navigate',
  CATEGORY_FILTER: 'jarvis:category:filter',
  READ_PRODUCT: 'jarvis:product:read',
  READ_CART: 'jarvis:cart:read',
  CLOSE_PRODUCT: 'jarvis:product:close',
  OPEN_CART: 'jarvis:cart:open',
} as const;

/**
 * Dispatch a custom event for cart updates
 * Requirement 5.1, 5.2, 5.3, 5.5: Voice-controlled cart management
 */
export function dispatchCartUpdate(
  action: 'add' | 'remove' | 'clear' | 'update',
  productId?: number,
  quantity?: number
): void {
  if (typeof window === 'undefined') return;
  
  const event = new CustomEvent(CLIENT_TOOL_EVENTS.CART_UPDATE, {
    detail: { action, productId, quantity },
  });
  window.dispatchEvent(event);
}

/**
 * Dispatch a custom event for product navigation
 * Requirement 3.2, 3.3: Voice-controlled product browsing
 */
export function dispatchProductNavigate(direction: 'next' | 'previous'): void {
  if (typeof window === 'undefined') return;
  
  const event = new CustomEvent(CLIENT_TOOL_EVENTS.PRODUCT_NAVIGATE, {
    detail: { direction },
  });
  window.dispatchEvent(event);
}

/**
 * Dispatch a custom event for category filtering
 * Requirement 3.1: Voice-controlled category filtering
 */
export function dispatchCategoryFilter(category: ProductCategory | 'all'): void {
  if (typeof window === 'undefined') return;
  
  const event = new CustomEvent(CLIENT_TOOL_EVENTS.CATEGORY_FILTER, {
    detail: { category },
  });
  window.dispatchEvent(event);
}

/**
 * Dispatch a custom event to read product details
 * Requirement 3.4: Voice reading of product information
 */
export function dispatchReadProduct(productId: number): void {
  if (typeof window === 'undefined') return;
  
  const event = new CustomEvent(CLIENT_TOOL_EVENTS.READ_PRODUCT, {
    detail: { productId },
  });
  window.dispatchEvent(event);
}

/**
 * Dispatch a custom event to read cart summary
 * Requirement 5.4: Voice reading of cart contents
 */
export function dispatchReadCart(): void {
  if (typeof window === 'undefined') return;
  
  const event = new CustomEvent(CLIENT_TOOL_EVENTS.READ_CART, {
    detail: {},
  });
  window.dispatchEvent(event);
}

/**
 * Dispatch a custom event to close product detail view
 */
export function dispatchCloseProduct(): void {
  if (typeof window === 'undefined') return;
  
  const event = new CustomEvent(CLIENT_TOOL_EVENTS.CLOSE_PRODUCT, {
    detail: {},
  });
  window.dispatchEvent(event);
}

/**
 * Dispatch a custom event to open cart
 */
export function dispatchOpenCart(): void {
  if (typeof window === 'undefined') return;
  
  const event = new CustomEvent(CLIENT_TOOL_EVENTS.OPEN_CART, {
    detail: {},
  });
  window.dispatchEvent(event);
}

/**
 * Update Cart Tool Definition
 * Allows voice commands to add, remove, clear, or update cart items
 * Requirement 5.1, 5.2, 5.3, 5.5
 */
export const updateCartTool: SelectedTool = {
  temporaryTool: {
    modelToolName: 'updateCart',
    description: 'Add, remove, clear, or update items in the shopping cart. Use "add" to add items with optional quantity (default 1), "remove" to remove a specific product, "clear" to empty the entire cart, or "update" to change quantity of an existing item.',
    dynamicParameters: [
      {
        name: 'action',
        location: ParameterLocation.BODY,
        schema: {
          type: 'string',
          enum: ['add', 'remove', 'clear', 'update'],
          description: 'The cart action to perform: add (add item), remove (remove item), clear (empty cart), update (change quantity)',
        },
        required: true,
      },
      {
        name: 'productId',
        location: ParameterLocation.BODY,
        schema: {
          type: 'number',
          description: 'The product ID to act on. Required for add, remove, and update actions. Not used for clear.',
        },
        required: false,
      },
      {
        name: 'quantity',
        location: ParameterLocation.BODY,
        schema: {
          type: 'number',
          description: 'Quantity for add or update actions. Must be a positive integer. Defaults to 1 for add action.',
          minimum: 1,
        },
        required: false,
      },
    ],
    client: {},
  },
};

/**
 * Navigate Product Tool Definition
 * Allows voice commands to navigate between products
 * Requirement 3.2, 3.3
 */
export const navigateProductTool: SelectedTool = {
  temporaryTool: {
    modelToolName: 'navigateProduct',
    description: 'Navigate to the next or previous product in the display. Use "next" to move forward or "previous" to move backward through the product list.',
    dynamicParameters: [
      {
        name: 'direction',
        location: ParameterLocation.BODY,
        schema: {
          type: 'string',
          enum: ['next', 'previous'],
          description: 'Navigation direction: next (forward) or previous (backward)',
        },
        required: true,
      },
    ],
    client: {},
  },
};

/**
 * Filter Category Tool Definition
 * Allows voice commands to filter products by category
 * Requirement 3.1
 */
export const filterCategoryTool: SelectedTool = {
  temporaryTool: {
    modelToolName: 'filterCategory',
    description: 'Filter products by category or show all products. Available categories: electronics, jewelery, men\'s clothing, women\'s clothing. Use "all" to show all products without filtering.',
    dynamicParameters: [
      {
        name: 'category',
        location: ParameterLocation.BODY,
        schema: {
          type: 'string',
          enum: ['electronics', 'jewelery', "men's clothing", "women's clothing", 'all'],
          description: 'Category to filter by, or "all" to show all products',
        },
        required: true,
      },
    ],
    client: {},
  },
};

/**
 * Read Product Details Tool Definition
 * Allows voice assistant to read the current product's details aloud
 * Requirement 3.4
 */
export const readProductDetailsTool: SelectedTool = {
  temporaryTool: {
    modelToolName: 'readProductDetails',
    description: 'Read the currently displayed product\'s title, price, and description aloud. Use this when the user asks "tell me about this product" or similar queries.',
    dynamicParameters: [],
    client: {},
  },
};

/**
 * Read Cart Summary Tool Definition
 * Allows voice assistant to read the shopping cart contents and total aloud
 * Requirement 5.4
 */
export const readCartSummaryTool: SelectedTool = {
  temporaryTool: {
    modelToolName: 'readCartSummary',
    description: 'Read the shopping cart contents and total price aloud. Use this when the user asks "what\'s in my cart", "show my cart", or similar queries. Returns a summary of all items with quantities and the total price.',
    dynamicParameters: [],
    client: {},
  },
};

/**
 * Close Product Detail Tool Definition
 * Allows voice assistant to close the product detail view
 */
export const closeProductTool: SelectedTool = {
  temporaryTool: {
    modelToolName: 'closeProduct',
    description: 'Close the currently open product detail card/modal. Use this when the user says "close this", "go back", "exit", or wants to return to the product grid.',
    dynamicParameters: [],
    client: {},
  },
};

/**
 * Open Cart Tool Definition
 * Allows voice assistant to open the shopping cart view
 */
export const openCartTool: SelectedTool = {
  temporaryTool: {
    modelToolName: 'openCart',
    description: 'Open the shopping cart overlay to show cart contents. Use this when the user says "open cart", "show cart", "checkout", or wants to review their cart.',
    dynamicParameters: [],
    client: {},
  },
};

/**
 * All client tools array for easy registration with Ultravox
 * Export this array to include all tools in the voice session configuration
 */
export const allClientTools: SelectedTool[] = [
  updateCartTool,
  navigateProductTool,
  filterCategoryTool,
  readProductDetailsTool,
  readCartSummaryTool,
  closeProductTool,
  openCartTool,
];

/**
 * Client tool implementations for Ultravox
 */

/**
 * Update Cart Tool Implementation
 * Handles voice commands to add, remove, clear, or update cart items
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateCartToolImplementation = (parameters: any) => {
  const { action, productId, quantity } = parameters;
  console.log('[updateCart] Tool called with:', { action, productId, quantity });
  
  dispatchCartUpdate(action, productId, quantity);
  
  return `Cart ${action} action completed successfully`;
};

/**
 * Navigate Product Tool Implementation
 * Handles voice commands to navigate between products
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const navigateProductToolImplementation = (parameters: any) => {
  const { direction } = parameters;
  console.log('[navigateProduct] Tool called with:', { direction });
  
  dispatchProductNavigate(direction);
  
  return `Navigated to ${direction} product`;
};

/**
 * Filter Category Tool Implementation
 * Handles voice commands to filter products by category
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const filterCategoryToolImplementation = (parameters: any) => {
  const { category } = parameters;
  console.log('[filterCategory] Tool called with:', { category });
  
  dispatchCategoryFilter(category);
  
  return `Filtered to ${category === 'all' ? 'all products' : category}`;
};

/**
 * Read Product Details Tool Implementation
 * Handles voice commands to read current product details
 */
export const readProductDetailsToolImplementation = () => {
  console.log('[readProductDetails] Tool called');
  
  dispatchReadProduct(0); // 0 indicates "current product"
  
  return 'Reading product details';
};

/**
 * Read Cart Summary Tool Implementation
 * Handles voice commands to read cart contents
 */
export const readCartSummaryToolImplementation = () => {
  console.log('[readCartSummary] Tool called');
  
  dispatchReadCart();
  
  return 'Reading cart summary';
};

/**
 * Close Product Tool Implementation
 * Handles voice commands to close product detail view
 */
export const closeProductToolImplementation = () => {
  console.log('[closeProduct] Tool called');
  
  dispatchCloseProduct();
  
  return 'Closed product detail view';
};

/**
 * Open Cart Tool Implementation
 * Handles voice commands to open cart
 */
export const openCartToolImplementation = () => {
  console.log('[openCart] Tool called');
  
  dispatchOpenCart();
  
  return 'Opened shopping cart';
};
