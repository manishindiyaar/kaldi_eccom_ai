/**
 * CategoryFilter Component
 * 
 * Displays category buttons for filtering products by category.
 * Shows active category state and dispatches filter events.
 * 
 * Requirements:
 * - 9.1: Support filtering by electronics, jewelery, men's clothing, women's clothing
 * - 9.3: Display category buttons for touch-based category selection
 * - 9.4: Visually indicate the current category
 */

'use client';

import { useState, useEffect } from 'react';
import { ProductCategory } from '@/lib/types';
import { dispatchCategoryFilter, CLIENT_TOOL_EVENTS } from '@/lib/clientTools';

interface CategoryFilterProps {
  /** Current active category */
  activeCategory?: ProductCategory | 'all';
  /** Callback when category changes */
  onCategoryChange?: (category: ProductCategory | 'all') => void;
  /** Custom class name for styling */
  className?: string;
}

/**
 * Category configuration with display names and icons
 */
const CATEGORIES = [
  { value: 'all' as const, label: 'All Products', emoji: '🛍️' },
  { value: 'electronics' as const, label: 'Electronics', emoji: '💻' },
  { value: 'jewelery' as const, label: 'Jewelry', emoji: '💎' },
  { value: "men's clothing" as const, label: "Men's Clothing", emoji: '👔' },
  { value: "women's clothing" as const, label: "Women's Clothing", emoji: '👗' },
] as const;

/**
 * CategoryFilter Component
 * 
 * A horizontal list of category buttons that allows users to filter products
 * by category. Displays the active category with visual highlighting and
 * dispatches filter events for voice integration.
 */
export default function CategoryFilter({
  activeCategory = 'all',
  onCategoryChange,
  className = '',
}: CategoryFilterProps) {
  const [localActiveCategory, setLocalActiveCategory] = useState<ProductCategory | 'all'>(activeCategory);

  // Sync local state with prop
  useEffect(() => {
    setLocalActiveCategory(activeCategory);
  }, [activeCategory]);

  /**
   * Handle category button click
   * Requirement 9.3: Touch-based category selection
   */
  const handleCategoryClick = (category: ProductCategory | 'all') => {
    // Update local state
    setLocalActiveCategory(category);
    
    // Notify parent component
    onCategoryChange?.(category);
    
    // Dispatch event for voice integration
    // Requirement 9.1: Filter by category
    dispatchCategoryFilter(category);
  };

  /**
   * Listen for category filter events from voice commands
   */
  useEffect(() => {
    const handleCategoryFilterEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { category } = customEvent.detail;
      
      if (category) {
        setLocalActiveCategory(category);
        onCategoryChange?.(category);
      }
    };

    window.addEventListener(CLIENT_TOOL_EVENTS.CATEGORY_FILTER, handleCategoryFilterEvent);

    return () => {
      window.removeEventListener(CLIENT_TOOL_EVENTS.CATEGORY_FILTER, handleCategoryFilterEvent);
    };
  }, [onCategoryChange]);

  /**
   * Get button styles based on active state
   * Requirement 9.4: Visually indicate current category
   */
  const getButtonStyles = (category: ProductCategory | 'all') => {
    const isActive = localActiveCategory === category;
    
    const baseStyles = 'flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--background)] whitespace-nowrap';
    
    if (isActive) {
      return `${baseStyles} bg-[var(--primary)] text-white border-2 border-[var(--primary-light)] shadow-lg shadow-[var(--primary)]/20 focus:ring-[var(--primary-light)]`;
    }
    
    return `${baseStyles} bg-[var(--card-bg)] text-[var(--foreground)] border-2 border-[var(--card-border)] hover:border-[var(--primary)] hover:bg-[var(--card-bg-hover)] focus:ring-[var(--primary)]`;
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Category buttons container */}
      <div className="flex flex-wrap gap-3 justify-center items-center">
        {CATEGORIES.map((category) => (
          <button
            key={category.value}
            onClick={() => handleCategoryClick(category.value)}
            className={getButtonStyles(category.value)}
            aria-label={`Filter by ${category.label}`}
            aria-pressed={localActiveCategory === category.value}
          >
            <span className="text-lg" role="img" aria-hidden="true">
              {category.emoji}
            </span>
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Active category indicator */}
      <div className="mt-4 text-center">
        <p className="text-sm text-[var(--foreground-muted)]">
          {localActiveCategory === 'all' ? (
            'Showing all products'
          ) : (
            <>
              Filtered by:{' '}
              <span className="text-[var(--primary)] font-semibold capitalize">
                {localActiveCategory}
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
