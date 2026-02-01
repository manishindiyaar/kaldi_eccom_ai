/**
 * Product navigation utility functions for Jarvis Shopping Assistant
 * 
 * This file contains utility functions for navigating through products,
 * handling boundary conditions with wrapping behavior.
 * 
 * Requirements: 3.2, 3.3, 4.1, 4.2, 4.5, 4.6
 */

/**
 * Navigation boundary behavior options
 */
export type BoundaryBehavior = 'wrap' | 'clamp';

/**
 * Navigate to the next product in the list
 * 
 * Requirement 3.2: Navigate to next product
 * Requirement 4.1: Swipe left navigates to next product
 * Requirement 4.5: Handle last product boundary
 * 
 * @param currentIndex - Current product index
 * @param totalProducts - Total number of products in the list
 * @param behavior - Boundary behavior: 'wrap' (loop to start) or 'clamp' (stay at end)
 * @returns Next product index
 */
export function navigateNext(
  currentIndex: number,
  totalProducts: number,
  behavior: BoundaryBehavior = 'wrap'
): number {
  // Handle edge cases
  if (totalProducts <= 0) {
    return 0;
  }

  // Ensure currentIndex is within valid range
  if (currentIndex < 0) {
    return 0;
  }

  if (currentIndex >= totalProducts) {
    return totalProducts - 1;
  }

  // Check if we're at the last product
  if (currentIndex === totalProducts - 1) {
    // Apply boundary behavior
    return behavior === 'wrap' ? 0 : currentIndex;
  }

  // Move to next product
  return currentIndex + 1;
}

/**
 * Navigate to the previous product in the list
 * 
 * Requirement 3.3: Navigate to previous product
 * Requirement 4.2: Swipe right navigates to previous product
 * Requirement 4.6: Handle first product boundary
 * 
 * @param currentIndex - Current product index
 * @param totalProducts - Total number of products in the list
 * @param behavior - Boundary behavior: 'wrap' (loop to end) or 'clamp' (stay at start)
 * @returns Previous product index
 */
export function navigatePrevious(
  currentIndex: number,
  totalProducts: number,
  behavior: BoundaryBehavior = 'wrap'
): number {
  // Handle edge cases
  if (totalProducts <= 0) {
    return 0;
  }

  // Ensure currentIndex is within valid range
  if (currentIndex < 0) {
    return 0;
  }

  if (currentIndex >= totalProducts) {
    return totalProducts - 1;
  }

  // Check if we're at the first product
  if (currentIndex === 0) {
    // Apply boundary behavior
    return behavior === 'wrap' ? totalProducts - 1 : currentIndex;
  }

  // Move to previous product
  return currentIndex - 1;
}

/**
 * Navigate to a specific index with bounds checking
 * 
 * @param targetIndex - Target product index
 * @param totalProducts - Total number of products in the list
 * @returns Valid product index (clamped to valid range)
 */
export function navigateToIndex(
  targetIndex: number,
  totalProducts: number
): number {
  // Handle edge cases
  if (totalProducts <= 0) {
    return 0;
  }

  // Clamp to valid range
  if (targetIndex < 0) {
    return 0;
  }

  if (targetIndex >= totalProducts) {
    return totalProducts - 1;
  }

  return targetIndex;
}

/**
 * Check if navigation to next is possible (for clamp behavior)
 * 
 * @param currentIndex - Current product index
 * @param totalProducts - Total number of products in the list
 * @returns True if can navigate to next product
 */
export function canNavigateNext(
  currentIndex: number,
  totalProducts: number
): boolean {
  if (totalProducts <= 0) {
    return false;
  }

  return currentIndex < totalProducts - 1;
}

/**
 * Check if navigation to previous is possible (for clamp behavior)
 * 
 * @param currentIndex - Current product index
 * @returns True if can navigate to previous product
 */
export function canNavigatePrevious(currentIndex: number): boolean {
  return currentIndex > 0;
}

/**
 * Get the relative position in the product list
 * Useful for UI indicators (e.g., "3 of 10")
 * 
 * @param currentIndex - Current product index
 * @param totalProducts - Total number of products in the list
 * @returns Object with position information
 */
export function getNavigationPosition(
  currentIndex: number,
  totalProducts: number
): {
  current: number; // 1-based position for display
  total: number;
  isFirst: boolean;
  isLast: boolean;
  progress: number; // 0-1 percentage through list
} {
  if (totalProducts <= 0) {
    return {
      current: 0,
      total: 0,
      isFirst: true,
      isLast: true,
      progress: 0,
    };
  }

  const validIndex = navigateToIndex(currentIndex, totalProducts);

  return {
    current: validIndex + 1, // Convert to 1-based for display
    total: totalProducts,
    isFirst: validIndex === 0,
    isLast: validIndex === totalProducts - 1,
    progress: totalProducts > 1 ? validIndex / (totalProducts - 1) : 0,
  };
}
